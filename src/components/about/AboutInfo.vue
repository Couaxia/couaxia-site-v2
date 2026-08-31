<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface Tag {

    label:
        string;

    messages:
        string[];

}


interface InfoCard {

    icon:
        string;

    title:
        string;

    value?:
        string;

    tags?:
        Tag[];

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
   INFORMATIONS
========================================================= */

const informations:
    InfoCard[] = [

        /* =====================================================
           PSEUDO
        ===================================================== */

        {
            icon:
                "🐙",

            title:
                "Pseudo",

            value:
                "Couaxia",

            messages: [

                "Couaxia ! Oui oui, c'est moi ! 🐙",

                "Tu connais maintenant mon petit nom ! 💜",

                "Couaxia... un nom parfaitement normal pour une Kraduk.",

                "Facile à retenir : Couaxia et beaucoup de tentacules !"

            ]
        },


        /* =====================================================
           GENRE
        ===================================================== */

        {
            icon:
                "♀️",

            title:
                "Genre",

            value:
                "Femme",

            messages: [

                "Une Kraduk, oui madame ! 💜",

                "Une femme, quelques tentacules et beaucoup trop d'énergie !",

                "Rien de très mystérieux ici ! 👀"

            ]
        },


        /* =====================================================
           ÂGE
        ===================================================== */

        {
            icon:
                "🎂",

            title:
                "Âge",

            value:
                "126 ans (26 ans humain)",

            messages: [

                "126 ans ? Je suis encore jeune pour une Kraduk ! 👀",

                "Sur Terre ça correspond à environ 26 ans !",

                "Non, je ne suis pas vieille ! C'est vous les humains qui vieillissez vite ! 😂",

                "Le temps ne passe pas exactement pareil quand on vient de Saphira. 🌌"

            ]
        },


        /* =====================================================
           POIDS
        ===================================================== */

        {
            icon:
                "⚖️",

            title:
                "Poids",

            value:
                "65 kg",

            messages: [

                "On ne demande normalement pas son poids à une dame ! 👀",

                "65 kg... les tentacules sont incluses dans le calcul ?",

                "Les voyages spatiaux, ça entretient ! 🚀"

            ]
        },


        /* =====================================================
           TAILLE
        ===================================================== */

        {
            icon:
                "📏",

            title:
                "Taille",

            value:
                "1,60 m",

            messages: [

                "1,60 m ! Parfaitement à la bonne hauteur !",

                "Petite ? Moi ? Absolument pas ! 😤",

                "Ce qui compte, c'est la taille des tentacules ! 🐙",

                "Je fais 1,60 m... sans compter toute mon énergie !"

            ]
        },


        /* =====================================================
           ASTROLOGIE
        ===================================================== */

        {
            icon:
                "♉",

            title:
                "Signe astrologique",

            value:
                "Taureau",

            messages: [

                "Taureau ! Ça explique peut-être mon caractère. 👀",

                "Têtue ? Moi ? Jamais ! ... enfin presque.",

                "Taureau jusque sur une autre planète ! ✨"

            ]
        },


        /* =====================================================
           ESPÈCE
        ===================================================== */

        {
            icon:
                "🐙",

            title:
                "Espèce",

            value:
                "Poulpe de l’espace de la race des Kraduks",

            messages: [

                "Je suis une Kraduk venue de la planète Saphira ! 🌌",

                "Oui, techniquement je suis un poulpe de l'espace. 🐙",

                "Les Kraduks sont beaucoup plus intéressants que les humains... évidemment !",

                "Tentacules + espace = Kraduk !"

            ]
        },


        /* =====================================================
           LANGUE
        ===================================================== */

        {
            icon:
                "🇫🇷",

            title:
                "Langue",

            value:
                "Français",

            messages: [

                "Baguette, fromage, saucisson ! 🇫🇷",

                "Les streams sont principalement en français !",

                "J'ai appris le français après mon arrivée sur Terre... enfin, presque ! 👀",

                "Tu entendras sûrement quelques expressions bien françaises ici !"

            ]
        },


        /* =====================================================
           CONTENU
        ===================================================== */

        {
            icon:
                "🎮",

            title:
                "Contenu",

            value:
                "Multigaming",

            messages: [

                "Impossible de me limiter à un seul jeu ! 🎮",

                "Du chill, de l'horreur, du multijoueur... j'aime tout essayer !",

                "Chez moi, on change souvent d'univers !",

                "Multigaming veut surtout dire : beaucoup trop de jeux dans ma bibliothèque. 👀"

            ]
        },


        /* =====================================================
           COMMUNAUTÉ
        ===================================================== */

        {
            icon:
                "💜",

            title:
                "Communauté",

            value:
                "Les Poups",

            messages: [

                "Les Poups ! Ma petite communauté adorée ! 💜",

                "Si tu restes assez longtemps, tu deviendras peut-être un Poup toi aussi ! 🐙",

                "Les Poups prennent soin les uns des autres.",

                "Une Kraduk sans ses Poups, ce serait beaucoup moins drôle !"

            ]
        },


        /* =====================================================
           AMBIANCE
        ===================================================== */

        {
            icon:
                "✨",

            title:
                "Ambiance",

            value:
                "Humour et bonne humeur",

            messages: [

                "Ici, l'objectif principal est de passer un bon moment ! 💜",

                "Humour, bonne humeur... et parfois beaucoup de chaos.",

                "On essaie d'être sages... mais ce n'est pas toujours gagné ! 😂",

                "Installe-toi confortablement, ici on aime rigoler !"

            ]
        },


        /* =====================================================
           NOURRITURE
        ===================================================== */

        {
            icon:
                "😋",

            title:
                "Carburant de Couaxia",

            messages: [

                "Il faut bien nourrir une Kraduk ! 😋",

                "Attention, cette partie donne faim.",

                "Voici quelques excellentes sources d'énergie intergalactique !",

                "La nourriture est une affaire très sérieuse. 👀"

            ],

            tags: [

                {
                    label:
                        "🍰 Gâteaux",

                    messages: [

                        "Miam du sucre !!",

                        "Je pourrais en manger toute la journée !",

                        "Les gâteaux rendent toujours une journée meilleure !",

                        "Le sucre est un excellent carburant intergalactique."

                    ]
                },


                {
                    label:
                        "🥩 Viande",

                    messages: [

                        "De la bonne viande saignante !",

                        "Ça sent le festin !",

                        "Mon côté Kraduk adore ça !",

                        "Un bon morceau de viande et je suis heureuse !"

                    ]
                },


                {
                    label:
                        "🍟 Frites",

                    messages: [

                        "Des FRITES ! Des FRITES ! Des FRITES !",

                        "Mission : ne pas partager mes frites.",

                        "Tu peux vraiment dire non à des frites ?",

                        "Attention à tes doigts si tu touches à mes frites ! 👀"

                    ]
                },


                {
                    label:
                        "🍔 Burgers",

                    messages: [

                        "Je lâcherais bien un croc dedans !",

                        "Un burger bien garni, quel bonheur !",

                        "Ça donne faim rien que d'y penser !",

                        "Avec des frites à côté évidemment !"

                    ]
                },


                {
                    label:
                        "🧀 Fromages",

                    messages: [

                        "Avec un bon morceau de pain...",

                        "Le fromage, c'est la vie !",

                        "Impossible d'y résister !",

                        "Je pourrais traverser une galaxie entière pour un bon fromage ! Attends... c'est ce que j'ai fait !"

                    ]
                },


                {
                    label:
                        "🍺 Bières",

                    messages: [

                        "Attention, l'abus d'alcool est dangereux pour la santé !",

                        "À consommer avec modération !",

                        "Une bonne bière bien fraîche de temps en temps.",

                        "Même les Kraduks connaissent la modération ! Enfin... normalement."

                    ]
                },


                {
                    label:
                        "🍕 Pizza",

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
           FILMS / SÉRIES
        ===================================================== */

        {
            icon:
                "🎬",

            title:
                "Films / séries",

            value:
                "J'aime regarder tout type de contenu, mais j'aime quand même surtout l'action et la science-fiction !",

            messages: [

                "Une bonne soirée film avec un plaid ? Oui ! 🎬",

                "La science-fiction, évidemment ! Je viens quand même de l'espace. 🌌",

                "Action, aventures et explosions... ça me va !",

                "J'aime découvrir plein de films et séries différents !"

            ]
        },


        /* =====================================================
           MUSIQUES
        ===================================================== */

        {
            icon:
                "🎵",

            title:
                "Musiques",

            messages: [

                "Il y a presque toujours de la musique quelque part dans ma tête ! 🎵",

                "Impossible de choisir un seul style musical.",

                "Tu écoutes quoi en ce moment ? 👀",

                "Une bonne musique peut complètement changer une ambiance !"

            ],

            tags: [

                {
                    label:
                        "🎤 K-Pop",

                    messages: [

                        "Impossible de résister à la K-Pop !",

                        "Attention, je risque de commencer à danser !",

                        "Certaines chansons restent beaucoup trop longtemps dans ma tête !"

                    ]
                },


                {
                    label:
                        "🌸 Openings d'animés",

                    messages: [

                        "Les openings d'animés restent gravés dans ma tête !",

                        "Tu les passes aussi sans jamais les skip ? 👀",

                        "Certains openings sont beaucoup trop bons !"

                    ]
                },


                {
                    label:
                        "🎸 Rock",

                    messages: [

                        "Le rock donne tellement d'énergie !",

                        "Monte le volume ! 🎸",

                        "Parfait pour réveiller une Kraduk !"

                    ]
                },


                {
                    label:
                        "🔥 Rap",

                    messages: [

                        "Il y a tellement de styles différents dans le rap !",

                        "Un bon flow et c'est parti !",

                        "J'aime découvrir de nouveaux artistes."

                    ]
                },


                {
                    label:
                        "🎻 Classique",

                    messages: [

                        "La musique classique est parfaite pour se détendre.",

                        "Un petit moment calme entre deux catastrophes !",

                        "Même une Kraduk chaotique sait apprécier le classique. 👀"

                    ]
                },


                {
                    label:
                        "🎧 Tous les styles",

                    messages: [

                        "J'aime découvrir de nouveaux styles musicaux !",

                        "Ma playlist est probablement beaucoup trop variée.",

                        "Pourquoi choisir quand on peut écouter un peu de tout ?"

                    ]
                }

            ]
        },


        /* =====================================================
           ANIMAUX
        ===================================================== */

        {
            icon:
                "🐾",

            title:
                "Animaux préférés",

            messages: [

                "Les créatures de votre planète sont fascinantes ! 🐾",

                "Bon... certaines créatures de Saphira sont quand même plus impressionnantes.",

                "J'aime beaucoup trop d'animaux pour n'en choisir qu'un !"

            ],

            tags: [

                {
                    label:
                        "🐙 Poulpes",

                    messages: [

                        "Les poulpes sont les meilleurs !",

                        "J'adore leurs tentacules !",

                        "Je crois que ça se voit que j'aime les poulpes...",

                        "Un jour, je finirai peut-être avec huit tentacules !"

                    ]
                },


                {
                    label:
                        "🌊 Animaux marins",

                    messages: [

                        "Les animaux marins me fascinent !",

                        "Les océans cachent tellement de merveilles !",

                        "Je pourrais passer des heures à observer la vie sous-marine.",

                        "Entre les baleines, les raies et les méduses... je les adore tous !"

                    ]
                },


                {
                    label:
                        "🐈 Félins",

                    messages: [

                        "Impossible de résister à un félin !",

                        "Les chats sont tellement adorables !",

                        "Les félins sont élégants et majestueux.",

                        "J'adore tous les félins, des chats aux tigres !"

                    ]
                },


                {
                    label:
                        "🐉 Dragons",

                    messages: [

                        "Les dragons sont incroyables !",

                        "Depuis que j'ai rencontré Natsu, j'en suis encore plus fan !",

                        "Un dragon, c'est la classe absolue !",

                        "Les dragons me font rêver depuis toujours."

                    ]
                }

            ]
        }

    ];

</script>


<template>

    <section
        class="about-info"
        aria-labelledby="about-info-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="
                about-info__header
                about-info__banner
            "
        >

            <img
                src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Anwedia.png"
                alt=""
                class="about-info__banner-image"
                aria-hidden="true"
            >


            <div
                class="about-info__banner-overlay"
                aria-hidden="true"
            ></div>


            <div class="about-info__banner-content">

                <p class="about-info__eyebrow">
                    FICHE D’IDENTITÉ
                </p>


                <h2
                    id="about-info-title"
                    class="about-info__title"
                >
                    Quelques infos sur moi
                </h2>


                <p class="about-info__description">

                    Quelques petites informations pour mieux
                    connaître la créature derrière les tentacules.

                </p>

            </div>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="about-info__grid">

            <article
                v-for="info in informations"

                :key="
                    info.title
                "

                class="
                    about-info-card
                "

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        info.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        info.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     ICON
                ========================================== -->

                <span
                    class="
                        about-info-icon
                    "

                    aria-hidden="true"
                >
                    {{ info.icon }}
                </span>


                <!-- =========================================
                     TITLE
                ========================================== -->

                <h3>
                    {{ info.title }}
                </h3>


                <!-- =========================================
                     SIMPLE VALUE
                ========================================== -->

                <p
                    v-if="
                        info.value
                    "
                >
                    {{ info.value }}
                </p>


                <!-- =========================================
                     TAGS
                ========================================== -->

                <div
                    v-if="
                        info.tags
                    "

                    class="
                        about-tags
                    "
                >

                    <span
                        v-for="tag in info.tags"

                        :key="
                            tag.label
                        "

                        class="
                            about-tag
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

            </article>

        </div>

    </section>

</template>