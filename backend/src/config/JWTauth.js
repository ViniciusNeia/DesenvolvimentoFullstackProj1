import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.redirect('/login')
    }
}

export { verifyToken };
