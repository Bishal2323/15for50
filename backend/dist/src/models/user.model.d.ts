import { Schema } from 'mongoose';
export declare const User: import("mongoose").Model<{
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    coachId: import("mongoose").Types.ObjectId;
    aclRisk: number;
    passwordHash: string;
    gender?: "male" | "female" | null | undefined;
    age?: number | null | undefined;
    heightCm?: number | null | undefined;
    weightKg?: number | null | undefined;
    bmi?: number | null | undefined;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
