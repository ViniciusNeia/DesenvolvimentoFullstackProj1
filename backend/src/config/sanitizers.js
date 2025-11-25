import mongoSanitize from 'express-mongo-sanitize';
import { body } from 'express-validator';

export const sanitizeMongoData = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SANITIZE] ${new Date().toISOString()} - Tentativa de NoSQL injection detectada: ${key} - IP: ${req.ip}`);
    }
});

export const registerValidators = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .trim()
        .escape()
        .withMessage('Email inválido'),
    body('password')
        .isLength({ min: 6 })
        .trim()
        .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('displayName')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Nome muito longo')
];

export const loginValidators = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .trim()
        .escape()
        .withMessage('Email inválido'),
    body('password')
        .isString()
        .notEmpty()
        .trim()
        .withMessage('Senha obrigatória')
];

export const petValidators = [
    body('name')
        .isString()
        .notEmpty()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Nome é obrigatório e deve ter no máximo 100 caracteres'),
    body('breed')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage('Raça muito longa'),
    body('species')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 50 })
        .withMessage('Espécie muito longa'),
    body('age')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Idade deve ser um número entre 0 e 100'),
    body('description')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 500 })
        .withMessage('Descrição muito longa')
];

