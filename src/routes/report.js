  import express from 'express';
  import { upload, processAndUploadReportImage } from '../middleware/uploadReportImage.js';
  import { processAndUploadBase64Image } from '../middleware/uploadBase64Image.js';
  import ReportService from '../services/reportService.js';
  import { validateReport } from '../utils/validation.js';
  import { authenticate } from '../middleware/authMiddleware.js'; // Import middleware autentikasi

  const router = express.Router();

  // Get all reports
  router.get('/', async (req, res, next) => {
    try {
      const { limit } = req.query;
      const reports = await ReportService.getReports(limit ? parseInt(limit) : 28);
      res.json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  });

  // Get report by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const report = await ReportService.getReportById(req.params.id);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  });

  // Create report with form-data (for image upload)
  router.post('/upload', authenticate, upload.single('image'), processAndUploadReportImage, async (req, res, next) => {
    try {
      const { error, value } = validateReport(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      if (req.reportImageUrl) {
        value.imageUrl = req.reportImageUrl;
      }

      const userId = req.user?.id || 'anonymous';
      const report = await ReportService.createReport(value, userId);

      res.status(201).json({ success: true, data: report });
    } catch (error) {
      console.error('Error in POST /api/reports/upload:', error);
      next(error);
    }
  });

  // Create report with raw JSON (base64 image)
  router.post('/',authenticate, processAndUploadBase64Image, async (req, res, next) => {
    try {
      const { error, value } = validateReport(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      if (req.reportImageUrl) {
        value.imageUrl = req.reportImageUrl;
      }

      const userId = req.user?.id || 'anonymous';
      const report = await ReportService.createReport(value, userId);

      res.status(201).json({ success: true, data: report });
    } catch (error) {
      console.error('Error in POST /api/reports:', error);
      next(error);
    }
  });

  // Update report
  router.put('/:id', authenticate, upload.single('image'), processAndUploadReportImage, async (req, res, next) => {
    try {
      const { error, value } = validateReport(req.body);
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }

      if (req.reportImageUrl) {
        value.imageUrl = req.reportImageUrl;
      }

      const report = await ReportService.updateReport(req.params.id, value);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  });

  // Delete report
  router.delete('/:id', authenticate, async (req, res, next) => {
    try {
      await ReportService.deleteReport(req.params.id);
      res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
      next(error);
    }
  });

  export default router;
