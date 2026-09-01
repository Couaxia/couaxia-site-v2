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
    options:
      PollOption[];

    totalVotes:
      number;

    visible?:
      boolean;
  }>();


/* =========================================================
   COMPUTED
========================================================= */

const sortedOptions =
  computed(() => {

    return [
      ...props.options
    ].sort(
      (
        a,
        b
      ) => {

        if (
          b.votes
          !==
          a.votes
        ) {
          return (
            b.votes
            -
            a.votes
          );
        }

        return (
          a.position
          -
          b.position
        );

      }
    );

  });


const winner =
  computed(() => {

    return (
      sortedOptions.value[0]
      ??
      null
    );

  });


const winnerVotes =
  computed(() => {

    return (
      winner.value?.votes
      ??
      0
    );

  });


function getRank(
  index:
    number
) {

  if (index === 0) {
    return "🥇";
  }

  if (index === 1) {
    return "🥈";
  }

  if (index === 2) {
    return "🥉";
  }

  return `#${index + 1}`;

}


function getGameName(
  option:
    PollOption
) {

  return (
    option.game?.twitch_name
    ??
    "Jeu inconnu"
  );

}


function getGameImage(
  option:
    PollOption
) {

  return (
    option.game?.box_art_url
    ??
    ""
  );

}

</script>


<template>

  <section
    v-if="visible"
    class="poll-results"
  >

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header
      class="poll-results__header"
    >

      <span
        class="poll-results__eyebrow"
      >
        🏆 RÉSULTATS
      </span>


      <h2
        class="poll-results__title"
      >
        Résultats du
        <span>
          sondage
        </span>
      </h2>


      <p
        class="poll-results__description"
      >
        Découvre le classement actuel
        des jeux proposés.
      </p>

    </header>


    <!-- =====================================================
         EMPTY
    ====================================================== -->

    <div
      v-if="!sortedOptions.length"
      class="poll-results__empty"
    >

      <span
        aria-hidden="true"
      >
        💤
      </span>

      <strong>
        Aucun résultat pour le moment
      </strong>

      <p>
        Les votes apparaîtront ici dès
        qu’un POUP participera au sondage.
      </p>

    </div>


    <!-- =====================================================
         WINNER
    ====================================================== -->

    <div
      v-else-if="
        winner
        &&
        winnerVotes > 0
      "
      class="poll-results__winner"
    >

      <div
        class="poll-results__winner-image"
      >

        <img
          v-if="
            getGameImage(
              winner
            )
          "
          :src="
            getGameImage(
              winner
            )
          "
          :alt="
            getGameName(
              winner
            )
          "
        >

        <div
          v-else
          class="
            poll-results__winner-placeholder
          "
          aria-hidden="true"
        >
          🎮
        </div>


        <span
          class="
            poll-results__winner-crown
          "
          aria-hidden="true"
        >
          👑
        </span>

      </div>


      <div
        class="
          poll-results__winner-content
        "
      >

        <span
          class="
            poll-results__winner-label
          "
        >
          En tête
        </span>


        <h3>
          {{
            getGameName(
              winner
            )
          }}
        </h3>


        <div
          class="
            poll-results__winner-stats
          "
        >

          <strong>
            {{ winner.percentage }}%
          </strong>

          <span>
            {{ winner.votes }}
            vote{{
              winner.votes > 1
                ? "s"
                : ""
            }}
          </span>

        </div>


        <div
          class="
            poll-results__winner-progress
          "
          aria-hidden="true"
        >

          <div
            class="
              poll-results__winner-progress-value
            "
            :style="{
              width:
                `${winner.percentage}%`
            }"
          ></div>

        </div>

      </div>

    </div>


    <!-- =====================================================
         RANKING
    ====================================================== -->

    <div
      v-if="sortedOptions.length"
      class="poll-results__list"
    >

      <article
        v-for="
          (
            option,
            index
          )
          in
          sortedOptions
        "
        :key="
          option.id
        "
        class="poll-results__row"
        :class="{
          'poll-results__row--winner':
            index === 0
            &&
            option.votes > 0
        }"
      >

        <!-- RANK -->

        <div
          class="poll-results__rank"
        >
          {{
            getRank(
              index
            )
          }}
        </div>


        <!-- IMAGE -->

        <div
          class="poll-results__game-image"
        >

          <img
            v-if="
              getGameImage(
                option
              )
            "
            :src="
              getGameImage(
                option
              )
            "
            :alt="
              getGameName(
                option
              )
            "
          >

          <span
            v-else
            aria-hidden="true"
          >
            🎮
          </span>

        </div>


        <!-- GAME -->

        <div
          class="poll-results__game"
        >

          <strong>
            {{
              getGameName(
                option
              )
            }}
          </strong>


          <div
            class="poll-results__bar"
            aria-hidden="true"
          >

            <div
              class="poll-results__bar-value"
              :style="{
                width:
                  `${option.percentage}%`
              }"
            ></div>

          </div>

        </div>


        <!-- STATS -->

        <div
          class="poll-results__stats"
        >

          <strong>
            {{ option.percentage }}%
          </strong>

          <span>
            {{ option.votes }}
            vote{{
              option.votes > 1
                ? "s"
                : ""
            }}
          </span>

        </div>

      </article>

    </div>


    <!-- =====================================================
         TOTAL
    ====================================================== -->

    <footer
      v-if="sortedOptions.length"
      class="poll-results__footer"
    >

      <span>
        🗳️
      </span>

      <strong>
        {{ totalVotes }}
      </strong>

      <span>
        vote{{
          totalVotes > 1
            ? "s"
            : ""
        }}
        au total
      </span>

    </footer>

  </section>

</template>


<style scoped>

/* =========================================================
   CONTAINER
========================================================= */

.poll-results {
  width:
    min(
      1200px,
      100%
    );

  margin:
    45px
    auto
    0;

  padding:
    clamp(
      26px,
      4vw,
      45px
    );

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    28px;

  background:
    linear-gradient(
      145deg,
      rgba(109, 0, 163, 0.08),
      var(--surface-background-secondary)
    );

  box-shadow:
    0
    16px
    38px
    rgba(0, 0, 0, 0.16);
}


/* =========================================================
   HEADER
========================================================= */

.poll-results__header {
  max-width:
    720px;

  margin:
    0
    auto
    30px;

  text-align:
    center;
}


.poll-results__eyebrow {
  display:
    inline-block;

  margin-bottom:
    8px;

  color:
    var(--color-cyan);

  font-size:
    0.68rem;

  font-weight:
    900;

  letter-spacing:
    0.14em;

  text-transform:
    uppercase;
}


.poll-results__title {
  margin:
    0
    0
    12px;

  color:
    var(--text-primary);

  font-size:
    clamp(
      2rem,
      4vw,
      3.2rem
    );
}


.poll-results__title span {
  color:
    var(--color-pink);
}


.poll-results__description {
  margin:
    0;

  color:
    var(--text-secondary);

  font-size:
    0.92rem;

  line-height:
    1.65;
}


/* =========================================================
   EMPTY
========================================================= */

.poll-results__empty {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  min-height:
    220px;

  color:
    var(--text-secondary);

  text-align:
    center;
}


.poll-results__empty > span {
  margin-bottom:
    12px;

  font-size:
    2.5rem;
}


.poll-results__empty strong {
  margin-bottom:
    6px;

  color:
    var(--text-primary);

  font-size:
    1.2rem;
}


.poll-results__empty p {
  margin:
    0;

  font-size:
    0.85rem;

  line-height:
    1.6;
}


/* =========================================================
   WINNER
========================================================= */

.poll-results__winner {
  display:
    grid;

  grid-template-columns:
    180px
    minmax(
      0,
      1fr
    );

  align-items:
    center;

  gap:
    28px;

  margin-bottom:
    30px;

  padding:
    22px;

  border:
    1px
    solid
    rgba(242, 34, 146, 0.35);

  border-radius:
    22px;

  background:
    linear-gradient(
      135deg,
      rgba(109, 0, 163, 0.16),
      rgba(242, 34, 146, 0.08)
    );

  box-shadow:
    0
    14px
    32px
    rgba(242, 34, 146, 0.08);
}


/* =========================================================
   WINNER IMAGE
========================================================= */

.poll-results__winner-image {
  position:
    relative;

  width:
    180px;

  aspect-ratio:
    16 / 9;

  overflow:
    hidden;

  border-radius:
    16px;

  background:
    rgba(255, 255, 255, 0.04);
}


.poll-results__winner-image img {
  display:
    block;

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;
}


.poll-results__winner-placeholder {
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
    3rem;
}


.poll-results__winner-crown {
  position:
    absolute;

  top:
    8px;

  right:
    8px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    34px;

  height:
    34px;

  border-radius:
    50%;

  background:
    rgba(10, 3, 18, 0.82);

  font-size:
    1rem;
}


/* =========================================================
   WINNER CONTENT
========================================================= */

.poll-results__winner-label {
  display:
    inline-flex;

  margin-bottom:
    6px;

  color:
    var(--color-cyan);

  font-size:
    0.67rem;

  font-weight:
    900;

  letter-spacing:
    0.1em;

  text-transform:
    uppercase;
}


.poll-results__winner-content h3 {
  margin:
    0
    0
    14px;

  color:
    var(--text-primary);

  font-size:
    clamp(
      1.6rem,
      3vw,
      2.4rem
    );
}


.poll-results__winner-stats {
  display:
    flex;

  align-items:
    baseline;

  gap:
    10px;

  margin-bottom:
    10px;
}


.poll-results__winner-stats strong {
  color:
    var(--color-pink);

  font-size:
    1.5rem;
}


.poll-results__winner-stats span {
  color:
    var(--text-muted);

  font-size:
    0.8rem;

  font-weight:
    800;
}


/* =========================================================
   WINNER PROGRESS
========================================================= */

.poll-results__winner-progress {
  width:
    100%;

  height:
    8px;

  overflow:
    hidden;

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.07);
}


.poll-results__winner-progress-value {
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

  transition:
    width
    0.45s
    ease;
}


/* =========================================================
   LIST
========================================================= */

.poll-results__list {
  display:
    flex;

  flex-direction:
    column;

  gap:
    10px;
}


/* =========================================================
   ROW
========================================================= */

.poll-results__row {
  display:
    grid;

  grid-template-columns:
    55px
    72px
    minmax(
      0,
      1fr
    )
    auto;

  align-items:
    center;

  gap:
    15px;

  padding:
    14px
    16px;

  border:
    1px
    solid
    var(--border-primary);

  border-radius:
    17px;

  background:
    var(--surface-background);

  transition:
    transform
    0.2s
    ease,
    border-color
    0.2s
    ease;
}


.poll-results__row:hover {
  transform:
    translateX(
      4px
    );

  border-color:
    rgba(242, 34, 146, 0.36);
}


.poll-results__row--winner {
  border-color:
    rgba(34, 242, 239, 0.36);
}


/* =========================================================
   RANK
========================================================= */

.poll-results__rank {
  color:
    var(--text-primary);

  font-size:
    1.1rem;

  font-weight:
    900;

  text-align:
    center;
}


/* =========================================================
   GAME IMAGE
========================================================= */

.poll-results__game-image {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    72px;

  height:
    46px;

  overflow:
    hidden;

  border-radius:
    10px;

  background:
    rgba(255, 255, 255, 0.04);
}


.poll-results__game-image img {
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
   GAME
========================================================= */

.poll-results__game {
  min-width:
    0;
}


.poll-results__game strong {
  display:
    block;

  margin-bottom:
    7px;

  overflow:
    hidden;

  color:
    var(--text-primary);

  font-size:
    0.9rem;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}


/* =========================================================
   BAR
========================================================= */

.poll-results__bar {
  width:
    100%;

  height:
    6px;

  overflow:
    hidden;

  border-radius:
    999px;

  background:
    rgba(255, 255, 255, 0.07);
}


.poll-results__bar-value {
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

  transition:
    width
    0.4s
    ease;
}


/* =========================================================
   STATS
========================================================= */

.poll-results__stats {
  display:
    flex;

  flex-direction:
    column;

  align-items:
    flex-end;

  min-width:
    70px;
}


.poll-results__stats strong {
  color:
    var(--color-pink);

  font-size:
    0.95rem;
}


.poll-results__stats span {
  color:
    var(--text-muted);

  font-size:
    0.7rem;

  font-weight:
    800;
}


/* =========================================================
   FOOTER
========================================================= */

.poll-results__footer {
  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    6px;

  margin-top:
    24px;

  padding-top:
    18px;

  border-top:
    1px
    solid
    var(--border-primary);

  color:
    var(--text-muted);

  font-size:
    0.78rem;
}


.poll-results__footer strong {
  color:
    var(--color-pink);
}


/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width:
    700px
) {

  .poll-results {
    padding:
      22px
      14px;

    border-radius:
      22px;
  }


  .poll-results__winner {
    grid-template-columns:
      1fr;

    gap:
      18px;
  }


  .poll-results__winner-image {
    width:
      100%;

    max-width:
      420px;

    margin:
      0
      auto;
  }


  .poll-results__winner-content {
    text-align:
      center;
  }


  .poll-results__winner-stats {
    justify-content:
      center;
  }


  .poll-results__row {
    grid-template-columns:
      42px
      56px
      minmax(
        0,
        1fr
      );

    gap:
      10px;
  }


  .poll-results__game-image {
    width:
      56px;

    height:
      40px;
  }


  .poll-results__stats {
    grid-column:
      2
      /
      -1;

    flex-direction:
      row;

    align-items:
      center;

    justify-content:
      flex-end;

    gap:
      8px;
  }

}

</style>