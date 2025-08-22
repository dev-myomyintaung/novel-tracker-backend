import express, {Request, Response} from "express";
import morgan from "morgan";

import errorHandler from "./middlewares/error-handler";
import AuthRoute from "./routes/auth.route";
import GenreRoute from "./routes/genre.route";
import TagRoute from "./routes/tag.route";
import NoteRoute from "./routes/note.route";
import NovelRoute from "./routes/novel.route";
import UserRoute from "./routes/user.route";
import dotenv from "dotenv";
import authenticateToken from "./middlewares/authenticate-token";
import cors from "cors";
import passport, { registerPassportStrategies } from "./services/passport.service";
import cookieParser from "cookie-parser";
import {prisma} from "./models/prisma-client";

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
registerPassportStrategies();

app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ Server is live');
});
app.get('/health/db', async (req, res) => {
    try {
        await prisma.$connect();
        res.send("✅ DB is reachable");
    } catch (error) {
        console.error("❌ Prisma DB Error:", error);
        res.status(500).json({ error: String(error) });
    }
});
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/genres", authenticateToken, GenreRoute);
app.use("/api/v1/tags", authenticateToken, TagRoute);
app.use("/api/v1/notes", authenticateToken, NoteRoute);
app.use("/api/v1/novels", authenticateToken, NovelRoute);
app.use('/api/v1/user', authenticateToken, UserRoute)
app.use('/api/v1/me', authenticateToken, async (req: Request, res: Response) => {
    const { user } = req;
    res.json(user);
});

app.get('/api/v1/seed', async (req: Request, res: Response) => {
    const genreNames = [
        'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller',
        'Non-Fiction', 'Biography', 'Self-Help', 'Historical', 'Poetry',
        'Graphic Novel', 'Adventure', 'Classics', 'Crime', 'Drama', 'Humor',
        "Children's", 'Young Adult', 'Philosophy', 'Science', 'Technology',
        'Travel', 'Health', 'Business', 'Cooking', 'Art', 'Music', 'Religion',
        'Politics', 'Sports', 'Education', 'Psychology', 'Anthology',
        'Short Stories', 'Essays', 'Memoir', 'Satire', 'Horror Comedy',
        'Western', 'LGBTQ+', 'Urban Fiction', 'Contemporary', 'Dystopian',
        'Steampunk', 'Paranormal', 'Military Fiction', 'Gothic'
    ];
    await prisma.$connect();
    await prisma.genre.createMany({
        data: genreNames.map(name => ({ genreName: name })),
        skipDuplicates: true,
    });
    await prisma.$disconnect()
    res.json({
        message: 'seeded'
    })
})

app.use(errorHandler);

export default app;
