<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import CreditsCard, {
    type CreditArtwork
} from "./Cards.vue";

import CreditsLightbox
    from "./Lightbox.vue";

import {
    getCredits,
    type CreditRow
} from "../../services/credits.service";

import {
    supabase
} from "../../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

type CreditsFilterValue =
    | "couaxia"
    | "forme-2"
    | "forme-3"
    | "compagnons"
    | "stream"
    | "collab"
    | "couple"
    | "fanart"
    | "favorites";


interface GalleryArtwork
    extends CreditArtwork {

    tags:
        string[];

    favoriteEnabled:
        boolean;

}


/* =========================================================
   STATE
========================================================= */

const artworks =
    ref<GalleryArtwork[]>(
        []
    );


const openedArtwork =
    ref<GalleryArtwork | null>(
        null
    );


const loading =
    ref(true);


const errorMessage =
    ref<string | null>(
        null
    );


const selectedFilter =
    ref<CreditsFilterValue>(
        "couaxia"
    );


const highlightedArtworkId =
    ref<string | number | null>(
        null
    );


/* =========================================================
   AUTH / LIKES
========================================================= */

const currentUserId =
    ref<string | null>(
        null
    );


const togglingLikeIds =
    ref<Set<string>>(
        new Set()
    );


let authSubscription:
    {
        unsubscribe:
            () => void;
    }
    |
    null =
        null;


/* =========================================================
   NORMALIZE
========================================================= */

function normalizeValue(
    value:
        string | null | undefined
):
    string {

    return (
        value
            ?.trim()
            .toLowerCase()
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /_/g,
                "-"
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )

        ??
        ""
    );

}


/* =========================================================
   NORMALIZE TAGS
========================================================= */

function normalizeTags(
    tags:
        string[] | null | undefined
):
    string[] {

    return (
        tags
        ??
        []
    )
        .map(
            tag =>
                normalizeValue(
                    tag
                )
        )
        .filter(
            Boolean
        );

}


/* =========================================================
   HAS TAG
========================================================= */

function hasTag(
    artwork:
        GalleryArtwork,

    ...wantedTags:
        string[]
):
    boolean {

    return wantedTags.some(
        wantedTag =>

            artwork.tags.includes(
                normalizeValue(
                    wantedTag
                )
            )
    );

}


/* =========================================================
   CATEGORY FROM TAGS
========================================================= */

function getCategoryFromTags(
    tags:
        string[] | null
):
    {
        category:
            string;

        subcategory:
            string | null;
    } {

    const normalizedTags =
        normalizeTags(
            tags
        );


    if (
        normalizedTags.includes(
            "forme-2"
        )
        ||
        normalizedTags.includes(
            "forme2"
        )
    ) {

        return {
            category:
                "forme-2",

            subcategory:
                "Forme 2"
        };

    }


    if (
        normalizedTags.includes(
            "forme-3"
        )
        ||
        normalizedTags.includes(
            "forme3"
        )
    ) {

        return {
            category:
                "forme-3",

            subcategory:
                "Forme 3"
        };

    }


    if (
        normalizedTags.includes(
            "compagnons"
        )
        ||
        normalizedTags.includes(
            "compagnon"
        )
    ) {

        return {
            category:
                "compagnons",

            subcategory:
                null
        };

    }


    if (
        normalizedTags.includes(
            "stream"
        )
    ) {

        return {
            category:
                "stream",

            subcategory:
                null
        };

    }


    if (
        normalizedTags.includes(
            "collab"
        )
        ||
        normalizedTags.includes(
            "collabs"
        )
    ) {

        return {
            category:
                "collab",

            subcategory:
                null
        };

    }


    if (
        normalizedTags.includes(
            "couple"
        )
        ||
        normalizedTags.includes(
            "couples"
        )
    ) {

        return {
            category:
                "couple",

            subcategory:
                null
        };

    }


    if (
        normalizedTags.includes(
            "fanart"
        )
        ||
        normalizedTags.includes(
            "fan-art"
        )
        ||
        normalizedTags.includes(
            "fan-arts"
        )
    ) {

        return {
            category:
                "fanart",

            subcategory:
                null
        };

    }


    return {
        category:
            "couaxia",

        subcategory:
            null
    };

}


/* =========================================================
   MAP SUPABASE → ARTWORK
========================================================= */

function mapCreditToArtwork(
    credit:
        CreditRow
):
    GalleryArtwork {

    const tags =
        normalizeTags(
            credit.tags
        );


    const {
        category,
        subcategory
    } =
        getCategoryFromTags(
            credit.tags
        );


    return {

        id:
            credit.id,

        title:
            credit.art_id
            ||
            "Illustration",

        imageUrl:
            credit.image_url,

        artistName:
            credit.artist
            ||
            "Artiste inconnu",

        artistHandle:
            null,

        artistUrl:
            credit.artist_url,

        artistRole:
            credit.artist_role,

        category,

        subcategory,

        description:
            credit.description,

        likes:
            0,

        liked:
            false,

        createdAt:
            credit.created_at,

        sensitive:
            Boolean(
                credit.sensitive
            ),

        mediaType:
            credit.media_type
            ||
            "image",

        imageMessages:
            credit.image_messages
            ??
            [],

        buttonText:
            credit.button_text
            ||
            "Voir son profil artiste",

        buttonMessages:
            credit.button_messages
            ??
            [],

        tags,

        favoriteEnabled:
            Boolean(
                credit.favorite_enabled
            )

    };

}


/* =========================================================
   COUAXIA ARTWORKS
========================================================= */

function isCouaxiaArtwork(
    artwork:
        GalleryArtwork
):
    boolean {

    if (
        hasTag(
            artwork,
            "couaxia",
            "forme-2",
            "forme2",
            "forme-3",
            "forme3"
        )
    ) {

        return true;

    }


    return (
        artwork.category ===
            "couaxia"

        ||

        artwork.category ===
            "forme-2"

        ||

        artwork.category ===
            "forme-3"
    );

}


/* =========================================================
   FILTERED ARTWORKS
========================================================= */

const filteredArtworks =
    computed<GalleryArtwork[]>(
        () => {

            if (
                selectedFilter.value ===
                "couaxia"
            ) {

                return artworks.value.filter(
                    artwork =>
                        isCouaxiaArtwork(
                            artwork
                        )
                );

            }


            if (
                selectedFilter.value ===
                "favorites"
            ) {

                return artworks.value.filter(
                    artwork =>

                        artwork.favoriteEnabled

                        &&

                        artwork.liked
                );

            }


            if (
                selectedFilter.value ===
                "forme-2"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "forme-2",
                            "forme2"
                        )

                        ||

                        artwork.category ===
                            "forme-2"
                );

            }


            if (
                selectedFilter.value ===
                "forme-3"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "forme-3",
                            "forme3"
                        )

                        ||

                        artwork.category ===
                            "forme-3"
                );

            }


            if (
                selectedFilter.value ===
                "compagnons"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "compagnons",
                            "compagnon"
                        )

                        ||

                        artwork.category ===
                            "compagnons"
                );

            }


            if (
                selectedFilter.value ===
                "stream"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "stream"
                        )

                        ||

                        artwork.category ===
                            "stream"
                );

            }


            if (
                selectedFilter.value ===
                "collab"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "collab",
                            "collabs"
                        )

                        ||

                        artwork.category ===
                            "collab"
                );

            }


            if (
                selectedFilter.value ===
                "couple"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "couple",
                            "couples"
                        )

                        ||

                        artwork.category ===
                            "couple"
                );

            }


            if (
                selectedFilter.value ===
                "fanart"
            ) {

                return artworks.value.filter(
                    artwork =>

                        hasTag(
                            artwork,
                            "fanart",
                            "fan-art",
                            "fan-arts"
                        )

                        ||

                        artwork.category ===
                            "fanart"
                );

            }


            return [];

        }
    );


/* =========================================================
   COUNT
========================================================= */

const resultCount =
    computed(
        () =>
            filteredArtworks.value.length
    );


/* =========================================================
   MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
    message:
        string
) {

    if (
        !message.trim()
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
   CURRENT USER
========================================================= */

async function loadCurrentUser():
    Promise<void> {

    const {
        data,
        error
    } =
        await supabase
            .auth
            .getUser();


    if (
        error
    ) {

        currentUserId.value =
            null;


        return;

    }


    currentUserId.value =
        data.user?.id
        ??
        null;

}


/* =========================================================
   LOAD LIKES
========================================================= */

async function loadArtworkLikes():
    Promise<void> {

    /*
     * On remet toujours les compteurs à zéro avant
     * de recharger les données Supabase.
     */

    artworks.value.forEach(
        artwork => {

            artwork.likes =
                0;


            artwork.liked =
                false;

        }
    );


    if (
        artworks.value.length ===
        0
    ) {

        return;

    }


    const artworkIds =
        artworks.value.map(
            artwork =>
                String(
                    artwork.id
                )
        );


    const {
        data,
        error
    } =
        await supabase
            .from(
                "artwork_likes"
            )
            .select(
                "artwork_id,user_id"
            )
            .in(
                "artwork_id",
                artworkIds
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération likes artworks :",
            error
        );


        /*
         * Si la table existe mais que SELECT est refusé,
         * on ne casse pas toute la galerie.
         */

        return;

    }


    const rows =
        data
        ??
        [];


    const counts =
        new Map<
            string,
            number
        >();


    const likedByCurrentUser =
        new Set<string>();


    rows.forEach(
        row => {

            const artworkId =
                String(
                    row.artwork_id
                );


            counts.set(
                artworkId,
                (
                    counts.get(
                        artworkId
                    )
                    ??
                    0
                )
                +
                1
            );


            if (
                currentUserId.value
                &&
                row.user_id ===
                currentUserId.value
            ) {

                likedByCurrentUser.add(
                    artworkId
                );

            }

        }
    );


    artworks.value.forEach(
        artwork => {

            const artworkId =
                String(
                    artwork.id
                );


            artwork.likes =
                counts.get(
                    artworkId
                )
                ??
                0;


            artwork.liked =
                likedByCurrentUser.has(
                    artworkId
                );

        }
    );

}


/* =========================================================
   AUTH CHANGES
========================================================= */

function subscribeToAuth() {

    const {
        data
    } =
        supabase
            .auth
            .onAuthStateChange(
                async (
                    _event,
                    session
                ) => {

                    currentUserId.value =
                        session?.user?.id
                        ??
                        null;


                    await loadArtworkLikes();

                }
            );


    authSubscription =
        data.subscription;

}


/* =========================================================
   LOAD ARTWORKS
========================================================= */

async function loadArtworks():
    Promise<void> {

    loading.value =
        true;


    errorMessage.value =
        null;


    try {

        const credits =
            await getCredits();


        artworks.value =
            credits
                .map(
                    mapCreditToArtwork
                )
                .filter(
                    artwork =>
                        Boolean(
                            artwork.imageUrl
                        )
                );


        await loadCurrentUser();


        await loadArtworkLikes();


        /*
         * Les médias eux-mêmes sont chargés paresseusement
         * dans Cards.vue afin de limiter le trafic Storage.
         */

    }

    catch (
        error:
            unknown
    ) {

        console.error(
            "Erreur crédits :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   FILTER EVENT
========================================================= */

function handleFilterEvent(
    event:
        Event
) {

    const customEvent =
        event as CustomEvent<{
            filter:
                CreditsFilterValue;
        }>;


    const filter =
        customEvent.detail?.filter;


    if (
        !filter
    ) {

        return;

    }


    selectedFilter.value =
        filter;


    highlightedArtworkId.value =
        null;


    openedArtwork.value =
        null;

}


/* =========================================================
   LIKE
========================================================= */

async function toggleLike(
    selectedArtwork:
        CreditArtwork
):
    Promise<void> {

    const artwork =
        artworks.value.find(
            item =>
                item.id ===
                selectedArtwork.id
        );


    if (
        !artwork
    ) {

        return;

    }


    if (
        !artwork.favoriteEnabled
    ) {

        return;

    }


    if (
        !currentUserId.value
    ) {

        sendMascotMessage(
            "Connecte-toi pour garder tes arts favoris ! 💜"
        );


        return;

    }


    const artworkId =
        String(
            artwork.id
        );


    if (
        togglingLikeIds.value.has(
            artworkId
        )
    ) {

        return;

    }


    togglingLikeIds.value =
        new Set([
            ...togglingLikeIds.value,
            artworkId
        ]);


    const wasLiked =
        artwork.liked;


    const previousLikes =
        artwork.likes;


    /*
     * Mise à jour immédiate de l'interface.
     */

    artwork.liked =
        !wasLiked;


    artwork.likes =
        Math.max(
            0,
            previousLikes
            +
            (
                wasLiked
                    ? -1
                    : 1
            )
        );


    try {

        if (
            wasLiked
        ) {

            const {
                error
            } =
                await supabase
                    .from(
                        "artwork_likes"
                    )
                    .delete()
                    .eq(
                        "user_id",
                        currentUserId.value
                    )
                    .eq(
                        "artwork_id",
                        artworkId
                    );


            if (
                error
            ) {

                throw error;

            }

        }

        else {

            const {
                error
            } =
                await supabase
                    .from(
                        "artwork_likes"
                    )
                    .upsert(
                        {
                            user_id:
                                currentUserId.value,

                            artwork_id:
                                artworkId
                        },
                        {
                            onConflict:
                                "user_id,artwork_id",

                            ignoreDuplicates:
                                true
                        }
                    );


            if (
                error
            ) {

                throw error;

            }

        }


        /*
         * On recharge depuis Supabase après l'écriture.
         * Ainsi le compteur et l'état du cœur reflètent
         * exactement les données réellement enregistrées.
         */

        await loadArtworkLikes();

    }

    catch (
        error
    ) {

        console.error(
            "Erreur sauvegarde like artwork :",
            error
        );


        /*
         * Rollback visuel si Supabase refuse l'opération.
         */

        artwork.liked =
            wasLiked;


        artwork.likes =
            previousLikes;


        sendMascotMessage(
            "Oups, je n'ai pas réussi à enregistrer ce favori. 🥺"
        );

    }

    finally {

        const nextIds =
            new Set(
                togglingLikeIds.value
            );


        nextIds.delete(
            artworkId
        );


        togglingLikeIds.value =
            nextIds;

    }

}


/* =========================================================
   OPEN ARTWORK
========================================================= */


function openArtwork(
    artwork:
        CreditArtwork
) {

    const galleryArtwork =
        artworks.value.find(
            item =>
                item.id ===
                artwork.id
        );


    if (
        !galleryArtwork
    ) {

        return;

    }


    openedArtwork.value =
        galleryArtwork;

}


/* =========================================================
   CLOSE ARTWORK
========================================================= */

function closeArtwork() {

    openedArtwork.value =
        null;

}


/* =========================================================
   PREVIOUS ARTWORK
========================================================= */

function previousArtwork() {

    if (
        !openedArtwork.value
        ||
        filteredArtworks.value.length ===
            0
    ) {

        return;

    }


    const index =
        filteredArtworks.value.findIndex(
            artwork =>
                artwork.id ===
                openedArtwork.value?.id
        );


    if (
        index ===
        -1
    ) {

        openedArtwork.value =
            filteredArtworks.value[
                0
            ];


        return;

    }


    const previousIndex =
        index ===
        0

            ? filteredArtworks.value.length -
                1

            : index -
                1;


    openedArtwork.value =
        filteredArtworks.value[
            previousIndex
        ];

}


/* =========================================================
   NEXT ARTWORK
========================================================= */

function nextArtwork() {

    if (
        !openedArtwork.value
        ||
        filteredArtworks.value.length ===
            0
    ) {

        return;

    }


    const index =
        filteredArtworks.value.findIndex(
            artwork =>
                artwork.id ===
                openedArtwork.value?.id
        );


    if (
        index ===
        -1
    ) {

        openedArtwork.value =
            filteredArtworks.value[
                0
            ];


        return;

    }


    const nextIndex =
        index ===
        filteredArtworks.value.length -
            1

            ? 0

            : index +
                1;


    openedArtwork.value =
        filteredArtworks.value[
            nextIndex
        ];

}


/* =========================================================
   RANDOM ARTWORK
========================================================= */

function chooseRandomArtwork() {

    const availableArtworks =
        filteredArtworks.value;


    if (
        availableArtworks.length ===
        0
    ) {

        window.dispatchEvent(
            new CustomEvent(
                "couaxia-mascot-message",
                {
                    detail: {
                        message:
                            "Je n'ai aucune œuvre à choisir dans cette catégorie ! 🐙"
                    }
                }
            )
        );


        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            availableArtworks.length
        );


    const artwork =
        availableArtworks[
            randomIndex
        ];


    highlightedArtworkId.value =
        artwork.id;


    requestAnimationFrame(
        () => {

            const element =
                document.querySelector(
                    `[data-artwork-id="${artwork.id}"]`
                );


            element?.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }
    );


    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message:
                        `Le hasard a choisi « ${artwork.title} » ! 🎲💜`
                }
            }
        )
    );

}


/* =========================================================
   RANDOM EVENT
========================================================= */

function handleRandomEvent() {

    chooseRandomArtwork();

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        window.addEventListener(
            "couaxia-credits-filter",
            handleFilterEvent
        );


        window.addEventListener(
            "couaxia-credits-random",
            handleRandomEvent
        );


        void loadArtworks();


        subscribeToAuth();

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        window.removeEventListener(
            "couaxia-credits-filter",
            handleFilterEvent
        );


        window.removeEventListener(
            "couaxia-credits-random",
            handleRandomEvent
        );


        authSubscription
            ?.unsubscribe();


        authSubscription =
            null;

    }
);

</script>


<template>

    <section
        class="credits-gallery"
        aria-labelledby="credits-gallery-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="credits-gallery__header">

            <div>

                <p class="credits-gallery__eyebrow">
                    ✨ GALERIE
                </p>


                <h2
                    id="credits-gallery-title"
                    class="credits-gallery__title"
                >
                    Les créations
                </h2>

            </div>


            <p
                class="credits-gallery__count"
                aria-live="polite"
            >

                <template
                    v-if="
                        resultCount === 0
                    "
                >
                    Aucune œuvre
                </template>


                <template
                    v-else-if="
                        resultCount === 1
                    "
                >
                    1 œuvre
                </template>


                <template
                    v-else
                >
                    {{ resultCount }} œuvres
                </template>

            </p>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="loading"
            class="credits-gallery__loading"
            role="status"
        >

            <span aria-hidden="true">
                🐙
            </span>


            <p>
                Chargement des illustrations...
            </p>

        </div>


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="errorMessage"
            class="credits-gallery__error"
            role="alert"
        >

            <span aria-hidden="true">
                ⚠️
            </span>


            <div>

                <strong>
                    Impossible de charger les illustrations.
                </strong>


                <p>
                    {{ errorMessage }}
                </p>

            </div>


            <button
                type="button"
                class="credits-gallery__retry"
                @click="loadArtworks"
            >
                🔄 Réessayer
            </button>

        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
            v-else-if="
                filteredArtworks.length === 0
            "
            class="credits-gallery__empty"
        >

            <span aria-hidden="true">
                🐙
            </span>


            <h3>
                Rien par ici !
            </h3>


            <p>
                Aucune œuvre ne correspond
                à cette catégorie pour le moment.
            </p>

        </div>


        <!-- =================================================
             GRID
        ================================================== -->

        <div
            v-else
            class="credits-gallery__grid"
        >

            <div
                v-for="
                    artwork in filteredArtworks
                "
                :key="
                    artwork.id
                "

                class="credits-gallery__item"

                :class="{
                    'credits-gallery__item--highlighted':
                        highlightedArtworkId ===
                        artwork.id
                }"

                :data-artwork-id="
                    artwork.id
                "
            >

                <CreditsCard
                    :artwork="artwork"

                    :random-selected="
                        highlightedArtworkId ===
                        artwork.id
                    "

                    @toggle-like="toggleLike"
                    @open="openArtwork"
                />

            </div>

        </div>

    </section>


    <!-- =====================================================
         LIGHTBOX
    ====================================================== -->

    <CreditsLightbox
        v-if="openedArtwork"
        :artwork="openedArtwork"
        :artworks="filteredArtworks"
        @close="closeArtwork"
        @previous="previousArtwork"
        @next="nextArtwork"
        @toggle-like="toggleLike"
    />

</template>