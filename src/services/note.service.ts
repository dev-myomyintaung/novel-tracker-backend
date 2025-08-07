import {prisma} from "../models/prisma-client";
import {Forbidden, NotFound} from "http-errors";

export const getNotesByNovel = (novelId: number) => {
  return prisma.note.findMany({ where: { novelId }, orderBy: {
    id: 'desc'
    } });
};

export const getNoteById = async (id?: number) => {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new NotFound("Note not found");
  return note;
};

export const getNovelNoteByNoteId = async ({
  novelId,
  noteId,
  userId,
}: {
  novelId?: number;
  noteId?: number;
  userId?: number;
}) => {
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      novel: {
        id: novelId,
        userId: userId,
      },
    },
  });

  if (!note) throw new NotFound("Note not found");

  return note;
};

export const createNote = async ({
  content,
  novelId,
  userId,
}: {
  content?: string;
  novelId?: number;
  userId?: number;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new NotFound("User not found");

  const novel = await prisma.novel.findUnique({
    where: {
      id: novelId,
    },
  });

  if (!novel) throw new NotFound("Novel not found");

  if (novel.userId !== userId)
    throw new Forbidden("You are not allowed to create a note for this novel.");

  return prisma.note.create({
    data: {
      content,
      novel: {
        connect: {
          id: novelId,
        },
      },
    },
  });
};

export const updateNote = async ({
  novelId,
  content,
  userId,
  noteId,
}: {
  novelId?: number;
  content?: string;
  userId?: number;
  noteId?: number;
}) => {
  await getNoteById(noteId);

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      novel: {
        id: novelId,
        userId: userId,
      },
    },
  });

  if (!note) throw new NotFound("Note not found");

  return prisma.note.update({
    where: { id: noteId },
    data: { content },
  });
};

export const deleteNote = async ({
  noteId,
  novelId,
  userId,
}: {
  novelId?: number;
  noteId?: number;
  userId?: number;
}) => {
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      novel: {
        id: novelId,
        user: {
          id: userId,
        },
      },
    },
  });

  if (!note) throw new NotFound("Note not found");

  return prisma.note.delete({
    where: {
      id: noteId,
      novel: {
        id: novelId,
        user: {
          id: userId,
        },
      },
    },
  });
};
