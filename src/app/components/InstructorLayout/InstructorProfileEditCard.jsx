"use client";
import { useState, useEffect, useRef } from "react";
import { User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { hideProfileEditCard } from "@/app/lib/features/componentStatusSlice";
import { toast } from "react-toastify";
import { updateUser } from "@/app/lib/features/usersSlice";
import { Spinner } from "@material-tailwind/react";
// import User from "../../assets/user.svg";

export default function InstructorProfileEditCard({ name: initialName, profileImage, title: initialTitle, bio: initialBio, role }) {

    const [name, setName] = useState(initialName || "");
    const [title, setTitle] = useState(initialTitle || "");
    const [bio, setBio] = useState(initialBio || "");
    const [profileImg, setProfileImg] = useState(null);
    const [preview, setPreview] = useState(profileImage || null);
    const { loading } = useSelector((state) => state.users);
    const [trackSubmit, setTrackSubmit] = useState(false);

    const fileRef = useRef(null);

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        try {

            const formData = new FormData();
            formData.append('name', name);
            formData.append('profileImage', profileImg);
            formData.append('title', title);
            formData.append('bio', bio);

            dispatch(updateUser(formData));
            setTrackSubmit(true)

        } catch (error) {
            return toast(error.message);
        }
    }

    useEffect(() => {
        if (profileImg) {
            setPreview(URL.createObjectURL(profileImg));
        }
    }, [profileImg]);

    useEffect(() => {
        if (!loading && trackSubmit) {
            dispatch(hideProfileEditCard());
        }
    }, [loading]);

    useEffect(() => {
        document.body.style.overflow = "hidden";


        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-90">
            <div className="relative w-100 rounded-sm p-0.5 bg-white text-gray-800 shadow-lg">

                <button onClick={() => dispatch(hideProfileEditCard())} className="absolute cursor-pointer top-5 right-5"><X /></button>

                <div className="bg-white p-6 rounded-[10px] flex flex-col items-center text-center">

                    <input
                        type="file"
                        className="hidden"
                        ref={fileRef}
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
                                <User className="w-10 h-10"/>
                            </div>
                    }

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {name || "Your Name"}
                    </h2>

                    <p>{role}</p>

                    <div className="flex items-center text-sm bg-white h-12 border pl-2 rounded border-gray-500/30 w-full max-w-md mt-4">
                        <input
                            className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center text-sm bg-white h-12 border pl-2 rounded border-gray-500/30 w-full max-w-md mt-4">
                        <input
                            className="px-2 w-full h-full outline-none text-gray-500 bg-transparent"
                            type="text"
                            placeholder="Enter your name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <textarea
                        className="px-2 w-full text-sm outline-none text-gray-500 bg-transparent h-full max-h-[100px] py-2 border pl-2 rounded border-gray-500/30 max-w-md mt-4"
                        type="text"
                        placeholder="Enter your name"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />


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
        </div >
    );
}
