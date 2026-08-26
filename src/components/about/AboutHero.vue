<script setup lang="ts">

/* =========================================================
   ABOUT HERO
========================================================= */

import {
    ref
} from "vue";


const activeMessage =
    ref<string | null>(
        null
    );


function showRandomMessage(
    messages: string[]
) {

    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    activeMessage.value =
        messages[randomIndex] ?? null;

}


function hideMessage() {

    activeMessage.value =
        null;

}
/* =========================================================
   TYPES
========================================================= */

interface SocialLink {
    name: string;
    url: string;
    icon?: string;
    emoji?: string;
    messages: string[];
}
const storyMessages = [

    "Prêt à découvrir comment mon aventure a commencé ?",

    "Tout a commencé sur la planète Saphira…",

    "Viens découvrir les secrets des Kraduks !",

    "Avadora, Natsu, Myo… toute mon histoire t’attend !"

];

/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks: SocialLink[] = [

    {
        name: "Twitch",

        url: "https://www.twitch.tv/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/twitch-logo-transparent.png",

        messages: [
            "Viens suivre mes aventures en direct sur Twitch !",
            "Rejoins-moi sur Twitch pour partager mes prochaines aventures !",
            "Le direct commence peut-être bientôt… viens jeter un œil !",
            "Sur Twitch, même mes tentacules participent au stream !"
        ]
    },

    {
        name: "YouTube",

        url: "https://www.youtube.com/@couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/youtube-logo-png.png",

        messages: [
            "Viens jeter un œil à mes vidéos !",
            "Tu trouveras mes aventures et mes meilleurs moments sur YouTube !",
            "Une petite vidéo de Couaxia, ça te tente ?",
            "Mes souvenirs de stream t’attendent sur YouTube !"
        ]
    },

    {
        name: "TikTok",

        url: "https://www.tiktok.com/@couaxia_tv",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/logo-tiktok-png.png",

        messages: [
            "Viens découvrir mes petites vidéos sur TikTok !",
            "Des clips, des bêtises et beaucoup de tentacules t’attendent !",
            "Attention, mes TikTok peuvent provoquer des fous rires !",
            "Tu veux voir mes aventures en format court ?"
        ]
    },

    {
        name: "X (Twitter)",

        url: "https://x.com/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/x-logo-x.png",

        messages: [
            "Viens suivre mes nouvelles aventures sur X !",
            "J’y partage mes annonces et mes petites pensées !",
            "Besoin de nouvelles fraîches de Couaxia ?",
            "Mes prochaines aventures sont peut-être déjà annoncées ici !"
        ]
    },

    {
        name: "Instagram",

        url: "https://www.instagram.com/couaxia/",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/instagram-logo.png",

        messages: [
            "Viens découvrir mon univers en images !",
            "Mes plus belles publications t’attendent sur Instagram !",
            "Un peu de rose, de violet et de magie ?",
            "Instagram est parfait pour découvrir mon univers visuel !"
        ]
    },

    {
        name: "Throne",

        url: "https://throne.com/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Throne_Icon.png",

        messages: [
            "Voici ma petite liste de souhaits !",
            "Tu es curieux de découvrir les objets qui me font envie ?",
            "Même les Kraduks ont une liste de souhaits !",
            "Un cadeau pour nourrir mes aventures intergalactiques ?"
        ]
    },

    {
        name: "Discord",

        url: "https://discord.com/invite/YeCXm8JZ7e",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/discord-logo.png",

        messages: [
            "Viens rejoindre notre communauté sur Discord !",
            "Les Poups t’attendent sur le serveur !",
            "Entre, installe-toi et viens discuter avec nous !",
            "Notre petit royaume communautaire t’ouvre ses portes !"
        ]
    }


];


/* =========================================================
   CHARACTER IMAGE
========================================================= */

const characterImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/Aboutmeno.png";

</script>


<template>

    <section class="about-hero">

        <!-- =================================================
             DECORATIONS
        ================================================== -->

        <div
            class="
                about-hero__decoration
                about-hero__decoration--one
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                about-hero__decoration
                about-hero__decoration--two
            "
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="about-hero__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="about-hero__text">

                <p class="about-hero__overline">

                    VTubeuse française
                    <span aria-hidden="true">
                        •
                    </span>
                    Multigaming

                </p>


                <h1 class="about-hero__title">

                    Bienvenue dans l’univers de

                    <span class="about-hero__title-highlight">
                        Couaxia
                    </span>

                </h1>


                <div class="about-hero__introductions">

                    <p class="about-hero__introduction">

                        Je suis Couaxia, une VTubeuse française
                        passionnée par les jeux vidéo, les aventures,
                        l’humour et les moments partagés avec ma
                        communauté.

                    </p>


                    <p class="about-hero__introduction">

                        Mon univers mélange tentacules, magie,
                        créatures fantastiques et beaucoup de
                        bonne humeur.

                    </p>

                </div>


                <!-- =========================================
                     SOCIAL LINKS
                ========================================== -->

                <div class="about-hero__actions">

                    <a
                        v-for="social in socialLinks"
                        :key="social.name"
                        :href="social.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="
                            about-hero__action
                            about-hero__action--secondary
                        "
                        @mouseenter="showRandomMessage(social.messages)"
                        @mouseleave="hideMessage"
                    >

                        <img
                            v-if="social.icon"
                            :src="social.icon"
                            alt=""
                            class="about-hero__action-icon"
                        >


                        <span
                            v-else-if="social.emoji"
                            class="about-hero__action-emoji"
                            aria-hidden="true"
                        >
                            {{ social.emoji }}
                        </span>


                        <span>
                            {{ social.name }}
                        </span>

                    </a>


                    <!-- =====================================
                         STORY
                    ====================================== -->

                    <RouterLink
                        to="/histoire"
                        class="
                            about-hero__action
                            about-hero__action--secondary
                            about-hero__action--story"
                        @mouseenter="showRandomMessage(storyMessages)"
                        @mouseleave="hideMessage"
                    >


                        <span
                            class="about-hero__action-emoji"
                            aria-hidden="true"
                        >
                            📖
                        </span>

                        <span>
                            Découvrir mon histoire
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 CHARACTER
            ============================================== -->

            <div class="about-hero__character-wrapper">

                <div
                    class="about-hero__character-glow"
                    aria-hidden="true"
                ></div>


                <img
                    :src="characterImage"
                    alt="Modèle VTuber de Couaxia"
                    class="about-hero__character"
                >


                <!-- =========================================
                     CHARACTER LABEL
                ========================================== -->

                <div class="about-hero__character-name">

                    <strong>
                        Couaxia
                    </strong>

                    <span>
                        VTubeuse spatiale des profondeurs
                    </span>

                </div>

            </div>

        </div>

    </section>

</template>