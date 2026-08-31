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
                        "Proche de ma communauté",

                    messages: [

                        "Les Poups sont une grande partie de cette aventure ! 💜",

                        "J'adore partager mes projets avec ma communauté.",

                        "Sans vous, les streams seraient quand même beaucoup moins amusants !",

                        "Les Poups font partie de l'univers de Couaxia ! 🐙"

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
           GAMES
        ===================================================== */

        {
            icon:
                "🎮",

            title:
                "Mes jeux",

            messages: [

                "Bienvenue dans la partie dangereuse : ma bibliothèque de jeux ! 🎮",

                "Il y a beaucoup trop de jeux auxquels j'ai envie de jouer.",

                "Impossible de me limiter à un seul genre !",

                "Choisir le prochain jeu est parfois une aventure à lui tout seul. 👀"

            ],

            items: [

                {
                    text:
                        "Jeux multijoueurs",

                    messages: [

                        "Plus on est nombreux, plus le chaos est efficace ! 🎮",

                        "J'adore jouer avec les Poups et mes amis !",

                        "Le multijoueur crée toujours des moments mémorables.",

                        "Une équipe organisée ? Chez nous ? Hmm... 👀"

                    ]
                },


                {
                    text:
                        "Jeux d’horreur",

                    messages: [

                        "Je n'ai absolument pas peur... AAAAAH ! 👻",

                        "Pourquoi est-ce que je continue à jouer à des jeux d'horreur ?",

                        "Les jumpscares sont une invention humaine particulièrement cruelle.",

                        "Mes tentacules sont prêtes à fuir au premier bruit suspect ! 🐙"

                    ]
                },


                {
                    text:
                        "Jeux narratifs",

                    messages: [

                        "J'adore découvrir une bonne histoire ! 📖",

                        "Les jeux narratifs permettent de vraiment entrer dans un univers.",

                        "Par contre, pas de spoilers ! 👀",

                        "Je veux découvrir chaque rebondissement moi-même !"

                    ]
                },


                {
                    text:
                        "Jeux de survie",

                    messages: [

                        "Objectif numéro un : survivre. Ça semble simple, non ? 👀",

                        "Construire une base pendant que tout essaie de nous tuer... parfait !",

                        "Je suis une excellente survivante ! Enfin, ça dépend des jours.",

                        "Une Kraduk devrait être avantagée dans les jeux de survie, non ?"

                    ]
                },


                {
                    text:
                        "Jeux indépendants",

                    messages: [

                        "Les jeux indépendants cachent tellement de pépites ! ✨",

                        "J'adore découvrir des petits jeux originaux.",

                        "Parfois les aventures les plus mémorables viennent de petits studios !",

                        "Il y a toujours de nouvelles pépites à découvrir."

                    ]
                },


                {
                    text:
                        "Et plein d’autres !",

                    messages: [

                        "Tu pensais vraiment que la liste allait s'arrêter là ? 👀",

                        "Multigaming veut dire BEAUCOUP de jeux ! 🎮",

                        "Ma bibliothèque Steam préfère qu'on ne parle pas du nombre exact.",

                        "Il reste encore énormément d'univers à découvrir !"

                    ]
                }

            ]
        },


        /* =====================================================
           UNIVERSE
        ===================================================== */

        {
            icon:
                "💎",

            title:
                "Mon univers",

            messages: [

                "Bienvenue dans mon petit univers ! 🌌",

                "Mon histoire est beaucoup plus grande que ce qu'on voit en stream.",

                "Saphira, Avadora, Natsu... il y a beaucoup à découvrir !",

                "Chaque élément cache une petite partie de mon histoire. 👀"

            ],

            items: [

                {
                    text:
                        "Avadora",

                    messages: [

                        "Avadora ! Mon fidèle vaisseau spatial ! 🚀",

                        "Sans Avadora, le voyage jusqu'à la Terre aurait été légèrement compliqué.",

                        "Cinq années de voyage spatial... heureusement qu'Avadora était là !",

                        "Mon vaisseau a déjà vu beaucoup de choses. 🌌"

                    ]
                },


                {
                    text:
                        "Les tentacules",

                    messages: [

                        "Enfin le sujet le plus important : LES TENTACULES ! 🐙",

                        "Tu avais remarqué que j'avais quelques tentacules ? 👀",

                        "Une Couaxia sans tentacules ? Impossible !",

                        "Attention, elles ont parfois leur propre personnalité."

                    ]
                },


                {
                    text:
                        "Mes compagnons : Natsu, Hylda et Cita",

                    messages: [

                        "Impossible de parler de mon aventure sans eux ! 💜",

                        "Natsu, Hylda et Cita font partie de mon histoire.",

                        "Mes compagnons ont déjà vécu beaucoup d'aventures avec moi !",

                        "Avec eux, même une mission simple peut devenir chaotique. 👀"

                    ]
                },


                {
                    text:
                        "Mes femmes",

                    messages: [

                        "JE VOUS AIME MES FEMMES ! 💜",

                        "Évidemment qu'elles sont dans la liste !",

                        "Tu pensais vraiment que j'allais les oublier ? 👀",

                        "Une partie extrêmement importante de l'univers Couaxia ! 🐙"

                    ]
                },


                {
                    text:
                        "Les créatures fantastiques",

                    messages: [

                        "Dragons, créatures magiques... j'adore ça ! 🐉",

                        "Certaines créatures de mon univers sont plutôt impressionnantes.",

                        "Natsu est probablement le meilleur exemple !",

                        "Je pourrais remplir un bestiaire entier avec les créatures rencontrées !"

                    ]
                },


                {
                    text:
                        "Les aventures spatiales",

                    messages: [

                        "L'espace est immense... et parfait pour partir à l'aventure ! 🌌",

                        "Cinq années dans l'espace, ça laisse quelques souvenirs.",

                        "Il existe encore tellement de mondes à découvrir !",

                        "Avadora est toujours prête pour une nouvelle destination. 🚀"

                    ]
                },


                {
                    text:
                        "Mes aventures sur Terre",

                    messages: [

                        "Votre planète est vraiment étrange. 👀",

                        "La Terre réserve beaucoup plus de surprises que prévu !",

                        "Entre les humains et le monde magique, je n'ai pas le temps de m'ennuyer.",

                        "Mon arrivée sur Terre n'était que le début d'une nouvelle aventure ! 🌍"

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
                CE QUI ME CARACTÉRISE
            </p>


            <h2
                id="about-preferences-title"
                class="about-preferences__title"
            >

                Ma personnalité

                <span>
                    et mes préférences
                </span>

            </h2>


            <p class="about-preferences__description">

                Quelques petites choses qui permettent
                de mieux comprendre ma personnalité,
                mes goûts et l’univers de Couaxia.

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