import { hash } from "bcrypt";
import connectDB from "../../../../config/connectDB";
import userModel from "../../../../models/User";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function POST(request) {
    try {

        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());
        const password = data.password;
        let hashedPassword = await hash(password, 10);

        await connectDB();
        await userModel.create({ ...data, password: hashedPassword });

        return NextResponse.json({ status: true, message: 'User account created successfully!' });

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

        const form = await request.formData();

        const name = form.get("name");
        const role = form.get("role");
        const title = form.get("title");
        const bio = form.get("bio");
        const profileImage = form.get("profileImage");

        const isFile =
            profileImage &&
            typeof profileImage === "object" &&
            typeof profileImage.arrayBuffer === "function" &&
            profileImage.size > 0;

        let updatedProfile = '';

        if (isFile) {
            const bytes = await profileImage.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const result = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString("base64")}`, {
                folder: "myApp/uploads",
            });

            updatedProfile = result.secure_url;
        }


        let updatedData = {};

        if (name) updatedData.name = name;
        if (role) updatedData.role = role;
        if (title) updatedData.title = title;
        if (bio) updatedData.bio = bio;
        if (updatedProfile) updatedData.profileImage = updatedProfile;


        const response = await userModel.findByIdAndUpdate(session?.user.id, updatedData, { new: true });

        return NextResponse.json({ status: true, message: response });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }
}