import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/jwt.js";
import { salesforceService } from "../services/connection.service.js";

export class CredentialsController {
  async saveCredentials(req: AuthenticatedRequest, res: Response) {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { username, password, securityToken, orgName } = req.body;

      if (!username || !password || !securityToken) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await salesforceService.saveCredentials(userEmail, {
        username,
        password,
        securityToken,
        orgName
      });

      return res.status(200).json({
        message: "Credentials saved successfully",
        data: { username: result.username, orgName: result.orgName }
      });
    } catch (error) {
      console.error("Error saving credentials:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCredentials(req: AuthenticatedRequest, res: Response) {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    const credentials = await salesforceService.getCredentials(userEmail);
    res.json(credentials);
  }

  async deleteCredential(req: AuthenticatedRequest, res: Response) {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    await salesforceService.deleteCredential(req.params.id, userEmail);
    res.json({ message: "Deleted successfully" });
  }

  async clearCredentials(req: AuthenticatedRequest, res: Response) {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    await salesforceService.clearCredentials(userEmail);
    res.json({ message: "All credentials cleared" });
  }

  async activate(req: AuthenticatedRequest, res: Response) {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    await salesforceService.activateCredential(req.params.id, userEmail);
    res.json({ message: "Credential activated" });
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    const updated = await salesforceService.updateCredential(
      req.params.id,
      userEmail,
      req.body
    );

    res.json(updated);
  }
}

export const credentialsController = new CredentialsController();
