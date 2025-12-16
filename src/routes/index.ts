import { Router } from "express";
import { upload } from "../config/multer.config.js";
import { credentialsController } from "../controllers/credentials.controllers.js";
import { csvController } from "../controllers/csv.controllers.js";

const router = Router();

router.post("/credentials", credentialsController.saveCredentials);

router.get("/credentials", credentialsController.getCredentials);

router.delete("/credentials", credentialsController.clearCredentials);

router.post("/deploy/csv", upload.single("file"), csvController.uploadCsv);

export default router;
