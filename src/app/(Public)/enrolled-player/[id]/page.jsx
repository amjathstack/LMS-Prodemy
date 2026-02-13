"use client"
import React, { useEffect } from "react";
import { useState } from "react";
import CourseTabs from "@/app/components/EnrolledCourseTabs";
import EnrolledCurriculumSidebar from "@/app/components/EnrolledCurriculumSidebar";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingPage from "@/app/components/LoadingPage";


export default function CoursePage({ params }) {

    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const [enrolledCourse, setEnrolledCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchEnrolledCourse() {
        try {

            const response = await axios.get(`/api/enroll-course-by-id?courseId=${id}`)
            if (response.data.status) {
                setEnrolledCourse(response.data.message);
                setLoading(false)
            } else {
                toast(response.data.message)
            }

            console.log(response.data)

        } catch (error) {

            console.error(error.message)

        }
    }

    const totalRatings =
        enrolledCourse?.courseId?.comments?.reduce(
            (total, i) => total + (i?.rating || 0),
            0
        ) || 0;

    const averageRating =
        enrolledCourse?.courseId?.comments?.length > 0
            ? (totalRatings / enrolledCourse.courseId.comments.length).toFixed(1)
            : null;

    const lct =
        enrolledCourse?.lessons?.flatMap((i) =>
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
    }, [enrolledCourse]);

    const handlePrev = () => {
        if (lctIndex > 0) {
            setLctIndex((prev) => prev - 1);
            setActiveItem(lct[lctIndex - 1]);
        }
    };

    const handleNext = () => {
        if (lctIndex < lct.length - 1) {
            setLctIndex((prev) => prev + 1);
            setActiveItem(lct[lctIndex + 1]);
        }
    };

    useEffect(() => {
        fetchEnrolledCourse()
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    if (loading) {
        return <LoadingPage />
    }

    return (
        <div className="min-h-screen">
            <header className="top-0 z-30 border-b border-gray-200 bg-white">
                <div className="flex w-full items-center justify-between px-4 py-5">
                    <div>
                        <h1 className="text-lg font-semibold">{enrolledCourse?.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>⭐ {averageRating}</span>
                            <span>• {enrolledCourse?.courseId?.studentsCount?.toLocaleString()} students</span>
                            <span>• {enrolledCourse?.instructorId?.name}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                            <span>Last updated: {new Date(enrolledCourse?.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}</span>
                            <span>• English</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={lctIndex === 0}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={lctIndex === lct.length - 1}
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
                        className="w-full h-[270px] md:h-[420px]"
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
                    <EnrolledCurriculumSidebar
                        courseId={enrolledCourse?._id}
                        initialCurriculum={enrolledCourse?.lessons}
                        activeItem={activeItem}
                        setLctIndex={setLctIndex}
                        setActiveItem={setActiveItem}
                    />
                </div>
            </main>
            <CourseTabs course={enrolledCourse} />
        </div>
    );
}

