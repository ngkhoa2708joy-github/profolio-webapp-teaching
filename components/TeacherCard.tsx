"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const messages = [
  "Need some help? 👋",
  "Let's keep going! 💪",
  "You've got this! ✨",
];

export default function TeacherCard() {
  const router = useRouter();

  // States cho Bubble Chat
  const [message, setMessage] = useState<string | null>(null);

  // States cho Security PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Logic hiển thị Bubble Chat
  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const cycleMessage = () => {
      setMessage(messages[index]);
      index = (index + 1) % messages.length;

      timeoutId = setTimeout(() => {
        setMessage(null);
      }, 3000);
    };

    setTimeout(cycleMessage, 1000);
    intervalId = setInterval(cycleMessage, 7000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  // 🔑 Xử lý gõ PIN Code
  const handlePinInput = (val: string) => {
    if (pin.length >= 6 || isSuccess) return; // Khóa không cho gõ thêm nếu đang check
    const newPin = pin + val;
    setPin(newPin);
    setPinError(false);

    if (newPin.length === 6) {
      if (newPin === "113311") {
        // Đúng Pass: Set trạng thái thành công, chờ 300ms rồi chuyển trang
        setIsSuccess(true);
        setTimeout(() => {
          setShowPinModal(false);
          router.push("/teacher"); // Chuyển trang
        }, 400);
      } else {
        // Sai Pass: Báo đỏ và tự xóa
        setPinError(true);
        setTimeout(() => {
          setPin("");
          setPinError(false);
        }, 500);
      }
    }
  };

  return (
    <>
      {/* 
        Đổi thẻ <Link> thành <button> để bắt sự kiện mở Modal thay vì chuyển trang thẳng.
        Lưu ý: className="text-left" để nội dung bên trong không bị canh giữa theo thuộc tính mặc định của button.
      */}
      <button
        onClick={() => setShowPinModal(true)}
        className="group block w-full text-left outline-none"
      >
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-50/80 transition-transform duration-500 group-hover:scale-[1.8]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              {/* Avatar & Speech Bubble */}
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl shadow-inner ring-1 ring-indigo-100/50 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-md">
                  👨‍🏫
                </div>

                {message && (
                  <div className="absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300">
                    {message}
                    <div className="absolute top-full left-1/2 -mt-px -ml-1.5 border-x-[6px] border-t-[6px] border-x-transparent border-t-slate-900" />
                  </div>
                )}
              </div>

              {/* Action Arrow Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md">
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
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

            {/* Information */}
            <div className="mt-5">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-950">
                Anh Khoa's Workspace
              </h2>

              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600 ring-1 ring-indigo-500/10">
                  Teacher
                </span>
                <span className="text-xs font-medium text-slate-500">
                  ngkhoa2708.joy@gmail.com
                </span>
              </div>
            </div>

            {/* CTA Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-bold text-slate-500 transition-colors group-hover:text-indigo-600">
                Manage classes
              </span>
              <svg
                className="h-4 w-4 text-slate-300 transition-colors group-hover:text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* 🛡️ PIN Modal Overlay */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-5">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Restricted Access
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Wanna access workspace? <br /> Please enter your PIN.
              </p>
            </div>

            {/* Pin Indicator Dots */}
            <div className="mt-8 flex justify-center gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
                    i < pin.length
                      ? isSuccess
                        ? "bg-emerald-500 scale-110"
                        : "bg-slate-800 scale-110"
                      : "bg-slate-200"
                  } ${pinError ? "bg-red-500 animate-pulse" : ""}`}
                />
              ))}
            </div>

            {/* Numpad */}
            <div className="mt-10 grid grid-cols-3 gap-y-6 gap-x-4 px-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-2xl font-semibold text-slate-900 transition hover:bg-slate-200 active:scale-90"
                >
                  {num}
                </button>
              ))}

              {/* Clear Button */}
              <button
                onClick={() => {
                  setPin("");
                  setPinError(false);
                }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-90"
              >
                CLEAR
              </button>

              <button
                onClick={() => handlePinInput("0")}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-2xl font-semibold text-slate-900 transition hover:bg-slate-200 active:scale-90"
              >
                0
              </button>

              {/* Delete Button */}
              <button
                onClick={() => {
                  setPin((prev) => prev.slice(0, -1));
                  setPinError(false);
                }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-90"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                  />
                </svg>
              </button>
            </div>

            {/* Cancel Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin("");
                  setPinError(false);
                  setIsSuccess(false);
                }}
                className="rounded-full px-6 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
