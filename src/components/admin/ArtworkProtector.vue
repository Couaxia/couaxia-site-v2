
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import watermarkUrl from "../../assets/images/watermarks.png";

const sourceFile = ref<File | null>(null);
const sourceUrl = ref("");
const previewUrl = ref("");
const opacity = ref(25);
const maxDimension = ref(1600);
const quality = ref(85);
const processing = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const canGenerate = computed(
    () => !!sourceFile.value && !processing.value
);

function revokeUrl(url: string) {
    if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
    }
}

function resetPreview() {
    revokeUrl(previewUrl.value);
    previewUrl.value = "";
    successMessage.value = "";
}

function selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    resetPreview();
    revokeUrl(sourceUrl.value);

    sourceUrl.value = "";
    sourceFile.value = null;
    errorMessage.value = "";

    if (!file) return;

    if (
        !["image/png", "image/jpeg", "image/webp"]
            .includes(file.type)
    ) {
        errorMessage.value =
            "Choisis une image PNG, JPG ou WebP.";
        input.value = "";
        return;
    }

    sourceFile.value = file;
    sourceUrl.value = URL.createObjectURL(file);
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () =>
            reject(new Error("Impossible de charger l'image."));

        image.src = src;
    });
}

function canvasToBlob(
    canvas: HTMLCanvasElement
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(
                        new Error("Impossible de générer le WebP.")
                    );
                }
            },
            "image/webp",
            quality.value / 100
        );
    });
}

async function generateProtectedImage() {
    if (!sourceFile.value || !sourceUrl.value) return;

    processing.value = true;
    errorMessage.value = "";
    resetPreview();

    try {
        const [original, watermark] = await Promise.all([
            loadImage(sourceUrl.value),
            loadImage(watermarkUrl)
        ]);

        const originalWidth = original.naturalWidth;
        const originalHeight = original.naturalHeight;

        const scale = Math.min(
            1,
            maxDimension.value /
                Math.max(originalWidth, originalHeight)
        );

        const width = Math.max(
            1,
            Math.round(originalWidth * scale)
        );

        const height = Math.max(
            1,
            Math.round(originalHeight * scale)
        );

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas indisponible.");
        }

        // Fond blanc pour les images transparentes.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Illustration d'origine.
        ctx.drawImage(original, 0, 0, width, height);

        // Watermark intégré aux pixels.
        // Répétition sans déformer la grille.
        const pattern = ctx.createPattern(
            watermark,
            "repeat"
        );

        if (!pattern) {
            throw new Error("Watermark indisponible.");
        }

        const patternScale = width / 1600;

        const matrix = new DOMMatrix();
        matrix.scaleSelf(
            Math.max(0.25, patternScale),
            Math.max(0.25, patternScale)
        );

        pattern.setTransform(matrix);

        ctx.save();
        ctx.globalAlpha = opacity.value / 100;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        const blob = await canvasToBlob(canvas);

        resetPreview();
        previewUrl.value = URL.createObjectURL(blob);

        successMessage.value =
            `Image protégée générée : ${width} × ${height} px.`;
    } catch (error) {
        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Une erreur est survenue.";
    } finally {
        processing.value = false;
    }
}

function downloadProtectedImage() {
    if (!previewUrl.value || !sourceFile.value) return;

    const baseName = sourceFile.value.name.replace(
        /\.[^.]+$/,
        ""
    );

    const link = document.createElement("a");
    link.href = previewUrl.value;
    link.download = `${baseName}-protected.webp`;

    document.body.appendChild(link);
    link.click();
    link.remove();
}

onBeforeUnmount(() => {
    revokeUrl(sourceUrl.value);
    revokeUrl(previewUrl.value);
});
</script>

<template>
    <section class="artwork-protector">
        <header class="artwork-protector__header">
            <span class="artwork-protector__eyebrow">
                ✦ ADMINISTRATION COUAXIA
            </span>

            <h2>🛡️ Protection des illustrations</h2>

            <p>
                Prépare une version publique de tes arts
                avec ta grille violette intégrée.
            </p>
        </header>

        <div class="artwork-protector__settings">
            <label class="artwork-protector__field">
                <span>Choisir une illustration</span>

                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    @change="selectFile"
                />
            </label>

            <label class="artwork-protector__field">
                <span>
                    Opacité du watermark :
                    <strong>{{ opacity }} %</strong>
                </span>

                <input
                    v-model.number="opacity"
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    @input="resetPreview"
                />
            </label>

            <label class="artwork-protector__field">
                <span>Dimension maximale</span>

                <select
                    v-model.number="maxDimension"
                    @change="resetPreview"
                >
                    <option :value="1200">1 200 px</option>
                    <option :value="1600">1 600 px</option>
                    <option :value="2000">2 000 px</option>
                </select>
            </label>

            <label class="artwork-protector__field">
                <span>
                    Qualité WebP :
                    <strong>{{ quality }} %</strong>
                </span>

                <input
                    v-model.number="quality"
                    type="range"
                    min="60"
                    max="100"
                    step="5"
                    @input="resetPreview"
                />
            </label>
        </div>

        <div class="artwork-protector__previews">
            <div class="artwork-protector__preview">
                <h3>Image originale</h3>

                <img
                    v-if="sourceUrl"
                    :src="sourceUrl"
                    alt="Illustration originale"
                />

                <p v-else>Aucune image sélectionnée</p>
            </div>

            <div class="artwork-protector__preview">
                <h3>Version protégée</h3>

                <img
                    v-if="previewUrl"
                    :src="previewUrl"
                    alt="Illustration avec watermark intégré"
                />

                <p v-else>
                    Génère l'image pour voir le résultat.
                </p>
            </div>
        </div>

        <p
            v-if="errorMessage"
            class="artwork-protector__error"
            role="alert"
        >
            {{ errorMessage }}
        </p>

        <p
            v-if="successMessage"
            class="artwork-protector__success"
            role="status"
        >
            {{ successMessage }}
        </p>

        <div class="artwork-protector__actions">
            <button
                type="button"
                :disabled="!canGenerate"
                @click="generateProtectedImage"
            >
                {{
                    processing
                        ? "Génération en cours..."
                        : "✨ Générer l'image protégée"
                }}
            </button>

            <button
                type="button"
                :disabled="!previewUrl || processing"
                @click="downloadProtectedImage"
            >
                ⬇ Télécharger le WebP
            </button>
        </div>

        <p class="artwork-protector__notice">
            L'original reste sur ton appareil.
            Seule la copie protégée est téléchargée.
            Aucun fichier n'est envoyé automatiquement
            vers ImageKit ou Supabase.
        </p>
    </section>
</template>

<style scoped>
.artwork-protector {
    width: 100%;
    padding: 28px;
    border: 1px solid rgba(189, 147, 249, 0.3);
    border-radius: 22px;
    background: linear-gradient(
        145deg,
        #211132,
        #10091f
    );
    color: #f8efff;
    box-sizing: border-box;
}

.artwork-protector__header {
    margin-bottom: 24px;
}

.artwork-protector__eyebrow {
    color: #d4a5ff;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
}

.artwork-protector h2 {
    margin: 12px 0;
    font-size: clamp(1.3rem, 3vw, 1.8rem);
}

.artwork-protector__header p,
.artwork-protector__notice {
    color: #c9b7db;
    line-height: 1.6;
}

.artwork-protector__settings {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 28px;
}

.artwork-protector__field {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.artwork-protector__field span {
    font-weight: 600;
}

.artwork-protector input,
.artwork-protector select {
    max-width: 100%;
}

.artwork-protector input[type="range"] {
    width: 100%;
    accent-color: #bd80ff;
}

.artwork-protector input[type="file"],
.artwork-protector select {
    padding: 12px;
    border: 1px solid #70448d;
    border-radius: 10px;
    background: #281638;
    color: white;
}

.artwork-protector__previews {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
}

.artwork-protector__preview {
    min-width: 0;
    min-height: 240px;
    padding: 16px;
    border: 1px dashed #8053a4;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
}

.artwork-protector__preview h3 {
    margin: 0 0 16px;
    font-size: 1rem;
}

.artwork-protector__preview img {
    display: block;
    max-width: 100%;
    max-height: 380px;
    margin: 0 auto;
    object-fit: contain;
}

.artwork-protector__preview p {
    color: #c9b7db;
}

.artwork-protector__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
}

.artwork-protector__actions button {
    padding: 12px 18px;
    border: 1px solid #bd80ff;
    border-radius: 10px;
    background: #6f2da8;
    color: white;
    font-weight: 700;
    cursor: pointer;
}

.artwork-protector__actions button:hover:not(:disabled) {
    background: #8542c3;
}

.artwork-protector__actions button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.artwork-protector__error {
    color: #ff9cae;
}

.artwork-protector__success {
    color: #b5f3cf;
}

.artwork-protector__notice {
    margin-top: 22px;
    font-size: 0.85rem;
}

@media (max-width: 650px) {
    .artwork-protector {
        padding: 16px;
    }

    .artwork-protector__settings,
    .artwork-protector__previews {
        grid-template-columns: 1fr;
    }
}
</style>
