import rateLimit from 'express-rate-limit';
import { logSecurityEvent } from './logger.js';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Muitas tentativas de autenticação.' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logSecurityEvent('rate_limit_exceeded', 'Tentativas excessivas de autenticação', req);
        res.status(429).json({
            error: 'Muitas tentativas de autenticação.'
        });
    }
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições.' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logSecurityEvent('rate_limit_exceeded', 'Requisições excessivas', req);
        res.status(429).json({
            error: 'Muitas requisições.'
        });
    }
});

