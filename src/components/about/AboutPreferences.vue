<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface PreferenceItem {

    text:
        string;

    messages:
        string[];

}


interface PreferenceCard {

    icon:
        string;

    title:
        string;

    messages:
        string[];

    items:
        PreferenceItem[];

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
   PREFERENCES
========================================================= */

const preferences:
    PreferenceCard[] = [

        /* =====================================================
           PERSONALITY
        ===================================================== */

        {

            icon:
                "💬",

            title:
                "Ma personnalité",

            messages: [

                "Tu veux découvrir mon caractère ? 👀",

                "Attention, cette liste ne montre que la partie raisonnable !",

                "Je suis parfaitement calme et sérieuse... évidemment. 🐙",

                "Quelques indices pour comprendre la Kraduk derrière les tentacules !"

            ],

            items: [

                {

                    text:
                        "Positive et accueillante",

                    messages: [

                        "J'essaie toujours de garder une ambiance positive ! 💜",

                        "Tout le monde doit pouvoir se sentir bien ici.",

                        "Une bonne ambiance, c'est important pour moi !",

                        "Bienvenue chez les Poups ! 🐙"

                    ]

                },


                {

                    text:
                        "Curieuse",

                    messages: [

                        "Je veux toujours découvrir de nouvelles choses ! 👀",

                        "Ma curiosité m'a quand même amenée jusqu'à la Terre...",

                        "Qu'est-ce qu'il y a derrière ce bouton ? Et celui-là ? Et celui-là ?",

                        "La curiosité est une excellente excuse pour partir à l'aventure !"

                    ]

                },


                {

                    text:
                        "Un peu chaotique",

                    messages: [

                        "UN PEU chaotique. J'insiste sur le « un peu ». 👀",

                        "Le chaos fait partie de l'expérience Couaxia !",

                        "Je contrôle parfaitement la situation... généralement.",

                        "Ce n'est pas du chaos, c'est de l'improvisation intergalactique ! 🐙"

                    ]

                },


                {

                    text:
                        "Passionnée",

                    messages: [

                        "Quand quelque chose me plaît, je m'investis à fond ! 💜",

                        "Je pourrais parler pendant des heures de mes projets !",

                        "Créer de nouvelles choses me motive énormément.",

                        "Une Kraduk passionnée est difficile à arrêter !"

                    ]

                },


                {

                    text:
                        "Joyeuse et souriante",

                    messages: [

                        "Un sourire et c'est déjà une bonne journée ! ✨",

                        "J'aime transmettre ma bonne humeur pendant les streams.",

                        "Bon... sauf quand un jeu décide de me faire souffrir. 👀",

                        "Normalement, tu devrais m'entendre rire assez souvent !"

                    ]

                },


                {

                    text:
                        "Drôle",

                    messages: [

                        "Je suis drôle ! Enfin... moi je rigole à mes blagues. 😂",

                        "Les blagues nulles comptent aussi comme de l'humour !",

                        "Attention, certaines de mes blagues sont probablement interdites sur Saphira.",

                        "Si personne ne rigole, je peux toujours rire toute seule !"

                    ]

                },


                {

                    text:
                        "Attachante",

                    messages: [

                        "Attachante ? C'est vous qui le dites ! 👀💜",

                        "Attention, adopter une Couaxia demande beaucoup de nourriture.",

                        "Les tentacules donnent peut-être un bonus d'affection. 🐙",

                        "Je vais finir par rougir si tu continues de regarder cette ligne !"

                    ]

                }

            ]

        },


        /* =====================================================
           STREAM
        ===================================================== */

        {

            icon:
                "🎙️",

            title:
                "En stream",

            messages: [

                "Bienvenue dans mon environnement naturel : un stream légèrement chaotique. 👀",

                "On ne sait pas toujours ce qui va se passer... moi non plus !",

                "Un stream Couaxia calme ? Ça existe sûrement quelque part.",

                "Prépare-toi, le chaos peut arriver à tout moment ! 🐙"

            ],

            items: [

                {

                    text:
                        "Beaucoup d’improvisation",

                    messages: [

                        "Préparer un plan c'est bien. Ne pas le suivre, c'est encore mieux !",

                        "Je sais parfaitement où je vais... normalement. 👀",

                        "Une bonne partie du stream se construit sur le moment.",

                        "L'improvisation fait souvent les meilleurs souvenirs !"

                    ]

                },


                {

                    text:
                        "De l’humour et du second degré",

                    messages: [

                        "Il vaut mieux ne pas prendre toutes mes phrases trop au sérieux. 😂",

                        "L'humour est une partie importante de mes streams !",

                        "Oui, même les blagues nulles sont autorisées.",

                        "Le second degré voyage très bien dans l'espace. 🐙"

                    ]

                },


                {

                    text:
                        "Des découvertes et des réactions spontanées",

                    messages: [

                        "Découvrir quelque chose en direct, c'est toujours plus drôle !",

                        "Mes réactions ne sont absolument jamais exagérées... 👀",

                        "J'adore découvrir de nouveaux jeux avec les Poups.",

                        "La première réaction est souvent la meilleure !"

                    ]

                },


                {

                    text:
                        "Un peu de chaos",

                    messages: [

                        "Ce n'est pas un bug, c'est une fonctionnalité Couaxia. 👀",

                        "Un stream trop calme devient rapidement suspect.",

                        "Le chaos finit toujours par trouver son chemin.",

                        "Mes tentacules n'ont évidemment rien à voir avec ça. 🐙"

                    ]

                },


                {

                    text:
                        "Des moments chill entre deux catastrophes",

                    messages: [

                        "Parfois nous savons être calmes. Parfois.",

                        "Il faut bien quelques moments tranquilles entre deux catastrophes !",

                        "Un petit moment chill fait toujours du bien.",

                        "Profite du calme avant que quelque chose ne casse. 👀"

                    ]

                },


                {

                    text:
                        "Des souvenirs plutôt que de la performance",

                    messages: [

                        "Le but principal est surtout de passer un bon moment ensemble. 💜",

                        "Être la meilleure joueuse du monde ? On verra plus tard. 😂",

                        "Les bons souvenirs valent beaucoup plus qu'un classement.",

                        "Une partie ratée peut quand même devenir un excellent moment !"

                    ]

                }

            ]

        },


        /* =====================================================
           COMMUNITY
        ===================================================== */

        {

            icon:
                "💜",

            title:
                "Avec les Poups",

            messages: [

                "Les Poups sont une énorme partie de cette aventure ! 💜",

                "Un stream sans les Poups serait beaucoup moins amusant.",

                "Vous faites vraiment partie de l'univers de Couaxia ! 🐙",

                "Attention, rester trop longtemps ici peut transformer quelqu'un en Poup. 👀"

            ],

            items: [

                {

                    text:
                        "Une communauté bienveillante",

                    messages: [

                        "Le respect reste la base ici. 💜",

                        "Tout le monde doit pouvoir passer un bon moment.",

                        "Bienveillance et respect avant tout !",

                        "Les Poups prennent soin les uns des autres."

                    ]

                },


                {

                    text:
                        "Partager les bons comme les mauvais moments",

                    messages: [

                        "Même les fails deviennent de bons souvenirs ensemble !",

                        "Un bug est moins terrible quand tout le monde peut en rire.",

                        "On partage les victoires... et les catastrophes. 😂",

                        "Les meilleurs moments ne sont pas toujours ceux qui étaient prévus."

                    ]

                },


                {

                    text:
                        "Faire participer la communauté",

                    messages: [

                        "Sondages, discussions, jeux... les Poups ont leur mot à dire !",

                        "J'aime beaucoup vous faire participer à mes projets.",

                        "Certaines de vos idées sont excellentes... d'autres sont dangereuses. 👀",

                        "Les Poups influencent parfois beaucoup trop mes décisions ! 😂"

                    ]

                },


                {

                    text:
                        "Créer des souvenirs ensemble",

                    messages: [

                        "C'est probablement ce que je préfère dans le streaming. 💜",

                        "Un bon souvenir partagé vaut toutes les victoires.",

                        "Les meilleurs moments viennent souvent de choses complètement imprévues.",

                        "Chaque stream ajoute quelques souvenirs à l'aventure."

                    ]

                },


                {

                    text:
                        "Garder un espace agréable et amusant",

                    messages: [

                        "Du respect, des bêtises et beaucoup de tentacules.",

                        "L'objectif reste de passer un bon moment ensemble !",

                        "Pas besoin de drama pour s'amuser. 💜",

                        "Un peu de chaos oui, de toxicité non !"

                    ]

                },


                {

                    text:
                        "Être proche de ma communauté",

                    messages: [

                        "J'aime énormément échanger avec les Poups ! 💜",

                        "Vous faites partie de l'aventure depuis le début.",

                        "Sans vous, Couaxia serait quand même beaucoup plus seule dans l'espace.",

                        "Ma communauté est une partie importante de mon univers."

                    ]

                }

            ]

        }

    ];

</script>


<template>

    <section
        class="about-preferences"
        aria-labelledby="about-preferences-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-preferences__header">

            <p class="about-preferences__eyebrow">
                DERRIÈRE LES STREAMS
            </p>


            <h2
                id="about-preferences-title"
                class="about-preferences__title"
            >

                Ma personnalité

                <span>
                    côté stream
                </span>

            </h2>


            <p class="about-preferences__description">

                Mon caractère, ma façon de streamer et
                la relation que j’aime construire avec les Poups.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="about-preferences__grid">

            <article
                v-for="preference in preferences"

                :key="
                    preference.title
                "

                class="
                    about-preference-card
                "

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        preference.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        preference.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     HEADER
                ========================================== -->

                <header
                    class="
                        about-preference-card__header
                    "
                >

                    <div
                        class="
                            about-preference-card__icon
                        "

                        aria-hidden="true"
                    >
                        {{ preference.icon }}
                    </div>


                    <h3
                        class="
                            about-preference-card__title
                        "
                    >
                        {{ preference.title }}
                    </h3>

                </header>


                <!-- =========================================
                     LIST
                ========================================== -->

                <ul
                    class="
                        about-preference-card__list
                    "
                >

                    <li
                        v-for="item in preference.items"

                        :key="
                            item.text
                        "

                        class="
                            about-preference-card__item
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
                                about-preference-card__bullet
                            "

                            aria-hidden="true"
                        ></span>


                        <span>
                            {{ item.text }}
                        </span>

                    </li>

                </ul>

            </article>

        </div>

    </section>

</template>