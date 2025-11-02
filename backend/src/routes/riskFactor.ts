import express from 'express';
import mongoose from 'mongoose';
import { RiskFactor } from '../models/riskFactor.model';
import { User } from '../models/user.model';
import { requireAuth } from '../middleware/auth';
import { AuditLog } from '../models/auditLog.model';

const router = express.Router();

// Helper function to resolve athleteId from email
async function resolveAthleteId(athleteEmail: string): Promise<mongoose.Types.ObjectId | null> {
  const athlete = await User.findOne({ email: athleteEmail });
  return athlete ? athlete._id as mongoose.Types.ObjectId : null;
}

// Helper function to validate report type permissions
function validateReportTypePermission(userRole: string, reportType: string): boolean {
  const permissions = {
    daily: ['Athlete', 'Admin'],
    weekly: ['Coach', 'Admin'],
    monthly: ['Physiotherapist', 'Admin']
  } as const;

  return (permissions as any)[reportType]?.includes(userRole) || false;
}

// Helper function to get relevant fields based on report type
function getRelevantFields(reportType: string): string[] {
  const fieldMappings = {
    'daily': ['mentalRecovery', 'workloadManagement'],
    'weekly': ['strengthAsymmetry', 'neuromuscularControl'],
    'monthly': ['anatomicalFixedRisk']
  };

  return fieldMappings[reportType as keyof typeof fieldMappings] || [];
}

// Duplicate submission checks are no longer applicable; manual submissions are disabled.

// GET /api/v1/risk-factors/athlete/:athleteId - Get risk factors for an athlete
router.get('/athlete/:athleteId', requireAuth, async (req, res) => {
  try {
    const { athleteId } = req.params;
    const requester = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(athleteId)) {
      return res.status(400).json({ error: 'Invalid athlete ID format' });
    }

    // Authorization: athletes can only access their own; others allowed
    if (requester.role === 'Athlete' && requester.id !== athleteId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const riskFactor = await RiskFactor.findOne({
      athleteId: new mongoose.Types.ObjectId(athleteId)
    });

    if (!riskFactor) {
      return res.status(404).json({ error: 'Risk factors not found for this athlete' });
    }

    res.json({
      success: true,
      data: {
        athleteId: riskFactor.athleteId,
        lastUpdated: riskFactor.updatedAt,
        workloadManagement: riskFactor.workloadManagement,
        mentalRecovery: riskFactor.mentalRecovery,
        strengthAsymmetry: riskFactor.strengthAsymmetry,
        neuromuscularControl: riskFactor.neuromuscularControl,
        anatomicalFixedRisk: riskFactor.anatomicalFixedRisk,
        notes: (riskFactor as any).notes || [],
        latest: {
          workloadManagement: (riskFactor.workloadManagement || []).slice(-1)[0] || null,
          mentalRecovery: (riskFactor.mentalRecovery || []).slice(-1)[0] || null,
          note: ((riskFactor as any).notes || []).slice(-1)[0] || null,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching risk factors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/risk-factors/athlete/email/:athleteEmail - Get risk factors by athlete email
router.get('/athlete/email/:athleteEmail', requireAuth, async (req, res) => {
  try {
    const { athleteEmail } = req.params;
    const requester = (req as any).user;

    const athleteId = await resolveAthleteId(athleteEmail);
    if (!athleteId) {
      return res.status(404).json({ error: 'Athlete not found' });
    }

    if (requester.role === 'Athlete' && requester.id !== String(athleteId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const riskFactor = await RiskFactor.findOne({ athleteId });

    if (!riskFactor) {
      return res.status(404).json({ error: 'Risk factors not found for this athlete' });
    }

    res.json({
      success: true,
      data: {
        athleteId: riskFactor.athleteId,
        lastUpdated: riskFactor.updatedAt,
        workloadManagement: riskFactor.workloadManagement,
        mentalRecovery: riskFactor.mentalRecovery,
        strengthAsymmetry: riskFactor.strengthAsymmetry,
        neuromuscularControl: riskFactor.neuromuscularControl,
        anatomicalFixedRisk: riskFactor.anatomicalFixedRisk,
        notes: (riskFactor as any).notes || [],
        latest: {
          workloadManagement: (riskFactor.workloadManagement || []).slice(-1)[0] || null,
          mentalRecovery: (riskFactor.mentalRecovery || []).slice(-1)[0] || null,
          note: ((riskFactor as any).notes || []).slice(-1)[0] || null,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching risk factors by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/risk-factors/submit - Submit risk factor update
router.post('/submit', requireAuth, async (_req, res) => {
  // Manual risk factor submission is disabled in the new model
  return res.status(410).json({ error: 'Manual risk factor submission is no longer supported.' });
});

// GET /api/v1/risk-factors/history/:athleteId - Get risk factor history with filters
router.get('/history/:athleteId', requireAuth, async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { reportType, startDate, endDate, limit = 50, page = 1 } = req.query;
    const requester = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(athleteId)) {
      return res.status(400).json({ error: 'Invalid athlete ID format' });
    }

    const riskFactor = await RiskFactor.findOne({
      athleteId: new mongoose.Types.ObjectId(athleteId)
    });

    if (!riskFactor) {
      return res.status(404).json({ error: 'Risk factors not found for this athlete' });
    }

    // Flatten metric arrays into a unified history view
    const flatten = (metric: string, arr: any[]) => (arr || []).map(v => ({ metric, value: v.value, date: new Date(v.date), reportType: v.reportType }));
    let history = [
      ...flatten('workloadManagement', (riskFactor as any).workloadManagement),
      ...flatten('mentalRecovery', (riskFactor as any).mentalRecovery),
      ...flatten('strengthAsymmetry', (riskFactor as any).strengthAsymmetry),
      ...flatten('neuromuscularControl', (riskFactor as any).neuromuscularControl),
      ...flatten('anatomicalFixedRisk', (riskFactor as any).anatomicalFixedRisk),
    ];

    // Apply filters
    if (reportType) {
      history = history.filter(entry => entry.reportType === reportType);
    }

    if (startDate) {
      const start = new Date(startDate as string);
      history = history.filter(entry => entry.date >= start);
    }

    if (endDate) {
      const end = new Date(endDate as string);
      history = history.filter(entry => entry.date <= end);
    }

    // Sort by submission date (newest first)
    history.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        athleteId: riskFactor.athleteId,
        history: paginatedHistory,
        pagination: {
          currentPage: pageNum,
          totalEntries: history.length,
          totalPages: Math.ceil(history.length / limitNum),
          hasNext: endIndex < history.length,
          hasPrev: pageNum > 1
        },
        filters: {
          reportType: reportType || 'all',
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching risk factor history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/risk-factors/summary/:athleteId - Get risk factor summary and trends
router.get('/summary/:athleteId', requireAuth, async (req, res) => {
  try {
    const { athleteId } = req.params;
    const { days = 30 } = req.query;
    const requester = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(athleteId)) {
      return res.status(400).json({ error: 'Invalid athlete ID format' });
    }

    const riskFactor = await RiskFactor.findOne({
      athleteId: new mongoose.Types.ObjectId(athleteId)
    });

    if (!riskFactor) {
      return res.status(404).json({ error: 'Risk factors not found for this athlete' });
    }

    const daysNum = parseInt(days as string);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysNum);

    const flatten = (metric: string, arr: any[]) => (arr || []).map(v => ({ metric, value: v.value, date: new Date(v.date), reportType: v.reportType }));
    const unified = [
      ...flatten('workloadManagement', (riskFactor as any).workloadManagement),
      ...flatten('mentalRecovery', (riskFactor as any).mentalRecovery),
      ...flatten('strengthAsymmetry', (riskFactor as any).strengthAsymmetry),
      ...flatten('neuromuscularControl', (riskFactor as any).neuromuscularControl),
      ...flatten('anatomicalFixedRisk', (riskFactor as any).anatomicalFixedRisk),
    ];
    const recentHistory = unified.filter(entry => entry.date >= cutoffDate);

    // Calculate trends and statistics
    const reportTypeCounts = recentHistory.reduce((acc, entry) => {
      acc[entry.reportType] = (acc[entry.reportType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byMetric: Record<string, number[]> = {};
    for (const e of recentHistory) {
      if (!byMetric[e.metric]) byMetric[e.metric] = [];
      byMetric[e.metric].push(e.value);
    }
    const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    const averageRiskFactors = {
      workloadManagement: avg(byMetric['workloadManagement'] || []),
      strengthAsymmetry: avg(byMetric['strengthAsymmetry'] || []),
      neuromuscularControl: avg(byMetric['neuromuscularControl'] || []),
      mentalRecovery: avg(byMetric['mentalRecovery'] || []),
      anatomicalFixedRisk: avg(byMetric['anatomicalFixedRisk'] || []),
    };

    res.json({
      success: true,
      data: {
        athleteId: riskFactor.athleteId,
        lastUpdated: riskFactor.updatedAt,
        summary: {
          totalEntries: unified.length,
          recentEntries: recentHistory.length,
          reportTypeCounts,
          averageRiskFactors,
          period: `Last ${daysNum} days`
        }
      }
    });
  } catch (error) {
    console.error('Error fetching risk factor summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
