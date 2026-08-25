import {
    createRouter,
    createWebHistory
} from "vue-router";


/* =========================================================
   VIEWS
========================================================= */

import HomeView from "../views/HomeView.vue";

import AboutView from "../views/AboutView.vue";

import GamesView from "../views/GamesView.vue";

import PollsView from "../views/PollsView.vue";

import HistoryView from "../views/HistoryView.vue";

import CreditsView from "../views/CreditsView.vue";

import LoginView from "../views/LoginView.vue";

import ProfileView from "../views/ProfileView.vue";

import AdminView from "../views/AdminView.vue";

import TwitchView from "../views/TwitchView.vue";

/* =========================================================
   ROUTES
========================================================= */

const routes = [

    /* =====================================================
       ACCUEIL
    ====================================================== */

    {
        path: "/",

        name: "home",

        component:
            HomeView
    },


    /* =====================================================
       INFORMATIONS
    ====================================================== */

    {
        path: "/about",

        name: "about",

        component:
            AboutView
    },


    /* =====================================================
       JEUX
    ====================================================== */

    {
        path: "/games",

        name: "games",

        component:
            GamesView
    },


    /* =====================================================
       SONDAGES
    ====================================================== */

    {
        path: "/polls",

        name: "polls",

        component:
            PollsView
    },


    /* =====================================================
       HISTOIRE
    ====================================================== */

    {
        path: "/history",

        name: "history",

        component:
            HistoryView
    },


    /* =====================================================
       CRÉDITS
    ====================================================== */

    {
        path: "/credits",

        name: "credits",

        component:
            CreditsView
    },


    /* =====================================================
       CONNEXION
    ====================================================== */

    {
        path: "/login",

        name: "login",

        component:
            LoginView,

        meta: {

            guestOnly:
                true
        }
    },


    /* =====================================================
       PROFIL UTILISATEUR
    ====================================================== */

    {
        path: "/profile",

        name: "profile",

        component:
            ProfileView,

        meta: {

            requiresAuth:
                true
        }
    },


    /* =====================================================
       ADMINISTRATION
    ====================================================== */

    {
        path: "/admin",

        name: "admin",

        component:
            AdminView,

        meta: {

            requiresAuth:
                true,

            requiresAdmin:
                true
        }
    },


    /* =====================================================
        Twitch
    ====================================================== */

    {
        path: "/twitch",

        name: "twitch",

        component:
            TwitchView
    }
];
/* =========================================================
   ROUTER
========================================================= */

const router =
    createRouter({

        history:
            createWebHistory(),

        routes

    });


/* =========================================================
   EXPORT
========================================================= */

export default router;