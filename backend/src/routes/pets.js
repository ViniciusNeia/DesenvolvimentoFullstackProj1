import express from "express";
import { body, validationResult } from "express-validator";
import { admin } from "../config/firebase.js";
import { createPet, getPetsByOwner } from "../models/petModel.js";

const router = express.Router();

export async function verifySessionCookie(req, res, next) {
    try {
        const sessionCookie = req.cookies?.session;
        if (!sessionCookie) return res.status(401).json({ error: "Não autenticado" });

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (err) {
        console.error("verifySessionCookie erro:", err);
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }
}

router.post(
    "/",
    verifySessionCookie,
    body("name").isString().notEmpty(),
    body("breed").optional().isString(),
    body("age").optional().isNumeric(),
    body("description").optional().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const ownerUid = req.user.uid;
        const { name, breed, age, description } = req.body;

        try {
            const result = await createPet(ownerUid, { name, breed, age, description });
            return res.status(201).json({ id: result.id });
        } catch (err) {
            console.error("Erro ao salvar pet:", err);
            return res.status(500).json({ error: "Erro ao salvar pet" });
        }
    }
);

router.get("/", verifySessionCookie, async (req, res) => {
    try {
        const pets = await getPetsByOwner(req.user.uid);
        return res.json(pets);
    } catch (err) {
        console.error("Erro listar pets:", err);
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

export default router;
