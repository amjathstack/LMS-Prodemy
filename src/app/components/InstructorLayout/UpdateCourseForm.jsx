"use client";
import { hideUpdateCourseAddForm } from "@/app/lib/features/componentStatusSlice";
import { updateCourse } from "@/app/lib/features/coursesSlice";
import { ImageDown, LockIcon, ViewIcon, Trash, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function UpdateCoursePage({ data }) {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
    const [prevThum, setPrevThum] = useState(null);
    const [errors, setErrors] = useState({});

    const countWords = (text) => text.trim().split(/\s+/).length;

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        const titleWords = countWords(formData.title);
        if (titleWords < 3 || titleWords > 12) {
            newErrors.title = "Title must contain 3–12 words.";
        }

        const descWords = countWords(formData.description);
        if (descWords < 10 || descWords > 25) {
            newErrors.description = "Description must contain 10–25 words.";
        }

        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = "Price is required.";
        }

        if (Number(formData.offer) > 100) {
            newErrors.offer = "Offer cannot exceed 100%.";
        }

        if (!formData.thumbnail) {
            newErrors.thumbnail = "Thumbnail is required.";
        }

        const notesWords = countWords(formData.notes);
        if (notesWords < 30 || notesWords > 60) {
            newErrors.notes = "Notes must contain 30–60 words.";
        }

        if (formData.learningPoints.length < 3 || formData.learningPoints.length > 7) {
            newErrors.learningPoints = "Add 3–7 learning points.";
        }

        if (formData.lessons.length < 3) {
            newErrors.lessons = "Minimum 3 lessons are required.";
        }

        let previewFound = false;

        formData.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title.trim()) {
                newErrors[`lesson_${lessonIndex}`] = "Lesson title is required.";
            }

            lesson.lectures.forEach((lec, lecIndex) => {
                if (!lec.title.trim()) {
                    newErrors[`lec_title_${lessonIndex}_${lecIndex}`] =
                        "Lecture title is required.";
                }

                if (!lec.videoUrl.trim()) {
                    newErrors[`lec_url_${lessonIndex}_${lecIndex}`] =
                        "Video URL is required.";
                }

                if (!lec.duration || Number(lec.duration) <= 0) {
                    newErrors[`lec_duration_${lessonIndex}_${lecIndex}`] =
                        "Duration is required.";
                }

                if (lec.availability) previewFound = true;
            });
        });

        if (!previewFound) {
            newErrors.preview = "At least one lecture must be marked as Preview.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({});
        }

        const data = new FormData();
        data.append("courseId", formData._id);
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("language", formData.language);
        data.append("category", formData.category);
        data.append("price", formData.price);
        data.append("offer", formData.offer);
        data.append("thumbnail", formData.thumbnail);
        data.append("notes", formData.notes);
        data.append("learningPoints", JSON.stringify(formData.learningPoints));
        data.append("lessons", JSON.stringify(formData.lessons));

        dispatch(updateCourse(data));
        dispatch(hideUpdateCourseAddForm());
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        console.log(formData)
    };

    const handleLearningPointChange = (index, value) => {
        const updated = [...formData.learningPoints];
        updated[index] = value;
        setFormData({ ...formData, learningPoints: updated });
    };

    const addLearningPoint = () => {
        setFormData({
            ...formData,
            learningPoints: [...formData.learningPoints, ""],
        });
    };

    const removeLearningPoint = (i) => {
        const filtered = formData.learningPoints.filter((_, idx) => idx !== i);
        setFormData({ ...formData, learningPoints: filtered });
    };

    const handleLessonChange = (index, field, value) => {
        const updated = [...formData.lessons];
        updated[index][field] = value;
        setFormData({ ...formData, lessons: updated });
    };

    const handleLectureChange = (lessonIndex, lectureIndex, field, value) => {
        const updated = [...formData.lessons];
        updated[lessonIndex].lectures[lectureIndex][field] = value;
        setFormData({ ...formData, lessons: updated });
    };

    const addLesson = () => {
        setFormData({
            ...formData,
            lessons: [
                ...formData.lessons,
                {
                    title: "",
                    lectures: [
                        { title: "", videoUrl: "", duration: "", availability: false },
                    ],
                },
            ],
        });
    };

    const removeLesson = (lessonIdx) => {
        const filteredLessons = formData.lessons.filter(
            (_, index) => index !== lessonIdx
        );
        setFormData({ ...formData, lessons: filteredLessons });
    };

    const addLecture = (lessonIndex) => {
        const updated = [...formData.lessons];
        updated[lessonIndex].lectures.push({
            title: "",
            videoUrl: "",
            duration: "",
            availability: false,
        });
        setFormData({ ...formData, lessons: updated });
    };

    const handleRemoveLec = (lessonIdx, lectureIdx) => {
        const updated = [...formData.lessons];
        updated[lessonIdx].lectures = updated[lessonIdx].lectures.filter(
            (_, index) => index !== lectureIdx
        );
        setFormData({ ...formData, lessons: updated });
    };

    const handlePreview = (lessonIdx, lectureIdx) => {
        const updated = [...formData.lessons];
        updated[lessonIdx].lectures[lectureIdx].availability =
            !updated[lessonIdx].lectures[lectureIdx].availability;
        setFormData({ ...formData, lessons: updated });
    };

    function isFile(value) {
        return value instanceof File;
    }

    useEffect(() => {
        if (isFile(formData.thumbnail)) {
            setPrevThum(URL.createObjectURL(formData.thumbnail));
        } else {
            setPrevThum(formData.thumbnail)
        }
    }, [formData.thumbnail]);

    return (
        <div className="fixed flex flex-col items-center justify-center w-full h-[100vh] left-0 top-0 bg-black/40 text-sm z-50">
            <div className="max-h-[90%] w-full max-w-200 bg-white py-6 p-2 md:p-8 overflow-hidden rounded-sm shadow-lg">
                <div className="flex w-full items-center justify-between mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold">Edit Course</h2>
                    <button
                        className="cursor-pointer"
                        onClick={() => dispatch(hideUpdateCourseAddForm())}
                    >
                        <X />
                    </button>
                </div>

                <div className="max-h-[90%] px-3 bg-white overflow-y-scroll custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-10">

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

                            <div className="space-y-4">

                                <div>
                                    <label className="block text-sm mb-1 font-medium">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none"
                                        placeholder="Full Stack Bootcamp"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm mb-1 font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleChange("description", e.target.value)
                                        }
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md h-28 outline-none"
                                        placeholder="Learn MERN stack step by step"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Course Details</h3>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Language
                                    </label>
                                    <select
                                        value={formData.language}
                                        onChange={(e) => handleChange("language", e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none"
                                        required
                                    >
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none"
                                        placeholder="99"
                                        required
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Offer (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.offer}
                                        onChange={(e) => handleChange("offer", e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none"
                                        placeholder="10"
                                        required
                                    />
                                    {errors.offer && (
                                        <p className="text-red-500 text-xs mt-1">{errors.offer}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleChange("category", e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md outline-none"
                                        required
                                    >
                                        <option value={"development"}>Development</option>
                                        <option value={"design"}>Design</option>
                                        <option value={"marketing"}>Marketing</option>
                                        <option value={"business"}>Business</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">Thumbnail</h3>
                            <p className="text-[13px] mb-4">
                                Click on the image to change thumbnail
                            </p>

                            <label className="flex items-center max-w-65 justify-center gap-4 border border-gray-300 rounded-sm h-40 cursor-pointer hover:bg-gray-50 outline-none">
                                {prevThum || formData?.thumbnail ? (
                                    <Image
                                        src={prevThum || formData?.thumbnail}
                                        width={600}
                                        height={600}
                                        className="w-60 h-35 object-cover"
                                        alt="thumbnail"
                                    />
                                ) : (
                                    <>
                                        <ImageDown className="w-10 h-10 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">Upload Thumbnail</p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, WEBP allowed
                                            </p>
                                        </div>
                                    </>
                                )}

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleChange("thumbnail", e.target.files[0])
                                    }
                                />
                            </label>

                            {errors.thumbnail && (
                                <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Notes</h3>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md h-24 outline-none"
                                placeholder="Course notes here"
                                required
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Learning Points</h3>

                            <div className="space-y-3">
                                {formData.learningPoints.map((point, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2 bg-gray-50"
                                    >
                                        <input
                                            type="text"
                                            value={point}
                                            onChange={(e) =>
                                                handleLearningPointChange(idx, e.target.value)
                                            }
                                            className="w-full bg-transparent focus:outline-none"
                                            required
                                            placeholder={`Learning point ${idx + 1}`}
                                        />

                                        {formData.learningPoints.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLearningPoint(idx)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {errors.learningPoints && (
                                    <p className="text-red-500 text-xs">
                                        {errors.learningPoints}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={addLearningPoint}
                                    className="text-[#00753b] text-xs font-medium hover:underline"
                                >
                                    + Add Learning Point
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Lessons & Lectures
                            </h3>

                            {errors.lessons && (
                                <p className="text-red-500 text-xs mb-3">{errors.lessons}</p>
                            )}

                            {formData.lessons.map((lesson, lessonIdx) => (
                                <div
                                    key={lessonIdx}
                                    className="border-b md:border border-gray-200 rounded-lg py-2 md:p-5 md:bg-gray-50 mb-6"
                                >
                                    <input
                                        type="text"
                                        value={lesson?.title}
                                        required
                                        onChange={(e) =>
                                            handleLessonChange(lessonIdx, "title", e.target.value)
                                        }
                                        className="w-full border border-gray-300 px-3 py-2 rounded-sm font-medium mb-2 outline-none"
                                        placeholder="Lesson Title"
                                    />

                                    {errors[`lesson_${lessonIdx}`] && (
                                        <p className="text-red-500 text-xs mb-3">
                                            {errors[`lesson_${lessonIdx}`]}
                                        </p>
                                    )}

                                    {lesson.lectures.map((lecture, lectureIdx) => (
                                        <div
                                            key={lectureIdx}
                                            className="border border-gray-300 rounded-md p-4 mb-3 bg-white"
                                        >

                                            <div className="flex items-center gap-3 border-b border-gray-200 pb-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={lecture.title}
                                                    required
                                                    onChange={(e) =>
                                                        handleLectureChange(
                                                            lessonIdx,
                                                            lectureIdx,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full focus:outline-none"
                                                    placeholder={`Lecture ${lectureIdx + 1}`}
                                                />

                                                <div className="flex items-center gap-2">
                                                    {lecture.availability ? (
                                                        <button
                                                            type="button"
                                                            className="flex border border-gray-200 px-3 py-1 rounded-sm items-center gap-1 text-green-600 text-xs cursor-pointer"
                                                            onClick={() =>
                                                                handlePreview(lessonIdx, lectureIdx)
                                                            }
                                                        >
                                                            Preview <ViewIcon className="w-3 h-3" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="flex border border-gray-200 px-3 py-1 rounded-sm items-center gap-1 text-red-600 text-xs cursor-pointer"
                                                            onClick={() =>
                                                                handlePreview(lessonIdx, lectureIdx)
                                                            }
                                                        >
                                                            Locked <LockIcon className="w-3 h-3" />
                                                        </button>
                                                    )}

                                                    {lesson.lectures.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveLec(lessonIdx, lectureIdx)
                                                            }
                                                            className="p-[6px] border border-gray-200 rounded-full text-red-600 cursor-pointer"
                                                        >
                                                            <Trash className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {errors[`lec_title_${lessonIdx}_${lectureIdx}`] && (
                                                <p className="text-red-500 text-xs mb-2">
                                                    {errors[`lec_title_${lessonIdx}_${lectureIdx}`]}
                                                </p>
                                            )}

                                            <input
                                                type="text"
                                                value={lecture.videoUrl}
                                                required
                                                onChange={(e) =>
                                                    handleLectureChange(
                                                        lessonIdx,
                                                        lectureIdx,
                                                        "videoUrl",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-200 px-3 py-2 rounded-md mb-1 outline-none"
                                                placeholder="YouTube video URL"
                                            />

                                            {errors[`lec_url_${lessonIdx}_${lectureIdx}`] && (
                                                <p className="text-red-500 text-xs mb-2">
                                                    {errors[`lec_url_${lessonIdx}_${lectureIdx}`]}
                                                </p>
                                            )}

                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">
                                                    Duration (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={lecture.duration}
                                                    onChange={(e) =>
                                                        handleLectureChange(
                                                            lessonIdx,
                                                            lectureIdx,
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-200 px-3 py-2 rounded-sm outline-none"
                                                    placeholder="e.g. 12"
                                                />

                                                {errors[
                                                    `lec_duration_${lessonIdx}_${lectureIdx}`
                                                ] && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {
                                                                errors[
                                                                `lec_duration_${lessonIdx}_${lectureIdx}`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => addLecture(lessonIdx)}
                                            className="text-[#00753b] p-1 px-2 bg-gray-100 rounded-sm text-xs hover:underline"
                                        >
                                            + Add Lecture
                                        </button>

                                        {formData.lessons.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLesson(lessonIdx)}
                                                className="text-red-600 p-1 px-2 bg-gray-100 rounded-sm text-xs cursor-pointer"
                                            >
                                                Remove Lesson
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {errors.preview && (
                                <p className="text-red-500 text-xs mb-3">{errors.preview}</p>
                            )}

                            <button
                                type="button"
                                onClick={addLesson}
                                className="text-[#00753b] p-1 px-2 bg-gray-100 rounded-sm text-xs hover:underline"
                            >
                                + Add Lesson
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#00753b] text-white py-3 rounded-md hover:bg-[#00753b]/90 text-sm"
                        >
                            Update Course
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}