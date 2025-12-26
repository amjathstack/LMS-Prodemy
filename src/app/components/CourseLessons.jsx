"use client"
import Image from "next/image";
import dropDown_icon from "../../../public/icons/drop_down.svg";
import { useState } from "react";

export default function CourseLessons({ lessons }) {

    const [dropDown, setDropDown] = useState([]);

    const handleDropDownBtn = (i) => {
        if (dropDown.includes(i)) {
            const filteredList = dropDown.filter((e) => !(e === i));
            setDropDown(filteredList)
        } else {
            setDropDown(Prev => [...Prev, i])
        }
    }

    return (
        <section className="max-w-4xl py-10">
            <h2 className="text-xl font-semibold">Course content</h2>
            <ul className="mt-4 rounded bg-white">
                {lessons?.map((l, i) => (
                    <li key={l._id} className="flex flex-col mt-1 border border-gray-200 rounded-sm justify-between text-sm">
                        <div onClick={() => handleDropDownBtn(i)} className="w-full bg-gray-100 px-4 py-2 flex items-center justify-between">
                            <span>{l.title}</span>
                            <span><Image src={dropDown_icon} className={`w-5 ${dropDown.includes(i) && 'rotate-180'}`} alt="drop-down-icon" /></span>
                        </div>
                        {dropDown.includes(i) &&
                            l?.lectures.map((item, index) => (
                                <div key={index} className="flex px-4 py-2 border border-gray-200 justify-between text-sm">
                                    <span>{item.title}</span>
                                    <div>
                                        <span className={item.availability ? "text-[green]" : "text-red-500"}>{item.duration} {item.availability ? "• Preview" : "• Locked"}</span>
                                    </div>

                                </div>
                            ))
                        }
                    </li>
                ))}
            </ul>
        </section>
    )
}