import express, {Request, Response} from "express";
import morgan from "morgan";

import errorHandler from "./middlewares/error-handler";
import AuthRoute from "./routes/auth.route";
import GenreRoute from "./routes/genre.route";
import TagRoute from "./routes/tag.route";
import NoteRoute from "./routes/note.route";
import NovelRoute from "./routes/novel.route";
import dotenv from "dotenv";
import authenticateToken from "./middlewares/authenticate-token";
import cors from "cors";
import passport from "./services/passport.service";
import cookieParser from "cookie-parser";
import {prisma} from "./models/prisma-client";
import jwt from "jsonwebtoken";


dotenv.config();

const {FRONTEND_URL} = process.env;

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('✅ Server is live');
});

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/genres", authenticateToken, GenreRoute);
app.use("/api/v1/tags", authenticateToken, TagRoute);
app.use("/api/v1/notes", authenticateToken, NoteRoute);
app.use("/api/v1/novels", authenticateToken, NovelRoute);

// Protected “me” endpoint
app.get('/api/v1/me', async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        res.json(user);
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});


app.use(errorHandler);

export default app;
