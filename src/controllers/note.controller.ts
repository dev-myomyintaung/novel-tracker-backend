import { Request, Response, NextFunction } from "express";
import * as NoteService from "../services/note.service";

export const getNotesByNovel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const novelId = Number(req.params.id);

    const notes = await NoteService.getNotesByNovel(novelId);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getNovelNoteByNoteId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { novelId, noteId } = req.params;
    const { user } = req;
    const note = await NoteService.getNovelNoteByNoteId({
      novelId: Number(novelId),
      noteId: Number(noteId),
      userId: user?.id,
    });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const { content, novelId } = req.body;
    const note = await NoteService.createNote({
      content,
      novelId: Number(novelId),
      userId: user?.id,
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { novelId, noteId } = req.params;
    const { content } = req.body;
    const { user } = req;
    const note = await NoteService.updateNote({
      content,
      novelId: Number(novelId),
      userId: user?.id,
      noteId: Number(noteId),
    });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { novelId, noteId } = req.params;
    const { user } = req;
    await NoteService.deleteNote({
      novelId: Number(novelId),
      userId: user?.id,
      noteId: Number(noteId),
    });
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
