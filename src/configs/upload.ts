import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";

const __dirname = import.meta.dirname;
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_FILE = 3;
const MAX_FILE_SIZE = 1024 * 1024 * MAX_FILE; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
  MAX_FILE,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
};
