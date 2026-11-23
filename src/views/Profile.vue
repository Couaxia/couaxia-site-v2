<script setup lang="ts">

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";

import "../assets/styles/pages/profile.css";

import {
  supabase
} from "../lib/supabase";

import {
  getMyPollSuggestions
} from "../services/poll.service";

import type {
  PollSuggestion
} from "../services/poll.service";

import {
  checkUsernameAvailable,
  getCurrentProfile,
  getOfficialAvatars,
  getProfileAvatar,
  getProfileDisplayName,
  getProfileInitial,
  getProfileArtworkLikesCount,
  logoutProfile,
  selectOfficialAvatar,
  updateMyProfile,
} from "../services/profile.service";
import type {
  OfficialAvatar,
  Profile
} from "../services/profile.service";

import { getMyFavoriteArtworks, removeMyFavoriteArtwork } from "../services/profile-favorites.service";
import type { FavoriteArtwork } from "../services/profile-favorites.service";

import { getMyCardCollection } from "../services/cards.service";
import type { CardCollection } from "../types/card.types";

import AppLoader
    from "../../src/components/ui/AppLoader.vue";

/* =========================================================
   STATE
========================================================= */

type ProfileTab = "overview" | "cards" | "favorites" | "suggestions" | "badges";

const activeProfileTab = ref<ProfileTab>("overview");

const profileTabs: { id: ProfileTab; label: string; icon: string }[] = [
  { id: "overview", label: "Aperçu", icon: "✨" },
  { id: "cards", label: "Mes cartes", icon: "🃏" },
  { id: "favorites", label: "Favoris", icon: "❤️" },
  { id: "suggestions", label: "Suggestions", icon: "💡" },
  { id: "badges", label: "Badges", icon: "🏅" }
];

const profile =
  ref<Profile | null>(
    null
  );

const artworkLikesCount = ref<number | null>(null);
const favoriteArtworks = ref<FavoriteArtwork[]>([]);
const loadingFavorites = ref(false);
const favoritesError = ref("");
const removingFavoriteIds = ref<Set<string>>(new Set());

async function loadFavorites() {
  if (!profile.value) return;
  loadingFavorites.value = true;
  favoritesError.value = "";
  try {
    favoriteArtworks.value = await getMyFavoriteArtworks(profile.value.id);
  } catch (error) {
    console.error("Erreur chargement favoris :", error);
    favoritesError.value = "Impossible de charger tes illustrations favorites.";
  } finally {
    loadingFavorites.value = false;
  }
}

async function removeFavorite(artworkId: string) {
  if (!profile.value || removingFavoriteIds.value.has(artworkId)) return;
  removingFavoriteIds.value = new Set([...removingFavoriteIds.value, artworkId]);
  favoritesError.value = "";
  try {
    await removeMyFavoriteArtwork(profile.value.id, artworkId);
    favoriteArtworks.value = favoriteArtworks.value.filter(art => art.id !== artworkId);
    artworkLikesCount.value = favoriteArtworks.value.length;
    successMessage.value = "Illustration retirée de tes favoris. 💜";
  } catch (error) {
    console.error("Erreur retrait favori :", error);
    favoritesError.value = "Impossible de retirer ce favori.";
  } finally {
    const next = new Set(removingFavoriteIds.value);
    next.delete(artworkId);
    removingFavoriteIds.value = next;
  }
}

const cardCollection = ref<CardCollection | null>(null);
const loadingProfileStats = ref(false);
const profileStatsError = ref("");

const collectionPreview = computed(() =>
  (cardCollection.value?.cards ?? [])
    .filter((entry) => entry.quantity > 0)
    .slice()
    .sort((a, b) => new Date(b.lastObtainedAt).getTime() - new Date(a.lastObtainedAt).getTime())
    .slice(0, 8)
);

async function loadProfileStats() {
  if (!profile.value) return;
  loadingProfileStats.value = true;
  profileStatsError.value = "";
  artworkLikesCount.value = null;
  cardCollection.value = null;

  const [likes, collection] = await Promise.allSettled([
    getProfileArtworkLikesCount(profile.value.id),
    getMyCardCollection()
  ]);

  if (likes.status === "fulfilled") {
    artworkLikesCount.value = likes.value;
  } else {
    console.error("Erreur statistiques des likes :", likes.reason);
    profileStatsError.value = "Certaines statistiques sont indisponibles.";
  }

  if (collection.status === "fulfilled") {
    cardCollection.value = collection.value;
  } else {
    console.error("Erreur collection du profil :", collection.reason);
    profileStatsError.value = "Certaines statistiques sont indisponibles.";
  }

  loadingProfileStats.value = false;
}

const officialAvatars =
  ref<OfficialAvatar[]>(
    []
  );


/* =========================================================
   POLL SUGGESTIONS
========================================================= */

const pollSuggestions =
  ref<PollSuggestion[]>(
    []
  );

const loadingPollSuggestions =
  ref(false);

const pollSuggestionsError =
  ref("");


let pollSuggestionsChannel:
  ReturnType<
    typeof supabase.channel
  >
  |
  null =
    null;


const loading =
  ref(true);

const saving =
  ref(false);

const checkingUsername =
  ref(false);

const loadingOfficialAvatars =
  ref(false);

const uploadingAvatar =
  ref(false);


const loggingOut =
  ref(false);

const editing =
  ref(false);

const errorMessage =
  ref("");

const successMessage =
  ref("");


/* =========================================================
   FORM
========================================================= */

const formUsername =
  ref("");

const formDisplayName =
  ref("");

const formBio =
  ref("");


/* =========================================================
   AVATAR
========================================================= */

const selectedOfficialAvatar =
  ref<string | null>(
    null
  );


/* =========================================================
   USERNAME STATE
========================================================= */

const usernameAvailable =
  ref<boolean | null>(
    null
  );

const usernameMessage =
  ref("");


/* =========================================================
   COMPUTED
========================================================= */

const hasProfile =
  computed(() =>
    Boolean(
      profile.value
    )
  );


const displayName =
  computed(() =>
    getProfileDisplayName(
      profile.value
    )
  );


const avatarUrl =
  computed(() =>
    getProfileAvatar(
      profile.value
    )
  );


const avatarInitial =
  computed(() =>
    getProfileInitial(
      profile.value
    )
  );


const bioLength =
  computed(() =>
    formBio.value.length
  );


const usernameChanged =
  computed(() => {

    if (!profile.value) {
      return false;
    }

    return (
      formUsername.value
        .trim()
        .toLowerCase()
      !==
      profile.value.username
    );

  });


const canSave =
  computed(() => {

    if (
      !profile.value
      ||
      saving.value
      ||
      uploadingAvatar.value
    ) {
      return false;
    }


    if (
      usernameChanged.value
      &&
      usernameAvailable.value
      ===
      false
    ) {
      return false;
    }


    return true;

  });


/* =========================================================
   FILL FORM
========================================================= */

function fillFormFromProfile() {

  if (!profile.value) {

    formUsername.value =
      "";

    formDisplayName.value =
      "";

    formBio.value =
      "";

    return;
  }


  formUsername.value =
    profile.value.username
    ??
    "";


  formDisplayName.value =
    profile.value.display_name
    ??
    "";


  formBio.value =
    profile.value.bio
    ??
    "";


  usernameAvailable.value =
    null;

  usernameMessage.value =
    "";

}


/* =========================================================
   SUGGESTION STATUS
========================================================= */

function getSuggestionStatusLabel(
  status:
    string
): string {

  switch (status) {

    case "approved":
      return "Approuvée";

    case "rejected":
      return "Refusée";

    default:
      return "En attente";
  }

}


function getSuggestionStatusIcon(
  status:
    string
): string {

  switch (status) {

    case "approved":
      return "✅";

    case "rejected":
      return "❌";

    default:
      return "⏳";
  }

}


function getSuggestionStatusMessage(
  status:
    string
): string {

  switch (status) {

    case "approved":
      return "Ta proposition a été acceptée par Couaxia.";

    case "rejected":
      return "Ta proposition n'a pas été retenue cette fois.";

    default:
      return "Ta proposition est en cours de validation.";
  }

}


/* =========================================================
   LOAD POLL SUGGESTIONS
========================================================= */

async function loadPollSuggestions() {

  if (!profile.value) {

    pollSuggestions.value =
      [];

    return;
  }


  loadingPollSuggestions.value =
    true;

  pollSuggestionsError.value =
    "";


  try {

    pollSuggestions.value =
      await getMyPollSuggestions();

  } catch (error) {

    console.error(
      "Erreur chargement suggestions du profil :",
      error
    );


    pollSuggestionsError.value =
      "Impossible de charger tes suggestions.";

    pollSuggestions.value =
      [];

  } finally {

    loadingPollSuggestions.value =
      false;
  }

}


/* =========================================================
   REALTIME POLL SUGGESTIONS
========================================================= */

function subscribeToPollSuggestions() {

  if (!profile.value) {
    return;
  }


  if (pollSuggestionsChannel) {

    void supabase.removeChannel(
      pollSuggestionsChannel
    );

    pollSuggestionsChannel =
      null;
  }


  pollSuggestionsChannel =
    supabase
      .channel(
        `profile-poll-suggestions-${profile.value.id}`
      )
      .on(
        "postgres_changes",
        {
          event:
            "*",

          schema:
            "public",

          table:
            "poll_suggestions",

          filter:
            `user_id=eq.${profile.value.id}`
        },
        () => {

          void loadPollSuggestions();
        }
      )
      .subscribe();

}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

  loading.value =
    true;

  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    profile.value =
      await getCurrentProfile();


    fillFormFromProfile();


    if (profile.value) {

      await Promise.all([
        loadOfficialAvatars(),
        loadPollSuggestions(),
        loadProfileStats(),
        loadFavorites()
      ]);


      subscribeToPollSuggestions();

    }


  } catch (error) {

    console.error(
      "Erreur chargement profil :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de charger ton profil.";

  } finally {

    loading.value =
      false;

  }

}


/* =========================================================
   LOAD OFFICIAL AVATARS
========================================================= */

async function loadOfficialAvatars() {

  loadingOfficialAvatars.value =
    true;


  try {

    officialAvatars.value =
      await getOfficialAvatars();


  } catch (error) {

    console.error(
      "Erreur chargement avatars officiels :",
      error
    );


    errorMessage.value =
      "Impossible de charger les avatars officiels.";

  } finally {

    loadingOfficialAvatars.value =
      false;

  }

}


/* =========================================================
   START EDIT
========================================================= */

function startEdit() {

  if (!profile.value) {
    return;
  }


  fillFormFromProfile();


  clearAvatarSelection();


  editing.value =
    true;


  errorMessage.value =
    "";

  successMessage.value =
    "";

}


/* =========================================================
   CANCEL EDIT
========================================================= */

function cancelEdit() {

  fillFormFromProfile();


  clearAvatarSelection();


  editing.value =
    false;


  errorMessage.value =
    "";

  successMessage.value =
    "";

}


/* =========================================================
   CHECK USERNAME
========================================================= */

async function checkUsername() {

  if (!profile.value) {
    return;
  }


  const username =
    formUsername.value
      .trim()
      .toLowerCase();


  usernameMessage.value =
    "";

  usernameAvailable.value =
    null;


  if (!username) {

    usernameAvailable.value =
      false;

    usernameMessage.value =
      "Le pseudo est obligatoire.";

    return;

  }


  if (
    username
    ===
    profile.value.username
  ) {

    usernameAvailable.value =
      true;

    usernameMessage.value =
      "C'est ton pseudo actuel.";

    return;

  }


  checkingUsername.value =
    true;


  try {

    const available =
      await checkUsernameAvailable(
        username,
        profile.value.id
      );


    usernameAvailable.value =
      available;


    usernameMessage.value =

      available

        ? "Ce pseudo est disponible. 💜"

        : "Ce pseudo est déjà utilisé.";


  } catch (error) {

    console.error(
      "Erreur vérification pseudo :",
      error
    );


    usernameAvailable.value =
      false;


    usernameMessage.value =
      "Impossible de vérifier le pseudo.";

  } finally {

    checkingUsername.value =
      false;

  }

}


/* =========================================================
   CLEAR AVATAR SELECTION
========================================================= */

function clearAvatarSelection() {
  selectedOfficialAvatar.value = null;
}


/* =========================================================
   SELECT OFFICIAL AVATAR
========================================================= */

async function chooseOfficialAvatar(
  avatar:
    OfficialAvatar
) {

  if (
    !profile.value
    ||
    uploadingAvatar.value
  ) {
    return;
  }


  uploadingAvatar.value =
    true;


  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    const updatedProfile =
      await selectOfficialAvatar(
        avatar.url
      );


    profile.value =
      updatedProfile;


    selectedOfficialAvatar.value =
      avatar.url;


    successMessage.value =
      "Ton avatar officiel a bien été sélectionné. 💜";


  } catch (error) {

    console.error(
      "Erreur sélection avatar officiel :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de sélectionner cet avatar.";

  } finally {

    uploadingAvatar.value =
      false;

  }

}



/* =========================================================
   SAVE PROFILE
========================================================= */

async function saveProfile() {

  if (
    !profile.value
    ||
    saving.value
  ) {
    return;
  }


  saving.value =
    true;


  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    if (
      usernameChanged.value
    ) {

      const available =
        await checkUsernameAvailable(
          formUsername.value,
          profile.value.id
        );


      if (!available) {

        usernameAvailable.value =
          false;


        usernameMessage.value =
          "Ce pseudo est déjà utilisé.";


        throw new Error(
          "Ce pseudo est déjà utilisé."
        );

      }


      usernameAvailable.value =
        true;

    }


    const updatedProfile =
      await updateMyProfile({

        username:
          formUsername.value,

        display_name:
          formDisplayName.value
            .trim()
          ||
          null,

        bio:
          formBio.value
            .trim()
          ||
          null

      });


    profile.value =
      updatedProfile;

    clearAvatarSelection();


    fillFormFromProfile();


    editing.value =
      false;


    successMessage.value =
      "Ton profil POUP a bien été mis à jour. 💜";


  } catch (error) {

    console.error(
      "Erreur modification profil :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de modifier ton profil.";

  } finally {

    saving.value =
      false;

  }

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

  if (
    loggingOut.value
  ) {
    return;
  }


  loggingOut.value =
    true;


  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    await logoutProfile();


    profile.value =
      null;


    pollSuggestions.value =
      [];
    artworkLikesCount.value = null;
    cardCollection.value = null;
    favoriteArtworks.value = [];

    if (pollSuggestionsChannel) {

      void supabase.removeChannel(
        pollSuggestionsChannel
      );

      pollSuggestionsChannel =
        null;
    }


    editing.value =
      false;


    clearAvatarSelection();


    successMessage.value =
      "Tu es maintenant déconnecté(e).";


  } catch (error) {

    console.error(
      "Erreur déconnexion :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de te déconnecter.";

  } finally {

    loggingOut.value =
      false;

  }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value:
    string
) {

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


  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:
        "long"
    }
  ).format(
    date
  );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
  loadProfile
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
  () => {

    if (pollSuggestionsChannel) {

      void supabase.removeChannel(
        pollSuggestionsChannel
      );

      pollSuggestionsChannel =
        null;
    }

  }
);

</script>


<template>

  <main
    class="profile-page"
  >

    <!-- =====================================================
         HERO
    ====================================================== -->

    <section
      class="profile-hero"
    >

      <div
        class="
          profile-hero__glow
          profile-hero__glow--one
        "
        aria-hidden="true"
      ></div>


      <div
        class="
          profile-hero__glow
          profile-hero__glow--two
        "
        aria-hidden="true"
      ></div>


      <header
        class="profile-hero__header"
      >

        <span
          class="profile-hero__eyebrow"
        >
          🐙 COMPTE POUP
        </span>


        <h1
          class="profile-hero__title"
        >
          Mon

          <span>
            profil
          </span>
        </h1>


        <p
          class="profile-hero__description"
        >
          Personnalise ton identité POUP,
          ton pseudo, ton nom affiché,
          ton avatar et ta bio.
        </p>

      </header>

    </section>


    <!-- =====================================================
         CONTENT
    ====================================================== -->

    <section
      class="profile-section"
    >

      <!-- ===================================================
           LOADING
      ==================================================== -->

      <AppLoader
          v-if="loading"
          text="Chargement de ton profil..."
          size="large"
      />


      <!-- ===================================================
           NOT LOGGED IN
      ==================================================== -->

      <div
        v-else-if="
          !hasProfile
        "
        class="profile-state"
      >

        <span
          class="profile-state__icon"
          aria-hidden="true"
        >
          🔐
        </span>


        <strong>
          Aucun compte POUP connecté
        </strong>


        <p>
          Connecte-toi pour accéder
          à ton profil et participer
          aux sondages.
        </p>

      </div>


      <!-- ===================================================
           PROFILE
      ==================================================== -->

      <template
        v-else-if="profile"
      >

        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
          v-if="successMessage"
          class="
            profile-message
            profile-message--success
          "
        >

          <span
            aria-hidden="true"
          >
            ✓
          </span>


          <span>
            {{ successMessage }}
          </span>

        </div>


        <div
          v-if="errorMessage"
          class="
            profile-message
            profile-message--error
          "
        >

          <span
            aria-hidden="true"
          >
            ⚠️
          </span>


          <span>
            {{ errorMessage }}
          </span>

        </div>


        <!-- =================================================
             VIEW MODE
        ================================================== -->

        <div
          v-if="!editing"
          class="profile-card"
        >

          <!-- AVATAR -->

          <div
            class="profile-card__avatar-wrapper"
          >

            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="profile-card__avatar"
            >


            <div
              v-else
              class="
                profile-card__avatar
                profile-card__avatar--fallback
              "
              aria-hidden="true"
            >
              {{ avatarInitial }}
            </div>

          </div>


          <!-- CONTENT -->

          <div
            class="profile-card__content"
          >

            <span
              class="profile-card__eyebrow"
            >
              POUP
            </span>


            <h2
              class="profile-card__display-name"
            >
              {{ displayName }}
            </h2>


            <p
              class="profile-card__username"
            >
              @{{ profile.username }}
            </p>


            <p
              v-if="profile.bio"
              class="profile-card__bio"
            >
              {{ profile.bio }}
            </p>


            <p
              v-else
              class="
                profile-card__bio
                profile-card__bio--empty
              "
            >
              Aucune bio pour le moment.
            </p>


            <div
              class="profile-card__meta"
            >

              <span>
                🗓️ POUP depuis
                {{
                  formatDate(
                    profile.created_at
                  )
                }}
              </span>

            </div>


            <div
              class="profile-card__actions"
            >

              <button
                type="button"
                class="
                  profile-button
                  profile-button--primary
                "
                @click="startEdit"
              >
                ✏️ Modifier mon profil
              </button>


              <button
                type="button"
                class="
                  profile-button
                  profile-button--secondary
                "
                :disabled="loggingOut"
                @click="logout"
              >
                {{
                  loggingOut
                    ? "Déconnexion..."
                    : "Se déconnecter"
                }}
              </button>

            </div>

          </div>

        </div>


        <!-- =================================================
             EDIT MODE
        ================================================== -->

        <form
          v-else
          class="profile-form"
          @submit.prevent="saveProfile"
        >

          <!-- HEADER -->

          <header
            class="profile-form__header"
          >

            <span
              class="profile-form__eyebrow"
            >
              ✏️ MODIFICATION
            </span>


            <h2>
              Modifier mon profil
            </h2>


            <p>
              Modifie les informations
              visibles sur ton profil POUP.
            </p>

          </header>


          <!-- =================================================
               USERNAME
          ================================================== -->

          <div
            class="profile-field"
          >

            <label
              for="profile-username"
            >
              Pseudo POUP
            </label>


            <div
              class="profile-field__input-row"
            >

              <input
                id="profile-username"
                v-model="formUsername"
                type="text"
                maxlength="30"
                autocomplete="username"
                placeholder="Ton pseudo"
                @blur="checkUsername"
              >


              <button
                type="button"
                class="
                  profile-field__check-button
                "
                :disabled="checkingUsername"
                @click="checkUsername"
              >
                {{
                  checkingUsername
                    ? "..."
                    : "Vérifier"
                }}
              </button>

            </div>


            <p
              v-if="usernameMessage"
              class="profile-field__message"
              :class="{
                'profile-field__message--success':
                  usernameAvailable === true,

                'profile-field__message--error':
                  usernameAvailable === false
              }"
            >
              {{ usernameMessage }}
            </p>


            <small>
              3 à 30 caractères.
              Lettres, chiffres, tirets
              et underscores uniquement.
            </small>

          </div>


          <!-- =================================================
               DISPLAY NAME
          ================================================== -->

          <div
            class="profile-field"
          >

            <label
              for="profile-display-name"
            >
              Nom affiché
            </label>


            <input
              id="profile-display-name"
              v-model="formDisplayName"
              type="text"
              maxlength="40"
              placeholder="Nom affiché"
            >


            <small>
              Jusqu'à 40 caractères.
            </small>

          </div>


          <!-- =================================================
               OFFICIAL AVATARS
          ================================================== -->

          <div
            class="profile-field"
          >

            <label>
              Avatars officiels
            </label>


            <p
              class="profile-avatar-section__description"
            >
              Choisis un avatar parmi
              les illustrations officielles.
            </p>


            <div
              v-if="
                loadingOfficialAvatars
              "
              class="profile-avatar-loading"
            >
              Chargement des avatars...
            </div>


            <div
              v-else-if="
                officialAvatars.length
              "
              class="profile-avatar-grid"
            >

              <button
                v-for="
                  avatar
                  in
                  officialAvatars
                "
                :key="
                  avatar.path
                "
                type="button"
                class="profile-avatar-option"
                :class="{
                  'profile-avatar-option--selected':
                    profile.avatar_url
                    ===
                    avatar.url
                }"
                :disabled="uploadingAvatar"
                @click="
                  chooseOfficialAvatar(
                    avatar
                  )
                "
              >

                <img
                  :src="avatar.url"
                  :alt="avatar.name"
                >


                <span
                  v-if="
                    profile.avatar_url
                    ===
                    avatar.url
                  "
                  class="
                    profile-avatar-option__check
                  "
                  aria-hidden="true"
                >
                  ✓
                </span>

              </button>

            </div>


            <p
              v-else
              class="profile-avatar-empty"
            >
              Aucun avatar officiel disponible.
            </p>

          </div>

          <!-- =================================================
               BIO
          ================================================== -->

          <div
            class="profile-field"
          >

            <div
              class="
                profile-field__label-row
              "
            >

              <label
                for="profile-bio"
              >
                Bio
              </label>


              <span>
                {{ bioLength }}/500
              </span>

            </div>


            <textarea
              id="profile-bio"
              v-model="formBio"
              maxlength="500"
              rows="6"
              placeholder="
                Présente-toi en quelques mots...
              "
            ></textarea>

          </div>


          <!-- =================================================
               FORM ACTIONS
          ================================================== -->

          <div
            class="profile-form__actions"
          >

            <button
              type="button"
              class="
                profile-button
                profile-button--secondary
              "
              :disabled="
                saving
              "
              @click="
                cancelEdit
              "
            >
              Annuler
            </button>


            <button
              type="submit"
              class="
                profile-button
                profile-button--primary
              "
              :disabled="
                !canSave
              "
            >
              {{
                saving
                  ? "Enregistrement..."
                  : "Enregistrer"
              }}
            </button>

          </div>

        </form>
        <!-- =================================================
             NAVIGATION DU PROFIL
        ================================================== -->
        <nav class="profile-tabs" aria-label="Rubriques de mon profil">
          <button
            v-for="tab in profileTabs"
            :key="tab.id"
            type="button"
            class="profile-tabs__button"
            :class="{ 'profile-tabs__button--active': activeProfileTab === tab.id }"
            :aria-current="activeProfileTab === tab.id ? 'page' : undefined"
            @click="activeProfileTab = tab.id"
          >
            <span aria-hidden="true">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>



        <!-- =================================================
             STATISTIQUES ET COLLECTION
        ================================================== -->
        <section v-if="activeProfileTab === 'overview' || activeProfileTab === 'cards'" class="profile-collection" aria-labelledby="profile-collection-title">
          <header class="profile-collection__header">
            <div>
              <span class="profile-collection__eyebrow">💜 MON UNIVERS</span>
              <h2 id="profile-collection-title">{{ activeProfileTab === "overview" ? "Mon univers en chiffres" : "Ma collection de cartes" }}</h2>
              <p>{{ activeProfileTab === "overview" ? "Retrouve tes statistiques personnelles." : "Découvre tes cartes, leurs raretés et tes doublons." }}</p>
            </div>
            <button type="button" class="profile-collection__refresh" :disabled="loadingProfileStats" @click="loadProfileStats">
              {{ loadingProfileStats ? "Actualisation..." : "↻ Actualiser" }}
            </button>
          </header>

          <div v-if="activeProfileTab === 'overview'" class="profile-collection__stats">
            <div class="profile-collection__stat">
              <span aria-hidden="true">❤️</span>
              <strong>{{ artworkLikesCount === null ? "—" : artworkLikesCount }}</strong>
              <span>Illustrations aimées</span>
            </div>
            <div class="profile-collection__stat">
              <span aria-hidden="true">🃏</span>
              <strong>{{ cardCollection?.stats.uniqueCards ?? (loadingProfileStats ? "—" : 0) }}</strong>
              <span>Cartes différentes</span>
            </div>
            <div class="profile-collection__stat">
              <span aria-hidden="true">✨</span>
              <strong>{{ cardCollection?.stats.totalCopies ?? (loadingProfileStats ? "—" : 0) }}</strong>
              <span>Exemplaires obtenus</span>
            </div>
          </div>

          <p v-if="profileStatsError" class="profile-collection__error" role="alert">⚠️ {{ profileStatsError }}</p>

          <div v-if="activeProfileTab === 'cards'" class="profile-collection__subheading">
            <h3>Ma collection de cartes</h3>
            <span v-if="cardCollection">{{ cardCollection.stats.completion }} % complétée</span>
          </div>
          <p v-if="activeProfileTab === 'cards' && loadingProfileStats" class="profile-collection__empty">🐙 Chargement de ta collection...</p>
          <div v-else-if="activeProfileTab === 'cards' && collectionPreview.length" class="profile-collection__grid">
            <article v-for="entry in collectionPreview" :key="entry.id" class="profile-collection__card">
              <div class="profile-collection__image" :class="'profile-collection__image--' + entry.card.orientation">
                <img :src="entry.card.imageUrl" :alt="entry.card.name" loading="lazy" />
                <span v-if="entry.quantity > 1" class="profile-collection__quantity">×{{ entry.quantity }}</span>
              </div>
              <strong>{{ entry.card.name }}</strong>
              <small>{{ entry.card.rarity }} · N°{{ entry.card.number }}</small>
            </article>
          </div>
          <p v-else-if="activeProfileTab === 'cards' && cardCollection" class="profile-collection__empty">Tu n'as pas encore obtenu de cartes. 🐙</p>
          <p v-else-if="activeProfileTab === 'cards'" class="profile-collection__empty">Ta collection n'est pas disponible pour le moment.</p>
        </section>

        <!-- =================================================
             POLL SUGGESTIONS
        ================================================== -->

        <section
          v-if="activeProfileTab === 'suggestions'"
          class="profile-suggestions"
          aria-labelledby="profile-suggestions-title"
        >

          <header
            class="profile-suggestions__header"
          >

            <div>

              <span
                class="profile-suggestions__eyebrow"
              >
                💡 MES IDÉES
              </span>


              <h2
                id="profile-suggestions-title"
              >
                Mes suggestions
              </h2>


              <p>
                Retrouve ici la réponse à tes propositions de sondage.
              </p>

            </div>


            <strong
              class="profile-suggestions__count"
            >
              {{ pollSuggestions.length }}
            </strong>

          </header>


          <div
            v-if="loadingPollSuggestions"
            class="profile-suggestions__state"
          >
            🐙 Chargement de tes suggestions...
          </div>


          <div
            v-else-if="pollSuggestionsError"
            class="
              profile-suggestions__state
              profile-suggestions__state--error
            "
          >
            ⚠️ {{ pollSuggestionsError }}
          </div>


          <div
            v-else-if="
              pollSuggestions.length === 0
            "
            class="profile-suggestions__empty"
          >

            <span
              aria-hidden="true"
            >
              💡
            </span>


            <strong>
              Aucune suggestion pour le moment
            </strong>


            <p>
              Quand tu proposeras un sondage,
              son statut apparaîtra ici.
            </p>

          </div>


          <div
            v-else
            class="profile-suggestions__list"
          >

            <article
              v-for="
                suggestion
                in
                pollSuggestions
              "
              :key="
                suggestion.id
              "
              class="profile-suggestion-card"
            >

              <div
                class="profile-suggestion-card__top"
              >

                <span
                  class="profile-suggestion-card__category"
                >
                  {{
                    suggestion.category
                    ||
                    "Autre"
                  }}
                </span>


                <span
                  class="profile-suggestion-card__status"
                  :class="
                    `profile-suggestion-card__status--${suggestion.status}`
                  "
                >
                  {{
                    getSuggestionStatusIcon(
                      suggestion.status
                    )
                  }}

                  {{
                    getSuggestionStatusLabel(
                      suggestion.status
                    )
                  }}
                </span>

              </div>


              <h3>
                {{
                  suggestion.question
                  ||
                  "Suggestion sans titre"
                }}
              </h3>


              <p
                v-if="
                  suggestion.description
                "
                class="profile-suggestion-card__description"
              >
                {{ suggestion.description }}
              </p>


              <div
                class="profile-suggestion-card__response"
              >
                {{
                  getSuggestionStatusMessage(
                    suggestion.status
                  )
                }}
              </div>


              <time
                :datetime="
                  suggestion.created_at
                "
              >
                Proposée le
                {{
                  formatDate(
                    suggestion.created_at
                  )
                }}
              </time>

            </article>

          </div>

        </section>

        <section v-if="activeProfileTab === 'favorites'" class="profile-favorites" aria-labelledby="profile-favorites-title">
          <header class="profile-favorites__header">
            <div>
              <span class="profile-favorites__eyebrow">❤️ MES COUPS DE CŒUR</span>
              <h2 id="profile-favorites-title">Mes illustrations favorites</h2>
              <p>Retrouve les créations que tu as aimées dans la galerie Couaxia.</p>
            </div>
            <button type="button" class="profile-button profile-button--secondary" :disabled="loadingFavorites" @click="loadFavorites">
              {{ loadingFavorites ? "Chargement..." : "↻ Actualiser" }}
            </button>
          </header>
          <p v-if="favoritesError" class="profile-message profile-message--error" role="alert">{{ favoritesError }}</p>
          <p v-if="loadingFavorites" class="profile-favorites__empty">🐙 Chargement de tes favoris...</p>
          <div v-else-if="favoriteArtworks.length" class="profile-favorites__grid">
            <article v-for="artwork in favoriteArtworks" :key="artwork.id" class="profile-favorites__card">
              <div class="profile-favorites__media">
                <img v-if="artwork.mediaType !== 'video'" :src="artwork.imageUrl" :alt="artwork.title" loading="lazy" />
                <video v-else :src="artwork.imageUrl" controls preload="metadata" :aria-label="artwork.title"></video>
              </div>
              <div class="profile-favorites__info">
                <strong>{{ artwork.title }}</strong>
                <span>🎨 {{ artwork.artistName }}</span>
                <button type="button" class="profile-favorites__remove" :disabled="removingFavoriteIds.has(artwork.id)" :aria-label="`Retirer ${artwork.title} des favoris`" @click="removeFavorite(artwork.id)">
                  {{ removingFavoriteIds.has(artwork.id) ? "Retrait..." : "♥ Retirer des favoris" }}
                </button>
              </div>
            </article>
          </div>
          <p v-else class="profile-favorites__empty">Tu n'as pas encore d'illustrations favorites. 💜</p>
        </section>

        <section
          v-if="activeProfileTab === 'badges'"
          class="profile-coming-soon"
          aria-labelledby="profile-badges-title"
        >
          <span class="profile-coming-soon__icon" aria-hidden="true">🏅</span>
          <h2 id="profile-badges-title">Mes badges et succès</h2>
          <p>
            Les badges de l'équipage POUP arriveront bientôt.
            Tu pourras suivre tes défis et les récompenses débloquées ici.
          </p>
        </section>

      </template>

    </section>

  </main>

</template>

<style scoped>

.profile-collection { margin-top:34px; padding:clamp(22px,4vw,34px); border:1px solid rgba(109,0,163,.34); border-radius:26px; background:rgba(22,5,38,.72); }
:global(html[data-theme="light"]) .profile-collection { background:rgba(255,255,255,.82); border-color:rgba(109,0,163,.18); }
.profile-collection__header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:22px; }
.profile-collection__eyebrow { color:#22f2ef; font-size:.76rem; font-weight:900; letter-spacing:.15em; }
.profile-collection__header h2 { margin:8px 0; color:var(--text-primary,#fff); font-size:clamp(1.5rem,3vw,2.1rem); }
.profile-collection__header p { margin:0; color:var(--text-secondary,#b7a9c6); }
.profile-collection__refresh { padding:10px 14px; border:1px solid rgba(215,153,255,.35); border-radius:12px; background:rgba(109,0,163,.15); color:var(--text-primary,#fff); cursor:pointer; }
.profile-collection__refresh:disabled { opacity:.6; cursor:wait; }
.profile-collection__stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
.profile-collection__stat { display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 8px; border:1px solid rgba(215,153,255,.2); border-radius:17px; background:rgba(109,0,163,.12); text-align:center; }
.profile-collection__stat > span:first-child { font-size:1.5rem; }
.profile-collection__stat strong { font-size:1.9rem; color:var(--text-primary,#fff); }
.profile-collection__stat > span:last-child { font-size:.82rem; color:var(--text-secondary,#b7a9c6); }
.profile-collection__subheading { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin:30px 0 16px; }
.profile-collection__subheading h3 { margin:0; color:var(--text-primary,#fff); }
.profile-collection__subheading span { color:#d799ff; font-weight:700; }
.profile-collection__grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:16px; }
.profile-collection__card { min-width:0; display:flex; flex-direction:column; gap:6px; padding:10px; border-radius:16px; background:rgba(109,0,163,.12); border:1px solid rgba(215,153,255,.16); }
.profile-collection__card strong { color:var(--text-primary,#fff); overflow-wrap:anywhere; }
.profile-collection__card small { color:var(--text-secondary,#b7a9c6); text-transform:capitalize; }
.profile-collection__image { position:relative; width:100%; aspect-ratio:3/4; display:grid; place-items:center; overflow:hidden; border-radius:10px; background:rgba(0,0,0,.15); }
.profile-collection__image--landscape { aspect-ratio:4/3; }
.profile-collection__image img { display:block; width:100%; height:100%; object-fit:contain; }
.profile-collection__quantity { position:absolute; right:6px; top:6px; padding:3px 7px; border-radius:999px; background:#6d00a3; color:white; font-weight:800; font-size:.75rem; }
.profile-collection__empty { padding:25px 12px; border:1px dashed rgba(215,153,255,.28); border-radius:16px; color:var(--text-secondary,#b7a9c6); text-align:center; }
.profile-collection__error { color:#ff789b; }
@media(max-width:600px) { .profile-collection__stats { grid-template-columns:repeat(2,minmax(0,1fr)); } .profile-collection__stat:last-child { grid-column:1/-1; } .profile-collection { padding:20px 14px; } }


.profile-suggestions {
  width: 100%;
  margin-top: 34px;
  padding: clamp(22px, 4vw, 34px);
  box-sizing: border-box;
  border: 1px solid rgba(109, 0, 163, 0.34);
  border-radius: 26px;
  background: rgba(22, 5, 38, 0.72);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.16);
}

:global(html[data-theme="light"]) .profile-suggestions {
  background: rgba(255, 255, 255, 0.82);
  border-color: rgba(109, 0, 163, 0.18);
}

.profile-suggestions__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.profile-suggestions__eyebrow {
  color: #22f2ef;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.profile-suggestions__header h2 {
  margin: 8px 0 7px;
  color: var(--text-primary, #ffffff);
  font-size: clamp(1.55rem, 3vw, 2.25rem);
}

.profile-suggestions__header p {
  margin: 0;
  color: var(--text-secondary, rgba(255, 255, 255, 0.68));
}

.profile-suggestions__count {
  display: grid;
  place-items: center;
  min-width: 48px;
  height: 48px;
  padding: 0 10px;
  box-sizing: border-box;
  color: #ffffff;
  border-radius: 999px;
  background: linear-gradient(135deg, #6d00a3, #f22292);
}

.profile-suggestions__list {
  display: grid;
  gap: 15px;
}

.profile-suggestion-card {
  padding: 19px;
  border: 1px solid rgba(109, 0, 163, 0.26);
  border-radius: 19px;
  background: rgba(31, 7, 49, 0.7);
}

:global(html[data-theme="light"]) .profile-suggestion-card {
  background: rgba(250, 244, 255, 0.9);
  border-color: rgba(109, 0, 163, 0.14);
}

.profile-suggestion-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-suggestion-card__category,
.profile-suggestion-card__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
}

.profile-suggestion-card__category {
  color: #d799ff;
  border: 1px solid rgba(215, 153, 255, 0.28);
  background: rgba(109, 0, 163, 0.12);
}

.profile-suggestion-card__status {
  color: var(--text-secondary, rgba(255, 255, 255, 0.76));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.profile-suggestion-card__status--pending {
  color: #ffd56a;
  border-color: rgba(255, 213, 106, 0.28);
  background: rgba(255, 213, 106, 0.08);
}

.profile-suggestion-card__status--approved {
  color: #22f2ef;
  border-color: rgba(34, 242, 239, 0.28);
  background: rgba(34, 242, 239, 0.08);
}

.profile-suggestion-card__status--rejected {
  color: #ff789b;
  border-color: rgba(255, 120, 155, 0.28);
  background: rgba(255, 120, 155, 0.08);
}

.profile-suggestion-card h3 {
  margin: 16px 0 8px;
  color: var(--text-primary, #ffffff);
  font-size: 1.08rem;
}

.profile-suggestion-card__description {
  margin: 0 0 14px;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  line-height: 1.55;
}

.profile-suggestion-card__response {
  margin-top: 13px;
  padding: 11px 13px;
  border-left: 3px solid #f22292;
  border-radius: 9px;
  color: var(--text-primary, #ffffff);
  background: rgba(242, 34, 146, 0.08);
  font-size: 0.82rem;
  font-weight: 700;
}

.profile-suggestion-card time {
  display: block;
  margin-top: 12px;
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
  font-size: 0.7rem;
}

.profile-suggestions__state,
.profile-suggestions__empty {
  padding: 28px 18px;
  border: 1px dashed rgba(109, 0, 163, 0.28);
  border-radius: 18px;
  color: var(--text-secondary, rgba(255, 255, 255, 0.68));
  text-align: center;
}

.profile-suggestions__state--error {
  color: #ff789b;
}

.profile-suggestions__empty {
  display: grid;
  justify-items: center;
  gap: 7px;
}

.profile-suggestions__empty > span {
  font-size: 2rem;
}

.profile-suggestions__empty strong {
  color: var(--text-primary, #ffffff);
}

.profile-suggestions__empty p {
  margin: 0;
}

@media (max-width: 700px) {

  .profile-suggestions {
    padding: 20px 14px;
    border-radius: 21px;
  }

}

</style>
