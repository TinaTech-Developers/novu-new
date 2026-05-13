import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  const users = await User.find().sort({ createdAt: -1 });

  return Response.json(users);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const hashed = await bcrypt.hash(body.password, 10);

  const user = await User.create({
    ...body,
    password: hashed,
  });

  return Response.json(user);
}
