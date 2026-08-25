import {
    createClient
} from "@supabase/supabase-js";


/* =========================================================
   VARIABLES D'ENVIRONNEMENT
========================================================= */

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY;


/* =========================================================
   VÉRIFICATION
========================================================= */

if (!supabaseUrl) {

    throw new Error(
        "VITE_SUPABASE_URL est manquante dans le fichier .env"
    );

}

if (!supabaseAnonKey) {

    throw new Error(
        "VITE_SUPABASE_ANON_KEY est manquante dans le fichier .env"
    );

}


/* =========================================================
   CLIENT SUPABASE
========================================================= */

export const supabase =
    createClient(
        supabaseUrl,
        supabaseAnonKey
    );