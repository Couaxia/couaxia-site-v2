<script setup lang="ts">
interface Props {
    text?: string;
    size?: "small" | "medium" | "large";
    overlay?: boolean;
}

withDefaults(
    defineProps<Props>(),
    {
        text: "Chargement...",
        size: "medium",
        overlay: false
    }
);

const loaderGif =
    "https://ik.imagekit.io/couaxia/artworks/stream/IW_750.gif?updatedAt=1788687205222";
</script>

<template>
    <div
        class="app-loader"
        :class="[
            `app-loader--${size}`,
            {
                'app-loader--overlay': overlay
            }
        ]"
        role="status"
        aria-live="polite"
    >
        <img
            :src="loaderGif"
            alt=""
            class="app-loader__gif"
        >

        <p
            v-if="text"
            class="app-loader__text"
        >
            {{ text }}
        </p>
    </div>
</template>

<style scoped>
.app-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 14px;
    padding: 30px;

    text-align: center;
}

.app-loader__gif {
    display: block;
    width: 110px;
    height: auto;
    max-width: 100%;
    object-fit: contain;
}

.app-loader__text {
    margin: 0;
    color: #e8b9ff;
    font-size: 0.95rem;
    font-weight: 700;
}

/* TAILLES */

.app-loader--small .app-loader__gif {
    width: 65px;
}

.app-loader--medium .app-loader__gif {
    width: 110px;
}

.app-loader--large .app-loader__gif {
    width: 170px;
}

/* CHARGEMENT SUR TOUT L'ÉCRAN */

.app-loader--overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;

    min-height: 100dvh;
    padding: 20px;

    background: rgba(9, 5, 18, 0.88);
    backdrop-filter: blur(12px);
}

/* RESPONSIVE */

@media (max-width: 680px) {
    .app-loader--large .app-loader__gif {
        width: 130px;
    }
}
</style>