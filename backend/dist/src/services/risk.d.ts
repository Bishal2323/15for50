type Report = {
    trainingDuration: number;
    trainingRPE: number;
    trainingLoadSRPE: number;
    sleepHours: number;
    sleepQuality: number;
    fatigueLevel: number;
    stressLevel: number;
    painLevel?: number;
    localSoreness?: number;
    readinessToTrain: number;
    mood: number;
    kneeStabilityL: number;
    kneeStabilityR: number;
};
export declare function computeRisk(reports: Report[]): {
    score: number;
    level: "Low" | "Moderate" | "High";
    violations: string[];
    recommendation: string;
};
export {};
