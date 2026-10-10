"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type AlertType = "error" | "success" | "info" | "warning";

export interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmColor?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((options: AlertOptions) => setAlert(options), []);
  const hideAlert = useCallback(() => setAlert(null), []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && <AlertModal alert={alert} onClose={hideAlert} />}
    </AlertContext.Provider>
  );
}

function AlertModal({ alert, onClose }: { alert: AlertOptions; onClose: () => void }) {
  const {
    title,
    message,
    type = "info",
    confirmText = "OK",
    cancelText = "Batal",
    showCancel = false,
    onConfirm,
    onCancel,
    confirmColor,
  } = alert;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const icons = {
    error: <AlertTriangle className="w-8 h-8 text-red-500" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-500" />,
    success: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
    info: <Info className="w-8 h-8 text-blue-500" />,
  };

  const bgColors = {
    error: "bg-red-50",
    warning: "bg-amber-50",
    success: "bg-emerald-50",
    info: "bg-blue-50",
  };

  const defaultButtonColors = {
    error: "bg-red-500 hover:bg-red-600",
    warning: "bg-amber-500 hover:bg-amber-600",
    success: "bg-emerald-500 hover:bg-emerald-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  const btnColor = confirmColor || defaultButtonColors[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={showCancel ? handleCancel : handleConfirm} />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <div className={`w-16 h-16 rounded-full ${bgColors[type]} flex items-center justify-center mb-6`}>
          {icons[type]}
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">{title}</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 w-full">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3.5 rounded-xl text-white font-bold transition-colors shadow-lg ${btnColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
}
