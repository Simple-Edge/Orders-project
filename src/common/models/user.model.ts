import { Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  lastName: string;
  email: string;
  password: string;
  created: Date;
  updated?: Date;
  deleted?: Date;
  lastActivity: Date;
}

// role: RoleInterface;