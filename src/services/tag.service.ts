import { prisma } from "../models/prisma-client";
import { Conflict, NotFound } from "http-errors";

export const getTags = async ({ userId }: { userId?: number }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new NotFound("User not found");

  return prisma.tag.findMany({
    where: {
      createdByUser: {
        id: userId,
      },
    },
  });
};

export const getTagById = async ({
  tagId,
  userId,
}: {
  tagId: number;
  userId?: number;
}) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId, createdByUser: { id: userId } },
  });
  if (!tag) throw new NotFound("Tag not found");
  return tag;
};

export const createTag = async ({
  tagName,
  userId,
}: {
  userId?: number;
  tagName: string;
}) => {
  const existing = await prisma.tag.findUnique({
    where: { tagName, createdByUser: { id: userId } },
  });
  if (existing) throw new Conflict("Tag already exists");
  return prisma.tag.create({
    data: { tagName, createdByUser: { connect: { id: userId } } },
  });
};

export const updateTag = async ({
  tagName,
  tagId,
  userId,
}: {
  userId?: number;
  tagId: number;
  tagName?: string;
}) => {
  const existing = await prisma.tag.findUnique({
    where: { id: tagId, createdByUser: { id: userId } },
  });
  if (!existing) throw new NotFound("Tag not found");
  return prisma.tag.update({
    where: { id: tagId, createdByUser: { id: userId } },
    data: { tagName },
  });
};

export const deleteTag = async ({
  userId,
  tagId,
}: {
  tagId: number;
  userId?: number;
}) => {
  const existing = await prisma.tag.findUnique({
    where: { id: tagId, createdByUser: { id: userId } },
  });
  if (!existing) throw new NotFound("Tag not found");

  return prisma.tag.delete({
    where: { id: tagId, createdByUser: { id: userId } },
  });
};
