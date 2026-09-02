<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import {
    supabase
} from "../../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

type AnnouncementType =
    | "announcement"
    | "poll"
    | "game"
    | "artwork"
    | "lore"
    | "event"
    | "stream"
    | "other";


interface Announcement {

    id:
        string;

    type:
        AnnouncementType;

    title:
        string;

    message:
        string;

    icon:
        string | null;

    image_url:
        string | null;

    link_url:
        string | null;

    link_label:
        string | null;

    is_published:
        boolean;

    is_pinned:
        boolean;

    is_important:
        boolean;

    published_at:
        string | null;

    expires_at:
        string | null;

    source_type:
        string | null;

    source_id:
        string | null;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   STATE
========================================================= */

const isOpen =
    ref(
        false
    );


const loading =
    ref(
        true
    );


const announcements =
    ref<Announcement[]>(
        []
    );


const errorMessage =
    ref(
        ""
    );


let announcementsChannel:
    ReturnType<
        typeof supabase.channel
    >
    |
    null =
        null;


/* =========================================================
   NOTIFICATION COUNT
========================================================= */

const notificationCount =
    computed(
        () =>
            announcements.value.length
    );


/* =========================================================
   DEFAULT ICON
========================================================= */

function getDefaultIcon(
    type:
        AnnouncementType
):
    string {

    switch (
        type
    ) {

        case "poll":

            return "🗳️";


        case "game":

            return "🎮";


        case "artwork":

            return "🎨";


        case "lore":

            return "📖";


        case "event":

            return "📅";


        case "stream":

            return "🔴";


        case "other":

            return "✨";


        default:

            return "📢";

    }

}


/* =========================================================
   ANNOUNCEMENT ICON
========================================================= */

function getAnnouncementIcon(
    announcement:
        Announcement
):
    string {

    return (
        announcement.icon
        ||
        getDefaultIcon(
            announcement.type
        )
    );

}


/* =========================================================
   ACTIVE ANNOUNCEMENT
========================================================= */

function isAnnouncementActive(
    announcement:
        Announcement
):
    boolean {

    if (
        !announcement.is_published
    ) {

        return false;

    }


    const now =
        Date.now();


    /* =====================================================
       FUTURE PUBLICATION
    ===================================================== */

    if (
        announcement.published_at
    ) {

        const publishedAt =
            new Date(
                announcement.published_at
            ).getTime();


        if (
            Number.isFinite(
                publishedAt
            )
            &&
            publishedAt >
            now
        ) {

            return false;

        }

    }


    /* =====================================================
       EXPIRED
    ===================================================== */

    if (
        announcement.expires_at
    ) {

        const expiresAt =
            new Date(
                announcement.expires_at
            ).getTime();


        if (
            Number.isFinite(
                expiresAt
            )
            &&
            expiresAt <=
            now
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================================
   SORT
========================================================= */

function sortAnnouncements(
    values:
        Announcement[]
):
    Announcement[] {

    return [
        ...values
    ].sort(
        (
            first,
            second
        ) => {

            /* =============================================
               PINNED FIRST
            ============================================== */

            if (
                first.is_pinned
                !==
                second.is_pinned
            ) {

                return first.is_pinned
                    ? -1
                    : 1;

            }


            /* =============================================
               IMPORTANT SECOND
            ============================================== */

            if (
                first.is_important
                !==
                second.is_important
            ) {

                return first.is_important
                    ? -1
                    : 1;

            }


            /* =============================================
               NEWEST FIRST
            ============================================== */

            const firstDate =
                new Date(
                    first.published_at
                    ??
                    first.created_at
                ).getTime();


            const secondDate =
                new Date(
                    second.published_at
                    ??
                    second.created_at
                ).getTime();


            return (
                secondDate
                -
                firstDate
            );

        }
    );

}


/* =========================================================
   LOAD ANNOUNCEMENTS
========================================================= */

async function loadAnnouncements() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        const {
            data,
            error
        } =
            await supabase
                .from(
                    "announcements"
                )
                .select(`
                    id,
                    type,
                    title,
                    message,
                    icon,
                    image_url,
                    link_url,
                    link_label,
                    is_published,
                    is_pinned,
                    is_important,
                    published_at,
                    expires_at,
                    source_type,
                    source_id,
                    created_at,
                    updated_at
                `)
                .eq(
                    "is_published",
                    true
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (
            error
        ) {

            throw error;

        }


        const rows =
            (
                data
                ??
                []
            ) as Announcement[];


        announcements.value =
            sortAnnouncements(
                rows.filter(
                    isAnnouncementActive
                )
            );

    }

    catch (
        error
    ) {

        console.error(
            "Erreur chargement notifications :",
            error
        );


        announcements.value =
            [];


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les notifications.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   REALTIME
========================================================= */

function subscribeToAnnouncements() {

    if (
        announcementsChannel
    ) {

        return;

    }


    announcementsChannel =
        supabase
            .channel(
                "public-announcements-bell"
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "*",

                    schema:
                        "public",

                    table:
                        "announcements"
                },
                () => {

                    void loadAnnouncements();

                }
            )
            .subscribe();

}


/* =========================================================
   OPEN / CLOSE
========================================================= */

function toggleNotifications() {

    isOpen.value =
        !isOpen.value;


    if (
        isOpen.value
    ) {

        void loadAnnouncements();

    }

}


function closeNotifications() {

    isOpen.value =
        false;

}


/* =========================================================
   DATE
========================================================= */

function formatRelativeDate(
    value:
        string | null
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


    const diff =
        Date.now()
        -
        date.getTime();


    const minute =
        60
        *
        1000;


    const hour =
        60
        *
        minute;


    const day =
        24
        *
        hour;


    if (
        diff <
        minute
    ) {

        return "À l'instant";

    }


    if (
        diff <
        hour
    ) {

        const minutes =
            Math.max(
                1,
                Math.floor(
                    diff
                    /
                    minute
                )
            );


        return (
            `Il y a ${minutes} min`
        );

    }


    if (
        diff <
        day
    ) {

        const hours =
            Math.max(
                1,
                Math.floor(
                    diff
                    /
                    hour
                )
            );


        return (
            `Il y a ${hours} h`
        );

    }


    if (
        diff <
        7
        *
        day
    ) {

        const days =
            Math.max(
                1,
                Math.floor(
                    diff
                    /
                    day
                )
            );


        return (
            `Il y a ${days} j`
        );

    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    ).format(
        date
    );

}


/* =========================================================
   OPEN LINK
========================================================= */

function openAnnouncementLink(
    announcement:
        Announcement
) {

    if (
        !announcement.link_url
    ) {

        return;

    }


    window.open(
        announcement.link_url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    async () => {

        await loadAnnouncements();


        subscribeToAnnouncements();

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        if (
            announcementsChannel
        ) {

            void supabase
                .removeChannel(
                    announcementsChannel
                );


            announcementsChannel =
                null;

        }

    }
);

</script>


<template>

    <div
        class="announcement-bell"
    >

        <!-- =================================================
             BELL
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
            @click="
                toggleNotifications
            "
        >

            <span
                class="announcement-bell__icon"
                aria-hidden="true"
            >
                🔔
            </span>


            <span
                v-if="
                    notificationCount > 0
                "
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
             PANEL
        ================================================== -->

        <Teleport
            to="body"
        >

            <Transition
                name="announcement"
            >

                <div
                    v-if="
                        isOpen
                    "
                    class="announcement-bell__panel"
                >

                    <!-- =========================================
                         HEADER
                    ========================================== -->

                    <div
                        class="announcement-bell__header"
                    >

                        <div>

                            <span
                                class="announcement-bell__label"
                            >
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
                            @click="
                                closeNotifications
                            "
                        >
                            ×
                        </button>

                    </div>


                    <!-- =========================================
                         LOADING
                    ========================================== -->

                    <div
                        v-if="
                            loading
                        "
                        class="announcement-bell__state"
                    >

                        <span
                            class="announcement-bell__loader"
                            aria-hidden="true"
                        ></span>


                        <strong>
                            Chargement...
                        </strong>

                    </div>


                    <!-- =========================================
                         ERROR
                    ========================================== -->

                    <div
                        v-else-if="
                            errorMessage
                        "
                        class="
                            announcement-bell__state
                            announcement-bell__state--error
                        "
                    >

                        <span
                            aria-hidden="true"
                        >
                            ⚠️
                        </span>


                        <strong>
                            Impossible de charger les nouveautés.
                        </strong>


                        <button
                            type="button"
                            class="announcement-bell__retry"
                            @click="
                                loadAnnouncements
                            "
                        >
                            Réessayer
                        </button>

                    </div>


                    <!-- =========================================
                         EMPTY
                    ========================================== -->

                    <div
                        v-else-if="
                            announcements.length === 0
                        "
                        class="announcement-bell__empty"
                    >

                        <span
                            aria-hidden="true"
                        >
                            🐙
                        </span>


                        <strong>
                            Rien de nouveau pour le moment !
                        </strong>


                        <p>
                            Les nouveautés du site apparaîtront ici.
                        </p>

                    </div>


                    <!-- =========================================
                         LIST
                    ========================================== -->

                    <div
                        v-else
                        class="announcement-bell__list"
                    >

                        <article
                            v-for="
                                announcement
                                in
                                announcements
                            "
                            :key="
                                announcement.id
                            "
                            class="announcement-bell__item"
                            :class="{
                                'announcement-bell__item--important':
                                    announcement.is_important,
                                'announcement-bell__item--pinned':
                                    announcement.is_pinned
                            }"
                        >

                            <!-- =================================
                                 ICON
                            ================================== -->

                            <div
                                class="announcement-bell__item-icon"
                                aria-hidden="true"
                            >
                                {{
                                    getAnnouncementIcon(
                                        announcement
                                    )
                                }}
                            </div>


                            <!-- =================================
                                 CONTENT
                            ================================== -->

                            <div
                                class="announcement-bell__item-content"
                            >

                                <div
                                    class="announcement-bell__item-top"
                                >

                                    <div
                                        class="announcement-bell__item-badges"
                                    >

                                        <span
                                            v-if="
                                                announcement.is_pinned
                                            "
                                        >
                                            📌 Épinglée
                                        </span>


                                        <span
                                            v-if="
                                                announcement.is_important
                                            "
                                            class="is-important"
                                        >
                                            ⚠️ Important
                                        </span>

                                    </div>


                                    <time
                                        v-if="
                                            announcement.published_at
                                            ||
                                            announcement.created_at
                                        "
                                    >
                                        {{
                                            formatRelativeDate(
                                                announcement.published_at
                                                ??
                                                announcement.created_at
                                            )
                                        }}
                                    </time>

                                </div>


                                <h3>
                                    {{ announcement.title }}
                                </h3>


                                <p
                                    v-if="
                                        announcement.message
                                    "
                                >
                                    {{ announcement.message }}
                                </p>


                                <!-- =================================
                                     IMAGE
                                ================================== -->

                                <img
                                    v-if="
                                        announcement.image_url
                                    "
                                    :src="
                                        announcement.image_url
                                    "
                                    :alt="
                                        announcement.title
                                    "
                                    class="announcement-bell__item-image"
                                >


                                <!-- =================================
                                     LINK
                                ================================== -->

                                <button
                                    v-if="
                                        announcement.link_url
                                    "
                                    type="button"
                                    class="announcement-bell__item-link"
                                    @click="
                                        openAnnouncementLink(
                                            announcement
                                        )
                                    "
                                >
                                    {{
                                        announcement.link_label
                                        ||
                                        "Voir"
                                    }}

                                    <span
                                        aria-hidden="true"
                                    >
                                        ↗
                                    </span>
                                </button>

                            </div>

                        </article>

                    </div>

                </div>

            </Transition>

        </Teleport>

    </div>

</template>


<style scoped>

/* =========================================================
   VARIABLES — DARK
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

    --announcement-card-bg:
        rgba(
            29,
            8,
            47,
            0.9
        );

    --announcement-card-hover:
        rgba(
            44,
            12,
            67,
            0.96
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

    --announcement-text-muted:
        rgba(
            255,
            255,
            255,
            0.46
        );

    --announcement-border:
        rgba(
            202,
            81,
            255,
            0.62
        );

    --announcement-soft-border:
        rgba(
            202,
            81,
            255,
            0.18
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
   VARIABLES — LIGHT
========================================================= */

:global(html[data-theme="light"]) {

    --announcement-bg:
        rgba(
            255,
            246,
            255,
            0.98
        );

    --announcement-card-bg:
        rgba(
            255,
            255,
            255,
            0.92
        );

    --announcement-card-hover:
        rgba(
            252,
            240,
            255,
            0.98
        );

    --announcement-text:
        #48135d;

    --announcement-text-secondary:
        #775a82;

    --announcement-text-muted:
        rgba(
            72,
            19,
            93,
            0.52
        );

    --announcement-border:
        rgba(
            185,
            78,
            230,
            0.52
        );

    --announcement-soft-border:
        rgba(
            109,
            0,
            163,
            0.14
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
   CONTAINER
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
   BUTTON
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
   ICON
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
   BELL ANIMATION
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
   COUNTER
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
   PANEL
========================================================= */

.announcement-bell__panel {

    position:
        fixed;

    top:
        105px;

    right:
        330px;

    z-index:
        2147483647;

    width:
        min(
            420px,
            calc(100vw - 30px)
        );

    max-height:
        min(
            720px,
            calc(100vh - 130px)
        );

    padding:
        20px;

    box-sizing:
        border-box;

    overflow:
        hidden;

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
   TRANSITION
========================================================= */

.announcement-enter-active,
.announcement-leave-active {

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;

}


.announcement-enter-from,
.announcement-leave-to {

    opacity:
        0;

    transform:
        translateY(-10px)
        scale(0.97);

}


/* =========================================================
   HEADER
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
   CLOSE
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
   STATES
========================================================= */

.announcement-bell__state,
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


.announcement-bell__state strong,
.announcement-bell__empty strong {

    color:
        var(--announcement-text);

    font-size:
        1rem;

}


.announcement-bell__empty > span,
.announcement-bell__state > span:not(.announcement-bell__loader) {

    font-size:
        2.4rem;

}


.announcement-bell__empty p {

    margin:
        0;

    color:
        var(--announcement-text-secondary);

    font-size:
        0.85rem;

}


.announcement-bell__state--error {

    color:
        #ff8cae;

}


.announcement-bell__loader {

    width:
        28px;

    height:
        28px;

    border:
        3px solid
        var(--announcement-soft-border);

    border-top-color:
        #f22292;

    border-radius:
        50%;

    animation:
        announcementLoading
        0.75s
        linear
        infinite;

}


@keyframes announcementLoading {

    to {

        transform:
            rotate(360deg);

    }

}


.announcement-bell__retry {

    margin-top:
        8px;

    padding:
        8px 14px;

    color:
        var(--announcement-text);

    border:
        1px solid
        var(--announcement-border);

    border-radius:
        12px;

    background:
        var(--announcement-button-bg);

    font:
        inherit;

    font-weight:
        800;

    cursor:
        pointer;

}


/* =========================================================
   LIST
========================================================= */

.announcement-bell__list {

    display:
        flex;

    flex-direction:
        column;

    gap:
        12px;

    max-height:
        calc(100vh - 245px);

    margin-top:
        15px;

    padding-right:
        4px;

    overflow-y:
        auto;

    scrollbar-width:
        thin;

    scrollbar-color:
        rgba(
            242,
            34,
            146,
            0.55
        )
        transparent;

}


/* =========================================================
   ITEM
========================================================= */

.announcement-bell__item {

    display:
        grid;

    grid-template-columns:
        46px
        minmax(0, 1fr);

    gap:
        12px;

    padding:
        14px;

    border:
        1px solid
        var(--announcement-soft-border);

    border-radius:
        18px;

    background:
        var(--announcement-card-bg);

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;

}


.announcement-bell__item:hover {

    background:
        var(--announcement-card-hover);

    transform:
        translateY(-1px);

}


.announcement-bell__item--pinned {

    border-color:
        rgba(
            34,
            242,
            239,
            0.38
        );

}


.announcement-bell__item--important {

    box-shadow:
        inset
        3px
        0
        0
        #f22292;

}


/* =========================================================
   ITEM ICON
========================================================= */

.announcement-bell__item-icon {

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        46px;

    height:
        46px;

    border:
        1px solid
        var(--announcement-soft-border);

    border-radius:
        15px;

    background:
        var(--announcement-button-bg);

    font-size:
        1.35rem;

}


/* =========================================================
   ITEM CONTENT
========================================================= */

.announcement-bell__item-content {

    min-width:
        0;

}


.announcement-bell__item-top {

    display:
        flex;

    align-items:
        flex-start;

    justify-content:
        space-between;

    gap:
        8px;

}


.announcement-bell__item-top time {

    flex-shrink:
        0;

    color:
        var(--announcement-text-muted);

    font-size:
        0.65rem;

    white-space:
        nowrap;

}


.announcement-bell__item-badges {

    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        5px;

}


.announcement-bell__item-badges span {

    padding:
        3px 7px;

    border:
        1px solid
        var(--announcement-soft-border);

    border-radius:
        999px;

    color:
        var(--announcement-text-secondary);

    font-size:
        0.58rem;

    font-weight:
        900;

}


.announcement-bell__item-badges .is-important {

    color:
        #ff7eac;

    border-color:
        rgba(
            242,
            34,
            146,
            0.28
        );

}


.announcement-bell__item h3 {

    margin:
        7px 0 0;

    color:
        var(--announcement-text);

    font-size:
        0.96rem;

    line-height:
        1.3;

}


.announcement-bell__item p {

    margin:
        7px 0 0;

    color:
        var(--announcement-text-secondary);

    font-size:
        0.79rem;

    line-height:
        1.5;

    white-space:
        pre-wrap;

}


/* =========================================================
   ITEM IMAGE
========================================================= */

.announcement-bell__item-image {

    display:
        block;

    width:
        100%;

    max-height:
        190px;

    margin-top:
        10px;

    border:
        1px solid
        var(--announcement-soft-border);

    border-radius:
        13px;

    object-fit:
        cover;

}


/* =========================================================
   ITEM LINK
========================================================= */

.announcement-bell__item-link {

    display:
        inline-flex;

    align-items:
        center;

    gap:
        6px;

    margin-top:
        10px;

    padding:
        8px 12px;

    color:
        #ffffff;

    border:
        0;

    border-radius:
        11px;

    background:
        linear-gradient(
            135deg,
            #6d00a3,
            #f22292
        );

    font:
        inherit;

    font-size:
        0.72rem;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        transform 0.2s ease,
        filter 0.2s ease;

}


.announcement-bell__item-link:hover {

    transform:
        translateY(-1px);

    filter:
        brightness(1.08);

}


/* =========================================================
   MOBILE
========================================================= */

@media (
    max-width:
    700px
) {

    .announcement-bell__panel {

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

        max-height:
            calc(100vh - 24px);

    }


    .announcement-bell__list {

        max-height:
            calc(100vh - 180px);

    }

}


/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (
    prefers-reduced-motion:
    reduce
) {

    .announcement-bell__button.has-notifications
    .announcement-bell__icon {

        animation:
            none;

    }


    .announcement-bell__loader {

        animation:
            none;

    }

}

</style>
