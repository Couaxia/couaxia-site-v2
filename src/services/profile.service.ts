import {
    supabase
} from "../lib/supabase";


/* =========================================================
   CONSTANTES
========================================================= */

const AVATAR_BUCKET =
    "avatars";


const OFFICIAL_AVATAR_FOLDER =
    "official";


const USER_AVATAR_FOLDER =
    "users";


const MAX_AVATAR_SIZE =
    2 * 1024 * 1024;


/* =========================================================
   TYPES — ROLE
========================================================= */

export type ProfileRole =
    | "user"
    | "moderator"
    | "admin";


/* =========================================================
   TYPES — PROFILE
========================================================= */

export interface Profile {

    id:
        string;

    username:
        string | null;

    display_name:
        string | null;

    avatar_url:
        string | null;

    bio:
        string | null;

    role:
        ProfileRole;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   TYPES — UPDATE PROFILE
========================================================= */

export interface UpdateProfilePayload {

    username?:
        string;

    display_name?:
        string | null;

    bio?:
        string | null;

}


/* =========================================================
   TYPES — OFFICIAL AVATAR
========================================================= */

export interface OfficialAvatar {

    name:
        string;

    path:
        string;

    url:
        string;

}


/* =========================================================
   PROFILE SELECT
========================================================= */

const PROFILE_SELECT = `
    id,
    username,
    display_name,
    avatar_url,
    bio,
    role,
    created_at,
    updated_at
`;


/* =========================================================
   GET CURRENT USER
========================================================= */

async function getCurrentUser() {

    const {
        data: {
            user
        },
        error
    } =
        await supabase.auth.getUser();


    if (
        error
    ) {

        console.error(
            "Erreur récupération utilisateur :",
            error
        );


        throw error;

    }


    return user;

}


/* =========================================================
   REQUIRE CURRENT USER
========================================================= */

async function requireCurrentUser() {

    const user =
        await getCurrentUser();


    if (
        !user
    ) {

        throw new Error(
            "Tu dois être connecté pour effectuer cette action."
        );

    }


    return user;

}


/* =========================================================
   NORMALIZE USERNAME
========================================================= */

function normalizeUsername(
    value:
        string
): string {

    return value
        .trim()
        .toLowerCase();

}


/* =========================================================
   VALIDATE USERNAME
========================================================= */

function validateUsername(
    value:
        string
): string {

    const username =
        normalizeUsername(
            value
        );


    if (
        username.length
        <
        3
    ) {

        throw new Error(
            "Le pseudo doit contenir au moins 3 caractères."
        );

    }


    if (
        username.length
        >
        30
    ) {

        throw new Error(
            "Le pseudo ne peut pas dépasser 30 caractères."
        );

    }


    if (
        !/^[a-z0-9_-]+$/.test(
            username
        )
    ) {

        throw new Error(
            "Le pseudo peut uniquement contenir des lettres, chiffres, tirets et underscores."
        );

    }


    return username;

}


/* =========================================================
   GET CURRENT PROFILE
========================================================= */

export async function getCurrentProfile():
    Promise<Profile | null> {

    const user =
        await getCurrentUser();


    if (
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
            .select(
                PROFILE_SELECT
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Erreur récupération profil :",
            error
        );


        throw error;

    }


    if (
        !data
    ) {

        return null;

    }


    return data as Profile;

}


/* =========================================================
   CHECK USERNAME AVAILABLE
========================================================= */

export async function checkUsernameAvailable(
    username:
        string,

    currentUserId?:
        string
): Promise<boolean> {

    const cleanUsername =
        validateUsername(
            username
        );


    let query =
        supabase
            .from(
                "profiles"
            )
            .select(
                "id"
            )
            .ilike(
                "username",
                cleanUsername
            )
            .limit(
                1
            );


    /*
     * Lorsque l'utilisateur modifie son propre pseudo,
     * sa propre ligne ne doit pas compter comme doublon.
     */

    if (
        currentUserId
    ) {

        query =
            query.neq(
                "id",
                currentUserId
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
            "Erreur vérification pseudo :",
            error
        );


        throw error;

    }


    return (
        data
        ??
        []
    ).length
    ===
    0;

}


/* =========================================================
   UPDATE MY PROFILE
========================================================= */

export async function updateMyProfile(
    payload:
        UpdateProfilePayload
): Promise<Profile> {

    const user =
        await requireCurrentUser();


    /*
     * IMPORTANT :
     *
     * On construit volontairement nous-mêmes
     * les données autorisées.
     *
     * Il n'y a PAS de :
     *
     * role
     * id
     * created_at
     *
     * dans l'objet envoyé à Supabase.
     */

    const updateData: {

        username?:
            string;

        display_name?:
            string | null;

        bio?:
            string | null;

        updated_at:
            string;

    } = {

        updated_at:
            new Date()
                .toISOString()

    };


    /* =====================================================
       USERNAME
    ====================================================== */

    if (
        payload.username
        !==
        undefined
    ) {

        const username =
            validateUsername(
                payload.username
            );


        const available =
            await checkUsernameAvailable(
                username,
                user.id
            );


        if (
            !available
        ) {

            throw new Error(
                "Ce pseudo est déjà utilisé."
            );

        }


        updateData.username =
            username;

    }


    /* =====================================================
       DISPLAY NAME
    ====================================================== */

    if (
        payload.display_name
        !==
        undefined
    ) {

        const displayName =
            payload.display_name
                ?.trim()
            ??
            null;


        if (
            displayName
            &&
            displayName.length
            >
            40
        ) {

            throw new Error(
                "Le nom affiché ne peut pas dépasser 40 caractères."
            );

        }


        updateData.display_name =
            displayName
            ||
            null;

    }


    /* =====================================================
       BIO
    ====================================================== */

    if (
        payload.bio
        !==
        undefined
    ) {

        const bio =
            payload.bio
                ?.trim()
            ??
            null;


        if (
            bio
            &&
            bio.length
            >
            500
        ) {

            throw new Error(
                "La bio ne peut pas dépasser 500 caractères."
            );

        }


        updateData.bio =
            bio
            ||
            null;

    }


    /* =====================================================
       UPDATE
    ====================================================== */

    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .update(
                updateData
            )
            .eq(
                "id",
                user.id
            )
            .select(
                PROFILE_SELECT
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur modification profil :",
            error
        );


        throw error;

    }


    return data as Profile;

}


/* =========================================================
   GET OFFICIAL AVATARS
========================================================= */

export async function getOfficialAvatars():
    Promise<OfficialAvatar[]> {

    const {
        data,
        error
    } =
        await supabase
            .storage
            .from(
                AVATAR_BUCKET
            )
            .list(
                OFFICIAL_AVATAR_FOLDER,
                {

                    limit:
                        100,

                    sortBy: {

                        column:
                            "name",

                        order:
                            "asc"

                    }

                }
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération avatars officiels :",
            error
        );


        throw error;

    }


    const allowedExtensions =
        [
            ".png",
            ".jpg",
            ".jpeg",
            ".webp"
        ];


    return (
        data
        ??
        []
    )
        .filter(
            file => {

                const fileName =
                    file.name
                        .toLowerCase();


                return allowedExtensions
                    .some(
                        extension =>
                            fileName.endsWith(
                                extension
                            )
                    );

            }
        )
        .map(
            file => {

                const path =
                    `${OFFICIAL_AVATAR_FOLDER}/${file.name}`;


                const {
                    data:
                        publicUrlData
                } =
                    supabase
                        .storage
                        .from(
                            AVATAR_BUCKET
                        )
                        .getPublicUrl(
                            path
                        );


                return {

                    name:
                        file.name
                            .replace(
                                /\.[^.]+$/,
                                ""
                            )
                            .replace(
                                /[-_]+/g,
                                " "
                            ),

                    path,

                    url:
                        publicUrlData
                            .publicUrl

                };

            }
        );

}


/* =========================================================
   CHECK OFFICIAL AVATAR
========================================================= */

async function isOfficialAvatar(
    avatarUrl:
        string
): Promise<boolean> {

    const officialAvatars =
        await getOfficialAvatars();


    return officialAvatars
        .some(
            avatar =>
                avatar.url
                ===
                avatarUrl
        );

}


/* =========================================================
   SELECT OFFICIAL AVATAR
========================================================= */

export async function selectOfficialAvatar(
    avatarUrl:
        string
): Promise<Profile> {

    const user =
        await requireCurrentUser();


    const official =
        await isOfficialAvatar(
            avatarUrl
        );


    if (
        !official
    ) {

        throw new Error(
            "Cet avatar officiel n'est pas valide."
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

                avatar_url:
                    avatarUrl,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                user.id
            )
            .select(
                PROFILE_SELECT
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur sélection avatar officiel :",
            error
        );


        throw error;

    }


    return data as Profile;

}


/* =========================================================
   VALIDATE AVATAR FILE
========================================================= */

function validateAvatarFile(
    file:
        File
) {

    const allowedTypes =
        [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "Ton avatar doit être au format PNG, JPG ou WebP."
        );

    }


    if (
        file.size
        >
        MAX_AVATAR_SIZE
    ) {

        throw new Error(
            "Ton avatar ne peut pas dépasser 2 Mo."
        );

    }

}


/* =========================================================
   GET FILE EXTENSION
========================================================= */

function getFileExtension(
    file:
        File
): string {

    switch (
        file.type
    ) {

        case "image/png":

            return "png";


        case "image/jpeg":

            return "jpg";


        case "image/webp":

            return "webp";


        default:

            throw new Error(
                "Format d'image non supporté."
            );

    }

}


/* =========================================================
   GET STORAGE PATH FROM PUBLIC URL
========================================================= */

function getStoragePathFromPublicUrl(
    url:
        string
): string | null {

    try {

        const marker =
            `/storage/v1/object/public/${AVATAR_BUCKET}/`;


        const markerIndex =
            url.indexOf(
                marker
            );


        if (
            markerIndex
            ===
            -1
        ) {

            return null;

        }


        const path =
            url.substring(
                markerIndex
                +
                marker.length
            );


        return decodeURIComponent(
            path
        );

    }
    catch {

        return null;

    }

}


/* =========================================================
   DELETE OLD CUSTOM AVATAR FILE
========================================================= */

async function deleteOldCustomAvatarFile(
    userId:
        string,
    avatarUrl:
        string | null
) {

    if (
        !avatarUrl
    ) {

        return;

    }


    const path =
        getStoragePathFromPublicUrl(
            avatarUrl
        );


    if (
        !path
    ) {

        return;

    }


    const userFolder =
        `${USER_AVATAR_FOLDER}/${userId}/`;


    /*
     * Très important :
     *
     * On ne supprime jamais un avatar officiel.
     * On supprime seulement un fichier appartenant
     * au dossier personnel de l'utilisateur.
     */

    if (
        !path.startsWith(
            userFolder
        )
    ) {

        return;

    }


    const {
        error
    } =
        await supabase
            .storage
            .from(
                AVATAR_BUCKET
            )
            .remove([
                path
            ]);


    if (
        error
    ) {

        console.warn(
            "Impossible de supprimer l'ancien avatar :",
            error
        );

    }

}


/* =========================================================
   UPLOAD MY AVATAR
========================================================= */

export async function uploadMyAvatar(
    file:
        File
): Promise<string> {

    const user =
        await requireCurrentUser();


    validateAvatarFile(
        file
    );


    const currentProfile =
        await getCurrentProfile();


    const extension =
        getFileExtension(
            file
        );


    const fileName =
        `avatar-${Date.now()}.${extension}`;


    const storagePath =
        `${USER_AVATAR_FOLDER}/${user.id}/${fileName}`;


    /* =====================================================
       UPLOAD
    ====================================================== */

    const {
        error:
            uploadError
    } =
        await supabase
            .storage
            .from(
                AVATAR_BUCKET
            )
            .upload(
                storagePath,
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
        uploadError
    ) {

        console.error(
            "Erreur upload avatar :",
            uploadError
        );


        throw uploadError;

    }


    /* =====================================================
       PUBLIC URL
    ====================================================== */

    const {
        data:
            publicUrlData
    } =
        supabase
            .storage
            .from(
                AVATAR_BUCKET
            )
            .getPublicUrl(
                storagePath
            );


    const avatarUrl =
        publicUrlData
            .publicUrl;


    /* =====================================================
       UPDATE PROFILE
    ====================================================== */

    const {
        error:
            profileError
    } =
        await supabase
            .from(
                "profiles"
            )
            .update({

                avatar_url:
                    avatarUrl,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                user.id
            );


    if (
        profileError
    ) {

        /*
         * Si l'UPDATE du profil échoue,
         * on retire le fichier fraîchement créé.
         */

        await supabase
            .storage
            .from(
                AVATAR_BUCKET
            )
            .remove([
                storagePath
            ]);


        console.error(
            "Erreur mise à jour avatar profil :",
            profileError
        );


        throw profileError;

    }


    /* =====================================================
       DELETE PREVIOUS CUSTOM FILE
    ====================================================== */

    await deleteOldCustomAvatarFile(
        user.id,
        currentProfile?.avatar_url
        ??
        null
    );


    return avatarUrl;

}


/* =========================================================
   DELETE MY AVATAR
========================================================= */

export async function deleteMyAvatar():
    Promise<Profile> {

    const user =
        await requireCurrentUser();


    const currentProfile =
        await getCurrentProfile();


    if (
        !currentProfile
    ) {

        throw new Error(
            "Profil introuvable."
        );

    }


    /*
     * Supprime le fichier seulement s'il s'agit
     * d'un avatar personnalisé appartenant
     * à l'utilisateur.
     *
     * Les avatars officiels restent évidemment
     * dans le Storage.
     */

    await deleteOldCustomAvatarFile(
        user.id,
        currentProfile.avatar_url
    );


    const {
        data,
        error
    } =
        await supabase
            .from(
                "profiles"
            )
            .update({

                avatar_url:
                    null,

                updated_at:
                    new Date()
                        .toISOString()

            })
            .eq(
                "id",
                user.id
            )
            .select(
                PROFILE_SELECT
            )
            .single();


    if (
        error
    ) {

        console.error(
            "Erreur suppression avatar profil :",
            error
        );


        throw error;

    }


    return data as Profile;

}


/* =========================================================
   PROFILE DISPLAY NAME
========================================================= */

export function getProfileDisplayName(
    profile:
        Profile | null | undefined
): string {

    if (
        !profile
    ) {

        return "POUP";

    }


    const displayName =
        profile.display_name
            ?.trim();


    if (
        displayName
    ) {

        return displayName;

    }


    const username =
        profile.username
            ?.trim();


    if (
        username
    ) {

        return username;

    }


    return "POUP";

}


/* =========================================================
   PROFILE AVATAR
========================================================= */

export function getProfileAvatar(
    profile:
        Profile | null | undefined
): string | null {

    const avatar =
        profile?.avatar_url
            ?.trim();


    return avatar
        ||
        null;

}


/* =========================================================
   PROFILE INITIAL
========================================================= */

export function getProfileInitial(
    profile:
        Profile | null | undefined
): string {

    const displayName =
        getProfileDisplayName(
            profile
        )
            .trim();


    if (
        !displayName
    ) {

        return "P";

    }


    return displayName
        .charAt(0)
        .toUpperCase();

}
export async function getProfileArtworkLikesCount(
    userId: string
): Promise<number> {

    const {
        count,
        error
    } =
        await supabase
            .from(
                "artwork_likes"
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
                "user_id",
                userId
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération likes artworks :",
            error
        );


        return 0;

    }


    return count ?? 0;

}

/* =========================================================
   PROFILE ROLE LABEL
========================================================= */

export function getProfileRoleLabel(
    profile:
        Profile | null | undefined
): string {

    switch (
        profile?.role
    ) {

        case "admin":

            return "ADMIN";


        case "moderator":

            return "MODÉRATEUR";


        default:

            return "POUP";

    }

}


/* =========================================================
   IS ADMIN
========================================================= */

export function isProfileAdmin(
    profile:
        Profile | null | undefined
): boolean {

    return (
        profile?.role
        ===
        "admin"
    );

}


/* =========================================================
   IS MODERATOR
========================================================= */

export function isProfileModerator(
    profile:
        Profile | null | undefined
): boolean {

    return (
        profile?.role
        ===
        "moderator"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

export async function logoutProfile():
    Promise<void> {

    const {
        error
    } =
        await supabase
            .auth
            .signOut();


    if (
        error
    ) {

        console.error(
            "Erreur déconnexion :",
            error
        );


        throw error;

    }

}