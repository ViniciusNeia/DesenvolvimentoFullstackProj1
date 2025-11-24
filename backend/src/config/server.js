import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "../routes/auth.js";
import petsRoutes from "../routes/pets.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.send("Server funcionando!");
});

app.use("/auth", authRoutes);
app.use("/pets", petsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
