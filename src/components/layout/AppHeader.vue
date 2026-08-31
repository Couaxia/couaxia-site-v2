<script setup lang="ts">

import {
    onMounted,
    ref
} from "vue";

import {
    RouterLink
} from "vue-router";

import AnnouncementBell
    from "../announcements/AnnouncementBell.vue";


/* =========================================================
   TYPES
========================================================= */

type Theme =
    | "light"
    | "dark";


/* =========================================================
   ÉTAT DU THÈME
========================================================= */

const theme =
    ref<Theme>(
        "dark"
    );


/* =========================================================
   APPLIQUER LE THÈME
========================================================= */

function applyTheme(
    value:
        Theme
) {

    theme.value =
        value;


    document
        .documentElement
        .setAttribute(
            "data-theme",
            value
        );


    try {

        window.localStorage
            .setItem(
                "couaxia-theme",
                value
            );

    }

    catch (
        error
    ) {

        console.debug(
            "[Theme] localStorage indisponible :",
            error
        );

    }

}


/* =========================================================
   CHANGER LE THÈME
========================================================= */

function toggleTheme() {

    applyTheme(
        theme.value ===
            "dark"

            ? "light"

            : "dark"
    );

}


/* =========================================================
   INITIALISATION
========================================================= */

onMounted(
    () => {

        let savedTheme:
            string | null =
                null;


        try {

            savedTheme =
                window.localStorage
                    .getItem(
                        "couaxia-theme"
                    );

        }

        catch (
            error
        ) {

            console.debug(
                "[Theme] Impossible de lire localStorage :",
                error
            );

        }


        /* =================================================
           THÈME ENREGISTRÉ
        ================================================= */

        if (
            savedTheme ===
                "light"

            ||

            savedTheme ===
                "dark"
        ) {

            applyTheme(
                savedTheme
            );


            return;

        }


        /* =================================================
           PRÉFÉRENCE SYSTÈME
        ================================================= */

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );

    }
);

</script>


<template>

    <header class="app-header">

        <div class="app-header__inner">


            <!-- =================================================
                 LOGO
            ================================================== -->

            <RouterLink
                to="/"
                class="app-header__brand"
                aria-label="Retour à l'accueil"
            >

                <span class="app-header__logo">

                    <video
                        class="app-header__logo-video"
                        autoplay
                        muted
                        loop
                        playsinline
                        aria-label="Couaxia"
                    >

                        <source
                            src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Transparents.webm"
                            type="video/webm"
                        >

                    </video>

                </span>

            </RouterLink>


            <!-- =================================================
                 NAVIGATION
            ================================================== -->

            <nav
                class="app-header__nav"
                aria-label="Navigation principale"
            >

                <RouterLink
                    to="/about"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        👤
                    </span>

                    <span class="app-header__link-label">
                        Mes informations
                    </span>

                </RouterLink>


                <RouterLink
                    to="/twitch"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        📺
                    </span>

                    <span class="app-header__link-label">
                        Twitch
                    </span>

                </RouterLink>


                <RouterLink
                    to="/games"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        🕹️
                    </span>

                    <span class="app-header__link-label">
                        Jeux
                    </span>

                </RouterLink>


                <RouterLink
                    to="/polls"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        🗳️
                    </span>

                    <span class="app-header__link-label">
                        Sondages
                    </span>

                </RouterLink>


                <RouterLink
                    to="/history"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        📖
                    </span>

                    <span class="app-header__link-label">
                        Mon histoire
                    </span>

                </RouterLink>


                <RouterLink
                    to="/credits"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        🎨
                    </span>

                    <span class="app-header__link-label">
                        Crédits
                    </span>

                </RouterLink>

            </nav>


            <!-- =================================================
                 ACTIONS
            ================================================== -->

            <div class="app-header__actions">


                <!-- =============================================
                     NOTIFICATIONS
                ============================================== -->

                <AnnouncementBell />


                <!-- =============================================
                     CONNEXION
                ============================================== -->

                <RouterLink
                    to="/login"
                    class="app-header__account"
                >

                    <span
                        class="app-header__account-icon"
                        aria-hidden="true"
                    >
                        👤
                    </span>

                    <span>
                        Connexion
                    </span>

                </RouterLink>


                <!-- =============================================
                     MODE JOUR / NUIT
                ============================================== -->

                <button
                    type="button"
                    class="app-header__theme"
                    :aria-label="
                        theme === 'dark'
                            ? 'Activer le mode jour'
                            : 'Activer le mode nuit'
                    "
                    :title="
                        theme === 'dark'
                            ? 'Activer le mode jour'
                            : 'Activer le mode nuit'
                    "
                    @click="toggleTheme"
                >

                    <span
                        class="app-header__theme-icon"
                        aria-hidden="true"
                    >
                        {{
                            theme ===
                                "dark"

                                ? "☀️"

                                : "🌙"
                        }}
                    </span>


                    <span class="app-header__theme-label">

                        {{
                            theme ===
                                "dark"

                                ? "Mode jour"

                                : "Mode nuit"
                        }}

                    </span>

                </button>

            </div>

        </div>

    </header>

</template>


<style scoped>

/* =========================================================
   VARIABLES — MODE NUIT
========================================================= */

:global(:root),
:global(html[data-theme="dark"]) {

    --header-background:
        rgba(
            18,
            5,
            35,
            0.97
        );

    --header-border:
        rgba(
            109,
            0,
            163,
            0.45
        );

    --header-text:
        #ffffff;

    --header-text-secondary:
        rgba(
            255,
            255,
            255,
            0.72
        );

    --header-hover:
        #f22292;

    --header-cyan:
        #22f2ef;

    --header-button-background:
        rgba(
            27,
            8,
            48,
            0.94
        );

    --header-button-border:
        rgba(
            202,
            81,
            255,
            0.66
        );

    --header-account-background:
        rgba(
            235,
            224,
            242,
            0.96
        );

    --header-account-text:
        #6d00a3;

    --header-shadow:
        0
        15px
        38px
        rgba(
            0,
            0,
            0,
            0.34
        );

    --header-button-shadow:
        0
        6px
        20px
        rgba(
            109,
            0,
            163,
            0.20
        );

}


/* =========================================================
   VARIABLES — MODE JOUR
========================================================= */

:global(html[data-theme="light"]) {

    --header-background:
        rgba(
            255,
            246,
            255,
            0.97
        );

    --header-border:
        rgba(
            109,
            0,
            163,
            0.24
        );

    --header-text:
        #48135d;

    --header-text-secondary:
        #775a82;

    --header-hover:
        #6d00a3;

    --header-cyan:
        #008f91;

    --header-button-background:
        rgba(
            255,
            250,
            255,
            0.98
        );

    --header-button-border:
        rgba(
            185,
            78,
            230,
            0.55
        );

    --header-account-background:
        #ffffff;

    --header-account-text:
        #6d00a3;

    --header-shadow:
        0
        15px
        36px
        rgba(
            72,
            19,
            93,
            0.18
        );

    --header-button-shadow:
        0
        6px
        18px
        rgba(
            109,
            0,
            163,
            0.13
        );

}


/* =========================================================
   HEADER
========================================================= */

.app-header {

    position: relative;

    z-index: 10000;

    width: 100%;

    padding:
        20px
        30px;

    box-sizing:
        border-box;

    overflow: visible;

}


/* =========================================================
   BARRE PRINCIPALE
========================================================= */

.app-header__inner {

    position: relative;

    display: grid;

    grid-template-columns:
        100px
        minmax(0, 1fr)
        auto;

    align-items: center;

    column-gap:
        clamp(
            18px,
            2vw,
            34px
        );

    width: 100%;

    min-height: 106px;

    padding:
        18px
        24px;

    box-sizing:
        border-box;

    overflow: visible;

    border:
        1px solid
        var(--header-border);

    border-radius:
        36px;

    background:
        var(--header-background);

    box-shadow:
        var(--header-shadow);

    backdrop-filter:
        blur(14px);

    -webkit-backdrop-filter:
        blur(14px);

    transition:
        background 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease;

}


/* =========================================================
   LOGO
========================================================= */

.app-header__brand {

    position: relative;

    z-index: 2;

    display: flex;

    align-items: center;
    justify-content: center;

    width: 100px;

    min-width: 0;

    color: inherit;

    text-decoration: none;

}


.app-header__logo {

    display: flex;

    align-items: center;
    justify-content: center;

    width: 100%;

    overflow: visible;

    transition:
        transform 0.25s ease,
        filter 0.25s ease;

}


.app-header__logo-video {

    display: block;

    width: auto;

    height: 70px;

    max-width: 100px;

    object-fit: contain;

    pointer-events: none;

}


.app-header__brand:hover
.app-header__logo {

    transform:
        scale(1.05);

    filter:
        brightness(1.08);

}


/* =========================================================
   NAVIGATION
========================================================= */

.app-header__nav {

    display: flex;

    align-items: center;
    justify-content: center;

    gap:
        clamp(
            14px,
            1.8vw,
            34px
        );

    min-width: 0;

}


/* =========================================================
   LIENS
========================================================= */

.app-header__link {

    position: relative;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 8px;

    flex:
        0
        1
        auto;

    min-width: 0;

    min-height: 46px;

    padding:
        8px
        3px;

    color:
        var(--header-text);

    font-size:
        clamp(
            0.82rem,
            0.90vw,
            1rem
        );

    font-weight: 800;

    line-height: 1.2;

    text-decoration: none;

    white-space: nowrap;

    transition:
        color 0.25s ease,
        transform 0.25s ease;

}


.app-header__link-label {

    min-width: 0;

}


.app-header__link-icon {

    display: inline-flex;

    flex:
        0
        0
        auto;

    align-items: center;
    justify-content: center;

    font-size: 1rem;

}


.app-header__link:hover {

    color:
        var(--header-hover);

    transform:
        translateY(-2px);

}


/* =========================================================
   ACTIVE BAR
========================================================= */

.app-header__link::after {

    content: "";

    position: absolute;

    left: 50%;
    bottom: 0;

    width: 0;
    height: 3px;

    border-radius: 999px;

    background:
        linear-gradient(
            90deg,
            #f22292,
            #22f2ef
        );

    box-shadow:
        0
        0
        11px
        rgba(
            34,
            242,
            239,
            0.52
        );

    transform:
        translateX(-50%);

    transition:
        width 0.25s ease;

}


.app-header__link:hover::after,
.app-header__link.router-link-active::after {

    width: 90%;

}


.app-header__link.router-link-active {

    color:
        var(--header-hover);

}


/* =========================================================
   ACTIONS
========================================================= */

.app-header__actions {

    position: relative;

    z-index: 20;

    display: flex;

    align-items: center;
    justify-content: flex-end;

    gap:
        clamp(
            8px,
            0.8vw,
            14px
        );

    flex:
        0
        0
        auto;

    min-width: 0;

    overflow: visible;

}


/* =========================================================
   CONNEXION
========================================================= */

.app-header__account {

    display: inline-flex;

    flex:
        0
        0
        auto;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 3px;

    min-width: 92px;
    min-height: 70px;

    padding:
        8px
        15px;

    box-sizing: border-box;

    color:
        var(--header-account-text);

    border:
        1px solid
        var(--header-button-border);

    border-radius: 44px;

    background:
        var(--header-account-background);

    box-shadow:
        var(--header-button-shadow);

    font-size: 0.86rem;
    font-weight: 900;

    line-height: 1.1;

    text-decoration: none;

    white-space: nowrap;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;

}


.app-header__account-icon {

    font-size: 1.15rem;

}


.app-header__account:hover {

    transform:
        translateY(-3px)
        scale(1.03);

    box-shadow:
        0
        8px
        25px
        rgba(
            109,
            0,
            163,
            0.24
        );

}


/* =========================================================
   THEME
========================================================= */

.app-header__theme {

    display: inline-flex;

    flex:
        0
        0
        auto;

    align-items: center;
    justify-content: center;

    gap: 8px;

    min-width: 142px;
    min-height: 54px;

    padding:
        9px
        16px;

    box-sizing: border-box;

    color:
        var(--header-text);

    border:
        1px solid
        var(--header-button-border);

    border-radius: 999px;

    background:
        var(--header-button-background);

    box-shadow:
        var(--header-button-shadow);

    font: inherit;

    font-size: 0.88rem;
    font-weight: 900;

    white-space: nowrap;

    cursor: pointer;

    transition:
        color 0.25s ease,
        background 0.25s ease,
        transform 0.25s ease,
        box-shadow 0.25s ease;

}


.app-header__theme:hover {

    color:
        var(--header-hover);

    transform:
        translateY(-3px);

    box-shadow:
        0
        8px
        25px
        rgba(
            242,
            34,
            146,
            0.20
        );

}


.app-header__theme-icon {

    display: inline-flex;

    align-items: center;
    justify-content: center;

    font-size: 1.25rem;

}


/* =========================================================
   FOCUS
========================================================= */

.app-header__link:focus-visible,
.app-header__account:focus-visible,
.app-header__theme:focus-visible {

    outline:
        3px solid
        #22f2ef;

    outline-offset:
        4px;

}


/* =========================================================
   ÉCRANS INTERMÉDIAIRES
========================================================= */

@media (max-width: 1600px) {

    .app-header__inner {

        grid-template-columns:
            88px
            minmax(0, 1fr)
            auto;

        column-gap: 16px;

        padding:
            16px
            20px;

    }


    .app-header__brand {

        width: 88px;

    }


    .app-header__logo-video {

        height: 62px;

        max-width: 88px;

    }


    .app-header__nav {

        gap:
            clamp(
                10px,
                1.2vw,
                22px
            );

    }


    .app-header__link {

        gap: 6px;

        font-size: 0.84rem;

    }


    .app-header__account {

        min-width: 84px;

        padding:
            8px
            12px;

    }


    .app-header__theme {

        min-width: 126px;

        padding:
            9px
            13px;

    }

}


/* =========================================================
   PASSAGE SUR 2 LIGNES
========================================================= */

/* =========================================================
   ÉCRANS INTERMÉDIAIRES
========================================================= */

@media (max-width: 1600px) {

    .app-header__inner {
        grid-template-columns:
            90px
            minmax(0, 1fr)
            auto;

        column-gap: 12px;

        padding:
            16px
            18px;
    }


    .app-header__brand {
        width: 90px;
    }


    .app-header__logo-video {
        height: 68px;
        max-width: 90px;
    }


    .app-header__nav {
        gap:
            clamp(
                8px,
                1vw,
                18px
            );
    }


    .app-header__link {
        gap: 6px;
        font-size: 0.82rem;
    }


    .app-header__account {
        min-width: 82px;

        padding:
            8px
            11px;
    }


    .app-header__theme {
        min-width: 120px;

        padding:
            9px
            12px;
    }
}


/* =========================================================
   PASSAGE SUR DEUX LIGNES
   seulement lorsque nécessaire
========================================================= */

@media (max-width: 1100px) {

    .app-header__inner {
        display: flex;

        flex-wrap: wrap;

        justify-content:
            space-between;

        row-gap: 14px;
    }


    .app-header__brand {
        flex:
            0
            0
            90px;
    }


    .app-header__actions {
        margin-left: auto;
    }


    .app-header__nav {
        order: 3;

        flex:
            1
            0
            100%;

        width: 100%;

        justify-content:
            center;

        flex-wrap: wrap;

        gap:
            6px
            24px;

        padding-top: 4px;
    }
}

/* =========================================================
   TABLETTE
========================================================= */

@media (max-width: 900px) {

    .app-header {

        padding:
            14px;

    }


    .app-header__inner {

        min-height: auto;

        padding:
            15px;

        border-radius: 28px;

    }


    .app-header__brand {

        flex-basis: 80px;

    }


    .app-header__logo-video {

        height: 58px;

    }


    .app-header__theme {

        min-width: 54px;

        width: 54px;

        padding: 0;

    }


    .app-header__theme-label {

        display: none;

    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    .app-header {

        padding: 10px;

    }


    .app-header__inner {

        flex-direction: column;

        align-items: stretch;

        gap: 13px;

        padding: 14px;

        border-radius: 22px;

    }


    .app-header__brand {

        width: 100%;

        flex-basis: auto;

    }


    .app-header__logo-video {

        height: 62px;

    }


    .app-header__nav {

        order: initial;

        display: grid;

        grid-template-columns:
            repeat(
                2,
                minmax(
                    0,
                    1fr
                )
            );

        gap: 6px;

        padding: 0;

    }


    .app-header__link {

        width: 100%;

        justify-content: flex-start;

        box-sizing: border-box;

        padding:
            10px
            12px;

        border-radius: 10px;

    }


    .app-header__link:hover {

        background:
            rgba(
                242,
                34,
                146,
                0.06
            );

    }


    .app-header__actions {

        width: 100%;

        margin: 0;

        justify-content: center;

        flex-wrap: wrap;

    }


    .app-header__account {

        min-height: 50px;

        flex-direction: row;

        border-radius: 999px;

    }


    .app-header__theme {

        width: auto;

        min-width: 130px;

        min-height: 50px;

        padding:
            8px
            15px;

    }


    .app-header__theme-label {

        display: inline;

    }

}


/* =========================================================
   PETITS MOBILES
========================================================= */

@media (max-width: 430px) {

    .app-header__nav {

        grid-template-columns:
            1fr;

    }


    .app-header__actions {

        flex-direction: column;

    }


    .app-header__account,
    .app-header__theme {

        width: 100%;

    }

}


/* =========================================================
   ANIMATIONS RÉDUITES
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .app-header__link,
    .app-header__account,
    .app-header__theme,
    .app-header__logo {

        transition: none;

    }

}

</style>