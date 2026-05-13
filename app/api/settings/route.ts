import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return Response.json(settings);
}

export async function PATCH(req: Request) {
  await connectDB();

  const body = await req.json();

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true },
  );

  return Response.json(settings);
}
