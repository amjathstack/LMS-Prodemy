"use client"
import { useState } from "react"
import { Spinner } from "@material-tailwind/react"
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import { useParams } from "next/navigation";

export default function ResetPasswordPage() {

    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        if (password !== confirmPassword) {
            return toast("Password no Matches")
        }

        setLoading(true)

        console.log(token)

        try {

            const response = await axios.post("/api/reset-password", { token, password }, { headers: { "Content-Type": "application/json" } });
            toast(response.data.message);

        } catch (error) {

            console.error(error.message)

        }

        setLoading(false)

    }

    return (

        <div className="flex items-center justify-center w-full h-120 bg-white">

            <div className="relative bg-white text-gray-500 w-full max-w-100 mx-4 p-6 rounded-xl shadow-sm">

                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Reset Password
                </h2>

                <form>

                    <input
                        className="w-full bg-transparent border my-3 border-gray-300 outline-none rounded-md py-2.5 px-4"
                        type="password"
                        placeholder="New password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        className="w-full bg-transparent border my-3 border-gray-300 outline-none rounded-md py-2.5 px-4"
                        type="password"
                        placeholder="Confirm password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Reset Password
                    </button>

                </form>


            </div>

        </div>


    )
}