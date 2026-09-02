<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from "vue";

import PollCard from
  "../components/poll/PollCard.vue";
import PollResults from
  "../components/poll/PollResults.vue";

import PollSuggestions from
  "../components/poll/PollSuggestions.vue";
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

      return;

    }


    poll.value =
      activePoll;


    /*
     * Vérifie si le POUP
     * connecté a déjà voté.
     *
     * Si personne n'est connecté,
     * getUserVote retourne null.
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
     * Enregistre le vote
     * avec le compte POUP connecté.
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
     * Recharge le sondage
     * pour récupérer les nouveaux
     * résultats et pourcentages.
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
        class="poll-hero__glow poll-hero__glow--one"
        aria-hidden="true"
      ></div>

      <div
        class="poll-hero__glow poll-hero__glow--two"
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

      <!-- LOADING -->

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


      <!-- ERROR -->

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


      <!-- NO POLL -->

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


      <!-- ACTIVE POLL -->

      <template
        v-else-if="poll"
      >

        <!-- =================================================
             HEADER
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
             MESSAGES
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
             OPTIONS
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
             RESULTS
        ================================================== -->

        <PollResults
          v-if="poll.options.length"
          :options="poll.options"
          :total-votes="poll.totalVotes"
          :visible="
            poll.results_visible
            ||
            hasVoted
            ||
            isPollClosed
          "
        />


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
             FOOTER
        ================================================== -->

        <footer
          v-if="poll.options.length"
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
              v-if="!hasVoted && !isPollClosed"
            >
              Un seul vote est autorisé
              par compte POUP.
            </span>

          </div>

        </footer>

      </template>

    </section>


    <!-- =====================================================
         SUGGESTIONS
    ====================================================== -->

    <PollSuggestions />

  </main>

</template>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

.poll-page {
  width:
    100%;

  min-height:
    100vh;

  padding:
    30px
    20px
    90px;
}


/* =========================================================
   HERO
========================================================= */

.poll-hero {
  position:
    relative;

  isolation:
    isolate;

  width:
    min(
      1450px,
      100%
    );

  margin:
    0
    auto
    35px;

  padding:
    clamp(
      48px,
      6vw,
      85px
    );

  overflow:
    hidden;

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    34px;

  background:
    linear-gradient(
      145deg,
      rgba(109, 0, 163, 0.13),
      var(--surface-background),
      rgba(34, 242, 239, 0.055)
    );

  box-shadow:
    var(--shadow-primary);
}


/* =========================================================
   GLOW
========================================================= */

.poll-hero__glow {
  position:
    absolute;

  z-index:
    -1;

  border-radius:
    50%;

  pointer-events:
    none;

  filter:
    blur(45px);
}


.poll-hero__glow--one {
  top:
    -80px;

  right:
    10%;

  width:
    300px;

  height:
    300px;

  background:
    rgba(242, 34, 146, 0.13);
}


.poll-hero__glow--two {
  bottom:
    -100px;

  left:
    10%;

  width:
    280px;

  height:
    280px;

  background:
    rgba(34, 242, 239, 0.08);
}


/* =========================================================
   HERO HEADER
========================================================= */

.poll-hero__header {
  max-width:
    850px;

  margin:
    0
    auto;

  text-align:
    center;
}


.poll-hero__eyebrow {
  display:
    inline-block;

  margin-bottom:
    12px;

  color:
    var(--color-cyan);

  font-size:
    0.76rem;

  font-weight:
    900;

  letter-spacing:
    0.16em;

  text-transform:
    uppercase;
}


.poll-hero__title {
  margin:
    0
    0
    18px;

  color:
    var(--text-primary);

  font-size:
    clamp(
      2.8rem,
      7vw,
      6.2rem
    );

  line-height:
    1;
}


.poll-hero__title span {
  display:
    block;

  color:
    var(--color-pink);

  text-shadow:
    0
    0
    26px
    rgba(242, 34, 146, 0.20);
}


.poll-hero__description {
  max-width:
    650px;

  margin:
    0
    auto;

  color:
    var(--text-secondary);

  font-size:
    clamp(
      0.95rem,
      1.3vw,
      1.1rem
    );

  line-height:
    1.75;
}


/* =========================================================
   POLL SECTION
========================================================= */

.poll-section {
  width:
    min(
      1450px,
      100%
    );

  margin:
    0
    auto;

  padding:
    clamp(
      30px,
      5vw,
      60px
    );

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    34px;

  background:
    var(--surface-background);

  box-shadow:
    var(--shadow-primary);
}


/* =========================================================
   SECTION HEADER
========================================================= */

.poll-section__header {
  max-width:
    900px;

  margin:
    0
    auto
    35px;

  text-align:
    center;
}


.poll-section__category {
  display:
    inline-flex;

  margin-bottom:
    10px;

  padding:
    6px
    11px;

  border:
    1px
    solid
    rgba(242, 34, 146, 0.32);

  border-radius:
    999px;

  color:
    var(--color-pink);

  background:
    rgba(242, 34, 146, 0.07);

  font-size:
    0.67rem;

  font-weight:
    900;

  letter-spacing:
    0.1em;

  text-transform:
    uppercase;
}


.poll-section__title {
  margin:
    0
    0
    14px;

  color:
    var(--text-primary);

  font-size:
    clamp(
      2rem,
      4vw,
      3.7rem
    );

  line-height:
    1.08;
}


.poll-section__description {
  max-width:
    700px;

  margin:
    0
    auto
    20px;

  color:
    var(--text-secondary);

  font-size:
    0.95rem;

  line-height:
    1.75;
}


/* =========================================================
   META
========================================================= */

.poll-section__meta {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-wrap:
    wrap;

  gap:
    9px;
}


.poll-section__meta-item {
  display:
    inline-flex;

  align-items:
    center;

  min-height:
    36px;

  padding:
    6px
    11px;

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    999px;

  color:
    var(--text-muted);

  background:
    var(--surface-background-secondary);

  font-size:
    0.72rem;

  font-weight:
    800;
}


/* =========================================================
   MESSAGES
========================================================= */

.poll-message {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    9px;

  width:
    min(
      800px,
      100%
    );

  margin:
    0
    auto
    22px;

  padding:
    12px
    16px;

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    15px;

  color:
    var(--text-secondary);

  background:
    var(--surface-background-secondary);

  font-size:
    0.84rem;

  font-weight:
    800;

  text-align:
    center;
}


.poll-message--success,
.poll-message--voted {
  border-color:
    rgba(34, 242, 239, 0.34);

  background:
    rgba(34, 242, 239, 0.06);
}


.poll-message--error {
  border-color:
    rgba(255, 93, 129, 0.38);

  background:
    rgba(255, 93, 129, 0.07);
}


.poll-message--closed {
  opacity:
    0.8;
}


/* =========================================================
   GRID
========================================================= */

.poll-grid {
  display:
    grid;

  grid-template-columns:
    repeat(
      3,
      minmax(
        0,
        1fr
      )
    );

  gap:
    24px;
}


/* =========================================================
   STATE
========================================================= */

.poll-state {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  min-height:
    330px;

  padding:
    35px;

  color:
    var(--text-secondary);

  text-align:
    center;
}


.poll-state__icon {
  margin-bottom:
    15px;

  font-size:
    3rem;
}


.poll-state strong {
  margin-bottom:
    8px;

  color:
    var(--text-primary);

  font-size:
    1.4rem;
}


.poll-state p {
  max-width:
    500px;

  margin:
    0;

  line-height:
    1.6;
}


.poll-state__button {
  margin-top:
    20px;

  padding:
    10px
    17px;

  border:
    1px
    solid
    rgba(242, 34, 146, 0.46);

  border-radius:
    14px;

  color:
    #ffffff;

  background:
    linear-gradient(
      135deg,
      var(--color-purple),
      var(--color-pink)
    );

  font-weight:
    900;

  cursor:
    pointer;
}


/* =========================================================
   FOOTER
========================================================= */

.poll-section__footer {
  margin-top:
    35px;

  padding-top:
    22px;

  border-top:
    1px
    solid
    var(--border-primary);
}


.poll-section__footer-info {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-wrap:
    wrap;

  gap:
    10px
    25px;

  color:
    var(--text-muted);

  font-size:
    0.76rem;

  font-weight:
    800;

  text-align:
    center;
}


/* =========================================================
   TABLET
========================================================= */

@media (
  max-width:
    1050px
) {

  .poll-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(
          0,
          1fr
        )
      );
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width:
    700px
) {

  .poll-page {
    padding:
      15px
      10px
      60px;
  }


  .poll-hero,
  .poll-section {
    border-radius:
      25px;
  }


  .poll-hero {
    padding:
      42px
      20px;
  }


  .poll-section {
    padding:
      30px
      14px;
  }


  .poll-grid {
    grid-template-columns:
      1fr;

    gap:
      18px;
  }


  .poll-section__meta {
    flex-direction:
      column;

    align-items:
      stretch;
  }


  .poll-section__meta-item {
    justify-content:
      center;
  }

}

</style>