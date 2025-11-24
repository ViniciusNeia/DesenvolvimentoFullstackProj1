import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connect } from "../config/mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();
router.use(express.json());

const USERS_COLLECTION = "users";
const SESSION_EXPIRES_IN = +process.env.SESSION_EXPIRES_IN || 7 * 24 * 60 * 60 * 1000;

router.post(
    "/register",
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password, displayName } = req.body;
        const db = await connect();

        const existing = await db.collection(USERS_COLLECTION).findOne({ email });
        if (existing) return res.status(400).json({ error: "Email já registrado" });

        const hashed = await bcrypt.hash(password, 10);

        const result = await db.collection(USERS_COLLECTION).insertOne({
            email,
            password: hashed,
            displayName,
            createdAt: new Date()
        });

        return res.status(201).json({
            uid: result.insertedId,
            email
        });
    }
);

router.post(
    "/login",
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const db = await connect();

        const user = await db.collection(USERS_COLLECTION).findOne({ email });
        if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Credenciais inválidas" });

        const token = jwt.sign(
            { uid: user._id, email: user.email, name: user.displayName },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("session", token, {
            maxAge: SESSION_EXPIRES_IN,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.json({ message: token });
    }
);

router.post("/logout", (req, res) => {
    res.clearCookie("session");
    res.json({ message: "Sessão encerrada" });
});

router.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.session;
        if (!token) return res.status(401).json({ error: "Não autenticado" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name
        });
    } catch (err) {
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }
});

export default router;
