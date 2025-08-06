import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Hanya file gambar yang diizinkan'), false);
    }
    cb(null, true);
  }
});

const gc = new Storage();

export async function processAndUpload(req, res, next) {
  try {
    if (!req.file) throw new Error('File tidak ditemukan');

    const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error('GCLOUD_STORAGE_BUCKET is not defined');
    }

    const bucket = gc.bucket(bucketName);

    const buffer = await sharp(req.file.buffer)
      .resize(512, 512, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const filename = `images/${Date.now()}_${req.user.email}.jpg`;
    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: { contentType: 'image/jpeg' },
      public: true,
    });

    req.avatarUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    next();
  } catch (err) {
    next(err);
  }
}