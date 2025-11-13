import { admin, db } from "../config/firebase.js";

const PET_COLLECTION = "pets";

export async function createPet(ownerUid, petData) {
    const docRef = await db.collection(PET_COLLECTION).add({
        ownerUid,
        ...petData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: docRef.id };
}

export async function getPetsByOwner(ownerUid) {
    const snapshot = await db
        .collection(PET_COLLECTION)
        .where("ownerUid", "==", ownerUid)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllPets() {
    const snapshot = await db
        .collection(PET_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
