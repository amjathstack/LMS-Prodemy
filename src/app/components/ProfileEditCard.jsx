"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { hideProfileEditCard } from "../lib/features/componentStatusSlice";
import { toast } from "react-toastify";
import { updateUser } from "../lib/features/usersSlice";
import { useRef } from "react";
import { Spinner } from "@material-tailwind/react";
import userdm from "../assets/user.svg"

export default function profileEditCard({ name: initialName, profileImage, role }) {

    const [name, setName] = useState(initialName || "");
    const [profileImg, setProfileImg] = useState(null);
    const [preview, setPreview] = useState(profileImage || null);
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.users);
    const [trackSubmit, setTrackSubmit] = useState(false);

    const fileRef = useRef(null);

    const handleSubmit = async () => {
        try {

            const formData = new FormData();
            formData.append('name', name);
            formData.append('profileImage', profileImg);
            dispatch(updateUser(formData));
            setTrackSubmit(true)

        } catch (error) {
            return toast("Profile updating failed!");
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

    return (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-90">
            <div className="relative w-100 rounded-sm p-0.5 bg-white text-gray-800">

                <button onClick={() => dispatch(hideProfileEditCard())} className="absolute top-5 right-5 cursor-pointer"><X /></button>

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
                                <img
                                    src={
                                        userdm.src
                                    }
                                    alt="Profile Avatar"
                                    className="w-18"
                                />
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
