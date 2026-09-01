<script setup lang="ts">

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";

import type {
  StoryAnnexe
} from "./story.types";


/* =========================================================
   PROPS
========================================================= */

const props =
  defineProps<{
    annexe:
      StoryAnnexe;
  }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
  defineEmits<{
    close:
      [];
  }>();


/* =========================================================
   PAGES
========================================================= */

const currentPageIndex =
  ref(0);

const displayedPageIndex =
  ref(0);

const targetPageIndex =
  ref(0);

const turning =
  ref(false);

const turnDirection =
  ref<"next" | "previous">(
    "next"
  );


/* =========================================================
   SCROLL DU TEXTE
========================================================= */

/*
 * Référence directe vers la zone
 * scrollable de la page droite.
 */
const annexeTextRef =
  ref<HTMLElement | null>(
    null
  );


/**
 * Remet systématiquement le texte
 * tout en haut de la page.
 */
async function resetAnnexeScroll() {

  /*
   * On attend que Vue ait terminé
   * d'afficher le nouveau contenu.
   */
  await nextTick();

  const textElement =
    annexeTextRef.value;

  if (!textElement) {
    return;
  }

  /*
   * On remet immédiatement
   * la scrollbar en haut.
   */
  textElement.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

}


/* =========================================================
   MASCOT
========================================================= */

let mascotHoverTimer:
  number | null =
  null;


/* =========================================================
   CURRENT PAGE
========================================================= */

const currentPage =
  computed(() =>

    props.annexe.pages[
      displayedPageIndex.value
    ]

    ??

    props.annexe.pages[0]

  );


/* =========================================================
   TARGET PAGE
========================================================= */

const targetPage =
  computed(() =>

    props.annexe.pages[
      targetPageIndex.value
    ]

    ??

    currentPage.value

  );


/* =========================================================
   TOTAL PAGES
========================================================= */

const totalPages =
  computed(() =>

    props.annexe.pages.length

  );


/* =========================================================
   PREVIOUS / NEXT
========================================================= */

const canGoPrevious =
  computed(() =>

    currentPageIndex.value > 0

  );


const canGoNext =
  computed(() =>

    currentPageIndex.value
    <
    totalPages.value - 1

  );


/* =========================================================
   RANDOM MASCOT MESSAGE
========================================================= */

function getRandomMessage(
  messages:
    string[]
):
  string {

  if (messages.length === 0) {
    return "";
  }

  return messages[
    Math.floor(
      Math.random()
      *
      messages.length
    )
  ] ?? "";

}


/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
  message:
    string
) {

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


/* =========================================================
   START MASCOT HOVER
========================================================= */

function startMascotHover(
  messages:
    string[]
) {

  stopMascotHover();

  mascotHoverTimer =
    window.setTimeout(

      () => {

        sendMascotMessage(

          getRandomMessage(
            messages
          )

        );

        mascotHoverTimer =
          null;

      },

      350

    );

}


/* =========================================================
   STOP MASCOT HOVER
========================================================= */

function stopMascotHover() {

  if (
    mascotHoverTimer === null
  ) {
    return;
  }

  window.clearTimeout(
    mascotHoverTimer
  );

  mascotHoverTimer =
    null;

}


/* =========================================================
   PAGE TURN
========================================================= */

async function turnPage(
  direction:
    | "next"
    | "previous"
) {

  /*
   * Empêche plusieurs animations
   * simultanées.
   */
  if (turning.value) {
    return;
  }


  /*
   * Impossible d'aller après
   * la dernière page.
   */
  if (
    direction === "next"
    &&
    !canGoNext.value
  ) {
    return;
  }


  /*
   * Impossible d'aller avant
   * la première page.
   */
  if (
    direction === "previous"
    &&
    !canGoPrevious.value
  ) {
    return;
  }


  /* Direction de l'animation */

  turnDirection.value =
    direction;


  /* Page cible */

  targetPageIndex.value =

    direction === "next"

      ? currentPageIndex.value + 1

      : currentPageIndex.value - 1;


  turning.value =
    true;


  await nextTick();


  /*
   * À la moitié de l'animation,
   * on remplace le contenu.
   */
  window.setTimeout(

    () => {

      displayedPageIndex.value =
        targetPageIndex.value;

    },

    460

  );


  /*
   * Fin de l'animation.
   */
  window.setTimeout(

    () => {

      currentPageIndex.value =
        targetPageIndex.value;


      displayedPageIndex.value =
        currentPageIndex.value;


      turning.value =
        false;


      sendMascotMessage(

        getRandomMessage(
          props.annexe.messages
        )

      );

    },

    920

  );

}


/* =========================================================
   RESET SCROLL À CHAQUE NOUVELLE PAGE
========================================================= */

/*
 * displayedPageIndex change exactement
 * lorsque le nouveau contenu est affiché.
 *
 * Dès qu'il change :
 *
 * page suivante
 *      ↓
 * nouveau contenu
 *      ↓
 * scroll tout en haut
 */
watch(

  displayedPageIndex,

  async () => {

    await resetAnnexeScroll();

  }

);


/* =========================================================
   CLOSE ANNEXE
========================================================= */

function closeAnnexe() {

  if (turning.value) {
    return;
  }

  stopMascotHover();

  emit(
    "close"
  );

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(
  event:
    KeyboardEvent
) {

  if (
    event.key === "Escape"
  ) {

    closeAnnexe();

    return;

  }


  if (
    event.key === "ArrowRight"
  ) {

    turnPage(
      "next"
    );

    return;

  }


  if (
    event.key === "ArrowLeft"
  ) {

    turnPage(
      "previous"
    );

  }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
  async () => {

    /*
     * Empêche la page derrière
     * la lightbox de défiler.
     */
    document.body.style.overflow =
      "hidden";


    /*
     * Navigation clavier.
     */
    window.addEventListener(
      "keydown",
      handleKeydown
    );


    /*
     * La première page commence
     * également toujours tout en haut.
     */
    await resetAnnexeScroll();


    /*
     * Message de la mascotte
     * à l'ouverture.
     */
    sendMascotMessage(

      getRandomMessage(
        props.annexe.messages
      )

    );

  }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
  () => {

    stopMascotHover();


    window.removeEventListener(
      "keydown",
      handleKeydown
    );


    /*
     * Réactive le scroll
     * de la page derrière.
     */
    document.body.style.overflow =
      "";

  }
);

</script>


<template>

  <Teleport to="body">

    <Transition
      name="history-annexe-book"
      appear
    >

      <!-- =================================================
           LIGHTBOX
      ================================================== -->

      <div
        class="history-annexe-book-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="
          `Annexe ${annexe.number} — ${annexe.title}`
        "
        @click.self="closeAnnexe"
      >


        <!-- =================================================
             WRAPPER
        ================================================== -->

        <div
          class="history-annexe-book-wrapper"
          tabindex="0"

          @mouseenter="
            startMascotHover(
              annexe.messages
            )
          "

          @mouseleave="
            stopMascotHover
          "

          @focus="
            startMascotHover(
              annexe.messages
            )
          "

          @blur="
            stopMascotHover
          "
        >


          <!-- =================================================
               CLOSE
          ================================================== -->

          <button
            type="button"
            class="history-annexe-book__close"
            aria-label="Fermer l’annexe"
            @click="closeAnnexe"
          >
            ×
          </button>


          <!-- =================================================
               ANNEXE HEADER
          ================================================== -->

          <div
            class="history-annexe-book__top"
          >

            <span
              aria-hidden="true"
            >
              {{ annexe.icon }}
            </span>


            <div>

              <small>
                ANNEXE
                {{ annexe.number }}
              </small>

              <strong>
                {{ annexe.title }}
              </strong>

            </div>

          </div>


          <!-- =================================================
               BOOK SCENE
          ================================================== -->

          <div
            class="history-annexe-book__scene"
          >

            <div
              class="history-annexe-book__book"
            >


              <!-- =================================================
                   LEFT PAGE
              ================================================== -->

              <article
                v-if="currentPage"
                class="
                  history-annexe-book__page
                  history-annexe-book__page--left
                "
              >

                <div
                  class="
                    history-annexe-book__page-inner
                  "
                >


                  <!-- ANNEXE NUMBER -->

                  <span
                    class="
                      history-annexe-book__number
                    "
                  >
                    ANNEXE
                    {{ annexe.number }}
                  </span>


                  <!-- SUBTITLE -->

                  <p
                    class="
                      history-annexe-book__subtitle
                    "
                  >
                    {{
                      currentPage.subtitle
                      ??
                      annexe.subtitle
                    }}
                  </p>


                  <!-- TITLE -->

                  <h3
                    class="
                      history-annexe-book__title
                    "
                  >
                    {{
                      currentPage.title
                      ??
                      annexe.title
                    }}
                  </h3>


                  <!-- =================================================
                       IMAGE
                  ================================================== -->

                  <div
                    v-if="currentPage.image"
                    class="
                      history-annexe-book__illustration
                    "
                  >

                    <div
                      class="
                        history-annexe-book__image-glow
                      "
                      aria-hidden="true"
                    ></div>


                    <img
                      :src="
                        currentPage.image
                      "

                      :alt="
                        currentPage.imageAlt
                        ??
                        currentPage.title
                        ??
                        annexe.title
                      "

                      class="
                        history-annexe-book__image
                      "
                    >

                  </div>


                  <!-- =================================================
                       DECORATION
                  ================================================== -->

                  <div
                    v-else
                    class="
                      history-annexe-book__decoration
                    "
                    aria-hidden="true"
                  >

                    <span>
                      {{ annexe.icon }}
                    </span>

                    <span>
                      ✦
                    </span>

                  </div>


                  <!-- PAGE NUMBER -->

                  <span
                    class="
                      history-annexe-book__paper-number
                    "
                  >
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


              <!-- =================================================
                   SPINE
              ================================================== -->

              <div
                class="
                  history-annexe-book__spine
                "
                aria-hidden="true"
              ></div>


              <!-- =================================================
                   RIGHT PAGE
              ================================================== -->

              <article
                v-if="currentPage"
                class="
                  history-annexe-book__page
                  history-annexe-book__page--right
                "
              >

                <div
                  class="
                    history-annexe-book__page-inner
                  "
                >


                  <!-- =================================================
                       TEXT
                  ================================================== -->

                  <div
                    ref="annexeTextRef"
                    class="
                      history-annexe-book__text
                    "
                  >


                    <template
                      v-for="
                        (block, index)
                        in
                        currentPage.content
                      "

                      :key="
                        `${currentPage.id}-${index}`
                      "
                    >


                      <!-- TEXT -->

                      <p
                        v-if="
                          block.type === 'text'
                        "

                        class="
                          history-annexe-book__paragraph
                        "
                      >
                        {{ block.text }}
                      </p>


                      <!-- IMPORTANT -->

                      <p
                        v-else-if="
                          block.type === 'important'
                        "

                        class="
                          history-annexe-book__important
                        "
                      >
                        {{ block.text }}
                      </p>


                      <!-- DIALOGUE -->

                      <div
                        v-else

                        class="
                          history-annexe-book__dialogue
                        "

                        :class="[
                          `history-annexe-book__dialogue--${block.character}`
                        ]"
                      >


                        <span
                          class="
                            history-annexe-book__dialogue-name
                          "
                        >
                          {{ block.name }}
                        </span>


                        <p
                          v-for="
                            (
                              line,
                              lineIndex
                            )
                            in
                            block.lines
                          "

                          :key="
                            `${currentPage.id}-${index}-${lineIndex}`
                          "
                        >
                          {{ line }}
                        </p>


                      </div>


                    </template>


                  </div>


                  <!-- PAGE NUMBER -->

                  <span
                    class="
                      history-annexe-book__paper-number
                    "
                  >
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


              <!-- =================================================
                   TURNING SHEET
              ================================================== -->

              <div
                v-if="
                  turning
                  &&
                  currentPage
                  &&
                  targetPage
                "

                class="
                  history-annexe-book__sheet
                "

                :class="[
                  `history-annexe-book__sheet--${turnDirection}`
                ]"

                aria-hidden="true"
              >


                <!-- FRONT -->

                <div
                  class="
                    history-annexe-book__sheet-face
                    history-annexe-book__sheet-face--front
                  "
                >

                  <div
                    class="
                      history-annexe-book__sheet-content
                    "
                  >

                    <small>
                      ANNEXE
                      {{ annexe.number }}
                    </small>


                    <strong>
                      {{
                        currentPage.title
                        ??
                        annexe.title
                      }}
                    </strong>

                  </div>

                </div>


                <!-- BACK -->

                <div
                  class="
                    history-annexe-book__sheet-face
                    history-annexe-book__sheet-face--back
                  "
                >

                  <div
                    class="
                      history-annexe-book__sheet-content
                    "
                  >

                    <small>
                      ANNEXE
                      {{ annexe.number }}
                    </small>


                    <strong>
                      {{
                        targetPage.title
                        ??
                        annexe.title
                      }}
                    </strong>

                  </div>

                </div>


              </div>


            </div>

          </div>


          <!-- =================================================
               NAVIGATION
          ================================================== -->

          <nav
            class="
              history-annexe-book__navigation
            "
            aria-label="
              Navigation dans l’annexe
            "
          >


            <!-- PREVIOUS -->

            <button
              type="button"

              class="
                history-annexe-book__nav-button
                history-annexe-book__nav-button--previous
              "

              :disabled="
                !canGoPrevious
                ||
                turning
              "

              @click="
                turnPage('previous')
              "
            >

              <span
                aria-hidden="true"
              >
                ←
              </span>

              <span>
                Page précédente
              </span>

            </button>


            <!-- PAGINATION -->

            <div
              class="
                history-annexe-book__pagination
              "
            >

              <span>
                Page
              </span>

              <strong>
                {{ currentPageIndex + 1 }}
              </strong>

              <span>
                /
              </span>

              <strong>
                {{ totalPages }}
              </strong>

            </div>


            <!-- NEXT -->

            <button
              type="button"

              class="
                history-annexe-book__nav-button
                history-annexe-book__nav-button--next
              "

              :disabled="
                !canGoNext
                ||
                turning
              "

              @click="
                turnPage('next')
              "
            >

              <span>
                Page suivante
              </span>

              <span
                aria-hidden="true"
              >
                →
              </span>

            </button>


          </nav>


        </div>

      </div>


    </Transition>

  </Teleport>

</template>