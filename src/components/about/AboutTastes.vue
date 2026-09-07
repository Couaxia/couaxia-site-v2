<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface TasteItem {
    icon: string;
    text: string;
    messages: string[];
}


interface TasteCard {
    type:
        | "like"
        | "dislike";

    icon: string;
    label: string;
    title: string;
    messages: string[];
    items: TasteItem[];
}


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer: number | null = null;


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
   CARDS
========================================================= */

const tasteCards: TasteCard[] = [

    /* =====================================================
       FOOD
    ===================================================== */

    {

        type:
            "like",

        icon:
            "😋",

        label:
            "Petit carburant",

        title:
            "Ce que j’aime manger",

        messages: [

            "Attention, cette carte peut donner faim. 👀",

            "Il faut bien nourrir une Kraduk ! 😋",

            "La nourriture est une affaire très sérieuse.",

            "Voici quelques sources d'énergie intergalactique !"

        ],

        items: [

            {

                icon:
                    "🍰",

                text:
                    "Les gâteaux",

                messages: [

                    "Miam du sucre !!",

                    "Je pourrais en manger toute la journée !",

                    "Les gâteaux rendent toujours une journée meilleure !",

                    "Le sucre est un excellent carburant intergalactique."

                ]

            },


            {

                icon:
                    "🥩",

                text:
                    "La viande",

                messages: [

                    "De la bonne viande saignante !",

                    "Ça sent le festin !",

                    "Mon côté Kraduk adore ça !",

                    "Un bon morceau de viande et je suis heureuse !"

                ]

            },


            {

                icon:
                    "🍟",

                text:
                    "Les frites",

                messages: [

                    "Des FRITES ! Des FRITES ! Des FRITES !",

                    "Mission : ne pas partager mes frites.",

                    "Tu peux vraiment dire non à des frites ?",

                    "Attention à tes doigts si tu touches à mes frites ! 👀"

                ]

            },


            {

                icon:
                    "🍔",

                text:
                    "Les burgers",

                messages: [

                    "Je lâcherais bien un croc dedans !",

                    "Un burger bien garni, quel bonheur !",

                    "Ça donne faim rien que d'y penser !",

                    "Avec des frites à côté évidemment !"

                ]

            },


            {

                icon:
                    "🧀",

                text:
                    "Les fromages",

                messages: [

                    "Avec un bon morceau de pain...",

                    "Le fromage, c'est la vie !",

                    "Impossible d'y résister !",

                    "Je pourrais traverser une galaxie entière pour un bon fromage !"

                ]

            },


            {

                icon:
                    "🍺",

                text:
                    "La bière",

                messages: [

                    "Attention, l'abus d'alcool est dangereux pour la santé !",

                    "À consommer avec modération !",

                    "Une bonne bière bien fraîche de temps en temps.",

                    "Même les Kraduks connaissent la modération ! Enfin... normalement."

                ]

            },


            {

                icon:
                    "🍕",

                text:
                    "La pizza",

                messages: [

                    "Pizza ! 🍕",

                    "Seule ou à plusieurs, c'est toujours une bonne idée !",

                    "Tu prends quelle garniture ?",

                    "Une pizza après un stream... perfection !"

                ]

            }

        ]

    },


    /* =====================================================
       FILMS / SERIES
    ===================================================== */

    {

        type:
            "like",

        icon:
            "🎬",

        label:
            "À regarder",

        title:
            "Films et séries",

        messages: [

            "Une bonne soirée film avec un plaid ? Oui ! 🎬",

            "La science-fiction, évidemment ! Je viens quand même de l'espace. 🌌",

            "Action, aventure et explosions... ça me va !",

            "J'aime découvrir plein de films et séries différents !"

        ],

        items: [

            {

                icon:
                    "💥",

                text:
                    "Action",

                messages: [

                    "Plus il y a d'action, mieux c'est !",

                    "Une bonne scène d'action et je suis captivée.",

                    "Explosions ? Courses poursuites ? Je prends !"

                ]

            },


            {

                icon:
                    "🌌",

                text:
                    "Science-fiction",

                messages: [

                    "La science-fiction me rappelle presque la maison. 🌌",

                    "L'espace est quand même un excellent décor !",

                    "Vaisseaux spatiaux et mondes inconnus ? Oui !"

                ]

            },


            {

                icon:
                    "✨",

                text:
                    "Fantastique",

                messages: [

                    "Magie et créatures fantastiques ? Parfait !",

                    "J'adore découvrir de nouveaux univers.",

                    "Un monde rempli de créatures étranges et je suis heureuse !"

                ]

            },


            {

                icon:
                    "🎞️",

                text:
                    "Un peu de tout",

                messages: [

                    "Pourquoi se limiter à un seul genre ?",

                    "Je regarde vraiment un peu de tout !",

                    "Une bonne histoire peut fonctionner dans n'importe quel genre."

                ]

            }

        ]

    },


    /* =====================================================
       MUSIC
    ===================================================== */

    {

        type:
            "like",

        icon:
            "🎵",

        label:
            "Dans mes oreilles",

        title:
            "Musiques",

        messages: [

            "Il y a presque toujours de la musique quelque part dans ma tête ! 🎵",

            "Impossible de choisir un seul style musical.",

            "Tu écoutes quoi en ce moment ? 👀",

            "Ma playlist est probablement beaucoup trop variée."

        ],

        items: [

            {

                icon:
                    "🎤",

                text:
                    "K-Pop",

                messages: [

                    "Impossible de résister à la K-Pop !",

                    "Attention, je risque de commencer à danser !",

                    "Certaines chansons restent beaucoup trop longtemps dans ma tête !"

                ]

            },


            {

                icon:
                    "🌸",

                text:
                    "Openings d’animés",

                messages: [

                    "Les openings d'animés restent gravés dans ma tête !",

                    "Tu les passes aussi sans jamais les skip ? 👀",

                    "Certains openings sont beaucoup trop bons !"

                ]

            },


            {

                icon:
                    "🎸",

                text:
                    "Rock",

                messages: [

                    "Le rock donne tellement d'énergie !",

                    "Monte le volume ! 🎸",

                    "Parfait pour réveiller une Kraduk !"

                ]

            },


            {

                icon:
                    "🔥",

                text:
                    "Rap",

                messages: [

                    "Il y a tellement de styles différents dans le rap !",

                    "Un bon flow et c'est parti !",

                    "J'aime découvrir de nouveaux artistes."

                ]

            },


            {

                icon:
                    "🎻",

                text:
                    "Classique",

                messages: [

                    "La musique classique est parfaite pour se détendre.",

                    "Un petit moment calme entre deux catastrophes !",

                    "Même une Kraduk chaotique sait apprécier le classique. 👀"

                ]

            },


            {

                icon:
                    "🎧",

                text:
                    "Et plein d’autres styles",

                messages: [

                    "J'aime découvrir de nouveaux styles musicaux !",

                    "Ma playlist est probablement beaucoup trop variée.",

                    "Pourquoi choisir quand on peut écouter un peu de tout ?"

                ]

            }

        ]

    },


    /* =====================================================
       ANIMALS
    ===================================================== */

    {

        type:
            "like",

        icon:
            "🐾",

        label:
            "Petites créatures",

        title:
            "Animaux préférés",

        messages: [

            "Les créatures de votre planète sont fascinantes ! 🐾",

            "Bon... certaines créatures de Saphira sont quand même plus impressionnantes.",

            "J'aime beaucoup trop d'animaux pour n'en choisir qu'un !"

        ],

        items: [

            {

                icon:
                    "🐙",

                text:
                    "Les poulpes",

                messages: [

                    "LES POULPES ! 🐙",

                    "Tu pensais vraiment que les poulpes ne seraient pas dans mes favoris ?",

                    "Je crois que ça se voit que j'aime les poulpes...",

                    "Un jour, je finirai peut-être avec huit tentacules !"

                ]

            },


            {

                icon:
                    "🌊",

                text:
                    "Les animaux marins",

                messages: [

                    "Les animaux marins me fascinent !",

                    "Les océans cachent tellement de merveilles !",

                    "Je pourrais passer des heures à observer la vie sous-marine.",

                    "Entre les baleines, les raies et les méduses... je les adore tous !"

                ]

            },


            {

                icon:
                    "🐈",

                text:
                    "Les félins",

                messages: [

                    "Impossible de résister à un félin !",

                    "Les chats sont tellement adorables !",

                    "Les félins sont élégants et majestueux.",

                    "J'adore tous les félins, des chats aux tigres !"

                ]

            },


            {

                icon:
                    "🐉",

                text:
                    "Les dragons",

                messages: [

                    "Les dragons sont incroyables !",

                    "Depuis que j'ai rencontré Natsu, j'en suis encore plus fan !",

                    "Un dragon, c'est la classe absolue !",

                    "Les dragons me font rêver depuis toujours."

                ]

            }

        ]

    },


    /* =====================================================
       FAVORITES
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

            "Le rose, le violet et les tentacules : la perfection !",

            "Natsu fait évidemment partie de mes choses préférées !",

            "Les Poups ont évidemment leur place ici ! 💜"

        ],

        items: [

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
                    "Ma sœur Hylda et Cita",

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

                Nourriture, musique, animaux, univers préférés
                et quelques petites choses capables de me faire
                fuir très loin.

            </p>

        </header>


        <!-- =================================================
             COLUMNS
        ================================================== -->

        <div class="about-tastes__grid">

            <article
                v-for="card in tasteCards"

                :key="card.title"

                class="about-tastes-card"

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

                        :key="item.text"

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