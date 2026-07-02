"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Activity = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bills")
      .select("id,title,status,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error(error);
    } else {
      setActivities(data);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";

      case "active":
        return "text-blue-600";

      case "cancelled":
        return "text-red-600";

      default:
        return "text-orange-500";
    }
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      {loading ? (
        <p className="mt-6 text-slate-500">
          Loading activity...
        </p>
      ) : activities.length === 0 ? (
        <p className="mt-6 text-slate-500">
          No recent activity yet.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between border-b pb-4 last:border-b-0"
            >
              <div>
                <p className="font-semibold">
                  Created "{activity.title}"
                </p>

                <p className="text-sm text-slate-500">
                  {new Date(
                    activity.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <span
                className={getStatusColor(
                  activity.status
                )}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}