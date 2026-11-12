<script setup lang="ts">

import {

    computed,

    onBeforeUnmount,

    onMounted,

    ref,
    watch,
    nextTick

} from "vue";

import type {

    Card,

    CardCategory,

    CardRarity,

    CardStatus

} from "../../types/card.types";

import {

    createCard,

    getNextCardNumber,

    updateCard,

    uploadCardImage

} from "../../services/cardAdmin.service";

import type {

    CardAdminInput

} from "../../services/cardAdmin.service";

import ArtistCreditsEditor from "../common/ArtistCreditsEditor.vue";

import type { ArtistCredit } from "../../types/artist-credit.types";

import {

    getCardArtistCredits,

    saveCardArtistCredits

} from "../../services/artistCredits.service";

/* =========================================================

   PROPS / EMITS

========================================================= */

const props =

    defineProps<{

        card:

            Card | null;

    }>();

const emit =

    defineEmits<{

        saved:

            [card: Card];

        cancel:

            [];

    }>();

/* =========================================================

   TYPES

========================================================= */

interface CardForm {

    number:

        number;

    name:

        string;

    description:

        string;

    rarity:

        CardRarity;

    category:

        CardCategory;

    orientation: "portrait" | "landscape";

    imageUrl:

        string;

    backImageUrl:

        string;

    artist:

        string;

    artistUrl:

        string;

    weight:

        number;

    status:

        CardStatus;

    limited:

        boolean;

    availableFrom:

        string;

    availableUntil:

        string;

    revealSoundUrl:

        string;

    revealAnimation:

        string;

}

/* =========================================================

   OPTIONS

========================================================= */

const rarityOptions:

    {

        value: CardRarity;

        label: string;

    }[] = [

        {

            value:

                "common",

            label:

                "⚪ Commune"

        },

        {

            value:

                "uncommon",

            label:

                "🟢 Peu commune"

        },

        {

            value:

                "rare",

            label:

                "🔵 Rare"

        },

        {

            value:

                "epic",

            label:

                "🟣 Épique"

        },

        {

            value:

                "legendary",

            label:

                "🟡 Légendaire"

        },

        {

            value:

                "mythic",

            label:

                "💗 Mythique"

        }

    ];

const categoryOptions: {
    value: CardCategory;
    label: string;
}[] = [
    {
        value: "couaxia",
        label: "🐙 Couaxia"
    },
    {
        value: "character",
        label: "👤 Personnage"
    },
    {
        value: "lore",
        label: "📖 Lore"
    },
    {
        value: "event",
        label: "🎉 Événement"
    },
    {
        value: "special",
        label: "✨ Spéciale"
    },
    {
        value: "terrain",
        label: "🌍 Terrain"
    }
];
const statusOptions:

    {

        value: CardStatus;

        label: string;

    }[] = [

        {

            value:

                "draft",

            label:

                "Brouillon"

        },

        {

            value:

                "active",

            label:

                "Active"

        },

        {

            value:

                "disabled",

            label:

                "Désactivée"

        }

    ];

const animationOptions = [

    {

        value:

            "",

        label:

            "Aucune / automatique"

    },

    {

        value:

            "glow",

        label:

            "Glow"

    },

    {

        value:

            "rare",

        label:

            "Rare"

    },

    {

        value:

            "epic",

        label:

            "Épique"

    },

    {

        value:

            "legendary",

        label:

            "Légendaire"

    },

    {

        value:

            "mythic",

        label:

            "Mythique"

    }

];

/* =========================================================

   DEFAULT FORM

========================================================= */

function createDefaultForm():

    CardForm {

    return {

        number:

            1,

        name:

            "",

        description:

            "",

        rarity:

            "common",

        category:

            "couaxia",

        orientation: "portrait",

        imageUrl:

            "",

        backImageUrl:

            "",

        artist:

            "",

        artistUrl:

            "",

        weight:

            1,

        status:

            "draft",

        limited:

            false,

        availableFrom:

            "",

        availableUntil:

            "",

        revealSoundUrl:

            "",

        revealAnimation:

            ""

    };

}

/* =========================================================

   STATE

========================================================= */

const form =

    ref<CardForm>(

        createDefaultForm()

    );

const saving =

    ref(

        false

    );

const loadingNumber =

    ref(

        false

    );

const errorMessage =

    ref(

        ""

    );

const artworkFile =

    ref<File | null>(

        null

    );

const backFile =

    ref<File | null>(

        null

    );

const artworkPreview =

    ref(

        ""

    );

const backPreview =

    ref(

        ""

    );

const artworkDragging =

    ref(

        false

    );

const backDragging =

    ref(

        false

    );

/* =========================================================
   ÉDITEUR DE CADRAGE (4:5)
   Le cadrage est appliqué au fichier avant upload.
   Aucun changement de base de données nécessaire.
========================================================= */
const cropCanvas = ref<HTMLCanvasElement | null>(null);
const cropZoom = ref(1);
const cropOffsetX = ref(0);
const cropOffsetY = ref(0);
const cropDirty = ref(false);
const cropBusy = ref(false);
const cropImage = ref<HTMLImageElement | null>(null);
const cropPreviewData = ref('');
const cropPointer = ref<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
const CROP_WIDTH = computed(() => form.value.orientation === "landscape" ? 1000 : 800);
const CROP_HEIGHT = computed(() => form.value.orientation === "landscape" ? 800 : 1000);

function clampCropOffsets(image: HTMLImageElement) {
    const base = Math.max(CROP_WIDTH.value / image.naturalWidth, CROP_HEIGHT.value / image.naturalHeight);
    const width = image.naturalWidth * base * cropZoom.value;
    const height = image.naturalHeight * base * cropZoom.value;
    const maxX = Math.max(0, (width - CROP_WIDTH.value) / 2);
    const maxY = Math.max(0, (height - CROP_HEIGHT.value) / 2);
    cropOffsetX.value = Math.max(-maxX, Math.min(maxX, cropOffsetX.value));
    cropOffsetY.value = Math.max(-maxY, Math.min(maxY, cropOffsetY.value));
}

function drawCrop() {
    const canvas = cropCanvas.value;
    const img = cropImage.value;
    if (!canvas || !img || !img.naturalWidth) return;
    canvas.width = CROP_WIDTH.value;
    canvas.height = CROP_HEIGHT.value;
    clampCropOffsets(img);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, CROP_WIDTH.value, CROP_HEIGHT.value);
    const base = Math.max(CROP_WIDTH.value / img.naturalWidth, CROP_HEIGHT.value / img.naturalHeight);
    const width = img.naturalWidth * base * cropZoom.value;
    const height = img.naturalHeight * base * cropZoom.value;
    context.drawImage(img, (CROP_WIDTH.value - width) / 2 + cropOffsetX.value,
        (CROP_HEIGHT.value - height) / 2 + cropOffsetY.value, width, height);
    cropPreviewData.value = canvas.toDataURL('image/png');
}

async function loadCropImage() {
    const source = displayedArtwork.value;
    cropImage.value = null;
    if (!source) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
        if (displayedArtwork.value !== source) return;
        cropImage.value = img;
        await nextTick();
        drawCrop();
    };
    img.onerror = () => {
        if (displayedArtwork.value === source) {
            errorMessage.value = 'Impossible de charger cette image dans l’éditeur (accès CORS).';
        }
    };
    img.src = source;
}

function resetCrop() {
    cropZoom.value = 1;
    cropOffsetX.value = 0;
    cropOffsetY.value = 0;
    cropDirty.value = true;
    drawCrop();
}

function onCropZoomChange() {
    cropDirty.value = true;
    drawCrop();
}

function onCropPointerDown(event: PointerEvent) {
    if (!cropImage.value || !cropCanvas.value) return;
    cropPointer.value = {
        x: event.clientX, y: event.clientY,
        offsetX: cropOffsetX.value, offsetY: cropOffsetY.value
    };
    cropCanvas.value.setPointerCapture(event.pointerId);
}

function onCropPointerMove(event: PointerEvent) {
    if (!cropPointer.value || !cropCanvas.value) return;
    const ratio = CROP_WIDTH.value / cropCanvas.value.getBoundingClientRect().width;
    cropOffsetX.value = cropPointer.value.offsetX + (event.clientX - cropPointer.value.x) * ratio;
    cropOffsetY.value = cropPointer.value.offsetY + (event.clientY - cropPointer.value.y) * ratio;
    cropDirty.value = true;
    drawCrop();
}

function onCropPointerUp() {
    cropPointer.value = null;
}

async function exportCroppedArtwork(): Promise<File> {
    const canvas = cropCanvas.value;
    if (!canvas || !cropImage.value) throw new Error('Le cadrage de l’image n’est pas prêt.');
    drawCrop();
    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(value => value ? resolve(value) : reject(new Error('Export du cadrage impossible.')), 'image/png');
    });
    return new File([blob], `couaxia-card-${form.value.number}.png`, { type: 'image/png' });
}

/* =========================================================

   ARTIST CREDITS

========================================================= */

const artistCredits = ref<ArtistCredit[]>([]);

const loadingCredits = ref(false);

const creditsLoaded = ref(true);

// Si la carte a été créée mais que les crédits ont échoué,

// une nouvelle tentative modifie la carte au lieu d'en créer une seconde.

const pendingSavedCard = ref<Card | null>(null);

async function loadCreditsForCard(cardId: string) {

    loadingCredits.value = true;

    creditsLoaded.value = false;

    try {

        artistCredits.value = await getCardArtistCredits(cardId);

        creditsLoaded.value = true;

    } catch (error) {

        errorMessage.value = error instanceof Error

            ? `Impossible de charger les crédits : ${error.message}`

            : "Impossible de charger les crédits artistiques.";

    } finally {

        loadingCredits.value = false;

    }

}

function normalizedCredits(): ArtistCredit[] {

    return artistCredits.value

        .filter(credit => credit.artistName.trim())

        .map((credit, index) => ({

            ...credit,

            artistName: credit.artistName.trim(),

            contribution: credit.contribution.trim(),

            links: credit.links

                .filter(link => link.url.trim())

                .map(link => ({

                    label: link.label.trim(),

                    url: link.url.trim()

                })),

            sortOrder: index

        }));

}

/* =========================================================

   COMPUTED

========================================================= */

const editing =

    computed(

        () =>

            Boolean(

                props.card

            )

    );

const title =

    computed(

        () =>

            editing.value

                ? "Modifier la carte"

                : "Nouvelle carte"

    );

const submitLabel =

    computed(

        () => {

            if (

                saving.value

            ) {

                return "Enregistrement...";

            }

            return editing.value

                ? "Enregistrer les modifications"

                : "Créer la carte";

        }

    );

const displayedArtwork =

    computed(

        () =>

            artworkPreview.value

            ||

            form.value.imageUrl

    );

watch([displayedArtwork, () => form.value.orientation], async () => {
    cropZoom.value = 1;
    cropOffsetX.value = 0;
    cropOffsetY.value = 0;
    cropDirty.value = false;
    await nextTick();
    await loadCropImage();
}, { immediate: true, flush: 'post' });

const displayedBack =

    computed(

        () =>

            backPreview.value

            ||

            form.value.backImageUrl

    );

const formattedNumber =

    computed(

        () =>

            `#${String(

                form.value.number || 0

            ).padStart(

                3,

                "0"

            )}`

    );

/* =========================================================

   DATE HELPERS

========================================================= */

function toLocalDateTimeInput(

    value:

        string | null | undefined

):

    string {

    if (

        !value

    ) {

        return "";

    }

    const date =

        new Date(

            value

        );

    if (

        Number.isNaN(

            date.getTime()

        )

    ) {

        return "";

    }

    const local =

        new Date(

            date.getTime()

            -

            date.getTimezoneOffset()

            *

            60_000

        );

    return local

        .toISOString()

        .slice(

            0,

            16

        );

}

/* =========================================================

   LOAD EXISTING CARD

========================================================= */

function loadExistingCard() {

    const card =

        props.card;

    if (

        !card

    ) {

        return;

    }

    form.value = {

        number:

            card.number,

        name:

            card.name,

        description:

            card.description

            ??

            "",

        rarity:

            card.rarity,

        category:

            card.category,

        orientation: card.orientation ?? "portrait",

        imageUrl:

            card.imageUrl,

        backImageUrl:

            card.backImageUrl

            ??

            "",

        artist:

            card.artist

            ??

            "",

        artistUrl:

            card.artistUrl

            ??

            "",

        weight:

            card.weight,

        status:

            card.status,

        limited:

            card.limited,

        availableFrom:

            toLocalDateTimeInput(

                card.availableFrom

            ),

        availableUntil:

            toLocalDateTimeInput(

                card.availableUntil

            ),

        revealSoundUrl:

            card.revealSoundUrl

            ??

            "",

        revealAnimation:

            card.revealAnimation

            ??

            ""

    };

}

/* =========================================================

   LOAD NEXT NUMBER

========================================================= */

async function loadNextNumber() {

    if (

        editing.value

    ) {

        return;

    }

    loadingNumber.value =

        true;

    try {

        form.value.number =

            await getNextCardNumber();

    }

    catch (

        error

    ) {

        console.error(

            "Impossible de récupérer le prochain numéro :",

            error

        );

    }

    finally {

        loadingNumber.value =

            false;

    }

}

/* =========================================================

   LOCAL PREVIEW

========================================================= */

function revokeArtworkPreview() {

    if (

        artworkPreview.value

    ) {

        URL.revokeObjectURL(

            artworkPreview.value

        );

        artworkPreview.value =

            "";

    }

}

function revokeBackPreview() {

    if (

        backPreview.value

    ) {

        URL.revokeObjectURL(

            backPreview.value

        );

        backPreview.value =

            "";

    }

}

/* =========================================================

   VALIDATE FILE

========================================================= */

function validateImageFile(

    file:

        File

):

    string | null {

    const allowedTypes = [

        "image/png",

        "image/jpeg",

        "image/webp",

        "image/gif"

    ];

    if (

        !allowedTypes.includes(

            file.type

        )

    ) {

        return "Utilise une image PNG, JPG, WEBP ou GIF.";

    }

    const maxSize =

        10

        *

        1024

        *

        1024;

    if (

        file.size > maxSize

    ) {

        return "L'image ne peut pas dépasser 10 Mo.";

    }

    return null;

}

/* =========================================================

   SET ARTWORK FILE

========================================================= */

function setArtworkFile(

    file:

        File | null

) {

    if (

        !file

    ) {

        return;

    }

    const error =

        validateImageFile(

            file

        );

    if (

        error

    ) {

        errorMessage.value =

            error;

        return;

    }

    errorMessage.value =

        "";

    revokeArtworkPreview();

    artworkFile.value =

        file;

    artworkPreview.value =

        URL.createObjectURL(

            file

        );

}

/* =========================================================

   SET BACK FILE

========================================================= */

function setBackFile(

    file:

        File | null

) {

    if (

        !file

    ) {

        return;

    }

    const error =

        validateImageFile(

            file

        );

    if (

        error

    ) {

        errorMessage.value =

            error;

        return;

    }

    errorMessage.value =

        "";

    revokeBackPreview();

    backFile.value =

        file;

    backPreview.value =

        URL.createObjectURL(

            file

        );

}

/* =========================================================

   INPUT EVENTS

========================================================= */

function onArtworkFileChange(

    event:

        Event

) {

    const input =

        event.target as HTMLInputElement;

    setArtworkFile(

        input.files?.[0]

        ??

        null

    );

    input.value =

        "";

}

function onBackFileChange(

    event:

        Event

) {

    const input =

        event.target as HTMLInputElement;

    setBackFile(

        input.files?.[0]

        ??

        null

    );

    input.value =

        "";

}

/* =========================================================

   DRAG / DROP ARTWORK

========================================================= */

function onArtworkDrop(

    event:

        DragEvent

) {

    artworkDragging.value =

        false;

    setArtworkFile(

        event.dataTransfer

            ?.files?.[0]

        ??

        null

    );

}

/* =========================================================

   DRAG / DROP BACK

========================================================= */

function onBackDrop(

    event:

        DragEvent

) {

    backDragging.value =

        false;

    setBackFile(

        event.dataTransfer

            ?.files?.[0]

        ??

        null

    );

}

/* =========================================================

   REMOVE SELECTED FILE

========================================================= */

function removeArtworkSelection() {

    revokeArtworkPreview();

    artworkFile.value =

        null;

    /*

     * En modification on conserve l'ancienne image.

     * En création, il n'y en a simplement plus.

     */

}

/* =========================================================

   REMOVE EXISTING BACK

========================================================= */

function removeBackImage() {

    revokeBackPreview();

    backFile.value =

        null;

    form.value.backImageUrl =

        "";

}

/* =========================================================

   VALIDATE FORM

========================================================= */

function validateForm():

    string | null {

    if (

        !Number.isInteger(

            Number(

                form.value.number

            )

        )

        ||

        Number(

            form.value.number

        ) <= 0

    ) {

        return "Le numéro de la carte est invalide.";

    }

    if (

        !form.value.name.trim()

    ) {

        return "Le nom de la carte est obligatoire.";

    }

    if (

        !form.value.imageUrl

        &&

        !artworkFile.value

    ) {

        return "Choisis une illustration pour la carte.";

    }

    if (

        !Number.isInteger(

            Number(

                form.value.weight

            )

        )

        ||

        Number(

            form.value.weight

        ) < 0

    ) {

        return "Le poids doit être un entier supérieur ou égal à 0.";

    }

    if (

        form.value.availableFrom

        &&

        form.value.availableUntil

        &&

        new Date(

            form.value.availableUntil

        ).getTime()

        <=

        new Date(

            form.value.availableFrom

        ).getTime()

    ) {

        return "La date de fin doit être postérieure à la date de début.";

    }

    return null;

}

/* =========================================================

   SUBMIT

========================================================= */

async function submitForm() {

    if (

        saving.value

    ) {

        return;

    }

    if (!creditsLoaded.value || loadingCredits.value) {

        errorMessage.value = "Les crédits ne sont pas encore chargés. Réessaie après leur chargement.";

        return;

    }

    errorMessage.value =

        "";

    const validationError =

        validateForm();

    if (

        validationError

    ) {

        errorMessage.value =

            validationError;

        return;

    }

    saving.value =

        true;

    try {

        let finalImageUrl =

            form.value.imageUrl;

        let finalBackImageUrl =

            form.value.backImageUrl;

        /*

         * Upload nouvelle illustration.

         */

        if (artworkFile.value || cropDirty.value) {
            cropBusy.value = true;
            const fileToUpload = cropDirty.value
                ? await exportCroppedArtwork()
                : artworkFile.value!;
            const uploaded = await uploadCardImage(
                    fileToUpload,

                    "artwork"

                );

            finalImageUrl = uploaded.url;
            cropBusy.value = false;

        }

        /*

         * Upload éventuel dos personnalisé.

         */

        if (

            backFile.value

        ) {

            const uploaded =

                await uploadCardImage(

                    backFile.value,

                    "back"

                );

            finalBackImageUrl =

                uploaded.url;

        }

        const creditsToSave = normalizedCredits();

        const firstArtist = creditsToSave[0];

        const payload:

            CardAdminInput = {

                number:

                    Number(

                        form.value.number

                    ),

                name:

                    form.value.name

                        .trim(),

                description:

                    form.value.description

                        .trim()

                    ||

                    null,

                rarity:

                    form.value.rarity,

                category:

                    form.value.category,

                orientation:

                    form.value.orientation,

                imageUrl:

                    finalImageUrl,

                backImageUrl:

                    finalBackImageUrl

                        .trim()

                    ||

                    null,

                artist:

                    firstArtist?.artistName ?? null,

                artistUrl:

                    firstArtist?.links[0]?.url ?? null,

                weight:

                    Number(

                        form.value.weight

                    ),

                status:

                    form.value.status,

                limited:

                    form.value.limited,

                availableFrom:

                    form.value.availableFrom

                        ||

                        null,

                availableUntil:

                    form.value.availableUntil

                        ||

                        null,

                revealSoundUrl:

                    form.value.revealSoundUrl

                        .trim()

                    ||

                    null,

                revealAnimation:

                    form.value.revealAnimation

                        .trim()

                    ||

                    null

            };

        let savedCard:

            Card;

        const existingCard = props.card ?? pendingSavedCard.value;

        if (existingCard) {

            savedCard = await updateCard(existingCard.id, payload);

        }

        else {

            savedCard =

                await createCard(

                    payload

                );

        }

        pendingSavedCard.value = savedCard;

        // Ne fermer le formulaire qu'une fois les crédits enregistrés.

        await saveCardArtistCredits(savedCard.id, creditsToSave);

        emit(

            "saved",

            savedCard

        );

    }

    catch (

        error

    ) {

        console.error(

            "Erreur enregistrement carte :",

            error

        );

        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible d'enregistrer la carte.";

    }

    finally {

        saving.value = false;
        cropBusy.value = false;

    }

}

/* =========================================================

   CANCEL

========================================================= */

function cancel() {

    if (

        saving.value

    ) {

        return;

    }

    emit(

        "cancel"

    );

}

/* =========================================================

   MOUNT

========================================================= */

onMounted(

    async () => {

        if (

            props.card

        ) {

            loadExistingCard();

            await loadCreditsForCard(props.card.id);

        }

        else {

            await loadNextNumber();

        }

    }

);

/* =========================================================

   CLEANUP

========================================================= */

onBeforeUnmount(

    () => {

        revokeArtworkPreview();

        revokeBackPreview();

    }

);

</script>

<template>

    <form

        class="card-form"

        @submit.prevent="submitForm"

    >

        <!-- =============================================

             HEADER

        ============================================== -->

        <header class="card-form__header">

            <div>

                <span class="card-form__eyebrow">

                    🃏 COLLECTION COUAXIA

                </span>

                <h2>

                    {{ title }}

                </h2>

                <p>

                    Configure la carte, son illustration

                    et son comportement dans la collection.

                </p>

            </div>

        </header>

        <!-- =============================================

             ERROR

        ============================================== -->

        <div

            v-if="errorMessage"

            class="card-form__message card-form__message--error"

        >

            ⚠️ {{ errorMessage }}

        </div>

        <div class="card-form__layout">

            <!-- =========================================

                 FORM

            ========================================== -->

            <div class="card-form__content">

                <!-- =====================================

                     GENERAL

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        📋 Informations générales

                    </h3>

                    <div class="card-form__grid">

                        <label class="card-form__field">

                            <span>

                                Numéro *

                            </span>

                            <input

                                v-model.number="form.number"

                                type="number"

                                min="1"

                                step="1"

                                required

                                :disabled="loadingNumber"

                            >

                            <small v-if="loadingNumber">

                                Recherche du prochain numéro...

                            </small>

                            <small v-else>

                                Numéro unique de la carte.

                            </small>

                        </label>

                        <label class="card-form__field">

                            <span>

                                Nom *

                            </span>

                            <input

                                v-model="form.name"

                                type="text"

                                maxlength="120"

                                placeholder="Ex. Couaxia exploratrice"

                                required

                            >

                        </label>

                    </div>

                    <label class="card-form__field">

                        <span>

                            Description

                        </span>

                        <textarea

                            v-model="form.description"

                            rows="4"

                            maxlength="1000"

                            placeholder="Description de la carte..."

                        ></textarea>

                    </label>

                </section>

                <!-- =====================================

                     CLASSIFICATION

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        ✨ Classification

                    </h3>

                    <div class="card-form__grid">

                        <label class="card-form__field">

                            <span>

                                Rareté *

                            </span>

                            <select

                                v-model="form.rarity"

                                required

                            >

                                <option

                                    v-for="option in rarityOptions"

                                    :key="option.value"

                                    :value="option.value"

                                >

                                    {{ option.label }}

                                </option>

                            </select>

                        </label>

                        <label class="card-form__field">

                            <span>

                                Catégorie *

                            </span>

                            <select

                                v-model="form.category"

                                required

                            >

                                <option

                                    v-for="option in categoryOptions"

                                    :key="option.value"

                                    :value="option.value"

                                >

                                    {{ option.label }}

                                </option>

                            </select>

                        </label>

                        <label class="card-form__field">

                            <span>

                                Poids

                            </span>

                            <input

                                v-model.number="form.weight"

                                type="number"

                                min="0"

                                step="1"

                            >

                            <small>

                                Plus le poids est élevé,

                                plus la carte peut être tirée.

                            </small>

                        </label>

                        <label class="card-form__field">

                            <span>

                                Statut

                            </span>

                            <select

                                v-model="form.status"

                            >

                                <option

                                    v-for="option in statusOptions"

                                    :key="option.value"

                                    :value="option.value"

                                >

                                    {{ option.label }}

                                </option>

                            </select>

                        </label>

                    </div>

                </section>

                <!-- FORMAT / ORIENTATION -->
                <section class="card-form__section">
                    <h3>🌍 Type et format</h3>
                    <div class="card-form__grid">
                        <label class="card-form__field">
                            <span>Orientation</span>
                            <select v-model="form.orientation">
                                <option value="portrait">🃏 Verticale — 4:5</option>
                                <option value="landscape">🌍 Horizontale — 5:4</option>
                            </select>
                        </label>
                        <div class="card-form__field">
                            <span>Type de carte</span>
                            <small>Choisis « Événement » dans Catégorie pour une carte Event ; « Lore » ou « Spéciale » pour une carte Terrain.</small>
                        </div>
                    </div>
                    <p class="card-form__section-description">Le cadre spécial est dessiné en CSS : aucune image de cadre à fournir. L'orientation est enregistrée avec la carte.</p>
                </section>

                <!-- =====================================

                     ARTWORK

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        🖼️ Illustration

                    </h3>

                    <div

                        class="card-upload"

                        :class="{

                            'card-upload--dragging':

                                artworkDragging

                        }"

                        @dragenter.prevent="

                            artworkDragging = true

                        "

                        @dragover.prevent="

                            artworkDragging = true

                        "

                        @dragleave.prevent="

                            artworkDragging = false

                        "

                        @drop.prevent="onArtworkDrop"

                    >

                        <input

                            id="card-artwork-file"

                            class="card-upload__input"

                            type="file"

                            accept="image/png,image/jpeg,image/webp,image/gif"

                            @change="onArtworkFileChange"

                        >

                        <label

                            for="card-artwork-file"

                            class="card-upload__label"

                        >

                            <span class="card-upload__icon">

                                🖼️

                            </span>

                            <strong>

                                {{

                                    artworkFile

                                        ? artworkFile.name

                                        : "Choisir une illustration"

                                }}

                            </strong>

                            <span>

                                Clique ici ou glisse une image

                            </span>

                            <small>

                                PNG • JPG • WEBP • GIF — 10 Mo maximum

                            </small>

                        </label>

                    </div>

                    <div

                        v-if="artworkFile"

                        class="card-upload__selected"

                    >

                        <span>

                            ✓ Nouvelle illustration sélectionnée

                        </span>

                        <button

                            type="button"

                            @click="removeArtworkSelection"

                        >

                            Retirer

                        </button>

                    </div>

                    <small

                        v-else-if="

                            editing

                            &&

                            form.imageUrl

                        "

                        class="card-form__hint"

                    >

                        L'illustration actuelle sera conservée

                        si tu ne choisis pas de nouveau fichier.

                    </small>

                </section>

                <!-- =====================================
                     CADRAGE DE L’ILLUSTRATION
                ====================================== -->

                <section v-if="displayedArtwork" class="card-form__section">
                   <h3>✂️ Cadrage de la carte</h3>
                   <p class="card-form__section-description">
                       Glisse l’image dans le cadre pour la déplacer, puis règle le zoom.
                       Le cadrage sera enregistré dans l’illustration ({{ form.orientation === "landscape" ? "5:4" : "4:5" }}).
                   </p>
                   <div class="card-crop-editor">
                       <canvas
                           ref="cropCanvas"
                           class="card-crop-editor__canvas"
                            :class="{ 'card-crop-editor__canvas--landscape': form.orientation === 'landscape' }"
                           aria-label="Déplacer l’illustration dans la carte"
                           @pointerdown="onCropPointerDown"
                           @pointermove="onCropPointerMove"
                           @pointerup="onCropPointerUp"
                           @pointercancel="onCropPointerUp"
                           @lostpointercapture="onCropPointerUp"
                       ></canvas>
                       <div class="card-crop-editor__controls">
                           <label for="card-crop-zoom">Zoom : {{ Math.round(cropZoom * 100) }} %</label>
                           <input id="card-crop-zoom" v-model.number="cropZoom"
                               type="range" min="1" max="3" step="0.01"
                               @input="onCropZoomChange" />
                           <button type="button" class="card-form__button card-form__button--secondary"
                               @click="resetCrop">↺ Recentrer</button>
                       </div>
                       <small>Pour enregistrer un nouveau cadrage, déplace l’image ou change le zoom.
                           Les GIF recadrés seront convertis en image PNG fixe.</small>
                   </div>
               </section>

                <!-- =====================================
                    MULTIPLE ARTIST CREDITS
                ====================================== -->

                <section class="card-form__section">

                    <h3>🎨 Crédits artistiques (facultatif)</h3>

                    <p class="card-form__section-description">

                        Ajoute autant d'artistes et de liens que nécessaire.

                    </p>

                    <p v-if="loadingCredits" class="card-form__hint">

                        Chargement des crédits existants...

                    </p>

                    <ArtistCreditsEditor

                        v-else-if="creditsLoaded"

                        v-model="artistCredits"

                        :disabled="saving"

                    />

                    <p v-else class="card-form__message card-form__message--error">

                        Impossible de charger les crédits. Ferme puis rouvre la carte pour réessayer.

                    </p>

                </section>

                <!-- =====================================

                     BACK

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        🂠 Dos personnalisé

                    </h3>

                    <p class="card-form__section-description">

                        Facultatif. Si aucune image n'est choisie,

                        le futur dos commun de la collection pourra être utilisé.

                    </p>

                    <div

                        class="card-upload card-upload--small"

                        :class="{

                            'card-upload--dragging':

                                backDragging

                        }"

                        @dragenter.prevent="

                            backDragging = true

                        "

                        @dragover.prevent="

                            backDragging = true

                        "

                        @dragleave.prevent="

                            backDragging = false

                        "

                        @drop.prevent="onBackDrop"

                    >

                        <input

                            id="card-back-file"

                            class="card-upload__input"

                            type="file"

                            accept="image/png,image/jpeg,image/webp,image/gif"

                            @change="onBackFileChange"

                        >

                        <label

                            for="card-back-file"

                            class="card-upload__label"

                        >

                            <span class="card-upload__icon">

                                🂠

                            </span>

                            <strong>

                                {{

                                    backFile

                                        ? backFile.name

                                        : "Choisir un dos personnalisé"

                                }}

                            </strong>

                            <small>

                                Facultatif

                            </small>

                        </label>

                    </div>

                    <button

                        v-if="

                            form.backImageUrl

                            ||

                            backFile

                        "

                        type="button"

                        class="card-form__remove"

                        @click="removeBackImage"

                    >

                        Supprimer le dos personnalisé

                    </button>

                </section>

                <!-- =====================================

                     AVAILABILITY

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        📅 Disponibilité

                    </h3>

                    <label class="card-form__checkbox">

                        <input

                            v-model="form.limited"

                            type="checkbox"

                        >

                        <span>

                            <strong>

                                Carte limitée

                            </strong>

                            <small>

                                Indique visuellement qu'il s'agit

                                d'une carte limitée.

                            </small>

                        </span>

                    </label>

                    <div class="card-form__grid">

                        <label class="card-form__field">

                            <span>

                                Disponible à partir de

                            </span>

                            <input

                                v-model="form.availableFrom"

                                type="datetime-local"

                            >

                        </label>

                        <label class="card-form__field">

                            <span>

                                Disponible jusqu'au

                            </span>

                            <input

                                v-model="form.availableUntil"

                                type="datetime-local"

                            >

                        </label>

                    </div>

                </section>

                <!-- =====================================

                     TWITCH / OBS

                ====================================== -->

                <section class="card-form__section">

                    <h3>

                        🎥 Twitch / OBS

                    </h3>

                    <div class="card-form__grid">

                        <label class="card-form__field">

                            <span>

                                Son de révélation

                            </span>

                            <input

                                v-model="form.revealSoundUrl"

                                type="url"

                                placeholder="https\://..."

                            >

                            <small>

                                Facultatif. Nous pourrons ajouter

                                l'upload audio plus tard.

                            </small>

                        </label>

                        <label class="card-form__field">

                            <span>

                                Animation

                            </span>

                            <select

                                v-model="form.revealAnimation"

                            >

                                <option

                                    v-for="option in animationOptions"

                                    :key="option.value"

                                    :value="option.value"

                                >

                                    {{ option.label }}

                                </option>

                            </select>

                        </label>

                    </div>

                </section>

            </div>

            <!-- =========================================

                 LIVE PREVIEW

            ========================================== -->

            <aside class="card-form__preview">

                <span class="card-form__preview-title">

                    APERÇU

                </span>

                <div

                    class="preview-card"
                    :class="{ 'preview-card--landscape': form.orientation === 'landscape', 'preview-card--terrain': form.orientation === 'landscape' && form.category !== 'event', 'preview-card--event': form.category === 'event' }"

                    :data-rarity="form.rarity"

                >

                    <div class="preview-card__image">

                        <img

                            v-if="displayedArtwork"

                            :src="cropPreviewData || displayedArtwork"

                            :alt="

                                form.name

                                ||

                                'Aperçu de la carte'

                            "

                        >

                        <div

                            v-else

                            class="preview-card__placeholder"

                        >

                            🖼️

                        </div>

                        <span class="preview-card__number">

                            {{ formattedNumber }}

                        </span>

                        <span

                            v-if="form.limited"

                            class="preview-card__limited"

                        >

                            LIMITÉE

                        </span>

                    </div>

                    <div class="preview-card__body">

                        <span class="preview-card__rarity">

                            {{

                                rarityOptions.find(

                                    option =>

                                        option.value

                                        ===

                                        form.rarity

                                )?.label

                            }}

                        </span>

                        <h3>

                            {{

                                form.name

                                ||

                                "Nom de la carte"

                            }}

                        </h3>

                        <p>

                            {{

                                form.description

                                ||

                                "La description de la carte apparaîtra ici."

                            }}

                        </p>

                        <small

                            v-if="artistCredits.some(credit => credit.artistName.trim())"

                        >

                            🎨 {{ artistCredits.filter(credit => credit.artistName.trim()).map(credit => credit.artistName.trim()).join(" · ") }}

                        </small>

                    </div>

                </div>

                <div

                    v-if="displayedBack"

                    class="card-form__back-preview"

                >

                    <span>

                        Dos personnalisé

                    </span>

                    <img

                        :src="displayedBack"

                        alt="Dos de la carte"

                    >

                </div>

            </aside>

        </div>

        <!-- =============================================

             ACTIONS

        ============================================== -->

        <footer class="card-form__actions">

            <button

                type="button"

                class="card-form__button card-form__button--secondary"

                :disabled="saving"

                @click="cancel"

            >

                Annuler

            </button>

            <button

                type="submit"

                class="card-form__button card-form__button--primary"

                :disabled="

                    saving

                    ||

                    loadingNumber

                    ||

                    loadingCredits

                    ||

                    !creditsLoaded

                "

            >

                {{

                    saving

                        ? "⏳ "

                        : "💾 "

                }}

                {{ submitLabel }}

            </button>

        </footer>

    </form>

</template>

<style scoped>

/* =========================================================

   HEADER

========================================================= */

.card-form__header {

    margin-bottom: 24px;

}

.card-form__eyebrow {

    display: block;

    margin-bottom: 6px;

    color: #e58cff;

    font-size: 0.78rem;

    font-weight: 800;

    letter-spacing: 0.12em;

}

.card-form__header h2 {

    margin: 0 0 6px;

    font-size: clamp(1.6rem, 3vw, 2.2rem);

}

.card-form__header p {

    margin: 0;

    color: rgba(255, 255, 255, 0.65);

}

/* =========================================================

   MESSAGE

========================================================= */

.card-form__message {

    margin-bottom: 20px;

    padding: 14px 16px;

    border-radius: 14px;

}

.card-form__message--error {

    border: 1px solid rgba(255, 91, 122, 0.4);

    background: rgba(255, 65, 105, 0.12);

    color: #ffb1c2;

}

/* =========================================================

   LAYOUT

========================================================= */

.card-form__layout {

    display: grid;

    grid-template-columns:

        minmax(0, 1fr)

        minmax(280px, 370px);

    gap: 28px;

    align-items: start;

}

.card-form__content {

    min-width: 0;

}

/* =========================================================

   SECTION

========================================================= */

.card-form__section {

    margin-bottom: 22px;

    padding: 20px;

    border: 1px solid rgba(255, 255, 255, 0.08);

    border-radius: 18px;

    background: rgba(255, 255, 255, 0.025);

}

.card-form__section h3 {

    margin: 0 0 18px;

    font-size: 1.05rem;

}

.card-form__section-description {

    margin: -8px 0 18px;

    color: rgba(255, 255, 255, 0.55);

    font-size: 0.85rem;

}

/* =========================================================

   GRID

========================================================= */

.card-form__grid {

    display: grid;

    grid-template-columns:

        repeat(2, minmax(0, 1fr));

    gap: 16px;

}

/* =========================================================

   FIELD

========================================================= */

.card-form__field {

    display: flex;

    flex-direction: column;

    gap: 7px;

    margin-bottom: 16px;

}

.card-form__field > span {

    color: rgba(255, 255, 255, 0.88);

    font-size: 0.88rem;

    font-weight: 700;

}

.card-form__field small,

.card-form__hint {

    color: rgba(255, 255, 255, 0.45);

    font-size: 0.76rem;

}

.card-form input,

.card-form textarea,

.card-form select {

    width: 100%;

    box-sizing: border-box;

    border: 1px solid rgba(255, 255, 255, 0.11);

    border-radius: 12px;

    padding: 11px 13px;

    background: rgba(7, 4, 14, 0.72);

    color: #ffffff;

    font: inherit;

    outline: none;

    transition:

        border-color 0.2s ease,

        box-shadow 0.2s ease;

}

.card-form input:focus,

.card-form textarea:focus,

.card-form select:focus {

    border-color: rgba(226, 89, 255, 0.75);

    box-shadow:

        0 0 0 3px rgba(206, 77, 255, 0.11);

}

.card-form textarea {

    resize: vertical;

}

/* =========================================================

   UPLOAD

========================================================= */

.card-upload {

    position: relative;

    display: flex;

    min-height: 170px;

    border: 2px dashed rgba(219, 112, 255, 0.34);

    border-radius: 18px;

    background:

        linear-gradient(

            145deg,

            rgba(205, 79, 255, 0.06),

            rgba(255, 67, 169, 0.03)

        );

    transition:

        border-color 0.2s ease,

        background 0.2s ease,

        transform 0.2s ease;

}

.card-upload:hover,

.card-upload--dragging {

    border-color: rgba(239, 115, 255, 0.85);

    background:

        linear-gradient(

            145deg,

            rgba(205, 79, 255, 0.13),

            rgba(255, 67, 169, 0.07)

        );

}

.card-upload--dragging {

    transform: scale(1.01);

}

.card-upload--small {

    min-height: 125px;

}

.card-upload__input {

    position: absolute;

    width: 1px !important;

    height: 1px;

    opacity: 0;

    pointer-events: none;

}

.card-upload__label {

    display: flex;

    width: 100%;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    gap: 7px;

    padding: 24px;

    text-align: center;

    cursor: pointer;

}

.card-upload__icon {

    font-size: 2rem;

}

.card-upload__label strong {

    color: #f0c2ff;

}

.card-upload__label > span:not(.card-upload__icon) {

    color: rgba(255, 255, 255, 0.65);

    font-size: 0.86rem;

}

.card-upload__label small {

    color: rgba(255, 255, 255, 0.4);

}

.card-upload__selected {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 12px;

    margin-top: 10px;

    padding: 10px 12px;

    border-radius: 10px;

    background: rgba(88, 255, 172, 0.08);

    color: #a8ffd3;

    font-size: 0.82rem;

}

.card-upload__selected button,

.card-form__remove {

    border: 0;

    background: transparent;

    color: #ff94ae;

    cursor: pointer;

}

/* =========================================================

   CHECKBOX

========================================================= */

.card-form__checkbox {

    display: flex;

    align-items: flex-start;

    gap: 12px;

    margin-bottom: 18px;

    cursor: pointer;

}

.card-form__checkbox input {

    width: 18px;

    height: 18px;

    margin-top: 2px;

}

.card-form__checkbox span {

    display: flex;

    flex-direction: column;

    gap: 3px;

}

.card-form__checkbox small {

    color: rgba(255, 255, 255, 0.45);

}

/* =========================================================

   PREVIEW

========================================================= */

.card-form__preview {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    position: sticky;

    top: 0;

    display: flex;

    flex-direction: column;

    gap: 14px;

}

.card-form__preview-title {

    color: rgba(255, 255, 255, 0.45);

    font-size: 0.75rem;

    font-weight: 800;

    letter-spacing: 0.14em;

}

.preview-card {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    border: 2px solid rgba(255, 255, 255, 0.14);

    border-radius: 20px;

    background:

        linear-gradient(

            145deg,

            rgba(47, 24, 67, 0.98),

            rgba(16, 8, 27, 0.98)

        );

    box-shadow:

        0 18px 45px rgba(0, 0, 0, 0.35);

}

.preview-card[data-rarity="common"] {

    border-color: rgba(220, 220, 220, 0.5);

}

.preview-card[data-rarity="uncommon"] {

    border-color: rgba(84, 255, 155, 0.6);

}

.preview-card[data-rarity="rare"] {

    border-color: rgba(72, 151, 255, 0.75);

}

.preview-card[data-rarity="epic"] {

    border-color: rgba(196, 90, 255, 0.8);

}

.preview-card[data-rarity="legendary"] {

    border-color: rgba(255, 207, 72, 0.85);

}

.preview-card[data-rarity="mythic"] {

    border-color: rgba(255, 81, 174, 0.9);

    box-shadow:

        0 0 30px rgba(255, 63, 176, 0.2);

}

.preview-card__image {

    position: relative;

    aspect-ratio: 4 / 5;

    overflow: hidden;

    background: rgba(0, 0, 0, 0.25);

}

.preview-card__image img {

    width: 100%;

    height: 100%;

    object-fit: cover;

}

.preview-card__placeholder {

    display: grid;

    width: 100%;

    height: 100%;

    place-items: center;

    font-size: 3rem;

    opacity: 0.4;

}

.preview-card__number {

    position: absolute;

    top: 10px;

    left: 10px;

    padding: 5px 8px;

    border-radius: 8px;

    background: rgba(0, 0, 0, 0.72);

    font-size: 0.72rem;

    font-weight: 800;

}

.preview-card__limited {

    position: absolute;

    top: 10px;

    right: 10px;

    padding: 5px 8px;

    border-radius: 8px;

    background: rgba(255, 56, 139, 0.9);

    font-size: 0.62rem;

    font-weight: 900;

}

.preview-card__body {

    padding: 16px;

}

.preview-card__rarity {

    color: #e7b4ff;

    font-size: 0.72rem;

    font-weight: 800;

}

.preview-card__body h3 {

    margin: 7px 0 8px;

    font-size: 1.2rem;

}

.preview-card__body p {

    margin: 0 0 12px;

    color: rgba(255, 255, 255, 0.6);

    font-size: 0.82rem;

    line-height: 1.5;

}

.preview-card__body small {

    color: rgba(255, 255, 255, 0.45);

}

/* =========================================================

   BACK PREVIEW

========================================================= */

.card-form__back-preview {

    padding: 12px;

    border: 1px solid rgba(255, 255, 255, 0.08);

    border-radius: 14px;

    background: rgba(255, 255, 255, 0.025);

}

.card-form__back-preview span {

    display: block;

    margin-bottom: 8px;

    color: rgba(255, 255, 255, 0.55);

    font-size: 0.75rem;

}

.card-form__back-preview img {

    display: block;

    width: 100%;

    max-height: 180px;

    object-fit: contain;

    border-radius: 10px;

}

/* =========================================================

   ACTIONS

========================================================= */

.card-form__actions {

    display: flex;

    justify-content: flex-end;

    gap: 12px;

    margin-top: 24px;

    padding-top: 20px;

    border-top: 1px solid rgba(255, 255, 255, 0.08);

}

.card-form__button {

    border: 0;

    border-radius: 12px;

    padding: 12px 18px;

    font: inherit;

    font-weight: 800;

    cursor: pointer;

    transition:

        transform 0.2s ease,

        opacity 0.2s ease;

}

.card-form__button:hover:not(:disabled) {

    transform: translateY(-1px);

}

.card-form__button:disabled {

    opacity: 0.55;

    cursor: not-allowed;

}

.card-form__button--secondary {

    border: 1px solid rgba(255, 255, 255, 0.12);

    background: rgba(255, 255, 255, 0.06);

    color: #ffffff;

}

.card-form__button--primary {

    background:

        linear-gradient(

            135deg,

            #a843e5,

            #e143ad

        );

    color: #ffffff;

    box-shadow:

        0 8px 25px rgba(202, 58, 188, 0.22);

}

/* =========================================================

   RESPONSIVE

========================================================= */

@media (

    max-width: 900px

) {

    .card-form__layout {

        grid-template-columns: 1fr;

    }

    .card-form__preview {

        position: static;

        max-width: 340px;

        margin: 0 auto;

    }

}

@media (

    max-width: 620px

) {

    .card-form {

        padding: 18px;

    }

    .card-form__grid {

        grid-template-columns: 1fr;

    }

    .card-form__section {

        padding: 16px;

    }

    .card-form__actions {

        flex-direction: column-reverse;

    }

    .card-form__button {

        width: 100%;

    }

}

/* Éditeur de cadrage */
.card-crop-editor {
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
}
.card-crop-editor__canvas {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    border: 2px solid #cf2c9f;
    border-radius: 14px;
    background: #160a22;
    cursor: grab;
    touch-action: none;
    user-select: none;
}
.card-crop-editor__canvas:active { cursor: grabbing; }
.card-crop-editor__controls { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.card-crop-editor__controls input { width: 100%; accent-color: #e22aa6; }
.card-crop-editor__controls button { align-self: flex-start; }
.card-crop-editor > small { grid-column: 1 / -1; color: #c7b0d4; }
.card-form::-webkit-scrollbar { width: 9px; }
.card-form::-webkit-scrollbar-track { background: #1b0c2b; border-radius: 10px; }
.card-form::-webkit-scrollbar-thumb { background: linear-gradient(#e12b9f, #8034d9); border-radius: 10px; }
@media (max-width: 720px) {
    .card-form { width: calc(100vw - 20px); max-height: calc(100dvh - 20px); padding: 16px; }
    .card-crop-editor { grid-template-columns: 1fr; }
    .card-crop-editor__canvas { max-width: 280px; }
}

/* =========================================================
   MODALE LARGE — AJOUT ET MODIFICATION
   La largeur est pilotée par AdminCards.vue.
========================================================= */
.card-form {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    max-height: none;
    min-width: 0;
    margin: 0;
    overflow: visible;
    border: 0;
    border-radius: 0;
    box-shadow: none;
}
.card-form__layout {
    grid-template-columns: minmax(0, 1.8fr) minmax(300px, 1fr);
    gap: clamp(16px, 2vw, 32px);
    min-width: 0;
}
.card-form__content, .card-form__preview, .card-form__section {
    min-width: 0;
    max-width: 100%;
}
@media (max-width: 1000px) {
    .card-form__layout { grid-template-columns: 1fr; }
    .card-form__preview { position: static; max-width: 420px; margin: 0 auto; }
}
@media (max-width: 620px) {
    .card-form { padding: 16px; }
    .card-form__layout { gap: 16px; }
}

/* =========================================================
   COUAXIA — FORMULAIRE DE CARTES
   CORRECTION DE LA FENÊTRE LARGE
========================================================= */

/* Le formulaire occupe toute la largeur disponible */
.card-form {
    box-sizing: border-box;

    display: block;

    width: 100%;
    max-width: 100%;
    min-width: 0;

    height: auto;
    max-height: none;

    margin: 0;
    padding: clamp(16px, 2vw, 28px);

    overflow: visible;

    border: none;
    border-radius: 0;
    box-shadow: none;
}

/* Deux colonnes : formulaire et aperçu */
.card-form__layout {
    display: grid;

    grid-template-columns:
        minmax(0, 1.8fr)
        minmax(300px, 1fr);

    gap: clamp(20px, 2.5vw, 36px);

    width: 100%;
    min-width: 0;

    align-items: start;
}

/* Partie gauche */
.card-form__content {
    width: 100%;
    min-width: 0;
    max-width: 100%;
}

/* Sections du formulaire */
.card-form__section {
    box-sizing: border-box;

    width: 100%;
    min-width: 0;
    max-width: 100%;

    overflow-wrap: anywhere;
}

/* Champs sur deux colonnes */
.card-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.card-form__field {
    min-width: 0;
}

/* Inputs et zones de texte */
.card-form input,
.card-form textarea,
.card-form select {
    box-sizing: border-box;
    max-width: 100%;
}

/* =========================================================
   APERÇU DE LA CARTE
========================================================= */

.card-form__preview {
    position: sticky;
    top: 20px;

    display: flex;
    flex-direction: column;

    width: 100%;
    min-width: 0;
    max-width: 440px;

    margin: 0 auto;

    gap: 16px;
}

/* Carte entièrement visible */
.preview-card {
    box-sizing: border-box;

    width: 100%;
    min-width: 0;
    max-width: 100%;

    overflow: hidden;
}

/* Illustration */
.preview-card__image {
    position: relative;

    width: 100%;
    aspect-ratio: 4 / 5;

    overflow: hidden;
}

.preview-card__image img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;
}

/* =========================================================
   ÉDITEUR DE CADRAGE
========================================================= */

.card-crop-editor {
    display: grid;

    grid-template-columns:
        minmax(180px, 300px)
        minmax(0, 1fr);

    gap: 20px;

    width: 100%;
    min-width: 0;

    align-items: start;
}

.card-crop-editor__canvas {
    display: block;

    box-sizing: border-box;

    width: 100%;
    max-width: 300px;

    aspect-ratio: 4 / 5;

    border: 2px solid #cf2c9f;
    border-radius: 14px;

    background: #160a22;

    cursor: grab;
    touch-action: none;
    user-select: none;
}

.card-crop-editor__canvas:active {
    cursor: grabbing;
}

.card-crop-editor__controls {
    display: flex;
    flex-direction: column;

    min-width: 0;
    gap: 14px;
}

.card-crop-editor__controls input[type="range"] {
    width: 100%;
    accent-color: #e22aa6;
}

/* =========================================================
   RESPONSIVE — TABLETTE
========================================================= */

@media (max-width: 1100px) {
    .card-form__layout {
        grid-template-columns: 1fr;
    }

    .card-form__preview {
        position: static;
        max-width: 420px;
    }
}

/* =========================================================
   RESPONSIVE — MOBILE
========================================================= */

@media (max-width: 680px) {
    .card-form {
        width: 100%;
        max-width: 100%;

        padding: 16px;
    }

    .card-form__grid {
        grid-template-columns: 1fr;
    }

    .card-form__section {
        padding: 16px;
    }

    .card-crop-editor {
        grid-template-columns: 1fr;
    }

    .card-crop-editor__canvas {
        max-width: 280px;
        margin: 0 auto;
    }

    .card-form__preview {
        width: 100%;
        max-width: 340px;
    }

    .card-form__actions {
        flex-direction: column-reverse;
    }

    .card-form__actions button {
        width: 100%;
    }
}


/* =========================================================
   CARTES HORIZONTALES : TERRAIN & ÉVÉNEMENT
========================================================= */
.preview-card--landscape .preview-card__image { aspect-ratio: 5 / 4; }
.card-crop-editor__canvas--landscape { aspect-ratio: 5 / 4; }
.preview-card--terrain {
    position: relative;
    border: 3px solid #dca9ff;
    background: linear-gradient(135deg, #311249, #120820 65%, #43144a);
    box-shadow: 0 0 18px rgba(205, 90, 255, .32), inset 0 0 16px rgba(255, 190, 250, .12);
}
.preview-card--terrain::after {
    content: "✦ TERRAIN ✦";
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 16px;
    border: 1px solid rgba(255, 223, 255, .75);
    border-radius: 999px;
    background: rgba(24, 8, 42, .82);
    color: #ffe6ff;
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .13em;
    pointer-events: none;
    white-space: nowrap;
}
.preview-card--event { border-style: double; border-width: 4px; }
.preview-card--event .preview-card__body { background: linear-gradient(135deg, rgba(255, 74, 163, .14), rgba(117, 49, 209, .14)); }
@media (prefers-reduced-motion: no-preference) {
    .preview-card--terrain:hover { filter: drop-shadow(0 0 12px rgba(241, 147, 255, .45)); }
}

</style>