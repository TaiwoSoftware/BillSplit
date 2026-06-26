"use client";

import { Copy } from "lucide-react";

interface CopyLinkCardProps {
  link: string;
}

export default function CopyLinkCard({
  link,
}: CopyLinkCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="font-semibold">
        Share Payment Link
      </h3>

      <div className="mt-4 flex gap-3">
        <input
          readOnly
          value={link}
          className="flex-1 rounded-xl border px-4 py-3"
        />

        <button
          onClick={handleCopy}
          className="rounded-xl bg-blue-600 px-5 text-white"
        >
          <Copy />
        </button>
      </div>
    </div>
  );
}