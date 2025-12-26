import { useRouter } from "next/navigation";

export default function CourseCard({ course }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/course/${course?._id}`)}
            className="cursor-pointer rounded-sm overflow-hidden border border-gray-200 bg-white sm:min-w-60 sm:max-w-72"
        >
            <div className="relative w-full h-30 sm:h-40 overflow-hidden bg-gray-100">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="
            w-full h-full object-cover
            transition-transform duration-300
          "
                />
            </div>

            <div className="p-4">
                <p className="capitalize text-xs text-gray-400 mb-1">
                    {course.category}
                </p>

                <h3 className="text-[12px] sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
                    {course.title}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                    ({course?.comments?.length || 0} reviews)
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-green-700 font-semibold">
                        ${course.offer}
                        <span className="ml-2 text-xs text-gray-400 line-through">
                            ${course.price}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
