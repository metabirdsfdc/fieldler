import jsforce from "jsforce";
import { SalesforceCredential } from "../models/SalesforceCredential.js";

type SalesforceCredentialsInput = {
  username: string;
  password: string;
  securityToken: string;
  orgName?: string;
};

export class SalesforceService {
  async saveCredentials(
    userEmail: string,
    credentials: SalesforceCredentialsInput
  ) {
    const newCred = new SalesforceCredential({
      userEmail,
      ...credentials,
      active: false
    });
    return newCred.save();
  }

  async getCredentials(userEmail: string) {
    return SalesforceCredential.find(
      { userEmail },
      {
        id: 1,
        username: 1,
        orgName: 1,
        active: 1
      }
    ).sort({ createdAt: -1 });
  }

  async deleteCredential(credentialId: string, userEmail: string) {
    await SalesforceCredential.deleteOne({ _id: credentialId, userEmail });
  }

  async clearCredentials(userEmail: string) {
    await SalesforceCredential.deleteMany({ userEmail });
  }

  async activateCredential(credentialId: string, userEmail: string) {
    await SalesforceCredential.updateMany(
      { userEmail },
      { $set: { active: false } }
    );

    await SalesforceCredential.updateOne(
      { _id: credentialId, userEmail },
      { $set: { active: true } }
    );
  }

  async updateCredential(
    credentialId: string,
    userEmail: string,
    data: Partial<SalesforceCredentialsInput>
  ) {
    return SalesforceCredential.findOneAndUpdate(
      { _id: credentialId, userEmail },
      { $set: data },
      { new: true }
    );
  }

  async login(userEmail: string) {
    const cred = await SalesforceCredential.findOne({
      userEmail,
      active: true
    });

    if (!cred) throw new Error("Salesforce credentials not found");

    const conn = new jsforce.Connection({
      loginUrl: "https://login.salesforce.com"
    });

    await conn.login(cred.username, cred.password + cred.securityToken);
    return conn;
  }
}

export const salesforceService = new SalesforceService();
