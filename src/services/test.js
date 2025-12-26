"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
// Example: generate a fake JWT
var secret = "cMVEP4bLb9pOrXDiPWGHV2n0DCxau5xIr/b6QIwNoJbv83N8/4J3IlrriV2oyzPtnPLHlGf79wI6euoYmC+EjA=="; // 64 bytes base64
var token = jwt.sign({ email: "mr.kingkalyan@gmail.com" }, // payload
secret, { expiresIn: "7d" });
console.log(token);
