<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface GameTag {

    label:
        string;

    messages:
        string[];

}


interface GameCategory {

    icon:
        string;

    title:
        string;

    description:
        string;

    tags:
        GameTag[];

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
   CATEGORIES
========================================================= */

const categories:
    GameCategory[] = [

        /* =====================================================
           HORREUR
        ===================================================== */

        {
            icon:
                "👻",

            title:
                "Horreur",

            description:
                "Des jeux parfaits pour me faire sursauter, paniquer et regretter mes décisions en direct.",

            messages: [

                "Les jeux d’horreur et moi… c’est une relation compliquée.",

                "Je suis courageuse ! Enfin… presque.",

                "Pourquoi les monstres courent toujours plus vite que moi ?",

                "Les jumpscares sont clairement une invention du démon."

            ],

            tags: [

                {
                    label:
                        "Survie",

                    messages: [

                        "Objectif numéro un : survivre. Ça semble simple, non ? 👀",

                        "Je suis très forte pour survivre... parfois.",

                        "Courir est une stratégie parfaitement valable !",

                        "Si quelque chose me poursuit, je prends la sortie la plus proche !"

                    ]
                },

                {
                    label:
                        "Jumpscares",

                    messages: [

                        "AAAAH ! Voilà, exactement ça. 👻",

                        "Je déteste quand ils arrivent sans prévenir !",

                        "Mes tentacules ne sont jamais prêtes pour ça.",

                        "Les jumpscares devraient être interdits par la loi intergalactique."

                    ]
                },

                {
                    label:
                        "Ambiance",

                    messages: [

                        "Une bonne ambiance horrifique peut être encore pire qu’un jumpscare.",

                        "Les petits bruits dans le noir ? Non merci.",

                        "Quand le jeu devient trop silencieux, je commence à m'inquiéter.",

                        "L'ambiance peut vraiment rendre un jeu terrifiant !"

                    ]
                }

            ]
        },


        /* =====================================================
           COOP
        ===================================================== */

        {
            icon:
                "🤝",

            title:
                "Coopération",

            description:
                "Des aventures à plusieurs où l’entraide fonctionne… jusqu’au moment où tout part en chaos.",

            messages: [

                "À plusieurs, tout est toujours plus chaotique !",

                "La coopération, c’est important… normalement.",

                "Avec les Poups, même les missions simples deviennent compliquées.",

                "Promis, je n’abandonne personne derrière… normalement."

            ],

            tags: [

                {
                    label:
                        "Coop",

                    messages: [

                        "Travailler ensemble, quelle merveilleuse idée !",

                        "On coopère... enfin, jusqu'à ce que quelqu'un fasse n'importe quoi.",

                        "J'adore les jeux où tout le monde doit s'entraider.",

                        "Une bonne équipe peut accomplir beaucoup de choses !"

                    ]
                },

                {
                    label:
                        "Multijoueur",

                    messages: [

                        "Plus on est nombreux, plus le chaos grandit !",

                        "J'adore jouer avec plusieurs personnes !",

                        "Le multijoueur crée toujours des moments mémorables.",

                        "Une équipe organisée ? Peut-être un jour. 👀"

                    ]
                },

                {
                    label:
                        "Fun",

                    messages: [

                        "Le plus important, c'est qu'on rigole !",

                        "Si on s'amuse, la mission est déjà réussie.",

                        "Le chaos est souvent la meilleure partie.",

                        "Un jeu fun entre amis, c'est toujours une bonne idée !"

                    ]
                }

            ]
        },


        /* =====================================================
           NARRATIF
        ===================================================== */

        {
            icon:
                "📖",

            title:
                "Narratif",

            description:
                "Des histoires fortes, des choix parfois difficiles et des univers dans lesquels j’adore me perdre.",

            messages: [

                "J’adore découvrir une bonne histoire.",

                "Les choix impossibles dans les jeux narratifs… quelle souffrance !",

                "Je m’attache toujours beaucoup trop vite aux personnages.",

                "Une bonne aventure peut rester longtemps dans mes souvenirs."

            ],

            tags: [

                {
                    label:
                        "Histoire",

                    messages: [

                        "Une bonne histoire peut complètement me captiver.",

                        "Je veux toujours savoir ce qui va arriver ensuite !",

                        "Pas de spoilers surtout ! 👀",

                        "L'histoire est souvent ce qui me fait rester jusqu'au bout."

                    ]
                },

                {
                    label:
                        "Choix",

                    messages: [

                        "Pourquoi les jeux me donnent toujours des choix impossibles ?!",

                        "Je réfléchis dix minutes et je regrette quand même mon choix.",

                        "Les conséquences arrivent toujours quand on ne s'y attend pas.",

                        "Je veux une option : sauver tout le monde ! 😭"

                    ]
                },

                {
                    label:
                        "Aventure",

                    messages: [

                        "Une nouvelle aventure ? Je suis toujours partante !",

                        "Découvrir un nouvel univers, j'adore ça.",

                        "Une bonne aventure peut durer des heures sans que je voie le temps passer.",

                        "Il y a toujours quelque chose à découvrir !"

                    ]
                }

            ]
        },


        /* =====================================================
           EXPLORATION
        ===================================================== */

        {
            icon:
                "🌍",

            title:
                "Exploration",

            description:
                "Découvrir de nouveaux mondes, fouiller partout et prendre trois heures pour suivre la quête principale.",

            messages: [

                "La quête principale peut attendre, j’ai vu quelque chose au loin !",

                "Explorer chaque recoin est absolument nécessaire.",

                "Oui, je peux passer une heure à chercher un coffre.",

                "Les grands mondes me donnent toujours envie de tout découvrir."

            ],

            tags: [

                {
                    label:
                        "Exploration",

                    messages: [

                        "Je dois absolument regarder derrière ce rocher !",

                        "Explorer partout est obligatoire, évidemment.",

                        "La carte ne sera jamais assez grande pour moi.",

                        "Si un endroit semble inutile, c'est justement là que je veux aller."

                    ]
                },

                {
                    label:
                        "Open world",

                    messages: [

                        "Une grande carte ? Au revoir la quête principale !",

                        "Je vais forcément partir dans la direction opposée à l'objectif.",

                        "Les open worlds réveillent ma curiosité.",

                        "Je peux me perdre pendant des heures dans un monde ouvert."

                    ]
                },

                {
                    label:
                        "Découverte",

                    messages: [

                        "J'adore tomber sur quelque chose que je n'avais jamais vu !",

                        "Les petites découvertes rendent l'exploration encore plus intéressante.",

                        "Qu'est-ce qu'il y a là-bas ? 👀",

                        "Ma curiosité va encore me créer des problèmes."

                    ]
                }

            ]
        },


        /* =====================================================
           ACTION
        ===================================================== */

        {
            icon:
                "⚔️",

            title:
                "Action",

            description:
                "Du rythme, des combats et parfois beaucoup trop de boutons sur lesquels appuyer en même temps.",

            messages: [

                "Quand ça bouge partout, c’est forcément une bonne idée !",

                "Plus il y a d’action, plus mes tentacules travaillent.",

                "J’appuie sur tous les boutons et parfois ça fonctionne.",

                "Les combats épiques, j’adore ça !"

            ],

            tags: [

                {
                    label:
                        "Combat",

                    messages: [

                        "À l'attaque ! ⚔️",

                        "Les combats épiques sont toujours satisfaisants.",

                        "Je suis certaine que spammer les boutons est une vraie stratégie.",

                        "Mes tentacules sont prêtes au combat !"

                    ]
                },

                {
                    label:
                        "Action",

                    messages: [

                        "Pas le temps de réfléchir, ça explose partout !",

                        "Plus ça bouge, plus je suis concentrée.",

                        "L'action, c'est parfait pour réveiller un stream !",

                        "Ça va vite... parfois trop vite pour moi. 👀"

                    ]
                },

                {
                    label:
                        "Aventure",

                    messages: [

                        "Combat et aventure, excellent mélange !",

                        "Il faut bien quelques dangers sur le chemin.",

                        "Une aventure sans action serait beaucoup trop calme.",

                        "J'adore quand un jeu mélange exploration et combats."

                    ]
                }

            ]
        },


        /* =====================================================
           FUN
        ===================================================== */

        {
            icon:
                "🎉",

            title:
                "Jeux fun",

            description:
                "Les jeux parfaits pour rire, se défier et créer des moments complètement absurdes en stream.",

            messages: [

                "Le chaos entre amis, c’est magnifique.",

                "Qui a dit qu’il fallait jouer sérieusement ?",

                "Le plus important, c’est de rire !",

                "Ces jeux sont responsables de beaucoup trop de moments absurdes."

            ],

            tags: [

                {
                    label:
                        "Party game",

                    messages: [

                        "Les party games détruisent les amitiés depuis toujours. 😂",

                        "Parfait pour une soirée complètement chaotique !",

                        "Tout va très bien jusqu'à ce que quelqu'un commence à gagner.",

                        "Les règles sont simples : gagner et accuser les autres !"

                    ]
                },

                {
                    label:
                        "Défis",

                    messages: [

                        "Un défi ? J'accepte ! 👀",

                        "Je vais probablement regretter d'avoir accepté.",

                        "Les défis donnent toujours de bons moments en stream.",

                        "Pourquoi est-ce que les Poups aiment autant me faire souffrir ? 😂"

                    ]
                },

                {
                    label:
                        "Chaos",

                    messages: [

                        "CHAOS ! Voilà un mot que j'aime bien. 🐙",

                        "Un stream Couaxia sans chaos serait vraiment étrange.",

                        "Le chaos est parfois une stratégie.",

                        "Tout était parfaitement organisé... puis on a commencé à jouer."

                    ]
                }

            ]
        }

    ];

</script>


<template>

    <section
        class="games-categories"
        aria-labelledby="games-categories-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="games-categories__header">

            <p class="games-categories__eyebrow">
                MES STYLES DE JEUX
            </p>


            <h2
                id="games-categories-title"
                class="games-categories__title"
            >
                Ce que j’aime

                <span>
                    jouer
                </span>

            </h2>


            <p class="games-categories__description">

                Horreur, coopération, aventures narratives
                ou pur chaos multijoueur : voici les styles
                de jeux que j’aime retrouver en stream.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="games-categories__grid">

            <article
                v-for="category in categories"

                :key="
                    category.title
                "

                class="
                    games-category-card
                "

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        category.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        category.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     ICON
                ========================================== -->

                <div
                    class="
                        games-category-card__icon
                    "

                    aria-hidden="true"
                >
                    {{ category.icon }}
                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div class="games-category-card__content">

                    <h3
                        class="
                            games-category-card__title
                        "
                    >
                        {{ category.title }}
                    </h3>


                    <p
                        class="
                            games-category-card__description
                        "
                    >
                        {{ category.description }}
                    </p>


                    <!-- =====================================
                         TAGS
                    ====================================== -->

                    <div class="games-category-card__tags">

                        <span
                            v-for="tag in category.tags"

                            :key="
                                tag.label
                            "

                            class="
                                games-category-card__tag
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                startMascotHover(
                                    tag.messages
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                startMascotHover(
                                    tag.messages
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >
                            {{ tag.label }}
                        </span>

                    </div>

                </div>

            </article>

        </div>

    </section>

</template>