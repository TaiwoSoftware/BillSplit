import React from 'react'

export default function Preferences() {
    return (
        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold">
                Account Preferences
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div>

                    <label className="mb-2 block font-medium">
                        Currency
                    </label>

                    <select className="w-full rounded-xl border p-3">

                        <option>NGN (₦)</option>

                        <option>USD ($)</option>

                        <option>EUR (€)</option>

                    </select>

                </div>

                <div>

                    <label className="mb-2 block font-medium">
                        Language
                    </label>

                    <select className="w-full rounded-xl border p-3">

                        <option>English</option>

                        <option>French</option>

                    </select>

                </div>

            </div>

        </section>
    )
}
