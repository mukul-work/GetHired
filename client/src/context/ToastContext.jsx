import { useState, useCallback, useRef, useEffect } from "react";
import { ToastContext } from "./toastContext";

const ICONS = {
  success: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 8l2.5 2.5 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 5.5l5 5M10.5 5.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L14.5 13.5H1.5L8 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.5v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="4.75" r="0.75" fill="currentColor" />
    </svg>
  ),
};

const STYLES = {
  success: {
    icon: "text-emerald-600",
    bar: "bg-emerald-500",
    label: "text-emerald-700",
  },
  error: { icon: "text-red-500", bar: "bg-red-500", label: "text-red-600" },
  warning: {
    icon: "text-amber-500",
    bar: "bg-amber-400",
    label: "text-amber-600",
  },
  info: { icon: "text-blue-500", bar: "bg-blue-500", label: "text-blue-600" },
};

function Toast({
  id,
  type = "info",
  title,
  message,
  duration = 4000,
  onRemove,
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const s = STYLES[type] || STYLES.info;

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    // Enter
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss
    timerRef.current = setTimeout(dismiss, duration);
    return () => clearTimeout(timerRef.current);
  }, [dismiss, duration]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        transform:
          visible && !leaving
            ? "translateX(0)"
            : "translateX(calc(100% + 24px))",
        opacity: visible && !leaving ? 1 : 0,
        transition:
          "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3.5 min-w-70 max-w-90 cursor-pointer select-none"
        onClick={dismiss}
        onMouseEnter={() => clearTimeout(timerRef.current)}
        onMouseLeave={() => {
          timerRef.current = setTimeout(dismiss, 1500);
        }}
      >
        {/* Colored icon */}
        <span className={`mt-0.5 shrink-0 ${s.icon}`}>{ICONS[type]}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-semibold leading-tight ${s.label}`}>
              {title}
            </p>
          )}
          {message && (
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              {message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.75 ${s.bar} rounded-b-xl`}
        style={{
          width: "100%",
          transformOrigin: "left",
          animation: visible ? `shrink ${duration}ms linear forwards` : "none",
        }}
      />

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type, title, message, duration) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [
      ...prev.slice(-4),
      { id, type, title, message, duration },
    ]);
  }, []);

  const api = {
    success: (title, message, dur) => toast("success", title, message, dur),
    error: (title, message, dur) => toast("error", title, message, dur),
    warning: (title, message, dur) => toast("warning", title, message, dur),
    info: (title, message, dur) => toast("info", title, message, dur),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Portal */}
      <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-2.5 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
