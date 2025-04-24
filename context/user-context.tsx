"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string;
  last_name: string;
  avatar_url: string | null;
  is_publisher?: boolean;
  updated_at: string;
  username: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updating: boolean;
  refreshUser: () => Promise<void>; 
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updating: false,
  refreshUser: async () => {}, 
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUser = async () => {
    setUpdating(true);
    try {
      const supabase = createClient();

     
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

  
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, last_name, username, avatar_url, is_publisher, updated_at")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("❌ Error al obtener perfil:", error.message);
        setUser(null);
      } else {
        setUser(profile);
      }
    } catch (err) {
      console.error("❌ Error general en fetchUser:", err);
      setUser(null);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth event:", event);
      console.log("🧾 Nueva sesión:", session);
      fetchUser(); 
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updating, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
