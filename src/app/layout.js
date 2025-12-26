"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import { SessionProvider } from "next-auth/react";
import { ToastContainer, Slide } from "react-toastify";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
      >
        <ToastContainer
          toastClassName={() =>
            "flex w-80 p-3 min-h-[30px] mt-1 w-auto text-gray-800 rounded-lg shadow-lg border border-gray-200 bg-white"
          }
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
        <SessionProvider>
          <Provider store={store}>
            {children}
          </Provider>
        </SessionProvider>

      </body>
    </html>
  );
}
