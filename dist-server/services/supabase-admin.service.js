/* =========================================================
   SUPABASE ADMIN — SERVER ONLY
========================================================= */
import { createClient } from "@supabase/supabase-js";
/* =========================================================
   ENVIRONMENT
========================================================= */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
/* =========================================================
   CHECK
========================================================= */
if (!supabaseUrl) {
    throw new Error("SUPABASE_URL est manquant.");
}
if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY est manquant.");
}
/* =========================================================
   CLIENT

   ⚠️ SERVER ONLY

   Ce client contourne les règles RLS.
   Il ne doit jamais être utilisé dans src/.
========================================================= */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
