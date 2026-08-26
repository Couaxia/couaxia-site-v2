<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface TasteItem {
    icon: string;
    text: string;
}

interface TasteCard {
    type: "like" | "dislike";
    icon: string;
    label: string;
    title: string;
    messages: string[];
    items: TasteItem[];
}


/* =========================================================
   CARDS
========================================================= */

const tasteCards: TasteCard[] = [

    {
        type: "like",

        icon: "💜",

        label:
            "Mes favoris",

        title:
            "Ce que j’aime",

        messages: [
            "Tu as certains goûts en commun avec moi ?",
            "Je vous aime, mes femmes !",
            "Les jeux vidéo et les poulpes, c’est une excellente combinaison !",
            "J’adore partager tout cela avec les Poups !",
            "Le rose, le violet et les tentacules : la perfection !",
            "Natsu fait évidemment partie de mes choses préférées !"
        ],

        items: [

            {
                icon: "🎮",
                text: "Les jeux vidéo et les jeux en coopération"
            },

            {
                icon: "🐙",
                text: "Les poulpes et les créatures fantastiques"
            },

            {
                icon: "🌸",
                text: "Les couleurs rose, violet et bleu"
            },

            {
                icon: "🌌",
                text: "Les univers fantastiques et la science-fiction"
            },

            {
                icon: "🐙",
                text: "Mes femmes 💜"
            },

            {
                icon: "🎨",
                text: "Le dessin, la création et le développement"
            },

            {
                icon: "💬",
                text: "Passer du temps avec ma communauté"
            },

            {
                icon: "🐙",
                text: "Ma sœur Hylda et son amie Cita"
            },

            {
                icon: "🐉",
                text: "Natsu, évidemment"
            }

        ]
    },


    {
        type: "dislike",

        icon: "🚫",

        label:
            "Ce qui me déplaît",

        title:
            "Ce que je n’aime pas",

        messages: [
            "Même une Kraduk a ses limites !",
            "Les spoilers ? Quelle horreur !",
            "Promis, ici on reste bienveillants.",
            "Les bugs en plein direct sont mes ennemis jurés !",
            "La toxicité n’a pas sa place dans mon univers !",
            "Et les plats épicés… très peu pour moi !"
        ],

        items: [

            {
                icon: "😡",
                text: "La toxicité et le manque de respect"
            },

            {
                icon: "🤐",
                text: "Les spoilers sans avertissement"
            },

            {
                icon: "💔",
                text: "Les bugs qui arrivent en plein live !"
            },

            {
                icon: "📢",
                text: "Les personnes qui parlent uniquement pour rabaisser"
            },

            {
                icon: "💔",
                text: "Voir une communauté se disputer"
            },

            {
                icon: "👻",
                text: "Les jumpscares auxquels je ne suis jamais préparée"
            },

            {
                icon: "🌶️",
                text: "Les plats épicés"
            }

        ]
    }

];


/* =========================================================
   MASCOT MESSAGE
========================================================= */

/*
 * Cette fonction sera reliée à ta mascotte globale.
 * Pour l’instant, on déclenche un événement personnalisé.
 */

function speakWithMascot(
    messages: string[]
) {

    if (
        messages.length === 0
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    const message =
        messages[randomIndex];


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

            <!-- =============================================
                 LIKES
            ============================================== -->

            <article
                v-for="card in tasteCards"
                :key="card.type"
                class="about-tastes-card"
                :class="[
                    `about-tastes-card--${card.type}`
                ]"
                tabindex="0"
                @mouseenter="speakWithMascot(card.messages)"
                @focus="speakWithMascot(card.messages)"
                @click="speakWithMascot(card.messages)"
            >

                <header class="about-tastes-card__header">

                    <div
                        class="about-tastes-card__symbol"
                        :class="[
                            `about-tastes-card__symbol--${card.type}`
                        ]"
                        aria-hidden="true"
                    >
                        {{ card.icon }}
                    
                    </div>


                    <div>

                        <p class="about-tastes-card__eyebrow">
                            {{ card.label }}
                        </p>


                        <h3 class="about-tastes-card__title">
                             {{ card.title }}
                        </h3>

                    </div>

                </header>


                <ul class="about-tastes-card__list">

                    <li
                        v-for="item in card.items"
                        :key="item.text"
                        class="about-tastes-card__item"
                    >

                        <span
                            class="about-tastes-card__icon"
                            aria-hidden="true"
                        >
                            {{ item.icon }}
                        </span>


                        <span class="about-tastes-card__text">
                            {{ item.text }}
                        </span>

                    </li>

                </ul>

            </article>

        </div>

    </section>

</template>