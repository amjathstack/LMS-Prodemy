import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { FaStar } from "react-icons/fa";

export default function ReviewSection({ comments }) {

    const { data: session } = useSession();

    return (
        <div className="space-y-4 mt-6">
            {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        {
                            item?.userId?.profileImage
                                ? <img
                                    src={item?.userId?.profileImage}
                                    width={600}
                                    height={600}
                                    alt="profile-img"
                                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                                />
                                : <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full">
                                    <User className="w-5 h-5" />
                                </button>
                        }

                        <div className="flex-1 rounded-md bg-gray-50 p-3">
                            <p className="text-sm font-medium text-gray-800">
                                {item?.userId?._id === session?.user?.id ? "You" : item?.userId?.name || "Anonymous"}
                            </p>
                            <div className="flex mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={16}
                                        className={`mr-1 w-3 ${star <= (item?.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-700">{item?.comment || ""}</p>
                        </div>
                    </div>
                ))
            ) : (
                <h1>There are no reviews.</h1>
            )}
        </div>
    )
}