import { Request, Response } from "express";
import { salesforceService } from "../services/connection.service.js";

export class CredentialsController {
  async clearCredentials(req: Request, res: Response) {
    try {
      await salesforceService.clearCredentials();

      return res.status(200).json({
        message: "Credentials cleared successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to clear credentials",
        error: String(error),
      });
    }
  }

  async saveCredentials(req: Request, res: Response) {
    try {
      const { username, password, securityToken } = req.body;

      if (!username || !password || !securityToken) {
        return res.status(400).json({
          message: "username, password and securityToken are required",
        });
      }

      await salesforceService.writeCredentials({
        username,
        password,
        securityToken,
      });

      return res.status(200).json({
        message: "Credentials saved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to save credentials",
        error: String(error),
      });
    }
  }

  async getCredentials(req: Request, res: Response) {
    try {
      const credentials = await salesforceService["readCredentials"]();

      return res.status(200).json(credentials);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to read credentials",
        error: String(error),
      });
    }
  }
}

export const credentialsController = new CredentialsController();
