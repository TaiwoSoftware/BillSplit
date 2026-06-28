"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import {
  X,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
} from "lucide-react";

export default function SecuritySection() {
  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [showSessions, setShowSessions] =
    useState(false);

  const [showHistory, setShowHistory] =
    useState(false);

  const [twoFactor, setTwoFactor] =
    useState(false);

  const [passwords, setPasswords] =
    useState({
      current: "",
      new: "",
      confirm: "",
    });

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePassword = () => {
    if (
      passwords.new !== passwords.confirm
    ) {
      alert("Passwords do not match.");
      return;
    }

    alert(
      "Password changed successfully!"
    );

    setPasswords({
      current: "",
      new: "",
      confirm: "",
    });

    setShowPasswordModal(false);
  };

  const activeSessions = [
    {
      device: "Windows Laptop",
      browser: "Chrome",
      location: "Lagos, Nigeria",
      current: true,
      icon: Laptop,
    },
    {
      device: "Android Phone",
      browser: "Chrome Mobile",
      location: "Abuja, Nigeria",
      current: false,
      icon: Smartphone,
    },
  ];

  const loginHistory = [
    {
      date: "Today • 8:45 AM",
      location: "Lagos",
    },
    {
      date: "Yesterday • 9:12 PM",
      location: "Ibadan",
    },
    {
      date: "3 Days Ago",
      location: "Lagos",
    },
  ];

  return (
    <>
      <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold">
          Security
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Button
            onClick={() =>
              setShowPasswordModal(true)
            }
          >
            Change Password
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setTwoFactor(!twoFactor)
            }
          >
            {twoFactor
              ? "Disable Two-Factor Authentication"
              : "Enable Two-Factor Authentication"}
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setShowSessions(true)
            }
          >
            Active Sessions
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setShowHistory(true)
            }
          >
            Login History
          </Button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-100 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-600" />

            <div>
              <p className="font-semibold">
                Two-Factor Authentication
              </p>

              <p className="text-sm text-slate-500">
                Status:
                <span
                  className={`ml-2 font-semibold ${
                    twoFactor
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {twoFactor
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PASSWORD MODAL */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Change Password
              </h2>

              <button
                onClick={() =>
                  setShowPasswordModal(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                name="current"
                placeholder="Current Password"
                value={passwords.current}
                onChange={
                  handlePasswordChange
                }
                className="w-full rounded-xl border p-3"
              />

              <input
                type="password"
                name="new"
                placeholder="New Password"
                value={passwords.new}
                onChange={
                  handlePasswordChange
                }
                className="w-full rounded-xl border p-3"
              />

              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={passwords.confirm}
                onChange={
                  handlePasswordChange
                }
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setShowPasswordModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={savePassword}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SESSIONS */}

      {showSessions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Active Sessions
              </h2>

              <button
                onClick={() =>
                  setShowSessions(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {activeSessions.map(
                (session, index) => {
                  const Icon =
                    session.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className="text-blue-600" />

                        <div>
                          <h3 className="font-semibold">
                            {
                              session.device
                            }
                          </h3>

                          <p className="text-sm text-slate-500">
                            {
                              session.browser
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            {
                              session.location
                            }
                          </p>
                        </div>
                      </div>

                      {session.current && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Current
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN HISTORY */}

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Login History
              </h2>

              <button
                onClick={() =>
                  setShowHistory(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {loginHistory.map(
                (login, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl border p-4"
                  >
                    <Globe className="text-blue-600" />

                    <div>
                      <h3 className="font-semibold">
                        {login.date}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {login.location}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}