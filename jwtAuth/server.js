import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {sequelize} from "./models/index.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

sequelize.sync()
    .then(()=>{
        console.log('Database Connected!');

        app.listen(port, () => console.log(`Server started on port ${port}`));
    })
    .catch(err => {
        console.error('Database error: ', err);
    })