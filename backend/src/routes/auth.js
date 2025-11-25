import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connect } from "../config/mongo.js";
import { registerValidators, loginValidators } from "../config/sanitizers.js";
import {authLimiter} from "../config/rateLimiter.js";
import { logSecurityEvent, logActivity } from "../config/logger.js";

const router = express.Router();

const USERS_COLLECTION = "users";
const SESSION_EXPIRES_IN = +process.env.SESSION_EXPIRES_IN || 7 * 24 * 60 * 60 * 1000;

router.post(
    "/register",
    authLimiter,
    registerValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logSecurityEvent('validation_error', 'Erro de validação no registro', req);
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, displayName } = req.body;

        try {
            const db = await connect();

            const existing = await db.collection(USERS_COLLECTION).findOne({ email });
            if (existing) {
                logSecurityEvent('register_duplicate', `Tentativa de registro com email existente: ${email}`, req);
                return res.status(400).json({ error: "Email já registrado" });
            }

            const hashed = await bcrypt.hash(password, 10);

            const result = await db.collection(USERS_COLLECTION).insertOne({
                email,
                password: hashed,
                displayName: displayName || email.split('@')[0],
                createdAt: new Date()
            });

            logActivity('user_registered', { email, userId: result.insertedId }, req);

            return res.status(201).json({
                uid: result.insertedId,
                email
            });
        } catch (err) {
            console.error('Erro no registro:', err);
            logSecurityEvent('register_error', `Erro no registro: ${err.message}`, req);
            return res.status(500).json({ error: "Erro ao registrar usuário" });
        }
    }
);

router.post(
    "/login",
    authLimiter,
    loginValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logSecurityEvent('validation_error', 'Erro de validação no login', req);
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const db = await connect();

            const user = await db.collection(USERS_COLLECTION).findOne({ email });
            if (!user) {
                logSecurityEvent('login_failure', `Tentativa de login com email inexistente: ${email}`, req);
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                logSecurityEvent('login_failure', `Senha incorreta para: ${email}`, req);
                return res.status(401).json({ error: "Credenciais inválidas" });
            }

            const token = jwt.sign(
                {
                    uid: user._id.toString(),
                    email: user.email,
                    name: user.displayName
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("session", token, {
                maxAge: SESSION_EXPIRES_IN,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            logActivity('user_login', { email, userId: user._id }, req);

            return res.json({
                message: "Login realizado com sucesso",
                token
            });
        } catch (err) {
            console.error('Erro no login:', err);
            logSecurityEvent('login_error', `Erro no login: ${err.message}`, req);
            return res.status(500).json({ error: "Erro ao realizar login" });
        }
    }
);

router.post("/logout", (req, res) => {
    logActivity('user_logout', { email: req.user?.email }, req);
    res.clearCookie("session");
    res.json({ message: "Sessão encerrada" });
});

router.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.session;
        if (!token) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name
        });
    } catch (err) {
        logSecurityEvent('token_invalid', `Token inválido: ${err.message}`, req);
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }
});

export default router;
