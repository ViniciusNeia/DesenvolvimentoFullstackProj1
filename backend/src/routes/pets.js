import express from "express";
import { body, validationResult } from "express-validator";
import {
    createPet,
    getPetsByOwner,
    getAllPets,
    updatePet,
    deletePet
} from "../models/petModel.js";
import { connect } from "../config/mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();

export async function verifySessionCookie(req, res, next) {
    try {
        const sessionCookie = req.cookies?.session;
        if (!sessionCookie) return res.status(401).json({ error: "Não autenticado" });

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }
}

router.post(
    "/",
    verifySessionCookie,
    body("name").isString().notEmpty(),
    body("breed").optional().isString(),
    body("species").optional().isString(),
    body("age").optional().isNumeric(),
    body("description").optional().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const ownerUid = req.user.uid;
        const { name, breed, age, description, species } = req.body;

        try {
            const result = await createPet(ownerUid, {
                name,
                breed,
                age,
                description,
                species,
            });

            return res.status(201).json({ id: result.id });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao salvar pet" });
        }
    }
);

router.get("/", verifySessionCookie, async (req, res) => {
    try {
        const pets = await getPetsByOwner(req.user.uid);
        return res.json(pets);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

router.get("/all", async (req, res) => {
    try {
        const pets = await getAllPets();
        return res.json(pets);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

router.put("/:id", verifySessionCookie, async (req, res) => {
    const petId = req.params.id;
    const ownerUid = req.user.uid;
    const updates = req.body || {};

    try {
        const db = await connect();
        const doc = await db.collection("pets").findOne({ _id: new ObjectId(petId) });

        if (!doc) return res.status(404).json({ error: "Pet não encontrado" });
        if (doc.ownerUid !== ownerUid) return res.status(403).json({ error: "Não autorizado" });

        const updated = await updatePet(petId, updates);

        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao atualizar pet" });
    }
});

router.delete("/:id", verifySessionCookie, async (req, res) => {
    const petId = req.params.id;
    const ownerUid = req.user.uid;

    try {
        const db = await connect();
        const doc = await db.collection("pets").findOne({ _id: new ObjectId(petId) });

        if (!doc) return res.status(404).json({ error: "Pet não encontrado" });
        if (doc.ownerUid !== ownerUid) return res.status(403).json({ error: "Não autorizado" });

        await deletePet(petId);

        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: "Erro ao deletar pet" });
    }
});

export default router;
