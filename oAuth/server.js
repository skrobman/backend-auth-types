import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import indexRoutes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/', indexRoutes);

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})