"use client"
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

export default function LoadingPage({ loading }) {

    useEffect(() => {
        if (loading) {
            document.body.classList.add("body-no-scroll");
        } else {
            document.body.classList.remove("body-no-scroll");
        }

        return () => document.body.classList.remove("body-no-scroll");
    }, [loading]);

    return (
        <div className="fixed flex items-center justify-center w-[100%] top-0 left-0 h-[100vh] bg-white">
            <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#000000ff"
                ariaLabel="tail-spin-loading"
                radius="0"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}