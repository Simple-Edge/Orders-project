import { Document } from 'mongoose';

export interface UserInterface extends Document {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  created: Date;
  updated?: Date;
  deleted?: Date;
  lastActivity: Date;
}

// role: RoleInterface;