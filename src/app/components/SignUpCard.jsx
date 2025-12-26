import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideSignUpCard, showLoginCard } from "../lib/features/componentStatusSlice";
import { X } from "lucide-react";
import { createUser } from "../lib/features/usersSlice";
import { toast } from "react-toastify";

function SignUpCard() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Learner");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");

    const dispatch = useDispatch();
    const { showSignUpStatus } = useSelector((state) => state.component);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast("Please fill in all required fields.")
            return setStep(1);
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("role", role);

            if (role === "Instructor") {
                formData.append("title", title);
                formData.append("bio", bio);
            }

            dispatch(createUser(formData));
            dispatch(hideSignUpCard());
        } catch (error) {
            alert("Signup failed. Please try again.");
        }
    };

    useEffect(() => {
        if (showSignUpStatus) {
            document.body.classList.add("body-no-scroll");
        } else {
            document.body.classList.remove("body-no-scroll");
        }
        return () => document.body.classList.remove("body-no-scroll");
    }, [showSignUpStatus]);

    return (
        <div className="fixed min-h-screen w-full left-0 top-0 flex items-center justify-center bg-white/70 z-50">
            <div className="bg-white shadow-xl rounded-sm p-10 w-full max-w-[400px]">
                <div className="w-full flex items-start justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Sign Up</h2>
                        <p className="text-gray-500 mb-8 text-[12px]">
                            Create your account to start learning or teaching
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch(hideSignUpCard())}
                        className="cursor-pointer"
                    >
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="text-sm space-y-4">
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="fullName">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full px-3 py-2 border rounded-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-3 py-2 border rounded-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-3 py-2 border rounded-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Assign this account as:
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="Learner"
                                            checked={role === "Learner"}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="accent-[#00753b]"
                                        />
                                        Learner
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="Instructor"
                                            checked={role === "Instructor"}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="accent-[#00753b]"
                                        />
                                        Instructor
                                    </label>
                                </div>
                            </div>

                            {role === "Instructor" ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full bg-[#00753b] text-white py-2 mt-5 rounded-sm font-semibold hover:bg-[#00753b]/90 transition duration-300 cursor-pointer"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full bg-[#00753b] text-white py-2 mt-5 rounded-sm font-semibold hover:bg-[#00753b]/90 transition duration-300 cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            )}
                        </>
                    )}

                    {step === 2 && role === "Instructor" && (
                        <>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="title">
                                    Instructor Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Senior Frontend Engineer"
                                    required
                                    className="w-full px-3 py-2 border rounded-sm focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor="bio">
                                    Instructor Bio
                                </label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Write a short bio about yourself"
                                    required
                                    className="w-full max-h-30 px-3 py-2 border rounded-sm focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 border border-gray-300 py-2 rounded-sm hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#00753b] text-white py-2 rounded-sm font-semibold hover:bg-[#00753b]/90 transition duration-300 cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </>
                    )}
                </form>

                <p className="text-gray-500 text-center mt-6">
                    Already have an account?{" "}
                    <a
                        onClick={() => dispatch(showLoginCard())}
                        className="text-[#00753b] hover:underline cursor-pointer"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default SignUpCard;
