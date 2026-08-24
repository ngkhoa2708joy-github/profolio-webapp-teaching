"use client";

import Link from "next/link";
import { useMemo } from "react";

// Bảng phối màu Pastel đồng bộ toàn hệ thống
const STUDENT_THEMES = [
  {
    hoverBorder: "hover:border-blue-300",
    hoverShadow: "hover:shadow-blue-100/50",
    decoBg: "bg-blue-50/80",
    avatarRing: "ring-blue-100/50",
    arrowHoverBg: "group-hover:bg-blue-600",
    titleHover: "group-hover:text-blue-950",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    badgeRing: "ring-blue-500/10",
    footerHover: "group-hover:text-blue-600",
  },
  {
    hoverBorder: "hover:border-emerald-300",
    hoverShadow: "hover:shadow-emerald-100/50",
    decoBg: "bg-emerald-50/80",
    avatarRing: "ring-emerald-100/50",
    arrowHoverBg: "group-hover:bg-emerald-600",
    titleHover: "group-hover:text-emerald-950",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
    badgeRing: "ring-emerald-500/10",
    footerHover: "group-hover:text-emerald-600",
  },
  {
    hoverBorder: "hover:border-purple-300",
    hoverShadow: "hover:shadow-purple-100/50",
    decoBg: "bg-purple-50/80",
    avatarRing: "ring-purple-100/50",
    arrowHoverBg: "group-hover:bg-purple-600",
    titleHover: "group-hover:text-purple-950",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-600",
    badgeRing: "ring-purple-500/10",
    footerHover: "group-hover:text-purple-600",
  },
  {
    hoverBorder: "hover:border-amber-300",
    hoverShadow: "hover:shadow-amber-100/50",
    decoBg: "bg-amber-50/80",
    avatarRing: "ring-amber-100/50",
    arrowHoverBg: "group-hover:bg-amber-500",
    titleHover: "group-hover:text-amber-950",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    badgeRing: "ring-amber-500/10",
    footerHover: "group-hover:text-amber-600",
  },
  {
    hoverBorder: "hover:border-rose-300",
    hoverShadow: "hover:shadow-rose-100/50",
    decoBg: "bg-rose-50/80",
    avatarRing: "ring-rose-100/50",
    arrowHoverBg: "group-hover:bg-rose-600",
    titleHover: "group-hover:text-rose-950",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-600",
    badgeRing: "ring-rose-500/10",
    footerHover: "group-hover:text-rose-600",
  },
  {
    hoverBorder: "hover:border-cyan-300",
    hoverShadow: "hover:shadow-cyan-100/50",
    decoBg: "bg-cyan-50/80",
    avatarRing: "ring-cyan-100/50",
    arrowHoverBg: "group-hover:bg-cyan-600",
    titleHover: "group-hover:text-cyan-950",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-600",
    badgeRing: "ring-cyan-500/10",
    footerHover: "group-hover:text-cyan-600",
  },
];

function getStudentTheme(studentId: string) {
  let hash = 0;
  for (let i = 0; i < studentId.length; i++) {
    hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % STUDENT_THEMES.length;
  return STUDENT_THEMES[index];
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  email: string;
}

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  const theme = useMemo(() => getStudentTheme(student.id), [student.id]);

  return (
    <Link
      href={`/students/${student.id}`}
      className="group block w-full outline-none"
    >
      {/* Responsive p-4 cho Mobile, p-6 cho Tablet/Desktop */}
      <div
        className={`relative rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.hoverBorder} ${theme.hoverShadow}`}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          <div
            className={`absolute -right-8 -top-8 sm:-right-12 sm:-top-12 h-24 w-24 sm:h-32 sm:w-32 rounded-full transition-transform duration-500 group-hover:scale-[1.8] ${theme.decoBg}`}
          />
        </div>

        <div className="relative z-10">
          {/* Avatar + Action Arrow */}
          <div className="flex items-start justify-between">
            <div className="relative shrink-0">
              {/* Responsive size ảnh */}
              <img
                src={student.avatar}
                alt={`${student.name}'s avatar`}
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover shadow-inner ring-2 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-md ${theme.avatarRing}`}
              />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
            </div>

            {/* Icon Mũi tên */}
            <div
              className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:text-white group-hover:shadow-md ${theme.arrowHoverBg}`}
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>

          {/* Student information */}
          <div className="mt-4 sm:mt-5">
            <h2
              className={`text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 transition-colors ${theme.titleHover}`}
            >
              {student.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ring-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeRing}`}
              >
                {student.grade}
              </span>
              <span className="truncate text-[11px] sm:text-xs font-medium text-slate-500">
                {student.email}
              </span>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="mt-5 sm:mt-6 flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-4">
            <span
              className={`text-xs sm:text-sm font-bold text-slate-500 transition-colors ${theme.footerHover}`}
            >
              View profile
            </span>
            <svg
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 transition-colors ${theme.footerHover}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
