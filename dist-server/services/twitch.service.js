/* =========================================================
   TYPES
========================================================= */
/* =========================================================
   CONFIG TWITCH
========================================================= */
function getTwitchConfig() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const channel = process.env.TWITCH_CHANNEL
        ||
            "couaxia";
    if (!clientId) {
        throw new Error("TWITCH_CLIENT_ID is missing.");
    }
    if (!clientSecret) {
        throw new Error("TWITCH_CLIENT_SECRET is missing.");
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
let cachedAccessToken = null;
let accessTokenExpiresAt = 0;
/* =========================================================
   GET APP ACCESS TOKEN
========================================================= */
async function getTwitchAccessToken() {
    const { clientId, clientSecret } = getTwitchConfig();
    /* =====================================================
       CACHE
    ====================================================== */
    if (cachedAccessToken
        &&
            Date.now()
                <
                    accessTokenExpiresAt) {
        return cachedAccessToken;
    }
    /* =====================================================
       TOKEN REQUEST
    ====================================================== */
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
    });
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Unable to get Twitch access token: ${response.status} ${error}`);
    }
    const data = (await response.json());
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
                Math.max(data.expires_in
                    -
                        60, 0)
                    *
                        1000;
    return data.access_token;
}
/* =========================================================
   TWITCH FETCH
========================================================= */
async function twitchFetch(url, retry = true) {
    const { clientId } = getTwitchConfig();
    const accessToken = await getTwitchAccessToken();
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Client-Id": clientId,
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
        }
    });
    /* =====================================================
       TOKEN EXPIRED / INVALID
    ====================================================== */
    if (response.status
        ===
            401
        &&
            retry) {
        cachedAccessToken =
            null;
        accessTokenExpiresAt =
            0;
        return twitchFetch(url, false);
    }
    /* =====================================================
       ERROR
    ====================================================== */
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twitch API error: ${response.status} ${error}`);
    }
    /* =====================================================
       JSON
    ====================================================== */
    return (await response.json());
}
/* =========================================================
   NORMALIZE LIMIT
========================================================= */
function normalizeLimit(value, fallback = 20) {
    if (!Number.isFinite(value)) {
        return fallback;
    }
    return Math.min(Math.max(Math.floor(value), 1), 100);
}
/* =========================================================
   FORMAT BOX ART
========================================================= */
export function formatTwitchBoxArt(value, width = 285, height = 380) {
    if (!value) {
        return null;
    }
    const url = value.trim();
    if (!url) {
        return null;
    }
    return url
        .replaceAll("{width}", String(width))
        .replaceAll("{height}", String(height))
        .replaceAll("%{width}", String(width))
        .replaceAll("%{height}", String(height));
}
/* =========================================================
   FORMAT THUMBNAIL
========================================================= */
function formatThumbnail(value, width = 1280, height = 720) {
    if (!value) {
        return null;
    }
    return value
        .replaceAll("{width}", String(width))
        .replaceAll("{height}", String(height))
        .replaceAll("%{width}", String(width))
        .replaceAll("%{height}", String(height));
}
/* =========================================================
   FORMAT GAME
========================================================= */
function formatGame(game) {
    const rawBoxArtUrl = game.box_art_url
        ?.trim()
        ||
            null;
    return {
        id: String(game.id
            ??
                "").trim(),
        name: String(game.name
            ??
                "").trim(),
        boxArtUrl: formatTwitchBoxArt(rawBoxArtUrl, 285, 380),
        rawBoxArtUrl
    };
}
/* =========================================================
   GET TWITCH USER
========================================================= */
async function getTwitchUser() {
    const { channel } = getTwitchConfig();
    const url = new URL("https://api.twitch.tv/helix/users");
    url.searchParams.set("login", channel);
    const response = await twitchFetch(url.toString());
    return (response.data[0]
        ??
            null);
}
/* =========================================================
   GET TWITCH USERS
========================================================= */
async function getTwitchUsers(logins) {
    const cleanLogins = [
        ...new Set(logins
            .map(login => login
            .trim()
            .toLowerCase())
            .filter(Boolean))
    ]
        .slice(0, 100);
    if (cleanLogins.length
        ===
            0) {
        return [];
    }
    const url = new URL("https://api.twitch.tv/helix/users");
    for (const login of cleanLogins) {
        url.searchParams.append("login", login);
    }
    const response = await twitchFetch(url.toString());
    return response.data
        ??
            [];
}
/* =========================================================
   GET TWITCH STREAMS
========================================================= */
async function getTwitchStreams(userIds) {
    const cleanIds = [
        ...new Set(userIds
            .map(id => id.trim())
            .filter(Boolean))
    ]
        .slice(0, 100);
    if (cleanIds.length
        ===
            0) {
        return [];
    }
    const url = new URL("https://api.twitch.tv/helix/streams");
    for (const userId of cleanIds) {
        url.searchParams.append("user_id", userId);
    }
    const response = await twitchFetch(url.toString());
    return response.data
        ??
            [];
}
/* =========================================================
   GET LIVE
========================================================= */
export async function getTwitchLive() {
    const { channel } = getTwitchConfig();
    const user = await getTwitchUser();
    if (!user) {
        throw new Error(`Twitch channel "${channel}" not found.`);
    }
    const url = new URL("https://api.twitch.tv/helix/streams");
    url.searchParams.set("user_id", user.id);
    const response = await twitchFetch(url.toString());
    const stream = response.data[0];
    /* =====================================================
       OFFLINE
    ====================================================== */
    if (!stream) {
        return {
            isLive: false,
            userId: user.id,
            login: user.login,
            displayName: user.display_name,
            description: user.description,
            profileImageUrl: user.profile_image_url,
            offlineImageUrl: user.offline_image_url,
            title: null,
            gameId: null,
            gameName: null,
            viewers: 0,
            startedAt: null,
            language: null,
            thumbnailUrl: null,
            isMature: false
        };
    }
    /* =====================================================
       ONLINE
    ====================================================== */
    return {
        isLive: true,
        userId: user.id,
        login: user.login,
        displayName: user.display_name,
        description: user.description,
        profileImageUrl: user.profile_image_url,
        offlineImageUrl: user.offline_image_url,
        title: stream.title,
        gameId: stream.game_id,
        gameName: stream.game_name,
        viewers: stream.viewer_count,
        startedAt: stream.started_at,
        language: stream.language,
        thumbnailUrl: formatThumbnail(stream.thumbnail_url, 1280, 720),
        isMature: stream.is_mature
    };
}
/* =========================================================
   GET FOLLOWERS
========================================================= */
export async function getTwitchFollowers() {
    const user = await getTwitchUser();
    if (!user) {
        throw new Error("Twitch user not found.");
    }
    const url = new URL("https://api.twitch.tv/helix/channels/followers");
    url.searchParams.set("broadcaster_id", user.id);
    url.searchParams.set("first", "1");
    const response = await twitchFetch(url.toString());
    return {
        followers: response.total
    };
}
/* =========================================================
   GET RECOMMENDATIONS
========================================================= */
export async function getTwitchRecommendations(logins) {
    const normalizedLogins = [
        ...new Set(logins
            .map(login => login
            .trim()
            .toLowerCase())
            .filter(Boolean))
    ];
    if (normalizedLogins.length
        ===
            0) {
        return [];
    }
    /* =====================================================
       USERS
    ====================================================== */
    const users = await getTwitchUsers(normalizedLogins);
    if (users.length
        ===
            0) {
        return [];
    }
    /* =====================================================
       STREAMS
    ====================================================== */
    const streams = await getTwitchStreams(users.map(user => user.id));
    const streamByUserId = new Map(streams.map(stream => [
        stream.user_id,
        stream
    ]));
    /* =====================================================
       RESULT
    ====================================================== */
    return users.map(user => {
        const stream = streamByUserId.get(user.id);
        return {
            login: user.login,
            displayName: user.display_name,
            avatar: user.profile_image_url,
            url: `https://www.twitch.tv/${user.login}`,
            status: stream
                ? "online"
                : "offline",
            gameName: stream?.game_name
                ??
                    null,
            viewers: stream?.viewer_count
                ??
                    0,
            title: stream?.title
                ??
                    null
        };
    });
}
/* =========================================================
   GET CLIPS
========================================================= */
export async function getTwitchClips(first = 100) {
    const user = await getTwitchUser();
    if (!user) {
        throw new Error("Twitch user not found.");
    }
    const limit = normalizeLimit(first, 100);
    const url = new URL("https://api.twitch.tv/helix/clips");
    url.searchParams.set("broadcaster_id", user.id);
    url.searchParams.set("first", String(limit));
    const response = await twitchFetch(url.toString());
    return (response.data
        ??
            []).map(clip => ({
        id: clip.id,
        url: clip.url,
        embedUrl: clip.embed_url,
        broadcasterId: clip.broadcaster_id,
        broadcasterName: clip.broadcaster_name,
        creatorId: clip.creator_id,
        creatorName: clip.creator_name,
        videoId: clip.video_id
            ||
                null,
        gameId: clip.game_id
            ||
                null,
        language: clip.language,
        title: clip.title,
        viewCount: clip.view_count,
        createdAt: clip.created_at,
        thumbnailUrl: clip.thumbnail_url,
        duration: clip.duration
    }));
}
/* =========================================================
   GET VIDEOS
========================================================= */
export async function getTwitchVideos(first = 100) {
    const user = await getTwitchUser();
    if (!user) {
        throw new Error("Twitch user not found.");
    }
    const limit = normalizeLimit(first, 100);
    const url = new URL("https://api.twitch.tv/helix/videos");
    url.searchParams.set("user_id", user.id);
    url.searchParams.set("first", String(limit));
    url.searchParams.set("type", "all");
    url.searchParams.set("sort", "time");
    const response = await twitchFetch(url.toString());
    return (response.data
        ??
            []).map(video => ({
        id: video.id,
        streamId: video.stream_id,
        userId: video.user_id,
        userLogin: video.user_login,
        userName: video.user_name,
        title: video.title,
        description: video.description,
        createdAt: video.created_at,
        publishedAt: video.published_at,
        url: video.url,
        thumbnailUrl: formatThumbnail(video.thumbnail_url, 640, 360),
        viewable: video.viewable,
        viewCount: video.view_count,
        language: video.language,
        type: video.type,
        duration: video.duration
    }));
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
export async function getTwitchGames(gameIds) {
    const cleanIds = [
        ...new Set(gameIds
            .map(id => String(id).trim())
            .filter(Boolean))
    ];
    if (cleanIds.length
        ===
            0) {
        return [];
    }
    const games = [];
    /*
     * Twitch accepte jusqu'à 100 jeux
     * dans cette requête.
     */
    const chunkSize = 100;
    for (let index = 0; index < cleanIds.length; index += chunkSize) {
        const currentIds = cleanIds.slice(index, index
            +
                chunkSize);
        const url = new URL("https://api.twitch.tv/helix/games");
        for (const gameId of currentIds) {
            url.searchParams.append("id", gameId);
        }
        const response = await twitchFetch(url.toString());
        const currentGames = (response.data
            ??
                [])
            .map(formatGame)
            .filter(game => Boolean(game.id)
            &&
                Boolean(game.name));
        games.push(...currentGames);
    }
    return games;
}
/* =========================================================
   GET ONE TWITCH GAME
========================================================= */
export async function getTwitchGameById(gameId) {
    const id = gameId.trim();
    if (!id) {
        return null;
    }
    const games = await getTwitchGames([
        id
    ]);
    return (games[0]
        ??
            null);
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
export async function searchTwitchGames(query, first = 20) {
    /* =====================================================
       QUERY
    ====================================================== */
    const cleanQuery = query
        .trim();
    if (cleanQuery.length
        <
            2) {
        return [];
    }
    /* =====================================================
       LIMIT
    ====================================================== */
    const limit = normalizeLimit(first, 20);
    /* =====================================================
       URL
    ====================================================== */
    const url = new URL("https://api.twitch.tv/helix/search/categories");
    url.searchParams.set("query", cleanQuery);
    url.searchParams.set("first", String(limit));
    /* =====================================================
       REQUEST
    ====================================================== */
    const response = await twitchFetch(url.toString());
    /* =====================================================
       RESULT
    ====================================================== */
    return (response.data
        ??
            [])
        .map(formatGame)
        .filter(game => Boolean(game.id)
        &&
            Boolean(game.name));
}
/* =========================================================
   SEARCH FIRST TWITCH GAME
========================================================= */
export async function searchFirstTwitchGame(query) {
    const results = await searchTwitchGames(query, 10);
    return (results[0]
        ??
            null);
}
