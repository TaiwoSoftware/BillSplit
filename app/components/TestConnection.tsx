"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function TestPage() {
  useEffect(() => {
    async function test() {
      const { data, error } =
        await supabase.auth.getSession();

      console.log(data);
      console.log(error);
    }

    test();
  }, []);

  return <h1>Testing Supabase...</h1>;
}