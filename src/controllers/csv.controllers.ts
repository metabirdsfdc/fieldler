import { Request, Response } from "express";
import { deployX } from "../services/deploy.service.js";

export class CsvController {
  async uploadCsv(req: Request, res: Response) {
    try {
      const file = req.file as Express.Multer.File | undefined;

      if (!file) {
        return res.status(400).json({
          message: "CSV file is required",
        });
      }

      const csvContent = file.buffer.toString("utf-8");

      const deployResult = await deployX.deploy(csvContent);

      return res.status(200).json({
        message: "Deployment completed",
        result: deployResult,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Deployment failed",
        error: error.message ?? String(error),
      });
    }
  }
}

export const csvController = new CsvController();
