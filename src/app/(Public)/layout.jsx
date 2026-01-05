"use client"
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginCard from "../components/LoginCard";
import SignUpCard from "../components/SignUpCard";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileEditCard from "../components/ProfileEditCard";
import InstructorProfileEditCard from "../components/InstructorLayout/InstructorProfileEditCard";
import { falseUserUpdateLoading } from "../lib/features/usersSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfileEditCard from "../components/UserProfileEditCard";

export default function PublicLayout({ children }) {

    const { showLoginStatus, showSignUpStatus, showProfileEdit } = useSelector((state) => state.component);
    const { user } = useSelector((state) => state?.users);
    const { data: session, update } = useSession();

    const dispatch = useDispatch();

    async function updateSession() {

        if (!session?.user) return;

        await update({
            ...session,
            user: {
                ...session.user,
                name: user?.name,
                role: user?.role,
                profileImage: user?.profileImage,
                title: user?.title || undefined,
                bio: user?.bio || undefined
            }
        });

        dispatch(falseUserUpdateLoading());
    }

    useEffect(() => {
        if (user) {
            updateSession();
        }
    }, [user])

    const queryClient = new QueryClient();

    return (
        <div className="pl-[3%] pr-[3%] sm:pl-[10%] sm:pr-[10%]">
            <QueryClientProvider client={queryClient} >
                {showLoginStatus && <LoginCard />}
                {showSignUpStatus && <SignUpCard />}
                {showProfileEdit === "Learner" && <ProfileEditCard name={session?.user?.name} role={session?.user?.role} profileImage={session?.user?.profileImage} />}
                {showProfileEdit === "Instructor" && <InstructorProfileEditCard name={session?.user?.name} role={session?.user?.role} profileImage={session?.user?.profileImage || ""} title={session?.user.title || ""} bio={session?.user.bio || ""} />}
                {showProfileEdit === "none" && <UserProfileEditCard name={session?.user?.name} profileImage={session?.user?.profileImage} role={session?.user?.role} />}
                <Header />
                {children}
                <Footer />
            </QueryClientProvider>

        </div>
    )
}