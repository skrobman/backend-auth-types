import express from 'express';

const router = express.Router();

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('login');
}

router.get('/', ensureAuthenticated, (req, res) => {
    res.json({msg: `Hello ${req.user.displayName}`});
});

router.get('/login', (req, res) => {
    res.json({msg: 'Please authenticate with /auth/google'});
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

export default router;