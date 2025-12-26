"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import ReviewSection from "./ReviewSection";
import axios from "axios";

export default function EnrolledCourseTabs({ course }) {
    const [tab, setTab] = useState("reviews");
    const { data: session } = useSession();

    const [comments, setComments] = useState(course?.courseId.comments || []);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [commentText, setCommentText] = useState("");

    const handlePostComment = async () => {
        if (commentText.trim() && rating > 0) {

            setComments((prev) => [...prev, {
                comment: commentText,
                rating,
                userId: {
                    name: session?.user?.name,
                    profileImage: session?.user.profileImage || "",
                    _id: session?.user.id
                },
                _id: course?.courseId?._id,
            }]);

            setCommentText("");
            setRating(0);

            const response = await axios.post("/api/course/comment", { courseId: course?.courseId?._id, rating, comment: commentText }, { headers: { "Content-Type": "application/json" } });

            if (response.data.status && response.data.message) {
                toast("Review added");
            }

        } else {

            toast("Please provide both a rating and a comment.");

        }
    };

    useEffect(() => {
        setComments(course?.courseId.comments)
    }, [course])

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

                        <div className="flex items-start gap-3 mb-6">

                            <div className="flex-1">
                                <div className="flex mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="focus:outline-none"
                                        >
                                            <FaStar
                                                size={20}
                                                className={`mr-1 cursor-pointer ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="w-full max-h-25 rounded-md border border-gray-300 bg-gray-50 p-2 text-sm focus:outline-none"
                                    rows={3}
                                />

                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={handlePostComment}
                                        className="rounded-sm bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-black/90"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-200" />

                        {
                            Array.isArray(course?.courseId?.comments) &&
                            <ReviewSection comments={comments} />
                        }


                    </div>
                )}
            </div>
        </div>
    );
}