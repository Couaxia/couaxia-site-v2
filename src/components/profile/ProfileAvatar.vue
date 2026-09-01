<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from "vue";

import {
  deleteMyAvatar,
  getOfficialAvatars,
  getProfileAvatar,
  getProfileDisplayName,
  selectOfficialAvatar,
  uploadMyAvatar
} from "../../services/profile.service";

import type {
  OfficialAvatar,
  Profile
} from "../../services/profile.service";


/* =========================================================
   PROPS
========================================================= */

const props =
  defineProps<{
    profile:
      Profile;
  }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
  defineEmits<{
    avatarUpdated:
      [avatarUrl: string | null];
  }>();


/* =========================================================
   STATE
========================================================= */

const officialAvatars =
  ref<OfficialAvatar[]>(
    []
  );

const loadingOfficialAvatars =
  ref(false);

const uploadingAvatar =
  ref(false);

const deletingAvatar =
  ref(false);

const selectedAvatarFile =
  ref<File | null>(
    null
  );

const avatarPreviewUrl =
  ref<string | null>(
    null
  );

const errorMessage =
  ref("");

const successMessage =
  ref("");


/* =========================================================
   COMPUTED
========================================================= */

const currentAvatarUrl =
  computed(() =>
    getProfileAvatar(
      props.profile
    )
  );


const displayName =
  computed(() =>
    getProfileDisplayName(
      props.profile
    )
  );


const hasCurrentAvatar =
  computed(() =>
    Boolean(
      currentAvatarUrl.value
    )
  );


/* =========================================================
   LOAD OFFICIAL AVATARS
========================================================= */

async function loadOfficialAvatars() {

  loadingOfficialAvatars.value =
    true;

  errorMessage.value =
    "";


  try {

    officialAvatars.value =
      await getOfficialAvatars();


  } catch (error) {

    console.error(
      "Erreur chargement avatars officiels :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de charger les avatars officiels.";

  } finally {

    loadingOfficialAvatars.value =
      false;

  }

}


/* =========================================================
   SELECT OFFICIAL AVATAR
========================================================= */

async function chooseOfficialAvatar(
  avatar:
    OfficialAvatar
) {

  if (
    uploadingAvatar.value
    ||
    deletingAvatar.value
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


    clearCustomAvatarSelection();


    emit(
      "avatarUpdated",
      updatedProfile.avatar_url
    );


    successMessage.value =
      "Avatar officiel sélectionné. 💜";


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
   CUSTOM FILE SELECTION
========================================================= */

function handleAvatarFileChange(
  event:
    Event
) {

  errorMessage.value =
    "";

  successMessage.value =
    "";


  const input =
    event.target as HTMLInputElement;


  const file =
    input.files?.[0]
    ??
    null;


  if (!file) {

    clearCustomAvatarSelection();

    return;

  }


  selectedAvatarFile.value =
    file;


  if (
    avatarPreviewUrl.value
  ) {

    URL.revokeObjectURL(
      avatarPreviewUrl.value
    );

  }


  avatarPreviewUrl.value =
    URL.createObjectURL(
      file
    );

}


/* =========================================================
   CLEAR CUSTOM AVATAR SELECTION
========================================================= */

function clearCustomAvatarSelection() {

  selectedAvatarFile.value =
    null;


  if (
    avatarPreviewUrl.value
  ) {

    URL.revokeObjectURL(
      avatarPreviewUrl.value
    );

    avatarPreviewUrl.value =
      null;

  }

}


/* =========================================================
   UPLOAD CUSTOM AVATAR
========================================================= */

async function uploadSelectedAvatar() {

  if (
    !selectedAvatarFile.value
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

    const newAvatarUrl =
      await uploadMyAvatar(
        selectedAvatarFile.value
      );


    clearCustomAvatarSelection();


    emit(
      "avatarUpdated",
      newAvatarUrl
    );


    successMessage.value =
      "Ton avatar personnalisé a bien été ajouté. 💜";


  } catch (error) {

    console.error(
      "Erreur upload avatar :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible d'envoyer ton avatar.";

  } finally {

    uploadingAvatar.value =
      false;

  }

}


/* =========================================================
   DELETE CURRENT AVATAR
========================================================= */

async function removeCurrentAvatar() {

  if (
    deletingAvatar.value
    ||
    uploadingAvatar.value
  ) {
    return;
  }


  deletingAvatar.value =
    true;

  errorMessage.value =
    "";

  successMessage.value =
    "";


  try {

    await deleteMyAvatar();


    clearCustomAvatarSelection();


    emit(
      "avatarUpdated",
      null
    );


    successMessage.value =
      "Ton avatar a été retiré.";


  } catch (error) {

    console.error(
      "Erreur suppression avatar :",
      error
    );


    errorMessage.value =

      error instanceof Error

        ? error.message

        : "Impossible de supprimer ton avatar.";

  } finally {

    deletingAvatar.value =
      false;

  }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
  loadOfficialAvatars
);

</script>


<template>

  <section
    class="profile-avatar-panel"
  >

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header
      class="profile-avatar-panel__header"
    >

      <span
        class="profile-avatar-panel__eyebrow"
      >
        🎨 AVATAR POUP
      </span>


      <h2>
        Personnalise ton avatar
      </h2>


      <p>
        Choisis une illustration officielle
        ou utilise ta propre image.
      </p>

    </header>


    <!-- =====================================================
         MESSAGES
    ====================================================== -->

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


    <!-- =====================================================
         CURRENT AVATAR
    ====================================================== -->

    <div
      class="profile-avatar-current"
    >

      <div
        class="profile-avatar-current__preview"
      >

        <img
          v-if="currentAvatarUrl"
          :src="currentAvatarUrl"
          :alt="displayName"
        >


        <div
          v-else
          class="
            profile-avatar-current__fallback
          "
          aria-hidden="true"
        >
          🐙
        </div>

      </div>


      <div
        class="profile-avatar-current__content"
      >

        <span>
          Avatar actuel
        </span>


        <strong>
          {{
            hasCurrentAvatar
              ? displayName
              : "Aucun avatar sélectionné"
          }}
        </strong>


        <button
          v-if="hasCurrentAvatar"
          type="button"
          class="
            profile-button
            profile-button--secondary
          "
          :disabled="
            deletingAvatar
            ||
            uploadingAvatar
          "
          @click="
            removeCurrentAvatar
          "
        >
          {{
            deletingAvatar
              ? "Suppression..."
              : "Retirer l'avatar"
          }}
        </button>

      </div>

    </div>


    <!-- =====================================================
         OFFICIAL AVATARS
    ====================================================== -->

    <div
      class="profile-avatar-section"
    >

      <div
        class="
          profile-avatar-section__header
        "
      >

        <div>

          <span
            class="
              profile-avatar-section__eyebrow
            "
          >
            ✨ COLLECTION
          </span>


          <h3>
            Avatars officiels
          </h3>

        </div>


        <span
          class="
            profile-avatar-section__count
          "
        >
          {{ officialAvatars.length }}
        </span>

      </div>


      <p
        class="
          profile-avatar-section__description
        "
      >
        Ces avatars sont disponibles
        pour tous les POUP.
      </p>


      <!-- LOADING -->

      <div
        v-if="loadingOfficialAvatars"
        class="profile-avatar-loading"
      >
        Chargement des avatars...
      </div>


      <!-- GRID -->

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
              currentAvatarUrl
              ===
              avatar.url
          }"
          :disabled="
            uploadingAvatar
            ||
            deletingAvatar
          "
          :aria-label="
            `Choisir ${avatar.name}`
          "
          @click="
            chooseOfficialAvatar(
              avatar
            )
          "
        >

          <img
            :src="
              avatar.url
            "
            :alt="
              avatar.name
            "
          >


          <span
            v-if="
              currentAvatarUrl
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


      <!-- EMPTY -->

      <div
        v-else
        class="profile-avatar-empty"
      >
        Aucun avatar officiel disponible.
      </div>

    </div>


    <!-- =====================================================
         PERSONAL AVATAR
    ====================================================== -->

    <div
      class="
        profile-avatar-section
        profile-avatar-section--custom
      "
    >

      <div
        class="
          profile-avatar-section__header
        "
      >

        <div>

          <span
            class="
              profile-avatar-section__eyebrow
            "
          >
            🖼️ PERSONNALISÉ
          </span>


          <h3>
            Ton propre avatar
          </h3>

        </div>

      </div>


      <p
        class="
          profile-avatar-section__description
        "
      >
        PNG, JPG ou WebP.
        Taille maximale : 2 Mo.
      </p>


      <!-- FILE INPUT -->

      <label
        class="
          profile-avatar-upload
        "
        for="
          profile-custom-avatar
        "
      >

        <span
          class="
            profile-avatar-upload__icon
          "
          aria-hidden="true"
        >
          ＋
        </span>


        <span
          class="
            profile-avatar-upload__content
          "
        >

          <strong>
            Choisir une image
          </strong>


          <small>
            Clique ici pour sélectionner
            ton avatar.
          </small>

        </span>

      </label>


      <input
        id="profile-custom-avatar"
        class="
          profile-avatar-upload__input
        "
        type="file"
        accept="
          image/png,
          image/jpeg,
          image/webp
        "
        :disabled="
          uploadingAvatar
          ||
          deletingAvatar
        "
        @change="
          handleAvatarFileChange
        "
      >


      <!-- PREVIEW -->

      <div
        v-if="
          avatarPreviewUrl
        "
        class="
          profile-custom-avatar-preview
        "
      >

        <img
          :src="
            avatarPreviewUrl
          "
          alt="
            Aperçu du nouvel avatar
          "
        >


        <div
          class="
            profile-custom-avatar-preview__content
          "
        >

          <span>
            Aperçu
          </span>


          <strong>
            {{
              selectedAvatarFile?.name
            }}
          </strong>


          <small
            v-if="
              selectedAvatarFile
            "
          >
            {{
              (
                selectedAvatarFile.size
                /
                1024
                /
                1024
              ).toFixed(2)
            }}
            Mo
          </small>


          <div
            class="
              profile-custom-avatar-preview__actions
            "
          >

            <button
              type="button"
              class="
                profile-button
                profile-button--primary
              "
              :disabled="
                uploadingAvatar
              "
              @click="
                uploadSelectedAvatar
              "
            >
              {{
                uploadingAvatar
                  ? "Envoi..."
                  : "Utiliser cet avatar"
              }}
            </button>


            <button
              type="button"
              class="
                profile-button
                profile-button--secondary
              "
              :disabled="
                uploadingAvatar
              "
              @click="
                clearCustomAvatarSelection
              "
            >
              Annuler
            </button>

          </div>

        </div>

      </div>

    </div>

  </section>

</template>