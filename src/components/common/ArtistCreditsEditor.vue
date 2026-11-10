<script setup lang="ts">
import { computed } from "vue";

import type {
    ArtistCredit,
    ArtistCreditLink
} from "../../types/artist-credit.types";

const props = withDefaults(
    defineProps<{
        modelValue: ArtistCredit[];
        disabled?: boolean;
    }>(),
    {
        disabled: false
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: ArtistCredit[]];
}>();

const credits = computed(() => props.modelValue);

function updateCredits(value: ArtistCredit[]) {
    emit("update:modelValue", value);
}

function addArtist() {
    updateCredits([
        ...credits.value,
        {
            artistName: "",
            contribution: "",
            links: [],
            sortOrder: credits.value.length
        }
    ]);
}

function removeArtist(index: number) {
    updateCredits(
        credits.value
            .filter((_, i) => i !== index)
            .map((credit, i) => ({
                ...credit,
                sortOrder: i
            }))
    );
}

function updateArtist(
    index: number,
    field: "artistName" | "contribution",
    value: string
) {
    updateCredits(
        credits.value.map((credit, i) =>
            i === index
                ? { ...credit, [field]: value }
                : credit
        )
    );
}

function addLink(artistIndex: number) {
    updateCredits(
        credits.value.map((credit, i) =>
            i === artistIndex
                ? {
                    ...credit,
                    links: [
                        ...credit.links,
                        {
                            label: "",
                            url: ""
                        }
                    ]
                }
                : credit
        )
    );
}

function updateLink(
    artistIndex: number,
    linkIndex: number,
    field: keyof ArtistCreditLink,
    value: string
) {
    updateCredits(
        credits.value.map((credit, i) =>
            i === artistIndex
                ? {
                    ...credit,
                    links: credit.links.map((link, j) =>
                        j === linkIndex
                            ? { ...link, [field]: value }
                            : link
                    )
                }
                : credit
        )
    );
}

function removeLink(
    artistIndex: number,
    linkIndex: number
) {
    updateCredits(
        credits.value.map((credit, i) =>
            i === artistIndex
                ? {
                    ...credit,
                    links: credit.links.filter(
                        (_, j) => j !== linkIndex
                    )
                }
                : credit
        )
    );
}
</script>

<template>
    <section class="artist-credits">
        <header class="artist-credits__header">
            <div>
                <h3>🎨 Crédits artistiques</h3>

                <p>
                    Ajoute les artistes ayant participé à cette
                    illustration et précise leur travail.
                    Tous les crédits sont facultatifs.
                </p>
            </div>
        </header>

        <div
            v-if="credits.length === 0"
            class="artist-credits__empty"
        >
            Aucun artiste renseigné pour le moment.
        </div>

        <div
            v-for="(credit, artistIndex) in credits"
            :key="credit.id ?? artistIndex"
            class="artist-credits__card"
        >
            <div class="artist-credits__card-header">
                <h4>
                    🎨 Artiste {{ artistIndex + 1 }}
                </h4>

                <button
                    type="button"
                    class="artist-credits__remove"
                    :disabled="disabled"
                    @click="removeArtist(artistIndex)"
                >
                    🗑️ Supprimer
                </button>
            </div>

            <div class="artist-credits__grid">
                <label>
                    <span>Nom / Pseudo</span>

                    <input
                        :value="credit.artistName"
                        type="text"
                        placeholder="Ex. Patchirisu"
                        :disabled="disabled"
                        @input="
                            updateArtist(
                                artistIndex,
                                'artistName',
                                ($event.target as HTMLInputElement).value
                            )
                        "
                    >
                </label>

                <label>
                    <span>Travail réalisé</span>

                    <input
                        :value="credit.contribution"
                        type="text"
                        placeholder="Ex. Illustration, colorisation..."
                        :disabled="disabled"
                        @input="
                            updateArtist(
                                artistIndex,
                                'contribution',
                                ($event.target as HTMLInputElement).value
                            )
                        "
                    >
                </label>
            </div>

            <div class="artist-credits__links">
                <h5>🔗 Liens de l'artiste</h5>

                <div
                    v-for="(link, linkIndex) in credit.links"
                    :key="linkIndex"
                    class="artist-credits__link"
                >
                    <input
                        :value="link.label"
                        type="text"
                        placeholder="Nom du lien (X, Portfolio...)"
                        :disabled="disabled"
                        @input="
                            updateLink(
                                artistIndex,
                                linkIndex,
                                'label',
                                ($event.target as HTMLInputElement).value
                            )
                        "
                    >

                    <input
                        :value="link.url"
                        type="url"
                        placeholder="https://..."
                        :disabled="disabled"
                        @input="
                            updateLink(
                                artistIndex,
                                linkIndex,
                                'url',
                                ($event.target as HTMLInputElement).value
                            )
                        "
                    >

                    <button
                        type="button"
                        class="artist-credits__remove-link"
                        :disabled="disabled"
                        @click="
                            removeLink(artistIndex, linkIndex)
                        "
                    >
                        ✕
                    </button>
                </div>

                <button
                    type="button"
                    class="artist-credits__add-link"
                    :disabled="disabled"
                    @click="addLink(artistIndex)"
                >
                    + Ajouter un lien
                </button>
            </div>
        </div>

        <button
            type="button"
            class="artist-credits__add-artist"
            :disabled="disabled"
            @click="addArtist"
        >
            + Ajouter un artiste
        </button>
    </section>
</template>

<style scoped>
.artist-credits {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.artist-credits__header h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    color: #fff;
}

.artist-credits__header p {
    margin: 0;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.85rem;
    line-height: 1.6;
}

.artist-credits__empty {
    padding: 20px;
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 14px;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
    font-size: 0.85rem;
}

.artist-credits__card {
    padding: 20px;
    border: 1px solid rgba(213, 106, 255, 0.22);
    border-radius: 16px;
    background: rgba(182, 72, 255, 0.045);
}

.artist-credits__card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.artist-credits__card-header h4 {
    margin: 0;
    color: #f0c2ff;
}

.artist-credits__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.artist-credits__grid label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

.artist-credits__grid label span {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.85rem;
    font-weight: 600;
}

.artist-credits input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: 11px 13px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(7, 4, 14, 0.72);
    color: #fff;
    font: inherit;
}

.artist-credits input:focus {
    outline: none;
    border-color: #d56aff;
}

.artist-credits__links {
    margin-top: 22px;
}

.artist-credits__links h5 {
    margin: 0 0 12px;
    color: #fff;
    font-size: 0.9rem;
}

.artist-credits__link {
    display: grid;
    grid-template-columns: 1fr 1.5fr auto;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}

.artist-credits button {
    font: inherit;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.artist-credits button:hover:not(:disabled) {
    opacity: 0.8;
}

.artist-credits button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.artist-credits__remove,
.artist-credits__remove-link {
    border: 1px solid rgba(255, 90, 125, 0.2);
    border-radius: 10px;
    padding: 9px 12px;
    background: rgba(255, 70, 110, 0.08);
    color: #ff9eb7;
}

.artist-credits__add-link {
    border: 1px solid rgba(213, 106, 255, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    background: rgba(213, 106, 255, 0.08);
    color: #e8b5ff;
}

.artist-credits__add-artist {
    width: 100%;
    padding: 14px;
    border: 1px dashed rgba(213, 106, 255, 0.5);
    border-radius: 14px;
    background: rgba(213, 106, 255, 0.08);
    color: #f0c2ff;
    font-weight: 700 !important;
}

@media (max-width: 650px) {
    .artist-credits__grid,
    .artist-credits__link {
        grid-template-columns: 1fr;
    }

    .artist-credits__card {
        padding: 15px;
    }

    .artist-credits__card-header {
        align-items: flex-start;
    }
}
</style>