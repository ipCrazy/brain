import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Pre nego što sačuvamo korisnika, heširaj lozinku
userSchema.pre('save', async function(next) {
  const user = this as User;

  if (!user.isModified('password')) {
    return next();
  }

  // Heširanje lozinke
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Kreiraj i exportuj model
const UserModel = model<User>('User', userSchema);
export default UserModel;
