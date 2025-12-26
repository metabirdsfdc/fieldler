import mongoose, { Document, Schema } from "mongoose";

export interface ISalesforceCredential extends Document {
  userEmail: string;
  username: string;
  password: string;
  securityToken: string;
  orgName?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SalesforceCredentialSchema = new Schema<ISalesforceCredential>(
  {
    userEmail: { type: String, required: true, index: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    securityToken: { type: String, required: true },
    orgName: { type: String },
    active: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SalesforceCredential = mongoose.model<ISalesforceCredential>(
  "SalesforceCredential",
  SalesforceCredentialSchema
);
