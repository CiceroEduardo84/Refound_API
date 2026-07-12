import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { query, Request, Response } from "express";
import z, { number, string } from "zod";

const CategoryEnum = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accomodation",
]);

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: "Informe o nome da sua solicitação!" }),
      category: CategoryEnum,
      amount: z.number().positive({ message: "O valor precisa ser positivo!" }),
      filename: z.string().min(20),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError("Unauthorized!", 401);
    }

    const refound = await prisma.refounds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    response.status(201).json(refound);
  }

  async index(request: Request, response: Response) {
    const queryScheme = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = queryScheme.parse(request.query);

    const skip = (page - 1) * perPage;

    const refounds = await prisma.refounds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const totalRecords = await prisma.refounds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    response.status(200).json({
      refounds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }
}

export { RefundsController };
