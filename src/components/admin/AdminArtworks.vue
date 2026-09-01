<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    createAdminArtwork,
    deleteAdminArtwork,
    getAdminArtworks,
    updateAdminArtwork
} from "../../services/admin.service";

import type {
    AdminArtwork,
    ArtworkPayload
} from "../../services/admin.service";

/* =========================================================
   TYPES
========================================================= */

type ArtworkMediaType =
    | "image"
    | "video"
    | "gif";


interface ArtworkForm {

    art_id: string;

    artist: string;

    artist_role: string;

    description: string;

    image_url: string;

    image_alt: string;

    media_type: ArtworkMediaType;

    tags: string;

    image_message: string;

    artist_url: string;

    button_text: string;

    button_message: string;

    sensitive: boolean;

    favorite_enabled: boolean;

    visible: boolean;

    sort_order: number;

}


/* =========================================================
   STATE
========================================================= */

const artworks =
    ref<AdminArtwork[]>([]);


const loading =
    ref(true);


const saving =
    ref(false);


const deletingArtworkId =
    ref<string | null>(
        null
    );


const selectedArtwork =
    ref<AdminArtwork | null>(
        null
    );


const editing =
    ref(false);


const formOpen =
    ref(false);


const search =
    ref("");


const filter =
    ref<
        "all"
        |
        "visible"
        |
        "hidden"
        |
        "sensitive"
        |
        "favorites"
    >(
        "all"
    );


const errorMessage =
    ref("");


const successMessage =
    ref("");


/* =========================================================
   EMPTY FORM
========================================================= */

function createEmptyForm():
    ArtworkForm {

    return {

        art_id:
            "",

        artist:
            "",

        artist_role:
            "",

        description:
            "",

        image_url:
            "",

        image_alt:
            "",

        media_type:
            "image",

        tags:
            "",

        image_message:
            "",

        artist_url:
            "",

        button_text:
            "Voir son profil",

        button_message:
            "",

        sensitive:
            false,

        favorite_enabled:
            true,

        visible:
            true,

        sort_order:
            0

    };

}


const form =
    ref<ArtworkForm>(
        createEmptyForm()
    );


/* =========================================================
   FILTERED ARTWORKS
========================================================= */

const filteredArtworks =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return artworks.value.filter(
                artwork => {

                    const artist =
                        artwork.artist
                            ?.toLowerCase()
                        ??
                        "";


                    const role =
                        artwork.artist_role
                            ?.toLowerCase()
                        ??
                        "";


                    const description =
                        artwork.description
                            ?.toLowerCase()
                        ??
                        "";


                    const tags =
                    (
                        artwork.tags
                        ??
                        []
                    )
                        .join(" ")
                        .toLowerCase();

                    const matchesSearch =
                        !query
                        ||
                        artist.includes(
                            query
                        )
                        ||
                        role.includes(
                            query
                        )
                        ||
                        description.includes(
                            query
                        )
                        ||
                        tags.includes(
                            query
                        );


                    let matchesFilter =
                        true;


                    if (
                        filter.value
                        ===
                        "visible"
                    ) {

                        matchesFilter =
                            artwork.visible
                            ===
                            true;

                    }


                    if (
                        filter.value
                        ===
                        "hidden"
                    ) {

                        matchesFilter =
                            artwork.visible
                            !==
                            true;

                    }


                    if (
                        filter.value
                        ===
                        "sensitive"
                    ) {

                        matchesFilter =
                            artwork.sensitive
                            ===
                            true;

                    }


                    if (
                        filter.value
                        ===
                        "favorites"
                    ) {

                        matchesFilter =
                            artwork.favorite_enabled
                            ===
                            true;

                    }


                    return (
                        matchesSearch
                        &&
                        matchesFilter
                    );

                }
            );

        }
    );


/* =========================================================
   SORTED ARTWORKS
========================================================= */

const displayedArtworks =
    computed(
        () => {

            return [
                ...filteredArtworks.value
            ].sort(
                (
                    first,
                    second
                ) => {

                    return (
                        first.sort_order
                        ??
                        0
                    )
                    -
                    (
                        second.sort_order
                        ??
                        0
                    );

                }
            );

        }
    );


/* =========================================================
   STATS
========================================================= */

const visibleCount =
    computed(
        () =>
            artworks.value.filter(
                artwork =>
                    artwork.visible
                    ===
                    true
            ).length
    );


const hiddenCount =
    computed(
        () =>
            artworks.value.filter(
                artwork =>
                    artwork.visible
                    !==
                    true
            ).length
    );


const sensitiveCount =
    computed(
        () =>
            artworks.value.filter(
                artwork =>
                    artwork.sensitive
                    ===
                    true
            ).length
    );


/* =========================================================
   CAN SAVE
========================================================= */

const canSave =
    computed(
        () => {

            if (
                saving.value
            ) {

                return false;

            }


            if (
                !form.value.artist.trim()
            ) {

                return false;

            }


            if (
                !form.value.image_url.trim()
            ) {

                return false;

            }


            return true;

        }
    );


/* =========================================================
   MEDIA HELPERS
========================================================= */

function isVideo(
    mediaType:
        string | null
): boolean {

    return (
        mediaType
        ===
        "video"
    );

}


function isImage(
    mediaType:
        string | null
): boolean {

    return (
        mediaType
        !==
        "video"
    );

}


/* =========================================================
   FORM PREVIEW
========================================================= */

const previewUrl =
    computed(
        () =>
            form.value.image_url
                .trim()
    );


/* =========================================================
   LOAD
========================================================= */

async function loadArtworks() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        artworks.value =
            await getAdminArtworks();

    } catch (error) {

        console.error(
            "Erreur chargement artworks admin :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les créations.";

    } finally {

        loading.value =
            false;

    }

}


/* =========================================================
   CREATE MODAL
========================================================= */

function openCreate() {

    selectedArtwork.value =
        null;


    editing.value =
        false;


    form.value =
        createEmptyForm();


    errorMessage.value =
        "";


    successMessage.value =
        "";


    formOpen.value =
        true;

}


/* =========================================================
   EDIT MODAL
========================================================= */

function openEdit(
    artwork:
        AdminArtwork
) {

    selectedArtwork.value =
        artwork;


    editing.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


   form.value = {

    art_id:
        artwork.art_id
        ??
        "",

    artist:
        artwork.artist
        ??
        "",

    artist_role:
        artwork.artist_role
        ??
        "",

    description:
        artwork.description
        ??
        "",

    image_url:
        artwork.image_url
        ??
        "",

    image_alt:
        artwork.image_alt
        ??
        "",

    media_type:
        (
            artwork.media_type
            ===
            "video"
            ||
            artwork.media_type
            ===
            "gif"
        )
            ? artwork.media_type
            : "image",

    tags:
        (
            artwork.tags
            ??
            []
        ).join(", "),

    image_message:
        (
            artwork.image_message
            ??
            []
        ).join("\n"),

    artist_url:
        artwork.artist_url
        ??
        "",

    button_text:
        artwork.button_text
        ??
        "Voir son profil",

    button_message:
        (
            artwork.button_message
            ??
            []
        ).join("\n"),

    sensitive:
        artwork.sensitive
        ===
        true,

    favorite_enabled:
        artwork.favorite_enabled
        !==
        false,

    visible:
        artwork.visible
        !==
        false,

    sort_order:
        artwork.sort_order
        ??
        0

};


    formOpen.value =
        true;

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeForm() {

    if (
        saving.value
    ) {

        return;

    }


    formOpen.value =
        false;


    editing.value =
        false;


    selectedArtwork.value =
        null;


    form.value =
        createEmptyForm();

}


/* =========================================================
   CREATE PAYLOAD
========================================================= */

function createPayload():
    ArtworkPayload {

    const tags =
        form.value.tags
            .split(",")
            .map(
                tag =>
                    tag.trim()
            )
            .filter(
                Boolean
            );


    const imageMessage =
        form.value.image_message
            .split("\n")
            .map(
                message =>
                    message.trim()
            )
            .filter(
                Boolean
            );


    const buttonMessage =
        form.value.button_message
            .split("\n")
            .map(
                message =>
                    message.trim()
            )
            .filter(
                Boolean
            );


    return {

        art_id:
            form.value.art_id
                .trim(),

        artist:
            form.value.artist
                .trim(),

        artist_role:
            form.value.artist_role
                .trim()
            ||
            null,

        description:
            form.value.description
                .trim()
            ||
            null,

        image_url:
            form.value.image_url
                .trim(),

        image_alt:
            form.value.image_alt
                .trim()
            ||
            null,

        media_type:
            form.value.media_type,

        tags,

        image_message:
            imageMessage,

        artist_url:
            form.value.artist_url
                .trim()
            ||
            null,

        button_text:
            form.value.button_text
                .trim()
            ||
            "Voir son profil",

        button_message:
            buttonMessage,

        sensitive:
            form.value.sensitive,

        favorite_enabled:
            form.value.favorite_enabled,

        visible:
            form.value.visible,

        sort_order:
            Number(
                form.value.sort_order
            )
            ||
            0

    };

}


/* =========================================================
   SAVE
========================================================= */

async function saveArtwork() {

    if (
        !canSave.value
    ) {

        return;

    }


    saving.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const payload =
            createPayload();


        /* =================================================
           UPDATE
        ================================================== */

        if (
            editing.value
            &&
            selectedArtwork.value
        ) {

            await updateAdminArtwork(
                selectedArtwork.value.id,
                payload
            );


            successMessage.value =
                "La création a bien été modifiée. 🎨";

        }

        /* =================================================
           CREATE
        ================================================== */

        else {

            await createAdminArtwork(
                payload
            );


            successMessage.value =
                "La création a bien été ajoutée. 🎨";

        }


        await loadArtworks();


        closeForm();

    } catch (error) {

        console.error(
            "Erreur sauvegarde artwork :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'enregistrer la création.";

    } finally {

        saving.value =
            false;

    }

}


/* =========================================================
   TOGGLE VISIBILITY
========================================================= */

async function toggleVisibility(
    artwork:
        AdminArtwork
) {

    try {

        const updated =
            await updateAdminArtwork(
                artwork.id,
                {
                    visible:
                        artwork.visible
                        !==
                        true
                }
            );


        const index =
            artworks.value.findIndex(
                item =>
                    item.id
                    ===
                    artwork.id
            );


        if (
            index
            !==
            -1
        ) {

            artworks.value[index] =
                updated;

        }


        successMessage.value =
            updated.visible

                ? "La création est maintenant visible."

                : "La création est maintenant masquée.";

    } catch (error) {

        console.error(
            "Erreur visibilité artwork :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de modifier la visibilité.";

    }

}


/* =========================================================
   TOGGLE FAVORITES
========================================================= */

async function toggleFavorites(
    artwork:
        AdminArtwork
) {

    try {

        const updated =
            await updateAdminArtwork(
                artwork.id,
                {
                    favorite_enabled:
                        artwork.favorite_enabled
                        !==
                        true
                }
            );


        const index =
            artworks.value.findIndex(
                item =>
                    item.id
                    ===
                    artwork.id
            );


        if (
            index
            !==
            -1
        ) {

            artworks.value[index] =
                updated;

        }

    } catch (error) {

        console.error(
            "Erreur favoris artwork :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de modifier les favoris.";

    }

}


/* =========================================================
   DELETE
========================================================= */

async function removeArtwork(
    artwork:
        AdminArtwork
) {

    if (
        deletingArtworkId.value
    ) {

        return;

    }


    const artistName =
        artwork.artist
        ||
        "cet artiste";


    const confirmed =
        window.confirm(
            `Supprimer définitivement cette création de ${artistName} ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    deletingArtworkId.value =
        artwork.id;


    errorMessage.value =
        "";


    try {

        await deleteAdminArtwork(
            artwork.id
        );


        artworks.value =
            artworks.value.filter(
                item =>
                    item.id
                    !==
                    artwork.id
            );


        successMessage.value =
            "La création a été supprimée.";

    } catch (error) {

        console.error(
            "Erreur suppression artwork :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de supprimer la création.";

    } finally {

        deletingArtworkId.value =
            null;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadArtworks
);

</script>


<template>

    <section
        class="admin-artworks"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-section-header"
        >

            <div>

                <span
                    class="admin-section-header__eyebrow"
                >
                    🎨 GALERIE
                </span>


                <h2>
                    Crédits & Arts
                </h2>


                <p>
                    Ajoute et organise les illustrations
                    affichées dans les crédits de ton site.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--primary
                "
                @click="openCreate"
            >
                ＋ Ajouter un art
            </button>

        </header>


        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
            v-if="successMessage"
            class="
                admin-message
                admin-message--success
            "
        >
            ✓ {{ successMessage }}
        </div>


        <div
            v-if="errorMessage"
            class="
                admin-message
                admin-message--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="loading"
            class="admin-loading"
        >

            <span>
                🎨
            </span>

            <strong>
                Chargement des créations...
            </strong>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <template
            v-else
        >

            <!-- =============================================
                 STATS
            ============================================== -->

            <div
                class="admin-mini-stats"
            >

                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Créations
                    </span>

                    <strong>
                        {{ artworks.length }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Visibles
                    </span>

                    <strong>
                        {{ visibleCount }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Masquées
                    </span>

                    <strong>
                        {{ hiddenCount }}
                    </strong>
                </article>


                <article
                    class="admin-mini-stat"
                >
                    <span>
                        Sensibles
                    </span>

                    <strong>
                        {{ sensitiveCount }}
                    </strong>
                </article>

            </div>


            <!-- =============================================
                 TOOLBAR
            ============================================== -->

            <div
                class="admin-artworks-toolbar"
            >

                <div
                    class="admin-search"
                >

                    <span>
                        🔎
                    </span>


                    <input
                        v-model="search"
                        type="search"
                        placeholder="Artiste, description, tags..."
                    >

                </div>


                <div
                    class="admin-artworks-filters"
                >

                    <button
                        type="button"
                        :class="{
                            'admin-artworks-filter--active':
                                filter === 'all'
                        }"
                        @click="filter = 'all'"
                    >
                        Tous
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-artworks-filter--active':
                                filter === 'visible'
                        }"
                        @click="filter = 'visible'"
                    >
                        👁 Visibles
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-artworks-filter--active':
                                filter === 'hidden'
                        }"
                        @click="filter = 'hidden'"
                    >
                        🙈 Masqués
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-artworks-filter--active':
                                filter === 'sensitive'
                        }"
                        @click="filter = 'sensitive'"
                    >
                        🔞 Sensibles
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-artworks-filter--active':
                                filter === 'favorites'
                        }"
                        @click="filter = 'favorites'"
                    >
                        💜 Favoris
                    </button>

                </div>

            </div>


            <!-- =============================================
                 COUNT
            ============================================== -->

            <p
                class="admin-artworks-count"
            >
                {{ displayedArtworks.length }}
                création{{
                    displayedArtworks.length > 1
                        ? "s"
                        : ""
                }}
            </p>


            <!-- =============================================
                 EMPTY
            ============================================== -->

            <div
                v-if="
                    displayedArtworks.length
                    ===
                    0
                "
                class="admin-empty"
            >

                <span>
                    🎨
                </span>

                <strong>
                    Aucune création
                </strong>

                <p>
                    Aucun art ne correspond
                    à ta recherche.
                </p>

            </div>


            <!-- =============================================
                 GRID
            ============================================== -->

            <div
                v-else
                class="admin-artworks-grid"
            >

                <article
                    v-for="
                        artwork
                        in
                        displayedArtworks
                    "
                    :key="artwork.id"
                    class="admin-artwork-card"
                    :class="{
                        'admin-artwork-card--hidden':
                            artwork.visible !== true
                    }"
                >

                    <!-- =====================================
                         MEDIA
                    ====================================== -->

                    <div
                        class="admin-artwork-card__media"
                    >

                        <video
                            v-if="
                                isVideo(
                                    artwork.media_type
                                )
                            "
                            :src="
                                artwork.image_url
                                ?? ''
                            "
                            muted
                            loop
                            playsinline
                            controls
                        ></video>


                        <img
                            v-else-if="
                                isImage(
                                    artwork.media_type
                                )
                            "
                            :src="
                                artwork.image_url
                                ?? ''
                            "
                            :alt="
                                artwork.image_alt
                                ||
                                artwork.artist
                                ||
                                'Artwork'
                            "
                        >


                        <!-- BADGES -->

                        <div
                            class="
                                admin-artwork-card__badges
                            "
                        >

                            <span
                                v-if="
                                    artwork.visible !== true
                                "
                                class="
                                    admin-artwork-badge
                                    admin-artwork-badge--hidden
                                "
                            >
                                🙈 Masqué
                            </span>


                            <span
                                v-if="
                                    artwork.sensitive === true
                                "
                                class="
                                    admin-artwork-badge
                                    admin-artwork-badge--sensitive
                                "
                            >
                                🔞 Sensible
                            </span>


                            <span
                                v-if="
                                    artwork.favorite_enabled === true
                                "
                                class="
                                    admin-artwork-badge
                                    admin-artwork-badge--favorite
                                "
                            >
                                💜
                            </span>

                        </div>

                    </div>


                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div
                        class="
                            admin-artwork-card__content
                        "
                    >

                        <div
                            class="
                                admin-artwork-card__heading
                            "
                        >

                            <div>

                                <span>
                                    {{
                                        artwork.artist_role
                                        ||
                                        "Artiste"
                                    }}
                                </span>


                                <h3>
                                    {{
                                        artwork.artist
                                        ||
                                        "Artiste inconnu"
                                    }}
                                </h3>

                            </div>


                            <strong
                                class="
                                    admin-artwork-card__order
                                "
                            >
                                #{{ artwork.sort_order ?? 0 }}
                            </strong>

                        </div>


                        <p
                            v-if="
                                artwork.description
                            "
                            class="
                                admin-artwork-card__description
                            "
                        >
                            {{ artwork.description }}
                        </p>


                        <p
                            v-else
                            class="
                                admin-artwork-card__description
                                admin-artwork-card__description--empty
                            "
                        >
                            Aucune description.
                        </p>


                        <div
                            v-if="
                                artwork.tags
                            "
                            class="
                                admin-artwork-card__tags
                            "
                        >
                            {{ artwork.tags }}
                        </div>


                        <!-- =================================
                             QUICK OPTIONS
                        ================================== -->

                        <div
                            class="
                                admin-artwork-card__switches
                            "
                        >

                            <label>

                                <span>
                                    Visible
                                </span>

                                <input
                                    type="checkbox"
                                    :checked="
                                        artwork.visible === true
                                    "
                                    @change="
                                        toggleVisibility(
                                            artwork
                                        )
                                    "
                                >

                            </label>


                            <label>

                                <span>
                                    Favoris
                                </span>

                                <input
                                    type="checkbox"
                                    :checked="
                                        artwork.favorite_enabled === true
                                    "
                                    @change="
                                        toggleFavorites(
                                            artwork
                                        )
                                    "
                                >

                            </label>

                        </div>


                        <!-- =================================
                             ACTIONS
                        ================================== -->

                        <div
                            class="
                                admin-artwork-card__actions
                            "
                        >

                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--secondary
                                "
                                @click="
                                    openEdit(
                                        artwork
                                    )
                                "
                            >
                                ✎ Modifier
                            </button>


                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--danger
                                "
                                :disabled="
                                    deletingArtworkId
                                    ===
                                    artwork.id
                                "
                                @click="
                                    removeArtwork(
                                        artwork
                                    )
                                "
                            >
                                {{
                                    deletingArtworkId
                                    ===
                                    artwork.id
                                        ? "..."
                                        : "🗑"
                                }}
                            </button>

                        </div>

                    </div>

                </article>

            </div>

        </template>


        <!-- =================================================
             MODAL
        ================================================== -->

        <Teleport
            to="body"
        >

            <div
                v-if="formOpen"
                class="admin-modal"
                @click.self="closeForm"
            >

                <div
                    class="
                        admin-modal__dialog
                        admin-modal__dialog--large
                    "
                >

                    <!-- HEADER -->

                    <header
                        class="admin-modal__header"
                    >

                        <div>

                            <span
                                class="admin-modal__eyebrow"
                            >
                                🎨 CRÉDITS
                            </span>


                            <h2>
                                {{
                                    editing
                                        ? "Modifier l'art"
                                        : "Ajouter un art"
                                }}
                            </h2>

                        </div>


                        <button
                            type="button"
                            class="admin-modal__close"
                            :disabled="saving"
                            @click="closeForm"
                        >
                            ×
                        </button>

                    </header>


                    <!-- =====================================
                         FORM
                    ====================================== -->

                    <form
                        class="
                            admin-form
                            admin-artwork-form
                        "
                        @submit.prevent="
                            saveArtwork
                        "
                    >

                        <!-- =================================
                             PREVIEW
                        ================================== -->

                        <div
                            class="
                                admin-artwork-form__layout
                            "
                        >

                            <aside
                                class="
                                    admin-artwork-form__preview
                                "
                            >

                                <div
                                    class="
                                        admin-artwork-form__media
                                    "
                                >

                                    <video
                                        v-if="
                                            previewUrl
                                            &&
                                            form.media_type
                                            ===
                                            'video'
                                        "
                                        :src="previewUrl"
                                        controls
                                        muted
                                        loop
                                    ></video>


                                    <img
                                        v-else-if="
                                            previewUrl
                                        "
                                        :src="previewUrl"
                                        :alt="
                                            form.image_alt
                                            ||
                                            'Aperçu'
                                        "
                                    >


                                    <span
                                        v-else
                                    >
                                        🎨
                                    </span>

                                </div>


                                <strong>
                                    {{
                                        form.artist
                                        ||
                                        "Artiste"
                                    }}
                                </strong>


                                <small>
                                    Aperçu de la création
                                </small>

                            </aside>


                            <!-- =============================
                                 PRINCIPAL FIELDS
                            ============================== -->

                            <div
                                class="
                                    admin-artwork-form__fields
                                "
                            >

                                <div
                                    class="admin-form__row"
                                >

                                    <div
                                        class="admin-field"
                                    >

                                        <label>
                                            Artiste *
                                        </label>

                                        <input
                                            v-model="
                                                form.artist
                                            "
                                            type="text"
                                            required
                                            placeholder="Nom de l'artiste"
                                        >

                                    </div>


                                    <div
                                        class="admin-field"
                                    >

                                        <label>
                                            Rôle
                                        </label>

                                        <input
                                            v-model="
                                                form.artist_role
                                            "
                                            type="text"
                                            placeholder="Illustratrice, Rigger..."
                                        >

                                    </div>

                                </div>


                                <div
                                    class="admin-field"
                                >

                                    <label>
                                        URL de l'image *
                                    </label>

                                    <input
                                        v-model="
                                            form.image_url
                                        "
                                        type="text"
                                        required
                                        placeholder="/images/credits/art.png"
                                    >

                                </div>


                                <div
                                    class="admin-form__row"
                                >

                                    <div
                                        class="admin-field"
                                    >

                                        <label>
                                            Type
                                        </label>

                                        <select
                                            v-model="
                                                form.media_type
                                            "
                                        >
                                            <option value="image">
                                                Image
                                            </option>

                                            <option value="gif">
                                                GIF
                                            </option>

                                            <option value="video">
                                                Vidéo
                                            </option>
                                        </select>

                                    </div>


                                    <div
                                        class="admin-field"
                                    >

                                        <label>
                                            Ordre
                                        </label>

                                        <input
                                            v-model.number="
                                                form.sort_order
                                            "
                                            type="number"
                                            min="0"
                                        >

                                    </div>

                                </div>

                            </div>

                        </div>


                        <!-- =================================
                             ALT
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label>
                                Texte alternatif
                            </label>

                            <input
                                v-model="
                                    form.image_alt
                                "
                                type="text"
                                placeholder="Description de l'image pour l'accessibilité"
                            >

                        </div>


                        <!-- =================================
                             DESCRIPTION
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label>
                                Description
                            </label>

                            <textarea
                                v-model="
                                    form.description
                                "
                                rows="4"
                                placeholder="Description de la création..."
                            ></textarea>

                        </div>


                        <!-- =================================
                             TAGS
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label>
                                Tags
                            </label>

                            <input
                                v-model="
                                    form.tags
                                "
                                type="text"
                                placeholder="VTuber, Couaxia, Chibi..."
                            >

                        </div>


                        <!-- =================================
                             ARTIST LINK
                        ================================== -->

                        <div
                            class="admin-form__row"
                        >

                            <div
                                class="admin-field"
                            >

                                <label>
                                    Lien artiste
                                </label>

                                <input
                                    v-model="
                                        form.artist_url
                                    "
                                    type="url"
                                    placeholder="https://..."
                                >

                            </div>


                            <div
                                class="admin-field"
                            >

                                <label>
                                    Texte du bouton
                                </label>

                                <input
                                    v-model="
                                        form.button_text
                                    "
                                    type="text"
                                    placeholder="Voir son profil"
                                >

                            </div>

                        </div>


                        <!-- =================================
                             IMAGE MESSAGE
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label>
                                Message de l'image
                            </label>

                            <input
                                v-model="
                                    form.image_message
                                "
                                type="text"
                                placeholder="Message optionnel..."
                            >

                        </div>


                        <!-- =================================
                             BUTTON MESSAGE
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label>
                                Message du bouton
                            </label>

                            <input
                                v-model="
                                    form.button_message
                                "
                                type="text"
                                placeholder="Message optionnel..."
                            >

                        </div>


                        <!-- =================================
                             SETTINGS
                        ================================== -->

                        <div
                            class="
                                admin-form-settings
                            "
                        >

                            <label
                                class="
                                    admin-switch-row
                                "
                            >

                                <div>

                                    <strong>
                                        👁 Visible
                                    </strong>

                                    <span>
                                        Afficher cet art
                                        sur le site.
                                    </span>

                                </div>


                                <input
                                    v-model="
                                        form.visible
                                    "
                                    type="checkbox"
                                >

                            </label>


                            <label
                                class="
                                    admin-switch-row
                                "
                            >

                                <div>

                                    <strong>
                                        💜 Favoris
                                    </strong>

                                    <span>
                                        Autoriser les favoris.
                                    </span>

                                </div>


                                <input
                                    v-model="
                                        form.favorite_enabled
                                    "
                                    type="checkbox"
                                >

                            </label>


                            <label
                                class="
                                    admin-switch-row
                                "
                            >

                                <div>

                                    <strong>
                                        🔞 Contenu sensible
                                    </strong>

                                    <span>
                                        Afficher un avertissement.
                                    </span>

                                </div>


                                <input
                                    v-model="
                                        form.sensitive
                                    "
                                    type="checkbox"
                                >

                            </label>

                        </div>


                        <!-- =================================
                             ACTIONS
                        ================================== -->

                        <footer
                            class="
                                admin-form__actions
                            "
                        >

                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--secondary
                                "
                                :disabled="saving"
                                @click="
                                    closeForm
                                "
                            >
                                Annuler
                            </button>


                            <button
                                type="submit"
                                class="
                                    admin-button
                                    admin-button--primary
                                "
                                :disabled="
                                    !canSave
                                "
                            >

                                {{
                                    saving
                                        ? "Enregistrement..."
                                        : editing
                                            ? "Enregistrer"
                                            : "Ajouter l'art"
                                }}

                            </button>

                        </footer>

                    </form>

                </div>

            </div>

        </Teleport>

    </section>

</template>