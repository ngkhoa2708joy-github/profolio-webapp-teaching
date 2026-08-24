"use client";

import { useState } from "react";
import Timetable from "./TimeTable";

export default function TimetableSection() {
  const [showTimetable, setShowTimetable] = useState(false);

  return (
    <section
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        showTimetable
          ? "bg-blue-500 shadow-2xl shadow-blue-900/20"
          : "bg-blue-600 shadow-md hover:bg-blue-700"
      }`}
    >
      {/* Giảm padding ngang/dọc của thanh toolbar để tiết kiệm diện tích */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Sleek Blue Toolbar Toggle */}
        <button
          type="button"
          onClick={() => setShowTimetable((prev) => !prev)}
          className="group flex w-full items-center justify-between py-3 transition-opacity"
        >
          <div className="flex items-center gap-3">
            {/* Calendar Icon - Thu nhỏ size icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors group-hover:bg-white/30">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white transition-colors">
                  Weekly Teaching Timetable
                </h2>
                {/* Ping Animation Indicator */}
                {showTimetable && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                {showTimetable
                  ? "Click to collapse schedule overview"
                  : "Manage student assignments and view time slots"}
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {!showTimetable && (
              <span className="hidden sm:block text-[11px] font-semibold text-blue-200 transition-colors group-hover:text-white">
                Open Schedule
              </span>
            )}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30 ${
                showTimetable ? "rotate-180" : ""
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Timetable Content Wrapped in White Container */}
        {showTimetable && (
          <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 
              ĐÃ FIX: Xóa 'max-h-[75vh]' và 'overflow-y-auto' ở div này.
              Giờ đây trang chỉ có 1 thanh cuộn duy nhất, không bị lỗi double scroll.
              Đồng thời giảm padding (p-1.5) để tối đa hóa không gian cho bảng.
            */}
            <div className="rounded-xl border border-blue-500/50 bg-white p-1.5 shadow-inner ring-4 ring-black/5">
              <Timetable />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
