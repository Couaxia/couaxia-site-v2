import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export type AnnouncementType =
    | "announcement"
    | "poll"
    | "game"
    | "artwork"
    | "lore"
    | "event"
    | "stream"
    | "other";


export interface Announcement {

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
   DEFAULT ICON
========================================================= */

export function getAnnouncementIcon(
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
   IS ACTIVE
========================================================= */

export function isAnnouncementActive(
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
       PUBLICATION FUTURE
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
    announcements:
        Announcement[]
):
    Announcement[] {

    return [
        ...announcements
    ]
        .sort(
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
   GET NOTIFICATIONS
========================================================= */

export async function getAnnouncements():
    Promise<Announcement[]> {

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

        console.error(
            "Erreur récupération annonces :",
            error
        );


        throw error;

    }


    const announcements =
        (
            data
            ??
            []
        ) as Announcement[];


    return sortAnnouncements(
        announcements.filter(
            isAnnouncementActive
        )
    );

}


/* =========================================================
   GET LATEST
========================================================= */

export async function getLatestAnnouncements(
    limit:
        number =
            20
):
    Promise<Announcement[]> {

    const announcements =
        await getAnnouncements();


    return announcements.slice(
        0,
        Math.max(
            1,
            limit
        )
    );

}