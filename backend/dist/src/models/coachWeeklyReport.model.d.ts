import { Schema } from 'mongoose';
export declare const CoachWeeklyReports: import("mongoose").Model<{
    athleteId: import("mongoose").Types.ObjectId;
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    athleteId: import("mongoose").Types.ObjectId;
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    athleteId: import("mongoose").Types.ObjectId;
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
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
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    coachMetrics: import("mongoose").Types.DocumentArray<{
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }> & {
        weekStart: NativeDate;
        weekEnd: NativeDate;
        highlights: string[];
        concerns: string[];
        actionItems: string[];
        notes?: string | null | undefined;
        metrics?: {
            specificPainChecks: import("mongoose").Types.DocumentArray<{
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }> & {
                area?: string | null | undefined;
                rating?: number | null | undefined;
            }>;
            acwr?: number | null | undefined;
            quadricepsLsi?: number | null | undefined;
            hamstringsLsi?: number | null | undefined;
            singleLegHopLsi?: number | null | undefined;
            yBalanceAnteriorDiffCm?: number | null | undefined;
            lessScore?: number | null | undefined;
            slsStabilitySec?: number | null | undefined;
        } | null | undefined;
        title?: string | null | undefined;
        trainingFocus?: string | null | undefined;
        aggregated?: {
            avgTrainingLoadSRPE?: number | null | undefined;
            avgSleepQuality?: number | null | undefined;
            avgMood?: number | null | undefined;
            athleteCount?: number | null | undefined;
        } | null | undefined;
    }>;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
