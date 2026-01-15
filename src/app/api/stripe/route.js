import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "../../../../config/connectDB";
import enrolledCourseModel from "../../../../models/EnrolledCourse";
import courseModel from "../../../../models/Course";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    await connectDB();

    const existingEnrollment = await enrolledCourseModel.findOne({
      studentId: userId,
      courseId: courseId,
    });

    if (!existingEnrollment) {
      const course = await courseModel.findById(courseId);

      if (!course) {
        return new NextResponse("Course not found", { status: 404 });
      }

      await enrolledCourseModel.create({
        instructorId: course.instructorId,
        studentId: userId,
        courseId: course._id,

        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        language: course.language,

        lessons: course.lessons,
        learningPoints: course.learningPoints,
        notes: course.notes,
      });

      await courseModel.findByIdAndUpdate(courseId, {
        $inc: { studentsCount: 1 },
      });
    }
  }

  console.log('Working!')

  return NextResponse.json({ received: true });
}
