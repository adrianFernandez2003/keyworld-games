"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserProvider } from "@/context/user-context";

export function SessionSyncProvider({ children }: { children: React.ReactNode }) {
  const [sessionKey, setSessionKey] = useState("initial");

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🧩 Cambio de sesión:", event);
      setSessionKey(session?.user.id || "guest");
    });


    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionKey(session?.user.id || "guest");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (sessionKey === "initial") return null;

  return <UserProvider key={sessionKey}>{children}</UserProvider>;
}
