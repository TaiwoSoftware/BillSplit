import { supabase } from "@/app/lib/supabase";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CalendarDays,
} from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicProfile({
  params,
}: Props) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-10 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600">
            User Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            This profile doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const avatar =
    profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.full_name
    )}&background=2563eb&color=fff&size=256`;

  return (
    <main className="min-h-screen bg-slate-100 py-16 px-5">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-xl overflow-hidden">

        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Profile */}
        <div className="relative px-10 pb-10">

          {/* Avatar */}
          <img
            src={avatar}
            alt={profile.full_name}
            className="absolute -top-16 h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
          />

          <div className="pt-20">

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold">
                {profile.full_name}
              </h1>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Verified
              </span>
            </div>

            <p className="mt-2 text-lg text-slate-500">
              {profile.occupation}
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <span>{profile.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <span>{profile.phone || "Not provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <span>{profile.country}</span>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" />
                <span>{profile.occupation}</span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-600" />
                <span>
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {profile.account_type}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}