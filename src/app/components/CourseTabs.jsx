"use client"
import { useState } from "react";
import ReviewSection from "./ReviewSection";

export default function EnrolledCourseTabs({ course }) {

    const [tab, setTab] = useState("reviews");

    return (
        <div className="mt-6 px-3 sm:px-0">
            <div className="flex gap-1 border-b">
                {["reviews", "overview", "notes"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 text-sm ${tab === t ? "border-b-2 border-[#00753b] font-medium text-[#00753b]" : "text-gray-600 hover:text-[#00753b]/90"
                            }`}
                        role="tab"
                        aria-selected={tab === t}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {tab === "overview" && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-700">{course?.description}</p>
                        <ul className="w-full sm:max-w-150 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {course?.learningPoints?.map((item, index) => (
                                <li key={index} className="flex items-center gap-1">
                                    <span className="text-green-700">•</span>
                                    <span className="text-sm">{item}</span>
                                </li>
                            ))
                            }

                        </ul>
                        <div className="text-xs text-gray-500">
                            Last updated: {new Date(course?.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })} • Language: {course?.language}
                        </div>

                    </div>
                )}
                {tab === "notes" && (
                    <div className="space-y-3">
                        <div className="rounded-sm">
                            <div className="text-lg">Notes:</div>
                            <p className="text-sm max-w-230">{course?.notes}</p>
                        </div>
                    </div>
                )}
                {tab === "reviews" && (
                    <div className="w-full md:max-w-[50%] rounded-lg bg-white p-4">
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">Comments</h3>

                        <div className="w-full h-px bg-gray-200" />

                        {
                            Array.isArray(course?.comments) &&
                            <ReviewSection comments={course?.comments} />
                        }


                    </div>
                )}
            </div>
        </div>
    );
}