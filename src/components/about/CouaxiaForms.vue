<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

type AppearanceStatus =
    | "hidden"
    | "current"
    | "upcoming"
    | "normal";


interface CouaxiaAppearance {

    id: string;

    name: string;

    subtitle: string;

    description: string;

    image: string | null;

    imageAlt: string;

    status: AppearanceStatus;

    badge?: string;

    messages: string[];

}


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
    null;


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages: string[]
): string {

    if (
        !messages
        ||
        messages.length === 0
    ) {

        return "";

    }


    const randomIndex =
        Math.floor(
            Math.random()
            *
            messages.length
        );


    return (
        messages[randomIndex]
        ??
        ""
    );

}


/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
    message: string
) {

    if (
        !message.trim()
    ) {

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
   START HOVER
========================================================= */

function startMascotHover(
    messages: string[]
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
            400
        );

}


/* =========================================================
   STOP HOVER
========================================================= */

function stopMascotHover() {

    if (
        mascotHoverTimer ===
        null
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
   CATEGORY MESSAGES
========================================================= */

const mainFormsMessages:
    string[] =
    [

        "Voici mes formes principales ! Enfin... celles que vous avez le droit de voir. 👀",

        "Chaque forme représente une étape différente de mon évolution.",

        "Il y a quelques dossiers classés secrets par ici...",

        "Promis, je ne cache absolument rien. Enfin... presque rien. 👀",

        "Bienvenue dans les archives de Couaxia ! 🐙"

    ];


const alternativeMessages:
    string[] =
    [

        "Même une Kraduk a le droit de changer de style ! ✨",

        "Une seule apparence ? Beaucoup trop simple !",

        "J'aime bien expérimenter avec différentes apparences. 💜",

        "Certaines apparences sont faites juste pour le plaisir !",

        "On peut changer de look sans changer complètement de forme !"

    ];


const chibiMessages:
    string[] =
    [

        "Petite taille. Même chaos. 🐙",

        "Je suis toute petite ! Enfin... presque.",

        "Une Couaxia de poche ! 💜",

        "Attention, le niveau de chaos n'est PAS réduit avec la taille.",

        "Les Chibi sont beaucoup trop adorables !"

    ];


/* =========================================================
   MAIN FORMS
========================================================= */

const mainForms:
    CouaxiaAppearance[] =
    [

        /* =====================================================
           FORM 01
        ===================================================== */

        {

            id:
                "forme-1",

            name:
                "Forme 01",

            subtitle:
                "Forme non révélée",

            description:
                "Cette forme de Couaxia n'a jamais été dévoilée.",

            image:
                null,

            imageAlt:
                "Forme 01 de Couaxia",

            status:
                "hidden",

            badge:
                "SECRET",

            messages:
                [

                    "La Forme 01 ? Nope. Dossier classé secret. 👀",

                    "Tu pensais vraiment que j'allais te montrer ça ?",

                    "Cette forme n'a JAMAIS été révélée.",

                    "ACCÈS REFUSÉ ! Circulez, il n'y a rien à voir. 🐙",

                    "Même les Poups n'ont jamais vu cette forme !",

                    "Cette archive est classée beaucoup trop secrète.",

                    "Pourquoi tu regardes cette carte avec autant d'insistance ? 👀",

                    "Non. Toujours pas. Tu ne verras pas la Forme 01 !",

                    "Je pourrais te montrer... mais après je devrais probablement effacer ta mémoire.",

                    "Dossier 001 verrouillé. Et j'ai perdu la clé. Quel dommage !"

                ]

        },


        /* =====================================================
           FORM 02
        ===================================================== */

        {

            id:
                "forme-2",

            name:
                "Forme 02",

            subtitle:
                "Forme actuelle",

            description:
                "La forme actuelle de Couaxia.",

            image:
                null,

            imageAlt:
                "Forme actuelle de Couaxia",

            status:
                "current",

            badge:
                "ACTUELLE",

            messages:
                [

                    "Celle-là, vous la connaissez ! C'est moi actuellement ! ✨",

                    "Et voilà la Couaxia que vous connaissez aujourd'hui ! 💜",

                    "Coucou ! Oui, c'est bien moi. 🐙",

                    "Cette forme est actuellement en service !",

                    "C'est avec cette tête-là que je viens semer le chaos en stream. 👀",

                    "Forme 02 opérationnelle !",

                    "Je trouve qu'elle me va plutôt bien, non ? 💜",

                    "La Couaxia actuelle, en chair, en os et en tentacules !"

                ]

        },


        /* =====================================================
           FORM 03
        ===================================================== */

        {

            id:
                "forme-3",

            name:
                "Forme 03",

            subtitle:
                "Prochaine forme",

            description:
                "Une nouvelle évolution de Couaxia se prépare...",

            image:
                null,

            imageAlt:
                "Prochaine forme de Couaxia",

            status:
                "upcoming",

            badge:
                "À VENIR",

            messages:
                [

                    "Vous pensiez vraiment que j'allais déjà vous la montrer ? 👀",

                    "Patience... elle arrivera quand elle sera prête. ✨",

                    "Une nouvelle transmission est en préparation.",

                    "Je ne dirai RIEN. Même sous la torture des chatouilles.",

                    "La Forme 03 approche... doucement.",

                    "Tu essaies de trouver des indices ? Bonne chance. 👀",

                    "Peut-être qu'elle aura plus de tentacules... ou peut-être pas !",

                    "Information confidentielle. Revenez plus tard !",

                    "Vous n'êtes pas prêts. Enfin... moi non plus peut-être. 🐙",

                    "Bientôt™."

                ]

        }

    ];


/* =========================================================
   ALTERNATIVE APPEARANCES
========================================================= */

const alternativeForms:
    CouaxiaAppearance[] =
    [

        {

            id:
                "alternative-1",

            name:
                "Alternative 01",

            subtitle:
                "Apparence alternative",

            description:
                "Une apparence alternative de Couaxia.",

            image:
                null,

            imageAlt:
                "Apparence alternative de Couaxia",

            status:
                "normal",

            messages:
                [

                    "Un petit changement de style ! ✨",

                    "Même extraterrestre, on peut aimer changer de tenue !",

                    "Ça change un peu de ma tenue habituelle !",

                    "Nouvelle apparence, toujours la même Kraduk. 🐙",

                    "Il faut bien remplir la garde-robe intergalactique !"

                ]

        },


        {

            id:
                "alternative-2",

            name:
                "Alternative 02",

            subtitle:
                "Apparence alternative",

            description:
                "Une autre apparence alternative de Couaxia.",

            image:
                null,

            imageAlt:
                "Deuxième apparence alternative de Couaxia",

            status:
                "normal",

            messages:
                [

                    "Encore une autre apparence ! 👀",

                    "Pourquoi choisir une seule tenue ?",

                    "Ma garde-robe commence peut-être à devenir incontrôlable.",

                    "Toujours Couaxia, juste avec un petit changement !",

                    "J'aime beaucoup trop tester de nouvelles apparences. 💜"

                ]

        }

    ];


/* =========================================================
   CHIBI FORMS
========================================================= */

const chibiForms:
    CouaxiaAppearance[] =
    [

        {

            id:
                "chibi-1",

            name:
                "Chibi 01",

            subtitle:
                "Version Chibi",

            description:
                "Une version miniature de Couaxia.",

            image:
                null,

            imageAlt:
                "Version Chibi de Couaxia",

            status:
                "normal",

            messages:
                [

                    "REGARDE COMME JE SUIS PETITE ! 🐙",

                    "Couaxia format poche !",

                    "Petite mais toujours dangereuse pour vos frites. 👀",

                    "Le niveau de chaos reste exactement le même.",

                    "Je peux tenir dans ta poche maintenant ! Enfin... presque.",

                    "Mini Couaxia ! 💜"

                ]

        },


        {

            id:
                "chibi-2",

            name:
                "Chibi 02",

            subtitle:
                "Version Chibi",

            description:
                "Une autre version Chibi de Couaxia.",

            image:
                null,

            imageAlt:
                "Deuxième version Chibi de Couaxia",

            status:
                "normal",

            messages:
                [

                    "Encore plus de Chibi !",

                    "On n'a jamais assez de petites Couaxia. 🐙",

                    "Pourquoi est-ce que tout devient plus adorable en Chibi ?",

                    "Toujours petite. Toujours chaotique.",

                    "Attention : cette version peut provoquer des envies de câlins. 💜"

                ]

        }

    ];

</script>


<template>

    <section
        class="couaxia-forms"
        aria-labelledby="couaxia-forms-title"
    >

        <!-- ==========================================
             DECORATIONS
        =========================================== -->

        <div
            class="
                couaxia-forms__decoration
                couaxia-forms__decoration--one
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                couaxia-forms__decoration
                couaxia-forms__decoration--two
            "
            aria-hidden="true"
        ></div>


        <!-- ==========================================
             HEADER
        =========================================== -->

        <header class="couaxia-forms__header">

            <p class="couaxia-forms__eyebrow">
                ✦ ÉVOLUTION
            </p>


            <h2
                id="couaxia-forms-title"
                class="couaxia-forms__title"
            >

                Toutes les formes de

                <span>
                    Couaxia
                </span>

            </h2>


            <p class="couaxia-forms__description">

                Formes principales, apparences alternatives
                et versions Chibi : découvre les différentes
                apparences de Couaxia.

            </p>

        </header>


        <!-- ==========================================
             MAIN FORMS
        =========================================== -->

        <div class="couaxia-forms__category">

            <div
                class="couaxia-forms__category-header"
                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        mainFormsMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        mainFormsMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div>

                    <p class="couaxia-forms__category-index">
                        01 // FORMES
                    </p>


                    <h3 class="couaxia-forms__category-title">
                        Formes principales
                    </h3>

                </div>


                <p class="couaxia-forms__category-description">

                    Les différentes évolutions principales
                    de Couaxia.

                </p>

            </div>


            <div class="couaxia-forms__scroll">

                <div class="couaxia-forms__grid">

                    <article
                        v-for="form in mainForms"

                        :key="form.id"

                        class="couaxia-form-card"

                        :class="[
                            `couaxia-form-card--${form.status}`
                        ]"

                        tabindex="0"

                        @mouseenter="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @mouseleave="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <!-- ==============================
                             CARD HEADER
                        =============================== -->

                        <header class="couaxia-form-card__header">

                            <span class="couaxia-form-card__name">
                                {{ form.name }}
                            </span>


                            <span
                                v-if="form.badge"
                                class="couaxia-form-card__badge"
                            >

                                {{ form.badge }}

                            </span>

                        </header>


                        <!-- ==============================
                             VISUAL
                        =============================== -->

                        <div class="couaxia-form-card__visual">

                            <div
                                class="couaxia-form-card__glow"
                                aria-hidden="true"
                            ></div>


                            <!-- IMAGE -->

                            <img
                                v-if="form.image"

                                :src="form.image"

                                :alt="form.imageAlt"

                                class="couaxia-form-card__image"

                                loading="lazy"
                            >


                            <!-- SECRET FORM -->

                            <div
                                v-else-if="
                                    form.status ===
                                    'hidden'
                                "

                                class="
                                    couaxia-form-card__placeholder
                                    couaxia-form-card__placeholder--hidden
                                "
                            >

                                <div
                                    class="couaxia-form-card__secret-lines"
                                    aria-hidden="true"
                                ></div>


                                <span
                                    class="couaxia-form-card__secret-code"
                                    aria-hidden="true"
                                >
                                    FILE_001
                                </span>


                                <div
                                    class="couaxia-form-card__secret-symbol"
                                    aria-hidden="true"
                                >
                                    ?
                                </div>


                                <strong>
                                    ???
                                </strong>


                                <span>
                                    ARCHIVES // ACCÈS RESTREINT
                                </span>

                            </div>


                            <!-- CURRENT FORM -->

                            <div
                                v-else-if="
                                    form.status ===
                                    'current'
                                "

                                class="
                                    couaxia-form-card__placeholder
                                    couaxia-form-card__placeholder--current
                                "
                            >

                                <span
                                    class="couaxia-form-card__star"
                                    aria-hidden="true"
                                >
                                    ✦
                                </span>


                                <div
                                    class="couaxia-form-card__placeholder-icon"
                                    aria-hidden="true"
                                >
                                    🐙
                                </div>


                                <strong>
                                    Forme actuelle
                                </strong>


                                <span>
                                    Illustration bientôt ajoutée
                                </span>

                            </div>


                            <!-- UPCOMING FORM -->

                            <div
                                v-else

                                class="
                                    couaxia-form-card__placeholder
                                    couaxia-form-card__placeholder--upcoming
                                "
                            >

                                <div
                                    class="couaxia-form-card__upcoming-orbit"
                                    aria-hidden="true"
                                >

                                    <span>
                                        ✦
                                    </span>

                                </div>


                                <strong>
                                    Prochaine transmission
                                </strong>


                                <span>
                                    Une nouvelle forme approche...
                                </span>

                            </div>

                        </div>


                        <!-- ==============================
                             FOOTER
                        =============================== -->

                        <footer class="couaxia-form-card__footer">

                            <h4 class="couaxia-form-card__subtitle">
                                {{ form.subtitle }}
                            </h4>


                            <p class="couaxia-form-card__description">
                                {{ form.description }}
                            </p>

                        </footer>

                    </article>

                </div>

            </div>

        </div>


        <!-- ==========================================
             ALTERNATIVE APPEARANCES
        =========================================== -->

        <div class="couaxia-forms__category">

            <div
                class="couaxia-forms__category-header"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        alternativeMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        alternativeMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div>

                    <p class="couaxia-forms__category-index">
                        02 // ALTERNATIVES
                    </p>


                    <h3 class="couaxia-forms__category-title">
                        Apparences alternatives
                    </h3>

                </div>


                <p class="couaxia-forms__category-description">

                    Des tenues et apparences différentes,
                    sans changer la forme principale.

                </p>

            </div>


            <div class="couaxia-forms__scroll">

                <div
                    class="
                        couaxia-forms__grid
                        couaxia-forms__grid--secondary
                    "
                >

                    <article
                        v-for="form in alternativeForms"

                        :key="form.id"

                        class="
                            couaxia-form-card
                            couaxia-form-card--secondary
                        "

                        tabindex="0"

                        @mouseenter="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @mouseleave="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <header class="couaxia-form-card__header">

                            <span class="couaxia-form-card__name">
                                {{ form.name }}
                            </span>

                        </header>


                        <div class="couaxia-form-card__visual">

                            <div
                                class="couaxia-form-card__glow"
                                aria-hidden="true"
                            ></div>


                            <img
                                v-if="form.image"

                                :src="form.image"

                                :alt="form.imageAlt"

                                class="couaxia-form-card__image"

                                loading="lazy"
                            >


                            <div
                                v-else

                                class="
                                    couaxia-form-card__placeholder
                                "
                            >

                                <div
                                    class="couaxia-form-card__placeholder-icon"
                                    aria-hidden="true"
                                >
                                    ✦
                                </div>


                                <strong>
                                    Apparence à venir
                                </strong>


                                <span>
                                    Illustration bientôt disponible
                                </span>

                            </div>

                        </div>


                        <footer class="couaxia-form-card__footer">

                            <h4 class="couaxia-form-card__subtitle">
                                {{ form.subtitle }}
                            </h4>


                            <p class="couaxia-form-card__description">
                                {{ form.description }}
                            </p>

                        </footer>

                    </article>

                </div>

            </div>

        </div>


        <!-- ==========================================
             CHIBI
        =========================================== -->

        <div class="couaxia-forms__category">

            <div
                class="couaxia-forms__category-header"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        chibiMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        chibiMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div>

                    <p class="couaxia-forms__category-index">
                        03 // CHIBI
                    </p>


                    <h3 class="couaxia-forms__category-title">
                        Versions Chibi
                    </h3>

                </div>


                <p class="couaxia-forms__category-description">
                    Couaxia en version miniature.
                </p>

            </div>


            <div class="couaxia-forms__scroll">

                <div
                    class="
                        couaxia-forms__grid
                        couaxia-forms__grid--secondary
                    "
                >

                    <article
                        v-for="form in chibiForms"

                        :key="form.id"

                        class="
                            couaxia-form-card
                            couaxia-form-card--secondary
                        "

                        tabindex="0"

                        @mouseenter="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @mouseleave="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                form.messages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <header class="couaxia-form-card__header">

                            <span class="couaxia-form-card__name">
                                {{ form.name }}
                            </span>

                        </header>


                        <div class="couaxia-form-card__visual">

                            <div
                                class="couaxia-form-card__glow"
                                aria-hidden="true"
                            ></div>


                            <img
                                v-if="form.image"

                                :src="form.image"

                                :alt="form.imageAlt"

                                class="couaxia-form-card__image"

                                loading="lazy"
                            >


                            <div
                                v-else

                                class="
                                    couaxia-form-card__placeholder
                                "
                            >

                                <div
                                    class="
                                        couaxia-form-card__placeholder-icon
                                        couaxia-form-card__placeholder-icon--chibi
                                    "

                                    aria-hidden="true"
                                >
                                    🐙
                                </div>


                                <strong>
                                    Chibi à venir
                                </strong>


                                <span>
                                    Illustration bientôt disponible
                                </span>

                            </div>

                        </div>


                        <footer class="couaxia-form-card__footer">

                            <h4 class="couaxia-form-card__subtitle">
                                {{ form.subtitle }}
                            </h4>


                            <p class="couaxia-form-card__description">
                                {{ form.description }}
                            </p>

                        </footer>

                    </article>

                </div>

            </div>

        </div>

    </section>

</template>


<style scoped>

/* =========================================================
   SECTION
========================================================= */

.couaxia-forms {
    position: relative;

    width: 100%;

    margin-top:
        clamp(35px, 5vw, 65px);

    padding:
        clamp(30px, 4vw, 50px);

    overflow: hidden;

    border:
        1px solid rgba(255, 255, 255, 0.10);

    border-radius: 28px;

    background:
        rgba(20, 7, 38, 0.68);

    box-shadow:
        0 16px 45px rgba(0, 0, 0, 0.18);
}


/* =========================================================
   DECORATIONS
========================================================= */

.couaxia-forms__decoration {
    position: absolute;

    border-radius: 50%;

    pointer-events: none;
}


.couaxia-forms__decoration--one {
    top: -170px;
    right: -150px;

    width: 390px;
    height: 390px;

    background:
        radial-gradient(
            circle,
            rgba(242, 34, 146, 0.12),
            transparent 70%
        );
}


.couaxia-forms__decoration--two {
    bottom: -180px;
    left: -150px;

    width: 420px;
    height: 420px;

    background:
        radial-gradient(
            circle,
            rgba(34, 242, 239, 0.08),
            transparent 70%
        );
}


/* =========================================================
   MAIN HEADER
========================================================= */

.couaxia-forms__header {
    position: relative;
    z-index: 2;

    max-width: 780px;

    margin:
        0
        auto
        clamp(45px, 6vw, 75px);

    text-align: center;
}


.couaxia-forms__eyebrow {
    margin: 0 0 10px;

    color: #22f2ef;

    font-family:
        "Courier New",
        monospace;

    font-size: 0.8rem;

    font-weight: 900;

    letter-spacing: 0.16em;

    text-transform: uppercase;
}


.couaxia-forms__title {
    margin: 0;

    color: #ffffff;

    font-family:
        "Courier New",
        monospace;

    font-size:
        clamp(2rem, 4vw, 3.4rem);

    font-weight: 900;

    line-height: 1.08;
}


.couaxia-forms__title span {
    color: #f22292;

    text-shadow:
        0 0 18px rgba(242, 34, 146, 0.20);
}


.couaxia-forms__description {
    max-width: 680px;

    margin:
        15px
        auto
        0;

    color:
        rgba(255, 255, 255, 0.84);

    font-size: 1rem;

    font-weight: 700;

    line-height: 1.75;
}


/* =========================================================
   CATEGORY
========================================================= */

.couaxia-forms__category {
    position: relative;
    z-index: 2;

    margin-top: 65px;
}


.couaxia-forms__category:first-of-type {
    margin-top: 0;
}


.couaxia-forms__category
+
.couaxia-forms__category {
    padding-top: 55px;

    border-top:
        1px solid rgba(255, 255, 255, 0.08);
}


/* =========================================================
   CATEGORY HEADER
========================================================= */

.couaxia-forms__category-header {
    display: flex;

    align-items: flex-end;

    justify-content: space-between;

    gap: 30px;

    margin-bottom: 25px;

    outline: none;
}


.couaxia-forms__category-header:focus-visible {
    border-radius: 14px;

    box-shadow:
        0 0 0 2px rgba(34, 242, 239, 0.22);
}


.couaxia-forms__category-index {
    margin: 0 0 6px;

    color: #22f2ef;

    font-family:
        "Courier New",
        monospace;

    font-size: 0.68rem;

    font-weight: 900;

    letter-spacing: 0.12em;
}


.couaxia-forms__category-title {
    margin: 0;

    color: #f22292;

    font-family:
        "Courier New",
        monospace;

    font-size:
        clamp(1.35rem, 3vw, 2rem);

    font-weight: 900;
}


.couaxia-forms__category-description {
    max-width: 430px;

    margin: 0;

    color:
        rgba(255, 255, 255, 0.62);

    font-size: 0.84rem;

    font-weight: 650;

    line-height: 1.55;

    text-align: right;
}


/* =========================================================
   GRID
========================================================= */

.couaxia-forms__grid {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

    gap: 20px;
}


.couaxia-forms__grid--secondary {
    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );
}


/* =========================================================
   CARD
========================================================= */

.couaxia-form-card {
    position: relative;

    display: flex;

    flex-direction: column;

    min-width: 0;

    overflow: hidden;

    border:
        1px solid rgba(255, 255, 255, 0.10);

    border-radius: 22px;

    background:
        rgba(255, 255, 255, 0.045);

    box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.14);

    outline: none;

    transition:
        transform 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        background 0.25s ease;
}


.couaxia-form-card:hover,
.couaxia-form-card:focus-visible {
    transform:
        translateY(-6px);

    border-color:
        rgba(34, 242, 239, 0.52);

    background:
        rgba(255, 255, 255, 0.06);

    box-shadow:
        0 0 14px rgba(34, 242, 239, 0.12),
        0 16px 34px rgba(0, 0, 0, 0.18);
}


/* =========================================================
   CURRENT
========================================================= */

.couaxia-form-card--current {
    border-color:
        rgba(242, 34, 146, 0.42);

    background:
        linear-gradient(
            180deg,
            rgba(242, 34, 146, 0.055),
            rgba(255, 255, 255, 0.035)
        );

    box-shadow:
        0 0 20px rgba(242, 34, 146, 0.08),
        0 10px 28px rgba(0, 0, 0, 0.14);
}


.couaxia-form-card--current:hover,
.couaxia-form-card--current:focus-visible {
    border-color:
        rgba(242, 34, 146, 0.70);

    box-shadow:
        0 0 16px rgba(242, 34, 146, 0.15),
        0 0 36px rgba(242, 34, 146, 0.07),
        0 16px 34px rgba(0, 0, 0, 0.18);
}


/* =========================================================
   SECRET
========================================================= */

.couaxia-form-card--hidden {
    border-color:
        rgba(255, 255, 255, 0.07);

    background:
        rgba(8, 4, 15, 0.60);
}


.couaxia-form-card--hidden:hover,
.couaxia-form-card--hidden:focus-visible {
    border-color:
        rgba(109, 0, 163, 0.55);
}


/* =========================================================
   UPCOMING
========================================================= */

.couaxia-form-card--upcoming {
    border-color:
        rgba(34, 242, 239, 0.18);
}


/* =========================================================
   CARD HEADER
========================================================= */

.couaxia-form-card__header {
    position: relative;
    z-index: 4;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 12px;

    min-height: 58px;

    padding: 14px 18px;

    border-bottom:
        1px solid rgba(255, 255, 255, 0.07);
}


.couaxia-form-card__name {
    color: #22f2ef;

    font-family:
        "Courier New",
        monospace;

    font-size: 0.72rem;

    font-weight: 900;

    letter-spacing: 0.12em;

    text-transform: uppercase;
}


/* =========================================================
   BADGES
========================================================= */

.couaxia-form-card__badge {
    display: inline-flex;

    align-items: center;

    justify-content: center;

    min-height: 25px;

    padding: 3px 9px;

    color: #ffffff;

    border:
        1px solid rgba(242, 34, 146, 0.38);

    border-radius: 999px;

    background:
        rgba(242, 34, 146, 0.12);

    font-size: 0.62rem;

    font-weight: 900;

    letter-spacing: 0.08em;
}


.couaxia-form-card--hidden
.couaxia-form-card__badge {
    border-color:
        rgba(255, 255, 255, 0.16);

    background:
        rgba(255, 255, 255, 0.05);

    color:
        rgba(255, 255, 255, 0.58);
}


.couaxia-form-card--upcoming
.couaxia-form-card__badge {
    border-color:
        rgba(34, 242, 239, 0.30);

    background:
        rgba(34, 242, 239, 0.07);

    color: #22f2ef;
}


/* =========================================================
   VISUAL
========================================================= */

.couaxia-form-card__visual {
    position: relative;

    display: flex;

    align-items: center;

    justify-content: center;

    min-height: 430px;

    overflow: hidden;

    background:
        radial-gradient(
            circle at center,
            rgba(109, 0, 163, 0.10),
            transparent 68%
        );
}


.couaxia-form-card--secondary
.couaxia-form-card__visual {
    min-height: 390px;
}


/* =========================================================
   GLOW
========================================================= */

.couaxia-form-card__glow {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 280px;

    aspect-ratio: 1;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(242, 34, 146, 0.20) 0%,
            rgba(109, 0, 163, 0.14) 42%,
            rgba(34, 242, 239, 0.06) 62%,
            transparent 74%
        );

    filter: blur(16px);

    transform:
        translate(-50%, -50%);

    transition:
        transform 0.35s ease;

    pointer-events: none;
}


.couaxia-form-card:hover
.couaxia-form-card__glow,
.couaxia-form-card:focus-visible
.couaxia-form-card__glow {
    transform:
        translate(-50%, -50%)
        scale(1.15);
}


.couaxia-form-card--hidden
.couaxia-form-card__glow {
    opacity: 0.25;
}


.couaxia-form-card--upcoming
.couaxia-form-card__glow {
    background:
        radial-gradient(
            circle,
            rgba(34, 242, 239, 0.15),
            rgba(109, 0, 163, 0.12) 45%,
            transparent 72%
        );

    animation:
        couaxiaUpcomingGlow
        3.2s ease-in-out
        infinite;
}


/* =========================================================
   IMAGE
========================================================= */

.couaxia-form-card__image {
    position: relative;
    z-index: 2;

    display: block;

    width: 100%;
    height: 430px;

    padding: 12px;

    object-fit: contain;

    object-position:
        center bottom;

    filter:
        drop-shadow(
            0 20px 30px rgba(0, 0, 0, 0.28)
        );

    transition:
        transform 0.3s ease;
}


.couaxia-form-card:hover
.couaxia-form-card__image,
.couaxia-form-card:focus-visible
.couaxia-form-card__image {
    transform:
        scale(1.025);
}


/* =========================================================
   PLACEHOLDER
========================================================= */

.couaxia-form-card__placeholder {
    position: relative;
    z-index: 2;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 12px;

    width: 100%;

    padding: 35px;

    text-align: center;
}


.couaxia-form-card__placeholder strong {
    color: #f22292;

    font-family:
        "Courier New",
        monospace;

    font-size: 0.95rem;

    font-weight: 900;
}


.couaxia-form-card__placeholder
>
span:last-child {
    max-width: 250px;

    color:
        rgba(255, 255, 255, 0.58);

    font-size: 0.75rem;

    font-weight: 700;

    line-height: 1.5;
}


/* =========================================================
   PLACEHOLDER ICON
========================================================= */

.couaxia-form-card__placeholder-icon {
    display: flex;

    align-items: center;

    justify-content: center;

    width: 105px;
    height: 105px;

    margin-bottom: 5px;

    border:
        1px solid rgba(34, 242, 239, 0.25);

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            rgba(109, 0, 163, 0.25),
            rgba(242, 34, 146, 0.12)
        );

    box-shadow:
        0 0 30px rgba(242, 34, 146, 0.10);

    font-size: 2.3rem;
}


.couaxia-form-card__placeholder-icon--chibi {
    width: 95px;
    height: 95px;

    font-size: 2rem;
}


/* =========================================================
   CURRENT PLACEHOLDER
========================================================= */

.couaxia-form-card__placeholder--current
.couaxia-form-card__placeholder-icon {
    border-color:
        rgba(242, 34, 146, 0.40);

    box-shadow:
        0 0 20px rgba(242, 34, 146, 0.12),
        0 0 45px rgba(109, 0, 163, 0.10);
}


.couaxia-form-card__star {
    position: absolute;

    top: -55px;
    right: 20px;

    color:
        rgba(34, 242, 239, 0.70);

    font-size: 1rem;
}


/* =========================================================
   SECRET
========================================================= */

.couaxia-form-card__placeholder--hidden {
    min-height: 330px;
}


.couaxia-form-card__secret-symbol {
    display: flex;

    align-items: center;

    justify-content: center;

    width: 130px;
    height: 180px;

    margin-bottom: 10px;

    color:
        rgba(255, 255, 255, 0.13);

    border:
        1px solid rgba(255, 255, 255, 0.07);

    border-radius:
        50% 50% 42% 42%;

    background:
        linear-gradient(
            180deg,
            rgba(109, 0, 163, 0.20),
            rgba(0, 0, 0, 0.42)
        );

    box-shadow:
        0 0 40px rgba(109, 0, 163, 0.12);

    font-family:
        "Courier New",
        monospace;

    font-size: 4rem;

    font-weight: 900;
}


.couaxia-form-card__placeholder--hidden
strong {
    color:
        rgba(255, 255, 255, 0.70);

    font-size: 1.4rem;

    letter-spacing: 0.20em;
}


.couaxia-form-card__secret-code {
    position: absolute;

    top: 18px;
    left: 18px;

    color:
        rgba(34, 242, 239, 0.28);

    font-family:
        "Courier New",
        monospace;

    font-size: 0.58rem;

    letter-spacing: 0.12em;
}


.couaxia-form-card__secret-lines {
    position: absolute;

    inset: 0;

    opacity: 0.18;

    background:
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 4px,
            rgba(255, 255, 255, 0.025) 5px
        );

    pointer-events: none;
}


/* =========================================================
   UPCOMING
========================================================= */

.couaxia-form-card__upcoming-orbit {
    position: relative;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 125px;
    height: 125px;

    margin-bottom: 14px;

    border:
        1px solid rgba(34, 242, 239, 0.28);

    border-radius: 50%;

    box-shadow:
        0 0 25px rgba(34, 242, 239, 0.10);
}


.couaxia-form-card__upcoming-orbit::before {
    content: "";

    position: absolute;

    width: 88px;
    height: 88px;

    border:
        1px solid rgba(242, 34, 146, 0.22);

    border-radius: 50%;

    animation:
        couaxiaOrbit
        8s linear
        infinite;
}


.couaxia-form-card__upcoming-orbit
span {
    color: #22f2ef;

    font-size: 2.3rem;

    text-shadow:
        0 0 18px rgba(34, 242, 239, 0.35);
}


/* =========================================================
   FOOTER
========================================================= */

.couaxia-form-card__footer {
    position: relative;
    z-index: 3;

    flex: 1;

    min-height: 115px;

    padding:
        18px 20px 20px;

    border-top:
        1px solid rgba(255, 255, 255, 0.07);
}


.couaxia-form-card__subtitle {
    margin:
        0 0 7px;

    color: #f22292;

    font-family:
        "Courier New",
        monospace;

    font-size: 1rem;

    font-weight: 900;
}


.couaxia-form-card__description {
    margin: 0;

    color:
        rgba(255, 255, 255, 0.70);

    font-size: 0.84rem;

    font-weight: 650;

    line-height: 1.55;
}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes couaxiaUpcomingGlow {

    0%,
    100% {

        opacity: 0.65;

        transform:
            translate(-50%, -50%)
            scale(1);

    }


    50% {

        opacity: 1;

        transform:
            translate(-50%, -50%)
            scale(1.10);

    }

}


@keyframes couaxiaOrbit {

    from {

        transform:
            rotate(0deg)
            scaleX(1.15);

    }


    to {

        transform:
            rotate(360deg)
            scaleX(1.15);

    }

}


/* =========================================================
   LIGHT MODE
========================================================= */

html[data-theme="light"]
.couaxia-forms {
    border-color:
        rgba(109, 0, 163, 0.14);

    background:
        rgba(255, 255, 255, 0.72);

    box-shadow:
        0 16px 45px rgba(109, 0, 163, 0.08);
}


html[data-theme="light"]
.couaxia-forms__eyebrow,
html[data-theme="light"]
.couaxia-forms__category-index {
    color: #008f9b;
}


html[data-theme="light"]
.couaxia-forms__title {
    color: #3d1555;
}


html[data-theme="light"]
.couaxia-forms__title span,
html[data-theme="light"]
.couaxia-forms__category-title {
    color: #b10072;
}


html[data-theme="light"]
.couaxia-forms__description,
html[data-theme="light"]
.couaxia-forms__category-description {
    color: #654c70;
}


html[data-theme="light"]
.couaxia-forms__category
+
.couaxia-forms__category {
    border-color:
        rgba(109, 0, 163, 0.09);
}


html[data-theme="light"]
.couaxia-form-card {
    border-color:
        rgba(109, 0, 163, 0.12);

    background:
        rgba(255, 255, 255, 0.76);

    box-shadow:
        0 10px 28px rgba(109, 0, 163, 0.08);
}


html[data-theme="light"]
.couaxia-form-card:hover,
html[data-theme="light"]
.couaxia-form-card:focus-visible {
    border-color:
        rgba(34, 242, 239, 0.65);

    background:
        rgba(255, 255, 255, 0.96);
}


html[data-theme="light"]
.couaxia-form-card--hidden {
    background:
        rgba(239, 231, 244, 0.80);
}


html[data-theme="light"]
.couaxia-form-card__header,
html[data-theme="light"]
.couaxia-form-card__footer {
    border-color:
        rgba(109, 0, 163, 0.08);
}


html[data-theme="light"]
.couaxia-form-card__name {
    color: #008f9b;
}


html[data-theme="light"]
.couaxia-form-card__subtitle {
    color: #b10072;
}


html[data-theme="light"]
.couaxia-form-card__description {
    color: #654c70;
}


html[data-theme="light"]
.couaxia-form-card__placeholder
strong {
    color: #b10072;
}


html[data-theme="light"]
.couaxia-form-card__placeholder
>
span:last-child {
    color: #846c90;
}


html[data-theme="light"]
.couaxia-form-card__placeholder--hidden
strong {
    color: #5b3b67;
}


html[data-theme="light"]
.couaxia-form-card__secret-symbol {
    color:
        rgba(61, 21, 85, 0.18);

    border-color:
        rgba(109, 0, 163, 0.10);

    background:
        linear-gradient(
            180deg,
            rgba(109, 0, 163, 0.08),
            rgba(109, 0, 163, 0.14)
        );
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 950px) {

    .couaxia-forms__category-header {
        align-items: flex-start;

        flex-direction: column;

        gap: 10px;
    }


    .couaxia-forms__category-description {
        max-width: 600px;

        text-align: left;
    }


    .couaxia-forms__scroll {
        width:
            calc(100% + 30px);

        margin-left:
            -15px;

        padding:
            10px 15px 22px;

        overflow-x: auto;

        scroll-snap-type:
            x mandatory;

        scrollbar-width: thin;
    }


    .couaxia-forms__grid {
        grid-template-columns:
            repeat(
                3,
                minmax(285px, 330px)
            );

        width: max-content;
    }


    .couaxia-forms__grid--secondary {
        grid-template-columns:
            repeat(
                2,
                minmax(285px, 330px)
            );
    }


    .couaxia-form-card {
        scroll-snap-align: center;
    }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

    .couaxia-forms {
        padding:
            25px 16px;

        border-radius: 22px;
    }


    .couaxia-forms__header {
        margin-bottom: 45px;
    }


    .couaxia-forms__title {
        font-size:
            clamp(1.8rem, 10vw, 2.5rem);
    }


    .couaxia-forms__description {
        font-size: 0.9rem;
    }


    .couaxia-forms__category {
        margin-top: 45px;
    }


    .couaxia-forms__category
    +
    .couaxia-forms__category {
        padding-top: 42px;
    }


    .couaxia-forms__grid {
        grid-template-columns:
            repeat(
                3,
                minmax(255px, 82vw)
            );

        gap: 14px;
    }


    .couaxia-forms__grid--secondary {
        grid-template-columns:
            repeat(
                2,
                minmax(255px, 82vw)
            );
    }


    .couaxia-form-card__visual {
        min-height: 370px;
    }


    .couaxia-form-card--secondary
    .couaxia-form-card__visual {
        min-height: 350px;
    }


    .couaxia-form-card__image {
        height: 370px;
    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .couaxia-form-card,
    .couaxia-form-card__image,
    .couaxia-form-card__glow,
    .couaxia-form-card__upcoming-orbit::before {
        transition: none;

        animation: none;
    }


    .couaxia-form-card:hover,
    .couaxia-form-card:focus-visible {
        transform: none;
    }

}

</style>