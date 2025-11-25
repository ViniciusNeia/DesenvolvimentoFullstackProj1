import express from "express";
import { validationResult } from "express-validator";
import {
    createPet,
    getPetsByOwner,
    getAllPets,
    updatePet,
    deletePet
} from "../models/petModel.js";
import { connect } from "../config/mongo.js";
import { ObjectId } from "mongodb";
import { verifyToken } from "../config/JWTauth.js";
import { petValidators } from "../config/sanitizers.js";
import { logActivity } from "../config/logger.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    petValidators,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ownerUid = req.user.uid;
        const { name, breed, age, description, species } = req.body;

        try {
            const result = await createPet(ownerUid, {
                name,
                breed,
                age: age ? parseInt(age) : undefined,
                description,
                species,
            });

            logActivity('pet_created', {
                petId: result.id,
                petName: name,
                ownerId: ownerUid
            }, req);

            return res.status(201).json({
                id: result.id,
                message: "Pet criado com sucesso"
            });
        } catch (err) {
            console.error('Erro ao criar pet:', err);
            return res.status(500).json({ error: "Erro ao salvar pet" });
        }
    }
);

router.get("/", verifyToken, async (req, res) => {
    try {
        const pets = await getPetsByOwner(req.user.uid);

        logActivity('pets_search', {
            ownerId: req.user.uid,
            count: pets.length
        }, req);

        return res.json(pets);
    } catch (err) {
        console.error('Erro ao listar pets:', err);
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

router.get("/all", verifyToken, async (req, res) => {
    try {
        const pets = await getAllPets();

        logActivity('all_pets_search', {
            userId: req.user.uid,
            count: pets.length
        }, req);

        return res.json(pets);
    } catch (err) {
        console.error('Erro ao listar todos os pets:', err);
        return res.status(500).json({ error: "Erro ao listar pets" });
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    const petId = req.params.id;
    const ownerUid = req.user.uid;
    const updates = req.body || {};

    try {
        const db = await connect();
        const doc = await db.collection("pets").findOne({ _id: new ObjectId(petId) });

        if (!doc) {
            return res.status(404).json({ error: "Pet não encontrado" });
        }

        if (doc.ownerUid !== ownerUid) {
            logActivity('unauthorized_update_attempt', {
                petId,
                attemptedBy: ownerUid,
                actualOwner: doc.ownerUid
            }, req);
            return res.status(403).json({ error: "Não autorizado" });
        }

        const updated = await updatePet(petId, updates);

        logActivity('pet_updated', {
            petId,
            ownerId: ownerUid
        }, req);

        return res.json(updated);
    } catch (err) {
        console.error('Erro ao atualizar pet:', err);
        return res.status(500).json({ error: "Erro ao atualizar pet" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const petId = req.params.id;
    const ownerUid = req.user.uid;

    try {
        const db = await connect();
        const doc = await db.collection("pets").findOne({ _id: new ObjectId(petId) });

        if (!doc) {
            return res.status(404).json({ error: "Pet não encontrado" });
        }

        if (doc.ownerUid !== ownerUid) {
            logActivity('unauthorized_delete_attempt', {
                petId,
                attemptedBy: ownerUid,
                actualOwner: doc.ownerUid
            }, req);
            return res.status(403).json({ error: "Não autorizado" });
        }

        await deletePet(petId);

        logActivity('pet_deleted', {
            petId,
            ownerId: ownerUid
        }, req);

        return res.json({ success: true, message: "Pet deletado com sucesso" });
    } catch (err) {
        console.error('Erro ao deletar pet:', err);
        return res.status(500).json({ error: "Erro ao deletar pet" });
    }
});

export default router;