import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (payload: { email: string }) => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};
