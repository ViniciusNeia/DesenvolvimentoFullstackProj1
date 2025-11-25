import { connect } from "../config/mongo.js";
import { ObjectId } from "mongodb";

const PET_COLLECTION = "pets";

// CREATE
export async function createPet(ownerUid, petData) {
    const db = await connect();
    const result = await db.collection(PET_COLLECTION).insertOne({
        ownerUid,
        ...petData,
        createdAt: new Date(),
    });

    return { id: result.insertedId };
}

// READ: pets do dono
export async function getPetsByOwner(ownerUid) {
    const db = await connect();

    const pets = await db
        .collection(PET_COLLECTION)
        .find({ ownerUid })
        .sort({ createdAt: -1 })
        .toArray();

    return pets.map((p) => ({
        id: p._id,
        ...p
    }));
}

// READ: todos os pets
export async function getAllPets() {
    const db = await connect();

    const pets = await db
        .collection(PET_COLLECTION)
        .find()
        .sort({ createdAt: -1 })
        .toArray();

    return pets.map((p) => ({
        id: p._id,
        ...p
    }));
}

// UPDATE
export async function updatePet(petId, updates) {
    const db = await connect();

    await db.collection(PET_COLLECTION).updateOne(
        { _id: new ObjectId(petId) },
        {
            $set: {
                ...updates,
                updatedAt: new Date(),
            }
        }
    );

    const updated = await db
        .collection(PET_COLLECTION)
        .findOne({ _id: new ObjectId(petId) });

    return {
        id: updated._id,
        ...updated
    };
}

// DELETE
export async function deletePet(petId) {
    const db = await connect();

    await db.collection(PET_COLLECTION).deleteOne({
        _id: new ObjectId(petId)
    });

    return true;
}


