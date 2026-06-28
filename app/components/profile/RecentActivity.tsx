import React from 'react'

export default function RecentActivity() {
  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="text-xl font-bold">
                            Recent Activity
                        </h2>

                        <div className="mt-8 space-y-5">

                            <div className="flex justify-between border-b pb-4">
                                <div>
                                    <p className="font-semibold">
                                        Created "Birthday Dinner"
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Today • 2:35 PM
                                    </p>
                                </div>

                                <span className="text-green-600">
                                    Completed
                                </span>
                            </div>

                            <div className="flex justify-between border-b pb-4">
                                <div>
                                    <p className="font-semibold">
                                        Sent reminder to John
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Yesterday
                                    </p>
                                </div>

                                <span className="text-blue-600">
                                    Sent
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">
                                        Added new participant
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        2 days ago
                                    </p>
                                </div>

                                <span className="text-orange-500">
                                    Pending
                                </span>
                            </div>

                        </div>

                    </section>
  )
}
