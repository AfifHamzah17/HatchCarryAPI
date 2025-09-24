
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const gc = new Storage();

export async function processAndUploadBase64Image(req, res, next) {
  try {
    const { image } = req.body;
    
    if (!image || !image.startsWith('data:image/')) {
      return next(); // Lanjutkan tanpa image jika tidak ada base64 image
    }

    const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
    if (!bucketName) {
      throw new Error('GCLOUD_STORAGE_BUCKET is not defined');
    }

    const bucket = gc.bucket(bucketName);

    // Extract base64 data
    const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }

    const imageType = matches[1];
    const imageData = Buffer.from(matches[2], 'base64');

    // Process image with sharp
    const buffer = await sharp(imageData)
      .resize(1024, 1024, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Generate filename
    const filename = `reports/${uuidv4()}.jpg`;
    const file = bucket.file(filename);

    // Upload to Cloud Storage
    await file.save(buffer, {
      metadata: { contentType: `image/jpeg` },
      public: true,
    });

    req.reportImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    next();
  } catch (err) {
    next(err);
  }
}