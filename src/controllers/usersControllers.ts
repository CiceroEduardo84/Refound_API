import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { Request, Response } from "express";
import z from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySChema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z
        .string()
        .trim()
        .email({ message: "E-mail inválido" })
        .toLowerCase(),
      password: z
        .string()
        .min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySChema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Já existe um usuário cadastrado com esse e-mail!");
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    response.status(201).json();
  }
}

export { UsersController };
