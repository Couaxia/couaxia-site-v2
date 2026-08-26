/* =========================================================
   TYPES
========================================================= */
/* =========================================================
   CONFIG TWITCH
========================================================= */
function getTwitchConfig() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const channel = process.env.TWITCH_CHANNEL ||
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
    /* -----------------------------------------------------
       USE CACHED TOKEN
    ----------------------------------------------------- */
    if (cachedAccessToken &&
        Date.now() <
            accessTokenExpiresAt) {
        return cachedAccessToken;
    }
    /* -----------------------------------------------------
       TOKEN REQUEST
    ----------------------------------------------------- */
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
    /* -----------------------------------------------------
       ERROR
    ----------------------------------------------------- */
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Unable to get Twitch access token: ${response.status} ${error}`);
    }
    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */
    const data = (await response.json());
    /* -----------------------------------------------------
       CACHE
    ----------------------------------------------------- */
    cachedAccessToken =
        data.access_token;
    accessTokenExpiresAt =
        Date.now() +
            Math.max(data.expires_in - 60, 0) * 1000;
    return data.access_token;
}
/* =========================================================
   TWITCH API REQUEST
========================================================= */
async function twitchFetch(url) {
    const { clientId } = getTwitchConfig();
    const accessToken = await getTwitchAccessToken();
    const response = await fetch(url, {
        headers: {
            "Client-Id": clientId,
            Authorization: `Bearer ${accessToken}`
        }
    });
    /* -----------------------------------------------------
       ERROR
    ----------------------------------------------------- */
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twitch API error: ${response.status} ${error}`);
    }
    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */
    const data = (await response.json());
    return data;
}
/* =========================================================
   GET TWITCH USER
========================================================= */
async function getTwitchUser() {
    const { channel } = getTwitchConfig();
    const url = new URL("https://api.twitch.tv/helix/users");
    url.searchParams.set("login", channel);
    const response = await twitchFetch(url.toString());
    return response.data[0] ??
        null;
}
/* =========================================================
   GET MULTIPLE TWITCH USERS
========================================================= */
async function getTwitchUsers(logins) {
    if (logins.length ===
        0) {
        return [];
    }
    const url = new URL("https://api.twitch.tv/helix/users");
    logins.forEach(login => {
        url.searchParams.append("login", login);
    });
    const response = await twitchFetch(url.toString());
    return response.data;
}
/* =========================================================
   GET MULTIPLE TWITCH STREAMS
========================================================= */
async function getTwitchStreams(userIds) {
    if (userIds.length ===
        0) {
        return [];
    }
    const url = new URL("https://api.twitch.tv/helix/streams");
    userIds.forEach(userId => {
        url.searchParams.append("user_id", userId);
    });
    const response = await twitchFetch(url.toString());
    return response.data;
}
/* =========================================================
   GET LIVE
========================================================= */
export async function getTwitchLive() {
    const { channel } = getTwitchConfig();
    /* -----------------------------------------------------
       USER
    ----------------------------------------------------- */
    const user = await getTwitchUser();
    if (!user) {
        throw new Error(`Twitch channel "${channel}" not found.`);
    }
    /* -----------------------------------------------------
       STREAM
    ----------------------------------------------------- */
    const url = new URL("https://api.twitch.tv/helix/streams");
    url.searchParams.set("user_id", user.id);
    const response = await twitchFetch(url.toString());
    const stream = response.data[0];
    /* =====================================================
       OFFLINE
    ===================================================== */
    if (!stream) {
        return {
            isLive: false,
            userId: user.id,
            login: user.login,
            displayName: user.display_name,
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
    ===================================================== */
    return {
        isLive: true,
        userId: user.id,
        login: user.login,
        displayName: user.display_name,
        profileImageUrl: user.profile_image_url,
        offlineImageUrl: user.offline_image_url,
        title: stream.title,
        gameId: stream.game_id,
        gameName: stream.game_name,
        viewers: stream.viewer_count,
        startedAt: stream.started_at,
        language: stream.language,
        thumbnailUrl: stream.thumbnail_url
            .replace("{width}", "1280")
            .replace("{height}", "720"),
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
    /* -----------------------------------------------------
       EMPTY
    ----------------------------------------------------- */
    if (logins.length ===
        0) {
        return [];
    }
    /* -----------------------------------------------------
       NORMALIZE
    ----------------------------------------------------- */
    const normalizedLogins = [
        ...new Set(logins
            .map(login => login
            .trim()
            .toLowerCase())
            .filter(Boolean))
    ];
    if (normalizedLogins.length ===
        0) {
        return [];
    }
    /* -----------------------------------------------------
       USERS
    ----------------------------------------------------- */
    const users = await getTwitchUsers(normalizedLogins);
    if (users.length ===
        0) {
        return [];
    }
    /* -----------------------------------------------------
       STREAMS
    ----------------------------------------------------- */
    const streams = await getTwitchStreams(users.map(user => user.id));
    /* -----------------------------------------------------
       MAP STREAM BY USER ID
    ----------------------------------------------------- */
    const streamByUserId = new Map(streams.map(stream => [
        stream.user_id,
        stream
    ]));
    /* -----------------------------------------------------
       RESULT
    ----------------------------------------------------- */
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
                ?? null,
            viewers: stream?.viewer_count
                ?? 0,
            title: stream?.title
                ?? null
        };
    });
}
/* =========================================================
   GET CLIPS
========================================================= */
export async function getTwitchClips(first = 100) {
    /* -----------------------------------------------------
       USER
    ----------------------------------------------------- */
    const user = await getTwitchUser();
    if (!user) {
        throw new Error("Twitch user not found.");
    }
    /* -----------------------------------------------------
       SAFE LIMIT

       Twitch accepte entre 1 et 100 clips par requête.
    ----------------------------------------------------- */
    const safeFirst = Math.min(Math.max(Math.floor(first), 1), 100);
    /* -----------------------------------------------------
       URL
    ----------------------------------------------------- */
    const url = new URL("https://api.twitch.tv/helix/clips");
    url.searchParams.set("broadcaster_id", user.id);
    url.searchParams.set("first", String(safeFirst));
    /* -----------------------------------------------------
       REQUEST
    ----------------------------------------------------- */
    const response = await twitchFetch(url.toString());
    /* -----------------------------------------------------
       NORMALIZE RESULT
    ----------------------------------------------------- */
    return response.data.map(clip => ({
        id: clip.id,
        title: clip.title,
        creatorName: clip.creator_name,
        url: clip.url,
        embedUrl: clip.embed_url,
        thumbnailUrl: clip.thumbnail_url,
        views: clip.view_count,
        createdAt: clip.created_at,
        duration: clip.duration,
        gameId: clip.game_id,
        videoId: clip.video_id
    }));
}
/* =========================================================
GET VIDEOS
========================================================= */
export async function getTwitchVideos(first = 100) {
    /* -----------------------------------------------------
       USER
    ----------------------------------------------------- */
    const user = await getTwitchUser();
    if (!user) {
        throw new Error("Twitch user not found.");
    }
    /* -----------------------------------------------------
       SAFE LIMIT
    ----------------------------------------------------- */
    const safeFirst = Math.min(Math.max(Math.floor(first), 1), 100);
    /* -----------------------------------------------------
       URL
    ----------------------------------------------------- */
    const url = new URL("https://api.twitch.tv/helix/videos");
    url.searchParams.set("user_id", user.id);
    url.searchParams.set("first", String(safeFirst));
    /*
     * archive = rediffusions de streams
     */
    url.searchParams.set("type", "archive");
    /* -----------------------------------------------------
       REQUEST
    ----------------------------------------------------- */
    const response = await twitchFetch(url.toString());
    /* -----------------------------------------------------
       NORMALIZE
    ----------------------------------------------------- */
    return response.data.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
        thumbnailUrl: video.thumbnail_url,
        views: video.view_count,
        createdAt: video.created_at,
        publishedAt: video.published_at,
        duration: video.duration,
        language: video.language,
        type: video.type
    }));
}
