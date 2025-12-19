import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  
  try {
    await connectToDatabase();

    const formData = await req.formData();

    // Convert formData into an object
    const event: any = {};

    for (const [key, value] of formData.entries()) {
      // Convert repeated keys (agenda, tags) into arrays
      if (key === "agenda" || key === "tags") {
        if (!event[key]) event[key] = [];
        event[key].push(value);
      } else {
        event[key] = value;
      }
    }


    const file= formData.get("image") as File;
    if (!file) return NextResponse.json({ message: "Image file is required" }, { status: 400 });

    let tags=JSON.parse(formData.get("tags") as string);
    let agenda=JSON.parse(formData.get("agenda") as string);


    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {resource_type:"image", folder: "DevEvent" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    event.image = (uploadResult as any).secure_url;
    // Create event in DB
    const createdEvent = await Event.create(
      {...event, tags, agenda}
    );

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing event data:", error);

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({message:"Events fetched successfully" ,events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
