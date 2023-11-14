

import { prisma_start } from "./db";

const prisma = prisma_start();


export async function getUser(userId: string) {
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        // Add any other necessary fields here
      },
    });
  }

  return user;
}

export async function createBreak(userId: string, username: string) {
  await prisma.break.create({
    data: {
      userId: userId,
      lastUsername: username,
      startTime: new Date(),
    },
  });
}

export async function getLastBreak(userId: string) {
  return await prisma.break.findFirst({
    where: {
      userId: userId,
      endTime: null,
    },
    orderBy: {
      startTime: "desc",
    },
  });
}

export async function endBreak(breakId: number) {
    await prisma.break.update({
      where: { id: breakId },
      data: { endTime: new Date() },
    });
  }