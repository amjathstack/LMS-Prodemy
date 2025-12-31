"use client"
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReviewSection from "@/app/components/ReviewSection";
import EnrollCard from "@/app/components/EnrollCard";
import axios from "axios";
import CourseLessons from "@/app/components/CourseLessons";
import Image from "next/image";
import { toast } from "react-toastify";
import LoadingPage from "@/app/components/LoadingPage";

export default function CourseDetailsPage({ params }) {

  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCourse() {
    try {

      const response = await axios.get(`/api/course-by-id?courseId=${id}`);
      if (response.data.status) {
        setCourse(response.data.message?.courseDetails);
        setIsEnrolled(response.data.message.isCourseEnrolled ? true : false)
        setLoading(false)
      } else {
        toast(response.data.message);
      }


    } catch (error) {

      console.error(error.message);

    }
  }


  const totalRatings = course?.comments?.reduce((total, i) => total += i.rating, 0);

  useEffect(() => {
    fetchCourse()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen">

      <section className="bg-white">
        <div className="max-w-full px-4 py-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-8">

          <div className="w-full max-w-210 lg:col-span-2">

            <h1 className="text-3xl font-bold">{course?.title}</h1>
            <p className="mt-2 text-lg text-gray-700 max-w-200">{course?.description}</p>

            <div className="max-w-6xl py-10">
              <h2 className="text-xl font-semibold">Instructor</h2>

              <div className="mt-4 flex items-start gap-3">
                {
                  course?.instructorId?.profileImage
                    ? <Image
                      src={course?.instructorId?.profileImage}
                      width={500}
                      height={500}
                      alt="profil"
                      className="rounded-full object-cover w-8 h-8 border-gray-300" />
                    : <User className="w-8 h-8" />
                }

                <div>
                  <p className="text-heading font-semibold">{course?.instructorId?.name}</p>
                  <p className="text-sm text-gray-600">{course?.instructorId?.title}</p>
                  <p className="text-sm text-gray-700">{course?.instructorId?.bio}</p>
                </div>
              </div>

            </div>

            <div className="mt-1 flex flex-wrap items-center gap-5 text-sm text-gray-600">

              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" /></svg>
                <p className="ms-2 text-sm font-bold text-heading">{totalRatings / course?.comments?.length || 0}</p>
                <span className="w-1 h-1 mx-1.5 bg-neutral-quaternary rounded-full"></span>
                <a className="text-sm font-medium text-heading underline hover:no-underline">{course?.comments?.length || 0} reviews</a>
              </div>

              <span>• Last update {new Date(course?.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}</span>
              <span>• {course?.language}</span>
            </div>

            <CourseLessons lessons={course?.lessons} />

            <section className="py-10">
              <h2 className="text-xl font-semibold">Student Reviews</h2>
              <div className="mt-4 space-y-4">
                <ReviewSection comments={course?.comments} />
              </div>
            </section>

          </div>

          <EnrollCard course={course} isEnrolled={isEnrolled} />

        </div>
      </section>
    </div>
  );
}


