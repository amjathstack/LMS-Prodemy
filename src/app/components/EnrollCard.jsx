"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

export default function EnrollCard({ course, isEnrolled }) {

    const router = useRouter();
    const { data: session } = useSession()

    const handleBuyBtn = async () => {
        if (session) {

            if(session?.user.role === "none"){
                return toast("Please Complete your profile!");
            }

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
                    const response = await axios.post("/api/order/stripe", formData);
                    if (response.data.status) {
                        window.location.href = response.data.url
                    }
                } catch (error) {
                    console.error(error);
                }
            }

        } else {
            return toast("You have to login enroll the courses.")
        }
    }

    return (

        <div>
            <div className="max-w-90 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

                {course?.thumbnail &&
                    <Image
                        src={course?.thumbnail}
                        alt={course?.title}
                        width={300}
                        height={300}
                        className="h-50 w-full object-cover"
                    />
                }
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold">${course?.price - (course?.price * course?.offer / 100)}</span>
                        <span className="text-sm text-gray-500 line-through">${course?.price}</span>
                        <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">{course?.offer}% off</span>
                    </div>
                    <div className="py-5">
                        <h2 className="text-xl font-semibold">What you'll learn</h2>
                        <ul className="mt-4 flex flex-col gap-1">
                            {course?.learningPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[12px] text-gray-700">
                                    <span className="text-green-600">✔</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {isEnrolled
                        ? <button onClick={() => router.push(`/enrolled-player/${course?._id}`)} className="mt-2 w-full rounded bg-[#00753b] px-4 py-2 text-white hover:bg-[#00753b]/90 cursor-pointer">
                            Resume
                        </button>
                        :
                        <>
                            <button onClick={() => handleBuyBtn()} className="mt-2 w-full rounded bg-[#00753b] px-4 py-2 text-white hover:bg-[#00753b]/90 cursor-pointer">
                                Buy Now
                            </button>
                            <button onClick={() => router.push(`/player/${course?._id}`)} className="mt-2 w-full rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                Preview
                            </button>
                        </>
                    }


                    <p className="mt-3 text-xs text-gray-500">No 30-Day Money-Back Guarantee</p>
                </div>
            </div>
        </div>

    )
}