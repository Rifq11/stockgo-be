import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use __dirname to ensure correct path in production (cPanel)
// __dirname in compiled JS will be dist/src/middleware, so we go up 3 levels to reach root
const getUploadDir = (): string => {
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }
  // In compiled JS: dist/src/middleware -> ../../.. -> root -> public/uploads
  return path.resolve(__dirname, '../../../public/uploads');
};

const uploadDir: string = getUploadDir();

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType: string = file.fieldname?.split('_')[0] || 'general';
    const dest = path.join(uploadDir, fileType);
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

export const uploadDeliveryMedia = upload.array('media', 5); // Max 5 files
export const uploadSingle = upload.single('file');

