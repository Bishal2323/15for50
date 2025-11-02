import { Schema } from 'mongoose';
export type NotificationType = 'CoachInvite' | 'DirectMessage';
export type NotificationStatus = 'pending' | 'accepted' | 'declined';
export declare const Notification: import("mongoose").Model<{
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    type: "CoachInvite" | "DirectMessage";
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
    status: "pending" | "accepted" | "declined";
    metadata?: {
        athleteId?: import("mongoose").Types.ObjectId | null | undefined;
        coachId?: import("mongoose").Types.ObjectId | null | undefined;
        messageId?: import("mongoose").Types.ObjectId | null | undefined;
    } | null | undefined;
    message?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
