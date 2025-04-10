const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());

const mockUser = {name: 'admin', password: '1234'};

app.post('/login', (req, res) => {
    const { name, password } = req.body;

    if(name === mockUser.name && password === mockUser.password) {
        res.cookie('auth', 'some-session-token', {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });
        return res.status(200).json({msg: 'Authentication successfully'});
    }

    res.status(401).json({msg: 'Authentication failed'});
});

app.get('/dashboard', (req, res) => {
    const token = req.cookies.auth;
    console.log(token);

    if(token === 'some-session-token') {
        return res.status(200).json({msg: `Welcome ${mockUser.name}`});
    }
    res.status(401).json({msg: 'Authenticate first'});
});

app.post('/logout', (req, res) => {
    res.clearCookie('auth');
    res.status(200).json({msg: 'Logged out'});
});

app.listen(PORT, () => console.log('Server running on port 8080'));