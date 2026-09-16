import StudentCard from "../components/StudentCard";
import { supabase } from "../lib/supabase";
import TeacherCard from "../components/TeacherCard";
import TimetableSection from "../components/TimetableSection";

const Icon = {
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Zm6.5 13.5.75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25-2.25-.75 2.25-.75.75-2.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default async function Home() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-2xl shadow-rose-900/10 ring-1 ring-slate-900/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 shadow-inner">
            <span className="text-2xl font-black">!</span>
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            Unable to load students
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Something went wrong while loading the student profiles.
          </p>
          <div className="mt-6 rounded-2xl bg-rose-50/50 px-4 py-3.5 text-center text-sm font-medium text-rose-700">
            Please refresh the page and try again.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-violet-600 selection:text-white">
      {/* Header / Hero */}
      <header className="relative overflow-visible border-b border-slate-200/60 bg-white">
        {/* Colorful Mesh Background Blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-20 h-[30rem] w-[30rem] rounded-full bg-violet-400/20 blur-[100px]" />
          <div className="absolute -left-20 top-10 h-[25rem] w-[25rem] rounded-full bg-cyan-400/20 blur-[100px]" />
          <div className="absolute left-1/2 top-0 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-fuchsia-400/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              {/* Vibrant Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-200 bg-violet-50/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-violet-700 backdrop-blur-md shadow-sm shadow-violet-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600"></span>
                </span>
                Profolio Workspace
              </div>

              {/* Gradient Text for Heading */}
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">
                  Welcome back
                </span>
                <span className="text-cyan-500">.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Your learning hub for schedules, students, assignments,
                resources, and academic progress.
              </p>
            </div>

            {/* Desktop contact menu with Gradient Button */}
            <div className="group relative hidden shrink-0 sm:block mt-2">
              <button
                type="button"
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/40 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                aria-label="Open contact options"
              >
                Contact me
                <span className="text-white/80 transition-transform duration-200 group-hover:rotate-180 group-hover:text-white">
                  {Icon.chevronDown}
                </span>
              </button>

              <div className="invisible absolute right-0 top-full z-50 mt-3 w-72 translate-y-2 rounded-2xl border border-slate-100 bg-white/90 p-2.5 opacity-0 backdrop-blur-xl shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <ContactLink
                  href="https://zalo.me/0932775682"
                  label="Zalo"
                  value="0932775682"
                  tone="blue"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M12 2C6.477 2 2 5.58 2 10c0 2.58 1.45 4.9 3.72 6.3L5 21l4.55-2.42c.79.18 1.61.27 2.45.27 5.523 0 10-3.58 10-8.85C22 5.58 17.523 2 12 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7.3 7.1h5.15v1.4l-3.3 4.05h3.4v1.35H7.15v-1.4l3.3-4.05H7.3V7.1Zm8.7 0h1.5v6.8H16V7.1Zm.75-1.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
                        fill="white"
                      />
                    </svg>
                  }
                />
                <ContactLink
                  href="https://wa.me/0932775682"
                  label="WhatsApp"
                  value="0932775682"
                  tone="green"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.1 2 11.15c0 1.8.58 3.48 1.58 4.87L2.3 21.8l5.93-1.72A10.8 10.8 0 0 0 12 20.3c5.52 0 10-4.1 10-9.15C22 6.1 17.52 2 12 2Z"
                      />
                      <path
                        fill="#fff"
                        d="M16.87 13.72c-.27-.14-1.6-.8-1.85-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.92 2.92 4.65 4.09.65.28 1.16.45 1.71.1.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
                      />
                    </svg>
                  }
                />
                <ContactLink
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ngkhoa2708.joy@gmail.com"
                  label="Email"
                  value="ngkhoa2708.joy@gmail.com"
                  tone="red"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        fill="currentColor"
                        d="M2.5 6.5v11c0 .83.67 1.5 1.5 1.5h2V9.3L12 13.5l6-4.2V19h2c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5h-.7L12 9.2 4.7 5H4c-.83 0-1.5.67-1.5 1.5Z"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Mobile contact actions */}
          <div className="mt-8 flex gap-3 sm:hidden">
            <a
              href="https://zalo.me/0932775682"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/50 px-3 text-xs font-bold text-blue-700 shadow-sm border border-blue-200/50 transition-colors hover:from-blue-100 hover:to-blue-200"
            >
              Zalo
            </a>
            <a
              href="https://wa.me/0932775682"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 px-3 text-xs font-bold text-emerald-700 shadow-sm border border-emerald-200/50 transition-colors hover:from-emerald-100 hover:to-emerald-200"
            >
              WhatsApp
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ngkhoa2708.joy@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-gradient-to-b from-rose-50 to-rose-100/50 px-3 text-xs font-bold text-rose-600 shadow-sm border border-rose-200/50 transition-colors hover:from-rose-100 hover:to-rose-200"
            >
              Email
            </a>
          </div>
        </div>
      </header>

      {/* Schedule Section with Dot Pattern */}
      <section className="relative border-b border-slate-200/60 bg-slate-50 overflow-hidden">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-5 flex items-center justify-between sm:mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100">
                  {Icon.sparkle}
                </span>
                Schedule
              </div>
              <h2 className="mt-2.5 text-xl font-bold text-slate-900 sm:text-2xl">
                Teaching timetable
              </h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5">
            <TimetableSection />
          </div>
        </div>
      </section>

      {/* Student directory */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-600 ring-1 ring-sky-200/60">
                {Icon.users}
                Student directory
              </div>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Choose your Profolio
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-500">
                Select a profile to access grades, assignments, learning
                materials, and progress tracking.
              </p>
            </div>

            {students && students.length > 0 && (
              <div className="shrink-0 self-start rounded-full border border-sky-100 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-700 sm:self-auto shadow-sm">
                {students.length} student{students.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {!students || students.length === 0 ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-20 text-center sm:py-28">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-100 to-indigo-50 text-indigo-500 shadow-sm ring-1 ring-slate-900/5">
                {Icon.users}
              </div>
              <h3 className="relative mt-6 text-xl font-bold text-slate-900">
                No student profiles found
              </h3>
              <p className="relative mx-auto mt-2 max-w-md text-base leading-relaxed text-slate-500">
                There are currently no student profiles available in the system.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              <TeacherCard />
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-sm font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white font-bold text-xs">
              P
            </span>
            Profolio <span className="text-slate-300 font-normal">|</span>{" "}
            Learning made simple
          </p>
          <span className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}

function ContactLink({
  href,
  label,
  value,
  tone,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  tone: "blue" | "green" | "red";
  icon: React.ReactNode;
}) {
  const toneClasses = {
    blue: "bg-blue-100/50 text-blue-600 group-hover:bg-blue-200/60 group-hover:shadow-blue-500/20",
    green:
      "bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-200/60 group-hover:shadow-emerald-500/20",
    red: "bg-rose-100/50 text-rose-500 group-hover:bg-rose-200/60 group-hover:shadow-rose-500/20",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm ${toneClasses[tone]}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm font-bold text-slate-700">{value}</p>
      </div>

      <span className="text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-500">
        {Icon.arrowRight}
      </span>
    </a>
  );
}
