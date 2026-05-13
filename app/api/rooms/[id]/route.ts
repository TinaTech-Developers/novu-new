import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";

// ================= GET SINGLE ROOM =================
export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();

    const room = await Room.findById(params.id);

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    return Response.json(room);
  } catch (error) {
    return Response.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

// ================= UPDATE ROOM =================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params; // ✅ FIX HERE
    const body = await req.json();

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: "after" }, // ✅ replaces deprecated "new"
    );

    if (!updatedRoom) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    return Response.json(updatedRoom);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ================= DELETE ROOM =================
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();

    const deletedRoom = await Room.findByIdAndDelete(params.id);

    if (!deletedRoom) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    return Response.json({ message: "Room deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
