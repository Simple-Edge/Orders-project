import { Document } from 'mongoose';

export interface CommentInterface extends Document {
    user: string;
    message: string;
    product?: string;
    usersLikes?: string[];
    usersDislikes?: string[];
    commentThread?: string[];
    created: Date;
    updated?: Date;
    deleted?: Date;
}