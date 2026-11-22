
<script setup lang="ts">
import { RouterLink } from "vue-router";

const currentYear = new Date().getFullYear();

const socialLinks = [
    {
        label: "Twitch",
        url: "https://www.twitch.tv/couaxia",
        icon: "📺"
    },
    {
        label: "TikTok",
        url: "https://www.tiktok.com/@couaxia",
        icon: "🎵"
    },
    {
        label: "YouTube",
        url: "https://www.youtube.com/@Couaxia",
        icon: "▶️"
    },
    {
        label: "Ko-fi",
        url: "https://ko-fi.com/couaxia",
        icon: "☕"
    }
];

const navigationLinks = [
    { label: "Accueil", path: "/" },
    { label: "À propos", path: "/about" },
    { label: "Arts & Crédits", path: "/credits" },
    { label: "Contact", path: "/contact" }
];
</script>

<template>
    <footer class="couaxia-footer">
        <div class="couaxia-footer__glow"></div>

        <div class="couaxia-footer__container">

            <!-- BRAND -->

            <div class="couaxia-footer__brand">
                <RouterLink
                    to="/"
                    class="couaxia-footer__logo"
                >
                    <span aria-hidden="true">🐙</span>
                    <span>COUAXIA</span>
                </RouterLink>

                <p>
                    Une petite poulpe venue des étoiles
                    pour partager son univers avec vous.
                    💜
                </p>

                <span class="couaxia-footer__signature">
                    ✦ Un univers, mille tentacules ✦
                </span>
            </div>

            <!-- NAVIGATION -->

            <nav
                class="couaxia-footer__section"
                aria-label="Navigation du pied de page"
            >
                <h2>Explorer</h2>

                <RouterLink
                    v-for="link in navigationLinks"
                    :key="link.path"
                    :to="link.path"
                >
                    {{ link.label }}
                </RouterLink>
            </nav>

            <!-- SOCIAL -->

            <div class="couaxia-footer__section">
                <h2>Retrouvez-moi</h2>

                <a
                    v-for="social in socialLinks"
                    :key="social.label"
                    :href="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span aria-hidden="true">
                        {{ social.icon }}
                    </span>

                    {{ social.label }}
                </a>
            </div>

            <!-- BOTTOM -->

            <div class="couaxia-footer__bottom">
                <span>
                    © {{ currentYear }} Couaxia.
                    Tous droits réservés.
                </span>

                <span>
                    Créé avec 💜 et quelques tentacules 🐙
                </span>
            </div>

        </div>
    </footer>
</template>

<style scoped>
@import "../../assets/styles/components/footer.css";
</style>
