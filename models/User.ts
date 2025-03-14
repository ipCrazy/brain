import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Definiši interfejs za korisničke podatke
interface User extends Document {
  name: string;
  email: string;
  password: string;
}

// Kreiraj šemu za korisnika
const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  const user = this as User;

  if (!user.isModified("password")) {
    return next();
  }

  console.log("Original password before hashing:", user.password);
  const salt = await bcrypt.genSalt(10);
  console.log("Generated salt:", salt);

  user.password = await bcrypt.hash(user.password, salt);
  console.log("Hashed password:", user.password);

  next();
});

// Kreiraj i exportuj model samo ako već ne postoji
const UserModel = models.User || model<User>("User", userSchema);

// Dodaj funkciju za dobijanje korisnika po ID-u
export async function getUserById(userId: string) {
  try {
    const user = await UserModel.findById(userId).exec();
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export default UserModel;
