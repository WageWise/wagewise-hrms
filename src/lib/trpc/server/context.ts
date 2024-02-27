import { createClient } from "@/lib/supabase/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";

export async function createContext() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.auth.getUser();

  return {
    supabase,
    user: data.user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
