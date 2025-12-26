import { NextResponse } from "next/server";
import enrolledCourseModel from "../../../../../models/EnrolledCourse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ status: false, message: "Unauthorized" })
        }

        const response = await enrolledCourseModel.find({ instructorId: session.user.id }).populate("studentId");

        const students = Array.from(
            new Map(
                response.map(item => [item.studentId?._id, { title: item.title, user: item.studentId },])
            ).values()
        );

        return NextResponse.json({ status: true, message: students });

    } catch (error) {

        return NextResponse.json({ status: false, message: error.message });

    }




}