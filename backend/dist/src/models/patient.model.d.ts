import { Schema } from 'mongoose';
export declare const Patient: import("mongoose").Model<{
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    physioId: import("mongoose").Types.ObjectId;
    details: string;
    severity: "small" | "middle" | "severe";
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
