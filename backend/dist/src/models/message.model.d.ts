import { Schema } from 'mongoose';
export declare const Message: import("mongoose").Model<{
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    text: string;
    attachments: import("mongoose").Types.DocumentArray<{
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }> & {
        url: string;
        size: number;
        filename: string;
        mimeType: string;
    }>;
    senderUserId: import("mongoose").Types.ObjectId;
    recipientUserId: import("mongoose").Types.ObjectId;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
