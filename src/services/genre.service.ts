
import { prisma } from '../models/prisma-client';
import { Conflict, NotFound } from 'http-errors';

export const getGenres = () => {
    return prisma.genre.findMany();
};

export const getGenreById = async (id: number) => {
    const genre = await prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFound('Genre not found');
    return genre;
};

export const createGenre = async (genreName: string) => {
    const existing = await prisma.genre.findUnique({ where: { genreName } });
    if (existing) throw new Conflict('Genre already exists');
    return prisma.genre.create({ data: { genreName } });
};

export const updateGenre = async (id: number, genreName?: string) => {
    await getGenreById(id);
    return prisma.genre.update({
        where: { id },
        data: { genreName },
    });
};

export const deleteGenre = async (id: number) => {
    await getGenreById(id);
    return prisma.genre.delete({ where: { id } });
};

