"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideProfileEditCard } from "@/app/lib/features/componentStatusSlice";
import { updateUser } from "@/app/lib/features/usersSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Spinner } from "@material-tailwind/react";
import User from '../assets/user.svg'
import { useRouter } from "next/navigation";

export default function UserProfileEditCard({
    name: initialName,
    profileImage,
    role: initialRole,
}) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.users);
    const router = useRouter();

    const [name, setName] = useState(initialName || "");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const [role, setRole] = useState(initialRole || "none");
    const [profileImg, setProfileImg] = useState(null);
    const [preview, setPreview] = useState(profileImage || null);
    const [trackSubmit, setTrackSubmit] = useState(false);

    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const fileRef = useRef(null);

    const handleSubmit = async () => {

        if (role === "none") {
            return toast("Select the role")
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("role", role);

        if (profileImg) {
            formData.append("profileImage", profileImg);
        }

        if (role === "Instructor") {
            formData.append("title", title);
            formData.append("bio", bio);
        }

        dispatch(updateUser(formData));

        router.push('/')

        setTrackSubmit(true);

    };

    useEffect(() => {
        if (profileImg) {
            setPreview(URL.createObjectURL(profileImg));
        }
    }, [profileImg]);

    useEffect(() => {
        if (!loading && trackSubmit) {
            dispatch(hideProfileEditCard());
        }
    }, [loading, trackSubmit, dispatch]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-90">
            <div className="relative w-100 rounded-sm p-0.5 bg-white text-gray-800">

                <button onClick={() => dispatch(hideProfileEditCard())} className="absolute top-5 right-5"><X /></button>

                <div className="bg-white p-6 rounded-[10px] flex flex-col items-center text-center">

                    <input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setProfileImg(e.target.files[0])}
                    />

                    {
                        preview
                            ? <img
                                src={
                                    preview
                                }
                                alt="Profile Avatar"
                                className="w-24 h-24 rounded-full border border-gray-200 my-4 cursor-pointer"
                                onClick={() => fileRef.current.click()}
                            />
                            : <div
                                className="w-24 h-24 flex items-center justify-center rounded-full border border-gray-200 my-4 cursor-pointer"
                                onClick={() => fileRef.current.click()}
                            >
                                <img
                                    src={
                                        User
                                    }
                                    alt="Profile Avatar"
                                    className="w-18"
                                />
                            </div>
                    }

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {name || "Your Name"}
                    </h2>

                    <div className="relative flex mt-2 flex-col w-44 text-sm">
                        <button
                            type="button"
                            onClick={() => setIsRoleOpen(true)}
                            className="group w-full text-left px-4 py-1 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50"
                        >
                            <span>{role === "none" ? "Select the role" : role}</span>
                            <svg
                                className="w-5 h-5 inline float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="#6B7280"
                            >
                                <path d="m19 9-7 7-7-7" />
                            </svg>
                        </button>

                        {isRoleOpen && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded shadow-md mt-8 py-2 z-10">
                                <li
                                    onClick={() => {
                                        setRole("Learner");
                                        setIsRoleOpen(false);
                                    }}
                                    className="px-4 py-2 text-left hover:bg-indigo-500 hover:text-white cursor-pointer"
                                >
                                    Learner
                                </li>
                                <li
                                    onClick={() => {
                                        setRole("Instructor");
                                        setIsRoleOpen(false);
                                    }}
                                    className="px-4 py-2 text-left hover:bg-indigo-500 hover:text-white cursor-pointer"
                                >
                                    Instructor
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className="flex items-center text-sm bg-white h-12 border pl-2 rounded border-gray-500/30 w-full max-w-md mt-4">
                        <input
                            className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {role === "Instructor" && (
                        <>
                            <div className="flex items-center text-sm bg-white h-12 border pl-2 rounded border-gray-500/30 w-full max-w-md mt-4">
                                <input
                                    className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
                                    type="text"
                                    placeholder="Enter your title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <textarea
                                className="w-full max-w-md mt-3 p-2 h-full max-h-[100px] border rounded border-gray-500/30 text-sm text-gray-600 outline-none resize-none"
                                rows={3}
                                placeholder="Write a short bio about yourself"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </>
                    )}

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmit}
                        className={`px-6 py-2 mt-7 w-full transition bg-[#27AE60] hover:bg-[#27AE60]/90 rounded text-white text-sm font-medium cursor pointer ${loading && "cursor-not-allowed"} `}
                    >
                        {loading &&
                            <Spinner className="absolute left-10 w-10 h-6 bottom-[31px]" color="white" />
                        }
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
