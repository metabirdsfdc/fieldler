import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/jwt.js";
import { deployX } from "../services/deploy.service.js";

export class CsvController {
  async uploadCsv(req: AuthenticatedRequest, res: Response) {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

      const file = req.file as Express.Multer.File | undefined;

      if (!file) {
        return res.status(400).json({
          message: "CSV file is required"
        });
      }

      const csvContent = file.buffer.toString("utf-8");

      const deployResult = await deployX.deploy(userEmail, csvContent);

      return res.status(200).json({
        message: "Deployment completed",
        result: deployResult
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Deployment failed",
        error: error.message ?? String(error)
      });
    }
  }
}

export const csvController = new CsvController();
