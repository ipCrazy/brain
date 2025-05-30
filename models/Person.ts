import { Schema, model, models } from "mongoose";

const PersonSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Dodao required: true za ime
    surname: { type: String, required: true }, // Dodao required: true za prezime
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
    customFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "person",
  }
);

export default models.Person || model("Person", PersonSchema);
