import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EnrolledCourseCard({ course }) {

    const totalLectures = course?.lessons?.reduce((total, lesson) => {
        return total + (lesson?.lectures?.length || 0);
    }, 0) || 0;

    const route = useRouter();

    const completedLecturers =
        course?.lessons?.reduce((total, lesson) => {
            return (
                total +
                (lesson?.lectures?.reduce((sum, lecture) => {
                    return sum + (lecture?.completed ? 1 : 0);
                }, 0) || 0)
            );
        }, 0) || 0;

    const completedPercentage = totalLectures
        ? Math.round((completedLecturers / totalLectures) * 100)
        : 0;

    return (
        <div className="flex flex-col w-full rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition">

            <Image
                width={400}
                height={200}
                src={course.thumbnail}
                alt={course.title}
                className="h-40 w-full rounded-t-lg object-cover"
            />

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold">{course.title}</h3>
                <p className="text-xs text-gray-500">By <span className="font-semibold">{course.instructorId.name}</span></p>

                <div className="mt-3">
                    <div className="h-2 w-full rounded bg-gray-200">
                        <div
                            className="h-2 rounded bg-green-600"
                            style={{ width: `${completedPercentage}%` }}
                        ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        {totalLectures}/{completedLecturers} lectures • %
                    </p>
                </div>

                <div className="mt-3 flex gap-2">
                    {completedPercentage < 100 ? (
                        <button onClick={() => route.push(`/enrolled-player/${course.courseId._id}`)} className="flex-1 rounded-sm border border-[#00753b] px-3 py-1 text-sm text-[#00753b] hover:bg-gray-100">
                            Resume
                        </button>
                    ) : (
                        <button className="flex-1 rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
                            Download Certificate
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}