import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EnrolledCurriculumSidebar({ courseId, initialCurriculum, setActiveItem, activeItem, setLctIndex }) {

    const [curriculum, setCurriculum] = useState(initialCurriculum || []);
    const [isAllLecturesCompleted, setIsAllLecturesCompleted] = useState(false)

    const handleCheckedBtn = async (sectionIndex, lectureIndex) => {

        const updatedCurriculum = curriculum.map((sec, i) => {
            if (i !== sectionIndex) return sec;
            return {
                ...sec,
                lectures: sec.lectures.map((lec, j) => {
                    if (j !== lectureIndex) return lec;
                    return { ...lec, completed: !lec.completed };
                })
            };
        });

        setCurriculum(updatedCurriculum);

        const response = await axios.put("/api/enroll-course", { courseId: courseId, lessons: updatedCurriculum });

        if (response.data.status) {
            toast("Course updated!")
        }

    };

    const getGlobalIndex = (sectionIndex, lectureIndex) => {
        let count = 0;

        for (let s = 0; s < sectionIndex; s++) {
            count += curriculum[s].lectures.length;
        }

        return count + lectureIndex;
    };


    useEffect(() => {
        setCurriculum(initialCurriculum || []);
    }, [initialCurriculum]);

    useEffect(() => {
        const allCompleted = curriculum?.every(section =>
            section.lectures.every(lecture => lecture.completed)
        );
        setIsAllLecturesCompleted(allCompleted);
    }, [curriculum])

    return (
        <aside className="top-20 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Course content</h3>
                <span className="text-xs text-gray-500">
                    {curriculum.reduce((total, item) => total + item.lectures.length, 0)} lectures
                </span>
            </div>

            <div className="space-y-2">
                {curriculum?.map((sec, i) => (
                    <div key={sec._id} className="rounded-sm border border-gray-200">
                        <button className="flex w-full items-center justify-between bg-gray-50 px-3 py-2 text-left">
                            <span className="text-sm font-medium">{sec.title}</span>
                        </button>

                        {sec?.lectures && (
                            <ul>
                                {sec.lectures.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => {
                                                setActiveItem(item);
                                                setLctIndex(getGlobalIndex(i, index));
                                            }}
                                            className={`flex w-full items-center border-b border-gray-200 justify-between px-3 py-2 text-left 
                                               ${activeItem?.title === item?.title ? "bg-green-50" : "hover:bg-gray-50 cursor-pointer"}`}
                                            aria-current={activeItem?.title === item?.title ? "true" : "false"}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm">{item.title}</span>
                                                <span className="text-xs text-gray-500">{item.duration} min</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-1 sm:gap-2 rounded-md border border-green-400 bg-green-50 px-2 py-1 sm:px-3 py-2 text-[12px] font-medium cursor-pointer transition-all hover:bg-green-100 hover:border-green-500">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed || false}
                                                        onChange={() => handleCheckedBtn(i, index)}
                                                        className="h-3 w-3 sm:h-4 w-4 accent-green-600 cursor-pointer"
                                                    />
                                                    <span className="select-none hidden sm:flex">Mark as complete</span>
                                                </label>

                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                {isAllLecturesCompleted
                    ? <button
                        className="rounded-sm text-center text-sm w-full items-center border border-gray-200 justify-between px-3 py-2"
                    >
                        <p>Download your Certificate</p>
                    </button>
                    : <button
                        disabled
                        className="rounded-sm text-center text-sm w-full items-center border border-gray-200 justify-between px-3 py-2 cursor-not-allowed opacity-60"
                    >
                        <p>Certificate</p>
                    </button>}
            </div>
        </aside>
    );
}