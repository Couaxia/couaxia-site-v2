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
    value: Theme
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

    } catch (
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

        } catch (
            error
        ) {

            console.debug(
                "[Theme] Impossible de lire localStorage :",
                error
            );
        }


        /* =============================================
           THÈME ENREGISTRÉ
        ============================================== */

        if (
            savedTheme ===
                "light" ||
            savedTheme ===
                "dark"
        ) {

            applyTheme(
                savedTheme
            );

            return;
        }


        /* =============================================
           PRÉFÉRENCE DU SYSTÈME
        ============================================== */

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
                    Couaxia
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

                    <span>
                        Mes informations
                    </span>

                </RouterLink>


                <RouterLink
                    to="/twitch"
                    class="app-header__link">
                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        📺
                    </span>

                    <span>
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

                    <span>
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

                    <span>
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

                    <span>
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

                    <span>
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
    width:
        100%;

    padding:
        22px
        30px;

    box-sizing:
        border-box;
}


/* =========================================================
   BARRE PRINCIPALE
========================================================= */

.app-header__inner {
    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        26px;

    width:
        100%;

    min-height:
        120px;

    padding:
        22px
        28px;

    box-sizing:
        border-box;

    border:
        1px
        solid
        var(--header-border);

    border-radius:
        38px;

    background:
        var(--header-background);

    box-shadow:
        var(--header-shadow);

    backdrop-filter:
        blur(
            14px
        );

    -webkit-backdrop-filter:
        blur(
            14px
        );

    transition:
        background
        0.3s
        ease,
        border-color
        0.3s
        ease,
        box-shadow
        0.3s
        ease;
}


/* =========================================================
   LOGO
========================================================= */

.app-header__brand {
    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    flex:
        0
        0
        auto;

    min-width:
        140px;

    color:
        inherit;

    text-decoration:
        none;
}


.app-header__logo {
    color:
        #f22292;

    font-size:
        clamp(
            1.25rem,
            2vw,
            1.8rem
        );

    font-weight:
        900;

    line-height:
        1;

    text-shadow:
        0
        0
        16px
        rgba(
            242,
            34,
            146,
            0.30
        );

    transition:
        transform
        0.25s
        ease,
        filter
        0.25s
        ease;
}


.app-header__brand:hover
.app-header__logo {
    transform:
        scale(
            1.05
        );

    filter:
        brightness(
            1.08
        );
}


/* =========================================================
   NAVIGATION
========================================================= */

.app-header__nav {
    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    flex:
        1
        1
        auto;

    gap:
        clamp(
            18px,
            2.8vw,
            46px
        );

    min-width:
        0;
}


/* =========================================================
   LIENS
========================================================= */

.app-header__link {
    position:
        relative;

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        9px;

    min-height:
        48px;

    padding:
        8px
        4px;

    color:
        var(--header-text);

    font-size:
        clamp(
            0.9rem,
            1vw,
            1.05rem
        );

    font-weight:
        800;

    line-height:
        1.2;

    text-decoration:
        none;

    white-space:
        nowrap;

    transition:
        color
        0.25s
        ease,
        transform
        0.25s
        ease;
}


.app-header__link-icon {
    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        1.05rem;
}


.app-header__link:hover {
    color:
        var(--header-hover);

    transform:
        translateY(
            -2px
        );
}


/* =========================================================
   BARRE ACTIVE
========================================================= */

.app-header__link::after {
    content:
        "";

    position:
        absolute;

    left:
        50%;

    bottom:
        0;

    width:
        0;

    height:
        3px;

    border-radius:
        999px;

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
        translateX(
            -50%
        );

    transition:
        width
        0.25s
        ease;
}


.app-header__link:hover::after,
.app-header__link.router-link-active::after {
    width:
        90%;
}


.app-header__link.router-link-active {
    color:
        var(--header-hover);
}


/* =========================================================
   ACTIONS
========================================================= */

.app-header__actions {
    display:
        flex;

    align-items:
        center;

    justify-content:
        flex-end;

    gap:
        15px;

    flex:
        0
        0
        auto;
}


/* =========================================================
   CONNEXION
========================================================= */

.app-header__account {
    display:
        inline-flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        4px;

    min-width:
        94px;

    min-height:
        76px;

    padding:
        10px
        18px;

    box-sizing:
        border-box;

    color:
        var(--header-account-text);

    border:
        1px
        solid
        var(--header-button-border);

    border-radius:
        50px;

    background:
        var(--header-account-background);

    box-shadow:
        var(--header-button-shadow);

    font-size:
        0.92rem;

    font-weight:
        900;

    line-height:
        1.1;

    text-decoration:
        none;

    transition:
        transform
        0.25s
        ease,
        box-shadow
        0.25s
        ease;
}


.app-header__account-icon {
    font-size:
        1.2rem;
}


.app-header__account:hover {
    transform:
        translateY(
            -3px
        )
        scale(
            1.03
        );

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
   MODE JOUR / NUIT
========================================================= */

.app-header__theme {
    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        10px;

    min-width:
        170px;

    min-height:
        58px;

    padding:
        10px
        22px;

    box-sizing:
        border-box;

    color:
        var(--header-text);

    border:
        1px
        solid
        var(--header-button-border);

    border-radius:
        999px;

    background:
        var(--header-button-background);

    box-shadow:
        var(--header-button-shadow);

    font:
        inherit;

    font-size:
        1rem;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        color
        0.25s
        ease,
        background
        0.25s
        ease,
        transform
        0.25s
        ease,
        box-shadow
        0.25s
        ease;
}


.app-header__theme:hover {
    color:
        var(--header-hover);

    transform:
        translateY(
            -3px
        );

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
    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        1.35rem;
}


/* =========================================================
   FOCUS
========================================================= */

.app-header__link:focus-visible,
.app-header__account:focus-visible,
.app-header__theme:focus-visible {
    outline:
        3px
        solid
        #22f2ef;

    outline-offset:
        4px;
}


/* =========================================================
   TABLETTE
========================================================= */

@media (max-width: 1200px) {

    .app-header__inner {
        flex-wrap:
            wrap;

        justify-content:
            center;

        border-radius:
            30px;
    }


    .app-header__brand {
        min-width:
            110px;
    }


    .app-header__nav {
        order:
            3;

        width:
            100%;

        flex-basis:
            100%;

        flex-wrap:
            wrap;

        gap:
            15px
            28px;
    }


    .app-header__actions {
        margin-left:
            auto;
    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    .app-header {
        padding:
            12px;
    }


    .app-header__inner {
        min-height:
            auto;

        padding:
            15px;

        gap:
            14px;

        border-radius:
            24px;
    }


    .app-header__brand {
        width:
            100%;
    }


    .app-header__nav {
        flex-direction:
            column;

        align-items:
            stretch;

        gap:
            5px;
    }


    .app-header__link {
        width:
            100%;

        box-sizing:
            border-box;

        padding:
            10px;
    }


    .app-header__actions {
        width:
            100%;

        margin:
            0;

        justify-content:
            center;

        flex-wrap:
            wrap;
    }


    .app-header__account {
        min-height:
            54px;

        flex-direction:
            row;

        border-radius:
            999px;
    }


    .app-header__theme {
        min-height:
            54px;

        min-width:
            150px;

        padding:
            9px
            17px;
    }

}


/* =========================================================
   PETITS MOBILES
========================================================= */

@media (max-width: 430px) {

    .app-header__actions {
        flex-direction:
            column;
    }


    .app-header__account,
    .app-header__theme {
        width:
            100%;
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
        transition:
            none;
    }

}
</style>