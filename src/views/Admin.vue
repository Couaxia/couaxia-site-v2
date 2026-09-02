<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRouter
} from "vue-router";

import "../assets/styles/pages/admin.css";


/* =========================================================
   SERVICES
========================================================= */

import {
    getCurrentAdmin
} from "../services/admin.service";

import type {
    AdminProfile
} from "../services/admin.service";


/* =========================================================
   COMPONENTS
========================================================= */

import AdminSidebar from
    "../components/admin/AdminSidebar.vue";

import AdminDashboard from
    "../components/admin/AdminDashboard.vue";

import AdminPolls from
    "../components/admin/AdminPolls.vue";

import AdminGames from
    "../components/admin/AdminGames.vue";

import AdminSuggestions from
    "../components/admin/AdminSuggestions.vue";

import AdminUsers from
    "../components/admin/AdminUsers.vue";

import AdminArtworks from
    "../components/admin/AdminArtworks.vue";

import AdminAnnouncements from
    "../components/admin/AdminAnnouncements.vue";

import AdminMessages from
    "../components/admin/AdminMessages.vue";


/* =========================================================
   TYPES
========================================================= */

type AdminTab =
    | "dashboard"
    | "polls"
    | "games"
    | "suggestions"
    | "users"
    | "artworks"
    | "announcements"
    | "messages";


interface AdminTabInfo {

    id:
        AdminTab;

    label:
        string;

    icon:
        string;

    description:
        string;

}


/* =========================================================
   ROUTER
========================================================= */

const router =
    useRouter();


/* =========================================================
   STATE
========================================================= */

const admin =
    ref<AdminProfile | null>(
        null
    );


const loading =
    ref(
        true
    );


const errorMessage =
    ref(
        ""
    );


const activeTab =
    ref<AdminTab>(
        "dashboard"
    );


/* =========================================================
   TABS
========================================================= */

const tabs:
    AdminTabInfo[] = [

        {
            id:
                "dashboard",

            label:
                "Dashboard",

            icon:
                "📊",

            description:
                "Vue d'ensemble de ton administration."
        },

        {
            id:
                "polls",

            label:
                "Sondages",

            icon:
                "🗳️",

            description:
                "Crée et gère les sondages de la communauté."
        },

        {
            id:
                "games",

            label:
                "Jeux",

            icon:
                "🎮",

            description:
                "Gère ta bibliothèque de jeux et les jeux disponibles dans les sondages."
        },

        {
            id:
                "suggestions",

            label:
                "Suggestions",

            icon:
                "💡",

            description:
                "Consulte et modère les suggestions des POUP."
        },

        {
            id:
                "users",

            label:
                "Utilisateurs",

            icon:
                "🐙",

            description:
                "Consulte les comptes POUP et leurs rôles."
        },

        {
            id:
                "artworks",

            label:
                "Arts & Crédits",

            icon:
                "🎨",

            description:
                "Ajoute et organise les créations affichées dans les crédits."
        },

        {
            id:
                "announcements",

            label:
                "Annonces",

            icon:
                "🔔",

            description:
                "Crée et gère les annonces et notifications affichées sur le site."
        },

        {
            id:
                "messages",

            label:
                "Messages",

            icon:
                "📬",

            description:
                "Consulte et gère les demandes reçues depuis la page de contact."
        }

    ];


/* =========================================================
   COMPUTED
========================================================= */

const hasAdminAccess =
    computed(
        () =>
            Boolean(
                admin.value
            )
    );


/* =========================================================
   CURRENT TAB
========================================================= */

const currentTab =
    computed<AdminTabInfo>(
        () => {

            return (
                tabs.find(
                    tab =>
                        tab.id
                        ===
                        activeTab.value
                )
                ??
                tabs[0]
            );

        }
    );


/* =========================================================
   ADMIN DISPLAY NAME
========================================================= */

const adminDisplayName =
    computed(
        () => {

            if (
                !admin.value
            ) {

                return "Admin";

            }


            return (
                admin.value.display_name
                ||
                admin.value.username
                ||
                "Admin"
            );

        }
    );


/* =========================================================
   ADMIN AVATAR
========================================================= */

const adminAvatar =
    computed(
        () =>
            admin.value?.avatar_url
            ??
            null
    );


/* =========================================================
   ADMIN INITIAL
========================================================= */

const adminInitial =
    computed(
        () => {

            const name =
                adminDisplayName.value
                    .trim();


            if (
                !name
            ) {

                return "A";

            }


            return name
                .charAt(0)
                .toUpperCase();

        }
    );


/* =========================================================
   LOAD ADMIN
========================================================= */

async function loadAdmin() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        admin.value =
            await getCurrentAdmin();


        if (
            !admin.value
        ) {

            errorMessage.value =
                "Tu n'as pas les droits administrateur.";

        }

    }
    catch (
        error
    ) {

        console.error(
            "Erreur chargement admin :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger l'espace administration.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   CHANGE TAB
========================================================= */

function changeTab(
    tab:
        AdminTab
) {

    activeTab.value =
        tab;


    /*
     * On remonte en haut de la page
     * lorsqu'on change de section.
     */

    window.scrollTo({
        top:
            0,

        behavior:
            "smooth"
    });

}


/* =========================================================
   BACK TO SITE
========================================================= */

async function backToSite() {

    await router.push({
        name:
            "home"
    });

}


/* =========================================================
   GO TO PROFILE
========================================================= */

async function goToProfile() {

    await router.push({
        name:
            "profile"
    });

}


/* =========================================================
   RELOAD ADMIN
========================================================= */

async function reloadAdmin() {

    await loadAdmin();

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadAdmin
);

</script>


<template>

    <main
        class="admin-page"
    >

        <!-- =================================================
             LOADING
        ================================================== -->

        <section
            v-if="loading"
            class="admin-state"
        >

            <span
                class="admin-state__icon"
                aria-hidden="true"
            >
                🐙
            </span>


            <strong>
                Chargement de l'administration...
            </strong>


            <p>
                Vérification de tes accès.
            </p>

        </section>


        <!-- =================================================
             ACCESS DENIED
        ================================================== -->

        <section
            v-else-if="
                !hasAdminAccess
            "
            class="
                admin-state
                admin-state--error
            "
        >

            <span
                class="admin-state__icon"
                aria-hidden="true"
            >
                🔒
            </span>


            <strong>
                Accès refusé
            </strong>


            <p>
                {{
                    errorMessage
                    ||
                    "Cette page est réservée aux administrateurs."
                }}
            </p>


            <div
                class="admin-state__actions"
            >

                <button
                    type="button"
                    class="
                        admin-button
                        admin-button--secondary
                    "
                    @click="
                        reloadAdmin
                    "
                >
                    ↻ Réessayer
                </button>


                <button
                    type="button"
                    class="
                        admin-button
                        admin-button--primary
                    "
                    @click="
                        backToSite
                    "
                >
                    Retour au site
                </button>

            </div>

        </section>


        <!-- =================================================
             ADMIN APP
        ================================================== -->

        <div
            v-else-if="admin"
            class="admin-layout"
        >

            <!-- =============================================
                 SIDEBAR COMPONENT
            ============================================== -->

            <AdminSidebar
                :active-tab="
                    activeTab
                "
                @change-tab="
                    changeTab
                "
                @go-profile="
                    goToProfile
                "
                @go-home="
                    backToSite
                "
            />


            <!-- =============================================
                 MAIN
            ============================================== -->

            <section
                class="admin-main"
            >

                <!-- =========================================
                     TOPBAR
                ========================================== -->

                <header
                    class="admin-topbar"
                >

                    <!-- =====================================
                         CURRENT PAGE
                    ====================================== -->

                    <div
                        class="admin-topbar__title"
                    >

                        <span
                            class="admin-topbar__eyebrow"
                        >
                            {{
                                currentTab.icon
                            }}

                            ADMINISTRATION
                        </span>


                        <h1>
                            {{
                                currentTab.label
                            }}
                        </h1>


                        <p
                            class="
                                admin-topbar__description
                            "
                        >
                            {{
                                currentTab.description
                            }}
                        </p>

                    </div>


                    <!-- =====================================
                         ADMIN PROFILE
                    ====================================== -->

                    <button
                        type="button"
                        class="
                            admin-topbar__profile
                        "
                        title="Ouvrir mon profil"
                        @click="
                            goToProfile
                        "
                    >

                        <!-- AVATAR -->

                        <div
                            class="
                                admin-topbar__avatar
                            "
                        >

                            <img
                                v-if="
                                    adminAvatar
                                "
                                :src="
                                    adminAvatar
                                "
                                :alt="
                                    `Avatar de ${adminDisplayName}`
                                "
                            >


                            <span
                                v-else
                                aria-hidden="true"
                            >
                                {{
                                    adminInitial
                                }}
                            </span>

                        </div>


                        <!-- USER -->

                        <div
                            class="
                                admin-topbar__profile-text
                            "
                        >

                            <strong>
                                {{
                                    adminDisplayName
                                }}
                            </strong>


                            <span>
                                @{{ admin.username }}
                            </span>

                        </div>


                        <!-- ROLE -->

                        <span
                            class="
                                admin-topbar__role
                            "
                        >
                            ADMIN
                        </span>

                    </button>

                </header>


                <!-- =========================================
                     GLOBAL ERROR
                ========================================== -->

                <div
                    v-if="
                        errorMessage
                    "
                    class="
                        admin-message
                        admin-message--error
                    "
                >

                    <span
                        aria-hidden="true"
                    >
                        ⚠️
                    </span>


                    <span>
                        {{
                            errorMessage
                        }}
                    </span>

                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div
                    class="admin-content"
                >

                    <!-- =====================================
                         DASHBOARD
                    ====================================== -->

                    <AdminDashboard
                        v-if="
                            activeTab
                            ===
                            'dashboard'
                        "
                    />


                    <!-- =====================================
                         POLLS
                    ====================================== -->

                    <AdminPolls
                        v-else-if="
                            activeTab
                            ===
                            'polls'
                        "
                    />


                    <!-- =====================================
                         GAMES
                    ====================================== -->

                    <AdminGames
                        v-else-if="
                            activeTab
                            ===
                            'games'
                        "
                    />


                    <!-- =====================================
                         SUGGESTIONS
                    ====================================== -->

                    <AdminSuggestions
                        v-else-if="
                            activeTab
                            ===
                            'suggestions'
                        "
                    />


                    <!-- =====================================
                         USERS
                    ====================================== -->

                    <AdminUsers
                        v-else-if="
                            activeTab
                            ===
                            'users'
                        "
                    />


                    <!-- =====================================
                         ARTWORKS
                    ====================================== -->

                    <AdminArtworks
                        v-else-if="
                            activeTab
                            ===
                            'artworks'
                        "
                    />


                    <!-- =====================================
                         ANNOUNCEMENTS
                    ====================================== -->

                    <AdminAnnouncements
                        v-else-if="
                            activeTab
                            ===
                            'announcements'
                        "
                    />


                    <!-- =====================================
                         MESSAGES
                    ====================================== -->

                    <AdminMessages
                        v-else-if="
                            activeTab
                            ===
                            'messages'
                        "
                    />


                    <!-- =====================================
                         FALLBACK
                    ====================================== -->

                    <section
                        v-else
                        class="admin-empty"
                    >

                        <span>
                            🐙
                        </span>


                        <strong>
                            Section inconnue
                        </strong>


                        <p>
                            Cette section de l'administration
                            n'existe pas.
                        </p>


                        <button
                            type="button"
                            class="
                                admin-button
                                admin-button--primary
                            "
                            @click="
                                changeTab(
                                    'dashboard'
                                )
                            "
                        >
                            Retour au dashboard
                        </button>

                    </section>

                </div>

            </section>

        </div>

    </main>

</template>