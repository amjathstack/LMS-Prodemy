"use client"
import { User } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { addEnrolledCourseIns, enrollCourse } from "@/app/lib/features/enrolledCoursesSlice";
import { updateStudentsCountIns } from "@/app/lib/features/coursesSlice";
import ReviewSection from "@/app/components/ReviewSection";
import EnrollCard from "@/app/components/EnrollCard";
import CourseLessons from "@/app/components/CourseLessons";

export function CourseDetailsPage({ course }) {

    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const handleBuyBtn = async () => {
        if (session) {

            if (session?.user.role === "Instructor") {
                toast("This account cannot enroll any courses!")
            } else {

                const formData = new FormData();

                formData.append("instructorId", course?.instructorId._id);
                formData.append("courseId", course?._id);
                formData.append("title", course?.title);
                formData.append("description", course?.description);
                formData.append("price", course?.price);
                formData.append("language", course?.language);
                formData.append("thumbnail", course?.thumbnail);
                formData.append("notes", course?.notes);
                formData.append("learningPoints", JSON.stringify(course?.learningPoints));
                formData.append("lessons", JSON.stringify(course?.lessons));

                try {
                    dispatch(addEnrolledCourseIns({
                        instructorId: course?.instructorId?._id,
                        studentId: session?.user?.id,
                        courseId: course?._id,
                        title: course?.title,
                        description: course?.description,
                        price: course?.price,
                        language: course?.language,
                        thumbnail: course?.thumbnail,
                        notes: course?.notes,
                        learningPoints: course?.learningPoints,
                        lessons: course?.lessons,
                    }));
                    dispatch(enrollCourse(formData));
                    dispatch(updateStudentsCountIns(course?._id));
                    router.push(`/enrolled-player/${course?._id}`);
                } catch (error) {
                    console.error(error);
                }
            }

        } else {
            return toast("You have to login enroll the courses.")
        }
    }

    return (
        <div className="min-h-screen">

            <section className="bg-white">
                <div className="max-w-full px-4 py-10 grid lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">

                        <h1 className="text-3xl font-bold">{course?.title}</h1>
                        <p className="mt-2 text-lg text-gray-700 max-w-200">{course?.description}</p>

                        <div className="max-w-6xl py-10">
                            <h2 className="text-xl font-semibold">Instructor</h2>

                            <div className="mt-4 flex items-start gap-3">
                                <div className="mt-1 p-1 border rounded-full">
                                    <User className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-semibold">{course?.instructorId.name}</p>
                                    <p className="text-sm text-gray-600">{course?.instructorId.title}</p>
                                    <p className="text-sm text-gray-700">{course?.instructorId.bio}</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span>⭐ {totalRatings && (totalRatings / course?.comments.length).toFixed(1)} ({course?.comments.length} ratings)</span>
                            <span>• {course?.studentsCount.toLocaleString()} students</span>
                            <span>• Last update {new Date(course?.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}</span>
                            <span>• {course?.language}</span>
                        </div>

                        <CourseLessons lessons={course?.lessons} />

                        <section className="py-10">
                            <h2 className="text-xl font-semibold">Student Reviews</h2>
                            <div className="mt-4 space-y-4">
                                <ReviewSection comments={course?.comments} />
                            </div>
                        </section>

                    </div>

                    <EnrollCard course={course} handleBuyBtn={handleBuyBtn} />

                </div>
            </section>
        </div>
    );
}