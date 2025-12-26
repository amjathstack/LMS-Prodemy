"use client"
import { useState } from "react"
import { Spinner } from "@material-tailwind/react"
import axios from "axios";
import { toast } from "react-toastify";

export default function SendEmailPage() {

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        try {
            const response = await axios.post("/api/forgot-password", { email }, { headers: { "Content-Type": "application/json" } });
            toast(response.data.message);

        } catch (error) {

            console.error(error.message)

        }

    }

    return (

        <div className="flex items-center justify-center w-full h-120 bg-white">

            <div className="relative bg-white text-gray-500 w-full max-w-100 mx-4 p-6 rounded-xl shadow-lg">

                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Welcome back
                </h2>

                <input
                    className="w-full bg-transparent border my-3 border-gray-300 outline-none rounded-md py-2.5 px-4"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Send Email
                </button>


            </div>

        </div>


    )
}