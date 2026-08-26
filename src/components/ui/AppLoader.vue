<script setup lang="ts">
interface Props {
    text?: string;
    size?: "small" | "medium" | "large";
}

withDefaults(
    defineProps<Props>(),
    {
        text: "Chargement...",
        size: "medium"
    }
);


const loaderGif =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/stream/IW_750.gif";
</script>


<template>

    <div
        class="app-loader"
        :class="`app-loader--${size}`"
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