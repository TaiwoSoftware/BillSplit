import React from 'react'

export default function RecentBills() {
  return (
   <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

                        <h2 className="text-xl font-bold">
                            Recent Bills
                        </h2>

                        <div className="mt-8 overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b text-left">

                                        <th className="pb-3">
                                            Bill
                                        </th>

                                        <th className="pb-3">
                                            Amount
                                        </th>

                                        <th className="pb-3">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr className="border-b">

                                        <td className="py-4">
                                            Birthday Dinner
                                        </td>

                                        <td>
                                            ₦30,000
                                        </td>

                                        <td className="text-green-600">
                                            Active
                                        </td>

                                    </tr>

                                    <tr>

                                        <td className="py-4">
                                            House Rent
                                        </td>

                                        <td>
                                            ₦200,000
                                        </td>

                                        <td className="text-blue-600">
                                            Completed
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </section>
  )
}
