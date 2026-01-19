'use client'
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { showProfileEditCard } from "../lib/features/componentStatusSlice";
import { User } from "lucide-react";



export default function UserMenu({ name, profileImage, role, showUserMenu, setShowUserMenu }) {

    const router = useRouter();
    const popupRef = useRef(null);
    const dispatch = useDispatch()

    const hadleSignOutBtn = () => {
        signOut({ callbackUrl: "/" });
    }

    const handleEnrolledCoursesBtn = () => {
        router.push(`/enrolled-courses`);
        setShowUserMenu(false);
    }

    const handleViewProfile = () => {
        dispatch(showProfileEditCard(role));
        setShowUserMenu(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [showUserMenu])

    if (!showUserMenu) return null;

    return (
        <div className="absolute right-[-5px] sm:right-[-40px] inline-block" ref={popupRef}>
            <div className="z-10 mt-2 w-60 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white text-left text-sm shadow-sm">
                <div className="py-3 px-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10">
                            {
                                profileImage
                                    ? <img
                                        className="h-full w-full border border-gray-300 rounded-full object-cover object-center"
                                        src={profileImage}
                                        alt={name || "User"}
                                    />
                                    : <div className="h-full w-full flex items-center justify-center border border-gray-300 rounded-full object-cover object-center">
                                        <User className="text-gray-600 w-7" />
                                    </div>
                            }
                            <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium text-gray-700">{name}</div>
                            <div className="text-gray-400">{role === "none" ? "Complete the profile" : role}</div>
                        </div>
                    </div>
                </div>

                {
                    role === "Learner" &&
                    <a onClick={() => handleEnrolledCoursesBtn()} className="cursor-pointer flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 5C4 3.89543 4.89543 3 6 3H20V21H6C4.89543 21 4 20.1046 4 19V5Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="1" />
                        </svg>


                        <span className="mx-1">
                            My Courses
                        </span>
                    </a>
                }

                {
                    role === "Instructor" &&
                    <a onClick={() => router.push("/instructor")} className="cursor-pointer flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 5C4 3.89543 4.89543 3 6 3H20V21H6C4.89543 21 4 20.1046 4 19V5Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="1" />
                        </svg>


                        <span className="mx-1">
                            Dashboard
                        </span>
                    </a>
                }


                <a onClick={() => handleViewProfile()} className="cursor-pointer flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="currentColor"></path>
                        <path d="M6.34315 16.3431C4.84285 17.8434 4 19.8783 4 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16C13.5913 16 15.1174 16.6321 16.2426 17.7574C17.3679 18.8826 18 20.4087 18 22H20C20 19.8783 19.1571 17.8434 17.6569 16.3431C16.1566 14.8429 14.1217 14 12 14C9.87827 14 7.84344 14.8429 6.34315 16.3431Z" fill="currentColor"></path>
                    </svg>

                    <span className="mx-1">
                        view profile
                    </span>
                </a>

                <a onClick={() => hadleSignOutBtn()} className="cursor-pointer flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                    <svg className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z" fill="currentColor"></path>
                    </svg>

                    <span className="mx-1">
                        Sign Out
                    </span>
                </a>
            </div>
        </div>
    )
}