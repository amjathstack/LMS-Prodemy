"use client"
import { useEffect, useState } from "react";
import Header from "../components/InstructorLayout/Header";
import Sidebar from "../components/InstructorLayout/SideBar";
import AddCoursePage from "../components/InstructorLayout/AddCourseForm";
import { useSelector } from "react-redux";
import LoadingPage from "../components/LoadingPage";
import UpdateCoursePage from "../components/InstructorLayout/UpdateCourseForm";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function InstructorLayout({ children }) {

    const pathname = usePathname();
    const [page, setPage] = useState(pathname.split("/")[2] ? pathname.split("/")[2] : "dashboard");
    const { showCoursesStatus, showUpdateCoursesStatus } = useSelector((state) => state.component);
    const [showSideBar, setShowSideBar] = useState(false)

    useEffect(() => {
        const resolvedPathname = pathname.split("/")[2];
        if (!resolvedPathname) {
            setPage("dashboard");
        } else {
            setPage(resolvedPathname);
        }
    }, [pathname]);

    const queryClient = new QueryClient();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Header page={page} setShowSideBar={setShowSideBar} />
                <Sidebar page={page} setPage={setPage} showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
                {showCoursesStatus && <AddCoursePage />}
                {showUpdateCoursesStatus && <UpdateCoursePage data={showUpdateCoursesStatus} />}
                <main className="flex-1">{children}</main>
            </QueryClientProvider>

        </>
    );
}
