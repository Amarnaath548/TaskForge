import type { Role } from "../../../generated/prisma/index.js";
import prisma from "../../config/db.js";
import { AppError } from "../../utils/errors.js";

export const createTask = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    assigneeId?: string;
  }
) => {
  if (data.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: { id: data.assigneeId },
    });
    if (!assignee) {
      throw new AppError("Assignee not found", 404);
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      ownerId: userId,
      assigneeId: data.assigneeId ?? null,
    },
  });
};

export const getTasksForUser = async (user: { userId: string; role: Role }) => {
  if (user.role === "ADMIN") {
    return prisma.task.findMany({
      include: {
        owner: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
      },
    });
  }

  return prisma.task.findMany({
    where: {
      OR: [{ ownerId: user.userId }, { assigneeId: user.userId }],
    },
    include: {
      owner: { select: { id: true, email: true } },
      assignee: { select: { id: true, email: true } },
    },
  });
};
