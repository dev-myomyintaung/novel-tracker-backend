
import { Request, Response, NextFunction } from 'express';
import * as GenreService from '../services/genre.service';

export const getGenres = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await GenreService.getGenres();
        res.json(genres);
    } catch (err) {
        next(err);
    }
};

export const getGenreById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const genre = await GenreService.getGenreById(id);
        res.json(genre);
    } catch (err) {
        next(err);
    }
}

export const createGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { genreName } = req.body;
        const genre = await GenreService.createGenre(genreName);
        res.status(201).json(genre);
    } catch (err) {
        next(err);
    }
};

export const updateGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { genreName } = req.body;
        const genre = await GenreService.updateGenre(id, genreName);
        res.json(genre);
    } catch (err) {
        next(err);
    }
};

export const deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        await GenreService.deleteGenre(id);
        res.json({message: 'Genre deleted'});
    } catch (err) {
        next(err);
    }
};

