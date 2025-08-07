import {NextFunction, Request, Response} from "express";
import * as NovelService from "../services/novel.service";

export const getNovels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const novels = await NovelService.getNovels(user?.id);
    res.json(novels);
  } catch (err) {
    next(err);
  }
};

export const getNovelById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const novel = await NovelService.getNovelById(id);
    res.json(novel);
  } catch (err) {
    next(err);
  }
};

export const createNovel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const {
      title,
      author,
      status,
      coverImageUrl,
      currentChapter,
      sourceUrl,
      totalChapters,
      rating,
      genres,
      tags,
    } = req.body;
    const novel = await NovelService.createNovel({
      title,
      author,
      status,
      coverImageUrl,
      currentChapter,
      sourceUrl,
      totalChapters,
      rating,
      genreIds: genres,
      userId: user?.id,
      tagIds: tags,
    });
    res.status(201).json(novel);
  } catch (err) {
    next(err);
  }
};

export const updateNovel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const { user } = req;
    const {
      title,
      author,
      status,
      coverImageUrl,
      currentChapter,
      sourceUrl,
      totalChapters,
      rating,
      genres,
      tags,
    } = req.body;
    const novel = await NovelService.updateNovel(id, {
      title,
      author,
      status,
      coverImageUrl,
      currentChapter,
      sourceUrl,
      totalChapters,
      rating,
      genreIds: genres,
      userId: user?.id,
      tagIds: tags,
    });
    res.json(novel);
  } catch (err) {
    next(err);
  }
};

export const deleteNovel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await NovelService.deleteNovel(id);
    res.json({ message: "Novel deleted" });
  } catch (err) {
    next(err);
  }
};
