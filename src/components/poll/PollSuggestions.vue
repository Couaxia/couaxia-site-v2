<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    createPollSuggestion,
    getCurrentPollUser,
    getMyPollSuggestions
} from "../../services/poll.service";

import type {
    PollSuggestion
} from "../../services/poll.service";


/* =========================================================
   PROPS
========================================================= */

const props =
    withDefaults(
        defineProps<{

            enabled?:
                boolean;

        }>(),
        {
            enabled:
                true
        }
    );


/* =========================================================
   STATE
========================================================= */

const category =
    ref(
        "jeu"
    );


const question =
    ref(
        ""
    );


const description =
    ref(
        ""
    );


const submitting =
    ref(
        false
    );


const loadingSuggestions =
    ref(
        true
    );


const isLoggedIn =
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


const suggestions =
    ref<PollSuggestion[]>(
        []
    );


/* =========================================================
   CATEGORY OPTIONS
========================================================= */

const categories = [

    {
        value:
            "jeu",
        label:
            "🎮 Jeu"
    },

    {
        value:
            "stream",
        label:
            "🔴 Stream"
    },

    {
        value:
            "communaute",
        label:
            "💜 Communauté"
    },

    {
        value:
            "evenement",
        label:
            "📅 Événement"
    },

    {
        value:
            "autre",
        label:
            "✨ Autre"
    }

];


/* =========================================================
   CAN SUBMIT
========================================================= */

const canSubmit =
    computed(
        () =>
            props.enabled
            &&
            isLoggedIn.value
            &&
            !submitting.value
            &&
            Boolean(
                category.value.trim()
            )
            &&
            Boolean(
                question.value.trim()
            )
    );


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(
    status:
        string
):
    string {

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
   STATUS ICON
========================================================= */

function getStatusIcon(
    status:
        string
):
    string {

    switch (
        status
    ) {

        case "approved":

            return "✅";


        case "rejected":

            return "❌";


        default:

            return "⏳";

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value:
        string
):
    string {

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


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle:
                "medium"
        }
    ).format(
        date
    );

}


/* =========================================================
   MASCOT
========================================================= */

function sendMascotMessage(
    message:
        string
) {

    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message
                }
            }
        )
    );

}


/* =========================================================
   LOAD USER
========================================================= */

async function loadUser() {

    try {

        const user =
            await getCurrentPollUser();


        isLoggedIn.value =
            Boolean(
                user
            );

    }

    catch (
        error
    ) {

        console.error(
            "Erreur utilisateur suggestions :",
            error
        );


        isLoggedIn.value =
            false;

    }

}


/* =========================================================
   LOAD SUGGESTIONS
========================================================= */

async function loadSuggestions() {

    loadingSuggestions.value =
        true;


    try {

        suggestions.value =
            await getMyPollSuggestions();

    }

    catch (
        error
    ) {

        console.error(
            "Erreur chargement suggestions utilisateur :",
            error
        );


        suggestions.value =
            [];

    }

    finally {

        loadingSuggestions.value =
            false;

    }

}


/* =========================================================
   SUBMIT
========================================================= */

async function submitSuggestion() {

    if (
        !canSubmit.value
    ) {

        return;

    }


    submitting.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        await createPollSuggestion(
            {
                category:
                    category.value,

                question:
                    question.value,

                description:
                    description.value
            }
        );


        successMessage.value =
            "Ta suggestion a bien été envoyée ! 💜";


        question.value =
            "";


        description.value =
            "";


        await loadSuggestions();


        sendMascotMessage(
            "Une nouvelle idée pour les sondages ! Je transmets ça à Couaxia. 💡🐙"
        );

    }

    catch (
        error
    ) {

        console.error(
            "Erreur envoi suggestion :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'envoyer ta suggestion.";

    }

    finally {

        submitting.value =
            false;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    async () => {

        await loadUser();


        await loadSuggestions();

    }
);

</script>


<template>

    <section
        class="poll-suggestions"
        aria-labelledby="poll-suggestions-title"
    >

        <div
            class="poll-suggestions__header"
        >

            <span
                class="poll-suggestions__eyebrow"
            >
                💡 TES IDÉES
            </span>


            <h2
                id="poll-suggestions-title"
            >
                Proposer un sondage
            </h2>


            <p>
                Tu as une idée de jeu, de stream ou de question
                pour la communauté ? Envoie-la ici.
            </p>

        </div>


        <div
            v-if="
                !enabled
            "
            class="
                poll-suggestions__message
                poll-suggestions__message--disabled
            "
        >
            🔒 Les suggestions sont désactivées pour ce sondage.
        </div>


        <div
            v-else-if="
                !isLoggedIn
            "
            class="
                poll-suggestions__message
                poll-suggestions__message--login
            "
        >
            👤 Connecte-toi à ton compte POUP pour proposer une idée.
        </div>


        <form
            v-else
            class="poll-suggestions__form"
            @submit.prevent="
                submitSuggestion
            "
        >

            <div
                class="poll-suggestions__field"
            >

                <label
                    for="poll-suggestion-category"
                >
                    Catégorie
                </label>


                <select
                    id="poll-suggestion-category"
                    v-model="
                        category
                    "
                >

                    <option
                        v-for="
                            option
                            in
                            categories
                        "
                        :key="
                            option.value
                        "
                        :value="
                            option.value
                        "
                    >
                        {{ option.label }}
                    </option>

                </select>

            </div>


            <div
                class="poll-suggestions__field"
            >

                <label
                    for="poll-suggestion-question"
                >
                    Question *
                </label>


                <input
                    id="poll-suggestion-question"
                    v-model="
                        question
                    "
                    type="text"
                    maxlength="180"
                    required
                    placeholder="Ex : Quel jeu veux-tu voir en prochain stream ?"
                >

            </div>


            <div
                class="poll-suggestions__field"
            >

                <label
                    for="poll-suggestion-description"
                >
                    Description
                </label>


                <textarea
                    id="poll-suggestion-description"
                    v-model="
                        description
                    "
                    rows="5"
                    maxlength="1000"
                    placeholder="Explique ton idée si tu veux donner plus de contexte..."
                ></textarea>

            </div>


            <div
                v-if="
                    errorMessage
                "
                class="
                    poll-suggestions__message
                    poll-suggestions__message--error
                "
            >
                ⚠️ {{ errorMessage }}
            </div>


            <div
                v-if="
                    successMessage
                "
                class="
                    poll-suggestions__message
                    poll-suggestions__message--success
                "
            >
                ✅ {{ successMessage }}
            </div>


            <button
                type="submit"
                class="poll-suggestions__submit"
                :disabled="
                    !canSubmit
                "
            >
                {{
                    submitting
                        ? "Envoi..."
                        : "💡 Envoyer ma suggestion"
                }}
            </button>

        </form>


        <div
            v-if="
                isLoggedIn
            "
            class="poll-suggestions__mine"
        >

            <div
                class="poll-suggestions__mine-header"
            >

                <div>

                    <span>
                        📋 MES PROPOSITIONS
                    </span>


                    <h3>
                        Suivi de mes suggestions
                    </h3>

                </div>


                <strong>
                    {{ suggestions.length }}
                </strong>

            </div>


            <div
                v-if="
                    loadingSuggestions
                "
                class="poll-suggestions__empty"
            >
                Chargement...
            </div>


            <div
                v-else-if="
                    suggestions.length === 0
                "
                class="poll-suggestions__empty"
            >
                Tu n'as encore envoyé aucune suggestion.
            </div>


            <div
                v-else
                class="poll-suggestions__list"
            >

                <article
                    v-for="
                        suggestion
                        in
                        suggestions
                    "
                    :key="
                        suggestion.id
                    "
                    class="poll-suggestions__item"
                >

                    <div
                        class="poll-suggestions__item-top"
                    >

                        <span
                            class="poll-suggestions__category"
                        >
                            {{ suggestion.category }}
                        </span>


                        <span
                            class="poll-suggestions__status"
                            :class="
                                `poll-suggestions__status--${suggestion.status}`
                            "
                        >
                            {{
                                getStatusIcon(
                                    suggestion.status
                                )
                            }}
                            {{
                                getStatusLabel(
                                    suggestion.status
                                )
                            }}
                        </span>

                    </div>


                    <h4>
                        {{ suggestion.question }}
                    </h4>


                    <p
                        v-if="
                            suggestion.description
                        "
                    >
                        {{ suggestion.description }}
                    </p>


                    <time>
                        Envoyée le
                        {{
                            formatDate(
                                suggestion.created_at
                            )
                        }}
                    </time>

                </article>

            </div>

        </div>

    </section>

</template>


<style scoped>

.poll-suggestions {

    width:
        min(
            1450px,
            100%
        );

    margin:
        35px
        auto
        0;

    padding:
        clamp(
            28px,
            5vw,
            55px
        );

    box-sizing:
        border-box;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        34px;

    background:
        var(--surface-background);

    box-shadow:
        var(--shadow-primary);

}


.poll-suggestions__header {

    max-width:
        760px;

    margin:
        0
        auto
        30px;

    text-align:
        center;

}


.poll-suggestions__eyebrow,
.poll-suggestions__mine-header span {

    color:
        var(--color-cyan);

    font-size:
        0.76rem;

    font-weight:
        900;

    letter-spacing:
        0.15em;

}


.poll-suggestions__header h2 {

    margin:
        10px
        0
        12px;

    color:
        var(--text-primary);

    font-size:
        clamp(
            2rem,
            4vw,
            3.4rem
        );

}


.poll-suggestions__header p {

    margin:
        0;

    color:
        var(--text-secondary);

    line-height:
        1.7;

}


.poll-suggestions__form {

    display:
        grid;

    gap:
        18px;

    width:
        min(
            850px,
            100%
        );

    margin:
        0
        auto;

}


.poll-suggestions__field {

    display:
        grid;

    gap:
        8px;

}


.poll-suggestions__field label {

    color:
        var(--text-primary);

    font-size:
        0.88rem;

    font-weight:
        900;

}


.poll-suggestions__field input,
.poll-suggestions__field select,
.poll-suggestions__field textarea {

    width:
        100%;

    box-sizing:
        border-box;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        16px;

    outline:
        none;

    color:
        var(--text-primary);

    background:
        var(--surface-background-secondary);

    font:
        inherit;

}


.poll-suggestions__field input,
.poll-suggestions__field select {

    min-height:
        54px;

    padding:
        0
        16px;

}


.poll-suggestions__field textarea {

    min-height:
        130px;

    padding:
        15px;

    resize:
        vertical;

}


.poll-suggestions__field input:focus,
.poll-suggestions__field select:focus,
.poll-suggestions__field textarea:focus {

    border-color:
        var(--color-pink);

    box-shadow:
        0
        0
        0
        3px
        rgba(
            242,
            34,
            146,
            0.08
        );

}


.poll-suggestions__submit {

    justify-self:
        center;

    min-height:
        52px;

    padding:
        0
        24px;

    border:
        0;

    border-radius:
        15px;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            var(--color-purple),
            var(--color-pink)
        );

    font:
        inherit;

    font-weight:
        900;

    cursor:
        pointer;

}


.poll-suggestions__submit:disabled {

    cursor:
        not-allowed;

    opacity:
        0.5;

}


.poll-suggestions__message {

    width:
        min(
            850px,
            100%
        );

    margin:
        0
        auto
        18px;

    padding:
        14px
        18px;

    box-sizing:
        border-box;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        15px;

    color:
        var(--text-secondary);

    background:
        var(--surface-background-secondary);

    text-align:
        center;

    font-weight:
        800;

}


.poll-suggestions__message--success {

    border-color:
        rgba(
            34,
            242,
            239,
            0.32
        );

}


.poll-suggestions__message--error {

    border-color:
        rgba(
            255,
            93,
            129,
            0.38
        );

}


.poll-suggestions__mine {

    width:
        min(
            1000px,
            100%
        );

    margin:
        42px
        auto
        0;

    padding-top:
        30px;

    border-top:
        1px solid
        var(--border-primary);

}


.poll-suggestions__mine-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        18px;

    margin-bottom:
        18px;

}


.poll-suggestions__mine-header h3 {

    margin:
        6px
        0
        0;

    color:
        var(--text-primary);

}


.poll-suggestions__mine-header > strong {

    display:
        grid;

    place-items:
        center;

    min-width:
        46px;

    height:
        46px;

    border-radius:
        50%;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            var(--color-purple),
            var(--color-pink)
        );

}


.poll-suggestions__list {

    display:
        grid;

    gap:
        14px;

}


.poll-suggestions__item {

    padding:
        18px;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        18px;

    background:
        var(--surface-background-secondary);

}


.poll-suggestions__item-top {

    display:
        flex;

    justify-content:
        space-between;

    flex-wrap:
        wrap;

    gap:
        8px;

}


.poll-suggestions__category,
.poll-suggestions__status {

    padding:
        5px
        9px;

    border-radius:
        999px;

    font-size:
        0.7rem;

    font-weight:
        900;

}


.poll-suggestions__category {

    color:
        var(--color-cyan);

    border:
        1px solid
        rgba(
            34,
            242,
            239,
            0.3
        );

}


.poll-suggestions__status {

    color:
        var(--text-secondary);

    border:
        1px solid
        var(--border-primary);

}


.poll-suggestions__status--approved {

    color:
        var(--color-cyan);

}


.poll-suggestions__status--rejected {

    color:
        #ff6e99;

}


.poll-suggestions__item h4 {

    margin:
        14px
        0
        8px;

    color:
        var(--text-primary);

    font-size:
        1.05rem;

}


.poll-suggestions__item p {

    margin:
        0
        0
        12px;

    color:
        var(--text-secondary);

    line-height:
        1.55;

}


.poll-suggestions__item time {

    color:
        var(--text-muted);

    font-size:
        0.72rem;

}


.poll-suggestions__empty {

    padding:
        22px;

    border:
        1px dashed
        var(--border-primary);

    border-radius:
        16px;

    color:
        var(--text-muted);

    text-align:
        center;

}


@media (
    max-width:
    700px
) {

    .poll-suggestions {

        padding:
            26px
            14px;

        border-radius:
            25px;

    }


    .poll-suggestions__mine-header {

        align-items:
            flex-start;

    }

}

</style>
