<script setup lang="ts">
import { ref } from "vue";


/* =========================================================
   ÉTAT
========================================================= */

const isOpen =
    ref(false);


/* =========================================================
   TEMPORAIRE

   Plus tard, ce nombre viendra de notre API announcements.
========================================================= */

const notificationCount =
    ref(0);


/* =========================================================
   OUVERTURE / FERMETURE
========================================================= */

function toggleNotifications() {

    isOpen.value =
        !isOpen.value;
}


function closeNotifications() {

    isOpen.value =
        false;
}
</script>


<template>

    <div class="announcement-bell">


        <!-- =================================================
             CLOCHE
        ================================================== -->

        <button
            type="button"
            class="announcement-bell__button"
            :class="{
                'has-notifications':
                    notificationCount > 0
            }"
            aria-label="Afficher les notifications"
            :aria-expanded="isOpen"
            @click="toggleNotifications"
        >

            <span
                class="announcement-bell__icon"
                aria-hidden="true"
            >
                🔔
            </span>


            <!-- =============================================
                 COMPTEUR
            ============================================== -->

            <span
                v-if="notificationCount > 0"
                class="announcement-bell__count"
            >
                {{
                    notificationCount > 99
                        ? "99+"
                        : notificationCount
                }}
            </span>

        </button>


        <!-- =================================================
             PANNEAU
        ================================================== -->

        <div
            v-if="isOpen"
            class="announcement-bell__panel"
        >

            <div class="announcement-bell__header">

                <div>

                    <span class="announcement-bell__label">
                        COUAXIA
                    </span>

                    <h2>
                        🔔 Nouveautés
                    </h2>

                </div>


                <button
                    type="button"
                    class="announcement-bell__close"
                    aria-label="Fermer les notifications"
                    @click="closeNotifications"
                >
                    ×
                </button>

            </div>


            <!-- =============================================
                 TEMPORAIRE

                 On branchera ensuite Supabase/API.
            ============================================== -->

            <div class="announcement-bell__empty">

                <span aria-hidden="true">
                    🐙
                </span>

                <strong>
                    Rien de nouveau pour le moment !
                </strong>

                <p>
                    Les nouveautés du site apparaîtront ici.
                </p>

            </div>

        </div>

    </div>

</template>


<style scoped>

/* =========================================================
   VARIABLES — MODE NUIT
========================================================= */

:global(:root),
:global(html[data-theme="dark"]) {

    --announcement-bg:
        rgba(
            18,
            5,
            35,
            0.98
        );

    --announcement-text:
        #ffffff;

    --announcement-text-secondary:
        rgba(
            255,
            255,
            255,
            0.72
        );

    --announcement-border:
        rgba(
            202,
            81,
            255,
            0.62
        );

    --announcement-button-bg:
        rgba(
            27,
            8,
            48,
            0.95
        );

    --announcement-shadow:
        0
        18px
        45px
        rgba(
            0,
            0,
            0,
            0.34
        );

}


/* =========================================================
   VARIABLES — MODE JOUR
========================================================= */

:global(html[data-theme="light"]) {

    --announcement-bg:
        rgba(
            255,
            246,
            255,
            0.98
        );

    --announcement-text:
        #48135d;

    --announcement-text-secondary:
        #775a82;

    --announcement-border:
        rgba(
            185,
            78,
            230,
            0.52
        );

    --announcement-button-bg:
        rgba(
            255,
            250,
            255,
            0.98
        );

    --announcement-shadow:
        0
        18px
        42px
        rgba(
            72,
            19,
            93,
            0.18
        );

}

/* =========================================================
   CONTENEUR
========================================================= */

.announcement-bell {
    position:
        relative;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;
}


/* =========================================================
   BOUTON
========================================================= */

.announcement-bell__button {
    position:
        relative;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        58px;

    height:
        58px;

    padding:
        0;

    color:
    var(--announcement-text);

    border:
        1px solid
        var(--announcement-border);

    background:
        var(--announcement-button-bg);

    border-radius:
        50%;

    box-shadow:
        0 5px 18px
        rgba(109, 0, 163, 0.13);

    font:
        inherit;

    cursor:
        pointer;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        background 0.25s ease;
}


.announcement-bell__button:hover {
    transform:
        translateY(-3px)
        scale(1.04);

    box-shadow:
        0 8px 24px
        rgba(242, 34, 146, 0.22);
}


/* =========================================================
   ICÔNE
========================================================= */

.announcement-bell__icon {
    display:
        block;

    font-size:
        1.55rem;

    transform-origin:
        50% 10%;
}


/* =========================================================
   CLOCHE ANIMÉE

   Elle bougera uniquement lorsqu'il y aura
   une nouvelle notification.
========================================================= */

.announcement-bell__button.has-notifications
.announcement-bell__icon {
    animation:
        announcementBellRing
        1.6s
        ease-in-out
        infinite;
}


@keyframes announcementBellRing {

    0%,
    55%,
    100% {
        transform:
            rotate(0deg);
    }

    60% {
        transform:
            rotate(16deg);
    }

    68% {
        transform:
            rotate(-14deg);
    }

    76% {
        transform:
            rotate(11deg);
    }

    84% {
        transform:
            rotate(-7deg);
    }

    92% {
        transform:
            rotate(3deg);
    }

}


/* =========================================================
   COMPTEUR
========================================================= */

.announcement-bell__count {
    position:
        absolute;

    top:
        -5px;

    right:
        -5px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    min-width:
        21px;

    height:
        21px;

    padding:
        0 5px;

    box-sizing:
        border-box;

    color:
        #ffffff;

    border:
    2px solid
    var(--announcement-bg);

    border-radius:
        999px;

    background:
        #f22292;

    box-shadow:
        0 3px 10px
        rgba(242, 34, 146, 0.45);

    font-size:
        0.65rem;

    font-weight:
        900;
}


/* =========================================================
   PANNEAU
========================================================= */

.announcement-bell__panel {
    position:
        absolute;

    top:
        calc(100% + 18px);

    right:
        0;

    z-index:
        5000;

    width:
        min(
            390px,
            calc(100vw - 30px)
        );

    padding:
        20px;

    box-sizing:
        border-box;

    border-radius:
        24px;

    color:
    var(--announcement-text);

    border:
        1px solid
        var(--announcement-border);

    background:
        var(--announcement-bg);

    box-shadow:
        var(--announcement-shadow);

    backdrop-filter:
        blur(16px);

    -webkit-backdrop-filter:
        blur(16px);
}


/* =========================================================
   EN-TÊTE DU PANNEAU
========================================================= */

.announcement-bell__header {
    display:
        flex;

    align-items:
        flex-start;

    justify-content:
        space-between;

    gap:
        15px;

    padding-bottom:
        15px;

    border-bottom:
    1px solid
    var(--announcement-border);
}


.announcement-bell__label {
    color:
        #f22292;

    font-size:
        0.72rem;

    font-weight:
        900;

    letter-spacing:
        0.12em;
}


.announcement-bell__header h2 {
    margin:
        5px 0 0;

    color:
    var(--announcement-text);

    font-size:
        1.35rem;
}


/* =========================================================
   FERMETURE
========================================================= */

.announcement-bell__close {
    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        34px;

    height:
        34px;

    padding:
        0;

    border-radius:
        50%;

    color:
    var(--announcement-text);

    border:
        1px solid
        var(--announcement-border);

    background:
        var(--announcement-button-bg);

    font:
        inherit;

    font-size:
        1.25rem;

    font-weight:
        900;

    cursor:
        pointer;
}


/* =========================================================
   AUCUNE NOTIFICATION
========================================================= */

.announcement-bell__empty {
    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        8px;

    min-height:
        170px;

    padding:
        20px;

    box-sizing:
        border-box;

    text-align:
        center;
}


.announcement-bell__empty > span {
    font-size:
        2.4rem;
}


.announcement-bell__empty strong {
    color:
    var(--announcement-text);

    font-size:
        1rem;
}


.announcement-bell__empty p {
    margin:
        0;

    color:
        var(--announcement-text-secondary);

    font-size:
        0.85rem;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    .announcement-bell__panel {
        position:
            fixed;

        top:
            auto;

        left:
            12px;

        right:
            12px;

        bottom:
            12px;

        width:
            auto;
    }

}


/* =========================================================
   ACCESSIBILITÉ
========================================================= */

@media (prefers-reduced-motion: reduce) {

    .announcement-bell__button.has-notifications
    .announcement-bell__icon {
        animation:
            none;
    }

}

</style>