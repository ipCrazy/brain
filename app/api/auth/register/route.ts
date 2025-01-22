import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../../models/User';
import connectToDatabase from '../../../lib/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      // Proveravamo da li korisnik već postoji
      await connectToDatabase();

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Kreiranje novog korisnika
      const newUser = new UserModel({ name, email, password });
      await newUser.save();

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
