"use client"
import CourseTabs from "@/app/components/CourseTabs";
import CurriculumSidebar from "@/app/components/CurriculumSidebars";
import LoadingPage from "@/app/components/LoadingPage";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CoursePage({ params }) {

    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchCourse() {
        try {

            const response = await axios.get(`/api/course-by-id?courseId=${id}`);
            if (response.data.status) {
                setCourse(response.data.message?.courseDetails);
                setLoading(false)
            } else {
                toast(response.data.message);
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    const totalRatings = course?.comments?.reduce((total, i) => total + (i?.rating || 0), 0) || 0;

    const lct =
        course?.lessons?.flatMap((i) =>
            i?.lectures?.map((lec) => ({
                title: lec?.title,
                videoUrl: lec?.videoUrl,
                duration: lec?.duration,
                availability: lec?.availability,
            })) ?? []
        ) ?? [];

    const [lctIndex, setLctIndex] = useState(0);
    const [activeItem, setActiveItem] = useState(lct[0] ?? null);

    useEffect(() => {
        if (lct.length > 0) {
            setActiveItem(lct[0]);
            setLctIndex(0);
        }
    }, [course]);

    const handlePrev = () => {
        if (lctIndex > 0) {
            setLctIndex((prev) => prev - 1);
            setActiveItem(lct[lctIndex - 1]);
        }
    };

    const handleNext = () => {
        if (lctIndex < lct.length - 1 && lct[lctIndex + 1].availability) {
            setLctIndex((prev) => prev + 1);
            setActiveItem(lct[lctIndex + 1]);
        }
    };

    useEffect(() => {
        fetchCourse()
    }, [])

    if (loading) {
        return <LoadingPage />
    }

    return (
        <div className="min-h-screen">
            <header className="top-0 z-30 border-b border-gray-200 bg-white">
                <div className="flex w-full items-center justify-between px-4 py-5">
                    <div>
                        <h1 className="text-lg font-semibold">{course?.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>⭐ {(course?.comments?.length ? (totalRatings / course?.comments.length).toFixed(1) : 0)}</span>
                            <span>• {course?.studentsCount?.toLocaleString()} students</span>
                            <span>• {course?.instructorId?.name}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                            <span>Last updated: {new Date(course?.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}</span>
                            <span>• English</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={lctIndex === 0}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={lctIndex === lct.length - 1 || !lct[lctIndex + 1]?.availability}
                            className="rounded-md bg-[#00753b] px-3 py-1.5 text-sm text-white hover:bg-[#00753b]/90 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </header>

            <main className="grid w-full grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
                <div className="max-w-[800px] lg:col-span-2">
                    <iframe
                        title="course-video"
                        className="w-full h-[420px]"
                        src={(() => {
                            try {
                                new URL(activeItem?.videoUrl);
                                return activeItem.videoUrl;
                            } catch {
                                return "http://no-video-available";
                            }
                        })()}
                    />
                    <div className="mt-3 flex items-center justify-between text-[14px] text-gray-600">
                        <span>
                            {activeItem?.title} • {activeItem?.duration}
                        </span>
                    </div>
                </div>
                <div className="col-span-1">
                    <CurriculumSidebar
                        curriculum={course?.lessons}
                        activeItem={activeItem}
                        setLctIndex={setLctIndex}
                        setActiveItem={setActiveItem}
                    />
                </div>
            </main>
            <CourseTabs course={course} totalRatings={totalRatings} />
        </div>
    );
}

