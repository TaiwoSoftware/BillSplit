"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import { X, AlertTriangle } from "lucide-react";

export default function DangerZone() {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [deleteText, setDeleteText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogout = async () => {
    setLoading(true);

    // TODO:
    // await supabase.auth.signOut();

    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1000);
  };

  const handleDelete = async () => {
    if (deleteText !== "DELETE") {
      alert("Type DELETE to continue.");
      return;
    }

    setLoading(true);

    // TODO:
    // Delete account from Supabase
    // Delete user profile
    // Delete bills

    setTimeout(() => {
      setLoading(false);
      alert("Account deleted.");

      router.push("/");
    }, 1500);
  };

  return (
    <>
      <section className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
        <h2 className="text-xl font-bold text-red-700">
          Danger Zone
        </h2>

        <p className="mt-3 text-red-600">
          These actions cannot be undone.
        </p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <Button
            variant="danger"
            onClick={() =>
              setShowDeleteModal(true)
            }
          >
            Delete Account
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >
            Logout
          </Button>
        </div>
      </section>

      {/* Logout Modal */}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-md rounded-3xl bg-white p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Logout
              </h2>

              <button
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                <X />
              </button>
            </div>

            <p className="text-slate-600">
              Are you sure you want to log
              out?
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                loading={loading}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-600" />

                <h2 className="text-2xl font-bold text-red-600">
                  Delete Account
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                <X />
              </button>
            </div>

            <p className="text-slate-600">
              This action is permanent.
              Your account, bills,
              payments and history will be
              deleted forever.
            </p>

            <div className="mt-6">
              <label className="mb-2 block font-medium">
                Type{" "}
                <span className="font-bold text-red-600">
                  DELETE
                </span>{" "}
                to continue
              </label>

              <input
                type="text"
                value={deleteText}
                onChange={(e) =>
                  setDeleteText(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-red-300 px-4 py-3 outline-none focus:border-red-500"
                placeholder="DELETE"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                loading={loading}
                onClick={handleDelete}
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}