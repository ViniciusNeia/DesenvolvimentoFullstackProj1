import express from "express";
import { body, validationResult } from "express-validator";
import fetch from "node-fetch";
import { admin } from "../config/firebase.js";

const router = express.Router();
router.use(express.json());

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const SESSION_EXPIRES_IN =
    +process.env.SESSION_EXPIRES_IN || 7 * 24 * 60 * 60 * 1000; // 7 dias

router.post(
    "/register",
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password, displayName } = req.body;
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName,
            });
            return res
                .status(201)
                .json({ uid: userRecord.uid, email: userRecord.email });
        } catch (err) {
            console.error("Erro ao criar usuário:", err);
            return res.status(400).json({ error: err.message });
        }
    }
);

// Login
router.post(
    "/login",
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        try {
            const resp = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, returnSecureToken: true }),
                }
            );

            const data = await resp.json();
            if (data.error)
                return res.status(401).json({ error: data.error.message });

            const idToken = data.idToken;
            const sessionCookie = await admin
                .auth()
                .createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });

            res.cookie("session", sessionCookie, {
                maxAge: SESSION_EXPIRES_IN,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            return res.json({ message: idToken });
        } catch (err) {
            console.error("Erro login:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
    }
);

router.post("/logout", (req, res) => {
    res.clearCookie("session");
    res.json({ message: "Sessão encerrada" });
});

export default router;
