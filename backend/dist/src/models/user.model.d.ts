import { Schema } from 'mongoose';
export declare const User: import("mongoose").Model<{
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    email: string;
    role: "Athlete" | "Coach" | "Physiotherapist" | "Admin";
    passwordHash: string;
    teamId?: import("mongoose").Types.ObjectId | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
