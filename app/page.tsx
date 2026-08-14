import StudentCard from "../components/StudentCard";
import { supabase } from "../lib/supabase";
import TeacherCard from "../components/TeacherCard";
import TimetableSection from "../components/TimetableSection";

export default async function Home() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/30 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            Unable to load students
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Something went wrong while loading the student profiles.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Header */}
      <header className="bg-white pt-8 pb-3">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Profolio Workspace
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back!
              </h1>
            </div>

            {/* Contact Dropdown */}
            <div className="group relative hidden sm:block">
              <div className="flex h-11 w-32 cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow">
                Contact me
                <svg
                  className="h-4 w-4 opacity-70 transition-transform group-hover:translate-y-0.5"
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

              <div className="invisible absolute right-0 top-full z-50 mt-3 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl ring-1 ring-black/5 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <a
                  href="https://zalo.me/0932775682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.477 2 2 5.58 2 10c0 2.58 1.45 4.9 3.72 6.3L5 21l4.55-2.42c.79.18 1.61.27 2.45.27 5.523 0 10-3.58 10-8.85C22 5.58 17.523 2 12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7.3 7.1h5.15v1.4l-3.3 4.05h3.4v1.35H7.15v-1.4l3.3-4.05H7.3V7.1Zm8.7 0h1.5v6.8H16V7.1Zm.75-1.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  Zalo: 0932775682
                </a>

                <a
                  href="https://wa.me/0932775682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.1 2 11.15c0 1.8.58 3.48 1.58 4.87L2.3 21.8l5.93-1.72A10.8 10.8 0 0 0 12 20.3c5.52 0 10-4.1 10-9.15C22 6.1 17.52 2 12 2Z"
                      />
                      <path
                        fill="#fff"
                        d="M16.87 13.72c-.27-.14-1.6-.8-1.85-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.92 2.92 4.65 4.09.65.28 1.16.45 1.55.57.65.2 1.24.17 1.71.1.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
                      />
                    </svg>
                  </div>
                  WhatsApp: 0932775682
                </a>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ngkhoa2708.joy@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M2.5 6.5v11c0 .83.67 1.5 1.5 1.5h2V9.3L12 13.5l6-4.2V19h2c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5h-.7L12 9.2 4.7 5H4c-.83 0-1.5.67-1.5 1.5Z"
                      />
                      <path fill="#4285F4" d="M6 9.3V19h2V10.7L6 9.3Z" />
                      <path fill="#34A853" d="M18 9.3V19h-2V10.7l2-1.4Z" />
                    </svg>
                  </div>
                  ngkhoa2708.joy@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Timetable Section */}
      <TimetableSection />

      {/* 3. Main content */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Choose your Profolio.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Select your profile to access your grades, assignments, learning
              materials, and progress.
            </p>
          </div>

          {/* Student cards */}
          {!students || students.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No student profiles found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                There are currently no student profiles available in the system.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TeacherCard />
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
          <p className="text-center text-sm font-medium text-slate-400">
            Profolio &middot; Learning made simple
          </p>
        </div>
      </footer>
    </main>
  );
}
