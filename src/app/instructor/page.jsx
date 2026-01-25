"use client"
import axios from "axios";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

    const [data, setData] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const stats = {
        students: data?.totalStudents?.length || 0,
        reviews: data?.totalReviews || 0,
        earnings: data?.totalEarnings || 0,
        courses: data?.totalCourses?.length || 0,
    };

    async function fetchDashboardData() {
        try {

            const response = await axios.get(`/api/instructor/dashboard`);

            if (response.data.status) {
                setData(response.data.message);
                console.log(response.data.message);
            } else {
                toast(response.data.message);
            }

        } catch (error) {
            console.error(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return (

        loading &&
        <div className="flex items-center justify-center w-full min-h-[450px]">
            <svg
                className="w-15 h-15 animate-spin text-gray-400 fill-black"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"
                />
            </svg>
        </div>

    )



    return (
        <div className="lg:ml-64 p-10">
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-sm bg-white p-4 border border-gray-200 text-center">
                    <p className="text-lg font-bold">{stats.students.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="rounded-sm bg-white p-4 border border-gray-200 text-center">
                    <p className="text-lg font-bold">{stats.reviews.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                </div>
                <div className="rounded-sm bg-white p-4 border border-gray-200 text-center">
                    <p className="text-lg font-bold">${stats.earnings.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Earnings</p>
                </div>
                <div className="rounded-sm bg-white p-4 border border-gray-200 text-center">
                    <p className="text-lg font-bold">{stats.courses}</p>
                    <p className="text-xs text-gray-500">Courses</p>
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-md font-semibold mb-4">Recent Courses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.recentStudents.length > 0
                        ? data?.recentCourses?.map((course) => (
                            <div key={course._id} className="rounded-sm border border-gray-300 bg-white p-4">
                                <h4 className="text-sm font-semibold">{course.title}</h4>
                                <p className="text-xs text-gray-500">
                                    {course.studentsCount} students • ⭐{" "}
                                    {course?.comments?.length
                                        ? (
                                            course.comments.reduce((t, c) => t + c.rating, 0) /
                                            course.comments.length
                                        ).toFixed(1)
                                        : "0"}
                                </p>

                                <button onClick={() => router.push("/instructor/courses")} className="mt-2 w-full border border-[#00753b] rounded-sm px-3 py-1 text-sm text-[#00753b] hover:bg-gray-100">
                                    Manage
                                </button>
                            </div>
                        ))
                        : <span>You have no added</span>
                    }
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-md font-semibold mb-4">Recent Students</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.recentStudents && data?.recentCourses.length > 0
                        && data?.recentStudents?.map((s) => (
                            <div
                                key={s?.user._id}
                                className="bg-white border border-gray-200 rounded-sm p-4 transition"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {s?.user.profileImage ? (
                                        <Image
                                            src={s.user.profileImage}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover w-10 h-10"
                                            alt={s.user.name}
                                        />
                                    ) : (
                                        <User className="border border-gray-300 w-10 h-10 rounded-full p-2 text-gray-500" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {s.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {s.user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Enrolled Course</p>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                        {s.title}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span
                                        className={`inline-flex items-center rounded-sm px-3 py-1 text-xs font-medium ${s.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))
                    }

                    {data?.recentStudents?.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No students found.
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h3 className="text-md font-semibold mb-4">Announcements</h3>
                <div className="bg-white rounded-sm border border-gray-300 p-4 text-sm">
                    <p className="text-gray-700">📢 New feature: Add quizzes to your courses!</p>
                    <p className="text-gray-700 mt-2">✅ Reminder: Update your instructor bio for better visibility.</p>
                </div>
            </section>
        </div>
    );
}
