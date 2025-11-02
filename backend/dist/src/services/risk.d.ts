type Report = {
    trainingDuration: number;
    fatigueLevel: number;
    sleepHours: number;
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
