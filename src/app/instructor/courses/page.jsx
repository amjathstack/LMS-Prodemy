"use client"
import Image from "next/image";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { showCourseAddForm, showUpdateCourseAddForm } from "@/app/lib/features/componentStatusSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopupCard from "../../components/InstructorLayout/DeletePopupCard";
import { fetchInstructorCourses } from "@/app/lib/features/coursesSlice";

export default function CoursesPage() {

    const dispatch = useDispatch()
    const { instructorCoursesList, loading } = useSelector((state) => state.courses);

    const [showPopup, setShowPopup] = useState(false)
    const [courseId, setCourseId] = useState("");
    const [courseTitle, setCourseTitle] = useState("");

    const handleDelete = (id, title) => {
        setCourseId(id);
        setCourseTitle(title);
        setShowPopup(true);
    };

    const handleEdit = (id) => {
        const filteredCourse = instructorCoursesList?.find((item) => item?._id === id);
        dispatch(showUpdateCourseAddForm(filteredCourse));
    };

    useEffect(() => {
        dispatch(fetchInstructorCourses());
    }, [dispatch]);

    if (loading) return (


        loading &&
        (
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


    )

    return (
        <div className="lg:ml-64 p-4 sm:p-6 md:p-10">
            {showPopup && <ConfirmPopupCard courseId={courseId} courseTitle={courseTitle} setShow={setShowPopup} />}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Manage Courses</h3>

                <button
                    onClick={() => dispatch(showCourseAddForm())}
                    className="flex items-center border border-[#00753b] gap-2 rounded px-3 py-1 text-[13px] sm:text-sm text-[#00753b] hover:bg-gray-300 w-full sm:w-auto justify-center"
                >
                    <PlusCircle className="h-4 w-4" /> Add New Course
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-sm">
                {!loading && instructorCoursesList?.length > 0 && (
                    <>
                        <div className="hidden  lg:block md:max-w-600 lg:max-w-full">
                            <table className="min-w-[700px] w-full text-xs sm:text-sm">
                                <tbody>
                                    {Array.isArray(instructorCoursesList) &&
                                        instructorCoursesList.map((course, index) => (
                                            <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <Image
                                                        src={course?.thumbnail}
                                                        alt={course?.title}
                                                        width={300}
                                                        height={300}
                                                        className="w-16 h-10 sm:w-20 sm:h-12 rounded object-cover"
                                                    />
                                                </td>

                                                <td className="px-4 py-2 font-medium max-w-[120px] truncate">
                                                    {course.title}
                                                </td>

                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {course.students || "No Enrollments yet"}
                                                </td>

                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {course.rating ? `⭐ ${course.rating}` : "No ratings yet"}
                                                </td>

                                                <td className="px-4 py-2">
                                                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                                        Published
                                                    </span>
                                                </td>

                                                <td className="px-4 py-2 flex flex-col justify-center sm:flex-row gap-2">
                                                    <button
                                                        onClick={() => handleEdit(course._id)}
                                                        className="flex mt-4 items-center gap-1 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                                                    >
                                                        <Pencil className="h-3 w-3" /> Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(course._id, course?.title)}
                                                        className="flex mt-4 items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="block lg:hidden">
                            {instructorCoursesList.map((course, index) => (
                                <div key={index} className="mt-2 border border-gray-300 p-4 space-y-3">

                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            width={300}
                                            height={300}
                                            className="w-20 h-14 rounded object-cover"
                                        />
                                        <div className="font-semibold text-sm">{course.title}</div>
                                    </div>

                                    <div className="text-xs text-gray-600">
                                        Students: {course.students || "No Enrollments yet"}
                                    </div>

                                    <div className="text-xs text-gray-600">
                                        Rating: {course.rating ? `⭐ ${course.rating}` : "No ratings yet"}
                                    </div>

                                    <div className="flex w-full items-center justify-between">
                                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                            Published
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(course._id)}
                                                className="flex items-center gap-1 rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                                            >
                                                <Pencil className="h-3 w-3" /> Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(course._id, course?.title)}
                                                className="flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading && Array.isArray(instructorCoursesList) && instructorCoursesList.length === 0 &&
                    <p className="p-4 text-center text-gray-600">You have no added courses</p>
                }

            </div>
        </div>
    );
}
