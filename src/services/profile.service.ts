import { supabase } from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export interface Profile {
  id: string;

  username: string;

  display_name: string | null;

  avatar_url: string | null;

  bio: string | null;

  created_at: string;

  updated_at: string;
}


export interface UpdateProfilePayload {
  username?: string;

  display_name?: string | null;

  avatar_url?: string | null;

  bio?: string | null;
}


/* =========================================================
   USERNAME RULES
========================================================= */

const USERNAME_MIN_LENGTH =
  3;

const USERNAME_MAX_LENGTH =
  30;

const DISPLAY_NAME_MAX_LENGTH =
  40;

const BIO_MAX_LENGTH =
  500;


/* =========================================================
   NORMALIZE USERNAME
========================================================= */

export function normalizeUsername(
  value: string
): string {

  return value
    .trim()
    .toLowerCase();

}


/* =========================================================
   VALIDATE USERNAME
========================================================= */

export function validateUsername(
  value: string
): {
  valid: boolean;
  message: string;
} {

  const username =
    normalizeUsername(
      value
    );


  if (!username) {

    return {
      valid: false,
      message:
        "Le pseudo est obligatoire."
    };

  }


  if (
    username.length
    <
    USERNAME_MIN_LENGTH
  ) {

    return {
      valid: false,
      message:
        `Le pseudo doit contenir au moins ${USERNAME_MIN_LENGTH} caractères.`
    };

  }


  if (
    username.length
    >
    USERNAME_MAX_LENGTH
  ) {

    return {
      valid: false,
      message:
        `Le pseudo ne peut pas dépasser ${USERNAME_MAX_LENGTH} caractères.`
    };

  }


  const usernameRegex =
    /^[a-z0-9_-]+$/;


  if (
    !usernameRegex.test(
      username
    )
  ) {

    return {
      valid: false,
      message:
        "Le pseudo peut uniquement contenir des lettres, chiffres, _ et -."
    };

  }


  return {
    valid: true,
    message: ""
  };

}

/* =========================================================
   AVATAR STORAGE
========================================================= */

const AVATAR_BUCKET =
  "avatars";

const MAX_AVATAR_SIZE =
  2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];


/* =========================================================
   VALIDATE AVATAR FILE
========================================================= */

export function validateAvatarFile(
  file: File
): {
  valid: boolean;
  message: string;
} {

  if (
    !ALLOWED_AVATAR_TYPES.includes(
      file.type
    )
  ) {
    return {
      valid: false,
      message:
        "Format non autorisé. Utilise une image PNG, JPG ou WebP."
    };
  }


  if (
    file.size >
    MAX_AVATAR_SIZE
  ) {
    return {
      valid: false,
      message:
        "L'image ne peut pas dépasser 2 Mo."
    };
  }


  return {
    valid: true,
    message: ""
  };
}


/* =========================================================
   UPLOAD MY AVATAR
========================================================= */

export async function uploadMyAvatar(
  file: File
): Promise<string> {

  const validation =
    validateAvatarFile(
      file
    );


  if (!validation.valid) {
    throw new Error(
      validation.message
    );
  }


  const user =
    await getCurrentUser();


  if (!user) {
    throw new Error(
      "Tu dois être connecté pour modifier ton avatar."
    );
  }


  let extension =
    "webp";


  if (
    file.type ===
    "image/png"
  ) {
    extension =
      "png";
  }


  if (
    file.type ===
    "image/jpeg"
  ) {
    extension =
      "jpg";
  }


  const filePath =
    `users/${user.id}/avatar.${extension}`;


  /*
   * Supprime d'abord les variantes existantes
   * pour éviter d'accumuler plusieurs avatars.
   */

  await supabase.storage
    .from(
      AVATAR_BUCKET
    )
    .remove([
      `users/${user.id}/avatar.webp`,
      `users/${user.id}/avatar.png`,
      `users/${user.id}/avatar.jpg`,
      `users/${user.id}/avatar.jpeg`
    ]);


  const {
    error: uploadError
  } =
    await supabase.storage
      .from(
        AVATAR_BUCKET
      )
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            true,

          contentType:
            file.type
        }
      );


  if (uploadError) {

    console.error(
      "Erreur upload avatar :",
      uploadError
    );

    throw uploadError;
  }


  const {
    data
  } =
    supabase.storage
      .from(
        AVATAR_BUCKET
      )
      .getPublicUrl(
        filePath
      );


  const publicUrl =
    data.publicUrl;


  await updateMyProfile({
    avatar_url:
      publicUrl
  });


  return publicUrl;
}


/* =========================================================
   DELETE MY AVATAR
========================================================= */

export async function deleteMyAvatar():
  Promise<void> {

  const user =
    await getCurrentUser();


  if (!user) {
    throw new Error(
      "Tu dois être connecté."
    );
  }


  const {
    data: files,
    error: listError
  } =
    await supabase.storage
      .from(
        AVATAR_BUCKET
      )
      .list(
        `users/${user.id}`
      );


  if (listError) {

    console.error(
      "Erreur lecture avatar :",
      listError
    );

    throw listError;
  }


  const paths =
    (
      files
      ??
      []
    ).map(
      file =>
        `users/${user.id}/${file.name}`
    );


  if (
    paths.length > 0
  ) {

    const {
      error
    } =
      await supabase.storage
        .from(
          AVATAR_BUCKET
        )
        .remove(
          paths
        );


    if (error) {
      throw error;
    }

  }


  await updateMyProfile({
    avatar_url:
      null
  });
}


/* =========================================================
   OFFICIAL AVATARS
========================================================= */

export interface OfficialAvatar {
  name: string;
  path: string;
  url: string;
}


export async function getOfficialAvatars():
  Promise<OfficialAvatar[]> {

  const {
    data,
    error
  } =
    await supabase.storage
      .from(
        AVATAR_BUCKET
      )
      .list(
        "official",
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


  if (error) {

    console.error(
      "Erreur récupération avatars officiels :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    []
  )
    .filter(
      file =>
        file.name
        &&
        !file.name.startsWith(
          "."
        )
    )
    .map(
      file => {

        const path =
          `official/${file.name}`;


        const {
          data: urlData
        } =
          supabase.storage
            .from(
              AVATAR_BUCKET
            )
            .getPublicUrl(
              path
            );


        return {
          name:
            file.name,

          path,

          url:
            urlData.publicUrl
        };

      }
    );
}


/* =========================================================
   SELECT OFFICIAL AVATAR
========================================================= */

export async function selectOfficialAvatar(
  avatarUrl: string
): Promise<Profile> {

  return updateMyProfile({
    avatar_url:
      avatarUrl
  });
}
/* =========================================================
   VALIDATE DISPLAY NAME
========================================================= */

export function validateDisplayName(
  value:
    string | null | undefined
): {
  valid: boolean;
  message: string;
} {

  if (
    value === null
    ||
    value === undefined
  ) {

    return {
      valid: true,
      message: ""
    };

  }


  const displayName =
    value.trim();


  if (
    displayName.length
    >
    DISPLAY_NAME_MAX_LENGTH
  ) {

    return {
      valid: false,
      message:
        `Le nom affiché ne peut pas dépasser ${DISPLAY_NAME_MAX_LENGTH} caractères.`
    };

  }


  return {
    valid: true,
    message: ""
  };

}


/* =========================================================
   VALIDATE BIO
========================================================= */

export function validateBio(
  value:
    string | null | undefined
): {
  valid: boolean;
  message: string;
} {

  if (
    value === null
    ||
    value === undefined
  ) {

    return {
      valid: true,
      message: ""
    };

  }


  if (
    value.length
    >
    BIO_MAX_LENGTH
  ) {

    return {
      valid: false,
      message:
        `La bio ne peut pas dépasser ${BIO_MAX_LENGTH} caractères.`
    };

  }


  return {
    valid: true,
    message: ""
  };

}


/* =========================================================
   GET CURRENT AUTH USER
========================================================= */

export async function getCurrentUser() {

  const {
    data,
    error
  } =
    await supabase.auth.getUser();


  if (error) {

    if (
      error.name
      ===
      "AuthSessionMissingError"
    ) {
      return null;
    }


    console.error(
      "Erreur récupération utilisateur :",
      error
    );

    throw error;
  }


  return (
    data.user
    ??
    null
  );

}


/* =========================================================
   GET CURRENT PROFILE
========================================================= */

export async function getCurrentProfile():
  Promise<Profile | null> {

  const user =
    await getCurrentUser();


  if (!user) {
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
      "Erreur récupération profil :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    null
  ) as Profile | null;

}


/* =========================================================
   GET PROFILE BY ID
========================================================= */

export async function getProfileById(
  profileId: string
): Promise<Profile | null> {

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
        created_at,
        updated_at
      `)
      .eq(
        "id",
        profileId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erreur récupération profil par ID :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    null
  ) as Profile | null;

}


/* =========================================================
   GET PROFILE BY USERNAME
========================================================= */

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {

  const normalizedUsername =
    normalizeUsername(
      username
    );


  if (!normalizedUsername) {
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
        created_at,
        updated_at
      `)
      .eq(
        "username",
        normalizedUsername
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erreur récupération profil par pseudo :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    null
  ) as Profile | null;

}


/* =========================================================
   CHECK USERNAME AVAILABLE
========================================================= */

export async function checkUsernameAvailable(
  username: string,
  ignoreUserId?: string
): Promise<boolean> {

  const validation =
    validateUsername(
      username
    );


  if (!validation.valid) {
    return false;
  }


  const normalizedUsername =
    normalizeUsername(
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
      .eq(
        "username",
        normalizedUsername
      );


  if (ignoreUserId) {

    query =
      query.neq(
        "id",
        ignoreUserId
      );

  }


  const {
    data,
    error
  } =
    await query
      .limit(1);


  if (error) {

    console.error(
      "Erreur vérification pseudo :",
      error
    );

    throw error;
  }


  return (
    data.length
    ===
    0
  );

}


/* =========================================================
   UPDATE MY PROFILE
========================================================= */

export async function updateMyProfile(
  payload:
    UpdateProfilePayload
): Promise<Profile> {

  const user =
    await getCurrentUser();


  if (!user) {

    throw new Error(
      "Tu dois être connecté pour modifier ton profil."
    );

  }


  const updates:
    Record<string, unknown> =
    {};


  /* =======================================================
     USERNAME
  ======================================================= */

  if (
    payload.username
    !==
    undefined
  ) {

    const validation =
      validateUsername(
        payload.username
      );


    if (!validation.valid) {

      throw new Error(
        validation.message
      );

    }


    const username =
      normalizeUsername(
        payload.username
      );


    const available =
      await checkUsernameAvailable(
        username,
        user.id
      );


    if (!available) {

      throw new Error(
        "Ce pseudo est déjà utilisé."
      );

    }


    updates.username =
      username;

  }


  /* =======================================================
     DISPLAY NAME
  ======================================================= */

  if (
    payload.display_name
    !==
    undefined
  ) {

    const validation =
      validateDisplayName(
        payload.display_name
      );


    if (!validation.valid) {

      throw new Error(
        validation.message
      );

    }


    updates.display_name =

      payload.display_name
      ===
      null

        ? null

        : payload.display_name.trim();

  }


  /* =======================================================
     AVATAR
  ======================================================= */

  if (
    payload.avatar_url
    !==
    undefined
  ) {

    updates.avatar_url =

      payload.avatar_url
      ===
      null

        ? null

        : payload.avatar_url.trim();

  }


  /* =======================================================
     BIO
  ======================================================= */

  if (
    payload.bio
    !==
    undefined
  ) {

    const validation =
      validateBio(
        payload.bio
      );


    if (!validation.valid) {

      throw new Error(
        validation.message
      );

    }


    updates.bio =

      payload.bio
      ===
      null

        ? null

        : payload.bio.trim();

  }


  /* =======================================================
     NOTHING TO UPDATE
  ======================================================= */

  if (
    Object.keys(
      updates
    ).length
    ===
    0
  ) {

    const currentProfile =
      await getCurrentProfile();


    if (!currentProfile) {

      throw new Error(
        "Profil introuvable."
      );

    }


    return currentProfile;

  }


  updates.updated_at =
    new Date()
      .toISOString();


  /* =======================================================
     UPDATE
  ======================================================= */

  const {
    data,
    error
  } =
    await supabase
      .from(
        "profiles"
      )
      .update(
        updates
      )
      .eq(
        "id",
        user.id
      )
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        bio,
        created_at,
        updated_at
      `)
      .single();


  if (error) {

    console.error(
      "Erreur modification profil :",
      error
    );


    /*
     * PostgreSQL :
     * 23505 = violation UNIQUE
     */

    if (
      error.code
      ===
      "23505"
    ) {

      throw new Error(
        "Ce pseudo est déjà utilisé."
      );

    }


    /*
     * PostgreSQL :
     * 23514 = violation CHECK
     */

    if (
      error.code
      ===
      "23514"
    ) {

      throw new Error(
        "Une des informations du profil n'est pas valide."
      );

    }


    throw error;
  }


  return data as Profile;

}


/* =========================================================
   UPDATE USERNAME
========================================================= */

export async function updateUsername(
  username: string
): Promise<Profile> {

  return updateMyProfile({
    username
  });

}


/* =========================================================
   UPDATE DISPLAY NAME
========================================================= */

export async function updateDisplayName(
  displayName:
    string | null
): Promise<Profile> {

  return updateMyProfile({
    display_name:
      displayName
  });

}


/* =========================================================
   UPDATE BIO
========================================================= */

export async function updateBio(
  bio:
    string | null
): Promise<Profile> {

  return updateMyProfile({
    bio
  });

}


/* =========================================================
   UPDATE AVATAR URL
========================================================= */

export async function updateAvatarUrl(
  avatarUrl:
    string | null
): Promise<Profile> {

  return updateMyProfile({
    avatar_url:
      avatarUrl
  });

}


/* =========================================================
   GET DISPLAY NAME
========================================================= */

export function getProfileDisplayName(
  profile:
    Profile | null
): string {

  if (!profile) {
    return "POUP";
  }


  if (
    profile.display_name
    &&
    profile.display_name.trim()
  ) {

    return profile
      .display_name
      .trim();

  }


  return profile.username;

}


/* =========================================================
   GET AVATAR
========================================================= */

export function getProfileAvatar(
  profile:
    Profile | null
): string | null {

  if (
    !profile?.avatar_url
  ) {
    return null;
  }


  const avatarUrl =
    profile.avatar_url.trim();


  return (
    avatarUrl
    ||
    null
  );

}


/* =========================================================
   GET INITIAL
========================================================= */

export function getProfileInitial(
  profile:
    Profile | null
): string {

  const displayName =
    getProfileDisplayName(
      profile
    );


  return (
    displayName
      .charAt(0)
      .toUpperCase()
    ||
    "P"
  );

}


/* =========================================================
   REFRESH PROFILE
========================================================= */

export async function refreshCurrentProfile():
  Promise<Profile | null> {

  /*
   * Rafraîchit d'abord
   * les informations Auth.
   */

  const {
    error
  } =
    await supabase.auth.refreshSession();


  if (
    error
    &&
    error.name
    !==
    "AuthSessionMissingError"
  ) {

    console.error(
      "Erreur rafraîchissement session :",
      error
    );

    throw error;
  }


  return getCurrentProfile();

}


/* =========================================================
   IS CURRENT USER
========================================================= */

export async function isCurrentUserProfile(
  profileId: string
): Promise<boolean> {

  const user =
    await getCurrentUser();


  if (!user) {
    return false;
  }


  return (
    user.id
    ===
    profileId
  );

}


/* =========================================================
   LOG OUT
========================================================= */

export async function logoutProfile():
  Promise<void> {

  const {
    error
  } =
    await supabase.auth.signOut();


  if (error) {

    console.error(
      "Erreur déconnexion :",
      error
    );

    throw error;
  }

}