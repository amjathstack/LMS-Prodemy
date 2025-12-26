import { NextResponse } from "next/server";
import connectDB from "../../../../../config/connectDB";
import courseModel from "../../../../../models/Course";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }

        const formData = await request.formData();

        const data = Object.fromEntries(formData.entries());
        const thumbnail = formData.get("thumbnail");

        const lessons = JSON.parse(data.lessons);
        const learningPoints = JSON.parse(data.learningPoints);
        const price = JSON.parse(data.price);
        const offer = JSON.parse(data.offer);

        const bytes = await thumbnail.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'myApp/uploads' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result);
                });

            stream.end(buffer);
        });

        await connectDB();
        const response = await courseModel.create({
            ...data,
            instructorId: session?.user.id,
            thumbnail: result.secure_url,
            price: Number(price),
            offer: Number(offer),
            lessons,
            learningPoints,
        });

        console.log('done')

        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }
}

export async function GET() {

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }

        await connectDB();
        const data = await courseModel.find({ instructorId: session.user.id });
        return NextResponse.json({ status: true, message: data });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }

}

export async function PUT(request) {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }
        
        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());
        const courseId = formData.get("courseId");
        const thumbnail = formData.get("thumbnail");

        const lessons = JSON.parse(data.lessons);
        const learningPoints = JSON.parse(data.learningPoints);
        const price = JSON.parse(data.price);
        const offer = JSON.parse(data.offer);

        let result = ""

        if (thumbnail instanceof File) {
            const bytes = await thumbnail.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const preResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'myApp/uploads' },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result);
                    });

                stream.end(buffer);
            });
            result = preResult.secure_url
        } else {
            result = thumbnail
        }

        await connectDB();
        const response = await courseModel.findByIdAndUpdate(courseId, {
            ...data,
            instructorId: session.user.id,
            thumbnail: result,
            price: Number(price),
            offer: Number(offer),
            lessons,
            learningPoints,
        }, { new: true });
        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }

}

export async function DELETE(request) {
    try {
        const body = await request.json();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }
        
        const { Id } = body;
        await connectDB();
        const response = await courseModel.findByIdAndDelete(Id);
        return NextResponse.json({ status: true, message: response });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}