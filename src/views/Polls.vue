<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from "vue";

import "../assets/styles/pages/poll.css";

import PollCard from
  "../components/poll/PollCard.vue";

import PollResults from
  "../components/poll/PollResults.vue";

import {
  getActivePoll,
  getUserVote,
  voteForOption
} from "../services/poll.service";

import type {
  Poll,
  PollVote
} from "../services/poll.service";


/* =========================================================
   STATE
========================================================= */

const poll =
  ref<Poll | null>(
    null
  );

const userVote =
  ref<PollVote | null>(
    null
  );

const loading =
  ref(true);

const voting =
  ref(false);

const errorMessage =
  ref("");

const successMessage =
  ref("");


/* =========================================================
   COMPUTED
========================================================= */

const hasPoll =
  computed(() =>
    Boolean(
      poll.value
    )
  );


const hasVoted =
  computed(() =>
    Boolean(
      userVote.value
    )
  );


const isPollClosed =
  computed(() => {

    if (!poll.value) {
      return true;
    }

    return (
      poll.value.status
      !==
      "active"
    );

  });


const selectedOptionId =
  computed(() => {

    return (
      userVote.value?.option_id
      ??
      null
    );

  });


/* =========================================================
   LOAD POLL
========================================================= */

async function loadPoll() {

  loading.value =
    true;

  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    const activePoll =
      await getActivePoll();


    if (!activePoll) {

      poll.value =
        null;

      userVote.value =
        null;

      return;

    }


    poll.value =
      activePoll;


    /*
     * Vérifie si le POUP connecté
     * a déjà voté pour ce sondage.
     */
    userVote.value =
      await getUserVote(
        activePoll.id
      );


  } catch (error) {

    console.error(
      "Erreur chargement sondage :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de charger le sondage.";

  } finally {

    loading.value =
      false;

  }

}


/* =========================================================
   VOTE
========================================================= */

async function handleVote(
  optionId:
    string
) {

  if (
    !poll.value
    ||
    voting.value
    ||
    hasVoted.value
    ||
    isPollClosed.value
  ) {
    return;
  }


  voting.value =
    true;

  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    /*
     * Enregistre le vote avec
     * le compte POUP connecté.
     */
    const vote =
      await voteForOption(
        poll.value.id,
        optionId
      );


    userVote.value =
      vote;


    successMessage.value =
      "Ton vote a bien été enregistré. 💜";


    /*
     * Recharge le sondage afin
     * d'actualiser les résultats.
     */
    const refreshedPoll =
      await getActivePoll();


    if (refreshedPoll) {

      poll.value =
        refreshedPoll;

    }


  } catch (error) {

    console.error(
      "Erreur pendant le vote :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible d'enregistrer ton vote.";

  } finally {

    voting.value =
      false;

  }

}


/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(
  value:
    string | null
) {

  if (!value) {
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
   MOUNT
========================================================= */

onMounted(
  loadPoll
);

</script>


<template>

  <main
    class="poll-page"
  >

    <!-- =====================================================
         HERO
    ====================================================== -->

    <section
      class="poll-hero"
    >

      <div
        class="
          poll-hero__glow
          poll-hero__glow--one
        "
        aria-hidden="true"
      ></div>


      <div
        class="
          poll-hero__glow
          poll-hero__glow--two
        "
        aria-hidden="true"
      ></div>


      <header
        class="poll-hero__header"
      >

        <span
          class="poll-hero__eyebrow"
        >
          🗳️ SONDAGES
        </span>


        <h1
          class="poll-hero__title"
        >
          À toi de

          <span>
            choisir
          </span>
        </h1>


        <p
          class="poll-hero__description"
        >
          Vote avec ton compte POUP pour
          choisir le jeu que tu veux voir
          prochainement.
        </p>

      </header>

    </section>


    <!-- =====================================================
         POLL
    ====================================================== -->

    <section
      class="poll-section"
    >

      <!-- ===================================================
           LOADING
      ==================================================== -->

      <div
        v-if="loading"
        class="poll-state"
      >

        <span
          class="poll-state__icon"
          aria-hidden="true"
        >
          🐙
        </span>


        <strong>
          Chargement du sondage...
        </strong>


        <p>
          Une petite seconde.
        </p>

      </div>


      <!-- ===================================================
           ERROR
      ==================================================== -->

      <div
        v-else-if="
          errorMessage
          &&
          !poll
        "
        class="
          poll-state
          poll-state--error
        "
      >

        <span
          class="poll-state__icon"
          aria-hidden="true"
        >
          ⚠️
        </span>


        <strong>
          Impossible de charger le sondage.
        </strong>


        <p>
          {{ errorMessage }}
        </p>


        <button
          type="button"
          class="poll-state__button"
          @click="loadPoll"
        >
          Réessayer
        </button>

      </div>


      <!-- ===================================================
           NO POLL
      ==================================================== -->

      <div
        v-else-if="
          !hasPoll
        "
        class="poll-state"
      >

        <span
          class="poll-state__icon"
          aria-hidden="true"
        >
          💤
        </span>


        <strong>
          Aucun sondage pour le moment
        </strong>


        <p>
          Reviens bientôt pour participer
          au prochain vote.
        </p>

      </div>


      <!-- ===================================================
           ACTIVE POLL
      ==================================================== -->

      <template
        v-else-if="poll"
      >

        <!-- =================================================
             POLL HEADER
        ================================================== -->

        <header
          class="poll-section__header"
        >

          <span
            v-if="poll.category"
            class="poll-section__category"
          >
            {{ poll.category }}
          </span>


          <h2
            class="poll-section__title"
          >
            {{
              poll.title
              ??
              poll.question
              ??
              "Sondage"
            }}
          </h2>


          <p
            v-if="poll.description"
            class="poll-section__description"
          >
            {{ poll.description }}
          </p>


          <!-- ===============================================
               META
          ================================================ -->

          <div
            class="poll-section__meta"
          >

            <span
              class="poll-section__meta-item"
            >
              🗳️

              {{ poll.totalVotes }}

              vote{{
                poll.totalVotes > 1
                  ? "s"
                  : ""
              }}
            </span>


            <span
              v-if="poll.starts_at"
              class="poll-section__meta-item"
            >
              🕐

              Début :

              {{
                formatDate(
                  poll.starts_at
                )
              }}
            </span>


            <span
              v-if="poll.ends_at"
              class="poll-section__meta-item"
            >
              ⏳

              Fin :

              {{
                formatDate(
                  poll.ends_at
                )
              }}
            </span>

          </div>

        </header>


        <!-- =================================================
             SUCCESS MESSAGE
        ================================================== -->

        <div
          v-if="successMessage"
          class="
            poll-message
            poll-message--success
          "
        >

          <span
            aria-hidden="true"
          >
            ✓
          </span>


          <span>
            {{ successMessage }}
          </span>

        </div>


        <!-- =================================================
             ERROR MESSAGE
        ================================================== -->

        <div
          v-if="
            errorMessage
            &&
            poll
          "
          class="
            poll-message
            poll-message--error
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
             ALREADY VOTED
        ================================================== -->

        <div
          v-if="hasVoted"
          class="
            poll-message
            poll-message--voted
          "
        >

          <span
            aria-hidden="true"
          >
            💜
          </span>


          <span>
            Tu as déjà participé à ce sondage.
            Ton choix est indiqué sur la carte.
          </span>

        </div>


        <!-- =================================================
             CLOSED
        ================================================== -->

        <div
          v-if="isPollClosed"
          class="
            poll-message
            poll-message--closed
          "
        >

          <span
            aria-hidden="true"
          >
            🔒
          </span>


          <span>
            Ce sondage est terminé.
          </span>

        </div>


        <!-- =================================================
             OPTIONS / GAME CARDS
        ================================================== -->

        <div
          v-if="poll.options.length"
          class="poll-grid"
        >

          <PollCard
            v-for="
              option
              in
              poll.options
            "

            :key="
              option.id
            "

            :option="
              option
            "

            :selected="
              selectedOptionId
              ===
              option.id
            "

            :disabled="
              voting
              ||
              hasVoted
              ||
              isPollClosed
            "

            :results-visible="
              poll.results_visible
              ||
              hasVoted
              ||
              isPollClosed
            "

            @vote="
              handleVote
            "
          />

        </div>


        <!-- =================================================
             NO OPTIONS
        ================================================== -->

        <div
          v-else
          class="poll-state"
        >

          <span
            class="poll-state__icon"
            aria-hidden="true"
          >
            🎮
          </span>


          <strong>
            Aucun jeu dans ce sondage
          </strong>


          <p>
            Les choix seront bientôt ajoutés.
          </p>

        </div>


        <!-- =================================================
             RESULTS
        ================================================== -->

        <PollResults
          v-if="
            poll.options.length
          "

          :options="
            poll.options
          "

          :total-votes="
            poll.totalVotes
          "

          :visible="
            poll.results_visible
            ||
            hasVoted
            ||
            isPollClosed
          "
        />


        <!-- =================================================
             FOOTER
        ================================================== -->

        <footer
          v-if="
            poll.options.length
          "
          class="poll-section__footer"
        >

          <div
            class="poll-section__footer-info"
          >

            <span>

              {{
                poll.totalVotes
              }}

              vote{{
                poll.totalVotes > 1
                  ? "s"
                  : ""
              }}

              enregistré{{
                poll.totalVotes > 1
                  ? "s"
                  : ""
              }}

            </span>


            <span
              v-if="
                !hasVoted
                &&
                !isPollClosed
              "
            >
              Un seul vote est autorisé
              par compte POUP.
            </span>

          </div>

        </footer>

      </template>

    </section>

  </main>

</template>