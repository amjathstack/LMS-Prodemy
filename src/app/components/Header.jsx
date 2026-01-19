"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showLoginCard } from "../lib/features/componentStatusSlice";
import { useSession } from "next-auth/react";
import React from "react";
import UserMenu from "./UserMenu";
import { Menu, User, X } from "lucide-react";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleLoginBtn = () => {
    setMenuOpen(false);
    dispatch(showLoginCard());
  }

  return (
    <header className="h-full max-h-30 w-full sticky top-0 z-50">
      <nav>
        <div className="left-0 top-0 right-0 z-100 flex items-center px-3 justify-between py-4 border-b border-gray-300 bg-white transition-all">
          <a href="/">
            <h1 className="font-semibold text-2xl">
              <span className="text-[#27AE60]">Pro</span>demy
            </h1>
          </a>

          <div className="hidden sm:flex items-center gap-4 md:gap-8 max-md:text-sm text-gray-800">
            <a href="/" onClick={() => scrollTo(0, 0)}>Home</a>
            <a href="/courses" onClick={() => scrollTo(0, 0)}>Courses</a>
            <a href="#" onClick={() => scrollTo(0, 0)}>About</a>
            <a href="#" onClick={() => scrollTo(0, 0)}>Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div>
              {session ? (
                <>
                  <div
                    onClick={() => setShowUserMenu(true)}
                    className="h-9 w-9 cursor-pointer"
                  >
                    {
                      session?.user?.profileImage
                        ? <img
                          className="h-full w-full border border-gray-300 rounded-full object-cover object-center"
                          src={session?.user?.profileImage}
                          alt={session?.user?.name || "User"}
                        />
                        : <div className="h-full w-full flex items-center justify-center border border-gray-300 rounded-full object-cover object-center">
                          <User className="text-gray-600 w-7" />
                        </div>
                    }

                  </div>
                  <UserMenu
                    name={session?.user?.name}
                    profileImage={session?.user?.profileImage}
                    role={session?.user?.role}
                    setShowUserMenu={setShowUserMenu}
                    showUserMenu={showUserMenu}
                  />

                </>
              ) : (
                <>
                  <button
                    onClick={() => dispatch(showLoginCard())}
                    className="max-sm:hidden cursor-pointer px-8 py-2 bg-[#27AE60] hover:bg-[#27AE60]/90 transition text-white rounded-md"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

            <div className="block sm:hidden">
              <Menu onClick={() => setMenuOpen(true)} />
            </div>

          </div>

        </div>

        <div
          className={`sm:hidden fixed inset-0 z-[200] bg-white backdrop-blur shadow-xl rounded-lg text-sm transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-4">
            <a href="/" onClick={() => scrollTo(0, 0)}>Home</a>
            <a href="/courses" onClick={() => scrollTo(0, 0)}>Courses</a>
            <a href="#" onClick={() => scrollTo(0, 0)}>About</a>
            <a href="#" onClick={() => scrollTo(0, 0)}>Contact</a>
            {
              !session ?
                <button
                  onClick={() => handleLoginBtn()}
                  className="cursor-pointer px-8 py-2 bg-[#27AE60] hover:bg-[#27AE60]/90 transition text-white rounded-full"
                >
                  Login
                </button>
                : <h1>Hi!, {session?.user?.name || "anonymous"}</h1>
            }

            <X onClick={() => setMenuOpen(false)} className="absolute top-5  right-5" />
          </div>

        </div>
      </nav>
    </header>
  );
}
