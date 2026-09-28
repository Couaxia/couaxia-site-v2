<script setup lang="ts">

/* =========================================================
   VUE
========================================================= */

import {
    computed,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

import type {
    Card,
    CardRarityConfig
} from "../../types/card.types";


/* =========================================================
   PROPS
========================================================= */

interface Props {

    card:
        Card;

    rarityConfig?:
        CardRarityConfig | null;

    owned?:
        boolean;

    quantity?:
        number;

    locked?:
        boolean;

    interactive?:
        boolean;

}


const props =
    withDefaults(
        defineProps<Props>(),
        {

            rarityConfig:
                null,

            owned:
                false,

            quantity:
                0,

            locked:
                false,

            interactive:
                true

        }
    );


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{

        (
            event: "select",
            card: Card
        ): void;

    }>();


/* =========================================================
   CARD ELEMENT
========================================================= */

const cardElement =
    ref<HTMLElement | null>(
        null
    );


/* =========================================================
   HOVER STATE
========================================================= */

const isHovering =
    ref(false);


/* =========================================================
   TRANSFORM
========================================================= */

const rotateX =
    ref(0);


const rotateY =
    ref(0);


/* =========================================================
   SHINE POSITION
========================================================= */

const shineX =
    ref(50);


const shineY =
    ref(50);


/* =========================================================
   CARD NUMBER
========================================================= */

const formattedNumber =
    computed(
        () =>
            `#${String(
                props.card.number
            ).padStart(
                3,
                "0"
            )}`
    );


/* =========================================================
   RARITY NAME
========================================================= */

const rarityName =
    computed(
        () => {

            if (
                props.rarityConfig
            ) {

                return props
                    .rarityConfig
                    .name;

            }


            const names =
                {

                    common:
                        "Commune",

                    uncommon:
                        "Peu commune",

                    rare:
                        "Rare",

                    epic:
                        "Épique",

                    legendary:
                        "Légendaire",

                    mythic:
                        "Mythique"

                };


            return names[
                props.card.rarity
            ];

        }
    );


/* =========================================================
   RARITY COLOR
========================================================= */

const rarityColor =
    computed(
        () =>
            props
                .rarityConfig
                ?.color
            ??
            getDefaultRarityColor(
                props.card.rarity
            )
    );


/* =========================================================
   SECONDARY COLOR
========================================================= */

const raritySecondaryColor =
    computed(
        () =>
            props
                .rarityConfig
                ?.secondaryColor
            ??
            getDefaultSecondaryColor(
                props.card.rarity
            )
    );


/* =========================================================
   CARD CSS VARIABLES
========================================================= */

const cardStyle =
    computed(
        () => ({

            "--card-rarity":
                rarityColor.value,

            "--card-rarity-secondary":
                raritySecondaryColor.value,

            "--card-rotate-x":
                `${rotateX.value}deg`,

            "--card-rotate-y":
                `${rotateY.value}deg`,

            "--card-shine-x":
                `${shineX.value}%`,

            "--card-shine-y":
                `${shineY.value}%`

        })
    );


/* =========================================================
   DEFAULT RARITY COLOR
========================================================= */

function getDefaultRarityColor(
    rarity: Card["rarity"]
) {

    switch (
        rarity
    ) {

        case "common":

            return "#b8b8b8";


        case "uncommon":

            return "#55d68b";


        case "rare":

            return "#3fa9f5";


        case "epic":

            return "#a855f7";


        case "legendary":

            return "#f6b73c";


        case "mythic":

            return "#f22292";


        default:

            return "#ffffff";

    }

}


/* =========================================================
   DEFAULT SECONDARY COLOR
========================================================= */

function getDefaultSecondaryColor(
    rarity: Card["rarity"]
) {

    switch (
        rarity
    ) {

        case "common":

            return "#ffffff";


        case "uncommon":

            return "#b7ffd3";


        case "rare":

            return "#22f2ef";


        case "epic":

            return "#d8a4ff";


        case "legendary":

            return "#ffe49a";


        case "mythic":

            return "#22f2ef";


        default:

            return "#ffffff";

    }

}


/* =========================================================
   POINTER MOVE

   Donne le petit effet 3D.

   La carte s'incline selon la position
   du curseur à l'intérieur.
========================================================= */

function handlePointerMove(
    event: PointerEvent
) {

    if (
        !props.interactive
        ||
        props.locked
        ||
        !cardElement.value
    ) {

        return;

    }


    const rect =
        cardElement.value
            .getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const y =
        event.clientY -
        rect.top;


    const percentX =
        x /
        rect.width;


    const percentY =
        y /
        rect.height;


    /*
        Inclinaison maximale volontairement
        légère pour ne pas rendre la carte pénible
        à regarder.
    */

    rotateY.value =
        (
            percentX -
            0.5
        )
        *
        12;


    rotateX.value =
        (
            0.5 -
            percentY
        )
        *
        12;


    shineX.value =
        percentX *
        100;


    shineY.value =
        percentY *
        100;

}


/* =========================================================
   POINTER ENTER
========================================================= */

function handlePointerEnter() {

    if (
        !props.interactive
    ) {

        return;

    }


    isHovering.value =
        true;

}


/* =========================================================
   POINTER LEAVE
========================================================= */

function handlePointerLeave() {

    isHovering.value =
        false;


    rotateX.value =
        0;


    rotateY.value =
        0;


    shineX.value =
        50;


    shineY.value =
        50;

}


/* =========================================================
   SELECT CARD
========================================================= */

function selectCard() {

    if (
        !props.interactive
        ||
        props.locked
    ) {

        return;

    }


    emit(
        "select",
        props.card
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(
    event: KeyboardEvent
) {

    if (
        event.key !==
        "Enter"
        &&
        event.key !==
        " "
    ) {

        return;

    }


    event.preventDefault();


    selectCard();

}

</script>


<template>

    <article
        ref="cardElement"

        class="card-item"

        :class="[
            `card-item--${card.rarity}`,

            {
                'card-item--owned':
                    owned,

                'card-item--locked':
                    locked,

                'card-item--interactive':
                    interactive,

                'card-item--hovering':
                    isHovering
            }
        ]"

        :style="cardStyle"

        :tabindex="
            interactive && !locked
                ? 0
                : -1
        "

        :role="
            interactive && !locked
                ? 'button'
                : undefined
        "

        :aria-label="
            locked
                ? 'Carte non obtenue'
                : `${card.name}, ${rarityName}`
        "

        @pointermove="handlePointerMove"
        @pointerenter="handlePointerEnter"
        @pointerleave="handlePointerLeave"
        @click="selectCard"
        @keydown="handleKeydown"
    >

        <!-- =================================================
             3D CONTAINER
        ================================================== -->

        <div
            class="card-item__transform"
        >

            <!-- =============================================
                 GLOW
            ============================================== -->

            <div
                class="card-item__glow"
            ></div>


            <!-- =============================================
                 CARD
            ============================================== -->

            <div
                class="card-item__body"
            >

                <!-- =========================================
                     BACKGROUND DECORATION
                ========================================== -->

                <div
                    class="card-item__background"
                >

                    <span
                        class="
                            card-item__star
                            card-item__star--1
                        "
                    >
                        ✦
                    </span>

                    <span
                        class="
                            card-item__star
                            card-item__star--2
                        "
                    >
                        ✦
                    </span>

                    <span
                        class="
                            card-item__star
                            card-item__star--3
                        "
                    >
                        ✧
                    </span>

                </div>


                <!-- =========================================
                     TOP
                ========================================== -->

                <header
                    class="card-item__header"
                >

                    <span
                        class="card-item__number"
                    >
                        {{ formattedNumber }}
                    </span>


                    <span
                        class="card-item__rarity"
                    >
                        {{ rarityName }}
                    </span>

                </header>


                <!-- =========================================
                     ARTWORK
                ========================================== -->

                <div
                    class="card-item__artwork"
                >

                    <!-- NORMAL IMAGE -->

                    <img
                        v-if="
                            !locked &&
                            card.imageUrl
                        "

                        class="card-item__image"

                        :src="card.imageUrl"

                        :alt="card.name"

                        draggable="false"
                    >


                    <!-- LOCKED -->

                    <div
                        v-else
                        class="card-item__locked-art"
                    >

                        <div
                            class="card-item__locked-symbol"
                        >
                            ?
                        </div>


                        <span>
                            Non obtenue
                        </span>

                    </div>


                    <!-- ARTWORK INNER BORDER -->

                    <div
                        class="card-item__artwork-border"
                    ></div>

                </div>


                <!-- =========================================
                     INFORMATION
                ========================================== -->

                <div
                    class="card-item__content"
                >

                    <h3
                        class="card-item__name"
                    >
                        {{
                            locked
                                ? "???"
                                : card.name
                        }}
                    </h3>


                    <p
                        v-if="
                            card.description &&
                            !locked
                        "

                        class="card-item__description"
                    >
                        {{ card.description }}
                    </p>


                    <p
                        v-else-if="locked"

                        class="card-item__description"
                    >
                        Cette carte n'a pas encore
                        rejoint ta collection.
                    </p>

                </div>


                <!-- =========================================
                     FOOTER
                ========================================== -->

                <footer
                    class="card-item__footer"
                >

                    <span
                        class="card-item__category"
                    >
                        {{ card.category }}
                    </span>


                    <!-- QUANTITY -->

                    <span
                        v-if="
                            owned &&
                            quantity > 1
                        "

                        class="card-item__quantity"
                    >
                        ×{{ quantity }}
                    </span>

                </footer>


                <!-- =========================================
                     HOLOGRAPHIC SHINE
                ========================================== -->

                <div
                    class="card-item__shine"
                ></div>


                <!-- =========================================
                     MYTHIC EFFECT
                ========================================== -->

                <div
                    v-if="
                        card.rarity ===
                        'mythic'
                    "

                    class="card-item__mythic"
                ></div>

            </div>

        </div>


        <!-- =================================================
             OWNED BADGE
        ================================================== -->

        <div
            v-if="owned"

            class="card-item__owned-badge"

            title="Carte obtenue"
        >
            ✓
        </div>

    </article>

</template>


<style scoped>

/* =========================================================
   CARD
========================================================= */

.card-item {
    --card-rarity:
        #ffffff;

    --card-rarity-secondary:
        #ffffff;

    --card-rotate-x:
        0deg;

    --card-rotate-y:
        0deg;

    --card-shine-x:
        50%;

    --card-shine-y:
        50%;


    position:
        relative;

    width:
        100%;

    max-width:
        290px;

    aspect-ratio:
        0.69;

    perspective:
        1000px;

    outline:
        none;

    user-select:
        none;

    -webkit-user-select:
        none;
}


/* =========================================================
   INTERACTIVE
========================================================= */

.card-item--interactive {
    cursor:
        pointer;
}


/* =========================================================
   TRANSFORM
========================================================= */

.card-item__transform {
    position:
        relative;

    width:
        100%;

    height:
        100%;

    transform-style:
        preserve-3d;

    transform:
        rotateX(
            var(
                --card-rotate-x
            )
        )
        rotateY(
            var(
                --card-rotate-y
            )
        );

    transition:
        transform
        0.18s
        cubic-bezier(
            0.2,
            0.8,
            0.2,
            1
        );

    will-change:
        transform;
}


/* =========================================================
   BODY
========================================================= */

.card-item__body {
    position:
        relative;

    width:
        100%;

    height:
        100%;

    display:
        flex;

    flex-direction:
        column;

    overflow:
        hidden;

    border:
        2px solid
        var(
            --card-rarity
        );

    border-radius:
        24px;

    background:
        linear-gradient(
            155deg,
            rgba(
                37,
                12,
                57,
                0.98
            ),
            rgba(
                15,
                5,
                28,
                0.99
            )
        );

    box-shadow:
        0 16px 36px
        rgba(
            0,
            0,
            0,
            0.35
        ),

        inset
        0 0 28px
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            12%,
            transparent
        );

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}


/* =========================================================
   GLOW
========================================================= */

.card-item__glow {
    position:
        absolute;

    inset:
        8%;

    border-radius:
        30px;

    background:
        var(
            --card-rarity
        );

    opacity:
        0.22;

    filter:
        blur(
            28px
        );

    transform:
        translateZ(
            -20px
        );

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}


.card-item--hovering
.card-item__glow {
    opacity:
        0.48;

    transform:
        translateZ(
            -20px
        )
        scale(
            1.06
        );
}


/* =========================================================
   BACKGROUND
========================================================= */

.card-item__background {
    position:
        absolute;

    inset:
        0;

    overflow:
        hidden;

    pointer-events:
        none;

    background:
        radial-gradient(
            circle
            at
            50%
            30%,
            color-mix(
                in srgb,
                var(
                    --card-rarity
                )
                17%,
                transparent
            ),
            transparent
            48%
        );
}


/* =========================================================
   STARS
========================================================= */

.card-item__star {
    position:
        absolute;

    color:
        var(
            --card-rarity-secondary
        );

    opacity:
        0.30;

    text-shadow:
        0 0 8px
        var(
            --card-rarity
        );

    pointer-events:
        none;
}


.card-item__star--1 {
    top:
        10%;

    left:
        7%;

    font-size:
        0.8rem;
}


.card-item__star--2 {
    top:
        46%;

    right:
        5%;

    font-size:
        1rem;
}


.card-item__star--3 {
    bottom:
        14%;

    left:
        8%;

    font-size:
        0.7rem;
}


/* =========================================================
   HEADER
========================================================= */

.card-item__header {
    position:
        relative;

    z-index:
        3;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        10px;

    min-height:
        50px;

    padding:
        13px
        16px
        10px;
}


/* =========================================================
   NUMBER
========================================================= */

.card-item__number {
    color:
        rgba(
            255,
            255,
            255,
            0.72
        );

    font-family:
        "Courier New",
        monospace;

    font-size:
        0.72rem;

    font-weight:
        900;

    letter-spacing:
        0.08em;
}


/* =========================================================
   RARITY
========================================================= */

.card-item__rarity {
    max-width:
        55%;

    padding:
        5px
        9px;

    overflow:
        hidden;

    border:
        1px solid
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            65%,
            transparent
        );

    border-radius:
        999px;

    background:
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            13%,
            rgba(
                0,
                0,
                0,
                0.35
            )
        );

    color:
        var(
            --card-rarity-secondary
        );

    font-size:
        0.66rem;

    font-weight:
        900;

    letter-spacing:
        0.06em;

    text-overflow:
        ellipsis;

    text-transform:
        uppercase;

    white-space:
        nowrap;
}


/* =========================================================
   ARTWORK
========================================================= */

.card-item__artwork {
    position:
        relative;

    z-index:
        2;

    width:
        calc(
            100% -
            26px
        );

    aspect-ratio:
        1 / 1.08;

    margin:
        0
        auto;

    overflow:
        hidden;

    border-radius:
        17px;

    background:
        rgba(
            255,
            255,
            255,
            0.035
        );
}


/* =========================================================
   IMAGE
========================================================= */

.card-item__image {
    width:
        100%;

    height:
        100%;

    display:
        block;

    object-fit:
        cover;

    object-position:
        center;

    pointer-events:
        none;

    transition:
        transform
        0.35s
        ease;
}


.card-item--hovering
.card-item__image {
    transform:
        scale(
            1.035
        );
}


/* =========================================================
   ARTWORK BORDER
========================================================= */

.card-item__artwork-border {
    position:
        absolute;

    inset:
        0;

    border:
        1px solid
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            55%,
            rgba(
                255,
                255,
                255,
                0.20
            )
        );

    border-radius:
        inherit;

    box-shadow:
        inset
        0 0 18px
        rgba(
            0,
            0,
            0,
            0.22
        );

    pointer-events:
        none;
}


/* =========================================================
   LOCKED ART
========================================================= */

.card-item__locked-art {
    width:
        100%;

    height:
        100%;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        10px;

    background:
        radial-gradient(
            circle,
            rgba(
                242,
                34,
                146,
                0.10
            ),
            rgba(
                0,
                0,
                0,
                0.45
            )
        );

    color:
        rgba(
            255,
            255,
            255,
            0.55
        );

    font-size:
        0.75rem;

    font-weight:
        800;

    text-transform:
        uppercase;
}


/* =========================================================
   LOCKED SYMBOL
========================================================= */

.card-item__locked-symbol {
    display:
        grid;

    place-items:
        center;

    width:
        58px;

    height:
        58px;

    border:
        2px solid
        rgba(
            255,
            255,
            255,
            0.16
        );

    border-radius:
        50%;

    color:
        rgba(
            255,
            255,
            255,
            0.42
        );

    font-family:
        "Courier New",
        monospace;

    font-size:
        2rem;

    font-weight:
        900;
}


/* =========================================================
   CONTENT
========================================================= */

.card-item__content {
    position:
        relative;

    z-index:
        3;

    flex:
        1;

    padding:
        15px
        17px
        8px;
}


/* =========================================================
   NAME
========================================================= */

.card-item__name {
    margin:
        0;

    color:
        #ffffff;

    font-family:
        "Courier New",
        monospace;

    font-size:
        clamp(
            1rem,
            2vw,
            1.2rem
        );

    font-weight:
        900;

    line-height:
        1.15;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.card-item__description {
    display:
        -webkit-box;

    margin:
        8px
        0
        0;

    overflow:
        hidden;

    color:
        rgba(
            255,
            255,
            255,
            0.63
        );

    font-size:
        0.74rem;

    font-weight:
        600;

    line-height:
        1.45;

    -webkit-box-orient:
        vertical;

    -webkit-line-clamp:
        2;
}


/* =========================================================
   FOOTER
========================================================= */

.card-item__footer {
    position:
        relative;

    z-index:
        3;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    min-height:
        42px;

    padding:
        8px
        17px
        13px;
}


/* =========================================================
   CATEGORY
========================================================= */

.card-item__category {
    color:
        var(
            --card-rarity-secondary
        );

    font-size:
        0.65rem;

    font-weight:
        900;

    letter-spacing:
        0.08em;

    opacity:
        0.78;

    text-transform:
        uppercase;
}


/* =========================================================
   QUANTITY
========================================================= */

.card-item__quantity {
    display:
        grid;

    place-items:
        center;

    min-width:
        30px;

    height:
        25px;

    padding:
        0
        8px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.15
        );

    border-radius:
        999px;

    background:
        rgba(
            255,
            255,
            255,
            0.08
        );

    color:
        #ffffff;

    font-size:
        0.72rem;

    font-weight:
        900;
}


/* =========================================================
   HOLOGRAPHIC SHINE
========================================================= */

.card-item__shine {
    position:
        absolute;

    z-index:
        10;

    inset:
        0;

    border-radius:
        inherit;

    opacity:
        0;

    pointer-events:
        none;

    background:
        radial-gradient(
            circle
            at
            var(
                --card-shine-x
            )
            var(
                --card-shine-y
            ),

            rgba(
                255,
                255,
                255,
                0.34
            )
            0%,

            color-mix(
                in srgb,
                var(
                    --card-rarity-secondary
                )
                18%,
                transparent
            )
            18%,

            transparent
            45%
        );

    mix-blend-mode:
        screen;

    transition:
        opacity
        0.18s
        ease;
}


.card-item--hovering
.card-item__shine {
    opacity:
        1;
}


/* =========================================================
   MYTHIC EFFECT
========================================================= */

.card-item__mythic {
    position:
        absolute;

    z-index:
        8;

    inset:
        -70%;

    pointer-events:
        none;

    opacity:
        0.20;

    background:
        conic-gradient(
            from
            0deg,

            transparent,

            #22f2ef,

            transparent,

            #f22292,

            transparent,

            #ffffff,

            transparent
        );

    animation:
        mythicRotation
        7s
        linear
        infinite;
}


@keyframes mythicRotation {

    to {

        transform:
            rotate(
                360deg
            );

    }

}


/* =========================================================
   OWNED BADGE
========================================================= */

.card-item__owned-badge {
    position:
        absolute;

    z-index:
        30;

    top:
        -8px;

    right:
        -8px;

    display:
        grid;

    place-items:
        center;

    width:
        29px;

    height:
        29px;

    border:
        2px solid
        rgba(
            255,
            255,
            255,
            0.88
        );

    border-radius:
        50%;

    background:
        #22f2ef;

    color:
        #24102f;

    font-size:
        0.8rem;

    font-weight:
        1000;

    box-shadow:
        0 0 14px
        rgba(
            34,
            242,
            239,
            0.55
        );
}


/* =========================================================
   LOCKED CARD
========================================================= */

.card-item--locked
.card-item__body {
    border-color:
        rgba(
            255,
            255,
            255,
            0.12
        );

    filter:
        saturate(
            0.15
        );

    opacity:
        0.67;
}


.card-item--locked
.card-item__glow {
    display:
        none;
}


/* =========================================================
   FOCUS
========================================================= */

.card-item:focus-visible
.card-item__body {
    outline:
        3px solid
        #22f2ef;

    outline-offset:
        5px;
}


/* =========================================================
   HOVER
========================================================= */

.card-item--interactive:hover
.card-item__body {
    box-shadow:
        0 20px 48px
        rgba(
            0,
            0,
            0,
            0.42
        ),

        0 0 24px
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            32%,
            transparent
        ),

        inset
        0 0 30px
        color-mix(
            in srgb,
            var(
                --card-rarity
            )
            15%,
            transparent
        );
}


/* =========================================================
   LEGENDARY
========================================================= */

.card-item--legendary
.card-item__body {
    border-width:
        2px;
}


/* =========================================================
   MYTHIC
========================================================= */

.card-item--mythic
.card-item__body {
    border-color:
        var(
            --card-rarity
        );

    box-shadow:
        0 16px 40px
        rgba(
            0,
            0,
            0,
            0.38
        ),

        0 0 18px
        rgba(
            242,
            34,
            146,
            0.18
        ),

        0 0 25px
        rgba(
            34,
            242,
            239,
            0.10
        );
}


/* =========================================================
   LIGHT MODE
========================================================= */

:global(html[data-theme="light"])
.card-item__body {
    background:
        linear-gradient(
            155deg,
            rgba(
                255,
                255,
                255,
                0.98
            ),
            rgba(
                246,
                237,
                250,
                0.98
            )
        );

    box-shadow:
        0 15px 34px
        rgba(
            76,
            25,
            99,
            0.12
        );
}


:global(html[data-theme="light"])
.card-item__name {
    color:
        #3d1555;
}


:global(html[data-theme="light"])
.card-item__description {
    color:
        #654c70;
}


:global(html[data-theme="light"])
.card-item__number {
    color:
        #765b80;
}


:global(html[data-theme="light"])
.card-item__quantity {
    border-color:
        rgba(
            109,
            0,
            163,
            0.13
        );

    background:
        rgba(
            109,
            0,
            163,
            0.06
        );

    color:
        #3d1555;
}


:global(html[data-theme="light"])
.card-item__locked-art {
    color:
        #765b80;

    background:
        radial-gradient(
            circle,
            rgba(
                242,
                34,
                146,
                0.08
            ),
            rgba(
                109,
                0,
                163,
                0.04
            )
        );
}


:global(html[data-theme="light"])
.card-item__locked-symbol {
    border-color:
        rgba(
            109,
            0,
            163,
            0.18
        );

    color:
        rgba(
            61,
            21,
            85,
            0.45
        );
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (
    max-width:
    700px
) {

    .card-item {
        max-width:
            260px;
    }


    .card-item__header {
        padding:
            11px
            13px
            9px;
    }


    .card-item__artwork {
        width:
            calc(
                100% -
                22px
            );
    }


    .card-item__content {
        padding:
            13px
            14px
            7px;
    }


    .card-item__footer {
        padding:
            7px
            14px
            11px;
    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
    prefers-reduced-motion:
    reduce
) {

    .card-item__transform {
        transform:
            none !important;

        transition:
            none;
    }


    .card-item__image,
    .card-item__shine,
    .card-item__glow {
        transition:
            none;
    }


    .card-item__mythic {
        animation:
            none;
    }

}

</style>