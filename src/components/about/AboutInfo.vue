<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */
interface Tag {

    label: string;
    messages?: string[];

}
interface InfoCard {

    icon: string;
    title: string;
    value?: string;
    tags?: Tag[];

}


/* =========================================================
   INFORMATIONS
========================================================= */

const informations: InfoCard[] = [

    {
        icon: "🐙",
        title: "Pseudo",
        value: "Couaxia"
    },

    {
        icon: "♀️",
        title: "Genre",
        value: "Femme"
    },

    {
        icon: "🎂",
        title: "Âge",
        value: "126 ans"
    },

    {
        icon: "⚖️",
        title: "Poids",
        value: "65 kg"
    },

    {
        icon: "📏",
        title: "Taille",
        value: "1,60 m"
    },

    {
        icon: "♉",
        title: "Signe astrologique",
        value: "Taureau"
    },

    {
        icon: "🐙",
        title: "Espèce",
        value: "Poulpe de l’espace de la race des Kraduks"
    },

    {
        icon: "🇫🇷",
        title: "Langue",
        value: "Français"
    },

    {
        icon: "🎮",
        title: "Contenu",
        value: "Multigaming"
    },

    {
        icon: "💜",
        title: "Communauté",
        value: "Les Poups"
    },

    {
        icon: "✨",
        title: "Ambiance",
        value: "Humour et bonne humeur"
    },

    /* =====================================================
       NOURRITURE
    ===================================================== */

    {
        icon: "😋",
        title: "Carburant de Couaxia",

        tags: [

            {
                label: "🍰 Gâteaux",

                messages: [
                    "Miam du sucre !!",
                    "Je pourrais en manger toute la journée !",
                    "Les gâteaux rendent toujours une journée meilleure !",
                    "Le sucre est un excellent carburant intergalactique."
                ]
            },

            {
                label: "🥩 Viande",

                messages: [
                    "De la bonne viande saignante",
                    "Ça sent le festin !",
                    "Mon côté Kraduk adore ça !"
                ]
            },

            {
                label: "🍟 Frites",

                messages: [
                    "Des FRITES ! Des FRITES ! Des FRITES !",
                    "Mission : ne pas partager mes frites.",
                    "Tu peux vraiment dire non à des frites ?"
                ]
            },

            {
                label: "🍔 Burgers",

                messages: [
                    "Je lâcherais bien un croc dedans !",
                    "Un burger bien garni, quel bonheur !",
                    "Ça donne faim rien que d'y penser !"
                ]
            },

            {
                label: "🧀 Fromages",

                messages: [
                    "Avec un bon morceau de pain...",
                    "Le fromage, c'est la vie !",
                    "Impossible d'y résister !",
                    "Je pourrais traverser une galaxie entière pour un bon fromage ! Attends, c'est ce que j'ai fait !"
                ]
            },

            {
                label: "🍺 Bières",

                messages: [
                    "Attention, l'abus d'alcool est dangereux pour la santé !",
                    "À consommer avec modération !",
                    "Une bonne bière bien fraîche de temps en temps."
                ]
            },

            {
                label: "🍕 Pizza",

                messages: [
                    "Pizza !",
                    "Seule ou à plusieurs, c'est toujours une bonne idée !",
                    "Tu prends quelle garniture ?"
                ]
            }

        ]
    },

    /* =====================================================
       FILMS / SÉRIES
    ===================================================== */

    {
        icon: "🎬",
        title: "Films / séries",

        value:
            "J'aime regarder tout type de contenu, mais j'aime quand même surtout l'action et la science-fiction !"
    },

    /* =====================================================
       MUSIQUES
    ===================================================== */

    {
        icon: "🎵",
        title: "Musiques",

        tags: [

            {
                label: "🎤 K-Pop",

                messages: [
                    "Impossible de résister à la K-Pop !"
                ]
            },

            {
                label: "🌸 Openings d'animés",

                messages: [
                    "Les openings d'animés restent gravés dans ma tête !"
                ]
            },

            {
                label: "🎸 Rock",

                messages: [
                    "Le rock donne tellement d'énergie !"
                ]
            },

            {
                label: "🔥 Rap",

                messages: [
                    "Il y a tellement de styles différents dans le rap !"
                ]
            },

            {
                label: "🎻 Classique",

                messages: [
                    "La musique classique est parfaite pour se détendre."
                ]
            },

            {
                label: "🎧 Tous les styles",

                messages: [
                    "J'aime découvrir de nouveaux styles musicaux !"
                ]
            }

        ]
    },

    /* =====================================================
       ANIMAUX
    ===================================================== */

    {
        icon: "🐾",
        title: "Animaux préférés",

        tags: [

            {
                label: "🐙 Poulpes",

                messages: [
                    "Les poulpes sont les meilleurs !",
                    "J'adore leurs tentacules !",
                    "Je crois que ça se voit que j'aime les poulpes...",
                    "Un jour, je finirai peut-être avec huit tentacules !"
                ]
            },

            {
                label: "🌊 Animaux marins",

                messages: [
                    "Les animaux marins me fascinent !",
                    "Les océans cachent tellement de merveilles !",
                    "Je pourrais passer des heures à observer la vie sous-marine.",
                    "Entre les baleines, les raies et les méduses... je les adore tous !"
                ]
            },

            {
                label: "🐈 Félins",

                messages: [
                    "Impossible de résister à un félin !",
                    "Les chats sont tellement adorables !",
                    "Les félins sont élégants et majestueux.",
                    "J'adore tous les félins, des chats aux tigres !"
                ]
            },

            {
                label: "🐉 Dragons",

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

        <header class="about-info__header about-info__banner">

        <img
            src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Anwedia.png"
            alt=""
            class="about-info__banner-image"
            aria-hidden="true"
        >


        <div
            class="about-info__banner-overlay"
            aria-hidden="true"> 
        </div>
        
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
                :key="info.title"
                class="about-info-card"
            >

                <!-- ICON -->

                <span
                    class="about-info-icon"
                    aria-hidden="true"
                >
                    {{ info.icon }}
                </span>


                <!-- TITLE -->

                <h3>
                    {{ info.title }}
                </h3>


                <!-- SIMPLE VALUE -->

                <p v-if="info.value">
                    {{ info.value }}
                </p>


                <!-- TAGS -->

                <div
                    v-if="info.tags"
                    class="about-tags"
                >

                    <span
                        v-for="tag in info.tags"
                        :key="tag.label"
                        class="about-tag"
                    >
                        {{ tag.label }}
                    </span>

                </div>

            </article>

        </div>

    </section>

</template>