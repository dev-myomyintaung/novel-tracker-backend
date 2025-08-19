import {prisma} from "../models/prisma-client";
import {BadRequest, Forbidden, NotFound} from "http-errors";
import {ReadingStatus} from "@prisma/client";

export interface CreateNovelInput {
  title: string;
  status: ReadingStatus;

  userId?: number;
  author?: string | null;
  sourceUrl?: string | null;
  coverImageUrl?: string | null;
  currentChapter?: number;
  totalChapters?: number | null;
  rating?: number | null;

  genreIds?: number[];
  tagIds?: number[];
}

export const getNovels = async (userId?: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new BadRequest("User not found");

  return prisma.novel.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      notes: true,
      tags: { include: { tag: true } },
      genres: { include: { genre: true } },
    },
  });
};

export const getNovelById = async (id: number) => {
  const novel = await prisma.novel.findUnique({
    where: { id },
    include: {
      notes: true,
      tags: { include: { tag: true } },
      genres: { include: { genre: true } },
    },
  });
  return {
    ...novel,
    genres: novel?.genres.map((genre) => genre.genre),
  };
};

export const createNovel = async (data: CreateNovelInput) => {
  return prisma.novel.create({
    data: {
      author: data.author,
      coverImageUrl: data.coverImageUrl,
      currentChapter: data.currentChapter,
      sourceUrl: data.sourceUrl,
      status: data.status,
      totalChapters: data.totalChapters,
      title: data.title,
      rating: {
        create: {
          score: data.rating,
          user: {
            connect: {
              id: data.userId,
            },
          }
        }
      },
      user: {
        connect: {
          id: data.userId,
        },
      },
      genres: data.genreIds?.length
        ? {
            create: data.genreIds.map((id) => ({
              genre: { connect: { id } },
            })),
          }
        : undefined,
      tags: {
        create: data.tagIds?.length
          ? data.tagIds.map((id) => ({
              tag: { connect: { id } },
            }))
          : undefined,
      },
    },
  });
};

export const updateNovel = async (
  id: number,
  data: Partial<CreateNovelInput>
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!user) throw new BadRequest("User not found");

  const novel = await prisma.novel.findUnique({
    where: {
      id,
    },
  });

  if (!novel) throw new NotFound("Novel not found");

  if (novel.userId !== data.userId)
    throw new Forbidden("You are not allowed to update this novel.");

  return prisma.novel.update({
    where: {
      id,
      user: {
        id: data.userId,
      },
    },
    data: {
      author: data.author,
      coverImageUrl: data.coverImageUrl,
      currentChapter: data.currentChapter,
      rating: {
        update: {
          data: {
            score: data.rating,
          },
          where: {
            userId_novelId: {
              novelId: id,
              userId: data.userId,
            }
          }
        },
        create: {
          score: data.rating,
          user: {
            connect: {
              id: data.userId,
            },
          }
        }
      },
      sourceUrl: data.sourceUrl,
      status: data.status,
      totalChapters: data.totalChapters,
      title: data.title,
      genres: {
        deleteMany: {},
        create: data.genreIds?.length
          ? data.genreIds.map((id) => ({
              genre: { connect: { id } },
            }))
          : undefined,
      },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
        omit: {
          novelId: true,
          genreId: true,
          id: true,
        },
      },
    },
  });
};

export const deleteNovel = (id: number) => {
  return prisma.novel.delete({ where: { id } });
};
