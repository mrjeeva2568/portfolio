import { supabase } from "./config";

export async function checkSupabaseHealth() {
  let user = null as { id?: string; email?: string } | null;

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    user = userData.user;

    const { error } = await supabase.from("settings").select("id").limit(1);
    if (error) throw error;

    return {
      success: true,
      auth: !!user,
      userId: user?.id,
      userEmail: user?.email,
      databaseConnected: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Supabase error",
      auth: !!user,
      userId: user?.id,
      userEmail: user?.email,
      databaseConnected: false,
    };
  }
}

export const checkFirebaseHealth = checkSupabaseHealth;
