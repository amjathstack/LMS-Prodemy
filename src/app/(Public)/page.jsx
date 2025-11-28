import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="w-full p-6 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prodemy</h1>
        <nav className="space-x-6 text-lg">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#courses" className="hover:text-blue-600 transition">Courses</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
        </nav>
        <Button className="rounded-2xl px-6">Login</Button>
      </header>

      <section className="flex-1 grid md:grid-cols-2 gap-10 p-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Learn Anywhere, Anytime
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Access high-quality courses, track progress, and enhance your skills with our modern Learning Management System.
          </p>
          <Button className="rounded-2xl px-6 text-lg">Get Started</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1584697964190-820f03f81f4d?auto=format&fit=crop&w=800&q=80"
            alt="Learning Illustration"
            className="rounded-2xl shadow-xl"
          />
        </motion.div>
      </section>

      <section id="features" className="p-12 bg-white">
        <h3 className="text-3xl font-bold mb-10 text-center">Platform Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="space-y-4 text-center">
              <BookOpen className="mx-auto w-12 h-12" />
              <h4 className="text-xl font-semibold">Interactive Courses</h4>
              <p className="text-gray-600">Engaging lessons, quizzes, and assignments to boost your learning experience.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="space-y-4 text-center">
              <GraduationCap className="mx-auto w-12 h-12" />
              <h4 className="text-xl font-semibold">Track Progress</h4>
              <p className="text-gray-600">Monitor your performance and stay motivated with progress tracking.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="space-y-4 text-center">
              <User className="mx-auto w-12 h-12" />
              <h4 className="text-xl font-semibold">Personal Dashboard</h4>
              <p className="text-gray-600">Access your enrolled courses, stats, and certificates all in one place.</p>
            </CardContent>
          </Card>
        </div>
      </section>

  
      <footer className="p-6 text-center text-gray-600 bg-gray-100">
        © {new Date().getFullYear()} EduLearn LMS. All rights reserved.
      </footer>
    </div>
  );
}