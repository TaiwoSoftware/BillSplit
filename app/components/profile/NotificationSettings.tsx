import React from 'react'

export default function NotificationSettings() {
  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-bold">
                            Notification Settings
                        </h2>

                        <div className="mt-8 space-y-6">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">
                                        Email Notifications
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Receive bill reminders and payment updates.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-5 w-5"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">
                                        SMS Notifications
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Get payment reminders via SMS.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    className="h-5 w-5"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">
                                        Push Notifications
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Receive instant alerts.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-5 w-5"
                                />
                            </div>

                        </div>
                    </section>
  )
}
