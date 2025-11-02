"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRisk = computeRisk;
function levelFromScore(score) {
    if (score >= 0.7)
        return 'High';
    if (score >= 0.4)
        return 'Moderate';
    return 'Low';
}
function makeRecommendation(violations) {
    if (violations.includes('Workload Spike'))
        return 'Reduce training load and increase recovery.';
    if (violations.includes('High Training Load'))
        return 'Consider reducing training intensity or duration.';
    if (violations.includes('Symptom Persistence'))
        return 'Physio evaluation recommended.';
    if (violations.includes('Strength Imbalance'))
        return 'Add targeted strength work to correct imbalance.';
    if (violations.includes('Fatigue/Sleep'))
        return 'Prioritize sleep and recovery strategies.';
    if (violations.includes('Poor Recovery'))
        return 'Focus on sleep quality and stress management.';
    if (violations.includes('High Stress'))
        return 'Consider stress management techniques and lighter training.';
    if (violations.includes('Low Readiness'))
        return 'Reduce training intensity until readiness improves.';
    return 'Maintain current plan and monitor.';
}
function computeRisk(reports) {
    const latest = reports[reports.length - 1];
    // Training load analysis (ACWR - Acute:Chronic Workload Ratio)
    const loads = reports.map(r => r.trainingLoadSRPE || (r.trainingDuration * (r.trainingRPE || 5)));
    const recent = loads.slice(Math.max(0, loads.length - 7));
    const prior = loads.slice(Math.max(0, loads.length - 21), Math.max(0, loads.length - 7));
    const avgRecent = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
    const avgPrior = prior.length ? prior.reduce((a, b) => a + b, 0) / prior.length : 0;
    const acwr = avgPrior > 0 ? avgRecent / avgPrior : 1;
    const violations = [];
    // Training load violations
    if (acwr > 1.5)
        violations.push('Workload Spike');
    if (latest.trainingLoadSRPE > 800 || (latest.trainingDuration * latest.trainingRPE) > 800) {
        violations.push('High Training Load');
    }
    // Physical state violations
    const kneeStreak = reports.slice(-3).filter(r => r.kneeStabilityL < 5 || r.kneeStabilityR < 5).length;
    if (kneeStreak >= 2)
        violations.push('Symptom Persistence');
    const strengthImbalance = Math.abs(latest.kneeStabilityL - latest.kneeStabilityR) >= 3;
    if (strengthImbalance)
        violations.push('Strength Imbalance');
    // Sleep and recovery violations (updated scale: fatigue is now 0-100)
    if (latest.fatigueLevel >= 70 || latest.sleepHours < 6 || latest.sleepQuality <= 4) {
        violations.push('Fatigue/Sleep');
    }
    // New comprehensive violations
    if (latest.stressLevel >= 70 || (latest.painLevel ?? 0) >= 7 || (latest.localSoreness ?? 0) >= 8) {
        violations.push('Poor Recovery');
    }
    if (latest.stressLevel >= 80)
        violations.push('High Stress');
    if (latest.readinessToTrain <= 4 || latest.mood <= 4)
        violations.push('Low Readiness');
    // Enhanced risk score calculation with new metrics
    const fatigueScore = latest.fatigueLevel / 100; // 0-1
    const stressScore = latest.stressLevel / 100; // 0-1
    const painScore = (latest.painLevel ?? 0) / 10; // 0-1
    const sorenessScore = (latest.localSoreness ?? 0) / 10; // 0-1
    const readinessScore = (10 - latest.readinessToTrain) / 10; // Inverted: lower readiness = higher risk
    const sleepScore = latest.sleepHours < 6 ? 0.5 : (latest.sleepQuality <= 4 ? 0.3 : 0);
    const workloadScore = Math.max(0, (acwr - 1) * 0.5);
    const rawScore = Math.min(1, Math.max(0, workloadScore * 0.25 +
        fatigueScore * 0.2 +
        stressScore * 0.15 +
        painScore * 0.15 +
        sorenessScore * 0.1 +
        readinessScore * 0.1 +
        sleepScore * 0.05));
    const level = levelFromScore(rawScore);
    const recommendation = makeRecommendation(violations);
    return { score: rawScore, level, violations, recommendation };
}
//# sourceMappingURL=risk.js.map