import { Request, Response, response } from "express";
import { ErrorModel } from "../services/error";
import { decodeJwtToEmail } from "../services/tools";
import { prismaClient } from "../config/prisma";

export const check = async (req: Request, res: Response) => {
  try {
    const result = await prismaClient.$queryRaw`SELECT NOW()`;

    res.json({
      success: true,
      data: {
        results: result,
      },
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send(String(err));
  }
};
