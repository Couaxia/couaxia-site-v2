<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface TasteItem {

    icon:
        string;

    text:
        string;

    messages:
        string[];

}


interface TasteCard {

    type:
        "like" |
        "dislike";

    icon:
        string;

    label:
        string;

    title:
        string;

    messages:
        string[];

    items:
        TasteItem[];

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
        messages[
            randomIndex
        ]
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
   CARDS
========================================================= */

const tasteCards:
    TasteCard[] = [

        /* =====================================================
           LIKES
        ===================================================== */

        {

            type:
                "like",

            icon:
                "💜",

            label:
                "Mes favoris",

            title:
                "Ce que j’aime",

            messages: [

                "Tu as certains goûts en commun avec moi ?",

                "Je vous aime, mes femmes ! 💜",

                "Les jeux vidéo et les poulpes, c’est une excellente combinaison !",

                "J’adore partager tout cela avec les Poups !",

                "Le rose, le violet et les tentacules : la perfection !",

                "Natsu fait évidemment partie de mes choses préférées !"

            ],

            items: [

                {
                    icon:
                        "🎮",

                    text:
                        "Les jeux vidéo et les jeux en coopération",

                    messages: [

                        "Évidemment que les jeux vidéo sont dans la liste ! 🎮",

                        "La coopération est encore mieux quand tout le monde panique ensemble.",

                        "Plus on est nombreux, plus le chaos est efficace !",

                        "Les jeux en coop donnent toujours de bons souvenirs !"

                    ]
                },


                {
                    icon:
                        "🐙",

                    text:
                        "Les poulpes et les créatures fantastiques",

                    messages: [

                        "LES POULPES ! 🐙",

                        "Tu pensais vraiment que les poulpes ne seraient pas dans mes favoris ?",

                        "Les créatures fantastiques me fascinent !",

                        "Tentacules + créatures fantastiques = perfection."

                    ]
                },


                {
                    icon:
                        "🌸",

                    text:
                        "Les couleurs rose, violet et bleu",

                    messages: [

                        "Rose, violet et bleu... tu reconnais ma palette ? 💜",

                        "Impossible de choisir entre ces trois couleurs !",

                        "Le violet reste quand même très bien placé. 👀",

                        "Une combinaison parfaite pour mon univers !"

                    ]
                },


                {
                    icon:
                        "🌌",

                    text:
                        "Les univers fantastiques et la science-fiction",

                    messages: [

                        "La science-fiction me rappelle presque la maison. 🌌",

                        "Magie, espace et créatures étranges ? Oui !",

                        "J'adore me perdre dans de nouveaux univers.",

                        "Un bon monde fantastique et je suis heureuse !"

                    ]
                },


                {
                    icon:
                        "🐙",

                    text:
                        "Mes femmes 💜",

                    messages: [

                        "JE VOUS AIME MES FEMMES ! 💜",

                        "Évidemment qu'elles sont dans mes favoris !",

                        "Mes femmes ont une place très importante ici. 👀",

                        "Tu pensais vraiment que j'allais les oublier ?"

                    ]
                },


                {
                    icon:
                        "🎨",

                    text:
                        "Le dessin, la création et le développement",

                    messages: [

                        "Créer de nouvelles choses, j'adore ça ! 🎨",

                        "Dessin, développement, création... mon cerveau ne s'arrête jamais.",

                        "J'ai toujours un nouveau projet quelque part. 👀",

                        "Transformer une idée en quelque chose de réel, c'est génial !"

                    ]
                },


                {
                    icon:
                        "💬",

                    text:
                        "Passer du temps avec ma communauté",

                    messages: [

                        "Les Poups sont une énorme partie de cette aventure ! 💜",

                        "J'adore passer du temps avec vous !",

                        "Sans la communauté, les streams seraient beaucoup moins amusants.",

                        "Les meilleurs souvenirs viennent souvent des moments partagés avec vous !"

                    ]
                },


                {
                    icon:
                        "🐙",

                    text:
                        "Ma sœur Hylda et son amie Cita",

                    messages: [

                        "Hylda ! Ma sœur ! 💜",

                        "Hylda et Cita font partie de mes aventures depuis longtemps.",

                        "Avec elles dans les parages, le voyage est rarement calme. 👀",

                        "Je ne serais probablement pas arrivée aussi loin sans elles."

                    ]
                },


                {
                    icon:
                        "🐉",

                    text:
                        "Natsu, évidemment",

                    messages: [

                        "NATSU ! 🐉💜",

                        "Évidemment qu'il est dans mes favoris !",

                        "Notre première rencontre était... légèrement mouvementée.",

                        "Un dragon-requin, c'est quand même difficile à battre !",

                        "Natsu est beaucoup plus adorable qu'il en a l'air."

                    ]
                }

            ]

        },


        /* =====================================================
           DISLIKES
        ===================================================== */

        {

            type:
                "dislike",

            icon:
                "🚫",

            label:
                "Ce qui me déplaît",

            title:
                "Ce que je n’aime pas",

            messages: [

                "Même une Kraduk a ses limites !",

                "Les spoilers ? Quelle horreur !",

                "Promis, ici on reste bienveillants. 💜",

                "Les bugs en plein direct sont mes ennemis jurés !",

                "La toxicité n’a pas sa place dans mon univers !",

                "Et les plats épicés… très peu pour moi !"

            ],

            items: [

                {
                    icon:
                        "😡",

                    text:
                        "La toxicité et le manque de respect",

                    messages: [

                        "La toxicité n'a rien à faire ici.",

                        "Respect et bienveillance avant tout ! 💜",

                        "Si quelqu'un vient seulement pour être désagréable, mes tentacules connaissent la sortie. 🐙",

                        "On peut ne pas être d'accord sans manquer de respect."

                    ]
                },


                {
                    icon:
                        "🤐",

                    text:
                        "Les spoilers sans avertissement",

                    messages: [

                        "PAS DE SPOILERS ! 😭",

                        "Je veux découvrir les histoires moi-même !",

                        "Un spoiler sans prévenir et mes tentacules se mettent en colère.",

                        "Les spoilers devraient être enfermés très loin dans l'espace. 🌌"

                    ]
                },


                {
                    icon:
                        "💔",

                    text:
                        "Les bugs qui arrivent en plein live !",

                    messages: [

                        "LES BUGS EN LIVE... 😭",

                        "Tout fonctionne parfaitement pendant les tests et casse dès qu'on lance le stream.",

                        "Pourquoi les bugs attendent-ils toujours que je sois en direct ? 👀",

                        "OBS, Internet et les jeux ont parfois décidé de s'allier contre moi."

                    ]
                },


                {
                    icon:
                        "📢",

                    text:
                        "Les personnes qui parlent uniquement pour rabaisser",

                    messages: [

                        "Critiquer pour rabaisser quelqu'un n'apporte rien.",

                        "On peut donner son avis sans être méchant.",

                        "La bienveillance coûte exactement zéro euro. 💜",

                        "Les tentacules n'approuvent pas ce comportement. 🐙"

                    ]
                },


                {
                    icon:
                        "💔",

                    text:
                        "Voir une communauté se disputer",

                    messages: [

                        "Je préfère largement voir les Poups rigoler ensemble. 💜",

                        "Les disputes peuvent vraiment casser une bonne ambiance.",

                        "On essaie de régler les problèmes calmement.",

                        "Les Poups prennent soin les uns des autres !"

                    ]
                },


                {
                    icon:
                        "👻",

                    text:
                        "Les jumpscares auxquels je ne suis jamais préparée",

                    messages: [

                        "JE SUIS TOUJOURS PRÊTE AUX JUMPSCARES... enfin presque. 👻",

                        "Pourquoi est-ce qu'ils arrivent toujours quand je baisse ma garde ?!",

                        "Mes tentacules ont déjà essayé de quitter la pièce à cause d'un jumpscare.",

                        "Je n'ai pas peur. Je fais juste des tests de volume très soudains. 👀"

                    ]
                },


                {
                    icon:
                        "🌶️",

                    text:
                        "Les plats épicés",

                    messages: [

                        "Non. Non non non. Pas épicé. 🌶️",

                        "Pourquoi vouloir faire souffrir sa langue volontairement ?!",

                        "Très peu pour moi !",

                        "Une Kraduk en feu n'est pas prévue dans le lore. 👀"

                    ]
                }

            ]

        }

    ];

</script>


<template>

    <section
        class="about-tastes"
        aria-labelledby="about-tastes-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-tastes__header">

            <p class="about-tastes__eyebrow">
                MES GOÛTS
            </p>


            <h2
                id="about-tastes-title"
                class="about-tastes__title"
            >

                Ce que j’aime...

                <span>
                    et un peu moins
                </span>

            </h2>


            <p class="about-tastes__description">

                Quelques indices supplémentaires pour
                découvrir ce qui peut facilement me rendre
                heureuse... ou me faire fuir très loin.

            </p>

        </header>


        <!-- =================================================
             COLUMNS
        ================================================== -->

        <div class="about-tastes__grid">

            <article
                v-for="card in tasteCards"

                :key="
                    card.type
                "

                class="
                    about-tastes-card
                "

                :class="[
                    `about-tastes-card--${card.type}`
                ]"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        card.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        card.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     HEADER
                ========================================== -->

                <header class="about-tastes-card__header">

                    <div
                        class="
                            about-tastes-card__symbol
                        "

                        :class="[
                            `about-tastes-card__symbol--${card.type}`
                        ]"

                        aria-hidden="true"
                    >
                        {{ card.icon }}
                    </div>


                    <div>

                        <p
                            class="
                                about-tastes-card__eyebrow
                            "
                        >
                            {{ card.label }}
                        </p>


                        <h3
                            class="
                                about-tastes-card__title
                            "
                        >
                            {{ card.title }}
                        </h3>

                    </div>

                </header>


                <!-- =========================================
                     LIST
                ========================================== -->

                <ul class="about-tastes-card__list">

                    <li
                        v-for="item in card.items"

                        :key="
                            item.text
                        "

                        class="
                            about-tastes-card__item
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            startMascotHover(
                                item.messages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                item.messages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            class="
                                about-tastes-card__icon
                            "

                            aria-hidden="true"
                        >
                            {{ item.icon }}
                        </span>


                        <span
                            class="
                                about-tastes-card__text
                            "
                        >
                            {{ item.text }}
                        </span>

                    </li>

                </ul>

            </article>

        </div>

    </section>

</template>