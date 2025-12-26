import { Router } from "express";
import { upload } from "../config/multer.config.js";
import { credentialsController } from "../controllers/credentials.controllers.js";
import { csvController } from "../controllers/csv.controllers.js";
import { authMiddleware } from "../middleware/jwt.js";

const router = Router();

router.post(
  "/credentials",
  authMiddleware,
  credentialsController.saveCredentials
);
router.get(
  "/credentials",
  authMiddleware,
  credentialsController.getCredentials
);
router.delete(
  "/credentials/:id",
  authMiddleware,
  credentialsController.deleteCredential
);
router.delete(
  "/credentials",
  authMiddleware,
  credentialsController.clearCredentials
);

router.patch(
  "/credentials/:id/activate",
  authMiddleware,
  credentialsController.activate
);

router.put("/credentials/:id", authMiddleware, credentialsController.update);

router.post(
  "/deploy/csv",
  authMiddleware,
  upload.single("file"),
  csvController.uploadCsv
);

export default router;
