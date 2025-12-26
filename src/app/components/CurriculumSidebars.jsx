import React from "react";

export default function CurriculumSidebar({ curriculum, setActiveItem, activeItem, setLctIndex }) {

    return (
        <aside className="top-20 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Course content</h3>
                <span className="text-xs text-gray-500">
                    {curriculum?.reduce((total, item) => total + item.lectures.length, 0)} lectures
                </span>
            </div>
            <div className="space-y-2">
                {curriculum?.map((sec) => (
                    <div key={sec._id} className="rounded-sm border border-gray-200">
                        <button className="flex w-full items-center justify-between bg-gray-50 px-3 py-2 text-left">
                            <span className="text-sm font-medium">{sec?.title}</span>
                        </button>
                        {sec?.lectures && (
                            <ul>
                                {sec?.lectures?.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => {
                                                setActiveItem(item)
                                                setLctIndex(index)
                                            }}
                                            className={`flex w-full items-center border-b border-gray-200 justify-between px-3 py-2 text-left 
                                                ${activeItem?.title === item?.title ? "bg-green-50" : "hover:bg-gray-50"} 
                                                ${!item.availability ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                                            aria-current={activeItem?.title === item?.title ? "true" : "false"}
                                            disabled={!item.availability}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm">{item.title}</span>
                                                <span className="text-xs text-gray-500">{item.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.availability ? (
                                                    <span className="rounded border border-green-300 bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                                        Preview
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">Locked</span>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}