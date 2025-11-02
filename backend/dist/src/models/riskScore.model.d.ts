import { Schema } from 'mongoose';
export declare const RiskScore: import("mongoose").Model<{
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    athleteId: import("mongoose").Types.ObjectId;
    date: NativeDate;
    level: "Low" | "Moderate" | "High";
    score: number;
    violations: string[];
    recommendation?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
