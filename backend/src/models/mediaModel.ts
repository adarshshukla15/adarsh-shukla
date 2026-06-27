import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  public_id: string;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const MediaModel = mongoose.model<IMedia>('Media', MediaSchema);
