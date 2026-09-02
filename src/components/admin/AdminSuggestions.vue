<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";


import {
    deleteAdminSuggestion,
    getAdminSuggestions,
    updateSuggestionStatus
} from "../../services/admin.service";


import type {
    AdminSuggestion
} from "../../services/admin.service";


/* =========================================================
   TYPES
========================================================= */

type SuggestionStatus =
    | "pending"
    | "approved"
    | "rejected";


type SuggestionFilter =
    | "all"
    | SuggestionStatus;


/* =========================================================
   CREATE POLL DRAFT
========================================================= */

export interface PollDraftFromSuggestion {

    suggestionId:
        string;

    title:
        string;

    question:
        string;

    description:
        string;

    category:
        string;

}


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{

        createPollFromSuggestion:
            [
                draft:
                    PollDraftFromSuggestion
            ];

    }>();


/* =========================================================
   STATE
========================================================= */

const suggestions =
    ref<AdminSuggestion[]>([]);


const loading =
    ref(true);


const actionLoading =
    ref<string | null>(
        null
    );


const errorMessage =
    ref("");


const successMessage =
    ref("");


const search =
    ref("");


const filter =
    ref<SuggestionFilter>(
        "all"
    );


/* =========================================================
   FILTERED SUGGESTIONS
========================================================= */

const filteredSuggestions =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return suggestions.value.filter(
                suggestion => {

                    /* =========================================
                       STATUS
                    ========================================= */

                    const matchesStatus =
                        filter.value
                        ===
                        "all"
                        ||
                        suggestion.status
                        ===
                        filter.value;


                    /* =========================================
                       SEARCH
                    ========================================= */

                    const content = [

                        suggestion.question
                        ??
                        "",

                        suggestion.description
                        ??
                        "",

                        suggestion.category
                        ??
                        "",

                        suggestion.profile?.display_name
                        ??
                        "",

                        suggestion.profile?.username
                        ??
                        "",

                        suggestion.user_id
                        ??
                        ""

                    ]
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        !query
                        ||
                        content.includes(
                            query
                        );


                    return (
                        matchesStatus
                        &&
                        matchesSearch
                    );

                }
            );

        }
    );


/* =========================================================
   COUNTERS
========================================================= */

const totalCount =
    computed(
        () =>
            suggestions.value.length
    );


const pendingCount =
    computed(
        () =>
            suggestions.value.filter(
                suggestion =>
                    suggestion.status
                    ===
                    "pending"
            ).length
    );


const approvedCount =
    computed(
        () =>
            suggestions.value.filter(
                suggestion =>
                    suggestion.status
                    ===
                    "approved"
            ).length
    );


const rejectedCount =
    computed(
        () =>
            suggestions.value.filter(
                suggestion =>
                    suggestion.status
                    ===
                    "rejected"
            ).length
    );


/* =========================================================
   LOAD
========================================================= */

async function loadSuggestions() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        suggestions.value =
            await getAdminSuggestions();

    }
    catch (
        error
    ) {

        console.error(
            "Erreur chargement suggestions :",
            error
        );


        errorMessage.value =
            "Impossible de charger les suggestions.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   CHANGE STATUS
========================================================= */

async function changeStatus(
    suggestion:
        AdminSuggestion,

    status:
        SuggestionStatus
) {

    if (
        actionLoading.value
    ) {

        return;

    }


    actionLoading.value =
        suggestion.id;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const updated =
                await updateSuggestionStatus(
                    suggestion.id,
                    status
                );


        const index =
            suggestions.value.findIndex(
                item =>
                    item.id
                    ===
                    suggestion.id
            );


        if (
            index
            !==
            -1
        ) {

            suggestions.value[
                index
            ] =
                updated;

        }


        if (
            status
            ===
            "approved"
        ) {

            successMessage.value =
                "Suggestion approuvée.";

        }
        else if (
            status
            ===
            "rejected"
        ) {

            successMessage.value =
                "Suggestion refusée.";

        }
        else {

            successMessage.value =
                "Suggestion remise en attente.";

        }

    }
    catch (
        error
    ) {

        console.error(
            "Erreur modification suggestion :",
            error
        );


        errorMessage.value =
            "Impossible de modifier la suggestion.";

    }
    finally {

        actionLoading.value =
            null;

    }

}


/* =========================================================
   DELETE
========================================================= */

async function removeSuggestion(
    suggestion:
        AdminSuggestion
) {

    if (
        actionLoading.value
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Supprimer définitivement la suggestion "${suggestion.question ?? "Sans titre"}" ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    actionLoading.value =
        suggestion.id;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        await deleteAdminSuggestion(
            suggestion.id
        );


        suggestions.value =
            suggestions.value.filter(
                item =>
                    item.id
                    !==
                    suggestion.id
            );


        successMessage.value =
            "Suggestion supprimée.";

    }
    catch (
        error
    ) {

        console.error(
            "Erreur suppression suggestion :",
            error
        );


        errorMessage.value =
            "Impossible de supprimer la suggestion.";

    }
    finally {

        actionLoading.value =
            null;

    }

}


/* =========================================================
   CREATE POLL FROM SUGGESTION
========================================================= */

function createPollFromSuggestion(
    suggestion:
        AdminSuggestion
) {

    /*
     * Par sécurité, on ne permet la création
     * d'un sondage qu'à partir d'une suggestion approuvée.
     */

    if (
        suggestion.status
        !==
        "approved"
    ) {

        errorMessage.value =
            "Tu dois d'abord approuver cette suggestion.";


        return;

    }


    errorMessage.value =
        "";


    successMessage.value =
        "";


    const question =
        (
            suggestion.question
            ??
            ""
        ).trim();


    const description =
        (
            suggestion.description
            ??
            ""
        ).trim();


    const category =
        (
            suggestion.category
            ??
            "games"
        ).trim()
        ||
        "games";


    const draft:
        PollDraftFromSuggestion = {

            suggestionId:
                suggestion.id,

            /*
             * On réutilise la question comme titre initial.
             * AdminPolls pourra ensuite être modifié librement
             * avant l'enregistrement.
             */

            title:
                question
                ||
                "Sondage proposé",

            question:
                question,

            description:
                description,

            category:
                category

        };


    /*
     * Le parent Admin.vue recevra cet événement,
     * changera d'onglet vers "polls" et transmettra
     * le brouillon à AdminPolls.vue.
     */

    emit(
        "createPollFromSuggestion",
        draft
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value:
        string | null | undefined
) {

    if (
        !value
    ) {

        return "Date inconnue";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date inconnue";

    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day:
                "2-digit",

            month:
                "long",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        date
    );

}


/* =========================================================
   STATUS LABEL
========================================================= */

function statusLabel(
    status:
        string
) {

    switch (
        status
    ) {

        case "approved":

            return "Approuvée";


        case "rejected":

            return "Refusée";


        default:

            return "En attente";

    }

}


/* =========================================================
   STATUS CLASS
========================================================= */

function statusClass(
    status:
        string
) {

    switch (
        status
    ) {

        case "approved":

            return "admin-suggestion-status--approved";


        case "rejected":

            return "admin-suggestion-status--rejected";


        default:

            return "admin-suggestion-status--pending";

    }

}


/* =========================================================
   INIT
========================================================= */

onMounted(
    loadSuggestions
);

</script>


<template>

    <section
        class="admin-suggestions"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <div
            class="admin-section-header"
        >

            <div>

                <span
                    class="admin-section-eyebrow"
                >
                    COMMUNAUTÉ
                </span>


                <h2>
                    Suggestions
                </h2>


                <p>
                    Consulte et modère les suggestions
                    envoyées par les utilisateurs.
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
                    loadSuggestions
                "
            >
                ↻ Actualiser
            </button>

        </div>


        <!-- =================================================
             STATS
        ================================================== -->

        <div
            class="admin-suggestions-stats"
        >

            <button
                type="button"
                class="admin-suggestion-stat"
                :class="{
                    'admin-suggestion-stat--active':
                        filter === 'all'
                }"
                @click="
                    filter = 'all'
                "
            >

                <span>
                    Total
                </span>

                <strong>
                    {{ totalCount }}
                </strong>

            </button>


            <button
                type="button"
                class="admin-suggestion-stat"
                :class="{
                    'admin-suggestion-stat--active':
                        filter === 'pending'
                }"
                @click="
                    filter = 'pending'
                "
            >

                <span>
                    En attente
                </span>

                <strong>
                    {{ pendingCount }}
                </strong>

            </button>


            <button
                type="button"
                class="admin-suggestion-stat"
                :class="{
                    'admin-suggestion-stat--active':
                        filter === 'approved'
                }"
                @click="
                    filter = 'approved'
                "
            >

                <span>
                    Approuvées
                </span>

                <strong>
                    {{ approvedCount }}
                </strong>

            </button>


            <button
                type="button"
                class="admin-suggestion-stat"
                :class="{
                    'admin-suggestion-stat--active':
                        filter === 'rejected'
                }"
                @click="
                    filter = 'rejected'
                "
            >

                <span>
                    Refusées
                </span>

                <strong>
                    {{ rejectedCount }}
                </strong>

            </button>

        </div>


        <!-- =================================================
             TOOLBAR
        ================================================== -->

        <div
            class="admin-suggestions-toolbar"
        >

            <div
                class="admin-search"
            >

                <span
                    aria-hidden="true"
                >
                    🔎
                </span>


                <input
                    v-model="
                        search
                    "
                    type="search"
                    placeholder="Rechercher une suggestion..."
                >

            </div>


            <select
                v-model="
                    filter
                "
                class="
                    admin-select
                    admin-suggestions-filter
                "
            >

                <option
                    value="all"
                >
                    Toutes les suggestions
                </option>

                <option
                    value="pending"
                >
                    En attente
                </option>

                <option
                    value="approved"
                >
                    Approuvées
                </option>

                <option
                    value="rejected"
                >
                    Refusées
                </option>

            </select>

        </div>


        <!-- =================================================
             MESSAGES
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
            {{ errorMessage }}
        </div>


        <div
            v-if="
                successMessage
            "
            class="
                admin-message
                admin-message--success
            "
        >
            {{ successMessage }}
        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="
                loading
            "
            class="admin-loading"
        >

            <div
                class="admin-spinner"
            ></div>


            <span>
                Chargement des suggestions...
            </span>

        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
            v-else-if="
                filteredSuggestions.length === 0
            "
            class="admin-empty"
        >

            <span
                class="admin-empty__icon"
            >
                💡
            </span>


            <h3>
                Aucune suggestion
            </h3>


            <p
                v-if="
                    search
                    ||
                    filter !== 'all'
                "
            >
                Aucune suggestion ne correspond
                aux filtres sélectionnés.
            </p>


            <p
                v-else
            >
                Les suggestions des utilisateurs
                apparaîtront ici.
            </p>

        </div>


        <!-- =================================================
             LIST
        ================================================== -->

        <div
            v-else
            class="admin-suggestions-list"
        >

            <article
                v-for="
                    suggestion
                    in
                    filteredSuggestions
                "
                :key="
                    suggestion.id
                "
                class="admin-suggestion-card"
            >

                <!-- =========================================
                     TOP
                ========================================== -->

                <div
                    class="admin-suggestion-card__top"
                >

                    <div
                        class="admin-suggestion-card__meta"
                    >

                        <span
                            class="admin-suggestion-category"
                        >
                            {{
                                suggestion.category
                                ||
                                "Autre"
                            }}
                        </span>


                        <span
                            class="admin-suggestion-status"
                            :class="
                                statusClass(
                                    suggestion.status
                                )
                            "
                        >
                            {{
                                statusLabel(
                                    suggestion.status
                                )
                            }}
                        </span>

                    </div>


                    <time
                        :datetime="
                            suggestion.created_at
                        "
                    >
                        {{
                            formatDate(
                                suggestion.created_at
                            )
                        }}
                    </time>

                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div
                    class="admin-suggestion-card__content"
                >

                    <h3>
                        {{
                            suggestion.question
                            ||
                            "Suggestion sans titre"
                        }}
                    </h3>


                    <p
                        v-if="
                            suggestion.description
                        "
                    >
                        {{
                            suggestion.description
                        }}
                    </p>


                    <p
                        v-else
                        class="
                            admin-suggestion-card__empty-description
                        "
                    >
                        Aucune description.
                    </p>

                </div>


                <!-- =========================================
                     USER
                ========================================== -->

                <div
                    class="admin-suggestion-card__user"
                >

                    <!-- =====================================
                         AVATAR
                    ====================================== -->

                    <div
                        class="
                            admin-suggestion-card__user-avatar
                        "
                    >

                        <img
                            v-if="
                                suggestion.profile?.avatar_url
                            "
                            :src="
                                suggestion.profile.avatar_url
                            "
                            :alt="
                                `Avatar de ${
                                    suggestion.profile.display_name
                                    ||
                                    suggestion.profile.username
                                    ||
                                    'POUP'
                                }`
                            "
                        >


                        <span
                            v-else
                            aria-hidden="true"
                        >
                            👤
                        </span>

                    </div>


                    <!-- =====================================
                         INFOS
                    ====================================== -->

                    <div
                        class="
                            admin-suggestion-card__user-info
                        "
                    >

                        <small>
                            UTILISATEUR
                        </small>


                        <strong>
                            {{
                                suggestion.profile?.display_name
                                ||
                                suggestion.profile?.username
                                ||
                                "POUP"
                            }}
                        </strong>


                        <span
                            v-if="
                                suggestion.profile?.username
                            "
                            class="
                                admin-suggestion-card__username
                            "
                        >
                            @{{ suggestion.profile.username }}
                        </span>


                        <code
                            v-if="
                                suggestion.user_id
                            "
                            class="
                                admin-suggestion-card__user-id
                            "
                            :title="
                                suggestion.user_id
                            "
                        >
                            ID :
                            {{
                                suggestion.user_id
                            }}
                        </code>


                        <span
                            v-else
                            class="
                                admin-suggestion-card__anonymous
                            "
                        >
                            Suggestion anonyme
                        </span>

                    </div>

                </div>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div
                    class="admin-suggestion-card__actions"
                >

                    <button
                        v-if="
                            suggestion.status
                            !==
                            'approved'
                        "
                        type="button"
                        class="
                            admin-button
                            admin-button--success
                        "
                        :disabled="
                            actionLoading
                            ===
                            suggestion.id
                        "
                        @click="
                            changeStatus(
                                suggestion,
                                'approved'
                            )
                        "
                    >
                        ✓ Approuver
                    </button>


                    <button
                        v-if="
                            suggestion.status
                            !==
                            'rejected'
                        "
                        type="button"
                        class="
                            admin-button
                            admin-button--warning
                        "
                        :disabled="
                            actionLoading
                            ===
                            suggestion.id
                        "
                        @click="
                            changeStatus(
                                suggestion,
                                'rejected'
                            )
                        "
                    >
                        ✕ Refuser
                    </button>


                    <!-- =====================================
                         CREATE POLL
                    ====================================== -->

                    <button
                        v-if="
                            suggestion.status
                            ===
                            'approved'
                        "
                        type="button"
                        class="
                            admin-button
                            admin-button--primary
                        "
                        :disabled="
                            actionLoading
                            ===
                            suggestion.id
                        "
                        @click="
                            createPollFromSuggestion(
                                suggestion
                            )
                        "
                    >
                        🗳️ Créer un sondage
                    </button>


                    <button
                        v-if="
                            suggestion.status
                            !==
                            'pending'
                        "
                        type="button"
                        class="
                            admin-button
                            admin-button--secondary
                        "
                        :disabled="
                            actionLoading
                            ===
                            suggestion.id
                        "
                        @click="
                            changeStatus(
                                suggestion,
                                'pending'
                            )
                        "
                    >
                        ↩ En attente
                    </button>


                    <button
                        type="button"
                        class="
                            admin-button
                            admin-button--danger
                        "
                        :disabled="
                            actionLoading
                            ===
                            suggestion.id
                        "
                        @click="
                            removeSuggestion(
                                suggestion
                            )
                        "
                    >
                        🗑 Supprimer
                    </button>

                </div>


                <!-- =========================================
                     LOADING ACTION
                ========================================== -->

                <div
                    v-if="
                        actionLoading
                        ===
                        suggestion.id
                    "
                    class="
                        admin-suggestion-card__loading
                    "
                >
                    Traitement...
                </div>

            </article>

        </div>

    </section>

</template>

<style scoped>

/* =========================================================
   SUGGESTION USER
========================================================= */

.admin-suggestion-card__user {

    display:
        flex;

    align-items:
        center;

    gap:
        14px;

    margin-top:
        18px;

    padding:
        14px
        16px;

    border:
        1px solid
        var(
            --border-primary,
            rgba(
                255,
                255,
                255,
                0.1
            )
        );

    border-radius:
        16px;

    background:
        var(
            --surface-background-secondary,
            rgba(
                255,
                255,
                255,
                0.035
            )
        );

}


/* =========================================================
   AVATAR
========================================================= */

.admin-suggestion-card__user-avatar {

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    flex:
        0
        0
        48px;

    width:
        48px;

    height:
        48px;

    overflow:
        hidden;

    border:
        1px solid
        var(
            --border-primary,
            rgba(
                255,
                255,
                255,
                0.12
            )
        );

    border-radius:
        14px;

    background:
        rgba(
            109,
            0,
            163,
            0.2
        );

    font-size:
        1.3rem;

}


.admin-suggestion-card__user-avatar img {

    display:
        block;

    width:
        100%;

    height:
        100%;

    object-fit:
        cover;

}


/* =========================================================
   USER INFOS
========================================================= */

.admin-suggestion-card__user-info {

    display:
        flex;

    flex-direction:
        column;

    align-items:
        flex-start;

    min-width:
        0;

}


.admin-suggestion-card__user-info small {

    margin-bottom:
        3px;

    color:
        var(
            --color-cyan,
            #22f2ef
        );

    font-size:
        0.65rem;

    font-weight:
        900;

    letter-spacing:
        0.12em;

}


.admin-suggestion-card__user-info strong {

    max-width:
        100%;

    color:
        var(
            --text-primary,
            #ffffff
        );

    overflow:
        hidden;

    font-size:
        0.95rem;

    text-overflow:
        ellipsis;

    white-space:
        nowrap;

}


.admin-suggestion-card__username {

    margin-top:
        2px;

    color:
        var(
            --text-secondary,
            rgba(
                255,
                255,
                255,
                0.7
            )
        );

    font-size:
        0.78rem;

}


.admin-suggestion-card__user-id {

    display:
        block;

    max-width:
        min(
            100%,
            500px
        );

    margin-top:
        7px;

    color:
        var(
            --text-muted,
            rgba(
                255,
                255,
                255,
                0.45
            )
        );

    overflow:
        hidden;

    background:
        transparent;

    font-size:
        0.64rem;

    text-overflow:
        ellipsis;

    white-space:
        nowrap;

}


.admin-suggestion-card__anonymous {

    margin-top:
        3px;

    color:
        var(
            --text-muted,
            rgba(
                255,
                255,
                255,
                0.45
            )
        );

    font-size:
        0.75rem;

}


/* =========================================================
   MOBILE
========================================================= */

@media (
    max-width:
    650px
) {

    .admin-suggestion-card__user {

        align-items:
            flex-start;

    }


    .admin-suggestion-card__user-id {

        max-width:
            220px;

    }

}

</style>
