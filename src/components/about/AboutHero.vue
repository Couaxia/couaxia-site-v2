<script setup lang="ts">

/* =========================================================
   ABOUT HERO
========================================================= */


/* =========================================================
   TYPES
========================================================= */

interface SocialLink {
    name: string;
    url: string;
    icon?: string;
    emoji?: string;
    external?: boolean;
}


/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks: SocialLink[] = [

    {
        name:
            "Twitch",

        url:
            "https://www.twitch.tv/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/twitch-logo-transparent.png",

        external:
            true
    },

    {
        name:
            "YouTube",

        url:
            "https://www.youtube.com/@couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/youtube-logo-png.png",

        external:
            true
    },

    {
        name:
            "TikTok",

        url:
            "https://www.tiktok.com/@couaxia_tv",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/logo-tiktok-png.png",

        external:
            true
    },

    {
        name:
            "X (Twitter)",

        url:
            "https://x.com/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/x-logo-x.png",

        external:
            true
    },

    {
        name:
            "Instagram",

        url:
            "https://www.instagram.com/couaxia/",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/instagram-logo.png",

        external:
            true
    },

    {
        name:
            "Throne",

        url:
            "https://throne.com/couaxia",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Throne_Icon.png",

        external:
            true
    },

    {
        name:
            "Discord",

        url:
            "https://discord.com/invite/YeCXm8JZ7e",

        icon:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/discord-logo.png",

        external:
            true
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
                            about-hero__action--story
                        "
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