<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface GameCategory {
    icon: string;
    title: string;
    description: string;
    tags: string[];
    messages: string[];
}


/* =========================================================
   CATEGORIES
========================================================= */

const categories: GameCategory[] = [

    {
        icon: "👻",

        title:
            "Horreur",

        description:
            "Des jeux parfaits pour me faire sursauter, paniquer et regretter mes décisions en direct.",

        tags: [
            "Survie",
            "Jumpscares",
            "Ambiance"
        ],

        messages: [
            "Les jeux d’horreur et moi… c’est une relation compliquée.",
            "Je suis courageuse ! Enfin… presque.",
            "Pourquoi les monstres courent toujours plus vite que moi ?",
            "Les jumpscares sont clairement une invention du démon."
        ]
    },

    {
        icon: "🤝",

        title:
            "Coopération",

        description:
            "Des aventures à plusieurs où l’entraide fonctionne… jusqu’au moment où tout part en chaos.",

        tags: [
            "Coop",
            "Multijoueur",
            "Fun"
        ],

        messages: [
            "À plusieurs, tout est toujours plus chaotique !",
            "La coopération, c’est important… normalement.",
            "Avec les Poups, même les missions simples deviennent compliquées.",
            "Promis, je n’abandonne personne derrière… normalement."
        ]
    },

    {
        icon: "📖",

        title:
            "Narratif",

        description:
            "Des histoires fortes, des choix parfois difficiles et des univers dans lesquels j’adore me perdre.",

        tags: [
            "Histoire",
            "Choix",
            "Aventure"
        ],

        messages: [
            "J’adore découvrir une bonne histoire.",
            "Les choix impossibles dans les jeux narratifs… quelle souffrance !",
            "Je m’attache toujours beaucoup trop vite aux personnages.",
            "Une bonne aventure peut rester longtemps dans mes souvenirs."
        ]
    },

    {
        icon: "🌍",

        title:
            "Exploration",

        description:
            "Découvrir de nouveaux mondes, fouiller partout et prendre trois heures pour suivre la quête principale.",

        tags: [
            "Exploration",
            "Open world",
            "Découverte"
        ],

        messages: [
            "La quête principale peut attendre, j’ai vu quelque chose au loin !",
            "Explorer chaque recoin est absolument nécessaire.",
            "Oui, je peux passer une heure à chercher un coffre.",
            "Les grands mondes me donnent toujours envie de tout découvrir."
        ]
    },

    {
        icon: "⚔️",

        title:
            "Action",

        description:
            "Du rythme, des combats et parfois beaucoup trop de boutons sur lesquels appuyer en même temps.",

        tags: [
            "Combat",
            "Action",
            "Aventure"
        ],

        messages: [
            "Quand ça bouge partout, c’est forcément une bonne idée !",
            "Plus il y a d’action, plus mes tentacules travaillent.",
            "J’appuie sur tous les boutons et parfois ça fonctionne.",
            "Les combats épiques, j’adore ça !"
        ]
    },

    {
        icon: "🎉",

        title:
            "Jeux fun",

        description:
            "Les jeux parfaits pour rire, se défier et créer des moments complètement absurdes en stream.",

        tags: [
            "Party game",
            "Défis",
            "Chaos"
        ],

        messages: [
            "Le chaos entre amis, c’est magnifique.",
            "Qui a dit qu’il fallait jouer sérieusement ?",
            "Le plus important, c’est de rire !",
            "Ces jeux sont responsables de beaucoup trop de moments absurdes."
        ]
    }

];


/* =========================================================
   MASCOT
========================================================= */

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
                :key="category.title"
                class="games-category-card"
                tabindex="0"
                @mouseenter="
                    speakWithMascot(
                        category.messages
                    )
                "
                @focus="
                    speakWithMascot(
                        category.messages
                    )
                "
                @click="
                    speakWithMascot(
                        category.messages
                    )
                "
            >

                <!-- =========================================
                     ICON
                ========================================== -->

                <div
                    class="games-category-card__icon"
                    aria-hidden="true"
                >
                    {{ category.icon }}
                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div class="games-category-card__content">

                    <h3 class="games-category-card__title">
                        {{ category.title }}
                    </h3>


                    <p class="games-category-card__description">
                        {{ category.description }}
                    </p>


                    <!-- =====================================
                         TAGS
                    ====================================== -->

                    <div class="games-category-card__tags">

                        <span
                            v-for="tag in category.tags"
                            :key="tag"
                            class="games-category-card__tag"
                        >
                            {{ tag }}
                        </span>

                    </div>

                </div>

            </article>

        </div>

    </section>

</template>