<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface Artist {

    id:
        number;

    role:
        string;

    icon:
        string;

    name:
        string;

    description:
        string;

    avatar:
        string | null;

    links:
        {
            label:
                string;

            url:
                string;
        }[];

}


/* =========================================================
   ARTISTS
========================================================= */

const artists:
    Artist[] = [

        /* =================================================
           MODEL DESIGNER
        ================================================== */

        {
            id:
                1,

            role:
                "Model Designer",

            icon:
                "✨",

            name:
                "Koleander",

            description:
                "La personne derrière la conception et le design original du modèle de Couaxia.",

            avatar:
                "https://ik.imagekit.io/couaxia/artworks/forme-3/REF_SHEET.png?updatedAt=1788685705480",

            links: [
                {
                    label:
                        "VGen",

                    url:
                        "https://vgen.co/Koleander"
                },

                {
                    label:
                        "X / Twitter",

                    url:
                        "https://x.com/King_Koleander"
                }
            ]
        },


        /* =================================================
           ARTISTE DU MODÈLE
        ================================================== */

        {
            id:
                2,

            role:
                "Artiste du modèle",

            icon:
                "🎨",

            name:
                "ibuki_Live2d",

            description:
                "L'artiste qui a illustré et préparé le modèle de Couaxia pour lui donner sa forme finale.",

            avatar:
                "https://ik.imagekit.io/couaxia/artworks/forme-3/art_showcast.png?updatedAt=1788685703886",

            links: [
                {
                    label:
                        "VGen",

                    url:
                        "https://vgen.co/wv1996112"
                },

                {
                    label:
                        "X / Twitter",

                    url:
                        "https://x.com/wv1996112"
                }
            ]
        },


        /* =================================================
           RIGGER LIVE2D
        ================================================== */

        {
            id:
                3,

            role:
                "Rigger Live2D",

            icon:
                "🦴",

            name:
                "Sophiel",

            description:
                "La personne qui a donné vie au modèle de Couaxia grâce au rigging et aux animations Live2D.",

            /*
             * On ajoutera la capture du rig ici
             * lorsque tu l'auras.
             */

            avatar:
                null,

            links: [
                {
                    label:
                        "VGen",

                    url:
                        "https://vgen.co/Sophiel"
                },

                {
                    label:
                        "X / Twitter",

                    url:
                        "https://x.com/Sophielpaka"
                }
            ]
        }

];


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const sectionMessages = [

    "Un modèle ne prend pas vie tout seul ! 🎨",

    "Voici les artistes qui se cachent derrière mon modèle ! 💜",

    "Des dessins, du rigging et beaucoup de tentacules plus tard... me voilà ! 🐙",

    "C'est grâce à ces artistes que Couaxia a pu prendre vie ! ✨"

];


const designerMessages = [

    "Tout commence par un design ! ✨",

    "C'est ici que mon apparence a commencé à prendre forme !",

    "Avant de bouger, il fallait déjà imaginer à quoi j'allais ressembler. 👀"

];


const artistMessages = [

    "Chaque détail du modèle a dû être dessiné ! 🎨",

    "Une quantité inquiétante de calques plus tard... Couaxia existe ! 😂",

    "Dessiner des tentacules, ça compte comme une épreuve artistique ? 🐙"

];


const riggerMessages = [

    "Et maintenant... il faut faire bouger tout ça ! 🦴",

    "C'est grâce au rig que je peux bouger devant vous ! ✨",

    "Oui, même mes tentacules ont besoin d'un rig ! 🐙"

];


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        messages.length ===
        0
    ) {

        return "";

    }


    return (
        messages[
            Math.floor(
                Math.random()
                *
                messages.length
            )
        ]
        ??
        ""
    );

}


/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
    messages:
        string[]
) {

    const message =
        getRandomMessage(
            messages
        );


    if (
        !message
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
   ARTIST MESSAGE
========================================================= */

function speakAboutArtist(
    artist:
        Artist
) {

    switch (
        artist.id
    ) {

        case 1:

            sendMascotMessage(
                designerMessages
            );

            break;


        case 2:

            sendMascotMessage(
                artistMessages
            );

            break;


        case 3:

            sendMascotMessage(
                riggerMessages
            );

            break;

    }

}

</script>


<template>

    <section
        class="about-artists"

        @mouseenter="
            sendMascotMessage(
                sectionMessages
            )
        "
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-artists__header">

            <span class="about-artists__eyebrow">
                CRÉATION DU MODÈLE
            </span>


            <h2 class="about-artists__title">

                <span aria-hidden="true">
                    🐙
                </span>

                Les artistes derrière Couaxia

            </h2>


            <p class="about-artists__intro">

                Un modèle ne prend pas vie tout seul...

                <br>

                Voici les artistes qui ont participé
                à la création de Couaxia.

            </p>

        </header>


        <!-- =================================================
             ARTISTS
        ================================================== -->

        <div class="about-artists__grid">

            <article
                v-for="
                    artist in artists
                "

                :key="
                    artist.id
                "

                class="about-artist-card"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutArtist(
                        artist
                    )
                "

                @focus.stop="
                    speakAboutArtist(
                        artist
                    )
                "
            >

                <!-- =========================================
                     ROLE
                ========================================== -->

                <div class="about-artist-card__role">

                    <span
                        class="about-artist-card__role-icon"
                        aria-hidden="true"
                    >
                        {{ artist.icon }}
                    </span>


                    <span>
                        {{ artist.role }}
                    </span>

                </div>


                <!-- =========================================
                     AVATAR
                ========================================== -->

                <div class="about-artist-card__avatar">

                    <img
                        v-if="
                            artist.avatar
                        "

                        :src="
                            artist.avatar
                        "

                        :alt="
                            `Avatar de ${artist.name}`
                        "

                        loading="lazy"
                    >


                    <div
                        v-else
                        class="about-artist-card__avatar-fallback"
                        aria-hidden="true"
                    >
                        {{ artist.icon }}
                    </div>

                </div>


                <!-- =========================================
                     INFORMATIONS
                ========================================== -->

                <div class="about-artist-card__content">

                    <h3>
                        {{ artist.name }}
                    </h3>


                    <p>
                        {{ artist.description }}
                    </p>

                </div>


                <!-- =========================================
                     LINKS
                ========================================== -->

                <div
                    v-if="
                        artist.links.length
                    "

                    class="about-artist-card__links"
                >

                    <a
                        v-for="
                            link in artist.links
                        "

                        :key="
                            link.url
                        "

                        :href="
                            link.url
                        "

                        target="_blank"

                        rel="noopener noreferrer"

                        class="about-artist-card__link"

                        @click.stop
                    >

                        {{ link.label }}

                        <span aria-hidden="true">
                            ↗
                        </span>

                    </a>

                </div>


                <!-- =========================================
                     COMING SOON
                ========================================== -->

                <span
                    v-else
                    class="about-artist-card__coming-soon"
                >
                    Informations à venir
                </span>

            </article>

        </div>

    </section>

</template>