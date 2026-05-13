import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: Request, { params }: any) {
  await connectDB();

  const body = await req.json();

  const updated = await User.findByIdAndUpdate(
    params.id,
    { $set: body },
    { new: true },
  );

  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();

  await User.findByIdAndDelete(params.id);

  return Response.json({ success: true });
}
