import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    
    name: {type: String,required: true},

    lastName: {type: String,required: true},

    email: {type: String,required: true},

    password: {type: String,required: true},
});

export interface UserInterface {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
}

UserSchema.index({email: 1},{unique: true})