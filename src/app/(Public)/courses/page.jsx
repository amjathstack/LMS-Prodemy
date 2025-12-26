"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CourseCard from "@/app/components/CourseCard";
import LoadingPage from "@/app/components/LoadingPage";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get("/api/course");
      return response.data.message
    }
  });

  const filteredCourses = Array.isArray(courses) && courses?.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course?.category === category.toLowerCase();

    const matchesLanguage =
      language === "All" || course?.language === language;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-200 pt-10 text-sm">
      <h2 className="text-2xl font-semibold mb-6">Browse Courses</h2>


      <div className="bg-whit rounded-lg mb-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-8">


          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600">Search</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mt-1">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ml-2 focus:outline-none"
                placeholder="Search courses..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none"
            >
              <option>All</option>
              <option>Development</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Business</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none"
            >
              <option>All</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-3 space-y-5 sm:gap-7 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

        {!isLoading && filteredCourses && filteredCourses?.map(course => (
          <CourseCard key={course?._id} course={course} />
        ))}

        {
          isLoading &&
          <div className="flex items-center justify-center w-full min-h-[200px]">
            <svg
              className="w-15 h-15 animate-spin text-gray-400 fill-black"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"
              />
            </svg>
          </div>
        }

        {!isLoading && filteredCourses?.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full text-center">
            No courses found based on your filters.
          </p>
        )}
      </div>
    </div>
  );
}
