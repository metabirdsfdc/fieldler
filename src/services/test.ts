import * as jwt from "jsonwebtoken";

// Example: generate a fake JWT
const secret =
  "cMVEP4bLb9pOrXDiPWGHV2n0DCxau5xIr/b6QIwNoJbv83N8/4J3IlrriV2oyzPtnPLHlGf79wI6euoYmC+EjA=="; // 64 bytes base64
const token = jwt.sign(
  { email: "mr.kingkalyan@gmail.com" }, // payload
  secret,
  { expiresIn: "7d" }
);

console.log(token);
