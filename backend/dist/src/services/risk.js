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
    if (violations.includes('Symptom Persistence'))
        return 'Physio evaluation recommended.';
    if (violations.includes('Strength Imbalance'))
        return 'Add targeted strength work to correct imbalance.';
    if (violations.includes('Fatigue/Sleep'))
        return 'Prioritize sleep and recovery strategies.';
    return 'Maintain current plan and monitor.';
}
function computeRisk(reports) {
    const latest = reports[reports.length - 1];
    const durations = reports.map(r => r.trainingDuration);
    const recent = durations.slice(Math.max(0, durations.length - 7));
    const prior = durations.slice(Math.max(0, durations.length - 21), Math.max(0, durations.length - 7));
    const avgRecent = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
    const avgPrior = prior.length ? prior.reduce((a, b) => a + b, 0) / prior.length : 0;
    const acwr = avgPrior > 0 ? avgRecent / avgPrior : 1;
    const violations = [];
    if (acwr > 1.5)
        violations.push('Workload Spike');
    const kneeStreak = reports.slice(-3).filter(r => r.kneeStabilityL < 5 || r.kneeStabilityR < 5).length;
    if (kneeStreak >= 2)
        violations.push('Symptom Persistence');
    const strengthImbalance = Math.abs(latest.kneeStabilityL - latest.kneeStabilityR) >= 3;
    if (strengthImbalance)
        violations.push('Strength Imbalance');
    if (latest.fatigueLevel >= 7 || latest.sleepHours < 6)
        violations.push('Fatigue/Sleep');
    const rawScore = Math.min(1, Math.max(0, (acwr - 1) * 0.5 + (latest.fatigueLevel / 10) * 0.3 + (violations.length * 0.1)));
    const level = levelFromScore(rawScore);
    const recommendation = makeRecommendation(violations);
    return { score: rawScore, level, violations, recommendation };
}
//# sourceMappingURL=risk.js.map