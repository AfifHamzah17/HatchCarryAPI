import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Hanya file gambar yang diizinkan'), false);
    }
    cb(null, true);
  }
});

const gc = new Storage();

export async function processAndUploadReportImage(req, res, next) {
  try {
    if (!req.file) {
      return next(); // Lanjutkan tanpa image jika tidak ada file
    }

    const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error('GCLOUD_STORAGE_BUCKET is not defined');
    }

    const bucket = gc.bucket(bucketName);

    const buffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const filename = `reports/${Date.now()}_${req.file.originalname.split('.')[0]}.jpg`;
    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: { contentType: 'image/jpeg' },
      public: true,
    });

    req.reportImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    next();
  } catch (err) {
    next(err);
  }
}