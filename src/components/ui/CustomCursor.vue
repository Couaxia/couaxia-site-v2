<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface Point {
    x: number;
    y: number;
}

interface Sucker {
    x: number;
    y: number;
    radius: number;
    innerRadius: number;
}


/* =========================================================
   CONFIGURATION
========================================================= */

/*
    Nombre de points qui composent la tentacule.
*/
const POINT_COUNT =
    22;


/*
    Distance entre chaque point.
*/
const SEGMENT_DISTANCE =
    7;


/*
    Épaisseur près du curseur.
*/
const BASE_WIDTH =
    17;


/*
    Épaisseur de la pointe.
*/
const TIP_WIDTH =
    2.5;


/*
    Nombre de ventouses.
*/
const SUCKER_COUNT =
    5;


/*
    Rapidité avec laquelle la base
    rejoint la souris.
*/
const HEAD_FOLLOW =
    0.68;


/*
    Souplesse du corps.
*/
const FOLLOW_STRENGTH =
    0.42;


/* =========================================================
   CURSOR POSITION
========================================================= */

const cursor =
    reactive<Point>({
        x: -100,
        y: -100
    });


/* =========================================================
   STATES
========================================================= */

const isVisible =
    ref(false);

const isHovering =
    ref(false);

const isClicking =
    ref(false);

const isText =
    ref(false);


/* =========================================================
   TRAIL POINTS
========================================================= */

const points =
    reactive<Point[]>(
        Array.from(
            {
                length:
                    POINT_COUNT
            },
            () => ({
                x: -100,
                y: -100
            })
        )
    );


/* =========================================================
   INTERNAL
========================================================= */

let initialized =
    false;

let animationFrameId:
    number | null =
    null;


/* =========================================================
   SELECTORS
========================================================= */

const clickableSelectors =
    [
        "a",
        "button",
        "[role='button']",
        "[tabindex='0']",
        "summary",
        "label",
        "select",
        "input[type='button']",
        "input[type='submit']",
        "input[type='checkbox']",
        "input[type='radio']",
        ".clickable"
    ].join(",");


const textSelectors =
    [
        "input[type='text']",
        "input[type='email']",
        "input[type='password']",
        "input[type='search']",
        "input[type='url']",
        "input[type='number']",
        "textarea",
        "[contenteditable='true']"
    ].join(",");


/* =========================================================
   CHECK TARGET
========================================================= */

function checkTarget(
    target: EventTarget | null
) {

    if (
        !(target instanceof Element)
    ) {

        isHovering.value =
            false;

        isText.value =
            false;

        return;

    }


    isHovering.value =
        Boolean(
            target.closest(
                clickableSelectors
            )
        );


    isText.value =
        Boolean(
            target.closest(
                textSelectors
            )
        );

}


/* =========================================================
   INITIALIZE POINTS
========================================================= */

function initializePoints(
    x: number,
    y: number
) {

    for (
        const point of points
    ) {

        point.x =
            x;

        point.y =
            y;

    }


    initialized =
        true;

}


/* =========================================================
   MOUSE MOVE
========================================================= */

function handleMouseMove(
    event: MouseEvent
) {

    cursor.x =
        event.clientX;

    cursor.y =
        event.clientY;


    isVisible.value =
        true;


    checkTarget(
        event.target
    );


    if (
        !initialized
    ) {

        initializePoints(
            event.clientX,
            event.clientY
        );

    }

}


/* =========================================================
   MOUSE DOWN
========================================================= */

function handleMouseDown() {

    isClicking.value =
        true;

}


/* =========================================================
   MOUSE UP
========================================================= */

function handleMouseUp() {

    isClicking.value =
        false;

}


/* =========================================================
   MOUSE LEAVE
========================================================= */

function handleMouseLeave() {

    isVisible.value =
        false;

}


/* =========================================================
   MOUSE ENTER
========================================================= */

function handleMouseEnter() {

    isVisible.value =
        true;

}


/* =========================================================
   WINDOW BLUR
========================================================= */

function handleWindowBlur() {

    isVisible.value =
        false;

    isClicking.value =
        false;

}


/* =========================================================
   TENTACLE PHYSICS
========================================================= */

function updateTentacle() {

    if (
        !initialized
    ) {

        animationFrameId =
            window.requestAnimationFrame(
                updateTentacle
            );

        return;

    }


    /* =====================================================
       HEAD
    ===================================================== */

    points[0].x +=
        (
            cursor.x -
            points[0].x
        )
        *
        HEAD_FOLLOW;


    points[0].y +=
        (
            cursor.y -
            points[0].y
        )
        *
        HEAD_FOLLOW;


    /* =====================================================
       BODY
    ===================================================== */

    for (
        let i = 1;
        i < POINT_COUNT;
        i++
    ) {

        const previous =
            points[i - 1];

        const current =
            points[i];


        const dx =
            previous.x -
            current.x;

        const dy =
            previous.y -
            current.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            0.001
        ) {

            continue;

        }


        const directionX =
            dx /
            distance;

        const directionY =
            dy /
            distance;


        const targetX =
            previous.x -
            directionX *
            SEGMENT_DISTANCE;


        const targetY =
            previous.y -
            directionY *
            SEGMENT_DISTANCE;


        /*
            La pointe est légèrement
            plus souple que la base.
        */

        const progress =
            i /
            (
                POINT_COUNT -
                1
            );


        const strength =
            Math.max(
                0.20,
                FOLLOW_STRENGTH -
                progress *
                0.10
            );


        current.x +=
            (
                targetX -
                current.x
            )
            *
            strength;


        current.y +=
            (
                targetY -
                current.y
            )
            *
            strength;

    }


    animationFrameId =
        window.requestAnimationFrame(
            updateTentacle
        );

}


/* =========================================================
   WIDTH
========================================================= */

function getWidth(
    index: number
) {

    const progress =
        index /
        (
            POINT_COUNT -
            1
        );


    /*
        La largeur diminue progressivement
        jusqu'à la pointe.
    */

    const eased =
        Math.pow(
            progress,
            1.35
        );


    return (
        BASE_WIDTH -
        (
            BASE_WIDTH -
            TIP_WIDTH
        )
        *
        eased
    );

}


/* =========================================================
   TENTACLE PATH
========================================================= */

const tentaclePath =
    computed(
        () => {

            if (
                points.length <
                2
            ) {

                return "";

            }


            const leftSide:
                Point[] =
                [];

            const rightSide:
                Point[] =
                [];


            /* =================================================
               CALCULATE BOTH SIDES
            ================================================= */

            for (
                let i = 0;
                i <
                points.length;
                i++
            ) {

                const current =
                    points[i];


                const previous =
                    points[
                        Math.max(
                            0,
                            i - 1
                        )
                    ];


                const next =
                    points[
                        Math.min(
                            points.length - 1,
                            i + 1
                        )
                    ];


                const dx =
                    next.x -
                    previous.x;

                const dy =
                    next.y -
                    previous.y;


                const length =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    )
                    ||
                    1;


                /*
                    Normale perpendiculaire.
                */

                const normalX =
                    -dy /
                    length;

                const normalY =
                    dx /
                    length;


                const width =
                    getWidth(
                        i
                    );


                const halfWidth =
                    width /
                    2;


                leftSide.push(
                    {
                        x:
                            current.x +
                            normalX *
                            halfWidth,

                        y:
                            current.y +
                            normalY *
                            halfWidth
                    }
                );


                rightSide.push(
                    {
                        x:
                            current.x -
                            normalX *
                            halfWidth,

                        y:
                            current.y -
                            normalY *
                            halfWidth
                    }
                );

            }


            /* =================================================
               START PATH
            ================================================= */

            let path =
                `M ${leftSide[0].x} ${leftSide[0].y}`;


            /* =================================================
               LEFT SIDE
            ================================================= */

            for (
                let i = 1;
                i <
                leftSide.length;
                i++
            ) {

                const previous =
                    leftSide[i - 1];

                const current =
                    leftSide[i];


                const middleX =
                    (
                        previous.x +
                        current.x
                    )
                    /
                    2;


                const middleY =
                    (
                        previous.y +
                        current.y
                    )
                    /
                    2;


                path +=
                    ` Q ${previous.x} ${previous.y} ${middleX} ${middleY}`;

            }


            /* =================================================
               TIP
            ================================================= */

            const tip =
                points[
                    points.length -
                    1
                ];


            const lastLeft =
                leftSide[
                    leftSide.length -
                    1
                ];


            path +=
                ` Q ${lastLeft.x} ${lastLeft.y} ${tip.x} ${tip.y}`;


            /* =================================================
               RIGHT SIDE
            ================================================= */

            const reversedRight =
                [
                    ...rightSide
                ].reverse();


            for (
                let i = 0;
                i <
                reversedRight.length;
                i++
            ) {

                const current =
                    reversedRight[i];


                if (
                    i ===
                    reversedRight.length -
                    1
                ) {

                    path +=
                        ` L ${current.x} ${current.y}`;

                    continue;

                }


                const next =
                    reversedRight[
                        i + 1
                    ];


                const middleX =
                    (
                        current.x +
                        next.x
                    )
                    /
                    2;


                const middleY =
                    (
                        current.y +
                        next.y
                    )
                    /
                    2;


                path +=
                    ` Q ${current.x} ${current.y} ${middleX} ${middleY}`;

            }


            path +=
                " Z";


            return path;

        }
    );


/* =========================================================
   HIGHLIGHT PATH
========================================================= */

const highlightPath =
    computed(
        () => {

            if (
                points.length <
                5
            ) {

                return "";

            }


            /*
                Le reflet ne commence pas exactement
                au curseur et s'arrête avant la pointe.
            */

            const startIndex =
                1;

            const endIndex =
                points.length -
                4;


            let path =
                `M ${points[startIndex].x} ${points[startIndex].y}`;


            for (
                let i = startIndex + 1;
                i <
                endIndex;
                i++
            ) {

                const previous =
                    points[i - 1];

                const current =
                    points[i];


                const middleX =
                    (
                        previous.x +
                        current.x
                    )
                    /
                    2;


                const middleY =
                    (
                        previous.y +
                        current.y
                    )
                    /
                    2;


                path +=
                    ` Q ${previous.x} ${previous.y} ${middleX} ${middleY}`;

            }


            return path;

        }
    );


/* =========================================================
   SUCKERS
========================================================= */

const suckers =
    computed<Sucker[]>(
        () => {

            const result:
                Sucker[] =
                [];


            if (
                points.length <
                8
            ) {

                return result;

            }


            /*
                On laisse de l'espace :
                - près du curseur
                - près de la pointe
            */

            const startIndex =
                4;

            const endIndex =
                POINT_COUNT -
                5;


            const available =
                endIndex -
                startIndex;


            for (
                let suckerIndex = 0;
                suckerIndex <
                SUCKER_COUNT;
                suckerIndex++
            ) {

                /*
                    Calcul sécurisé.

                    Pas de comparaison problématique
                    avec SUCKER_COUNT === 1.
                */

                const ratio =
                    suckerIndex /
                    Math.max(
                        SUCKER_COUNT -
                        1,
                        1
                    );


                const index =
                    Math.round(
                        startIndex +
                        available *
                        ratio
                    );


                const current =
                    points[index];


                const previous =
                    points[
                        Math.max(
                            0,
                            index - 1
                        )
                    ];


                const next =
                    points[
                        Math.min(
                            POINT_COUNT -
                            1,
                            index + 1
                        )
                    ];


                const dx =
                    next.x -
                    previous.x;

                const dy =
                    next.y -
                    previous.y;


                const length =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    )
                    ||
                    1;


                /*
                    Normale du corps.
                */

                const normalX =
                    -dy /
                    length;

                const normalY =
                    dx /
                    length;


                const width =
                    getWidth(
                        index
                    );


                const sizeProgress =
                    index /
                    (
                        POINT_COUNT -
                        1
                    );


                /*
                    Ventouses beaucoup plus petites.

                    Elles diminuent également
                    en allant vers la pointe.
                */

                const radius =
                    Math.max(
                        1.15,
                        2.9 -
                        sizeProgress *
                        1.55
                    );


                /*
                    Elles restent légèrement
                    à l'intérieur du bord.

                    Ça évite l'effet "boules collées"
                    autour de la tentacule.
                */

                const offset =
                    Math.max(
                        1,
                        width *
                        0.27
                    );


                result.push(
                    {
                        x:
                            current.x +
                            normalX *
                            offset,

                        y:
                            current.y +
                            normalY *
                            offset,

                        radius,

                        innerRadius:
                            radius *
                            0.44
                    }
                );

            }


            return result;

        }
    );


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        window.addEventListener(
            "mousemove",
            handleMouseMove,
            {
                passive: true
            }
        );


        window.addEventListener(
            "mousedown",
            handleMouseDown
        );


        window.addEventListener(
            "mouseup",
            handleMouseUp
        );


        document.documentElement.addEventListener(
            "mouseleave",
            handleMouseLeave
        );


        document.documentElement.addEventListener(
            "mouseenter",
            handleMouseEnter
        );


        window.addEventListener(
            "blur",
            handleWindowBlur
        );


        updateTentacle();

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        window.removeEventListener(
            "mousemove",
            handleMouseMove
        );


        window.removeEventListener(
            "mousedown",
            handleMouseDown
        );


        window.removeEventListener(
            "mouseup",
            handleMouseUp
        );


        document.documentElement.removeEventListener(
            "mouseleave",
            handleMouseLeave
        );


        document.documentElement.removeEventListener(
            "mouseenter",
            handleMouseEnter
        );


        window.removeEventListener(
            "blur",
            handleWindowBlur
        );


        if (
            animationFrameId !==
            null
        ) {

            window.cancelAnimationFrame(
                animationFrameId
            );

        }

    }
);

</script>


<template>

    <div
        class="custom-cursor"

        :class="{
            'custom-cursor--visible':
                isVisible,

            'custom-cursor--hover':
                isHovering,

            'custom-cursor--click':
                isClicking,

            'custom-cursor--text':
                isText
        }"

        aria-hidden="true"
    >

        <!-- =================================================
             SVG
        ================================================== -->

        <svg
            class="custom-cursor__svg"

            width="100%"
            height="100%"

            xmlns="http://www.w3.org/2000/svg"
        >

            <!-- =============================================
                 DEFINITIONS
            ============================================== -->

            <defs>

                <!-- =========================================
                     BODY GRADIENT
                ========================================== -->

                <linearGradient
                    id="couaxiaTentacleGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stop-color="#ff73cb"
                    />

                    <stop
                        offset="30%"
                        stop-color="#f22292"
                    />

                    <stop
                        offset="58%"
                        stop-color="#c11bc2"
                    />

                    <stop
                        offset="82%"
                        stop-color="#7e14b8"
                    />

                    <stop
                        offset="100%"
                        stop-color="#4e078c"
                    />

                </linearGradient>


                <!-- =========================================
                     HIGHLIGHT GRADIENT
                ========================================== -->

                <linearGradient
                    id="couaxiaHighlightGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >

                    <stop
                        offset="0%"
                        stop-color="#ffffff"
                        stop-opacity="0.88"
                    />

                    <stop
                        offset="38%"
                        stop-color="#ffb7e5"
                        stop-opacity="0.58"
                    />

                    <stop
                        offset="72%"
                        stop-color="#22f2ef"
                        stop-opacity="0.25"
                    />

                    <stop
                        offset="100%"
                        stop-color="#22f2ef"
                        stop-opacity="0"
                    />

                </linearGradient>


                <!-- =========================================
                     TENTACLE GLOW
                ========================================== -->

                <filter
                    id="couaxiaTentacleGlow"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                >

                    <feGaussianBlur
                        stdDeviation="4"
                        result="blur"
                    />

                    <feColorMatrix
                        in="blur"

                        type="matrix"

                        values="
                            1 0 0 0 0.95
                            0 0.15 0 0 0.05
                            0 0 0.65 0 0.45
                            0 0 0 0.75 0
                        "
                    />

                    <feMerge>

                        <feMergeNode />

                        <feMergeNode
                            in="SourceGraphic"
                        />

                    </feMerge>

                </filter>


                <!-- =========================================
                     SUCKER RELIEF

                     Ombre légère sous chaque ventouse.
                ========================================== -->

                <filter
                    id="couaxiaSuckerRelief"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                >

                    <feDropShadow
                        dx="0.6"
                        dy="1"
                        stdDeviation="0.7"
                        flood-color="#52055f"
                        flood-opacity="0.65"
                    />

                </filter>

            </defs>


            <!-- =============================================
                 TENTACLE GLOW
            ============================================== -->

            <path
                class="tentacle-glow"

                :d="tentaclePath"
            />


            <!-- =============================================
                 BODY
            ============================================== -->

            <path
                class="tentacle-body"

                :d="tentaclePath"
            />


            <!-- =============================================
                 BODY HIGHLIGHT
            ============================================== -->

            <path
                class="tentacle-highlight"

                :d="highlightPath"
            />


            <!-- =============================================
                 SUCKERS
            ============================================== -->

            <g
                class="tentacle-suckers"
            >

                <g
                    v-for="(
                        sucker,
                        index
                    ) in suckers"

                    :key="index"

                    class="tentacle-sucker"
                >

                    <!-- =====================================
                         OUTER RIM
                    ====================================== -->

                    <circle
                        :cx="sucker.x"
                        :cy="sucker.y"
                        :r="sucker.radius"

                        class="tentacle-sucker__outer"
                    />


                    <!-- =====================================
                         INNER HOLE
                    ====================================== -->

                    <circle
                        :cx="sucker.x"
                        :cy="sucker.y"
                        :r="sucker.innerRadius"

                        class="tentacle-sucker__inner"
                    />


                    <!-- =====================================
                         SMALL REFLECTION
                    ====================================== -->

                    <circle
                        :cx="
                            sucker.x -
                            sucker.radius *
                            0.18
                        "

                        :cy="
                            sucker.y -
                            sucker.radius *
                            0.22
                        "

                        :r="
                            sucker.radius *
                            0.13
                        "

                        class="tentacle-sucker__reflection"
                    />

                </g>

            </g>

        </svg>


        <!-- =================================================
             EXACT CURSOR POINT
        ================================================== -->

        <div
            class="custom-cursor__point"

            :style="{
                transform:
                    `translate3d(
                        ${cursor.x}px,
                        ${cursor.y}px,
                        0
                    )`
            }"
        >

            <!-- =============================================
                 POINT GLOW
            ============================================== -->

            <div
                class="custom-cursor__point-glow"
            ></div>


            <!-- =============================================
                 POINT CORE
            ============================================== -->

            <div
                class="custom-cursor__point-core"
            ></div>


            <!-- =============================================
                 SPARKLES
            ============================================== -->

            <span
                class="
                    custom-cursor__spark
                    custom-cursor__spark--1
                "
            >
                ✦
            </span>


            <span
                class="
                    custom-cursor__spark
                    custom-cursor__spark--2
                "
            >
                ✦
            </span>

        </div>

    </div>

</template>


<style scoped>

/* =========================================================
   HIDE DEFAULT CURSOR
========================================================= */

@media (pointer: fine) {

    :global(html),
    :global(body),
    :global(body *) {
        cursor:
            none !important;
    }

}


/* =========================================================
   ROOT
========================================================= */

.custom-cursor {
    position:
        fixed;

    inset:
        0;

    z-index:
        2147483647;

    width:
        100vw;

    height:
        100vh;

    opacity:
        0;

    visibility:
        hidden;

    pointer-events:
        none !important;

    overflow:
        visible;

    isolation:
        isolate;

    transition:
        opacity 0.12s ease;
}


.custom-cursor--visible {
    opacity:
        1;

    visibility:
        visible;
}


/* =========================================================
   SVG
========================================================= */

.custom-cursor__svg {
    position:
        absolute;

    inset:
        0;

    z-index:
        10;

    width:
        100%;

    height:
        100%;

    overflow:
        visible;

    pointer-events:
        none;
}


/* =========================================================
   TENTACLE GLOW
========================================================= */

.tentacle-glow {
    fill:
        #f22292;

    opacity:
        0.24;

    filter:
        url(#couaxiaTentacleGlow);

    pointer-events:
        none;
}


/* =========================================================
   TENTACLE BODY
========================================================= */

.tentacle-body {
    fill:
        url(#couaxiaTentacleGradient);

    stroke:
        rgba(
            255,
            117,
            215,
            0.32
        );

    stroke-width:
        0.8;

    stroke-linejoin:
        round;

    filter:
        drop-shadow(
            0 0 4px
            rgba(
                242,
                34,
                146,
                0.40
            )
        );

    pointer-events:
        none;

    transition:
        filter 0.15s ease;
}


/* =========================================================
   TENTACLE HIGHLIGHT
========================================================= */

.tentacle-highlight {
    fill:
        none;

    stroke:
        url(#couaxiaHighlightGradient);

    stroke-width:
        1.6;

    stroke-linecap:
        round;

    stroke-linejoin:
        round;

    opacity:
        0.62;

    pointer-events:
        none;
}


/* =========================================================
   SUCKERS
========================================================= */

.tentacle-sucker {
    pointer-events:
        none;
}


/* =========================================================
   SUCKER OUTER

   Bord bombé rose clair.
========================================================= */

.tentacle-sucker__outer {
    fill:
        #ff8ed2;

    stroke:
        #ffd8ef;

    stroke-width:
        0.55;

    filter:
        url(#couaxiaSuckerRelief);

    pointer-events:
        none;
}


/* =========================================================
   SUCKER INNER

   Centre plus sombre pour créer
   l'impression d'un petit creux.
========================================================= */

.tentacle-sucker__inner {
    fill:
        #a91082;

    stroke:
        rgba(
            255,
            221,
            241,
            0.75
        );

    stroke-width:
        0.35;

    pointer-events:
        none;
}


/* =========================================================
   SUCKER REFLECTION

   Petit reflet blanc qui donne
   le relief à la ventouse.
========================================================= */

.tentacle-sucker__reflection {
    fill:
        rgba(
            255,
            255,
            255,
            0.88
        );

    pointer-events:
        none;
}


/* =========================================================
   CURSOR POINT
========================================================= */

.custom-cursor__point {
    position:
        absolute;

    z-index:
        1000;

    top:
        0;

    left:
        0;

    width:
        1px;

    height:
        1px;

    pointer-events:
        none;

    will-change:
        transform;
}


/* =========================================================
   POINT GLOW
========================================================= */

.custom-cursor__point-glow {
    position:
        absolute;

    top:
        -15px;

    left:
        -15px;

    width:
        31px;

    height:
        31px;

    border-radius:
        50%;

    background:
        radial-gradient(
            circle,
            rgba(
                34,
                242,
                239,
                0.38
            ) 0%,
            rgba(
                34,
                242,
                239,
                0.15
            ) 35%,
            rgba(
                242,
                34,
                146,
                0.10
            ) 58%,
            transparent 76%
        );

    filter:
        blur(3px);

    transition:
        transform 0.16s ease,
        opacity 0.16s ease;
}


/* =========================================================
   POINT CORE
========================================================= */

.custom-cursor__point-core {
    position:
        absolute;

    top:
        -5px;

    left:
        -5px;

    width:
        10px;

    height:
        10px;

    border:
        1.5px solid
        #ffffff;

    border-radius:
        50%;

    background:
        #22f2ef;

    box-shadow:
        0 0 6px
        rgba(
            34,
            242,
            239,
            1
        ),

        0 0 13px
        rgba(
            34,
            242,
            239,
            0.50
        ),

        0 0 18px
        rgba(
            242,
            34,
            146,
            0.30
        );

    transition:
        transform 0.12s ease,
        background 0.12s ease,
        box-shadow 0.12s ease;
}


/* =========================================================
   SPARKLES
========================================================= */

.custom-cursor__spark {
    position:
        absolute;

    z-index:
        20;

    opacity:
        0;

    line-height:
        1;

    pointer-events:
        none;

    transition:
        opacity 0.15s ease,
        transform 0.18s ease;
}


.custom-cursor__spark--1 {
    top:
        -17px;

    left:
        12px;

    color:
        #22f2ef;

    font-size:
        9px;

    text-shadow:
        0 0 6px
        rgba(
            34,
            242,
            239,
            0.95
        );
}


.custom-cursor__spark--2 {
    top:
        8px;

    left:
        17px;

    color:
        #f22292;

    font-size:
        7px;

    text-shadow:
        0 0 6px
        rgba(
            242,
            34,
            146,
            0.95
        );
}


/* =========================================================
   HOVER
========================================================= */

.custom-cursor--hover
.custom-cursor__point-glow {
    transform:
        scale(1.4);
}


.custom-cursor--hover
.custom-cursor__point-core {
    transform:
        scale(1.22);

    background:
        #f22292;

    box-shadow:
        0 0 7px
        rgba(
            242,
            34,
            146,
            1
        ),

        0 0 15px
        rgba(
            242,
            34,
            146,
            0.60
        ),

        0 0 20px
        rgba(
            34,
            242,
            239,
            0.42
        );
}


.custom-cursor--hover
.custom-cursor__spark {
    opacity:
        1;
}


.custom-cursor--hover
.custom-cursor__spark--1 {
    transform:
        translate(
            3px,
            -3px
        )
        rotate(
            25deg
        );
}


.custom-cursor--hover
.custom-cursor__spark--2 {
    transform:
        translate(
            4px,
            2px
        )
        rotate(
            -20deg
        );
}


/* =========================================================
   CLICK
========================================================= */

.custom-cursor--click
.custom-cursor__point-core {
    transform:
        scale(1.65);

    background:
        #ffffff;

    box-shadow:
        0 0 7px
        #ffffff,

        0 0 15px
        #f22292,

        0 0 23px
        #22f2ef;
}


.custom-cursor--click
.tentacle-body {
    filter:
        brightness(1.15)
        drop-shadow(
            0 0 6px
            rgba(
                242,
                34,
                146,
                0.60
            )
        );
}


/* =========================================================
   TEXT INPUT
========================================================= */

.custom-cursor--text
.custom-cursor__svg,

.custom-cursor--text
.custom-cursor__point-glow,

.custom-cursor--text
.custom-cursor__spark {
    opacity:
        0;
}


.custom-cursor--text
.custom-cursor__point-core {
    top:
        -10px;

    left:
        -1px;

    width:
        2px;

    height:
        20px;

    border:
        none;

    border-radius:
        999px;

    background:
        #22f2ef;

    transform:
        none !important;

    box-shadow:
        0 0 7px
        rgba(
            34,
            242,
            239,
            0.90
        );
}


/* =========================================================
   LIGHT MODE
========================================================= */

:global(html[data-theme="light"])
.tentacle-body {
    filter:
        drop-shadow(
            0 0 4px
            rgba(
                109,
                0,
                163,
                0.28
            )
        );
}


:global(html[data-theme="light"])
.tentacle-sucker__outer {
    stroke:
        rgba(
            109,
            0,
            163,
            0.30
        );
}


/* =========================================================
   TOUCH DEVICES
========================================================= */

@media (pointer: coarse) {

    :global(html),
    :global(body),
    :global(body *) {
        cursor:
            auto !important;
    }


    .custom-cursor {
        display:
            none !important;
    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .custom-cursor,
    .custom-cursor__point-core,
    .custom-cursor__point-glow,
    .custom-cursor__spark {
        transition:
            none;
    }

}

</style>