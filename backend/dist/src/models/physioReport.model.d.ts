import { Schema } from 'mongoose';
export declare const PhysioReports: import("mongoose").Model<{
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    physioMetrics: import("mongoose").Types.DocumentArray<{
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }> & {
        version: number;
        physioId: import("mongoose").Types.ObjectId;
        reportDate: NativeDate;
        notes?: string | null | undefined;
        metrics?: {
            hqRatio: number;
            peakDynamicKneeValgusDeg: number;
            trunkLeanLandingDeg: number;
            cmjPeakPowerWkg: number;
            beightonScore: number;
            anatomicalRisk: string;
            mvicLsi: number;
            emgOnsetDelayMs: number;
        } | null | undefined;
        assessment?: {
            findings: string[];
            summary?: string | null | undefined;
            riskLevel?: "Low" | "Moderate" | "High" | null | undefined;
        } | null | undefined;
        treatment?: {
            exercises: import("mongoose").Types.DocumentArray<{
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }> & {
                name?: string | null | undefined;
                notes?: string | null | undefined;
                frequencyPerWeek?: number | null | undefined;
            }>;
            modalities: string[];
            plan?: string | null | undefined;
            nextVisitDate?: NativeDate | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
