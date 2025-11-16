import express from "express";
import { body, validationResult } from "express-validator";
import { admin } from "../config/firebase.js";
import { createPet, getPetsByOwner } from "../models/petModel.js";
import { updatePet, deletePet } from "../models/petModel.js";

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
    body("species").optional().isIn(["dog","cat"]),
    body("age").optional().isNumeric(),
    body("description").optional().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const ownerUid = req.user.uid;
        const { name, breed, age, description, species } = req.body;

        try {
            const result = await createPet(ownerUid, { name, breed, age, description, species });
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
        const msg = err?.message || "Erro ao listar pets";
        if (msg.includes('index') || msg.includes('requires an index')) {
            return res.status(400).json({ error: msg });
        }
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

router.put(
    "/:id",
    verifySessionCookie,
    async (req, res) => {
        const petId = req.params.id;
        const ownerUid = req.user.uid;
        const updates = req.body || {};
        try {

            const doc = await admin.firestore().collection('pets').doc(petId).get();
            if (!doc.exists) return res.status(404).json({ error: 'Pet não encontrado' });
            const data = doc.data();
            if (data.ownerUid !== ownerUid) return res.status(403).json({ error: 'Não autorizado' });

            const updated = await updatePet(petId, updates);
            return res.json(updated);
        } catch (err) {
            console.error('Erro atualizar pet:', err);
            return res.status(500).json({ error: 'Erro ao atualizar pet' });
        }
    }
);

router.delete('/:id', verifySessionCookie, async (req, res) => {
    const petId = req.params.id;
    const ownerUid = req.user.uid;
    try {
        const doc = await admin.firestore().collection('pets').doc(petId).get();
        if (!doc.exists) return res.status(404).json({ error: 'Pet não encontrado' });
        const data = doc.data();
        if (data.ownerUid !== ownerUid) return res.status(403).json({ error: 'Não autorizado' });

        await deletePet(petId);
        return res.json({ success: true });
    } catch (err) {
        console.error('Erro deletar pet:', err);
        return res.status(500).json({ error: 'Erro ao deletar pet' });
    }
});

export default router;
