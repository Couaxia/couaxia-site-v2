<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    getAdminDashboardStats
} from "../../services/admin.service";

import type {
    AdminDashboardStats
} from "../../services/admin.service";


/* =========================================================
   STATE
========================================================= */

const stats =
    ref<AdminDashboardStats | null>(
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


/* =========================================================
   COMPUTED
========================================================= */

const cards =
    computed(
        () => {

            if (
                !stats.value
            ) {

                return [];

            }


            return [

                {
                    id:
                        "users",

                    icon:
                        "🐙",

                    label:
                        "Comptes POUP",

                    value:
                        stats.value.users,

                    detail:
                        "Utilisateurs inscrits"
                },

                {
                    id:
                        "games",

                    icon:
                        "🎮",

                    label:
                        "Jeux",

                    value:
                        stats.value.games,

                    detail:
                        `${stats.value.pollGames} disponibles pour les sondages`
                },

                {
                    id:
                        "polls",

                    icon:
                        "🗳️",

                    label:
                        "Sondages",

                    value:
                        stats.value.polls,

                    detail:
                        `${stats.value.activePolls} actif${stats.value.activePolls > 1 ? "s" : ""}`
                },

                {
                    id:
                        "votes",

                    icon:
                        "💜",

                    label:
                        "Votes",

                    value:
                        stats.value.votes,

                    detail:
                        "Votes enregistrés"
                },

                {
                    id:
                        "suggestions",

                    icon:
                        "💡",

                    label:
                        "Suggestions",

                    value:
                        stats.value.pendingSuggestions,

                    detail:
                        "En attente de traitement"
                },

                {
                    id:
                        "artworks",

                    icon:
                        "🎨",

                    label:
                        "Arts & Crédits",

                    value:
                        stats.value.artworks,

                    detail:
                        `${stats.value.visibleArtworks} visible${stats.value.visibleArtworks > 1 ? "s" : ""}`
                }

            ];

        }
    );


/* =========================================================
   LOAD
========================================================= */

async function loadDashboard() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        stats.value =
            await getAdminDashboardStats();


    } catch (error) {

        console.error(
            "Erreur chargement dashboard :",
            error
        );


        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de charger les statistiques.";

    } finally {

        loading.value =
            false;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadDashboard
);

</script>


<template>

    <section
        class="admin-dashboard"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-dashboard__header"
        >

            <div>

                <span
                    class="admin-dashboard__eyebrow"
                >
                    📊 VUE D'ENSEMBLE
                </span>


                <h2>
                    Dashboard
                </h2>


                <p>
                    Retrouve ici les informations principales
                    de ton site et de ta communauté POUP.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--secondary
                "
                :disabled="
                    loading
                "
                @click="
                    loadDashboard
                "
            >

                {{
                    loading
                        ? "Actualisation..."
                        : "↻ Actualiser"
                }}

            </button>

        </header>


        <!-- =================================================
             ERROR
        ================================================== -->

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
                {{ errorMessage }}
            </span>

        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="
                loading
            "
            class="
                admin-dashboard__loading
            "
        >

            <span
                aria-hidden="true"
            >
                🐙
            </span>


            <strong>
                Chargement des statistiques...
            </strong>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <template
            v-else-if="
                stats
            "
        >

            <!-- =============================================
                 STATS GRID
            ============================================== -->

            <div
                class="
                    admin-dashboard__grid
                "
            >

                <article
                    v-for="
                        card
                        in
                        cards
                    "
                    :key="
                        card.id
                    "
                    class="
                        admin-dashboard-card
                    "
                >

                    <div
                        class="
                            admin-dashboard-card__icon
                        "
                        aria-hidden="true"
                    >
                        {{ card.icon }}
                    </div>


                    <div
                        class="
                            admin-dashboard-card__content
                        "
                    >

                        <span
                            class="
                                admin-dashboard-card__label
                            "
                        >
                            {{ card.label }}
                        </span>


                        <strong
                            class="
                                admin-dashboard-card__value
                            "
                        >
                            {{ card.value }}
                        </strong>


                        <p
                            class="
                                admin-dashboard-card__detail
                            "
                        >
                            {{ card.detail }}
                        </p>

                    </div>

                </article>

            </div>


            <!-- =============================================
                 OVERVIEW
            ============================================== -->

            <div
                class="
                    admin-dashboard__overview
                "
            >

                <!-- POLLS -->

                <article
                    class="
                        admin-dashboard-panel
                    "
                >

                    <div
                        class="
                            admin-dashboard-panel__icon
                        "
                        aria-hidden="true"
                    >
                        🗳️
                    </div>


                    <div
                        class="
                            admin-dashboard-panel__content
                        "
                    >

                        <span
                            class="
                                admin-dashboard-panel__eyebrow
                            "
                        >
                            SONDAGES
                        </span>


                        <h3>
                            Activité des sondages
                        </h3>


                        <p>
                            {{
                                stats.activePolls
                            }}
                            sondage{{
                                stats.activePolls > 1
                                    ? "s"
                                    : ""
                            }}
                            actif{{
                                stats.activePolls > 1
                                    ? "s"
                                    : ""
                            }}
                            pour
                            {{
                                stats.votes
                            }}
                            vote{{
                                stats.votes > 1
                                    ? "s"
                                    : ""
                            }}
                            enregistré{{
                                stats.votes > 1
                                    ? "s"
                                    : ""
                            }}.
                        </p>

                    </div>

                </article>


                <!-- SUGGESTIONS -->

                <article
                    class="
                        admin-dashboard-panel
                    "
                >

                    <div
                        class="
                            admin-dashboard-panel__icon
                        "
                        aria-hidden="true"
                    >
                        💡
                    </div>


                    <div
                        class="
                            admin-dashboard-panel__content
                        "
                    >

                        <span
                            class="
                                admin-dashboard-panel__eyebrow
                            "
                        >
                            À TRAITER
                        </span>


                        <h3>
                            Suggestions POUP
                        </h3>


                        <p
                            v-if="
                                stats.pendingSuggestions
                                > 0
                            "
                        >
                            Tu as
                            {{
                                stats.pendingSuggestions
                            }}
                            suggestion{{
                                stats.pendingSuggestions > 1
                                    ? "s"
                                    : ""
                            }}
                            en attente.
                        </p>


                        <p
                            v-else
                        >
                            Aucune suggestion en attente
                            pour le moment.
                        </p>

                    </div>

                </article>


                <!-- ARTWORKS -->

                <article
                    class="
                        admin-dashboard-panel
                    "
                >

                    <div
                        class="
                            admin-dashboard-panel__icon
                        "
                        aria-hidden="true"
                    >
                        🎨
                    </div>


                    <div
                        class="
                            admin-dashboard-panel__content
                        "
                    >

                        <span
                            class="
                                admin-dashboard-panel__eyebrow
                            "
                        >
                            CRÉDITS
                        </span>


                        <h3>
                            Galerie d'arts
                        </h3>


                        <p>
                            {{
                                stats.visibleArtworks
                            }}
                            œuvre{{
                                stats.visibleArtworks > 1
                                    ? "s"
                                    : ""
                            }}
                            visible{{
                                stats.visibleArtworks > 1
                                    ? "s"
                                    : ""
                            }}
                            sur
                            {{
                                stats.artworks
                            }}
                            enregistrée{{
                                stats.artworks > 1
                                    ? "s"
                                    : ""
                            }}.
                        </p>

                    </div>

                </article>

            </div>


            <!-- =============================================
                 QUICK SUMMARY
            ============================================== -->

            <section
                class="
                    admin-dashboard__summary
                "
            >

                <div
                    class="
                        admin-dashboard__summary-icon
                    "
                    aria-hidden="true"
                >
                    ✨
                </div>


                <div>

                    <span
                        class="
                            admin-dashboard__summary-eyebrow
                        "
                    >
                        RÉSUMÉ
                    </span>


                    <h3>
                        Ton espace admin est prêt
                    </h3>


                    <p>
                        Tu peux gérer les sondages,
                        les jeux, les utilisateurs,
                        les suggestions et les arts
                        directement depuis cet espace.
                    </p>

                </div>

            </section>

        </template>

    </section>

</template>