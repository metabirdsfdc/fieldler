import fs from "fs/promises";
import jsforce from "jsforce";
import path from "path";
import { fileURLToPath } from "url";

type SalesforceCredentials = {
  username: string;
  password: string;
  securityToken: string;
};

export class SalesforceService {
  private getCredentialsPath(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return path.resolve(__dirname, "../../credentials.json");
  }

  async writeCredentials(credentials: SalesforceCredentials): Promise<void> {
    const credentialsPath = this.getCredentialsPath();

    const json = JSON.stringify(credentials, null, 2);

    await fs.writeFile(credentialsPath, json, {
      encoding: "utf-8",
      flag: "w",
    });
  }

  async clearCredentials(): Promise<void> {
    const credentialsPath = this.getCredentialsPath();

    try {
      await fs.unlink(credentialsPath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return;
      }

      throw new Error(
        "Failed to clear Salesforce credentials: " + error.message
      );
    }
  }

  async readCredentials(): Promise<SalesforceCredentials> {
    const credentialsPath = this.getCredentialsPath();

    try {
      const file = await fs.readFile(credentialsPath, "utf-8");

      return JSON.parse(file) as SalesforceCredentials;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(
          "Salesforce credentials not found. Please save credentials first."
        );
      }

      throw new Error(
        "Failed to read Salesforce credentials: " + error.message
      );
    }
  }

  async login(): Promise<jsforce.Connection> {
    const { username, password, securityToken } = await this.readCredentials();

    const conn = new jsforce.Connection({
      loginUrl: "https://login.salesforce.com",
    });

    await conn.login(username, password + securityToken);

    return conn;
  }
}

export const salesforceService = new SalesforceService();
