<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import {
    RouterLink,
    useRouter
} from "vue-router";

import AnnouncementBell
    from "../announcements/AnnouncementBell.vue";

import {
    supabase
} from "../../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

type Theme =
    | "light"
    | "dark";


interface HeaderProfile {

    id:
        string;

    username:
        string | null;

    display_name:
        string | null;

    avatar_url:
        string | null;

    role:
        string | null;

}


/* =========================================================
   ROUTER
========================================================= */

const router =
    useRouter();


/* =========================================================
   THEME
========================================================= */

const theme =
    ref<Theme>(
        "dark"
    );


/* =========================================================
   AUTH
========================================================= */

const profile =
    ref<HeaderProfile | null>(
        null
    );


const authLoading =
    ref(
        true
    );


const accountMenuOpen =
    ref(
        false
    );


let authSubscription:
    {
        unsubscribe:
            () => void;
    }
    |
    null =
        null;


/* =========================================================
   COMPUTED AUTH
========================================================= */

const isConnected =
    computed(
        () =>
            profile.value
            !==
            null
    );


const displayName =
    computed(
        () => {

            return (
                profile.value?.display_name
                ||
                profile.value?.username
                ||
                "Mon profil"
            );

        }
    );


const username =
    computed(
        () => {

            return (
                profile.value?.username
                ||
                ""
            );

        }
    );


const avatarUrl =
    computed(
        () =>
            profile.value?.avatar_url
            ||
            null
    );


const profileInitial =
    computed(
        () => {

            const value =
                displayName.value
                    .trim();


            if (
                !value
            ) {

                return "P";

            }


            return value
                .charAt(0)
                .toUpperCase();

        }
    );


const isAdmin =
    computed(
        () =>
            profile.value?.role
            ===
            "admin"
    );


/* =========================================================
   APPLY THEME
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

        window
            .localStorage
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
   TOGGLE THEME
========================================================= */

function toggleTheme() {

    applyTheme(
        theme.value
        ===
        "dark"
            ? "light"
            : "dark"
    );

}


/* =========================================================
   INITIALISE THEME
========================================================= */

function initialiseTheme() {

    let savedTheme:
        string | null =
            null;


    try {

        savedTheme =
            window
                .localStorage
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


    if (
        savedTheme
        ===
        "light"
        ||
        savedTheme
        ===
        "dark"
    ) {

        applyTheme(
            savedTheme
        );


        return;

    }


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


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile(
    userId:
        string
) {

    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .select(`
                id,
                username,
                display_name,
                avatar_url,
                role
            `)
            .eq(
                "id",
                userId
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Erreur chargement profil header :",
            error
        );


        profile.value =
            null;


        return;

    }


    if (
        !data
    ) {

        profile.value =
            null;


        return;

    }


    profile.value =
        data as HeaderProfile;

}


/* =========================================================
   LOAD AUTH
========================================================= */

async function loadAuth() {

    authLoading.value =
        true;


    try {

        const {
            data: {
                session
            },
            error
        } =
            await supabase
                .auth
                .getSession();


        if (
            error
        ) {

            throw error;

        }


        if (
            !session?.user
        ) {

            profile.value =
                null;


            return;

        }


        await loadProfile(
            session.user.id
        );

    }

    catch (
        error
    ) {

        console.error(
            "Erreur session header :",
            error
        );


        profile.value =
            null;

    }

    finally {

        authLoading.value =
            false;

    }

}


/* =========================================================
   ACCOUNT MENU
========================================================= */

function toggleAccountMenu() {

    accountMenuOpen.value =
        !accountMenuOpen.value;

}


function closeAccountMenu() {

    accountMenuOpen.value =
        false;

}


/* =========================================================
   GO PROFILE
========================================================= */

async function goToProfile() {

    closeAccountMenu();


    await router.push({
        name:
            "profile"
    });

}


/* =========================================================
   GO ADMIN
========================================================= */

async function goToAdmin() {

    closeAccountMenu();


    await router.push({
        name:
            "admin"
    });

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    closeAccountMenu();


    try {

        const {
            error
        } =
            await supabase
                .auth
                .signOut();


        if (
            error
        ) {

            throw error;

        }


        profile.value =
            null;


        await router.push({
            name:
                "home"
        });

    }

    catch (
        error
    ) {

        console.error(
            "Erreur déconnexion :",
            error
        );

    }

}


/* =========================================================
   AUTH LISTENER
========================================================= */

function initialiseAuthListener() {

    const {
        data
    } =
        supabase
            .auth
            .onAuthStateChange(
                async (
                    event,
                    session
                ) => {

                    if (
                        event
                        ===
                        "SIGNED_OUT"
                        ||
                        !session?.user
                    ) {

                        profile.value =
                            null;


                        accountMenuOpen.value =
                            false;


                        return;

                    }


                    await loadProfile(
                        session.user.id
                    );

                }
            );


    authSubscription =
        data.subscription;

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    async () => {

        initialiseTheme();


        await loadAuth();


        initialiseAuthListener();

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        authSubscription
            ?.unsubscribe();

    }
);

</script>


<template>

    <header
        class="app-header"
    >

        <div
            class="app-header__inner"
        >

            <!-- =================================================
                 LOGO
            ================================================== -->

            <RouterLink
                to="/"
                class="app-header__brand"
                aria-label="Retour à l'accueil"
            >

                <span
                    class="app-header__logo"
                >

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

                <!-- INFORMATIONS -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Mes informations
                    </span>

                </RouterLink>


                <!-- TWITCH -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Twitch
                    </span>

                </RouterLink>


                <!-- GAMES -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Jeux
                    </span>

                </RouterLink>


                <!-- POLLS -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Sondages
                    </span>

                </RouterLink>


                <!-- HISTORY -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Mon histoire
                    </span>

                </RouterLink>


                <!-- CREDITS -->

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


                    <span
                        class="app-header__link-label"
                    >
                        Crédits
                    </span>

                </RouterLink>


                <!-- CONTACT -->

                <RouterLink
                    to="/contact"
                    class="app-header__link"
                >

                    <span
                        class="app-header__link-icon"
                        aria-hidden="true"
                    >
                        💌
                    </span>


                    <span
                        class="app-header__link-label"
                    >
                        Me contacter
                    </span>

                </RouterLink>

            </nav>


            <!-- =================================================
                 ACTIONS
            ================================================== -->

            <div
                class="app-header__actions"
            >

                <!-- =============================================
                     NOTIFICATIONS
                ============================================== -->

                <AnnouncementBell />


                <!-- =============================================
                     AUTH LOADING
                ============================================== -->

                <div
                    v-if="authLoading"
                    class="
                        app-header__account
                        app-header__account--loading
                    "
                >

                    <span
                        class="app-header__account-loader"
                    ></span>

                </div>


                <!-- =============================================
                     NOT CONNECTED
                ============================================== -->

                <RouterLink
                    v-else-if="!isConnected"
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
                     CONNECTED ACCOUNT
                ============================================== -->

                <div
                    v-else
                    class="app-header__account-wrapper"
                >

                    <button
                        type="button"
                        class="
                            app-header__account
                            app-header__account--connected
                        "
                        :aria-expanded="
                            accountMenuOpen
                        "
                        aria-haspopup="menu"
                        @click="
                            toggleAccountMenu
                        "
                    >

                        <!-- AVATAR -->

                        <span
                            class="app-header__account-avatar"
                        >

                            <img
                                v-if="avatarUrl"
                                :src="avatarUrl"
                                :alt="
                                    `Avatar de ${displayName}`
                                "
                            >


                            <span
                                v-else
                            >
                                {{ profileInitial }}
                            </span>

                        </span>


                        <!-- NAME -->

                        <span
                            class="app-header__account-info"
                        >

                            <strong>
                                {{ displayName }}
                            </strong>


                            <small
                                v-if="username"
                            >
                                @{{ username }}
                            </small>

                        </span>


                        <!-- ARROW -->

                        <span
                            class="app-header__account-arrow"
                            :class="{
                                'app-header__account-arrow--open':
                                    accountMenuOpen
                            }"
                            aria-hidden="true"
                        >
                            ▾
                        </span>

                    </button>


                    <!-- =========================================
                         ACCOUNT MENU
                    ========================================== -->

                    <Transition
                        name="account-menu"
                    >

                        <div
                            v-if="
                                accountMenuOpen
                            "
                            class="
                                app-header__account-menu
                            "
                            role="menu"
                        >

                            <!-- HEADER -->

                            <div
                                class="
                                    app-header__account-menu-profile
                                "
                            >

                                <span
                                    class="
                                        app-header__account-menu-avatar
                                    "
                                >

                                    <img
                                        v-if="avatarUrl"
                                        :src="avatarUrl"
                                        :alt="
                                            `Avatar de ${displayName}`
                                        "
                                    >


                                    <span
                                        v-else
                                    >
                                        {{ profileInitial }}
                                    </span>

                                </span>


                                <div>

                                    <strong>
                                        {{ displayName }}
                                    </strong>


                                    <small
                                        v-if="username"
                                    >
                                        @{{ username }}
                                    </small>

                                </div>

                            </div>


                            <div
                                class="
                                    app-header__account-menu-separator
                                "
                            ></div>


                            <!-- PROFILE -->

                            <button
                                type="button"
                                class="
                                    app-header__account-menu-item
                                "
                                role="menuitem"
                                @click="
                                    goToProfile
                                "
                            >

                                <span>
                                    👤
                                </span>


                                <span>
                                    Mon profil
                                </span>

                            </button>


                            <!-- ADMIN -->

                            <button
                                v-if="
                                    isAdmin
                                "
                                type="button"
                                class="
                                    app-header__account-menu-item
                                    app-header__account-menu-item--admin
                                "
                                role="menuitem"
                                @click="
                                    goToAdmin
                                "
                            >

                                <span>
                                    ⚙️
                                </span>


                                <span>
                                    Administration
                                </span>


                                <small>
                                    ADMIN
                                </small>

                            </button>


                            <div
                                class="
                                    app-header__account-menu-separator
                                "
                            ></div>


                            <!-- LOGOUT -->

                            <button
                                type="button"
                                class="
                                    app-header__account-menu-item
                                    app-header__account-menu-item--logout
                                "
                                role="menuitem"
                                @click="
                                    logout
                                "
                            >

                                <span>
                                    🚪
                                </span>


                                <span>
                                    Déconnexion
                                </span>

                            </button>

                        </div>

                    </Transition>

                </div>


                <!-- =============================================
                     THEME
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
                            ? 'Mode jour'
                            : 'Mode nuit'
                    "
                    @click="
                        toggleTheme
                    "
                >

                    <span
                        class="app-header__theme-icon"
                        aria-hidden="true"
                    >
                        {{
                            theme
                            ===
                            "dark"
                                ? "☀️"
                                : "🌙"
                        }}
                    </span>

                </button>

            </div>

        </div>

    </header>

</template>


<style scoped>

/* =========================================================
   VARIABLES — DARK
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

    --header-menu-background:
        rgba(
            19,
            6,
            31,
            0.98
        );

    --header-menu-border:
        rgba(
            202,
            81,
            255,
            0.25
        );

}


/* =========================================================
   VARIABLES — LIGHT
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

    --header-menu-background:
        rgba(
            255,
            248,
            255,
            0.99
        );

    --header-menu-border:
        rgba(
            109,
            0,
            163,
            0.18
        );

}


/* =========================================================
   HEADER
========================================================= */

.app-header {

    position:
        relative;

    z-index:
        10000;

    width:
        100%;

    padding:
        20px
        30px;

    box-sizing:
        border-box;

    overflow:
        visible;

}


/* =========================================================
   INNER
========================================================= */

.app-header__inner {

    position:
        relative;

    display:
        grid;

    grid-template-columns:
        100px
        minmax(0, 1fr)
        auto;

    align-items:
        center;

    column-gap:
        clamp(
            14px,
            1.5vw,
            28px
        );

    width:
        100%;

    min-height:
        106px;

    padding:
        18px
        24px;

    box-sizing:
        border-box;

    overflow:
        visible;

    border:
        1px
        solid
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

    position:
        relative;

    z-index:
        2;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        100px;

    min-width:
        0;

    color:
        inherit;

    text-decoration:
        none;

}


.app-header__logo {

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        100%;

    overflow:
        visible;

    transition:
        transform 0.25s ease,
        filter 0.25s ease;

}


.app-header__logo-video {

    display:
        block;

    width:
        auto;

    height:
        70px;

    max-width:
        100px;

    object-fit:
        contain;

    pointer-events:
        none;

}


.app-header__brand:hover
.app-header__logo {

    transform:
        scale(1.05);

    filter:
        brightness(1.08);

}


/* =========================================================
   NAV
========================================================= */

.app-header__nav {

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        clamp(
            8px,
            1.15vw,
            22px
        );

    min-width:
        0;

}


/* =========================================================
   LINKS
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
        7px;

    flex:
        0
        1
        auto;

    min-width:
        0;

    min-height:
        46px;

    padding:
        8px
        2px;

    color:
        var(--header-text);

    font-size:
        clamp(
            0.78rem,
            0.82vw,
            0.96rem
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
        color 0.25s ease,
        transform 0.25s ease;

}


.app-header__link-icon {

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    flex-shrink:
        0;

    font-size:
        1rem;

}


.app-header__link:hover {

    color:
        var(--header-hover);

    transform:
        translateY(-2px);

}


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
        translateX(-50%);

    transition:
        width 0.25s ease;

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

    position:
        relative;

    z-index:
        20;

    display:
        flex;

    align-items:
        center;

    justify-content:
        flex-end;

    gap:
        10px;

    flex:
        0
        0
        auto;

    min-width:
        0;

    overflow:
        visible;

}


/* =========================================================
   ACCOUNT WRAPPER
========================================================= */

.app-header__account-wrapper {

    position:
        relative;

    z-index:
        100;

}


/* =========================================================
   ACCOUNT
========================================================= */

.app-header__account {

    display:
        inline-flex;

    flex:
        0
        0
        auto;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        3px;

    min-width:
        92px;

    min-height:
        70px;

    padding:
        8px
        15px;

    box-sizing:
        border-box;

    color:
        var(--header-account-text);

    border:
        1px
        solid
        var(--header-button-border);

    border-radius:
        44px;

    background:
        var(--header-account-background);

    box-shadow:
        var(--header-button-shadow);

    font:
        inherit;

    font-size:
        0.86rem;

    font-weight:
        900;

    line-height:
        1.1;

    text-decoration:
        none;

    white-space:
        nowrap;

    cursor:
        pointer;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;

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
   CONNECTED ACCOUNT
========================================================= */

.app-header__account--connected {

    min-width:
        165px;

    min-height:
        64px;

    flex-direction:
        row;

    justify-content:
        flex-start;

    gap:
        9px;

    padding:
        7px
        12px
        7px
        8px;

}


/* =========================================================
   ACCOUNT AVATAR
========================================================= */

.app-header__account-avatar {

    width:
        44px;

    height:
        44px;

    flex-shrink:
        0;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    overflow:
        hidden;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            #6d00a3,
            #ff00a6
        );

    border:
        2px
        solid
        rgba(
            255,
            255,
            255,
            0.75
        );

    border-radius:
        50%;

    font-weight:
        900;

}


.app-header__account-avatar img {

    width:
        100%;

    height:
        100%;

    display:
        block;

    object-fit:
        cover;

}


/* =========================================================
   ACCOUNT INFO
========================================================= */

.app-header__account-info {

    min-width:
        0;

    flex:
        1;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        flex-start;

    gap:
        2px;

}


.app-header__account-info strong {

    max-width:
        120px;

    overflow:
        hidden;

    color:
        var(--header-account-text);

    font-size:
        0.82rem;

    text-overflow:
        ellipsis;

    white-space:
        nowrap;

}


.app-header__account-info small {

    max-width:
        120px;

    overflow:
        hidden;

    color:
        rgba(
            109,
            0,
            163,
            0.65
        );

    font-size:
        0.62rem;

    text-overflow:
        ellipsis;

}


/* =========================================================
   ACCOUNT ARROW
========================================================= */

.app-header__account-arrow {

    flex-shrink:
        0;

    font-size:
        0.72rem;

    transition:
        transform 0.2s ease;

}


.app-header__account-arrow--open {

    transform:
        rotate(180deg);

}


/* =========================================================
   ACCOUNT MENU
========================================================= */

.app-header__account-menu {

    position:
        absolute;

    top:
        calc(
            100%
            +
            10px
        );

    right:
        0;

    width:
        245px;

    padding:
        10px;

    overflow:
        hidden;

    color:
        var(--header-text);

    background:
        var(--header-menu-background);

    border:
        1px
        solid
        var(--header-menu-border);

    border-radius:
        18px;

    box-shadow:
        0
        22px
        55px
        rgba(
            0,
            0,
            0,
            0.35
        );

    backdrop-filter:
        blur(18px);

    z-index:
        9999;

}


.app-header__account-menu-profile {

    display:
        flex;

    align-items:
        center;

    gap:
        10px;

    padding:
        9px;

}


.app-header__account-menu-avatar {

    width:
        44px;

    height:
        44px;

    flex-shrink:
        0;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    overflow:
        hidden;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            #6d00a3,
            #ff00a6
        );

    border-radius:
        50%;

    font-weight:
        900;

}


.app-header__account-menu-avatar img {

    width:
        100%;

    height:
        100%;

    display:
        block;

    object-fit:
        cover;

}


.app-header__account-menu-profile > div {

    min-width:
        0;

    display:
        flex;

    flex-direction:
        column;

    gap:
        2px;

}


.app-header__account-menu-profile strong {

    overflow:
        hidden;

    color:
        var(--header-text);

    font-size:
        0.82rem;

    text-overflow:
        ellipsis;

    white-space:
        nowrap;

}


.app-header__account-menu-profile small {

    color:
        var(--header-text-secondary);

    font-size:
        0.66rem;

}


.app-header__account-menu-separator {

    height:
        1px;

    margin:
        7px
        4px;

    background:
        rgba(
            255,
            255,
            255,
            0.07
        );

}


/* =========================================================
   ACCOUNT MENU ITEM
========================================================= */

.app-header__account-menu-item {

    width:
        100%;

    min-height:
        42px;

    display:
        grid;

    grid-template-columns:
        25px
        minmax(0, 1fr)
        auto;

    align-items:
        center;

    gap:
        8px;

    padding:
        8px
        10px;

    color:
        var(--header-text-secondary);

    background:
        transparent;

    border:
        1px
        solid
        transparent;

    border-radius:
        10px;

    font:
        inherit;

    font-size:
        0.74rem;

    font-weight:
        800;

    text-align:
        left;

    cursor:
        pointer;

    transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease;

}


.app-header__account-menu-item:hover {

    color:
        var(--header-text);

    background:
        rgba(
            255,
            255,
            255,
            0.045
        );

    border-color:
        rgba(
            255,
            255,
            255,
            0.06
        );

}


.app-header__account-menu-item small {

    padding:
        3px
        6px;

    color:
        #ff7bd0;

    background:
        rgba(
            255,
            0,
            166,
            0.08
        );

    border:
        1px
        solid
        rgba(
            255,
            0,
            166,
            0.16
        );

    border-radius:
        999px;

    font-size:
        0.52rem;

}


.app-header__account-menu-item--admin {

    color:
        #ff7bd0;

}


.app-header__account-menu-item--logout {

    color:
        #ff8297;

}


.app-header__account-menu-item--logout:hover {

    color:
        #ffffff;

    background:
        rgba(
            255,
            65,
            90,
            0.1
        );

    border-color:
        rgba(
            255,
            65,
            90,
            0.16
        );

}


/* =========================================================
   MENU TRANSITION
========================================================= */

.account-menu-enter-active,
.account-menu-leave-active {

    transition:
        opacity 0.18s ease,
        transform 0.18s ease;

}


.account-menu-enter-from,
.account-menu-leave-to {

    opacity:
        0;

    transform:
        translateY(-7px)
        scale(0.97);

}


/* =========================================================
   AUTH LOADING
========================================================= */

.app-header__account--loading {

    min-width:
        92px;

}


.app-header__account-loader {

    width:
        20px;

    height:
        20px;

    border:
        2px
        solid
        rgba(
            109,
            0,
            163,
            0.18
        );

    border-top-color:
        #6d00a3;

    border-radius:
        50%;

    animation:
        header-account-loading
        0.75s
        linear
        infinite;

}


@keyframes header-account-loading {

    to {

        transform:
            rotate(360deg);

    }

}


/* =========================================================
   THEME BUTTON — COMPACT
========================================================= */

.app-header__theme {

    display:
        inline-flex;

    flex:
        0
        0
        auto;

    align-items:
        center;

    justify-content:
        center;

    width:
        54px;

    height:
        54px;

    min-width:
        54px;

    min-height:
        54px;

    padding:
        0;

    box-sizing:
        border-box;

    color:
        var(--header-text);

    border:
        1px
        solid
        var(--header-button-border);

    border-radius:
        50%;

    background:
        var(--header-button-background);

    box-shadow:
        var(--header-button-shadow);

    font:
        inherit;

    cursor:
        pointer;

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
        translateY(-3px)
        scale(1.05);

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

    line-height:
        1;

}


/* =========================================================
   FOCUS
========================================================= */

.app-header__link:focus-visible,
.app-header__account:focus-visible,
.app-header__theme:focus-visible,
.app-header__account-menu-item:focus-visible {

    outline:
        3px
        solid
        #22f2ef;

    outline-offset:
        4px;

}


/* =========================================================
   1600 PX
========================================================= */

@media (
    max-width:
    1600px
) {

    .app-header__inner {

        grid-template-columns:
            90px
            minmax(0, 1fr)
            auto;

        column-gap:
            10px;

        padding:
            16px
            18px;

    }


    .app-header__brand {

        width:
            90px;

    }


    .app-header__logo-video {

        height:
            68px;

        max-width:
            90px;

    }


    .app-header__nav {

        gap:
            clamp(
                6px,
                0.7vw,
                14px
            );

    }


    .app-header__link {

        gap:
            5px;

        font-size:
            0.78rem;

    }


    .app-header__account {

        min-width:
            82px;

    }


    .app-header__account--connected {

        min-width:
            150px;

    }


    .app-header__theme {

        width:
            52px;

        height:
            52px;

        min-width:
            52px;

        min-height:
            52px;

    }

}


/* =========================================================
   1100 PX
========================================================= */

@media (
    max-width:
    1100px
) {

    .app-header__inner {

        display:
            flex;

        flex-wrap:
            wrap;

        justify-content:
            space-between;

        row-gap:
            14px;

    }


    .app-header__brand {

        flex:
            0
            0
            90px;

    }


    .app-header__actions {

        margin-left:
            auto;

    }


    .app-header__nav {

        order:
            3;

        flex:
            1
            0
            100%;

        width:
            100%;

        justify-content:
            center;

        flex-wrap:
            wrap;

        gap:
            6px
            24px;

        padding-top:
            4px;

    }

}


/* =========================================================
   TABLET
========================================================= */

@media (
    max-width:
    900px
) {

    .app-header {

        padding:
            14px;

    }


    .app-header__inner {

        min-height:
            auto;

        padding:
            15px;

        border-radius:
            28px;

    }


    .app-header__brand {

        flex-basis:
            80px;

    }


    .app-header__logo-video {

        height:
            58px;

    }


    .app-header__account-info small {

        display:
            none;

    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (
    max-width:
    700px
) {

    .app-header {

        padding:
            10px;

    }


    .app-header__inner {

        flex-direction:
            column;

        align-items:
            stretch;

        gap:
            13px;

        padding:
            14px;

        border-radius:
            22px;

    }


    .app-header__brand {

        width:
            100%;

        flex-basis:
            auto;

    }


    .app-header__logo-video {

        height:
            62px;

    }


    .app-header__nav {

        order:
            initial;

        display:
            grid;

        grid-template-columns:
            repeat(
                2,
                minmax(
                    0,
                    1fr
                )
            );

        gap:
            6px;

        padding:
            0;

    }


    .app-header__link {

        width:
            100%;

        justify-content:
            flex-start;

        box-sizing:
            border-box;

        padding:
            10px
            12px;

        border-radius:
            10px;

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

        width:
            100%;

        margin:
            0;

        justify-content:
            center;

        flex-wrap:
            wrap;

    }


    .app-header__account-wrapper {

        width:
            auto;

    }


    .app-header__account {

        min-height:
            50px;

        flex-direction:
            row;

        border-radius:
            999px;

    }


    .app-header__account--connected {

        min-width:
            170px;

    }


    .app-header__account-menu {

        right:
            50%;

        transform:
            translateX(50%);

    }


    .account-menu-enter-from,
    .account-menu-leave-to {

        opacity:
            0;

        transform:
            translateX(50%)
            translateY(-7px)
            scale(0.97);

    }


    .app-header__theme {

        width:
            50px;

        height:
            50px;

        min-width:
            50px;

        min-height:
            50px;

    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (
    max-width:
    430px
) {

    .app-header__nav {

        grid-template-columns:
            1fr;

    }


    .app-header__actions {

        flex-direction:
            row;

    }


    .app-header__account-wrapper {

        width:
            auto;

    }


    .app-header__account {

        width:
            auto;

    }


    .app-header__account--connected {

        justify-content:
            center;

    }


    .app-header__account-menu {

        width:
            calc(
                100vw
                -
                50px
            );

        max-width:
            300px;

    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
    prefers-reduced-motion:
    reduce
) {

    .app-header__link,
    .app-header__account,
    .app-header__theme,
    .app-header__logo,
    .app-header__account-arrow {

        transition:
            none;

    }


    .app-header__account-loader {

        animation:
            none;

    }

}

</style>