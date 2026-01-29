import mongoose, { Schema, Model } from 'mongoose';

export interface IMessageSent {
  template_id: string;
  sent_at: Date;
}

export interface INextMessage {
  template_id: string;
  send_at: Date;
}

export interface IUser {
  userId: number;
  userName?: string;
  firstName: string;
  lastName?: string;
  chatId: number;
  role: string;
  funnelStage: string;
  tags: string[];
  messagesSent: IMessageSent[];
  nextMessage?: INextMessage;
  isActive: boolean;
  blocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSentSchema = new Schema<IMessageSent>({
  template_id: { type: String, required: true },
  sent_at: { type: Date, required: true },
});

const NextMessageSchema = new Schema<INextMessage>({
  template_id: { type: String, required: true },
  send_at: { type: Date, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    userId: { type: Number, required: true, unique: true, index: true },
    userName: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    chatId: { type: Number, required: true },
    role: { type: String, default: 'client' },
    funnelStage: { type: String, default: 'lead_captured' },
    tags: { type: [String], default: ['lead_captured'] },
    messagesSent: { type: [MessageSentSchema], default: [] },
    nextMessage: { type: NextMessageSchema },
    isActive: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
