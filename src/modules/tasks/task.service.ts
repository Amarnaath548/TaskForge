import { date } from "zod/index.cjs";
import type { Role } from "../../../generated/prisma/index.js";
import prisma from "../../config/db.js";
import { AppError } from "../../utils/errors.js";
import type { taskQueryInput } from "./task.schema.js";

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

export const getTasksForUser = async (
  user: { userId: string; role: Role },
  filters: taskQueryInput
) => {
  

  const where: any= {
    
  };
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.assigneeId) {
    where.assigneeId = filters.assigneeId;
  }

  if (user.role !== "ADMIN") {
    where.OR= [{ ownerId: user.userId }, { assigneeId: user.userId }]
  }

  const skip = (filters.page - 1) * filters.limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: filters.limit,
      include: {
        owner: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    date: tasks,
    meta: {
      total,
      page: filters.page,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
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


export const deleteTask= async (
  taskId : string,
  user : {userId: string; role: Role}
)=>{
  const task = await prisma.task.findUnique({
    where:{id:taskId},
  });
  if(!task){
    throw new AppError("Task not found", 404);
  }

  const isAdmin=user.role==="ADMIN";
  const isOwner=task.ownerId===user.userId;

  if(!isAdmin && !isOwner){
    throw new AppError("Forbidden", 403);
  }

  await prisma.task.delete({
    where:{id:taskId},
  });

  return {message: "Task deleted successfully" }
}