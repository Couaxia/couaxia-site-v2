import {
    defineConfig
} from "vite";

import vue
    from "@vitejs/plugin-vue";


export default defineConfig({

    /* =====================================================
       PLUGINS
    ====================================================== */

    plugins: [
        vue()
    ],


    /* =====================================================
       SERVEUR DE DÉVELOPPEMENT
    ====================================================== */

    server: {

        port:
            5173,


        /* =================================================
           PROXY API
        ================================================== */

        proxy: {

            "/api": {

                target:
                    "http://localhost:3000",

                changeOrigin:
                    true,

                secure:
                    false

            }

        }

    }

});