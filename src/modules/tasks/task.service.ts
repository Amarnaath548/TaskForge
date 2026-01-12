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

export const updateTaskStatus = async (
  taskId: string,
  user: { userId: string; role: string },
  status: "TODO" | "IN_PROGRESS" | "DONE"
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new AppError("Task not found", 404);

  const isAdmin = user.role === "ADMIN";
  const isAssignee = task.assigneeId === user.userId;

  if (!isAdmin && !isAssignee) {
    throw new AppError("Forbidden", 403);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
};

export const assignTask = async (
  taskId: string,
  user: { userId: string; role: string },
  assigneeId: string | null
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) throw new AppError("Task not found", 404);

  const isAdmin = user.role === "ADMIN";
  const isOwner = task.ownerId === user.userId;

  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden", 403);
  }

  if (assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: { id: assigneeId },
    });
    if (!assignee) throw new AppError("Assignee not found", 404);
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { assigneeId },
  });
};
