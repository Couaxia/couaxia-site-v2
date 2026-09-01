<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";

import Annexes from "./Annexes.vue";
import { chapters } from "./story.data";

import type {
  StoryAnnexe
} from "./story.types";

/* =========================================================
   FLATTEN STORY
========================================================= */

const allPages = computed(() =>
  chapters.flatMap((chapter, chapterIndex) =>
    chapter.pages.map((page, pageIndex) => ({
      ...page,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      chapterSubtitle: chapter.subtitle,
      chapterIcon: chapter.icon,
      chapterIndex,
      pageIndex,
      pageCount: chapter.pages.length
    }))
  )
);

/* =========================================================
   STATE
========================================================= */
const currentPageIndex = ref(0);
const displayedPageIndex = ref(0);
const targetPageIndex = ref(0);
const turning = ref(false);
const turnDirection = ref<"next" | "previous">("next");
const selectedAnnexe = ref<StoryAnnexe | null>(null);

let mascotHoverTimer: number | null = null;

/* =========================================================
   COMPUTED
========================================================= */

const currentPage = computed(() =>
  allPages.value[displayedPageIndex.value] ?? allPages.value[0]!
);

const targetPage = computed(() =>
  allPages.value[targetPageIndex.value] ?? currentPage.value
);

const currentChapter = computed(() =>
  chapters[currentPage.value.chapterIndex] ?? chapters[0]!
);

const canGoPrevious = computed(() =>
  currentPageIndex.value > 0
);

const canGoNext = computed(() =>
  currentPageIndex.value < allPages.value.length - 1
);

const progress = computed(() => {
  if (allPages.value.length === 0) {
    return 0;
  }

  return (
    (currentPageIndex.value + 1)
    /
    allPages.value.length
  ) * 100;
});

/* =========================================================
   MASCOT
========================================================= */

const bookMessages = [
  "Bienvenue dans mon histoire complète. 📖",
  "Chaque chapitre peut contenir plusieurs pages.",
  "Utilise les flèches pour tourner les pages comme dans un vrai livre.",
  "Tu peux aussi choisir directement un chapitre en haut du livre.",
  "Installe-toi confortablement... il y a un peu de lecture. 💜"
];

function getRandomMessage(messages: string[]): string {
  if (messages.length === 0) {
    return "";
  }

  return messages[
    Math.floor(
      Math.random() * messages.length
    )
  ] ?? "";
}

function sendMascotMessage(message: string) {
  if (!message.trim()) {
    return;
  }

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

function startMascotHover(messages: string[]) {
  stopMascotHover();

  mascotHoverTimer = window.setTimeout(
    () => {
      sendMascotMessage(
        getRandomMessage(messages)
      );

      mascotHoverTimer = null;
    },
    400
  );
}

function stopMascotHover() {
  if (mascotHoverTimer === null) {
    return;
  }

  window.clearTimeout(
    mascotHoverTimer
  );

  mascotHoverTimer = null;
}

function speakAboutCurrentPage() {
  startMascotHover(
    currentPage.value.messages
  );
}

function speakAboutNextPage() {
  if (!canGoNext.value) {
    return;
  }

  const next =
    allPages.value[
      currentPageIndex.value + 1
    ];

  if (!next) {
    return;
  }

  startMascotHover([
    next.chapterId !== currentPage.value.chapterId
      ? `Le prochain chapitre est « ${next.chapterTitle} ». 📖`
      : "On continue ce chapitre ?",
    "Tourne la page pour découvrir la suite. 👀",
    "Encore une petite page !",
    `Page suivante : ${next.title ?? next.chapterTitle}.`
  ]);
}

function speakAboutPreviousPage() {
  if (!canGoPrevious.value) {
    return;
  }

  startMascotHover([
    "Tu veux relire le passage précédent ?",
    "Retour à la page précédente. 📖",
    "On remonte un peu dans l’histoire.",
    "Besoin de vérifier quelque chose ? 👀"
  ]);
}

/* =========================================================
   PAGE TURN
========================================================= */

async function turnPage(
  direction:
    | "next"
    | "previous"
) {
  if (
    turning.value
    ||
    selectedAnnexe.value
  ) {
    return;
  }

  if (
    direction === "next"
    &&
    !canGoNext.value
  ) {
    return;
  }

  if (
    direction === "previous"
    &&
    !canGoPrevious.value
  ) {
    return;
  }

  turnDirection.value =
    direction;

  targetPageIndex.value =
    direction === "next"
      ? currentPageIndex.value + 1
      : currentPageIndex.value - 1;

  turning.value = true;

  await nextTick();

  window.setTimeout(
    () => {
      displayedPageIndex.value =
        targetPageIndex.value;
    },
    460
  );

  window.setTimeout(
    () => {
      currentPageIndex.value =
        targetPageIndex.value;

      displayedPageIndex.value =
        currentPageIndex.value;

      turning.value = false;

      sendMascotMessage(
        getRandomMessage(
          currentPage.value.messages
        )
      );
    },
    920
  );
}

function goToChapter(
  chapterIndex: number
) {
  if (
    turning.value
    ||
    selectedAnnexe.value
  ) {
    return;
  }

  const target =
    allPages.value.findIndex(
      page =>
        page.chapterIndex ===
        chapterIndex
    );

  if (
    target === -1
    ||
    target === currentPageIndex.value
  ) {
    return;
  }

  targetPageIndex.value =
    target;

  turnDirection.value =
    target > currentPageIndex.value
      ? "next"
      : "previous";

  turning.value = true;

  window.setTimeout(
    () => {
      displayedPageIndex.value =
        target;
    },
    460
  );

  window.setTimeout(
    () => {
      currentPageIndex.value =
        target;

      displayedPageIndex.value =
        target;

      turning.value =
        false;

      const chapter =
        chapters[
          chapterIndex
        ];

      if (chapter) {
        sendMascotMessage(
          `Bienvenue au chapitre ${chapter.number} : ${chapter.title}. 📖`
        );
      }
    },
    920
  );
}

/* =========================================================
   ANNEXES
========================================================= */

function openAnnexe(
  annexe: StoryAnnexe
) {
  if (turning.value) {
    return;
  }

  stopMascotHover();

  selectedAnnexe.value =
    annexe;
}

function closeAnnexe() {
  selectedAnnexe.value =
    null;
}

/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(
  event: KeyboardEvent
) {
  if (selectedAnnexe.value) {
    return;
  }

  if (event.key === "ArrowRight") {
    turnPage("next");
    return;
  }

  if (event.key === "ArrowLeft") {
    turnPage("previous");
  }
}

onMounted(() => {
  window.addEventListener(
    "keydown",
    handleKeydown
  );
});

onBeforeUnmount(() => {
  stopMascotHover();

  window.removeEventListener(
    "keydown",
    handleKeydown
  );
});
</script>


<template>

  <section
    id="history-book"
    class="history-storybook"
    aria-labelledby="history-storybook-title"
  >

    <!-- =================================================
         HEADER
    ================================================== -->

    <header
      class="history-storybook__header"
      tabindex="0"
      @mouseenter="startMascotHover(bookMessages)"
      @mouseleave="stopMascotHover"
      @focus="startMascotHover(bookMessages)"
      @blur="stopMascotHover"
    >

      <p class="history-storybook__eyebrow">
        L’HISTOIRE COMPLÈTE
      </p>

      <h2
        id="history-storybook-title"
        class="history-storybook__title"
      >
        Tourne les pages de

        <span>
          mon histoire
        </span>
      </h2>

      <p class="history-storybook__description">
        Découvre l’histoire de Couaxia chapitre
        après chapitre, comme si tu parcourais
        réellement les pages d’un livre.
      </p>

    </header>


    <!-- =================================================
         CHAPTER NAVIGATION
    ================================================== -->

    <nav
      class="history-storybook__chapters"
      aria-label="Chapitres de l'histoire"
    >

      <button
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        type="button"
        class="history-storybook__chapter-button"
        :class="{
          'history-storybook__chapter-button--active':
            index === currentPage.chapterIndex
        }"
        :disabled="turning"
        @click="goToChapter(index)"
        @mouseenter="
          startMascotHover([
            `Chapitre ${chapter.number} : ${chapter.title}`,
            chapter.subtitle,
            `Tu veux aller directement à « ${chapter.title} » ? 📖`
          ])
        "
        @mouseleave="stopMascotHover"
        @focus="
          startMascotHover([
            `Chapitre ${chapter.number} : ${chapter.title}`,
            chapter.subtitle
          ])
        "
        @blur="stopMascotHover"
      >

        <span
          class="history-storybook__chapter-icon"
          aria-hidden="true"
        >
          {{ chapter.icon }}
        </span>

        <span class="history-storybook__chapter-info">

          <small>
            Chapitre {{ chapter.number }}
          </small>

          <strong>
            {{ chapter.title }}
          </strong>

        </span>

      </button>

    </nav>


    <!-- =================================================
         PROGRESS
    ================================================== -->

    <div class="history-storybook__progress">

      <div class="history-storybook__progress-track">

        <div
          class="history-storybook__progress-value"
          :style="{
            width:
              `${progress}%`
          }"
        ></div>

      </div>

      <span class="history-storybook__progress-text">
        {{ currentPageIndex + 1 }}
        /
        {{ allPages.length }}
        pages
      </span>

    </div>


    <!-- =================================================
         ANNEXES
    ================================================== -->

    <div
      v-if="currentChapter.annexes?.length"
      class="history-storybook__annexes"
    >

      <span class="history-storybook__annexes-label">
        📎 Annexes disponibles
      </span>

      <button
        v-for="annexe in currentChapter.annexes"
        :key="annexe.id"
        type="button"
        class="history-storybook__annexe-button"
        :disabled="turning"
        @mouseenter="startMascotHover(annexe.messages)"
        @mouseleave="stopMascotHover"
        @focus="startMascotHover(annexe.messages)"
        @blur="stopMascotHover"
        @click="openAnnexe(annexe)"
      >

        <span
          class="history-storybook__annexe-icon"
          aria-hidden="true"
        >
          {{ annexe.icon }}
        </span>

        <span class="history-storybook__annexe-content">

          <small>
            Annexe {{ annexe.number }}
          </small>

          <strong>
            {{ annexe.title }}
          </strong>

        </span>

        <span
          class="history-storybook__annexe-arrow"
          aria-hidden="true"
        >
          ↗
        </span>

      </button>

    </div>


    <!-- =================================================
         BOOK
    ================================================== -->

    <div class="history-storybook__scene">

      <div class="history-storybook__book">

        <!-- LEFT PAGE -->

        <article
          class="
            history-storybook__page
            history-storybook__page--left
          "
          tabindex="0"
          @mouseenter="speakAboutCurrentPage"
          @mouseleave="stopMascotHover"
          @focus="speakAboutCurrentPage"
          @blur="stopMascotHover"
        >

          <div class="history-storybook__page-inner">

            <div class="history-storybook__chapter-heading">

              <span class="history-storybook__chapter-number">
                CHAPITRE
                {{ currentPage.chapterNumber }}
              </span>

              <span class="history-storybook__chapter-page">
                {{ currentPage.pageIndex + 1 }}
                /
                {{ currentPage.pageCount }}
              </span>

            </div>

            <p class="history-storybook__page-subtitle">
              {{
                currentPage.subtitle
                ??
                currentPage.chapterSubtitle
              }}
            </p>

            <h3 class="history-storybook__page-title">
              {{
                currentPage.title
                ??
                currentPage.chapterTitle
              }}
            </h3>

            <div
              v-if="currentPage.image"
              class="history-storybook__illustration"
            >

              <div
                class="history-storybook__illustration-glow"
                aria-hidden="true"
              ></div>

              <img
                :src="currentPage.image"
                :alt="
                  currentPage.imageAlt
                  ??
                  currentPage.title
                  ??
                  currentPage.chapterTitle
                "
                class="history-storybook__image"
              >

            </div>

            <div
              v-else
              class="history-storybook__chapter-decoration"
              aria-hidden="true"
            >
              <span>
                {{ currentPage.chapterIcon }}
              </span>

              <span>
                ✦
              </span>
            </div>

            <span class="history-storybook__paper-number">
              {{
                currentPageIndex
                *
                2
                +
                1
              }}
            </span>

          </div>

        </article>


        <!-- SPINE -->

        <div
          class="history-storybook__spine"
          aria-hidden="true"
        ></div>


        <!-- RIGHT PAGE -->

        <article
          class="
            history-storybook__page
            history-storybook__page--right
          "
          tabindex="0"
          @mouseenter="speakAboutCurrentPage"
          @mouseleave="stopMascotHover"
          @focus="speakAboutCurrentPage"
          @blur="stopMascotHover"
        >

          <div class="history-storybook__page-inner">

            <div class="history-storybook__text">

              <template
                v-for="(block, index) in currentPage.content"
                :key="`${currentPage.id}-${index}`"
              >

                <p
                  v-if="block.type === 'text'"
                  class="history-storybook__paragraph"
                >
                  {{ block.text }}
                </p>

                <p
                  v-else-if="block.type === 'important'"
                  class="history-storybook__important"
                >
                  {{ block.text }}
                </p>

                <div
                  v-else
                  class="history-storybook__dialogue"
                  :class="[
                    `history-storybook__dialogue--${block.character}`
                  ]"
                >

                  <span class="history-storybook__dialogue-name">
                    {{ block.name }}
                  </span>

                  <p
                    v-for="(line, lineIndex) in block.lines"
                    :key="
                      `${currentPage.id}-${index}-${lineIndex}`
                    "
                  >
                    {{ line }}
                  </p>

                </div>

              </template>

            </div>

            <span class="history-storybook__paper-number">
              {{
                currentPageIndex
                *
                2
                +
                2
              }}
            </span>

          </div>

        </article>


        <!-- TURNING SHEET -->

        <div
          v-if="turning"
          class="history-storybook__sheet"
          :class="[
            `history-storybook__sheet--${turnDirection}`
          ]"
          aria-hidden="true"
        >

          <div
            class="
              history-storybook__sheet-face
              history-storybook__sheet-face--front
            "
          >

            <div class="history-storybook__sheet-content">

              <small>
                Chapitre
                {{ currentPage.chapterNumber }}
              </small>

              <strong>
                {{
                  currentPage.title
                  ??
                  currentPage.chapterTitle
                }}
              </strong>

              <span>
                {{ currentPage.chapterTitle }}
              </span>

            </div>

          </div>

          <div
            class="
              history-storybook__sheet-face
              history-storybook__sheet-face--back
            "
          >

            <div class="history-storybook__sheet-content">

              <small>
                Chapitre
                {{ targetPage.chapterNumber }}
              </small>

              <strong>
                {{
                  targetPage.title
                  ??
                  targetPage.chapterTitle
                }}
              </strong>

              <span>
                {{ targetPage.chapterTitle }}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>


    <!-- =================================================
         NAVIGATION
    ================================================== -->

    <nav
      class="history-storybook__navigation"
      aria-label="Navigation dans l'histoire"
    >

      <button
        type="button"
        class="
          history-storybook__nav-button
          history-storybook__nav-button--previous
        "
        :disabled="
          !canGoPrevious
          ||
          turning
        "
        @mouseenter="speakAboutPreviousPage"
        @mouseleave="stopMascotHover"
        @focus="speakAboutPreviousPage"
        @blur="stopMascotHover"
        @click="turnPage('previous')"
      >
        <span aria-hidden="true">
          ←
        </span>

        <span>
          Page précédente
        </span>
      </button>

      <div class="history-storybook__current">

        <span>
          Chapitre
          {{ currentChapter.number }}
        </span>

        <strong>
          {{ currentChapter.title }}
        </strong>

        <small>
          Page
          {{ currentPage.pageIndex + 1 }}
          sur
          {{ currentPage.pageCount }}
        </small>

      </div>

      <button
        type="button"
        class="
          history-storybook__nav-button
          history-storybook__nav-button--next
        "
        :disabled="
          !canGoNext
          ||
          turning
        "
        @mouseenter="speakAboutNextPage"
        @mouseleave="stopMascotHover"
        @focus="speakAboutNextPage"
        @blur="stopMascotHover"
        @click="turnPage('next')"
      >
        <span>
          Page suivante
        </span>

        <span aria-hidden="true">
          →
        </span>
      </button>

    </nav>

    <p class="history-storybook__keyboard">
      <span aria-hidden="true">
        ⌨️
      </span>

      Tu peux aussi utiliser

      <kbd>
        ←
      </kbd>

      et

      <kbd>
        →
      </kbd>

      pour tourner les pages.
    </p>


    <!-- =================================================
         ANNEXE LIGHTBOX
    ================================================== -->

    <Annexes
      v-if="selectedAnnexe"
      :annexe="selectedAnnexe"
      @close="closeAnnexe"
    />

  </section>

</template>
