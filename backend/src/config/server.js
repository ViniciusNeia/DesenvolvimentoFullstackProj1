import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

import authRoutes from "../routes/auth.js";
import petsRoutes from "../routes/pets.js";
import { sanitizeMongoData } from "./sanitizers.js";
import { generalLimiter } from "./rateLimiter.js";

dotenv.config();

const app = express();

app.use(helmet());

app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(sanitizeMongoData);

app.use(generalLimiter);

app.get("/test", (req, res) => {
    res.send("Server funcionando!");
});

app.use("/auth", authRoutes);
app.use("/pets", petsRoutes);

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()} - Erro não tratado:`, err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
