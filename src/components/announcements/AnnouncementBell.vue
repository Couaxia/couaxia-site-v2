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

import { onBadgeUnlocked, type BadgeUnlockNotification } from "../../services/badge-notifications.service";
import { useRouter } from "vue-router";
const router = useRouter();

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

/* =========================================================

   SUPABASE AVAILABILITY

========================================================= */

const supabaseRestricted = ref(false);

const SUPABASE_RESTRICTED_MESSAGE =

    "Les nouveautés sont temporairement indisponibles car Supabase a atteint sa limite d'utilisation. Réessaie plus tard. 💜";

/* =========================================================

   READ STATE

========================================================= */

const currentUserId =

    ref<string | null>(

        null

    );

const readAnnouncementIds =

    ref<Set<string>>(

        new Set()

    );

const markingReadId =

    ref<string | null>(

        null

    );

let authSubscription:

    {

        unsubscribe:

            () => void;

    }

    |

    null =

        null;

let announcementsChannel:

    ReturnType<

        typeof supabase.channel

    >

    |

    null =

        null;

/* =========================================================

   SUPABASE RESTRICTION HELPERS

========================================================= */

function isSupabaseRestrictionError(error: unknown): boolean {

    const possibleError = error as {

        status?: number;

        code?: string;

        message?: string;

    };

    const message = String(

        possibleError?.message

        ?? error

        ?? ""

    ).toLowerCase();

    return (

        possibleError?.status === 402

        || message.includes("service for this project is restricted")

        || message.includes("exceed_cached_egress")

        || message.includes("cached egress")

        || message.includes("status 402")

    );

}

function stopAnnouncementsRealtime() {

    if (!announcementsChannel) {

        return;

    }

    void supabase.removeChannel(announcementsChannel);

    announcementsChannel = null;

}

function setSupabaseRestricted(error?: unknown) {

    if (error) {

        console.debug(

            "Supabase temporairement indisponible :",

            error

        );

    }

    supabaseRestricted.value = true;

    errorMessage.value = SUPABASE_RESTRICTED_MESSAGE;

    stopAnnouncementsRealtime();

}

/* =========================================================

   NOTIFICATION COUNT

========================================================= */

/* =========================================================
   ANNONCES MASQUÉES — PAR COMPTE / NAVIGATEUR
   Ne supprime jamais les annonces publiques de Supabase.
========================================================= */

const hiddenAnnouncementIds = ref<Set<string>>(new Set());

function hiddenAnnouncementsStorageKey(): string {
    return `couaxia-hidden-announcements:${currentUserId.value ?? "anonymous"}`;
}

function loadHiddenAnnouncements(): void {
    try {
        const raw = localStorage.getItem(hiddenAnnouncementsStorageKey());
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        hiddenAnnouncementIds.value = new Set(
            Array.isArray(parsed)
                ? parsed.filter((id): id is string => typeof id === "string")
                : []
        );
    } catch (error) {
        console.warn("Impossible de lire les annonces masquées :", error);
        hiddenAnnouncementIds.value = new Set();
    }
}

function saveHiddenAnnouncements(): void {
    try {
        localStorage.setItem(
            hiddenAnnouncementsStorageKey(),
            JSON.stringify([...hiddenAnnouncementIds.value])
        );
    } catch (error) {
        console.warn("Impossible de sauvegarder les annonces masquées :", error);
    }
}

function hideAnnouncement(announcementId: string): void {
    hiddenAnnouncementIds.value = new Set([
        ...hiddenAnnouncementIds.value,
        announcementId
    ]);
    saveHiddenAnnouncements();
}

const visibleAnnouncements = computed(() =>
    announcements.value.filter(
        announcement => !hiddenAnnouncementIds.value.has(announcement.id)
    )
);

const unreadAnnouncements =

    computed(

        () =>

            visibleAnnouncements.value.filter(

                announcement =>

                    !readAnnouncementIds.value.has(

                        announcement.id

                    )

            )

    );

/* =========================================================
   SUCCÈS PERSONNELS — STOCKAGE LOCAL PAR UTILISATEUR
========================================================= */

/* Couleurs des raretés : valeur Supabase normalisée (accents et casse). */
function badgeRarityClass(rarity: string | null | undefined): string {
    const value = (rarity ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    if (value.includes("legendaire") || value.includes("legendary")) return "rarity-legendary";
    if (value.includes("epique") || value.includes("epic")) return "rarity-epic";
    if (value.includes("rare")) return "rarity-rare";
    return "rarity-common";
}

interface SavedBadgeNotification extends BadgeUnlockNotification {
    unlockedAt: string;
    read: boolean;
}

const badgeNotifications = ref<SavedBadgeNotification[]>([]);
const BADGE_NOTIFICATION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

function isBadgeNotificationRecent(item: SavedBadgeNotification): boolean {
    const timestamp = Date.parse(item.unlockedAt);
    return Number.isFinite(timestamp) &&
        timestamp <= Date.now() &&
        Date.now() - timestamp < BADGE_NOTIFICATION_LIFETIME_MS;
}

function removeExpiredBadgeNotifications(): void {
    const active = badgeNotifications.value.filter(isBadgeNotificationRecent);
    if (active.length !== badgeNotifications.value.length) {
        badgeNotifications.value = active;
        saveBadgeNotifications();
    }
}

function deleteBadgeNotification(badgeId: string): void {
    badgeNotifications.value = badgeNotifications.value.filter(item => item.id !== badgeId);
    saveBadgeNotifications();
}

function clearReadBadgeNotifications(): void {
    badgeNotifications.value = badgeNotifications.value.filter(item => !item.read);
    saveBadgeNotifications();
}

let stopBadgeListener: (() => void) | null = null;

function badgeStorageKey(userId: string): string {
    return `couaxia-badge-notifications:${userId}`;
}

function loadBadgeNotifications() {
    const userId = currentUserId.value;
    badgeNotifications.value = [];
    if (!userId) return;

    try {
        const raw = localStorage.getItem(badgeStorageKey(userId));
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        badgeNotifications.value = parsed.filter((item): item is SavedBadgeNotification =>
            !!item && typeof item === "object" &&
            typeof item.id === "string" && typeof item.title === "string" &&
            typeof item.unlockedAt === "string" && typeof item.read === "boolean"
        ).filter(isBadgeNotificationRecent).slice(0, 100);
        saveBadgeNotifications();
    } catch (error) {
        console.debug("Lecture des notifications de badges impossible :", error);
    }
}

function saveBadgeNotifications() {
    const userId = currentUserId.value;
    if (!userId) return;
    try {
        localStorage.setItem(
            badgeStorageKey(userId),
            JSON.stringify(badgeNotifications.value.slice(0, 100))
        );
    } catch (error) {
        console.debug("Sauvegarde des notifications de badges impossible :", error);
    }
}

function receiveBadgeUnlocked(badge: BadgeUnlockNotification) {
    if (!currentUserId.value) return;
    removeExpiredBadgeNotifications();
    if (badgeNotifications.value.some(item => item.id === badge.id)) return;

    badgeNotifications.value = [{
        ...badge,
        unlockedAt: new Date().toISOString(),
        read: false
    }, ...badgeNotifications.value].slice(0, 100);
    saveBadgeNotifications();
}

function markBadgeAsRead(badgeId: string) {
    badgeNotifications.value = badgeNotifications.value.map(item =>
        item.id === badgeId ? { ...item, read: true } : item
    );
    saveBadgeNotifications();
}

function openBadgeInProfile(badgeId: string) {
    markBadgeAsRead(badgeId);
    closeNotifications();
    void router.push({ path: "/profile", hash: "#badges" });
}

const unreadBadgesCount = computed(() =>
    badgeNotifications.value.filter(item => !item.read).length
);

const notificationCount =

    computed(

        () =>

            unreadAnnouncements.value.length + unreadBadgesCount.value

    );

/* =========================================================

   LOCAL STORAGE

========================================================= */

const anonymousReadStorageKey =

    "couaxia-announcements-read";

function saveAnonymousReadState() {

    try {

        window.localStorage.setItem(

            anonymousReadStorageKey,

            JSON.stringify(

                Array.from(

                    readAnnouncementIds.value

                )

            )

        );

    }

    catch (

        error

    ) {

        console.debug(

            "Impossible d'enregistrer les notifications lues localement :",

            error

        );

    }

}

function loadAnonymousReadState() {

    try {

        const stored =

            window.localStorage.getItem(

                anonymousReadStorageKey

            );

        if (

            !stored

        ) {

            readAnnouncementIds.value =

                new Set();

            return;

        }

        const values =

            JSON.parse(

                stored

            );

        if (

            !Array.isArray(

                values

            )

        ) {

            readAnnouncementIds.value =

                new Set();

            return;

        }

        readAnnouncementIds.value =

            new Set(

                values.filter(

                    value =>

                        typeof value ===

                        "string"

                )

            );

    }

    catch (

        error

    ) {

        console.debug(

            "Impossible de lire les notifications lues localement :",

            error

        );

        readAnnouncementIds.value =

            new Set();

    }

}

/* =========================================================

   LOAD CURRENT USER

========================================================= */

async function loadCurrentUser() {

    if (supabaseRestricted.value) {

        currentUserId.value = null;

        return;

    }

    const { data, error } =

        await supabase.auth.getUser();

    if (error) {

        if (isSupabaseRestrictionError(error)) {

            setSupabaseRestricted(error);

        }

        else {

            console.debug(

                "Aucun utilisateur connecté pour les notifications :",

                error.message

            );

        }

        currentUserId.value = null;

        return;

    }

    currentUserId.value = data.user?.id ?? null;

}

/* =========================================================

   LOAD READ STATE

========================================================= */

async function loadReadState() {

    if (supabaseRestricted.value) {

        loadAnonymousReadState();

        return;

    }

    if (!currentUserId.value) {

        loadAnonymousReadState();

        return;

    }

    const { data, error } =

        await supabase

            .from("announcement_reads")

            .select("announcement_id")

            .eq("user_id", currentUserId.value);

    if (error) {

        if (isSupabaseRestrictionError(error)) {

            setSupabaseRestricted(error);

            loadAnonymousReadState();

            return;

        }

        console.error(

            "Erreur récupération notifications lues :",

            error

        );

        readAnnouncementIds.value = new Set();

        return;

    }

    readAnnouncementIds.value = new Set(

        (data ?? [])

            .map(row => row.announcement_id)

            .filter((value): value is string => typeof value === "string")

    );

}

/* =========================================================

   IS READ

========================================================= */

function isAnnouncementRead(

    announcementId:

        string

):

    boolean {

    return readAnnouncementIds.value.has(

        announcementId

    );

}

/* =========================================================

   MARK AS READ

========================================================= */

async function markAsRead(announcement: Announcement) {

    if (

        isAnnouncementRead(announcement.id)

        || markingReadId.value === announcement.id

    ) {

        return;

    }

    markingReadId.value = announcement.id;

    try {

        readAnnouncementIds.value = new Set([

            ...readAnnouncementIds.value,

            announcement.id

        ]);

        if (

            currentUserId.value

            && !supabaseRestricted.value

        ) {

            const { error } =

                await supabase

                    .from("announcement_reads")

                    .insert({

                        user_id: currentUserId.value,

                        announcement_id: announcement.id

                    });

            if (error && error.code !== "23505") {

                throw error;

            }

        }

        else {

            saveAnonymousReadState();

        }

    }

    catch (error) {

        if (isSupabaseRestrictionError(error)) {

            setSupabaseRestricted(error);

            saveAnonymousReadState();

            return;

        }

        console.error(

            "Erreur marquage notification comme lue :",

            error

        );

        const restored = new Set(readAnnouncementIds.value);

        restored.delete(announcement.id);

        readAnnouncementIds.value = restored;

    }

    finally {

        markingReadId.value = null;

    }

}

/* =========================================================

   AUTH LISTENER

========================================================= */

function subscribeToAuth() {

    if (

        supabaseRestricted.value

        || authSubscription

    ) {

        return;

    }

    const { data } =

        supabase.auth.onAuthStateChange(

            async (_event, session) => {

                currentUserId.value = session?.user?.id ?? null;

                loadBadgeNotifications();
                loadHiddenAnnouncements();
                await loadReadState();

            }

        );

    authSubscription = data.subscription;

}

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

async function loadAnnouncements(): Promise<boolean> {

    if (supabaseRestricted.value) {

        loading.value = false;

        errorMessage.value = SUPABASE_RESTRICTED_MESSAGE;

        return false;

    }

    loading.value = true;

    errorMessage.value = "";

    try {

        const { data, error } =

            await supabase

                .from("announcements")

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

                .eq("is_published", true)

                .order("created_at", { ascending: false });

        if (error) {

            throw error;

        }

        const rows = (data ?? []) as Announcement[];

        announcements.value = sortAnnouncements(

            rows.filter(isAnnouncementActive)

        );

        return true;

    }

    catch (error) {

        if (isSupabaseRestrictionError(error)) {

            setSupabaseRestricted(error);

            announcements.value = [];

            return false;

        }

        console.error(

            "Erreur chargement notifications :",

            error

        );

        announcements.value = [];

        errorMessage.value =

            error instanceof Error

                ? error.message

                : "Impossible de charger les notifications.";

        return false;

    }

    finally {

        loading.value = false;

    }

}

/* =========================================================

   REALTIME

========================================================= */

function subscribeToAnnouncements() {

    if (

        supabaseRestricted.value

        || announcementsChannel

    ) {

        return;

    }

    announcementsChannel =

        supabase

            .channel("public-announcements-bell")

            .on(

                "postgres_changes",

                {

                    event: "*",

                    schema: "public",

                    table: "announcements"

                },

                () => {

                    void loadAnnouncements();

                }

            )

            .subscribe(status => {

                if (

                    status === "CHANNEL_ERROR"

                    || status === "TIMED_OUT"

                ) {

                    stopAnnouncementsRealtime();

                }

            });

}

/* =========================================================

   OPEN / CLOSE

========================================================= */

function toggleNotifications() {

    isOpen.value = !isOpen.value;

    if (

        isOpen.value

        && !supabaseRestricted.value

    ) {

        void loadAnnouncements();

    }

}

async function retryAnnouncements() {

    supabaseRestricted.value = false;

    errorMessage.value = "";

    await loadCurrentUser();

    const loaded = await loadAnnouncements();

    await loadReadState();

    if (

        loaded

        && !supabaseRestricted.value

    ) {

        subscribeToAnnouncements();

        subscribeToAuth();

    }

}

function closeNotifications() {

    isOpen.value = false;

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

        await loadCurrentUser();
        loadBadgeNotifications();
        loadHiddenAnnouncements();
        stopBadgeListener = onBadgeUnlocked(receiveBadgeUnlocked);

        const announcementsLoaded =

            await loadAnnouncements();

        await loadReadState();

        if (

            announcementsLoaded

            && !supabaseRestricted.value

        ) {

            subscribeToAnnouncements();

            subscribeToAuth();

        }

    }

);

/* =========================================================

   UNMOUNT

========================================================= */

onBeforeUnmount(

    () => {

        stopAnnouncementsRealtime();
        stopBadgeListener?.();
        stopBadgeListener = null;

        authSubscription

            ?.unsubscribe();

        authSubscription =

            null;

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

        <!-- =========================================

            BOUTON NOTIFICATIONS

        ========================================= -->

        <button

            type="button"

            class="announcement-bell__button"

            :class="{

                'has-notifications': notificationCount > 0

            }"

            aria-label="Afficher les notifications"

            :aria-expanded="isOpen"

            @click="toggleNotifications"

        >

            <!-- IMAGE FIXE OU GIF ANIMÉ -->

            <span

                class="announcement-bell__icon"

                aria-hidden="true"

            >

                <img

                    :src="

                        notificationCount > 0

                             ? '/images/dinkdonk.gif'

                             : '/images/dinkdonk.png'

                    "

                    alt=""

                    class="announcement-bell__image"

                />

            </span>

            <!-- COMPTEUR DE NOTIFICATIONS -->

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

                                retryAnnouncements

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

                            visibleAnnouncements.length === 0 && badgeNotifications.length === 0

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
                        <!-- Gestion des notifications de succès (sans modifier les annonces) -->
                        <div v-if="badgeNotifications.some(item => item.read)" class="announcement-bell__badge-toolbar">
                            <button type="button" class="announcement-bell__read-button" @click="clearReadBadgeNotifications">
                                🗑️ Effacer les succès lus
                            </button>
                        </div>
                        <!-- Succès personnels : affichés sans remplacer les annonces -->
                        <article
                            v-for="badge in badgeNotifications"
                            :key="`badge-${badge.id}`"
                            class="announcement-bell__item announcement-bell__item--badge"
                            :class="[badgeRarityClass(badge.rarity), { 'announcement-bell__item--read': badge.read }]"
                        >
                            <div class="announcement-bell__item-icon" aria-hidden="true">
                                {{ badge.icon || '🏆' }}
                            </div>
                            <div class="announcement-bell__item-content">
                                <div class="announcement-bell__item-top">
                                    <div class="announcement-bell__item-badges">
                                        <span>🏆 Succès débloqué</span>
                                        <span v-if="!badge.read" class="is-important">Nouveau</span>
                                    </div>
                                    <time>{{ formatRelativeDate(badge.unlockedAt) }}</time>
                                </div>
                                <h3>{{ badge.title }}</h3>
                                <p>{{ badge.rarity }} · Badge ajouté à ta collection</p>
                                <div class="announcement-bell__item-actions">
                                    <button
                                        type="button"
                                        class="announcement-bell__item-link"
                                        @click="openBadgeInProfile(badge.id)"
                                    >Voir mon badge ↗</button>
                                    <button
                                        type="button"
                                        class="announcement-bell__read-button"
                                        :class="{ 'is-read': badge.read }"
                                        :disabled="badge.read"
                                        @click="markBadgeAsRead(badge.id)"
                                    >{{ badge.read ? '✓ Lu' : '✓ Marquer comme lu' }}</button>
                                    <button
                                        type="button"
                                        class="announcement-bell__badge-delete"
                                        :aria-label="`Supprimer la notification ${badge.title}`"
                                        @click="deleteBadgeNotification(badge.id)"
                                    >🗑️ Supprimer</button>
                                </div>
                            </div>
                        </article>


                        <article

                            v-for="

                                announcement

                                in

                                visibleAnnouncements

                            "

                            :key="

                                announcement.id

                            "

                            class="announcement-bell__item"

                            :class="{

                                'announcement-bell__item--important':

                                    announcement.is_important,

                                'announcement-bell__item--pinned':

                                    announcement.is_pinned,

                                'announcement-bell__item--read':

                                    isAnnouncementRead(

                                        announcement.id

                                    )

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

                                <div

                                    class="announcement-bell__item-actions"

                                >

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

                                    <button

                                        type="button"

                                        class="announcement-bell__read-button"

                                        :class="{

                                            'is-read':

                                                isAnnouncementRead(

                                                    announcement.id

                                                )

                                        }"

                                        :disabled="

                                            isAnnouncementRead(

                                                announcement.id

                                            )

                                            ||

                                            markingReadId ===

                                            announcement.id

                                        "

                                        @click="

                                            markAsRead(

                                                announcement

                                            )

                                        "

                                    >

                                        {{

                                            markingReadId ===

                                            announcement.id

                                                ? "Enregistrement..."

                                                : isAnnouncementRead(

                                                    announcement.id

                                                )

                                                    ? "✓ Lu"

                                                    : "✓ Marquer comme lu"

                                        }}

                                    </button>

                                    <button
                                        type="button"
                                        class="announcement-bell__badge-delete"
                                        :aria-label="`Masquer l'annonce ${announcement.title}`"
                                        @click="hideAnnouncement(announcement.id)"
                                    >
                                        🗑️ Supprimer
                                    </button>

                                </div>

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

     z-index: 2147483646;

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

.announcement-bell__item--read {

    opacity:

        0.66;

    border-color:

        var(--announcement-soft-border);

}

.announcement-bell__item--read:hover {

    opacity:

        0.82;

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

   ITEM ACTIONS

========================================================= */

.announcement-bell__item-actions {

    display:

        flex;

    align-items:

        center;

    flex-wrap:

        wrap;

    gap:

        8px;

    margin-top:

        10px;

}

.announcement-bell__item-actions

.announcement-bell__item-link {

    margin-top:

        0;

}

/* =========================================================

   MARK AS READ

========================================================= */

.announcement-bell__read-button {

    display:

        inline-flex;

    align-items:

        center;

    justify-content:

        center;

    min-height:

        34px;

    padding:

        7px 11px;

    color:

        var(--announcement-text);

    border:

        1px solid

        var(--announcement-soft-border);

    border-radius:

        11px;

    background:

        var(--announcement-button-bg);

    font:

        inherit;

    font-size:

        0.68rem;

    font-weight:

        900;

    cursor:

        pointer;

    transition:

        color 0.2s ease,

        background 0.2s ease,

        border-color 0.2s ease,

        transform 0.2s ease;

}

.announcement-bell__read-button:hover:not(:disabled) {

    color:

        #22f2ef;

    border-color:

        rgba(

            34,

            242,

            239,

            0.42

        );

    transform:

        translateY(-1px);

}

.announcement-bell__read-button.is-read {

    color:

        var(--announcement-text-muted);

    border-color:

        transparent;

    background:

        transparent;

}

.announcement-bell__read-button:disabled {

    cursor:

        default;

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

/* =========================================

   ICÔNE NOTIFICATIONS RONDE

\========================================= */

.announcement-bell__icon {

    display: flex;

    align-items: center;

    justify-content: center;

    width: 50px;

    height: 50px;

    border-radius: 50%;

    overflow: hidden;

}

/* IMAGE FIXE OU GIF */

.announcement-bell__image {

    display: block;

    width: 100%;

    height: 100%;

    border-radius: 50%;

    object-fit: cover;

    pointer-events: none;

}

/* Supprimer l'ancienne animation */

.announcement-bell__button.has-notifications

.announcement-bell__icon {

    animation: none;

}


/* Badges personnels dans la cloche */
.announcement-bell__item--badge {
    border-color: rgba(255, 65, 185, 0.42);
    box-shadow: inset 3px 0 0 #f22292;
}
.announcement-bell__item--badge .announcement-bell__item-icon {
    background: linear-gradient(135deg, rgba(151, 0, 200, .25), rgba(255, 38, 165, .18));
}

/* Bordures de succès par rareté : commun, rare, épique, légendaire */
.announcement-bell__item--badge.rarity-common {
    --badge-accent: #a6a8b6;
    --badge-soft: rgba(166, 168, 182, .16);
}
.announcement-bell__item--badge.rarity-rare {
    --badge-accent: #42b8ff;
    --badge-soft: rgba(66, 184, 255, .17);
}
.announcement-bell__item--badge.rarity-epic {
    --badge-accent: #b777ff;
    --badge-soft: rgba(183, 119, 255, .18);
}
.announcement-bell__item--badge.rarity-legendary {
    --badge-accent: #f4bf4c;
    --badge-soft: rgba(244, 191, 76, .18);
}
.announcement-bell__item--badge[class*="rarity-"] {
    border: 1px solid var(--badge-accent);
    box-shadow: inset 3px 0 0 var(--badge-accent), 0 0 15px var(--badge-soft);
}
.announcement-bell__item--badge[class*="rarity-"] .announcement-bell__item-icon {
    border: 1px solid var(--badge-accent);
    background: var(--badge-soft);
}
.announcement-bell__item--badge.rarity-legendary:not(.announcement-bell__item--read) {
    animation: couaxia-legendary-glow 3s ease-in-out infinite;
}
@keyframes couaxia-legendary-glow {
    0%, 100% { box-shadow: inset 3px 0 0 #f4bf4c, 0 0 8px rgba(244,191,76,.14); }
    50% { box-shadow: inset 3px 0 0 #f4bf4c, 0 0 23px rgba(244,191,76,.40); }
}
@media (prefers-reduced-motion: reduce) {
    .announcement-bell__item--badge.rarity-legendary { animation: none; }
}

/* =========================================================
   COUAXIA V2 — CORRECTION SCROLL NOTIFICATIONS
========================================================= */

/* Fenêtre principale */
.announcement-bell__panel {
    display: flex;
    flex-direction: column;

    max-height: calc(100dvh - 24px);
    min-height: 0;

    overflow: hidden;
}

/* Zone contenant les notifications */
.announcement-bell__list {
    flex: 1 1 auto;
    min-height: 0;

    overflow-y: auto;
    overflow-x: hidden;

    overscroll-behavior: contain;

    padding-bottom: 24px;

    scrollbar-width: thin;
    scrollbar-color: #d225b5 #210b30;
}

/* Scrollbar Chrome / Edge */
.announcement-bell__list::-webkit-scrollbar {
    width: 7px;
}

.announcement-bell__list::-webkit-scrollbar-track {
    background: #210b30;
    border-radius: 10px;
}

.announcement-bell__list::-webkit-scrollbar-thumb {
    background: linear-gradient(
        180deg,
        #a600ff,
        #ff25a9
    );

    border-radius: 10px;
}

/* Adaptation mobile */
@media (max-width: 600px) {
    .announcement-bell__panel {
        max-height: calc(100dvh - 12px);
    }

    .announcement-bell__list {
        padding-bottom: 32px;
    }
}

</style>

<style scoped>
/* Commandes propres aux notifications de succès */
.announcement-bell__badge-toolbar { display: flex; justify-content: flex-end; padding: 4px 4px 10px; }
.announcement-bell__badge-delete { cursor: pointer; border: 1px solid rgba(245, 110, 185, .28); border-radius: 10px; padding: 8px 11px; background: rgba(115, 28, 105, .16); color: #f3b4da; font: inherit; font-size: 12px; font-weight: 700; }
.announcement-bell__badge-delete:hover { border-color: #f35db7; background: rgba(195, 38, 131, .24); color: #fff; }
</style>
