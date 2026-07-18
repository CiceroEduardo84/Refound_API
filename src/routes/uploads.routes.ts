import { Router } from "express";
import multer from "multer";
import uploadConfig from "@/configs/upload";
import { UploadsController } from "@/controllers/uploadsController";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

const upload = multer(uploadConfig.MULTER);

uploadsRoutes.use(verifyUserAuthorization(["employee"]));
uploadsRoutes.post("/", upload.single("file"), uploadsController.create);

export { uploadsRoutes };
