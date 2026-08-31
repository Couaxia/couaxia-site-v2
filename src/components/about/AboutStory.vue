<script setup lang="ts">

/* =========================================================
   ABOUT STORY
========================================================= */

const storyImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-2/Couaxia_pp_Melumii.png";


/* =========================================================
   TYPES
========================================================= */

interface StoryBlockMessages {

    id:
        string;

    messages:
        string[];

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
    messages:
        string[]
):
    string {

    if (
        !messages
        ||
        messages.length === 0
    ) {

        return "";

    }


    const randomIndex =
        Math.floor(
            Math.random() *
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
    message:
        string
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
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui oui, c'est bien moi ! 🐙",

    "Tu regardes mon ancienne forme de près ? 👀",

    "Une Couaxia sauvage est apparue ! ✨",

    "Même en illustration, je garde un œil sur toi !",

    "J'aime beaucoup cette création. 💜"

];


/* =========================================================
   STORY BLOCK MESSAGES
========================================================= */

const storyBlockMessages:
    StoryBlockMessages[] = [

        {
            id:
                "intro",

            messages: [

                "Couaxia, c'est moi ! 🐙",

                "Je suis venue pour jouer, créer et semer un peu de chaos !",

                "Les jeux vidéo occupent une place assez importante dans ma vie. 🎮",

                "J'aime surtout partager de bons moments avec les Poups ! 💜"

            ]
        },


        {
            id:
                "vtubing",

            messages: [

                "Le VTubing a vraiment commencé pour moi le 2 juin 2025 ! 🐙",

                "Petit à petit, Couaxia a commencé à prendre vie !",

                "L'affiliation Twitch a été une étape importante de l'aventure. 💜",

                "Depuis, mon univers continue de grandir ! ✨"

            ]
        },


        {
            id:
                "streams",

            messages: [

                "Multigaming veut surtout dire : beaucoup trop de jeux à tester ! 🎮",

                "Les jeux d'horreur et moi, c'est une relation compliquée. 👻",

                "Le but est surtout qu'on passe un bon moment ensemble !",

                "Être la meilleure joueuse ? Hmm... on va dire que le chaos est plus important. 👀"

            ]
        },


        {
            id:
                "universe",

            messages: [

                "Et là, on commence à parler de la partie intergalactique ! 🌌",

                "Les Kraduks viennent de Saphira ! 🐙",

                "Mon univers ne s'arrête clairement pas à Twitch.",

                "Créatures, personnages, voyages spatiaux... il reste encore beaucoup à découvrir ! ✨",

                "Saphira est le point de départ d'une sacrée aventure."

            ]
        }

    ];


/* =========================================================
   GET BLOCK MESSAGES
========================================================= */

function getBlockMessages(
    id:
        string
):
    string[] {

    return (
        storyBlockMessages.find(
            (
                block
            ) =>
                block.id === id
        )?.messages
        ??
        []
    );

}


/* =========================================================
   BUTTON MESSAGES
========================================================= */

const historyButtonMessages = [

    "Tu veux découvrir toute mon histoire ? 📖",

    "Direction Saphira ! 🌌",

    "Prépare-toi, il y a beaucoup plus à découvrir derrière Couaxia. 👀",

    "Kraduks, Avadora, Natsu... toute l'aventure t'attend !",

    "Allez, ouvre le livre ! 📖✨"

];

</script>


<template>

    <section
        class="about-story"
        aria-labelledby="about-story-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-story__header">

            <p class="about-story__eyebrow">
                DERRIÈRE COUAXIA
            </p>


            <h2
                id="about-story-title"
                class="about-story__title"
            >
                Qui suis-je ?
            </h2>


            <p class="about-story__description">
                Quelques mots pour découvrir la personne,
                la VTubeuse et l’univers qui se cachent
                derrière Couaxia.
            </p>

        </header>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="about-story__content">

            <!-- =============================================
                 IMAGE
            ============================================== -->

            <div
                class="about-story__visual"
                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        imageMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        imageMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div
                    class="about-story__glow"
                    aria-hidden="true"
                ></div>


                <img
                    :src="storyImage"
                    alt="Illustration de Couaxia"
                    class="about-story__image"
                >

            </div>


            <!-- =============================================
                 STORY
            ============================================== -->

            <div class="about-story__text">

                <!-- =========================================
                     01 — INTRODUCTION
                ========================================== -->

                <div
                    class="about-story__block"
                    tabindex="0"

                    @mouseenter="
                        startMascotHover(
                            getBlockMessages(
                                'intro'
                            )
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            getBlockMessages(
                                'intro'
                            )
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <span class="about-story__number">
                        01
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Couaxia, c’est moi !
                        </h3>


                        <p>
                            Je suis une VTubeuse française
                            passionnée par les jeux vidéo,
                            les univers fantastiques et la
                            création de contenu.
                        </p>


                        <p>
                            J’aime avant tout partager des
                            moments simples, drôles et parfois
                            complètement chaotiques avec ma
                            communauté.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     02 — VTUBING
                ========================================== -->

                <div
                    class="about-story__block"
                    tabindex="0"

                    @mouseenter="
                        startMascotHover(
                            getBlockMessages(
                                'vtubing'
                            )
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            getBlockMessages(
                                'vtubing'
                            )
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <span class="about-story__number">
                        02
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Mon aventure de VTubeuse
                        </h3>


                        <p>
                            J’ai commencé le VTubing le
                            <strong>2 juin 2025</strong>.
                            Depuis, je développe petit à petit
                            mon univers autour de Couaxia,
                            aussi bien sur Twitch que sur mes
                            autres réseaux.
                        </p>


                        <p>
                            Je suis devenue affiliée Twitch
                            le <strong>20 mai 2025</strong>,
                            une première étape importante dans
                            cette aventure.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     03 — STREAMS
                ========================================== -->

                <div
                    class="about-story__block"
                    tabindex="0"

                    @mouseenter="
                        startMascotHover(
                            getBlockMessages(
                                'streams'
                            )
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            getBlockMessages(
                                'streams'
                            )
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <span class="about-story__number">
                        03
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Mes streams
                        </h3>


                        <p>
                            Je fais principalement du
                            multigaming : jeux narratifs,
                            jeux d’horreur, jeux multijoueurs
                            et découvertes en tout genre.
                        </p>


                        <p>
                            Le but n’est pas forcément d’être
                            la meilleure joueuse du monde...
                            mais plutôt de passer un bon moment
                            ensemble et de créer des souvenirs.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     04 — UNIVERSE
                ========================================== -->

                <div
                    class="about-story__block"
                    tabindex="0"

                    @mouseenter="
                        startMascotHover(
                            getBlockMessages(
                                'universe'
                            )
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            getBlockMessages(
                                'universe'
                            )
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <span class="about-story__number">
                        04
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Et derrière les tentacules ?
                        </h3>


                        <p>
                            Couaxia possède également sa propre
                            histoire, avec son peuple, les
                            <strong>Kraduks</strong>, sa planète
                            <strong>Saphira</strong> et les
                            différentes créatures et personnages
                            rencontrés au cours de son voyage.
                        </p>


                        <p>
                            Cet univers continue de grandir au
                            fil du temps et fait partie intégrante
                            de mon identité de VTubeuse.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     STORY BUTTON
                ========================================== -->

                <div class="about-story__actions">

                    <RouterLink
                        to="/history"
                        class="about-story__button"

                        @mouseenter="
                            startMascotHover(
                                historyButtonMessages
                            )
                        "

                        @mouseleave="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                historyButtonMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span
                            class="about-story__button-icon"
                            aria-hidden="true"
                        >
                            📖
                        </span>


                        <span>
                            Découvrir mon histoire
                        </span>


                        <span
                            class="about-story__button-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                    </RouterLink>

                </div>

            </div>

        </div>

    </section>

</template>