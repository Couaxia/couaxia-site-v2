import {
    createRouter,
    createWebHistory
} from "vue-router";


/* =========================================================
   VIEWS
========================================================= */

import HomeView from "../views/Home.vue";

import AboutView from "../views/About.vue";

import GamesView from "../views/Games.vue";

import PollsView from "../views/Polls.vue";

import HistoryView from "../views/History.vue";

import CreditsView from "../views/Credits.vue";

import LoginView from "../views/Login.vue";

import ProfileView from "../views/Profile.vue";

import AdminView from "../views/Admin.vue";

import TwitchView from "../views/Twitch.vue";

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