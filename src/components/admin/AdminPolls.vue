<script setup lang="ts">

import {
    computed,
    onMounted,
    ref,
    watch
} from "vue";

import {
    addAdminPollOption,
    createAdminPoll,
    deleteAdminPoll,
    deleteAdminPollOption,
    getAdminGames,
    getAdminPollOptions,
    getAdminPolls,
    updateAdminPoll
} from "../../services/admin.service";

import type {
    AdminGame,
    AdminPoll,
    AdminPollOption
} from "../../services/admin.service";


/* =========================================================
   TYPES
========================================================= */

type PollStatus =
    | "draft"
    | "active"
    | "closed";


interface PollForm {

    title:
        string;

    question:
        string;

    slug:
        string;

    description:
        string;

    category:
        string;

    status:
        PollStatus;

    starts_at:
        string;

    ends_at:
        string;

    results_visible:
        boolean;

    allow_suggestions:
        boolean;

}


/* =========================================================
   SUGGESTION DRAFT
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
   PROPS
========================================================= */

const props =
    withDefaults(
        defineProps<{

            suggestionDraft?:
                PollDraftFromSuggestion | null;

        }>(),
        {
            suggestionDraft:
                null
        }
    );


/* =========================================================
   STATE
========================================================= */

const polls =
    ref<AdminPoll[]>(
        []
    );

const games =
    ref<AdminGame[]>(
        []
    );

const selectedPoll =
    ref<AdminPoll | null>(
        null
    );

const selectedPollOptions =
    ref<AdminPollOption[]>(
        []
    );

const selectedGameIds =
    ref<string[]>(
        []
    );


const loading =
    ref(
        true
    );

const saving =
    ref(
        false
    );

const deleting =
    ref(
        false
    );

const loadingOptions =
    ref(
        false
    );


const formOpen =
    ref(
        false
    );

const editing =
    ref(
        false
    );


const errorMessage =
    ref(
        ""
    );

const successMessage =
    ref(
        ""
    );


const search =
    ref(
        ""
    );

const gameSearch =
    ref(
        ""
    );


const sourceSuggestionId =
    ref<string | null>(
        null
    );


/* =========================================================
   DEFAULT FORM
========================================================= */

function createEmptyForm():
    PollForm {

    return {

        title:
            "",

        question:
            "",

        slug:
            "",

        description:
            "",

        category:
            "games",

        status:
            "draft",

        starts_at:
            "",

        ends_at:
            "",

        results_visible:
            true,

        allow_suggestions:
            false

    };

}


const form =
    ref<PollForm>(
        createEmptyForm()
    );


/* =========================================================
   COMPUTED
========================================================= */

const filteredPolls =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            if (
                !query
            ) {

                return polls.value;

            }


            return polls.value.filter(
                poll => {

                    return (

                        poll.title
                            ?.toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        poll.question
                            ?.toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        poll.category
                            ?.toLowerCase()
                            .includes(
                                query
                            )

                        ||

                        poll.status
                            ?.toLowerCase()
                            .includes(
                                query
                            )

                    );

                }
            );

        }
    );


const pollEnabledGames =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.poll_enabled
                    ===
                    true
            )
    );


const filteredGames =
    computed(
        () => {

            const query =
                gameSearch.value
                    .trim()
                    .toLowerCase();


            if (
                !query
            ) {

                return pollEnabledGames.value;

            }


            return pollEnabledGames.value.filter(
                game =>
                    game.twitch_name
                        ?.toLowerCase()
                        .includes(
                            query
                        )
            );

        }
    );


const activePollsCount =
    computed(
        () =>
            polls.value.filter(
                poll =>
                    poll.status
                    ===
                    "active"
            ).length
    );


const draftPollsCount =
    computed(
        () =>
            polls.value.filter(
                poll =>
                    poll.status
                    ===
                    "draft"
            ).length
    );


const closedPollsCount =
    computed(
        () =>
            polls.value.filter(
                poll =>
                    poll.status
                    ===
                    "closed"
            ).length
    );


const canSave =
    computed(
        () => {

            if (
                saving.value
            ) {

                return false;

            }


            if (
                !form.value.title.trim()
            ) {

                return false;

            }


            if (
                !form.value.question.trim()
            ) {

                return false;

            }


            if (
                selectedGameIds.value.length
                <
                2
            ) {

                return false;

            }


            return true;

        }
    );


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value:
        string | null
): string {

    if (
        !value
    ) {

        return "—";

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

        return "—";

    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    ).format(
        date
    );

}


/* =========================================================
   DATABASE DATE -> INPUT DATE
========================================================= */

function toInputDate(
    value:
        string | null
): string {

    if (
        !value
    ) {

        return "";

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

        return "";

    }


    const offset =
        date.getTimezoneOffset();


    const localDate =
        new Date(
            date.getTime()
            -
            offset
            *
            60
            *
            1000
        );


    return localDate
        .toISOString()
        .slice(
            0,
            16
        );

}


/* =========================================================
   INPUT DATE -> ISO
========================================================= */

function toIsoDate(
    value:
        string
): string | null {

    if (
        !value
    ) {

        return null;

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

        return null;

    }


    return date.toISOString();

}


/* =========================================================
   GENERATE SLUG
========================================================= */

function generateSlug(
    value:
        string
): string {

    return value
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}


/* =========================================================
   TITLE CHANGE
========================================================= */

function handleTitleChange() {

    if (
        editing.value
        ||
        form.value.slug
    ) {

        return;

    }


    form.value.slug =
        generateSlug(
            form.value.title
        );

}


/* =========================================================
   LOAD POLLS
========================================================= */

async function loadPolls() {

    polls.value =
        await getAdminPolls();

}


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    games.value =
        await getAdminGames();

}


/* =========================================================
   LOAD ALL
========================================================= */

async function loadData() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        await Promise.all([
            loadPolls(),
            loadGames()
        ]);


    } catch (error) {

        console.error(
            "Erreur chargement sondages admin :",
            error
        );


        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de charger les sondages.";

    } finally {

        loading.value =
            false;

    }

}


/* =========================================================
   NORMALIZE SUGGESTION CATEGORY
========================================================= */

function normalizeSuggestionCategory(
    value:
        string
):
    string {

    const category =
        value
            .trim()
            .toLowerCase();


    switch (
        category
    ) {

        case "jeu":
        case "jeux":
        case "game":
        case "games":

            return "games";


        case "stream":
        case "live":

            return "stream";


        case "communaute":
        case "communauté":
        case "community":

            return "community";


        case "evenement":
        case "événement":
        case "event":

            return "event";


        case "autre":
        case "other":

            return "other";


        default:

            return category
                ||
                "games";

    }

}


/* =========================================================
   APPLY SUGGESTION DRAFT
========================================================= */

function applySuggestionDraft(
    draft:
        PollDraftFromSuggestion
) {

    selectedPoll.value =
        null;


    selectedPollOptions.value =
        [];


    selectedGameIds.value =
        [];


    const title =
        draft.title
            ?.trim()
        ||
        draft.question
            ?.trim()
        ||
        "Sondage proposé";


    const question =
        draft.question
            ?.trim()
        ||
        title;


    form.value = {

        ...createEmptyForm(),

        title,

        question,

        slug:
            generateSlug(
                title
            ),

        description:
            draft.description
                ?.trim()
            ||
            "",

        category:
            normalizeSuggestionCategory(
                draft.category
                ??
                ""
            ),

        /*
         * Une suggestion approuvée ne doit jamais
         * publier automatiquement un sondage.
         */

        status:
            "draft"

    };


    sourceSuggestionId.value =
        draft.suggestionId;


    editing.value =
        false;


    formOpen.value =
        true;


    gameSearch.value =
        "";


    errorMessage.value =
        "";


    successMessage.value =
        "";

}


/* =========================================================
   OPEN CREATE
========================================================= */

function openCreate() {

    sourceSuggestionId.value =
        null;


    selectedPoll.value =
        null;


    selectedPollOptions.value =
        [];


    selectedGameIds.value =
        [];


    form.value =
        createEmptyForm();


    editing.value =
        false;


    formOpen.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";

}


/* =========================================================
   LOAD POLL OPTIONS
========================================================= */

async function loadPollOptions(
    poll:
        AdminPoll
) {

    loadingOptions.value =
        true;


    try {

        selectedPollOptions.value =
            await getAdminPollOptions(
                poll.id
            );


        selectedGameIds.value =
            selectedPollOptions.value.map(
                option =>
                    option.game_id
            );


    } catch (error) {

        console.error(
            "Erreur chargement options :",
            error
        );


        throw error;


    } finally {

        loadingOptions.value =
            false;

    }

}


/* =========================================================
   OPEN EDIT
========================================================= */

async function openEdit(
    poll:
        AdminPoll
) {

    sourceSuggestionId.value =
        null;


    selectedPoll.value =
        poll;


    editing.value =
        true;


    formOpen.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    form.value = {

        title:
            poll.title
            ??
            "",

        question:
            poll.question
            ??
            "",

        slug:
            poll.slug
            ??
            "",

        description:
            poll.description
            ??
            "",

        category:
            poll.category
            ??
            "games",

        status:
            (
                poll.status
                ||
                "draft"
            ) as PollStatus,

        starts_at:
            toInputDate(
                poll.starts_at
            ),

        ends_at:
            toInputDate(
                poll.ends_at
            ),

        results_visible:
            poll.results_visible,

        allow_suggestions:
            poll.allow_suggestions

    };


    try {

        await loadPollOptions(
            poll
        );


    } catch (error) {

        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de charger les jeux du sondage.";

    }

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {

    if (
        saving.value
    ) {

        return;

    }


    formOpen.value =
        false;


    editing.value =
        false;


    selectedPoll.value =
        null;


    selectedPollOptions.value =
        [];


    selectedGameIds.value =
        [];


    gameSearch.value =
        "";


    sourceSuggestionId.value =
        null;


    form.value =
        createEmptyForm();

}


/* =========================================================
   TOGGLE GAME
========================================================= */

function toggleGame(
    gameId:
        string
) {

    const index =
        selectedGameIds.value.indexOf(
            gameId
        );


    if (
        index >= 0
    ) {

        selectedGameIds.value.splice(
            index,
            1
        );

        return;

    }


    selectedGameIds.value.push(
        gameId
    );

}


/* =========================================================
   SYNC POLL OPTIONS
========================================================= */

async function syncPollOptions(
    pollId:
        string
) {

    const currentOptions =
        editing.value
            ? selectedPollOptions.value
            : [];


    const currentGameIds =
        currentOptions.map(
            option =>
                option.game_id
        );


    /* -----------------------------------------------------
       DELETE REMOVED
    ------------------------------------------------------ */

    const optionsToDelete =
        currentOptions.filter(
            option =>
                !selectedGameIds.value.includes(
                    option.game_id
                )
        );


    for (
        const option
        of
        optionsToDelete
    ) {

        await deleteAdminPollOption(
            option.id
        );

    }


    /* -----------------------------------------------------
       ADD NEW
    ------------------------------------------------------ */

    const gameIdsToAdd =
        selectedGameIds.value.filter(
            gameId =>
                !currentGameIds.includes(
                    gameId
                )
        );


    for (
        const gameId
        of
        gameIdsToAdd
    ) {

        const position =
            selectedGameIds.value.indexOf(
                gameId
            );


        await addAdminPollOption({

            poll_id:
                pollId,

            game_id:
                gameId,

            position:
                position

        });

    }

}


/* =========================================================
   SAVE
========================================================= */

async function savePoll() {

    if (
        !canSave.value
    ) {

        return;

    }


    saving.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const startsAt =
            toIsoDate(
                form.value.starts_at
            );


        const endsAt =
            toIsoDate(
                form.value.ends_at
            );


        if (
            startsAt
            &&
            endsAt
            &&
            new Date(
                endsAt
            )
            <=
            new Date(
                startsAt
            )
        ) {

            throw new Error(
                "La date de fin doit être après la date de début."
            );

        }


        const payload = {

            title:
                form.value.title
                    .trim(),

            question:
                form.value.question
                    .trim(),

            slug:
                form.value.slug
                    .trim()
                ||
                generateSlug(
                    form.value.title
                ),

            description:
                form.value.description
                    .trim()
                ||
                null,

            category:
                form.value.category
                    .trim()
                ||
                null,

            status:
                form.value.status,

            starts_at:
                startsAt,

            ends_at:
                endsAt,

            results_visible:
                form.value.results_visible,

            allow_suggestions:
                form.value.allow_suggestions

        };


        let savedPoll:
            AdminPoll;


        if (
            editing.value
            &&
            selectedPoll.value
        ) {

            savedPoll =
                await updateAdminPoll(
                    selectedPoll.value.id,
                    payload
                );


        } else {

            savedPoll =
                await createAdminPoll(
                    payload
                );

        }


        await syncPollOptions(
            savedPoll.id
        );


        await loadPolls();


        successMessage.value =

            editing.value

                ? "Le sondage a bien été modifié. 💜"

                : "Le sondage a bien été créé. 💜";


        closeForm();


    } catch (error) {

        console.error(
            "Erreur sauvegarde sondage :",
            error
        );


        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible d'enregistrer le sondage.";

    } finally {

        saving.value =
            false;

    }

}


/* =========================================================
   CHANGE STATUS
========================================================= */

async function changeStatus(
    poll:
        AdminPoll,
    status:
        PollStatus
) {

    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const updated =
            await updateAdminPoll(
                poll.id,
                {
                    status
                }
            );


        const index =
            polls.value.findIndex(
                item =>
                    item.id
                    ===
                    poll.id
            );


        if (
            index >= 0
        ) {

            polls.value[index] =
                updated;

        }


        successMessage.value =
            "Statut du sondage mis à jour.";


    } catch (error) {

        console.error(
            "Erreur changement statut :",
            error
        );


        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de modifier le statut.";

    }

}


/* =========================================================
   STATUS SELECT CHANGE
========================================================= */

function handleStatusChange(
    poll:
        AdminPoll,
    event:
        Event
) {

    const target =
        event.target;


    if (
        !(
            target
            instanceof
            HTMLSelectElement
        )
    ) {

        return;

    }


    const value =
        target.value;


    if (
        value
        !==
        "draft"
        &&
        value
        !==
        "active"
        &&
        value
        !==
        "closed"
    ) {

        return;

    }


    void changeStatus(
        poll,
        value
    );

}


/* =========================================================
   DELETE
========================================================= */

async function removePoll(
    poll:
        AdminPoll
) {

    if (
        deleting.value
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Supprimer définitivement le sondage "${poll.title ?? poll.question ?? "Sans titre"}" ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    deleting.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        await deleteAdminPoll(
            poll.id
        );


        polls.value =
            polls.value.filter(
                item =>
                    item.id
                    !==
                    poll.id
            );


        successMessage.value =
            "Le sondage a été supprimé.";


    } catch (error) {

        console.error(
            "Erreur suppression sondage :",
            error
        );


        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de supprimer le sondage.";

    } finally {

        deleting.value =
            false;

    }

}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(
    status:
        string
): string {

    switch (
        status
    ) {

        case "active":

            return "Actif";


        case "closed":

            return "Terminé";


        case "draft":

            return "Brouillon";


        default:

            return status;

    }

}


/* =========================================================
   GAME IMAGE
========================================================= */

function getGameImage(
    game:
        AdminGame
): string | null {

    if (
        !game.box_art_url
    ) {

        return null;

    }


    return game.box_art_url
        .replace(
            "{width}",
            "285"
        )
        .replace(
            "{height}",
            "380"
        );

}


/* =========================================================
   WATCH SUGGESTION DRAFT
========================================================= */

watch(
    () =>
        props.suggestionDraft,

    draft => {

        if (
            !draft
        ) {

            return;

        }


        /*
         * Évite de rouvrir le même brouillon
         * si le parent réutilise exactement la même suggestion.
         */

        if (
            sourceSuggestionId.value
            ===
            draft.suggestionId
            &&
            formOpen.value
        ) {

            return;

        }


        applySuggestionDraft(
            draft
        );

    },
    {
        deep:
            true
    }
);


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    async () => {

        await loadData();


        if (
            props.suggestionDraft
        ) {

            applySuggestionDraft(
                props.suggestionDraft
            );

        }

    }
);

</script>


<template>

    <section
        class="admin-polls"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-section-header"
        >

            <div>

                <span
                    class="admin-section-header__eyebrow"
                >
                    🗳️ GESTION
                </span>


                <h2>
                    Sondages
                </h2>


                <p>
                    Crée et gère les sondages proposés
                    à ta communauté POUP.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--primary
                "
                @click="
                    openCreate
                "
            >
                ＋ Nouveau sondage
            </button>

        </header>


        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
            v-if="
                successMessage
            "
            class="
                admin-message
                admin-message--success
            "
        >
            ✓ {{ successMessage }}
        </div>


        <div
            v-if="
                errorMessage
            "
            class="
                admin-message
                admin-message--error
            "
        >
            ⚠️ {{ errorMessage }}
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

            <span>
                🐙
            </span>

            <strong>
                Chargement des sondages...
            </strong>

        </div>


        <template
            v-else
        >

            <!-- =============================================
                 STATS
            ============================================== -->

            <div
                class="admin-mini-stats"
            >

                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Total
                    </span>

                    <strong>
                        {{ polls.length }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Actifs
                    </span>

                    <strong>
                        {{ activePollsCount }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Brouillons
                    </span>

                    <strong>
                        {{ draftPollsCount }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Terminés
                    </span>

                    <strong>
                        {{ closedPollsCount }}
                    </strong>
                </article>

            </div>


            <!-- =============================================
                 TOOLBAR
            ============================================== -->

            <div
                class="admin-toolbar"
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
                        placeholder="Rechercher un sondage..."
                    >

                </div>


                <span
                    class="admin-toolbar__count"
                >
                    {{
                        filteredPolls.length
                    }}
                    sondage{{
                        filteredPolls.length > 1
                            ? "s"
                            : ""
                    }}
                </span>

            </div>


            <!-- =============================================
                 EMPTY
            ============================================== -->

            <div
                v-if="
                    filteredPolls.length
                    ===
                    0
                "
                class="admin-empty"
            >

                <span>
                    🗳️
                </span>


                <strong>
                    Aucun sondage
                </strong>


                <p>
                    Crée ton premier sondage
                    pour commencer.
                </p>


                <button
                    v-if="
                        !search
                    "
                    type="button"
                    class="
                        admin-button
                        admin-button--primary
                    "
                    @click="
                        openCreate
                    "
                >
                    Créer un sondage
                </button>

            </div>


            <!-- =============================================
                 POLLS LIST
            ============================================== -->

            <div
                v-else
                class="admin-poll-list"
            >

                <article
                    v-for="
                        poll
                        in
                        filteredPolls
                    "
                    :key="
                        poll.id
                    "
                    class="admin-poll-card"
                >

                    <!-- STATUS -->

                    <div
                        class="
                            admin-poll-card__status
                        "
                        :class="
                            `admin-poll-card__status--${poll.status}`
                        "
                    >
                        {{
                            getStatusLabel(
                                poll.status
                            )
                        }}
                    </div>


                    <!-- CONTENT -->

                    <div
                        class="
                            admin-poll-card__content
                        "
                    >

                        <span
                            class="
                                admin-poll-card__category
                            "
                        >
                            {{
                                poll.category
                                ||
                                "Sondage"
                            }}
                        </span>


                        <h3>
                            {{
                                poll.title
                                ||
                                "Sans titre"
                            }}
                        </h3>


                        <p
                            class="
                                admin-poll-card__question
                            "
                        >
                            {{
                                poll.question
                                ||
                                "Aucune question"
                            }}
                        </p>


                        <p
                            v-if="
                                poll.description
                            "
                            class="
                                admin-poll-card__description
                            "
                        >
                            {{ poll.description }}
                        </p>


                        <div
                            class="
                                admin-poll-card__meta
                            "
                        >

                            <span>
                                📅 Début :
                                {{
                                    formatDate(
                                        poll.starts_at
                                    )
                                }}
                            </span>


                            <span>
                                🏁 Fin :
                                {{
                                    formatDate(
                                        poll.ends_at
                                    )
                                }}
                            </span>


                            <span>
                                {{
                                    poll.results_visible
                                        ? "👁 Résultats visibles"
                                        : "🙈 Résultats masqués"
                                }}
                            </span>


                            <span>
                                {{
                                    poll.allow_suggestions
                                        ? "💡 Suggestions activées"
                                        : "💡 Suggestions désactivées"
                                }}
                            </span>

                        </div>

                    </div>


                    <!-- ACTIONS -->

                    <div
                        class="
                            admin-poll-card__actions
                        "
                    >

                        <select
                            :value="
                                poll.status
                            "
                            class="
                                admin-select
                            "
                            @change="
                                handleStatusChange(
                                    poll,
                                    $event
                                )
                            "
                        >
                            <option
                                value="draft"
                            >
                                Brouillon
                            </option>

                            <option
                                value="active"
                            >
                                Actif
                            </option>

                            <option
                                value="closed"
                            >
                                Terminé
                            </option>
                        </select>


                        <button
                            type="button"
                            class="
                                admin-button
                                admin-button--secondary
                            "
                            @click="
                                openEdit(
                                    poll
                                )
                            "
                        >
                            ✎ Modifier
                        </button>


                        <button
                            type="button"
                            class="
                                admin-button
                                admin-button--danger
                            "
                            :disabled="
                                deleting
                            "
                            @click="
                                removePoll(
                                    poll
                                )
                            "
                        >
                            🗑 Supprimer
                        </button>

                    </div>

                </article>

            </div>

        </template>


        <!-- =================================================
             FORM MODAL
        ================================================== -->

        <Teleport
            to="body"
        >

            <div
                v-if="
                    formOpen
                "
                class="admin-modal"
                @click.self="
                    closeForm
                "
            >

                <div
                    class="
                        admin-modal__dialog
                        admin-modal__dialog--large
                    "
                >

                    <!-- =====================================
                         MODAL HEADER
                    ====================================== -->

                    <header
                        class="
                            admin-modal__header
                        "
                    >

                        <div>

                            <span
                                class="
                                    admin-modal__eyebrow
                                "
                            >
                                🗳️ SONDAGE
                            </span>


                            <h2>
                                {{
                                    editing
                                        ? "Modifier le sondage"
                                        : "Créer un sondage"
                                }}
                            </h2>

                        </div>


                        <button
                            type="button"
                            class="
                                admin-modal__close
                            "
                            :disabled="
                                saving
                            "
                            aria-label="Fermer"
                            @click="
                                closeForm
                            "
                        >
                            ×
                        </button>

                    </header>


                    <!-- =====================================
                         SUGGESTION SOURCE
                    ====================================== -->

                    <div
                        v-if="
                            sourceSuggestionId
                            &&
                            !editing
                        "
                        class="
                            admin-message
                            admin-message--success
                        "
                    >
                        💡 Formulaire prérempli depuis une suggestion approuvée.
                        Vérifie les informations, choisis les jeux et crée le sondage
                        quand tout est prêt.
                    </div>


                    <!-- =====================================
                         FORM
                    ====================================== -->

                    <form
                        class="admin-form"
                        @submit.prevent="
                            savePoll
                        "
                    >

                        <!-- TITLE -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="
                                    admin-poll-title
                                "
                            >
                                Titre *
                            </label>


                            <input
                                id="
                                    admin-poll-title
                                "
                                v-model="
                                    form.title
                                "
                                type="text"
                                maxlength="120"
                                placeholder="Quel jeu veux-tu voir en live ?"
                                required
                                @input="
                                    handleTitleChange
                                "
                            >

                        </div>


                        <!-- QUESTION -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="
                                    admin-poll-question
                                "
                            >
                                Question *
                            </label>


                            <input
                                id="
                                    admin-poll-question
                                "
                                v-model="
                                    form.question
                                "
                                type="text"
                                maxlength="200"
                                placeholder="Pour quel jeu veux-tu voter ?"
                                required
                            >

                        </div>


                        <!-- SLUG + CATEGORY -->

                        <div
                            class="
                                admin-form__row
                            "
                        >

                            <div
                                class="admin-field"
                            >

                                <label
                                    for="
                                        admin-poll-slug
                                    "
                                >
                                    Slug
                                </label>


                                <input
                                    id="
                                        admin-poll-slug
                                    "
                                    v-model="
                                        form.slug
                                    "
                                    type="text"
                                    placeholder="jeu-prochain-live"
                                >

                            </div>


                            <div
                                class="admin-field"
                            >

                                <label
                                    for="
                                        admin-poll-category
                                    "
                                >
                                    Catégorie
                                </label>


                                <input
                                    id="
                                        admin-poll-category
                                    "
                                    v-model="
                                        form.category
                                    "
                                    type="text"
                                    placeholder="games"
                                >

                            </div>

                        </div>


                        <!-- DESCRIPTION -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="
                                    admin-poll-description
                                "
                            >
                                Description
                            </label>


                            <textarea
                                id="
                                    admin-poll-description
                                "
                                v-model="
                                    form.description
                                "
                                rows="4"
                                maxlength="500"
                                placeholder="Explique le sondage aux POUP..."
                            ></textarea>

                        </div>


                        <!-- STATUS -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="
                                    admin-poll-status
                                "
                            >
                                Statut
                            </label>


                            <select
                                id="
                                    admin-poll-status
                                "
                                v-model="
                                    form.status
                                "
                            >
                                <option
                                    value="draft"
                                >
                                    Brouillon
                                </option>

                                <option
                                    value="active"
                                >
                                    Actif
                                </option>

                                <option
                                    value="closed"
                                >
                                    Terminé
                                </option>
                            </select>

                        </div>


                        <!-- DATES -->

                        <div
                            class="
                                admin-form__row
                            "
                        >

                            <div
                                class="admin-field"
                            >

                                <label
                                    for="
                                        admin-poll-start
                                    "
                                >
                                    Date de début
                                </label>


                                <input
                                    id="
                                        admin-poll-start
                                    "
                                    v-model="
                                        form.starts_at
                                    "
                                    type="datetime-local"
                                >

                            </div>


                            <div
                                class="admin-field"
                            >

                                <label
                                    for="
                                        admin-poll-end
                                    "
                                >
                                    Date de fin
                                </label>


                                <input
                                    id="
                                        admin-poll-end
                                    "
                                    v-model="
                                        form.ends_at
                                    "
                                    type="datetime-local"
                                >

                            </div>

                        </div>


                        <!-- SETTINGS -->

                        <div
                            class="
                                admin-form-settings
                            "
                        >

                            <label
                                class="
                                    admin-switch-row
                                "
                            >

                                <div>

                                    <strong>
                                        Résultats visibles
                                    </strong>

                                    <span>
                                        Les POUP peuvent voir
                                        les résultats du vote.
                                    </span>

                                </div>


                                <input
                                    v-model="
                                        form.results_visible
                                    "
                                    type="checkbox"
                                >

                            </label>


                            <label
                                class="
                                    admin-switch-row
                                "
                            >

                                <div>

                                    <strong>
                                        Suggestions
                                    </strong>

                                    <span>
                                        Autoriser les suggestions
                                        pour ce sondage.
                                    </span>

                                </div>


                                <input
                                    v-model="
                                        form.allow_suggestions
                                    "
                                    type="checkbox"
                                >

                            </label>

                        </div>


                        <!-- =================================
                             GAMES
                        ================================== -->

                        <section
                            class="
                                admin-poll-games
                            "
                        >

                            <header
                                class="
                                    admin-poll-games__header
                                "
                            >

                                <div>

                                    <span
                                        class="
                                            admin-poll-games__eyebrow
                                        "
                                    >
                                        🎮 OPTIONS
                                    </span>


                                    <h3>
                                        Jeux du sondage
                                    </h3>


                                    <p>
                                        Choisis au minimum
                                        deux jeux.
                                    </p>

                                </div>


                                <span
                                    class="
                                        admin-poll-games__count
                                    "
                                >
                                    {{
                                        selectedGameIds.length
                                    }}
                                    sélectionné{{
                                        selectedGameIds.length > 1
                                            ? "s"
                                            : ""
                                    }}
                                </span>

                            </header>


                            <div
                                class="
                                    admin-search
                                    admin-search--games
                                "
                            >

                                <span>
                                    🔎
                                </span>


                                <input
                                    v-model="
                                        gameSearch
                                    "
                                    type="search"
                                    placeholder="Rechercher un jeu..."
                                >

                            </div>


                            <div
                                v-if="
                                    loadingOptions
                                "
                                class="
                                    admin-loading
                                    admin-loading--small
                                "
                            >
                                Chargement des jeux...
                            </div>


                            <div
                                v-else-if="
                                    filteredGames.length
                                "
                                class="
                                    admin-poll-games__grid
                                "
                            >

                                <button
                                    v-for="
                                        game
                                        in
                                        filteredGames
                                    "
                                    :key="
                                        game.id
                                    "
                                    type="button"
                                    class="
                                        admin-poll-game
                                    "
                                    :class="{
                                        'admin-poll-game--selected':
                                            selectedGameIds.includes(
                                                game.id
                                            )
                                    }"
                                    @click="
                                        toggleGame(
                                            game.id
                                        )
                                    "
                                >

                                    <div
                                        class="
                                            admin-poll-game__image
                                        "
                                    >

                                        <img
                                            v-if="
                                                getGameImage(
                                                    game
                                                )
                                            "
                                            :src="
                                                getGameImage(
                                                    game
                                                )!
                                            "
                                            :alt="
                                                game.twitch_name
                                                ||
                                                'Jeu'
                                            "
                                        >


                                        <span
                                            v-else
                                        >
                                            🎮
                                        </span>


                                        <span
                                            v-if="
                                                selectedGameIds.includes(
                                                    game.id
                                                )
                                            "
                                            class="
                                                admin-poll-game__check
                                            "
                                        >
                                            ✓
                                        </span>

                                    </div>


                                    <strong>
                                        {{
                                            game.twitch_name
                                            ||
                                            "Jeu sans nom"
                                        }}
                                    </strong>

                                </button>

                            </div>


                            <div
                                v-else
                                class="
                                    admin-empty
                                    admin-empty--small
                                "
                            >

                                <span>
                                    🎮
                                </span>


                                <p>
                                    Aucun jeu activé pour
                                    les sondages.
                                </p>

                            </div>

                        </section>


                        <!-- =================================
                             ACTIONS
                        ================================== -->

                        <footer
                            class="
                                admin-form__actions
                            "
                        >

                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--secondary
                                "
                                :disabled="
                                    saving
                                "
                                @click="
                                    closeForm
                                "
                            >
                                Annuler
                            </button>


                            <button
                                type="submit"
                                class="
                                    admin-button
                                    admin-button--primary
                                "
                                :disabled="
                                    !canSave
                                "
                            >

                                {{
                                    saving

                                        ? "Enregistrement..."

                                        : editing

                                            ? "Enregistrer les modifications"

                                            : "Créer le sondage"
                                }}

                            </button>

                        </footer>

                    </form>

                </div>

            </div>

        </Teleport>

    </section>

</template>