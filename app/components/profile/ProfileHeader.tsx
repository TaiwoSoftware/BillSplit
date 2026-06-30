"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useRef, useEffect } from "react";
import Button from "@/app/components/ui/Button";
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    Pencil,
    X,
} from "lucide-react";
type Profile = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
    country: string;
    occupation: string;
    account_type: string;
    onboard: string;
    created_at: string;
};
export default function ProfileHeader() {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        location: "",
        joined: "",
        verified: true,
        avatar: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        location: "",
        avatar: "",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setProfile((prev) => ({
            ...prev,
            avatar: imageUrl,
        }));

        setFormData((prev) => ({
            ...prev,
            avatar: imageUrl,
        }));
    };
    const fetchProfile = async () => {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }
        console.log("User:", user);
        console.log("Profile Data:", data);
        const profileData = {
            name: data.full_name || "",
            role: data.occupation || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            location: data.country || "",
            joined: data.created_at
                ? new Date(data.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })
                : "",
            verified: true,
            avatar:
                data.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    data.full_name || "User"
                )}&background=2563eb&color=fff`,
        };

        setProfile(profileData);
        setFormData(profileData);

        setLoading(false);
    };
    const saveProfile = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("You are not logged in.");
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: formData.name,
                phone: formData.phone,
                country: formData.location,
                occupation: formData.role,
                avatar_url: formData.avatar,
            })
            .eq("id", user.id);

        if (error) {
            console.error(error);
            alert("Failed to update profile.");
            return;
        }

        // Update the UI immediately
        setProfile((prev) => ({
            ...prev,
            ...formData,
        }));

        setIsEditing(false);

        alert("Profile updated successfully!");
    };

    const shareProfile = async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/profile`
            );

            alert("Profile link copied!");
        } catch {
            alert("Unable to copy profile link.");
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (loading) {
        return (
            <div className="flex h-80 items-center justify-center">
                <p className="text-slate-500">
                    Loading profile...
                </p>
            </div>
        );
    }
    return (
        <>
            <section className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Side */}
                    <div className="flex flex-col items-center gap-6 md:flex-row">
                        {/* Profile Picture */}
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover"
                            />

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />

                            {/* Camera Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition hover:bg-blue-700"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        {/* User Details */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold">
                                    {profile.name}
                                </h1>

                                {profile.verified && (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        Verified
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 text-slate-500">
                                {profile.role}
                            </p>

                            <div className="mt-5 grid gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-3">
                                    <Mail
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    {profile.email}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    {profile.phone}
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    {profile.location}
                                </div>

                                <div className="flex items-center gap-3">
                                    <CalendarDays
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    Joined {profile.joined}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil size={18} />
                            Edit Profile
                        </Button>

                        <Button
                            variant="outline"
                            onClick={shareProfile}
                        >
                            Share Profile
                        </Button>
                    </div>
                </div>
            </section>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Edit Profile
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                <X />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block font-medium">
                                    Full Name
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium">
                                    Profession
                                </label>

                                <input
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium">
                                    Email
                                </label>

                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium">
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-medium">
                                    Location
                                </label>

                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>

                            <Button onClick={saveProfile}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}