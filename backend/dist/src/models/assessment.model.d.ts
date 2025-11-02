import { Schema } from 'mongoose';
export declare const Assessment: import("mongoose").Model<{
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    date: NativeDate;
    athleteId: import("mongoose").Types.ObjectId;
    hamstringStrength: number;
    quadStrength: number;
    mobility: number;
    videoUrl?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
