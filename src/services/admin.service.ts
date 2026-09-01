import { supabase } from "../lib/supabase";


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

    id: string;

    username: string;

    display_name: string | null;

    avatar_url: string | null;

    bio: string | null;

    role: UserRole;

    created_at: string;

    updated_at: string;

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

    id: string;

    slug: string | null;

    question: string | null;

    status: string;

    title: string | null;

    description: string | null;

    category: string | null;

    starts_at: string | null;

    ends_at: string | null;

    results_visible: boolean;

    allow_suggestions: boolean;

    winner: string | null;

    created_at: string;

    updated_at: string;

}


export interface CreatePollPayload {

    slug?: string | null;

    question?: string | null;

    status?: string;

    title?: string | null;

    description?: string | null;

    category?: string | null;

    starts_at?: string | null;

    ends_at?: string | null;

    results_visible?: boolean;

    allow_suggestions?: boolean;

    winner?: string | null;

}


export type UpdatePollPayload =
    Partial<CreatePollPayload>;


/* =========================================================
   POLL OPTIONS
========================================================= */

export interface AdminPollOption {

    id: string;

    poll_id: string;

    game_id: string;

    position: number;

    created_at: string;

    game?: AdminGame | null;

}


export interface CreatePollOptionPayload {

    poll_id: string;

    game_id: string;

    position?: number;

}


/* =========================================================
   GAMES
========================================================= */

export interface AdminGame {

    id: string;

    twitch_game_id: string;

    twitch_name: string | null;

    box_art_url: string | null;

    status: string | null;

    tags: string | null;

    description: string | null;

    rating: number | null;

    youtube_playlist: string | null;

    poll_enabled: boolean | null;

    created_at: string;

    updated_at: string;

}


export interface UpdateGamePayload {

    twitch_name?: string | null;

    box_art_url?: string | null;

    status?: string | null;

    tags?: string | null;

    description?: string | null;

    rating?: number | null;

    youtube_playlist?: string | null;

    poll_enabled?: boolean;

}

/* =========================================================
   CREATE GAME PAYLOAD
========================================================= */

export interface CreateGamePayload {

    twitch_game_id?: string | null;

    twitch_name?: string | null;

    box_art_url?: string | null;

    status?: string | null;

    tags?: string | null;

    description?: string | null;

    rating?: number | null;

    youtube_playlist?: string | null;

    poll_enabled?: boolean;

}
/* =========================================================
   CREATE ADMIN GAME
========================================================= */

export async function createAdminGame(
    payload: CreateGamePayload
): Promise<AdminGame> {

    const {
        data,
        error
    } =
        await supabase
            .from("games")
            .insert({
                twitch_game_id:
                    payload.twitch_game_id ?? "",

                twitch_name:
                    payload.twitch_name ?? null,

                box_art_url:
                    payload.box_art_url ?? null,

                status:
                    payload.status ?? "active",

                tags:
                    payload.tags ?? null,

                description:
                    payload.description ?? null,

                rating:
                    payload.rating ?? null,

                youtube_playlist:
                    payload.youtube_playlist ?? null,

                poll_enabled:
                    payload.poll_enabled ?? false
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


    return data as AdminGame;

}

/* =========================================================
   DELETE ADMIN GAME
========================================================= */

export async function deleteAdminGame(
    gameId: string
): Promise<void> {

    const {
        error
    } =
        await supabase
            .from("games")
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
   SUGGESTIONS
========================================================= */

export interface AdminSuggestion {

    id: string;

    category: string;

    question: string;

    description: string;

    user_id: string | null;

    status: string;

    created_at: string;

    updated_at: string;

    profile?: {

        id: string;

        username: string;

        display_name: string | null;

        avatar_url: string | null;

    } | null;

}


/* =========================================================
   ARTWORKS
========================================================= */

export interface AdminArtwork {

    id: string;

    art_id: string;

    artist: string;

    artist_role: string | null;

    description: string | null;

    image_url: string;

    image_alt: string | null;

    media_type: string;

    tags: string[];

    image_message: string[];

    artist_url: string | null;

    button_text: string;

    button_message: string[];

    sensitive: boolean;

    favorite_enabled: boolean;

    visible: boolean;

    sort_order: number;

    created_at: string;

    updated_at: string;

}


export interface ArtworkPayload {

    art_id: string;

    artist: string;

    artist_role?: string | null;

    description?: string | null;

    image_url: string;

    image_alt?: string | null;

    media_type?: string;

    tags?: string[];

    image_message?: string[];

    artist_url?: string | null;

    button_text?: string;

    button_message?: string[];

    sensitive?: boolean;

    favorite_enabled?: boolean;

    visible?: boolean;

    sort_order?: number;

}


export type UpdateArtworkPayload =
    Partial<ArtworkPayload>;


/* =========================================================
   ADMIN CHECK
========================================================= */

export async function getCurrentAdmin():
    Promise<AdminProfile | null> {

    const {
        data: {
            user
        },
        error: authError
    } =
        await supabase.auth.getUser();


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


    if (error) {

        console.error(
            "Erreur récupération admin :",
            error
        );

        throw error;

    }


    if (
        !data
        ||
        data.role !== "admin"
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
                .from("profiles")
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
                .from("games")
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
                .from("games")
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
                .from("polls")
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
                .from("polls")
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
                .from("poll_votes")
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
                .from("poll_suggestions")
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
                .from("artworks")
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
                .from("artworks")
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
    userId: string,
    role: UserRole
): Promise<AdminProfile> {

    const admin =
        await requireAdmin();


    /*
     * Petite sécurité front supplémentaire :
     * évite qu'un admin retire son propre rôle
     * accidentellement.
     */

    if (
        admin.id === userId
        &&
        role !== "admin"
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
    payload: CreatePollPayload
): Promise<AdminPoll> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .insert({

                slug:
                    payload.slug
                    ??
                    null,

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
    pollId: string,
    payload: UpdatePollPayload
): Promise<AdminPoll> {

    await requireAdmin();


    const {
        data,
        error
    } =
        await supabase
            .from(
                "polls"
            )
            .update({

                ...payload,

                updated_at:
                    new Date()
                        .toISOString()

            })
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
    pollId: string
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
    pollId: string
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
    ) as unknown as AdminPollOption[];

}


/* =========================================================
   POLL OPTIONS — ADD
========================================================= */

export async function addAdminPollOption(
    payload: CreatePollOptionPayload
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
    optionId: string
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
    ) as AdminGame[];

}


/* =========================================================
   GAMES — UPDATE
========================================================= */

export async function updateAdminGame(
    gameId: string,
    payload: UpdateGamePayload
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
            .update({

                ...payload,

                updated_at:
                    new Date()
                        .toISOString()

            })
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


    return data as AdminGame;

}


/* =========================================================
   GAMES — POLL ENABLED
========================================================= */

export async function toggleGamePollEnabled(
    gameId: string,
    enabled: boolean
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
   SUGGESTIONS — GET
========================================================= */

export async function getAdminSuggestions():
    Promise<AdminSuggestion[]> {

    await requireAdmin();


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
                updated_at,

                profile:profiles (
                    id,
                    username,
                    display_name,
                    avatar_url
                )
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


    return (
        data
        ??
        []
    ) as unknown as AdminSuggestion[];

}


/* =========================================================
   SUGGESTIONS — STATUS
========================================================= */

export async function updateSuggestionStatus(
    suggestionId: string,
    status: SuggestionStatus
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
            .select()
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


    return data as AdminSuggestion;

}


/* =========================================================
   SUGGESTIONS — DELETE
========================================================= */

export async function deleteAdminSuggestion(
    suggestionId: string
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
                image_message,
                artist_url,
                button_text,
                button_message,
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
    ) as AdminArtwork[];

}


/* =========================================================
   ARTWORKS — CREATE
========================================================= */

export async function createAdminArtwork(
    payload: ArtworkPayload
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

                image_message:
                    payload.image_message
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

                button_message:
                    payload.button_message
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


    return data as AdminArtwork;

}


/* =========================================================
   ARTWORKS — UPDATE
========================================================= */

export async function updateAdminArtwork(
    artworkId: string,
    payload: UpdateArtworkPayload
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


    return data as AdminArtwork;

}


/* =========================================================
   ARTWORKS — VISIBILITY
========================================================= */

export async function toggleArtworkVisibility(
    artworkId: string,
    visible: boolean
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
    artworkId: string,
    enabled: boolean
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
    artworkId: string
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
    file: File,
    folder:
        string = "uploads"
): Promise<string> {

    await requireAdmin();


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

        throw new Error(
            "Format non autorisé."
        );

    }


    /*
     * 10 Mo maximum pour un artwork.
     */

    const maxSize =
        10
        *
        1024
        *
        1024;


    if (
        file.size > maxSize
    ) {

        throw new Error(
            "Le fichier ne peut pas dépasser 10 Mo."
        );

    }


    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase()
        ??
        "webp";


    const safeFolder =
        folder
            .trim()
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "-"
            );


    const filename =
        `${crypto.randomUUID()}.${extension}`;


    const path =
        `${safeFolder}/${filename}`;


    const {
        error
    } =
        await supabase.storage
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

        throw error;

    }


    const {
        data
    } =
        supabase.storage
            .from(
                ARTWORK_BUCKET
            )
            .getPublicUrl(
                path
            );


    return data.publicUrl;

}


/* =========================================================
   DELETE ARTWORK FILE
========================================================= */

export async function deleteAdminArtworkFile(
    path: string
): Promise<void> {

    await requireAdmin();


    const {
        error
    } =
        await supabase.storage
            .from(
                ARTWORK_BUCKET
            )
            .remove([
                path
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