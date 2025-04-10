import express from 'express';
import crypto from 'crypto';
import { promisify } from 'util';

const app = express();
const scrypt = promisify(crypto.scrypt);

// Временное хранилище пользователей
const users = new Map(); // Используем Map для лучшей семантики

// Middleware для парсинга Basic Auth
const parseBasicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('Authorization required');

    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') return res.status(401).send('Invalid auth type');

    try {
        const [email, password] = Buffer.from(credentials, 'base64')
            .toString('utf-8')
            .split(':');
        req.auth = { email, password };
        next();
    } catch (error) {
        res.status(400).send('Invalid credentials format');
    }
};

// Middleware проверки авторизации
const checkAuth = async (req, res, next) => {
    const { email, password } = req.auth;
    const user = users.get(email);

    if (!user) return res.status(401).send('User not found');

    try {
        const hash = await scrypt(password, user.salt, 64);
        hash.toString('hex') === user.hash ? next() : res.status(401).send('Invalid password');
    } catch (error) {
        res.status(500).send('Authentication error');
    }
};

// Регистрация
app.post('/register', express.json(), async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send('Email and password required');
        if (users.has(email)) return res.status(409).send('User already exists');

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = await scrypt(password, salt, 64);

        users.set(email, { salt, hash: hash.toString('hex') });
        res.status(201).send('Registration successful');
    } catch (error) {
        res.status(500).send('Registration failed');
    }
});

// Защищенный роут
app.get('/protected', parseBasicAuth, checkAuth, (req, res) => {
    res.send(`Hello ${req.auth.email}!`);
});

app.listen(3000, () => console.log('Server running on port 3000'));