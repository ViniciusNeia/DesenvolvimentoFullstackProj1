import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import petsRoutes from "./routes/pets.js";
import { db } from "./config/firebase.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.get("/test", async (req, res) => {
    try {
        const docRef = db.collection("testCollection").doc("hello");
        await docRef.set({ msg: "Firebase conectado com sucesso!" });
        res.send("Firebase Working As Expected!");
    } catch (error) {
        console.error("Erro ao testar Firebase:", error);
        res.status(500).send("Error when connecting to firebase. ");
    }
});

app.use("/auth", authRoutes);
app.use("/pets", petsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
