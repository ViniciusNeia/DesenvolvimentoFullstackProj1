import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.cookies.session;

    if (!token) {
        console.log(`[SECURITY] ${new Date().toISOString()} - auth_failure: Token ausente - IP: ${req.ip}`);
        return res.status(401).json({ error: "Não autenticado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(`[SECURITY] ${new Date().toISOString()} - auth_failure: Token inválido - IP: ${req.ip} - Erro: ${error.message}`);
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }
}

export { verifyToken };
