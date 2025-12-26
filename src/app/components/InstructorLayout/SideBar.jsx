"use client"
import { BookOpen, Users, BarChart2, LogOut, MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar({ page, setPage, showSideBar, setShowSideBar }) {

  const router = useRouter();

  const handleBtns = (s) => {
    if (s === "dashboard") {
      setPage("Dashboard")
      router.push("/instructor")
    }
    if (s === "courses") {
      setPage("Courses")
      router.push("/instructor/courses")
    }
    if (s === "students") {
      setPage("students")
      router.push("/instructor/students")
    }
    if (s === "back") {
      setPage("back")
      router.push("/")
    }
  }

  return (
    <aside className={`fixed ${showSideBar ? `block` : `hidden`} lg:flex h-[100%] w-64 top-0 left-0 bg-white shadow-sm transition-all duration-300 flex-col`}>
      <div className="flex h-15 items-center gap-4 p-4 border-b border-gray-300">
        <button className="ml-2 lg:hidden cursor-pointer" onClick={() => setShowSideBar(false)}>
          <MenuIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[#00753b]">
          Instructor
        </h1>
      </div>
      <nav className="flex-1 mt-6 p-2 space-y-1">
        <button onClick={() => handleBtns("dashboard")} className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm  
        ${page === "dashboard" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-green-100"}`}
        >
          <BarChart2 className="w-4 h-4" />
          Dashboard
        </button>
        <button onClick={() => handleBtns("courses")} className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm  
        ${page === "courses" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-green-100"}`}
        >
          <BookOpen className="w-4 h-4" />
          Courses
        </button>
        <button onClick={() => handleBtns("students")} className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm  
        ${page === "students" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-green-100"}`}
        >
          <Users className="w-4 h-4" />
          Students
        </button>
        <button onClick={() => handleBtns("back")} className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm  
        ${page === "back" ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-green-100"}`}
        >
          <LogOut className="w-4 h-4" />
          Back to Site
        </button>
      </nav>
    </aside>
  );
}
