<script setup lang="ts">

import {
  computed
} from "vue";

import type {
  PollOption
} from "../../services/poll.service";


/* =========================================================
   PROPS
========================================================= */

const props =
  defineProps<{
    option:
      PollOption;

    disabled?:
      boolean;

    selected?:
      boolean;

    resultsVisible?:
      boolean;
  }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
  defineEmits<{
    vote:
      [optionId: string];
  }>();


/* =========================================================
   COMPUTED
========================================================= */

const gameName =
  computed(() => {

    return (
      props.option.game?.twitch_name
      ??
      "Jeu inconnu"
    );

  });


const gameImage =
  computed(() => {

    return (
      props.option.game?.box_art_url
      ??
      ""
    );

  });


const gameDescription =
  computed(() => {

    return (
      props.option.game?.description
      ??
      ""
    );

  });


const voteLabel =
  computed(() => {

    const votes =
      props.option.votes;

    return `${votes} vote${votes > 1 ? "s" : ""}`;

  });


/* =========================================================
   VOTE
========================================================= */

function handleVote() {

  if (
    props.disabled
  ) {
    return;
  }

  emit(
    "vote",
    props.option.id
  );

}

</script>


<template>

  <article
    class="poll-card"
    :class="{
      'poll-card--selected':
        selected,

      'poll-card--disabled':
        disabled
    }"
  >

    <!-- =====================================================
         IMAGE
    ====================================================== -->

    <div
      class="poll-card__image-wrapper"
    >

      <img
        v-if="gameImage"
        :src="gameImage"
        :alt="gameName"
        class="poll-card__image"
      >

      <div
        v-else
        class="poll-card__image-placeholder"
        aria-hidden="true"
      >
        🎮
      </div>


      <div
        class="poll-card__image-overlay"
      ></div>


      <span
        v-if="selected"
        class="poll-card__selected-badge"
      >
        ✓ Ton vote
      </span>

    </div>


    <!-- =====================================================
         CONTENT
    ====================================================== -->

    <div
      class="poll-card__content"
    >

      <div
        class="poll-card__header"
      >

        <span
          class="poll-card__eyebrow"
        >
          🎮 Jeu
        </span>

        <h3
          class="poll-card__title"
        >
          {{ gameName }}
        </h3>

      </div>


      <p
        v-if="gameDescription"
        class="poll-card__description"
      >
        {{ gameDescription }}
      </p>


      <!-- ===================================================
           RESULTS
      ==================================================== -->

      <div
        v-if="resultsVisible"
        class="poll-card__results"
      >

        <div
          class="poll-card__results-top"
        >

          <span>
            {{ voteLabel }}
          </span>

          <strong>
            {{ option.percentage }}%
          </strong>

        </div>


        <div
          class="poll-card__progress"
          aria-hidden="true"
        >

          <div
            class="poll-card__progress-value"
            :style="{
              width:
                `${option.percentage}%`
            }"
          ></div>

        </div>

      </div>


      <!-- ===================================================
           ACTION
      ==================================================== -->

      <button
        type="button"
        class="poll-card__button"
        :disabled="disabled"
        @click="handleVote"
      >

        <span
          class="poll-card__button-icon"
          aria-hidden="true"
        >
          {{
            selected
              ? "✓"
              : "🗳️"
          }}
        </span>


        <span>
          {{
            selected
              ? "Vote enregistré"
              : disabled
                ? "Vote indisponible"
                : "Voter pour ce jeu"
          }}
        </span>

      </button>

    </div>

  </article>

</template>


<style scoped>

/* =========================================================
   CARD
========================================================= */

.poll-card {
  position: relative;

  display: flex;
  flex-direction: column;

  min-width: 0;

  overflow: hidden;

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    24px;

  background:
    linear-gradient(
      145deg,
      rgba(109, 0, 163, 0.10),
      var(--surface-background-secondary)
    );

  box-shadow:
    0
    16px
    36px
    rgba(0, 0, 0, 0.18);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}


.poll-card:hover {
  transform:
    translateY(-5px);

  border-color:
    rgba(242, 34, 146, 0.50);

  box-shadow:
    0
    22px
    44px
    rgba(0, 0, 0, 0.24),
    0
    0
    26px
    rgba(242, 34, 146, 0.08);
}


.poll-card--selected {
  border-color:
    rgba(34, 242, 239, 0.70);

  box-shadow:
    0
    20px
    42px
    rgba(0, 0, 0, 0.23),
    0
    0
    30px
    rgba(34, 242, 239, 0.12);
}


.poll-card--disabled {
  opacity:
    0.78;
}


/* =========================================================
   IMAGE
========================================================= */

.poll-card__image-wrapper {
  position:
    relative;

  aspect-ratio:
    16 / 9;

  overflow:
    hidden;

  background:
    rgba(109, 0, 163, 0.10);
}


.poll-card__image {
  display:
    block;

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

  transition:
    transform
    0.35s
    ease;
}


.poll-card:hover
.poll-card__image {
  transform:
    scale(1.045);
}


.poll-card__image-placeholder {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    100%;

  height:
    100%;

  font-size:
    4rem;
}


.poll-card__image-overlay {
  position:
    absolute;

  inset:
    0;

  pointer-events:
    none;

  background:
    linear-gradient(
      180deg,
      transparent
      45%,
      rgba(11, 3, 18, 0.62)
    );
}


/* =========================================================
   SELECTED BADGE
========================================================= */

.poll-card__selected-badge {
  position:
    absolute;

  top:
    14px;

  right:
    14px;

  z-index:
    3;

  display:
    inline-flex;

  align-items:
    center;

  min-height:
    34px;

  padding:
    6px
    11px;

  border:
    1px
    solid
    rgba(34, 242, 239, 0.45);

  border-radius:
    999px;

  color:
    #ffffff;

  background:
    rgba(9, 37, 42, 0.88);

  backdrop-filter:
    blur(8px);

  font-size:
    0.72rem;

  font-weight:
    900;
}


/* =========================================================
   CONTENT
========================================================= */

.poll-card__content {
  display:
    flex;

  flex-direction:
    column;

  flex:
    1;

  padding:
    22px;
}


/* =========================================================
   HEADER
========================================================= */

.poll-card__header {
  margin-bottom:
    12px;
}


.poll-card__eyebrow {
  display:
    inline-block;

  margin-bottom:
    7px;

  color:
    var(--color-cyan);

  font-size:
    0.67rem;

  font-weight:
    900;

  letter-spacing:
    0.12em;

  text-transform:
    uppercase;
}


.poll-card__title {
  margin:
    0;

  color:
    var(--text-primary);

  font-size:
    clamp(
      1.35rem,
      2vw,
      1.8rem
    );

  line-height:
    1.15;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.poll-card__description {
  display:
    -webkit-box;

  margin:
    0
    0
    20px;

  overflow:
    hidden;

  color:
    var(--text-secondary);

  font-size:
    0.9rem;

  line-height:
    1.65;


  -webkit-box-orient:
    vertical;
}


/* =========================================================
   RESULTS
========================================================= */

.poll-card__results {
  margin-top:
    auto;

  margin-bottom:
    18px;
}


.poll-card__results-top {
  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    12px;

  margin-bottom:
    8px;

  color:
    var(--text-muted);

  font-size:
    0.76rem;

  font-weight:
    800;
}


.poll-card__results-top strong {
  color:
    var(--color-pink);

  font-size:
    0.9rem;
}


/* =========================================================
   PROGRESS
========================================================= */

.poll-card__progress {
  position:
    relative;

  width:
    100%;

  height:
    7px;

  overflow:
    hidden;

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.07);
}


.poll-card__progress-value {
  height:
    100%;

  border-radius:
    inherit;

  background:
    linear-gradient(
      90deg,
      var(--color-purple),
      var(--color-pink),
      var(--color-cyan)
    );

  box-shadow:
    0
    0
    12px
    rgba(242, 34, 146, 0.30);

  transition:
    width
    0.45s
    ease;
}


/* =========================================================
   BUTTON
========================================================= */

.poll-card__button {
  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    100%;

  min-height:
    48px;

  gap:
    9px;

  padding:
    11px
    16px;

  border:
    1px
    solid
    rgba(242, 34, 146, 0.46);

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

  box-shadow:
    0
    10px
    24px
    rgba(109, 0, 163, 0.20);

  font-size:
    0.83rem;

  font-weight:
    900;

  cursor:
    pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease;
}


.poll-card__button:hover:not(:disabled) {
  transform:
    translateY(-2px);

  filter:
    brightness(1.08);

  box-shadow:
    0
    14px
    28px
    rgba(242, 34, 146, 0.20);
}


.poll-card__button:disabled {
  cursor:
    not-allowed;

  opacity:
    0.52;

  filter:
    grayscale(0.20);
}


.poll-card--selected
.poll-card__button {
  border-color:
    rgba(34, 242, 239, 0.42);

  background:
    linear-gradient(
      135deg,
      #176b75,
      #168f95
    );
}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width:
    600px
) {

  .poll-card {
    border-radius:
      20px;
  }


  .poll-card__content {
    padding:
      18px;
  }


  .poll-card__title {
    font-size:
      1.35rem;
  }


  .poll-card__description {
    font-size:
      0.84rem;
  }

}

</style>