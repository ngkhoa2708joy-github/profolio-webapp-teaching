"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";

const days = [
  { name: "Mon", full: "Monday", value: 1 },
  { name: "Tue", full: "Tuesday", value: 2 },
  { name: "Wed", full: "Wednesday", value: 3 },
  { name: "Thu", full: "Thursday", value: 4 },
  { name: "Fri", full: "Friday", value: 5 },
  { name: "Sat", full: "Saturday", value: 6 },
  { name: "Sun", full: "Sunday", value: 0 },
];

const timeGroups = [
  {
    label: "Morning",
    icon: "🌅",
    times: [
      { label: "06:00 - 08:00", start: "06:00", end: "08:00" },
      { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
      { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
    ],
  },
  {
    label: "Noon",
    icon: "☀️",
    times: [
      { label: "12:00 - 14:00", start: "12:00", end: "14:00" },
      { label: "14:00 - 16:00", start: "14:00", end: "16:00" },
      { label: "16:00 - 18:00", start: "16:00", end: "18:00" },
    ],
  },
  {
    label: "Evening",
    icon: "🌙",
    times: [
      { label: "18:00 - 20:00", start: "18:00", end: "20:00" },
      { label: "20:00 - 22:00", start: "20:00", end: "22:00" },
    ],
  },
];

const STUDENT_COLOR_PALETTES = [
  {
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-200",
    textName: "text-blue-900",
    textTime: "text-blue-700",
    dot: "bg-blue-500",
  },
  {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200",
    textName: "text-emerald-900",
    textTime: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    bg: "bg-purple-50 hover:bg-purple-100",
    border: "border-purple-200",
    textName: "text-purple-900",
    textTime: "text-purple-700",
    dot: "bg-purple-500",
  },
  {
    bg: "bg-amber-50 hover:bg-amber-100",
    border: "border-amber-200",
    textName: "text-amber-900",
    textTime: "text-amber-700",
    dot: "bg-amber-500",
  },
  {
    bg: "bg-rose-50 hover:bg-rose-100",
    border: "border-rose-200",
    textName: "text-rose-900",
    textTime: "text-rose-700",
    dot: "bg-rose-500",
  },
  {
    bg: "bg-cyan-50 hover:bg-cyan-100",
    border: "border-cyan-200",
    textName: "text-cyan-900",
    textTime: "text-cyan-700",
    dot: "bg-cyan-500",
  },
];

function getStudentColor(studentId?: string) {
  if (!studentId) return STUDENT_COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < studentId.length; i++) {
    hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % STUDENT_COLOR_PALETTES.length;
  return STUDENT_COLOR_PALETTES[index];
}

type Schedule = {
  id: number;
  student_id: string;
  type: "quebec" | "vietnam";
  day_of_week: number;
  start_time: string;
  end_time: string;
  students: { name: string } | null;
};

type Student = { id: string; name: string };

export default function Timetable() {
  const [activeTab, setActiveTab] = useState<"quebec" | "vietnam">("quebec");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);

  // 🔒 Security PIN States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedStartTime, setSelectedStartTime] = useState("06:00");
  const [selectedEndTime, setSelectedEndTime] = useState("08:00");
  const [selectedType, setSelectedType] = useState<"quebec" | "vietnam">(
    "quebec",
  );
  const [saving, setSaving] = useState(false);

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageText, setMessageText] = useState("");

  const currentDay = new Date().getDay();

  useEffect(() => {
    setSelectedType(activeTab);
  }, [activeTab]);

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `id, student_id, type, day_of_week, start_time, end_time, students (name)`,
        )
        .eq("type", activeTab)
        .order("start_time", { ascending: true });

      if (error) {
        console.error("SCHEDULE ERROR:", error);
        setError(error.message);
        setSchedules([]);
      } else {
        setSchedules((data as unknown as Schedule[]) || []);
      }
      setLoading(false);
    }
    fetchSchedules();
  }, [activeTab]);

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from("students")
        .select("id, name")
        .order("name");
      if (!error) setStudents(data || []);
    }
    fetchStudents();
  }, []);

  const scheduleMap = useMemo(() => {
    const map: Record<string, Schedule[]> = {};
    schedules.forEach((schedule) => {
      const scheduleStartTime = schedule.start_time.slice(0, 5);
      timeGroups.forEach((group) => {
        group.times.forEach((time) => {
          if (scheduleStartTime >= time.start && scheduleStartTime < time.end) {
            const key = `${schedule.day_of_week}-${time.start}`;
            if (!map[key]) map[key] = [];
            map[key].push(schedule);
          }
        });
      });
    });
    return map;
  }, [schedules]);

  const triggerSecureAction = (action: () => void) => {
    if (isUnlocked) {
      action();
    } else {
      setPendingAction(() => action);
      setPin("");
      setPinError(false);
      setShowPinModal(true);
    }
  };

  const handlePinInput = (val: string) => {
    if (pin.length >= 6) return;
    const newPin = pin + val;
    setPin(newPin);
    setPinError(false);

    if (newPin.length === 6) {
      if (newPin === "113311") {
        setTimeout(() => {
          setIsUnlocked(true);
          setShowPinModal(false);
          setPin("");
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }, 300);
      } else {
        setPinError(true);
        setTimeout(() => {
          setPin("");
          setPinError(false);
        }, 500);
      }
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedStudent || !selectedStartTime || !selectedEndTime) {
      alert("Please select a student and ensure times are filled.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("schedules")
      .insert([
        {
          student_id: selectedStudent,
          type: selectedType,
          day_of_week: parseInt(selectedDay),
          start_time: selectedStartTime,
          end_time: selectedEndTime,
        },
      ])
      .select(
        `id, student_id, type, day_of_week, start_time, end_time, students(name)`,
      )
      .single();

    if (error) {
      console.error("INSERT ERROR:", error);
      alert("Failed to add schedule.");
    } else {
      if (data && data.type === activeTab) {
        setSchedules((prev) => [...prev, data as unknown as Schedule]);
      }
      setShowAddForm(false);
      setSelectedStudent("");
    }
    setSaving(false);
  };

  const handleQuickAdd = (day: number, startTime: string, endTime: string) => {
    setSelectedDay(day.toString());
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setSelectedType(activeTab);
    setShowAddForm(true);
    setShowMessageForm(false);
    const formElement = document.getElementById("add-schedule-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const phoneNumber = "84932775682";
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setMessageText("");
    setShowMessageForm(false);
  };

  const inputClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <section className="w-full antialiased" id="add-schedule-form">
      <div className="mx-auto w-full">
        {/* Header Tabs & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex w-fit rounded-lg bg-slate-200/80 p-1">
              {(["quebec", "vietnam"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowAddForm(false);
                    setShowMessageForm(false);
                  }}
                  className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>{tab === "quebec" ? "🇨🇦" : "🇻🇳"}</span>
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowMessageForm((prev) => !prev);
                  setShowAddForm(false);
                }}
                className={`hidden md:flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold shadow-sm transition active:scale-95 ${
                  showMessageForm
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                {showMessageForm ? "Close" : "Quick Message"}
              </button>

              <button
                onClick={() =>
                  triggerSecureAction(() => {
                    setShowAddForm((prev) => !prev);
                    setShowMessageForm(false);
                  })
                }
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
              >
                {isUnlocked ? (
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                ) : (
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
                <span className="hidden md:inline">
                  {showAddForm ? "Close" : "Add Schedule"}
                </span>
                <span className="md:hidden">
                  {showAddForm ? "Close" : "Add"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Legend Students */}
        {students.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Students:
            </span>
            {students.map((student) => {
              const color = getStudentColor(student.id);
              return (
                <div
                  key={student.id}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${color.bg} ${color.border} ${color.textName}`}
                >
                  <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                  {student.name}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Message Form */}
        {showMessageForm && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Giữ nguyên như cũ... */}
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-100 text-emerald-600">
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Send Quick Note to Workspace
                </h3>
                <p className="text-xs text-slate-500">
                  Automatically redirect and send to your WhatsApp.
                </p>
              </div>
            </div>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your note or reminder here..."
              rows={3}
              className={`${inputClassName} resize-none`}
            />
            <div className="mt-4 flex justify-end gap-3 border-t border-slate-200/80 pt-4">
              <button
                onClick={() => setShowMessageForm(false)}
                className="rounded-lg px-5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                Send via WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Giữ nguyên form */}
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-600">
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
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Add New Schedule
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className={`${inputClassName} ${!selectedStudent ? "text-slate-500" : "text-slate-900"}`}
                >
                  <option value="" disabled>
                    -- Select a student --
                  </option>
                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                      className="text-slate-900"
                    >
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className={inputClassName}
                >
                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.full}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Start Time
                </label>
                <input
                  type="time"
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  End Time
                </label>
                <input
                  type="time"
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-slate-200/80 pt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-lg px-5 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                disabled={saving || !selectedStudent}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        )}

        {/* Loader / Error */}
        {!loading && error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* 📅 TIMETABLE GRID (Cực kỳ tối ưu cho Mobile dựa trên image.png) */}
        {!loading && !error && (
          <div className="relative mt-5 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-auto max-h-[70vh]">
              {/* PC giữ bề ngang to (min-w-[900px]), Điện thoại bung 100% để khít 7 ngày */}
              <div className="min-w-full md:min-w-[900px] lg:min-w-[1024px]">
                {/* Header Row (Days) */}
                <div className="flex sticky top-0 z-30 bg-slate-50 border-b border-slate-200/80 shadow-sm">
                  {/* ÉP SIÊU NHỎ cột Time trên Mobile (w-[35px]) để nhường chỗ cho 7 ngày */}
                  <div className="sticky left-0 z-40 w-[35px] md:w-[120px] shrink-0 border-r border-slate-200/80 bg-slate-50 flex items-center justify-center p-0.5 md:p-3 text-[7px] md:text-xs font-bold uppercase tracking-widest text-slate-500">
                    Time
                  </div>
                  <div className="flex-1 grid grid-cols-7">
                    {days.map((day) => {
                      const isToday = day.value === currentDay;
                      return (
                        <div
                          key={day.value}
                          className={`border-l border-slate-200/60 p-1 md:p-3 text-center transition-colors ${isToday ? "bg-indigo-50/80" : ""}`}
                        >
                          {/* Mobile hiện 1 chữ (M, T, W), Desktop hiện đủ */}
                          <span
                            className={`text-[11px] md:text-sm font-bold ${isToday ? "text-indigo-700" : "text-slate-800"}`}
                          >
                            <span className="md:hidden">
                              {day.name.slice(0, 1)}
                            </span>
                            <span className="hidden md:inline">{day.name}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body Rows */}
                <div className="flex flex-col">
                  {timeGroups.map((group) => (
                    <div
                      key={group.label}
                      className="flex border-b border-slate-200/80 last:border-b-0"
                    >
                      {/* Cột 1: Cột Buổi (Ẩn trên Mobile) */}
                      <div className="hidden md:flex sticky left-0 z-20 w-[40px] shrink-0 border-r border-slate-200/80 bg-slate-100/50 flex-col items-center justify-center py-4">
                        <span className="text-xl mb-3">{group.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 [writing-mode:vertical-lr] rotate-180">
                          {group.label}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col min-w-0">
                        {group.times.map((time) => (
                          <div
                            key={time.start}
                            className="group/row flex border-b border-slate-200/60 last:border-b-0"
                          >
                            {/* Cột 2: Cột Giờ (Siêu hẹp trên Mobile) */}
                            <div className="sticky left-0 md:left-[40px] z-20 w-[35px] md:w-[80px] shrink-0 border-r border-slate-200/60 bg-white/95 backdrop-blur-sm px-0.5 md:px-2 py-2 md:py-3 flex flex-col items-center justify-center group-hover/row:bg-slate-50/80 transition-colors">
                              <span className="text-[8px] md:text-sm font-bold text-slate-800">
                                {time.start.slice(0, 5)}
                              </span>
                              <span className="text-[7px] md:text-xs font-medium text-slate-500">
                                {time.end.slice(0, 5)}
                              </span>
                            </div>

                            {/* Các ô Ngày (7 cột) */}
                            <div className="flex-1 grid grid-cols-7">
                              {days.map((day) => {
                                const isToday = day.value === currentDay;
                                const key = `${day.value}-${time.start}`;
                                const daySchedules = scheduleMap[key] || [];
                                const hasSchedules = daySchedules.length > 0;

                                return (
                                  <div
                                    key={key}
                                    className={`relative min-h-[50px] md:min-h-[72px] border-l border-slate-200/60 p-[1px] md:p-2 transition-colors ${isToday ? "bg-indigo-50/20" : "hover:bg-slate-50/60"}`}
                                  >
                                    {hasSchedules ? (
                                      <div className="space-y-[2px] md:space-y-2 h-full">
                                        {daySchedules.map((schedule) => {
                                          const color = getStudentColor(
                                            schedule.student_id,
                                          );
                                          return (
                                            <div
                                              key={schedule.id}
                                              title={`${schedule.students?.name} (${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)})`}
                                              className={`cursor-default rounded md:rounded-lg border p-[2px] md:p-2 shadow-sm transition-all hover:shadow flex flex-col justify-center h-full ${color.bg} ${color.border}`}
                                            >
                                              {/* 🖥️ VIEW LAPTOP: Hiển thị full (Dấu chấm, Tên đầy đủ, Giờ nằm ngang) */}
                                              <div className="hidden md:flex flex-col">
                                                <div className="flex items-center gap-2">
                                                  <span
                                                    className={`h-2 w-2 rounded-full ${color.dot} shrink-0`}
                                                  />
                                                  <p
                                                    className={`line-clamp-1 text-xs font-bold leading-tight ${color.textName}`}
                                                  >
                                                    {schedule.students?.name ??
                                                      "Unknown"}
                                                  </p>
                                                </div>
                                                <div
                                                  className={`mt-1 text-xs font-semibold ${color.textTime}`}
                                                >
                                                  {schedule.start_time.slice(
                                                    0,
                                                    5,
                                                  )}{" "}
                                                  -{" "}
                                                  {schedule.end_time.slice(
                                                    0,
                                                    5,
                                                  )}
                                                </div>
                                              </div>

                                              {/* 📱 VIEW MOBILE (TỐI ƯU CỰC ĐẠI THEO ẢNH): Xếp dọc thời gian để không bị chèn chữ */}
                                              <div className="flex md:hidden flex-col items-center justify-center w-full text-center space-y-[2px]">
                                                {/* Tên Học sinh (Truncate nếu quá dài) */}
                                                <p
                                                  className={`line-clamp-1 text-[9px] font-extrabold leading-none tracking-tight w-full ${color.textName}`}
                                                >
                                                  {schedule.students?.name?.split(
                                                    " ",
                                                  )[0] ?? "U"}
                                                </p>

                                                {/* Thời gian xếp chồng (09:00 \n 11:00) thay vì nằm ngang -> Giải quyết triệt để lỗi ép chữ! */}
                                                <div
                                                  className={`flex flex-col text-[7.5px] font-semibold leading-[1.1] tracking-tighter opacity-90 ${color.textTime}`}
                                                >
                                                  <span>
                                                    {schedule.start_time.slice(
                                                      0,
                                                      5,
                                                    )}
                                                  </span>
                                                  <span>
                                                    {schedule.end_time.slice(
                                                      0,
                                                      5,
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      /* Nút Quick Add */
                                      <button
                                        type="button"
                                        onClick={() =>
                                          triggerSecureAction(() =>
                                            handleQuickAdd(
                                              day.value,
                                              time.start,
                                              time.end,
                                            ),
                                          )
                                        }
                                        className="group-btn flex h-full w-full items-center justify-center rounded md:rounded-lg border border-dashed border-transparent bg-transparent opacity-0 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:opacity-100"
                                      >
                                        <span className="flex h-4 w-4 md:h-6 md:w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                                          {isUnlocked ? (
                                            <span className="text-[10px] md:text-base">
                                              +
                                            </span>
                                          ) : (
                                            <svg
                                              className="h-2.5 w-2.5 md:h-3.5 md:w-3.5"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                              />
                                            </svg>
                                          )}
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
