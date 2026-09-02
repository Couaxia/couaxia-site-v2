import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES GÉNÉRAUX
========================================================= */

export type UserRole =
    | "user"
    | "moderator"
    | "admin";


export type SuggestionStatus =
    | "pending"
    | "approved"
    | "rejected";


/* =========================================================
   ADMIN PROFILE
========================================================= */

export interface AdminProfile {

    id:
        string;

    username:
        string;

    display_name:
        string | null;

    avatar_url:
        string | null;

    bio:
        string | null;

    role:
        UserRole;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export interface AdminDashboardStats {

    users:
        number;

    games:
        number;

    pollGames:
        number;

    polls:
        number;

    activePolls:
        number;

    votes:
        number;

    pendingSuggestions:
        number;

    artworks:
        number;

    visibleArtworks:
        number;

}


/* =========================================================
   POLLS
========================================================= */

export interface AdminPoll {

    id:
        string;

    slug:
        string | null;

    question:
        string | null;

    status:
        string;

    title:
        string | null;

    description:
        string | null;

    category:
        string | null;

    starts_at:
        string | null;

    ends_at:
        string | null;

    results_visible:
        boolean;

    allow_suggestions:
        boolean;

    winner:
        string | null;

    created_at:
        string;

    updated_at:
        string;

}


export interface CreatePollPayload {

    slug?:
        string | null;

    question?:
        string | null;

    status?:
        string;

    title?:
        string | null;

    description?:
        string | null;

    category?:
        string | null;

    starts_at?:
        string | null;

    ends_at?:
        string | null;

    results_visible?:
        boolean;

    allow_suggestions?:
        boolean;

    winner?:
        string | null;

}


export type UpdatePollPayload =
    Partial<CreatePollPayload>;


/* =========================================================
   POLL OPTIONS
========================================================= */

export interface AdminPollOption {

    id:
        string;

    poll_id:
        string;

    game_id:
        string;

    position:
        number;

    created_at:
        string;

    game?:
        AdminGame | null;

}


export interface CreatePollOptionPayload {

    poll_id:
        string;

    game_id:
        string;

    position?:
        number;

}


/* =========================================================
   GAMES
========================================================= */

/*
 * IMPORTANT :
 *
 * Dans Supabase, tags peut être un text[].
 *
 * Mais AdminGames.vue travaille actuellement avec une chaîne
 * pour la recherche et le formulaire.
 *
 * Le service transforme donc :
 *
 * ["Horreur", "Coop"]
 *
 * en :
 *
 * "Horreur, Coop"
 *
 * lorsqu'il RENVOIE un AdminGame.
 *
 * Et il fait l'inverse lors d'un INSERT / UPDATE.
 */

export interface AdminGame {

    id:
        string;

    twitch_game_id:
        string;

    twitch_name:
        string | null;

    box_art_url:
        string | null;

    status:
        string | null;

    tags:
        string;

    description:
        string | null;

    rating:
        number | null;

    youtube_playlist:
        string | null;

    poll_enabled:
        boolean | null;

    created_at:
        string;

    updated_at:
        string;

}


export interface UpdateGamePayload {

    twitch_name?:
        string | null;

    box_art_url?:
        string | null;

    status?:
        string | null;

    tags?:
        string | string[] | null;

    description?:
        string | null;

    rating?:
        number | null;

    youtube_playlist?:
        string | null;

    poll_enabled?:
        boolean;

}


export interface CreateGamePayload {

    twitch_game_id?:
        string | null;

    twitch_name?:
        string | null;

    box_art_url?:
        string | null;

    status?:
        string | null;

    tags?:
        string | string[] | null;

    description?:
        string | null;

    rating?:
        number | null;

    youtube_playlist?:
        string | null;

    poll_enabled?:
        boolean;

}


/* =========================================================
   SUGGESTIONS
========================================================= */

export interface AdminSuggestionProfile {

    id:
        string;

    username:
        string;

    display_name:
        string | null;

    avatar_url:
        string | null;

}


export interface AdminSuggestion {

    id:
        string;

    category:
        string;

    question:
        string;

    description:
        string | null;

    user_id:
        string | null;

    status:
        string;

    created_at:
        string;

    updated_at:
        string;

    profile?:
        AdminSuggestionProfile | null;

}


/* =========================================================
   ARTWORKS
========================================================= */

export interface AdminArtwork {

    id:
        string;

    art_id:
        string;

    artist:
        string;

    artist_role:
        string | null;

    description:
        string | null;

    image_url:
        string;

    image_alt:
        string | null;

    media_type:
        string;

    tags:
        string[];

    image_messages:
        string[];

    artist_url:
        string | null;

    button_text:
        string;

    button_messages:
        string[];

    sensitive:
        boolean;

    favorite_enabled:
        boolean;

    visible:
        boolean;

    sort_order:
        number;

    created_at:
        string;

    updated_at:
        string;

}


export interface ArtworkPayload {

    art_id:
        string;

    artist:
        string;

    artist_role?:
        string | null;

    description?:
        string | null;

    image_url:
        string;

    image_alt?:
        string | null;

    media_type?:
        string;

    tags?:
        string[];

    image_messages?:
        string[];

    artist_url?:
        string | null;

    button_text?:
        string;

    button_messages?:
        string[];

    sensitive?:
        boolean;

    favorite_enabled?:
        boolean;

    visible?:
        boolean;

    sort_order?:
        number;

}


export type UpdateArtworkPayload =
    Partial<ArtworkPayload>;


/* =========================================================
   HELPERS — STRINGS
========================================================= */

function cleanString(
    value:
        unknown
): string {

    if (
        value === null
        ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


/* =========================================================
   HELPERS — GAME TAGS TO ARRAY
========================================================= */

function normalizeGameTagsForDatabase(
    value:
        string | string[] | null | undefined
): string[] {

    if (
        Array.isArray(
            value
        )
    ) {

        return value
            .map(
                tag =>
                    String(
                        tag
                    ).trim()
            )
            .filter(
                Boolean
            );

    }


    if (
        typeof value
        !==
        "string"
    ) {

        return [];

    }


    const clean =
        value.trim();


    if (
        !clean
    ) {

        return [];

    }


    /*
     * Supporte aussi :
     *
     * ["Horreur", "Coop"]
     */

    if (
        clean.startsWith("[")
        &&
        clean.endsWith("]")
    ) {

        try {

            const parsed =
                JSON.parse(
                    clean
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                return parsed
                    .map(
                        tag =>
                            String(
                                tag
                            ).trim()
                    )
                    .filter(
                        Boolean
                    );

            }

        }
        catch {

            /*
             * Si ce n'est pas du JSON valide,
             * on continue avec le split.
             */

        }

    }


    return clean
        .split(",")
        .map(
            tag =>
                tag.trim()
        )
        .filter(
            Boolean
        );

}


/* =========================================================
   HELPERS — GAME TAGS TO TEXT
========================================================= */

function normalizeGameTagsForAdmin(
    value:
        unknown
): string {

    if (
        Array.isArray(
            value
        )
    ) {

        return value
            .map(
                tag =>
                    String(
                        tag
                    ).trim()
            )
            .filter(
                Boolean
            )
            .join(", ");

    }


    if (
        typeof value
        ===
        "string"
    ) {

        return value;

    }


    return "";

}


/* =========================================================
   HELPERS — ADMIN GAME
========================================================= */

function normalizeAdminGame(
    value:
        any
): AdminGame {

    return {

        id:
            String(
                value.id
                ??
                ""
            ),

        twitch_game_id:
            String(
                value.twitch_game_id
                ??
                ""
            ),

        twitch_name:
            value.twitch_name
            ??
            null,

        box_art_url:
            value.box_art_url
            ??
            null,

        status:
            value.status
            ??
            null,

        tags:
            normalizeGameTagsForAdmin(
                value.tags
            ),

        description:
            value.description
            ??
            null,

        rating:
            value.rating === null
            ||
            value.rating === undefined

                ? null

                : Number(
                    value.rating
                ),

        youtube_playlist:
            value.youtube_playlist
            ??
            null,

        poll_enabled:
            value.poll_enabled
            ??
            false,

        created_at:
            String(
                value.created_at
                ??
                ""
            ),

        updated_at:
            String(
                value.updated_at
                ??
                ""
            )

    };

}


/* =========================================================
   HELPERS — NORMALIZE GAME PAYLOAD
========================================================= */

function normalizeGamePayload(
    payload:
        UpdateGamePayload
) {

    const result:
        Record<
            string,
            unknown
        > = {};


    if (
        payload.twitch_name
        !==
        undefined
    ) {

        result.twitch_name =
            payload.twitch_name;

    }


    if (
        payload.box_art_url
        !==
        undefined
    ) {

        result.box_art_url =
            payload.box_art_url;

    }


    if (
        payload.status
        !==
        undefined
    ) {

        result.status =
            payload.status;

    }


    if (
        payload.tags
        !==
        undefined
    ) {

        result.tags =
            normalizeGameTagsForDatabase(
                payload.tags
            );

    }


    if (
        payload.description
        !==
        undefined
    ) {

        result.description =
            payload.description;

    }


    if (
        payload.rating
        !==
        undefined
    ) {

        result.rating =
            payload.rating;

    }


    if (
        payload.youtube_playlist
        !==
        undefined
    ) {

        result.youtube_playlist =
            payload.youtube_playlist;

    }


    if (
        payload.poll_enabled
        !==
        undefined
    ) {

        result.poll_enabled =
            payload.poll_enabled;

    }


    return result;

}


/* =========================================================
   HELPERS — SLUG
========================================================= */

function normalizeSlug(
    value:
        string
): string {

    return value
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =========================================================
   HELPERS — UNIQUE POLL SLUG
========================================================= */

async function getUniquePollSlug(
    requestedSlug:
        string | null | undefined,

    title:
        string | null | undefined,

    excludedPollId?:
        string
): Promise<string | null> {

    const source =
        cleanString(
            requestedSlug
        )
        ||
        cleanString(
            title
        );


    if (
        !source
    ) {

        return null;

    }


    const baseSlug =
        normalizeSlug(
            source
        );


    if (
        !baseSlug
    ) {

        return null;

    }


    let candidate =
        baseSlug;


    let suffix =
        2;


    while (
        true
    ) {

        let query =
            supabase
                .from(
                    "polls"
                )
                .select(
                    "id"
                )
                .eq(
                    "slug",
                    candidate
                )
                .limit(
                    1
                );


        if (
            excludedPollId
        ) {

            query =
                query.neq(
                    "id",
                    excludedPollId
                );

        }


        const {
            data,
            error
        } =
            await query;


        if (
            error
        ) {

            console.error(
                "Erreur vérification slug sondage :",
                error
            );


            throw error;

        }


        if (
            !data
            ||
            data.length === 0
        ) {

            return candidate;

        }


        candidate =
            `${baseSlug}-${suffix}`;


        suffix +=
            1;

    }

}


/* =========================================================
   ADMIN CHECK
========================================================= */

export async function getCurrentAdmin():
    Promise<AdminProfile | null> {

    const {
        data: {
            user
        },
        error:
            authError
    } =
        await supabase
            .auth
            .getUser();


    if (
        authError
        ||
        !user
    ) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .select(`
                id,
                username,
                display_name,
                avatar_url,
                bio,
                role,
                created_at,
                updated_at
            `)
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Erreur récupération admin :",
            error
        );


        throw error;

    }


    if (
        !data
        ||
        data.role
        !==
        "admin"
    ) {

        return null;

    }


    return data as AdminProfile;

}


/* =========================================================
   IS ADMIN
========================================================= */

export async function isCurrentUserAdmin():
    Promise<boolean> {

    const admin =
        await getCurrentAdmin();


    return Boolean(
        admin
    );

}


/* =========================================================
   REQUIRE ADMIN
========================================================= */

async function requireAdmin():
    Promise<AdminProfile> {

    const admin =
        await getCurrentAdmin();


    if (
        !admin
    ) {

        throw new Error(
            "Accès administrateur requis."
        );

    }


    return admin;

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

export async function getAdminDashboardStats():
    Promise<AdminDashboardStats> {

    await requireAdmin();


    const [
        usersResult,
        gamesResult,
        pollGamesResult,
        pollsResult,
        activePollsResult,
        votesResult,
        suggestionsResult,
        artworksResult,
        visibleArtworksResult
    ] =
        await Promise.all([

            supabase
                .from(
                    "profiles"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                ),


            supabase
                .from(
                    "games"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                ),


            supabase
                .from(
                    "games"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "poll_enabled",
                    true
                ),


            supabase
                .from(
                    "polls"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                ),


            supabase
                .from(
                    "polls"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "status",
                    "active"
                ),


            supabase
                .from(
                    "poll_votes"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                ),


            supabase
                .from(
                    "poll_suggestions"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "status",
                    "pending"
                ),


            supabase
                .from(
                    "artworks"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                ),


            supabase
                .from(
                    "artworks"
                )
                .select(
                    "id",
                    {
                        count:
                            "exact",

                        head:
                            true
                    }
                )
                .eq(
                    "visible",
                    true
                )

        ]);


    const results = [

        usersResult,
        gamesResult,
        pollGamesResult,
        pollsResult,
        activePollsResult,
        votesResult,
        suggestionsResult,
        artworksResult,
        visibleArtworksResult

    ];


    const firstError =
        results.find(
            result =>
                result.error
        )?.error;


    if (
        firstError
    ) {

        console.error(
            "Erreur statistiques admin :",
            firstError
        );


        throw firstError;

    }


    return {

        users:
            usersResult.count
            ??
            0,

        games:
            gamesResult.count
            ??
            0,

        pollGames:
            pollGamesResult.count
            ??
            0,

        polls:
            pollsResult.count
            ??
            0,

        activePolls:
            activePollsResult.count
            ??
            0,

        votes:
            votesResult.count
            ??
            0,

        pendingSuggestions:
            suggestionsResult.count
            ??
            0,

        artworks:
            artworksResult.count
            ??
            0,

        visibleArtworks:
            visibleArtworksResult.count
            ??
            0

    };

}


/* =========================================================
   USERS
========================================================= */

export async function getAdminUsers():
    Promise<AdminProfile[]> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .select(`
                id,
                username,
                display_name,
                avatar_url,
                bio,
                role,
                created_at,
                updated_at
            `)
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
            "Erreur récupération utilisateurs :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ) as AdminProfile[];

}


/* =========================================================
   UPDATE USER ROLE
========================================================= */

export async function updateUserRole(
    userId:
        string,

    role:
        UserRole
): Promise<AdminProfile> {

    const admin =
        await requireAdmin();


    if (
        admin.id
        ===
        userId
        &&
        role
        !==
        "admin"
    ) {

        throw new Error(
            "Tu ne peux pas retirer ton propre rôle administrateur."
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .update({

                role,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                userId
            )
            .select(`
                id,
                username,
                display_name,
                avatar_url,
                bio,
                role,
                created_at,
                updated_at
            `)
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification rôle :",
            error
        );


        throw error;

    }


    return data as AdminProfile;

}


/* =========================================================
   POLLS — GET ALL
========================================================= */

export async function getAdminPolls():
    Promise<AdminPoll[]> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .select(`
                id,
                slug,
                question,
                status,
                title,
                description,
                category,
                starts_at,
                ends_at,
                results_visible,
                allow_suggestions,
                winner,
                created_at,
                updated_at
            `)
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
            "Erreur récupération sondages admin :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ) as AdminPoll[];

}


/* =========================================================
   POLLS — CREATE
========================================================= */

export async function createAdminPoll(
    payload:
        CreatePollPayload
): Promise<AdminPoll> {

    await requireAdmin();


    const slug =
        await getUniquePollSlug(
            payload.slug,
            payload.title
        );


    const {
        data,
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .insert({

                slug,

                question:
                    payload.question
                    ??
                    null,

                status:
                    payload.status
                    ??
                    "draft",

                title:
                    payload.title
                    ??
                    null,

                description:
                    payload.description
                    ??
                    null,

                category:
                    payload.category
                    ??
                    null,

                starts_at:
                    payload.starts_at
                    ??
                    null,

                ends_at:
                    payload.ends_at
                    ??
                    null,

                results_visible:
                    payload.results_visible
                    ??
                    true,

                allow_suggestions:
                    payload.allow_suggestions
                    ??
                    false,

                winner:
                    payload.winner
                    ??
                    null

            })
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur création sondage :",
            error
        );


        throw error;

    }


    return data as AdminPoll;

}


/* =========================================================
   POLLS — UPDATE
========================================================= */

export async function updateAdminPoll(
    pollId:
        string,

    payload:
        UpdatePollPayload
): Promise<AdminPoll> {

    await requireAdmin();


    const updateData:
        Record<
            string,
            unknown
        > = {

            ...payload,

            updated_at:
                new Date()
                    .toISOString()

        };


    /*
     * Si le slug ou le titre est modifié,
     * on s'assure que le slug reste unique.
     */

    if (
        payload.slug
        !==
        undefined
        ||
        payload.title
        !==
        undefined
    ) {

        let currentSlug:
            string | null =
                null;


        let currentTitle:
            string | null =
                null;


        const {
            data:
                currentPoll,
            error:
                currentPollError
        } =
            await supabase
                .from(
                    "polls"
                )
                .select(
                    "slug, title"
                )
                .eq(
                    "id",
                    pollId
                )
                .maybeSingle();


        if (
            currentPollError
        ) {

            console.error(
                "Erreur récupération sondage :",
                currentPollError
            );


            throw currentPollError;

        }


        if (
            currentPoll
        ) {

            currentSlug =
                currentPoll.slug
                ??
                null;


            currentTitle =
                currentPoll.title
                ??
                null;

        }


        updateData.slug =
            await getUniquePollSlug(

                payload.slug
                !==
                undefined

                    ? payload.slug

                    : currentSlug,

                payload.title
                !==
                undefined

                    ? payload.title

                    : currentTitle,

                pollId

            );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .update(
                updateData
            )
            .eq(
                "id",
                pollId
            )
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification sondage :",
            error
        );


        throw error;

    }


    return data as AdminPoll;

}


/* =========================================================
   POLLS — DELETE
========================================================= */

export async function deleteAdminPoll(
    pollId:
        string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .delete()
            .eq(
                "id",
                pollId
            );


    if (
        error
    ) {

        console.error(
            "Erreur suppression sondage :",
            error
        );


        throw error;

    }

}


/* =========================================================
   POLL OPTIONS — GET
========================================================= */

export async function getAdminPollOptions(
    pollId:
        string
): Promise<AdminPollOption[]> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "poll_options"
            )
            .select(`
                id,
                poll_id,
                game_id,
                position,
                created_at,

                game:games (
                    id,
                    twitch_game_id,
                    twitch_name,
                    box_art_url,
                    status,
                    tags,
                    description,
                    rating,
                    youtube_playlist,
                    poll_enabled,
                    created_at,
                    updated_at
                )
            `)
            .eq(
                "poll_id",
                pollId
            )
            .order(
                "position",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération options sondage :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ).map(
        (option: any) => ({

            id:
                String(
                    option.id
                    ??
                    ""
                ),

            poll_id:
                String(
                    option.poll_id
                    ??
                    ""
                ),

            game_id:
                String(
                    option.game_id
                    ??
                    ""
                ),

            position:
                Number(
                    option.position
                    ??
                    0
                ),

            created_at:
                String(
                    option.created_at
                    ??
                    ""
                ),

            game:
                option.game

                    ? normalizeAdminGame(
                        option.game
                    )

                    : null

        })
    );

}


/* =========================================================
   POLL OPTIONS — ADD
========================================================= */

export async function addAdminPollOption(
    payload:
        CreatePollOptionPayload
): Promise<AdminPollOption> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "poll_options"
            )
            .insert({

                poll_id:
                    payload.poll_id,

                game_id:
                    payload.game_id,

                position:
                    payload.position
                    ??
                    0

            })
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur ajout option sondage :",
            error
        );


        throw error;

    }


    return data as AdminPollOption;

}


/* =========================================================
   POLL OPTIONS — DELETE
========================================================= */

export async function deleteAdminPollOption(
    optionId:
        string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase
            .from(
                "poll_options"
            )
            .delete()
            .eq(
                "id",
                optionId
            );


    if (
        error
    ) {

        console.error(
            "Erreur suppression option :",
            error
        );


        throw error;

    }

}


/* =========================================================
   GAMES — GET
========================================================= */

export async function getAdminGames():
    Promise<AdminGame[]> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "games"
            )
            .select(`
                id,
                twitch_game_id,
                twitch_name,
                box_art_url,
                status,
                tags,
                description,
                rating,
                youtube_playlist,
                poll_enabled,
                created_at,
                updated_at
            `)
            .order(
                "twitch_name",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération jeux admin :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ).map(
        game =>
            normalizeAdminGame(
                game
            )
    );

}


/* =========================================================
   GAMES — CREATE
========================================================= */

export async function createAdminGame(
    payload:
        CreateGamePayload
): Promise<AdminGame> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "games"
            )
            .insert({

                twitch_game_id:
                    payload.twitch_game_id
                    ??
                    "",

                twitch_name:
                    payload.twitch_name
                    ??
                    null,

                box_art_url:
                    payload.box_art_url
                    ??
                    null,

                status:
                    payload.status
                    ??
                    "backlog",

                tags:
                    normalizeGameTagsForDatabase(
                        payload.tags
                    ),

                description:
                    payload.description
                    ??
                    null,

                rating:
                    payload.rating
                    ??
                    null,

                youtube_playlist:
                    payload.youtube_playlist
                    ??
                    null,

                poll_enabled:
                    payload.poll_enabled
                    ??
                    false

            })
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur création jeu admin :",
            error
        );


        throw error;

    }


    return normalizeAdminGame(
        data
    );

}


/* =========================================================
   GAMES — UPDATE
========================================================= */

export async function updateAdminGame(
    gameId:
        string,

    payload:
        UpdateGamePayload
): Promise<AdminGame> {

    await requireAdmin();


    const updateData = {

        ...normalizeGamePayload(
            payload
        ),

        updated_at:
            new Date()
                .toISOString()

    };


    const {
        data,
        error
    } =
        await supabase
            .from(
                "games"
            )
            .update(
                updateData
            )
            .eq(
                "id",
                gameId
            )
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification jeu :",
            error
        );


        throw error;

    }


    return normalizeAdminGame(
        data
    );

}


/* =========================================================
   GAMES — POLL ENABLED
========================================================= */

export async function toggleGamePollEnabled(
    gameId:
        string,

    enabled:
        boolean
): Promise<AdminGame> {

    return updateAdminGame(
        gameId,
        {
            poll_enabled:
                enabled
        }
    );

}


/* =========================================================
   GAMES — DELETE
========================================================= */

export async function deleteAdminGame(
    gameId:
        string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase
            .from(
                "games"
            )
            .delete()
            .eq(
                "id",
                gameId
            );


    if (
        error
    ) {

        console.error(
            "Erreur suppression jeu admin :",
            error
        );


        throw error;

    }

}


/* =========================================================
   SUGGESTIONS — PROFILE MAP
========================================================= */

async function getSuggestionProfiles(
    userIds:
        string[]
): Promise<
    Map<
        string,
        AdminSuggestionProfile
    >
> {

    const uniqueUserIds =
        [
            ...new Set(
                userIds.filter(
                    Boolean
                )
            )
        ];


    const profileMap =
        new Map<
            string,
            AdminSuggestionProfile
        >();


    if (
        uniqueUserIds.length
        ===
        0
    ) {

        return profileMap;

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .select(`
                id,
                username,
                display_name,
                avatar_url
            `)
            .in(
                "id",
                uniqueUserIds
            );


    if (
        error
    ) {

        /*
         * Les suggestions restent utilisables
         * même si le profil associé ne peut pas
         * être récupéré.
         */

        console.warn(
            "Impossible de récupérer les profils des suggestions :",
            error
        );


        return profileMap;

    }


    for (
        const profile
        of
        data
        ??
        []
    ) {

        profileMap.set(
            profile.id,
            {

                id:
                    profile.id,

                username:
                    profile.username
                    ??
                    "poup",

                display_name:
                    profile.display_name
                    ??
                    null,

                avatar_url:
                    profile.avatar_url
                    ??
                    null

            }
        );

    }


    return profileMap;

}


/* =========================================================
   SUGGESTIONS — NORMALIZE
========================================================= */

function normalizeSuggestion(
    suggestion:
        any,

    profileMap?:
        Map<
            string,
            AdminSuggestionProfile
        >
): AdminSuggestion {

    const userId =
        suggestion.user_id
        ??
        null;


    return {

        id:
            String(
                suggestion.id
                ??
                ""
            ),

        category:
            String(
                suggestion.category
                ??
                ""
            ),

        question:
            String(
                suggestion.question
                ??
                ""
            ),

        description:
            suggestion.description
            ??
            null,

        user_id:
            userId,

        status:
            String(
                suggestion.status
                ??
                "pending"
            ),

        created_at:
            String(
                suggestion.created_at
                ??
                ""
            ),

        updated_at:
            String(
                suggestion.updated_at
                ??
                ""
            ),

        profile:
            userId
            &&
            profileMap

                ? (
                    profileMap.get(
                        userId
                    )
                    ??
                    null
                )

                : null

    };

}


/* =========================================================
   SUGGESTIONS — GET
========================================================= */

export async function getAdminSuggestions():
    Promise<AdminSuggestion[]> {

    await requireAdmin();


    /*
     * IMPORTANT :
     *
     * On ne fait PAS :
     *
     * profile:profiles(...)
     *
     * dans cette requête.
     *
     * Comme ça elle fonctionne même si user_id n'a
     * pas de contrainte FK déclarée vers profiles.id.
     */

    const {
        data,
        error
    } =
        await supabase
            .from(
                "poll_suggestions"
            )
            .select(`
                id,
                category,
                question,
                description,
                user_id,
                status,
                created_at,
                updated_at
            `)
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
            "Erreur récupération suggestions admin :",
            error
        );


        throw error;

    }


    const suggestions =
        data
        ??
        [];


    const userIds =
        suggestions
            .map(
                suggestion =>
                    suggestion.user_id
            )
            .filter(
                (
                    value
                ): value is string =>
                    Boolean(
                        value
                    )
            );


    const profileMap =
        await getSuggestionProfiles(
            userIds
        );


    return suggestions.map(
        suggestion =>
            normalizeSuggestion(
                suggestion,
                profileMap
            )
    );

}


/* =========================================================
   SUGGESTIONS — STATUS
========================================================= */

export async function updateSuggestionStatus(
    suggestionId:
        string,

    status:
        SuggestionStatus
): Promise<AdminSuggestion> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "poll_suggestions"
            )
            .update({

                status,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                suggestionId
            )
            .select(`
                id,
                category,
                question,
                description,
                user_id,
                status,
                created_at,
                updated_at
            `)
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification suggestion :",
            error
        );


        throw error;

    }


    let profileMap:
        Map<
            string,
            AdminSuggestionProfile
        > | undefined;


    if (
        data.user_id
    ) {

        profileMap =
            await getSuggestionProfiles([
                data.user_id
            ]);

    }


    return normalizeSuggestion(
        data,
        profileMap
    );

}


/* =========================================================
   SUGGESTIONS — DELETE
========================================================= */

export async function deleteAdminSuggestion(
    suggestionId:
        string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase
            .from(
                "poll_suggestions"
            )
            .delete()
            .eq(
                "id",
                suggestionId
            );


    if (
        error
    ) {

        console.error(
            "Erreur suppression suggestion :",
            error
        );


        throw error;

    }

}


/* =========================================================
   ARTWORKS — NORMALIZE STRING ARRAY
========================================================= */

function normalizeStringArray(
    value:
        unknown
): string[] {

    if (
        Array.isArray(
            value
        )
    ) {

        return value
            .map(
                item =>
                    String(
                        item
                    ).trim()
            )
            .filter(
                Boolean
            );

    }


    if (
        typeof value
        ===
        "string"
    ) {

        const clean =
            value.trim();


        if (
            !clean
    ) {

            return [];

        }


        if (
            clean.startsWith("[")
            &&
            clean.endsWith("]")
        ) {

            try {

                const parsed =
                    JSON.parse(
                        clean
                    );


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    return parsed
                        .map(
                            item =>
                                String(
                                    item
                                ).trim()
                        )
                        .filter(
                            Boolean
                        );

                }

            }
            catch {

                /*
                 * Continue avec split.
                 */

            }

        }


        return clean
            .split(",")
            .map(
                item =>
                    item.trim()
            )
            .filter(
                Boolean
            );

    }


    return [];

}


/* =========================================================
   ARTWORKS — NORMALIZE
========================================================= */

function normalizeAdminArtwork(
    artwork:
        any
): AdminArtwork {

    return {

        id:
            String(
                artwork.id
                ??
                ""
            ),

        art_id:
            String(
                artwork.art_id
                ??
                ""
            ),

        artist:
            String(
                artwork.artist
                ??
                ""
            ),

        artist_role:
            artwork.artist_role
            ??
            null,

        description:
            artwork.description
            ??
            null,

        image_url:
            String(
                artwork.image_url
                ??
                ""
            ),

        image_alt:
            artwork.image_alt
            ??
            null,

        media_type:
            String(
                artwork.media_type
                ??
                "image"
            ),

        tags:
            normalizeStringArray(
                artwork.tags
            ),

        image_messages:
            normalizeStringArray(
                artwork.image_messages
            ),

        artist_url:
            artwork.artist_url
            ??
            null,

        button_text:
            String(
                artwork.button_text
                ??
                "Voir son profil"
            ),

        button_messages:
            normalizeStringArray(
                artwork.button_messages
            ),

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
            Number(
                artwork.sort_order
                ??
                0
            ),

        created_at:
            String(
                artwork.created_at
                ??
                ""
            ),

        updated_at:
            String(
                artwork.updated_at
                ??
                ""
            )

    };

}


/* =========================================================
   ARTWORKS — GET
========================================================= */

export async function getAdminArtworks():
    Promise<AdminArtwork[]> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "artworks"
            )
            .select(`
                id,
                art_id,
                artist,
                artist_role,
                description,
                image_url,
                image_alt,
                media_type,
                tags,
                image_messages,
                artist_url,
                button_text,
                button_messages,
                sensitive,
                favorite_enabled,
                visible,
                sort_order,
                created_at,
                updated_at
            `)
            .order(
                "sort_order",
                {
                    ascending:
                        true
                }
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
            "Erreur récupération artworks admin :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ).map(
        artwork =>
            normalizeAdminArtwork(
                artwork
            )
    );

}


/* =========================================================
   ARTWORKS — CREATE
========================================================= */

export async function createAdminArtwork(
    payload:
        ArtworkPayload
): Promise<AdminArtwork> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "artworks"
            )
            .insert({

                art_id:
                    payload.art_id.trim(),

                artist:
                    payload.artist.trim(),

                artist_role:
                    payload.artist_role
                    ??
                    null,

                description:
                    payload.description
                    ??
                    null,

                image_url:
                    payload.image_url.trim(),

                image_alt:
                    payload.image_alt
                    ??
                    null,

                media_type:
                    payload.media_type
                    ??
                    "image",

                tags:
                    payload.tags
                    ??
                    [],

                image_messages:
                    payload.image_messages
                    ??
                    [],

                artist_url:
                    payload.artist_url
                    ??
                    null,

                button_text:
                    payload.button_text
                    ??
                    "Voir son profil",

                button_messages:
                    payload.button_messages
                    ??
                    [],

                sensitive:
                    payload.sensitive
                    ??
                    false,

                favorite_enabled:
                    payload.favorite_enabled
                    ??
                    true,

                visible:
                    payload.visible
                    ??
                    true,

                sort_order:
                    payload.sort_order
                    ??
                    0

            })
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur création artwork :",
            error
        );


        throw error;

    }


    return normalizeAdminArtwork(
        data
    );

}


/* =========================================================
   ARTWORKS — UPDATE
========================================================= */

export async function updateAdminArtwork(
    artworkId:
        string,

    payload:
        UpdateArtworkPayload
): Promise<AdminArtwork> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "artworks"
            )
            .update({

                ...payload,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                artworkId
            )
            .select()
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification artwork :",
            error
        );


        throw error;

    }


    return normalizeAdminArtwork(
        data
    );

}


/* =========================================================
   ARTWORKS — VISIBILITY
========================================================= */

export async function toggleArtworkVisibility(
    artworkId:
        string,

    visible:
        boolean
): Promise<AdminArtwork> {

    return updateAdminArtwork(
        artworkId,
        {
            visible
        }
    );

}


/* =========================================================
   ARTWORKS — FAVORITE
========================================================= */

export async function toggleArtworkFavorite(
    artworkId:
        string,

    enabled:
        boolean
): Promise<AdminArtwork> {

    return updateAdminArtwork(
        artworkId,
        {
            favorite_enabled:
                enabled
        }
    );

}


/* =========================================================
   ARTWORKS — DELETE
========================================================= */

export async function deleteAdminArtwork(
    artworkId:
        string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase
            .from(
                "artworks"
            )
            .delete()
            .eq(
                "id",
                artworkId
            );


    if (
        error
    ) {

        console.error(
            "Erreur suppression artwork :",
            error
        );


        throw error;

    }

}


/* =========================================================
   ARTWORK STORAGE
========================================================= */

const ARTWORK_BUCKET =
    "artworks";


/* =========================================================
   UPLOAD ARTWORK
========================================================= */

export async function uploadAdminArtworkFile(
    file:
        File,

    folder:
        string =
            "uploads"
): Promise<string> {

    await requireAdmin();


    const allowedTypes = [

        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",

        "video/mp4",
        "video/webm",
        "video/quicktime"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "Format non autorisé. Utilise PNG, JPG, WEBP, GIF, MP4, WEBM ou MOV."
        );

    }


    /*
     * Autorise les médias de plus de 20 Mo.
     * Limite applicative : 50 Mo.
     *
     * Pense aussi à régler la limite du bucket Supabase
     * \"artworks\" à au moins 50 Mo.
     */

    const maxSize =
        50
        *
        1024
        *
        1024;


    if (
        file.size
        >
        maxSize
    ) {

        throw new Error(
            "Le fichier ne peut pas dépasser 50 Mo."
        );

    }


    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase()
        ??
        (
            file.type.startsWith(
                "video/"
            )
                ? "mp4"
                : "webp"
        );


    const safeFolder =
        folder
            .trim()
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "-"
            )
        ||
        "uploads";


    const filename =
        `${crypto.randomUUID()}.${extension}`;


    const path =
        `${safeFolder}/${filename}`;


    const {
        error
    } =
        await supabase
            .storage
            .from(
                ARTWORK_BUCKET
            )
            .upload(
                path,
                file,
                {

                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type

                }
            );


    if (
        error
    ) {

        console.error(
            "Erreur upload artwork :",
            error
        );


        throw new Error(
            `Impossible d'envoyer le média : ${error.message}`
        );

    }


    const {
        data
    } =
        supabase
            .storage
            .from(
                ARTWORK_BUCKET
            )
            .getPublicUrl(
                path
            );


    if (
        !data.publicUrl
    ) {

        throw new Error(
            "Supabase n'a pas renvoyé l'URL publique du média."
        );

    }


    return data.publicUrl;

}


/* =========================================================
   DELETE ARTWORK FILE
========================================================= */

export async function deleteAdminArtworkFile(
    path:
        string
): Promise<void> {

    await requireAdmin();


    const cleanPath =
        path.trim();


    if (
        !cleanPath
    ) {

        return;

    }


    const {
        error
    } =
        await supabase
            .storage
            .from(
                ARTWORK_BUCKET
            )
            .remove([
                cleanPath
            ]);


    if (
        error
    ) {

        console.error(
            "Erreur suppression fichier artwork :",
            error
        );


        throw error;

    }

}