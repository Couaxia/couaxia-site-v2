/* =========================================================
   TYPES
========================================================= */

interface TwitchTokenResponse {

    access_token:
        string;

    expires_in:
        number;

    token_type:
        string;

}


/* =========================================================
   TWITCH USER
========================================================= */

interface TwitchUser {

    id:
        string;

    login:
        string;

    display_name:
        string;

    description:
        string;

    profile_image_url:
        string;

    offline_image_url:
        string;

    broadcaster_type:
        string;

    created_at:
        string;

}


interface TwitchUsersResponse {

    data:
        TwitchUser[];

}


/* =========================================================
   TWITCH STREAM
========================================================= */

interface TwitchStream {

    id:
        string;

    user_id:
        string;

    user_login:
        string;

    user_name:
        string;

    game_id:
        string;

    game_name:
        string;

    type:
        string;

    title:
        string;

    viewer_count:
        number;

    started_at:
        string;

    language:
        string;

    thumbnail_url:
        string;

    is_mature:
        boolean;

}


interface TwitchStreamsResponse {

    data:
        TwitchStream[];

}


/* =========================================================
   FOLLOWERS
========================================================= */

interface TwitchFollowersResponse {

    total:
        number;

    data:
        Array<{

            user_id:
                string;

            user_login:
                string;

            user_name:
                string;

            followed_at:
                string;

        }>;

}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

export interface TwitchRecommendation {

    login:
        string;

    displayName:
        string;

    avatar:
        string;

    url:
        string;

    status:
        | "online"
        | "offline";

    gameName:
        string | null;

    viewers:
        number;

    title:
        string | null;

}


/* =========================================================
   CLIPS
========================================================= */

interface TwitchClip {

    id:
        string;

    url:
        string;

    embed_url:
        string;

    broadcaster_id:
        string;

    broadcaster_name:
        string;

    creator_id:
        string;

    creator_name:
        string;

    video_id:
        string;

    game_id:
        string;

    language:
        string;

    title:
        string;

    view_count:
        number;

    created_at:
        string;

    thumbnail_url:
        string;

    duration:
        number;

}


interface TwitchClipsResponse {

    data:
        TwitchClip[];

    pagination?:
        {

            cursor?:
                string;

        };

}


/* =========================================================
   VIDEOS
========================================================= */

interface TwitchVideo {

    id:
        string;

    stream_id:
        string | null;

    user_id:
        string;

    user_login:
        string;

    user_name:
        string;

    title:
        string;

    description:
        string;

    created_at:
        string;

    published_at:
        string;

    url:
        string;

    thumbnail_url:
        string;

    viewable:
        string;

    view_count:
        number;

    language:
        string;

    type:
        string;

    duration:
        string;

    muted_segments?:
        unknown;

}


interface TwitchVideosResponse {

    data:
        TwitchVideo[];

    pagination?:
        {

            cursor?:
                string;

        };

}


/* =========================================================
   GAMES
========================================================= */

interface TwitchGame {

    id:
        string;

    name:
        string;

    box_art_url:
        string;

    igdb_id?:
        string;

}


interface TwitchGamesResponse {

    data:
        TwitchGame[];

}


/* =========================================================
   CATEGORY SEARCH
========================================================= */

interface TwitchCategorySearchResponse {

    data:
        TwitchGame[];

    pagination?:
        {

            cursor?:
                string;

        };

}


/* =========================================================
   PUBLIC GAME DATA
========================================================= */

export interface TwitchGameData {

    id:
        string;

    name:
        string;

    boxArtUrl:
        string | null;

    rawBoxArtUrl:
        string | null;

}


/* =========================================================
   TWITCH GAME CACHE
========================================================= */

interface CacheEntry<T> {

    value:
        T;

    expiresAt:
        number;

}


/*
 * Les informations d'un jeu Twitch changent très rarement.
 *
 * On garde donc les jeux récupérés par ID pendant 24 h.
 */
const TWITCH_GAME_CACHE_TTL_MS =
    24
    *
    60
    *
    60
    *
    1000;


/*
 * Les résultats de recherche sont un peu plus dynamiques.
 *
 * On les garde pendant 15 minutes.
 */
const TWITCH_GAME_SEARCH_CACHE_TTL_MS =
    15
    *
    60
    *
    1000;


/*
 * Limite simple pour éviter qu'une grande quantité
 * de recherches différentes fasse grossir le cache
 * mémoire indéfiniment.
 */
const TWITCH_SEARCH_CACHE_MAX_ENTRIES =
    250;


const twitchGameByIdCache =
    new Map<
        string,
        CacheEntry<TwitchGameData>
    >();


const twitchGameSearchCache =
    new Map<
        string,
        CacheEntry<TwitchGameData[]>
    >();


/* =========================================================
   CACHE — GET
========================================================= */

function getCachedValue<T>(
    cache:
        Map<
            string,
            CacheEntry<T>
        >,

    key:
        string
): T | null {

    const entry =
        cache.get(
            key
        );


    if (
        !entry
    ) {

        return null;

    }


    if (
        Date.now()
        >=
        entry.expiresAt
    ) {

        cache.delete(
            key
        );


        return null;

    }


    return entry.value;

}


/* =========================================================
   CACHE — SET
========================================================= */

function setCachedValue<T>(
    cache:
        Map<
            string,
            CacheEntry<T>
        >,

    key:
        string,

    value:
        T,

    ttlMs:
        number,

    maxEntries?:
        number
): void {

    /*
     * On retire d'abord les entrées expirées.
     */
    const now =
        Date.now();


    for (
        const [
            cachedKey,
            entry
        ]
        of
        cache
    ) {

        if (
            now
            >=
            entry.expiresAt
        ) {

            cache.delete(
                cachedKey
            );

        }

    }


    /*
     * Si une limite est fournie, on retire la plus
     * ancienne entrée restante avant d'en ajouter une.
     */
    if (
        maxEntries
        &&
        cache.size
        >=
        maxEntries
        &&
        !cache.has(
            key
        )
    ) {

        const firstKey =
            cache
                .keys()
                .next()
                .value;


        if (
            typeof firstKey
            ===
            "string"
        ) {

            cache.delete(
                firstKey
            );

        }

    }


    cache.set(
        key,
        {

            value,

            expiresAt:
                now
                +
                ttlMs

        }
    );

}


/* =========================================================
   CACHE — SEARCH KEY
========================================================= */

function getTwitchGameSearchCacheKey(
    query:
        string,

    limit:
        number
): string {

    return `${
        query
            .trim()
            .toLowerCase()
    }::${
        limit
    }`;

}


/* =========================================================
   CONFIG TWITCH
========================================================= */

function getTwitchConfig() {

    const clientId =
        process.env.TWITCH_CLIENT_ID;


    const clientSecret =
        process.env.TWITCH_CLIENT_SECRET;


    const channel =
        process.env.TWITCH_CHANNEL
        ||
        "couaxia";


    if (
        !clientId
    ) {

        throw new Error(
            "TWITCH_CLIENT_ID is missing."
        );

    }


    if (
        !clientSecret
    ) {

        throw new Error(
            "TWITCH_CLIENT_SECRET is missing."
        );

    }


    return {

        clientId,

        clientSecret,

        channel

    };

}


/* =========================================================
   TOKEN CACHE
========================================================= */

let cachedAccessToken:
    string | null =
        null;


let accessTokenExpiresAt =
    0;


/* =========================================================
   GET APP ACCESS TOKEN
========================================================= */

async function getTwitchAccessToken():
    Promise<string> {

    const {
        clientId,
        clientSecret
    } =
        getTwitchConfig();


    /* =====================================================
       CACHE
    ====================================================== */

    if (
        cachedAccessToken
        &&
        Date.now()
        <
        accessTokenExpiresAt
    ) {

        return cachedAccessToken;

    }


    /* =====================================================
       TOKEN REQUEST
    ====================================================== */

    const params =
        new URLSearchParams({

            client_id:
                clientId,

            client_secret:
                clientSecret,

            grant_type:
                "client_credentials"

        });


    const response =
        await fetch(
            "https://id.twitch.tv/oauth2/token",
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    params

            }
        );


    if (
        !response.ok
    ) {

        const error =
            await response.text();


        throw new Error(
            `Unable to get Twitch access token: ${response.status} ${error}`
        );

    }


    const data =
        (
            await response.json()
        ) as TwitchTokenResponse;


    cachedAccessToken =
        data.access_token;


    /*
     * On enlève 60 secondes pour éviter
     * d'utiliser un token juste au moment
     * de son expiration.
     */

    accessTokenExpiresAt =
        Date.now()
        +
        Math.max(
            data.expires_in
            -
            60,
            0
        )
        *
        1000;


    return data.access_token;

}


/* =========================================================
   TWITCH FETCH
========================================================= */

async function twitchFetch<T>(
    url:
        string,

    retry:
        boolean =
            true
): Promise<T> {

    const {
        clientId
    } =
        getTwitchConfig();


    const accessToken =
        await getTwitchAccessToken();


    const response =
        await fetch(
            url,
            {

                method:
                    "GET",

                headers: {

                    "Client-Id":
                        clientId,

                    Authorization:
                        `Bearer ${accessToken}`,

                    Accept:
                        "application/json"

                }

            }
        );


    /* =====================================================
       TOKEN EXPIRED / INVALID
    ====================================================== */

    if (
        response.status
        ===
        401
        &&
        retry
    ) {

        cachedAccessToken =
            null;


        accessTokenExpiresAt =
            0;


        return twitchFetch<T>(
            url,
            false
        );

    }


    /* =====================================================
       ERROR
    ====================================================== */

    if (
        !response.ok
    ) {

        const error =
            await response.text();


        throw new Error(
            `Twitch API error: ${response.status} ${error}`
        );

    }


    /* =====================================================
       JSON
    ====================================================== */

    return (
        await response.json()
    ) as T;

}


/* =========================================================
   NORMALIZE LIMIT
========================================================= */

function normalizeLimit(
    value:
        number,

    fallback:
        number =
            20
): number {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return fallback;

    }


    return Math.min(
        Math.max(
            Math.floor(
                value
            ),
            1
        ),
        100
    );

}


/* =========================================================
   FORMAT BOX ART
========================================================= */

export function formatTwitchBoxArt(
    value:
        string | null | undefined,

    width:
        number =
            285,

    height:
        number =
            380
): string | null {

    if (
        !value
    ) {

        return null;

    }


    const url =
        value.trim();


    if (
        !url
    ) {

        return null;

    }


    return url
        .replaceAll(
            "{width}",
            String(
                width
            )
        )
        .replaceAll(
            "{height}",
            String(
                height
            )
        )
        .replaceAll(
            "%{width}",
            String(
                width
            )
        )
        .replaceAll(
            "%{height}",
            String(
                height
            )
        );

}


/* =========================================================
   FORMAT THUMBNAIL
========================================================= */

function formatThumbnail(
    value:
        string | null | undefined,

    width:
        number =
            1280,

    height:
        number =
            720
): string | null {

    if (
        !value
    ) {

        return null;

    }


    return value
        .replaceAll(
            "{width}",
            String(
                width
            )
        )
        .replaceAll(
            "{height}",
            String(
                height
            )
        )
        .replaceAll(
            "%{width}",
            String(
                width
            )
        )
        .replaceAll(
            "%{height}",
            String(
                height
            )
        );

}


/* =========================================================
   FORMAT GAME
========================================================= */

function formatGame(
    game:
        TwitchGame
): TwitchGameData {

    const rawBoxArtUrl =
        game.box_art_url
            ?.trim()
        ||
        null;


    return {

        id:
            String(
                game.id
                ??
                ""
            ).trim(),

        name:
            String(
                game.name
                ??
                ""
            ).trim(),

        boxArtUrl:
            formatTwitchBoxArt(
                rawBoxArtUrl,
                285,
                380
            ),

        rawBoxArtUrl

    };

}


/* =========================================================
   GET TWITCH USER
========================================================= */

async function getTwitchUser():
    Promise<TwitchUser | null> {

    const {
        channel
    } =
        getTwitchConfig();


    const url =
        new URL(
            "https://api.twitch.tv/helix/users"
        );


    url.searchParams.set(
        "login",
        channel
    );


    const response =
        await twitchFetch<TwitchUsersResponse>(
            url.toString()
        );


    return (
        response.data[0]
        ??
        null
    );

}


/* =========================================================
   GET TWITCH USERS
========================================================= */

async function getTwitchUsers(
    logins:
        string[]
): Promise<TwitchUser[]> {

    const cleanLogins =
        [
            ...new Set(
                logins
                    .map(
                        login =>
                            login
                                .trim()
                                .toLowerCase()
                    )
                    .filter(
                        Boolean
                    )
            )
        ]
            .slice(
                0,
                100
            );


    if (
        cleanLogins.length
        ===
        0
    ) {

        return [];

    }


    const url =
        new URL(
            "https://api.twitch.tv/helix/users"
        );


    for (
        const login
        of
        cleanLogins
    ) {

        url.searchParams.append(
            "login",
            login
        );

    }


    const response =
        await twitchFetch<TwitchUsersResponse>(
            url.toString()
        );


    return response.data
        ??
        [];

}


/* =========================================================
   GET TWITCH STREAMS
========================================================= */

async function getTwitchStreams(
    userIds:
        string[]
): Promise<TwitchStream[]> {

    const cleanIds =
        [
            ...new Set(
                userIds
                    .map(
                        id =>
                            id.trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        ]
            .slice(
                0,
                100
            );


    if (
        cleanIds.length
        ===
        0
    ) {

        return [];

    }


    const url =
        new URL(
            "https://api.twitch.tv/helix/streams"
        );


    for (
        const userId
        of
        cleanIds
    ) {

        url.searchParams.append(
            "user_id",
            userId
        );

    }


    const response =
        await twitchFetch<TwitchStreamsResponse>(
            url.toString()
        );


    return response.data
        ??
        [];

}


/* =========================================================
   GET LIVE
========================================================= */

export async function getTwitchLive() {

    const {
        channel
    } =
        getTwitchConfig();


    const user =
        await getTwitchUser();


    if (
        !user
    ) {

        throw new Error(
            `Twitch channel "${channel}" not found.`
        );

    }


    const url =
        new URL(
            "https://api.twitch.tv/helix/streams"
        );


    url.searchParams.set(
        "user_id",
        user.id
    );


    const response =
        await twitchFetch<TwitchStreamsResponse>(
            url.toString()
        );


    const stream =
        response.data[0];


    /* =====================================================
       OFFLINE
    ====================================================== */

    if (
        !stream
    ) {

        return {

            isLive:
                false,

            userId:
                user.id,

            login:
                user.login,

            displayName:
                user.display_name,

            description:
                user.description,

            profileImageUrl:
                user.profile_image_url,

            offlineImageUrl:
                user.offline_image_url,

            title:
                null,

            gameId:
                null,

            gameName:
                null,

            viewers:
                0,

            startedAt:
                null,

            language:
                null,

            thumbnailUrl:
                null,

            isMature:
                false

        };

    }


    /* =====================================================
       ONLINE
    ====================================================== */

    return {

        isLive:
            true,

        userId:
            user.id,

        login:
            user.login,

        displayName:
            user.display_name,

        description:
            user.description,

        profileImageUrl:
            user.profile_image_url,

        offlineImageUrl:
            user.offline_image_url,

        title:
            stream.title,

        gameId:
            stream.game_id,

        gameName:
            stream.game_name,

        viewers:
            stream.viewer_count,

        startedAt:
            stream.started_at,

        language:
            stream.language,

        thumbnailUrl:
            formatThumbnail(
                stream.thumbnail_url,
                1280,
                720
            ),

        isMature:
            stream.is_mature

    };

}


/* =========================================================
   GET FOLLOWERS
========================================================= */

export async function getTwitchFollowers() {

    const user =
        await getTwitchUser();


    if (
        !user
    ) {

        throw new Error(
            "Twitch user not found."
        );

    }


    const url =
        new URL(
            "https://api.twitch.tv/helix/channels/followers"
        );


    url.searchParams.set(
        "broadcaster_id",
        user.id
    );


    url.searchParams.set(
        "first",
        "1"
    );


    const response =
        await twitchFetch<TwitchFollowersResponse>(
            url.toString()
        );


    return {

        followers:
            response.total

    };

}


/* =========================================================
   GET RECOMMENDATIONS
========================================================= */

export async function getTwitchRecommendations(
    logins:
        string[]
): Promise<TwitchRecommendation[]> {

    const normalizedLogins =
        [
            ...new Set(
                logins
                    .map(
                        login =>
                            login
                                .trim()
                                .toLowerCase()
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    if (
        normalizedLogins.length
        ===
        0
    ) {

        return [];

    }


    /* =====================================================
       USERS
    ====================================================== */

    const users =
        await getTwitchUsers(
            normalizedLogins
        );


    if (
        users.length
        ===
        0
    ) {

        return [];

    }


    /* =====================================================
       STREAMS
    ====================================================== */

    const streams =
        await getTwitchStreams(
            users.map(
                user =>
                    user.id
            )
        );


    const streamByUserId =
        new Map<
            string,
            TwitchStream
        >(
            streams.map(
                stream => [

                    stream.user_id,

                    stream

                ]
            )
        );


    /* =====================================================
       RESULT
    ====================================================== */

    return users.map(
        user => {

            const stream =
                streamByUserId.get(
                    user.id
                );


            return {

                login:
                    user.login,

                displayName:
                    user.display_name,

                avatar:
                    user.profile_image_url,

                url:
                    `https://www.twitch.tv/${user.login}`,

                status:
                    stream
                        ? "online"
                        : "offline",

                gameName:
                    stream?.game_name
                    ??
                    null,

                viewers:
                    stream?.viewer_count
                    ??
                    0,

                title:
                    stream?.title
                    ??
                    null

            };

        }
    );

}


/* =========================================================
   GET CLIPS
========================================================= */

export async function getTwitchClips(
    first:
        number =
            100
) {

    const user =
        await getTwitchUser();


    if (
        !user
    ) {

        throw new Error(
            "Twitch user not found."
        );

    }


    const limit =
        normalizeLimit(
            first,
            100
        );


    const url =
        new URL(
            "https://api.twitch.tv/helix/clips"
        );


    url.searchParams.set(
        "broadcaster_id",
        user.id
    );


    url.searchParams.set(
        "first",
        String(
            limit
        )
    );


    const response =
        await twitchFetch<TwitchClipsResponse>(
            url.toString()
        );


    return (
        response.data
        ??
        []
    ).map(
        clip => ({

            id:
                clip.id,

            url:
                clip.url,

            embedUrl:
                clip.embed_url,

            broadcasterId:
                clip.broadcaster_id,

            broadcasterName:
                clip.broadcaster_name,

            creatorId:
                clip.creator_id,

            creatorName:
                clip.creator_name,

            videoId:
                clip.video_id
                ||
                null,

            gameId:
                clip.game_id
                ||
                null,

            language:
                clip.language,

            title:
                clip.title,

            viewCount:
                clip.view_count,

            createdAt:
                clip.created_at,

            thumbnailUrl:
                clip.thumbnail_url,

            duration:
                clip.duration

        })
    );

}


/* =========================================================
   GET VIDEOS
========================================================= */

export async function getTwitchVideos(
    first:
        number =
            100
) {

    const user =
        await getTwitchUser();


    if (
        !user
    ) {

        throw new Error(
            "Twitch user not found."
        );

    }


    const limit =
        normalizeLimit(
            first,
            100
        );


    const url =
        new URL(
            "https://api.twitch.tv/helix/videos"
        );


    url.searchParams.set(
        "user_id",
        user.id
    );


    url.searchParams.set(
        "first",
        String(
            limit
        )
    );


    url.searchParams.set(
        "type",
        "all"
    );


    url.searchParams.set(
        "sort",
        "time"
    );


    const response =
        await twitchFetch<TwitchVideosResponse>(
            url.toString()
        );


    return (
        response.data
        ??
        []
    ).map(
        video => ({

            id:
                video.id,

            streamId:
                video.stream_id,

            userId:
                video.user_id,

            userLogin:
                video.user_login,

            userName:
                video.user_name,

            title:
                video.title,

            description:
                video.description,

            createdAt:
                video.created_at,

            publishedAt:
                video.published_at,

            url:
                video.url,

            thumbnailUrl:
                formatThumbnail(
                    video.thumbnail_url,
                    640,
                    360
                ),

            viewable:
                video.viewable,

            viewCount:
                video.view_count,

            language:
                video.language,

            type:
                video.type,

            duration:
                video.duration

        })
    );

}


/* =========================================================
   GET TWITCH GAMES
========================================================= */

/**
 * Récupère les informations Twitch de jeux
 * à partir de leurs twitch_game_id.
 *
 * Cette fonction est utilisée lorsqu'un jeu
 * existe déjà dans Supabase.
 */
export async function getTwitchGames(
    gameIds:
        string[]
): Promise<TwitchGameData[]> {

    const cleanIds =
        [
            ...new Set(
                gameIds
                    .map(
                        id =>
                            String(
                                id
                            ).trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    if (
        cleanIds.length
        ===
        0
    ) {

        return [];

    }


    /*
     * On conserve les résultats dans une Map afin de
     * pouvoir reconstruire le tableau final dans le
     * même ordre que les IDs demandés.
     */
    const gameById =
        new Map<
            string,
            TwitchGameData
        >();


    const missingIds:
        string[] =
            [];


    /* =====================================================
       MEMORY CACHE
    ====================================================== */

    for (
        const gameId
        of
        cleanIds
    ) {

        const cachedGame =
            getCachedValue(
                twitchGameByIdCache,
                gameId
            );


        if (
            cachedGame
        ) {

            gameById.set(
                gameId,
                cachedGame
            );


            continue;

        }


        missingIds.push(
            gameId
        );

    }


    /* =====================================================
       TWITCH API — ONLY MISSING IDS
    ====================================================== */

    if (
        missingIds.length
        >
        0
    ) {

        /*
         * Twitch accepte jusqu'à 100 jeux
         * dans cette requête.
         */
        const chunkSize =
            100;


        for (
            let index = 0;
            index < missingIds.length;
            index += chunkSize
        ) {

            const currentIds =
                missingIds.slice(
                    index,
                    index
                    +
                    chunkSize
                );


            const url =
                new URL(
                    "https://api.twitch.tv/helix/games"
                );


            for (
                const gameId
                of
                currentIds
            ) {

                url.searchParams.append(
                    "id",
                    gameId
                );

            }


            const response =
                await twitchFetch<TwitchGamesResponse>(
                    url.toString()
                );


            const currentGames =
                (
                    response.data
                    ??
                    []
                )
                    .map(
                        formatGame
                    )
                    .filter(
                        game =>
                            Boolean(
                                game.id
                            )
                            &&
                            Boolean(
                                game.name
                            )
                    );


            for (
                const game
                of
                currentGames
            ) {

                /*
                 * Cache serveur partagé entre les visiteurs
                 * tant que l'instance Render reste active.
                 */
                setCachedValue(
                    twitchGameByIdCache,
                    game.id,
                    game,
                    TWITCH_GAME_CACHE_TTL_MS
                );


                gameById.set(
                    game.id,
                    game
                );

            }

        }

    }


    /* =====================================================
       RESULT — ORIGINAL REQUEST ORDER
    ====================================================== */

    return cleanIds
        .map(
            gameId =>
                gameById.get(
                    gameId
                )
                ??
                null
        )
        .filter(
            (
                game
            ): game is TwitchGameData =>
                game !==
                null
        );

}


/* =========================================================
   GET ONE TWITCH GAME
========================================================= */

export async function getTwitchGameById(
    gameId:
        string
): Promise<TwitchGameData | null> {

    const id =
        gameId.trim();


    if (
        !id
    ) {

        return null;

    }


    const games =
        await getTwitchGames([
            id
        ]);


    return (
        games[0]
        ??
        null
    );

}


/* =========================================================
   SEARCH TWITCH GAMES
========================================================= */

/**
 * Recherche les catégories / jeux Twitch
 * à partir du NOM du jeu.
 *
 * Exemple :
 *
 * searchTwitchGames(
 *     "Party Animals"
 * );
 *
 * Twitch nous renvoie automatiquement :
 *
 * - l'identifiant Twitch
 * - le nom
 * - l'URL de la jaquette
 *
 * L'ID n'a donc jamais besoin d'être saisi
 * manuellement dans l'administration.
 */
export async function searchTwitchGames(
    query:
        string,

    first:
        number =
            20
): Promise<TwitchGameData[]> {

    /* =====================================================
       QUERY
    ====================================================== */

    const cleanQuery =
        query
            .trim();


    if (
        cleanQuery.length
        <
        2
    ) {

        return [];

    }


    /* =====================================================
       LIMIT
    ====================================================== */

    const limit =
        normalizeLimit(
            first,
            20
        );


    /* =====================================================
       MEMORY CACHE
    ====================================================== */

    const cacheKey =
        getTwitchGameSearchCacheKey(
            cleanQuery,
            limit
        );


    const cachedResults =
        getCachedValue(
            twitchGameSearchCache,
            cacheKey
        );


    if (
        cachedResults
    ) {

        return cachedResults;

    }


    /* =====================================================
       URL
    ====================================================== */

    const url =
        new URL(
            "https://api.twitch.tv/helix/search/categories"
        );


    url.searchParams.set(
        "query",
        cleanQuery
    );


    url.searchParams.set(
        "first",
        String(
            limit
        )
    );


    /* =====================================================
       REQUEST
    ====================================================== */

    const response =
        await twitchFetch<TwitchCategorySearchResponse>(
            url.toString()
        );


    /* =====================================================
       RESULT
    ====================================================== */

    const results =
        (
            response.data
            ??
            []
        )
            .map(
                formatGame
            )
            .filter(
                game =>
                    Boolean(
                        game.id
                    )
                    &&
                    Boolean(
                        game.name
                    )
            );


    /*
     * Cache 15 minutes.
     *
     * Le cache est mémoire uniquement :
     * un redémarrage de l'instance Render le vide,
     * ce qui est parfaitement acceptable ici.
     */
    setCachedValue(
        twitchGameSearchCache,
        cacheKey,
        results,
        TWITCH_GAME_SEARCH_CACHE_TTL_MS,
        TWITCH_SEARCH_CACHE_MAX_ENTRIES
    );


    /*
     * Les résultats d'une recherche nous donnent également
     * des jeux complets. On peut donc remplir en même temps
     * le cache par ID pour les futurs appels getTwitchGames().
     */
    for (
        const game
        of
        results
    ) {

        setCachedValue(
            twitchGameByIdCache,
            game.id,
            game,
            TWITCH_GAME_CACHE_TTL_MS
        );

    }


    return results;

}


/* =========================================================
   SEARCH FIRST TWITCH GAME
========================================================= */

export async function searchFirstTwitchGame(
    query:
        string
): Promise<TwitchGameData | null> {

    const results =
        await searchTwitchGames(
            query,
            10
        );


    return (
        results[0]
        ??
        null
    );

}