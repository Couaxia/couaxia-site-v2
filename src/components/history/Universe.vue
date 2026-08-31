<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface UniverseItem {

    id:
        string;

    icon:
        string;

    eyebrow:
        string;

    title:
        string;

    description:
        string;

    facts:
        string[];

    tags:
        string[];

    messages:
        string[];

    highlight?:
        boolean;

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
            400
        );

}


/* =========================================================
   STOP MASCOT HOVER
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
   SECTION MESSAGES
========================================================= */

const universeMessages = [

    "Bienvenue dans les archives de mon univers. 🌌",

    "Il n’y a pas que des personnages dans cette histoire !",

    "Planètes, pouvoirs, magie... il y a encore beaucoup de choses à découvrir.",

    "Tu veux comprendre comment fonctionne mon univers ? Tu es au bon endroit. 👀",

    "Certains éléments du lore sont un peu... particuliers. 🐙",

    "Et encore, je ne vous ai pas tout raconté."

];


/* =========================================================
   UNIVERSE ITEMS
========================================================= */

const universeItems:
    UniverseItem[] = [

        /* =====================================================
           SAPHIRA
        ===================================================== */

        {
            id:
                "saphira",

            icon:
                "🌌",

            eyebrow:
                "PLANÈTE D’ORIGINE",

            title:
                "Saphira",

            description:
                "Saphira est la planète natale de Couaxia, Hylda et des Kraduks. C’est là que commence toute l’histoire.",

            facts: [

                "Saphira est le monde d’origine du peuple Kraduk.",

                "Couaxia y commence sa formation de pilote dès l’âge de 10 ans.",

                "C’est depuis Saphira qu’Avadora quitte finalement son monde natal avec Couaxia, Hylda et Cita."

            ],

            tags: [
                "Planète",
                "Kraduks",
                "Origine",
                "Départ"
            ],

            messages: [

                "Saphira... ma planète natale. 🌌",

                "Tout commence ici.",

                "La Terre est vraiment très différente de Saphira.",

                "C’est sur Saphira que j’ai appris à piloter.",

                "Un jour, je vous montrerai peut-être encore plus de choses sur Saphira. 👀"

            ],

            highlight:
                true
        },


        /* =====================================================
           KRADUKS
        ===================================================== */

        {
            id:
                "kraduks",

            icon:
                "🐙",

            eyebrow:
                "PEUPLE",

            title:
                "Les Kraduks",

            description:
                "Les Kraduks sont le peuple dont sont originaires Couaxia et Hylda.",

            facts: [

                "Ils sont originaires de Saphira.",

                "Leur apparence et leur physiologie possèdent plusieurs particularités.",

                "Les tentacules de Couaxia font partie de cette identité Kraduk."

            ],

            tags: [
                "Peuple",
                "Saphira",
                "Tentacules",
                "Kraduk"
            ],

            messages: [

                "Les Kraduks, c’est mon peuple ! 🐙",

                "Oui, les tentacules sont parfaitement normales chez nous.",

                "Je vois vos regards sur mes tentacules. 👀",

                "Les Kraduks possèdent quelques capacités assez intéressantes.",

                "Vous allez encore entendre parler de mon peuple."

            ],

            highlight:
                true
        },


        /* =====================================================
           DRAQUIN
        ===================================================== */

        {
            id:
                "draquin",

            icon:
                "🪐",

            eyebrow:
                "PLANÈTE EXPLORÉE",

            title:
                "Draquin",

            description:
                "Draquin est la première planète importante découverte après les cinq années de voyage à bord d’Avadora.",

            facts: [

                "Son atmosphère est compatible avec les besoins des Kraduks.",

                "Couaxia décide d’explorer sa surface.",

                "C’est sur Draquin qu’elle rencontre Natsu pour la première fois."

            ],

            tags: [
                "Planète",
                "Exploration",
                "Natsu",
                "Drasquin"
            ],

            messages: [

                "Draquin semblait paisible... pendant environ cinq minutes. 👀",

                "Une planète inconnue avec une atmosphère respirable ? Évidemment que j’ai voulu descendre.",

                "C’est ici que j’ai rencontré Natsu.",

                "Draquin a changé la suite de mon voyage.",

                "Je n’oublierai clairement jamais cette planète. 🐉"

            ]
        },


        /* =====================================================
           COMPRESSION
        ===================================================== */

        {
            id:
                "compression",

            icon:
                "🧬",

            eyebrow:
                "CAPACITÉ",

            title:
                "Compression organique adaptative",

            description:
                "Une capacité biologique particulière permettant à Natsu d’adapter considérablement sa taille.",

            facts: [

                "Natsu peut passer d’une taille gigantesque à celle d’un grand félin.",

                "Sa structure corporelle se compresse sans perdre sa forme générale.",

                "Son besoin en nourriture reste cependant identique malgré la réduction de taille."

            ],

            tags: [
                "Capacité",
                "Natsu",
                "Biologie",
                "Transformation"
            ],

            messages: [

                "Oui, Natsu peut devenir beaucoup plus petit ! 🐉",

                "Très pratique pour voyager avec un dragon-requin géant.",

                "La taille change... l’appétit, malheureusement, beaucoup moins. 😂",

                "Compression organique adaptative. Ça sonne plutôt scientifique, non ?",

                "Imagine devoir faire entrer Natsu dans Avadora sans cette capacité. 👀"

            ],

            highlight:
                true
        },


        /* =====================================================
           MAGIC MARKET
        ===================================================== */

        {
            id:
                "magic-market",

            icon:
                "🔮",

            eyebrow:
                "LIEU MAGIQUE",

            title:
                "Le marché magique",

            description:
                "Un marché dissimulé sur Terre et invisible aux humains ordinaires.",

            facts: [

                "Il est fréquenté par de nombreuses créatures et populations magiques.",

                "Les humains ordinaires ne semblent pas percevoir son existence.",

                "C’est ici que Couaxia rencontre Myo pour la première fois."

            ],

            tags: [
                "Terre",
                "Magie",
                "Marché",
                "Myo"
            ],

            messages: [

                "Vous aviez vraiment un marché magique caché sur Terre. 🔮",

                "Et les humains passent juste à côté sans rien remarquer !",

                "Mon premier contact avec la Terre était... original.",

                "C’est ici que j’ai rencontré Myo.",

                "Ce marché cache probablement encore quelques secrets. 👀"

            ],

            highlight:
                true
        },


        /* =====================================================
           MAGIC KINGDOM
        ===================================================== */

        {
            id:
                "magic-kingdom",

            icon:
                "🏰",

            eyebrow:
                "ROYAUME",

            title:
                "Le royaume magique",

            description:
                "Un territoire magique lié au marché rencontré par Couaxia après son arrivée sur Terre.",

            facts: [

                "Le royaume appartient à Myo.",

                "Couaxia ne découvre pas immédiatement la véritable position de la faunette.",

                "Ce monde magique ouvre une nouvelle étape de son aventure terrestre."

            ],

            tags: [
                "Royaume",
                "Magie",
                "Myo",
                "Terre"
            ],

            messages: [

                "Oui... Myo possède vraiment un royaume. 👀",

                "Petit détail qu’elle avait oublié de mentionner au début !",

                "La Terre cachait décidément beaucoup de choses.",

                "Le royaume magique devient important après mon arrivée.",

                "Et vous pensiez que mon histoire allait devenir plus simple sur Terre ? 😂"

            ]
        }

    ];


/* =========================================================
   ITEM MASCOT
========================================================= */

function speakAboutItem(
    item:
        UniverseItem
) {

    startMascotHover(
        item.messages
    );

}


/* =========================================================
   FACT MASCOT
========================================================= */

function speakAboutFact(
    item:
        UniverseItem,

    fact:
        string
) {

    startMascotHover(
        [

            fact,

            `Encore une information sur ${item.title}. 👀`,

            `Ça fait partie du lore de ${item.title}.`,

            `Tu prends des notes ? Il commence à y avoir beaucoup de lore ! 📖`

        ]
    );

}


/* =========================================================
   TAG MASCOT
========================================================= */

function speakAboutTag(
    item:
        UniverseItem,

    tag:
        string
) {

    startMascotHover(
        [

            `${tag} est lié à ${item.title}.`,

            `${item.title} fait partie de la catégorie « ${tag} ».`,

            `Encore un indice pour comprendre ${item.title}. 👀`,

            `${tag} revient à plusieurs endroits dans mon histoire.`

        ]
    );

}


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();

    }
);

</script>


<template>

    <section
        id="history-universe"
        class="history-universe"
        aria-labelledby="history-universe-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="history-universe__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    universeMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    universeMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <p class="history-universe__eyebrow">
                LE CODEX
            </p>


            <h2
                id="history-universe-title"
                class="history-universe__title"
            >

                Comprendre

                <span>
                    l’univers
                </span>

            </h2>


            <p class="history-universe__description">

                Planètes, peuples, capacités et lieux
                mystérieux : retrouve ici quelques éléments
                essentiels pour mieux comprendre le lore
                de Couaxia.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="history-universe__grid">

            <article
                v-for="item in universeItems"

                :key="
                    item.id
                "

                class="
                    history-universe-card
                "

                :class="{
                    'history-universe-card--highlight':
                        item.highlight
                }"

                tabindex="0"

                @mouseenter="
                    speakAboutItem(
                        item
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    speakAboutItem(
                        item
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     TOP
                ========================================== -->

                <div class="history-universe-card__top">

                    <div
                        class="history-universe-card__icon"
                        aria-hidden="true"
                    >
                        {{ item.icon }}
                    </div>


                    <div>

                        <p class="history-universe-card__eyebrow">
                            {{ item.eyebrow }}
                        </p>


                        <h3 class="history-universe-card__title">
                            {{ item.title }}
                        </h3>

                    </div>

                </div>


                <!-- =========================================
                     DESCRIPTION
                ========================================== -->

                <p class="history-universe-card__description">
                    {{ item.description }}
                </p>


                <!-- =========================================
                     FACTS
                ========================================== -->

                <ul class="history-universe-card__facts">

                    <li
                        v-for="fact in item.facts"

                        :key="
                            fact
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            speakAboutFact(
                                item,
                                fact
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutFact(
                                item,
                                fact
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            class="history-universe-card__fact-icon"
                            aria-hidden="true"
                        >
                            ✦
                        </span>


                        <span>
                            {{ fact }}
                        </span>

                    </li>

                </ul>


                <!-- =========================================
                     TAGS
                ========================================== -->

                <div class="history-universe-card__tags">

                    <span
                        v-for="tag in item.tags"

                        :key="
                            tag
                        "

                        class="
                            history-universe-card__tag
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            speakAboutTag(
                                item,
                                tag
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutTag(
                                item,
                                tag
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >
                        {{ tag }}
                    </span>

                </div>


                <!-- =========================================
                     HIGHLIGHT
                ========================================== -->

                <span
                    v-if="
                        item.highlight
                    "

                    class="
                        history-universe-card__badge
                    "
                >
                    ✦ Élément important
                </span>

            </article>

        </div>


        <!-- =================================================
             ENDING
        ================================================== -->

        <div class="history-universe__ending">

            <span
                class="history-universe__ending-icon"
                aria-hidden="true"
            >
                🌌
            </span>


            <div>

                <strong>
                    Le codex est encore loin d’être complet...
                </strong>


                <p>

                    De nouvelles planètes, créatures,
                    pouvoirs et lieux apparaîtront
                    progressivement avec la suite
                    de l’histoire.

                </p>

            </div>

        </div>

    </section>

</template>