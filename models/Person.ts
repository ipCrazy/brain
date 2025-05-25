import { Schema, model, models } from "mongoose";

const PersonSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    surname: { type: String },
    nickname: { type: String },
    age: { type: Number },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    birthday: { type: Date },
    occupation: { type: String },
    company: { type: String },
    relationship: { type: String },
    notes: { type: String },
    customFields: { type: Map, of: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "person", // Eksplicitno navodi naziv kolekcije
  }
);

export default models.Person || model("Person", PersonSchema);
