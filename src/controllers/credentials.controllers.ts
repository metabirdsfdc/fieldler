import { Request, Response } from "express";
import { salesforceService } from "../services/connection.service.js";

export class CredentialsController {
  async clearCredentials(req: Request, res: Response) {
    try {
      await salesforceService.clearCredentials();

      return res.status(200).json({
        message: "Credentials cleared successfully"
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to clear credentials",
        error: String(error)
      });
    }
  }

  async saveCredentials(req: Request, res: Response) {
    try {
      const { username, password, securityToken } = req.body;

      if (!username || !password || !securityToken) {
        return res.status(400).json({
          message: "username, password and securityToken are required"
        });
      }

      await salesforceService.writeCredentials({
        username,
        password,
        securityToken
      });

      return res.status(200).json({
        message: "Credentials saved successfully"
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to save credentials",
        error: String(error)
      });
    }
  }

  async getCredentials(req: Request, res: Response) {
    try {
      const credentials = await salesforceService.readCredentials();

      if (!credentials || Object.keys(credentials).length === 0) {
        return res.status(200).json({}); // return empty object if no credentials
      }

      return res.status(200).json(credentials);
    } catch (error) {
      console.error("Error reading credentials:", error);
      return res.status(500).json({
        status: 500,
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const credentialsController = new CredentialsController();
