"use client";
import { deleteCourse, deleteCourseIns } from "@/app/lib/features/coursesSlice";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";

export default function ConfirmPopupCard({ courseTitle, courseId, setShow }) {

    const dispatch = useDispatch();

    const handleDeleteButton = async () => {
        setShow(false);
        dispatch(deleteCourseIns(courseId));
        dispatch(deleteCourse(courseId));
    }

    return (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 animate-fadeIn scale-95">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Delete Course</h2>
                    <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center mb-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
                    <p className="text-gray-700 text-sm">
                        Are you sure you want to delete this course?
                    </p>
                    <p className="text-gray-900 font-medium mt-1">
                        “{courseTitle}”
                    </p>
                </div>

                <p className="text-xs text-gray-500 text-center mb-6">
                    This action cannot be undone. All lessons, lectures, and student progress will be permanently removed.
                </p>

                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={() => setShow(false)}
                        className="w-1/2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => handleDeleteButton()}
                        className="w-1/2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2 transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
}
