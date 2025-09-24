import Report from '../models/report.js';

class ReportService {
  static async createReport(reportData, userId) {
    const report = await Report.create({
      ...reportData,
      createdBy: userId
    });
    return report;
  }

  static async getReports(limit = 28) {
    const reports = await Report.findAll(limit);
    return reports;
  }

  static async getReportById(id) {
    const report = await Report.findById(id);
    return report;
  }

  static async updateReport(id, reportData) {
    const report = await Report.update(id, reportData);
    return report;
  }

  static async deleteReport(id) {
    const result = await Report.delete(id);
    return result;
  }
}

export default ReportService;