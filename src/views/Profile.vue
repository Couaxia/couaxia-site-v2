<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRouter
} from "vue-router";

import "../assets/styles/pages/profile.css";

import ProfileCard from
    "../components/profile/ProfileCard.vue";

import ProfileAvatar from
    "../components/profile/ProfileAvatar.vue";

import {
    checkUsernameAvailable,
    getCurrentProfile,
    logoutProfile,
    updateMyProfile
} from "../services/profile.service";

import type {
    Profile
} from "../services/profile.service";


/* =========================================================
   ROUTER
========================================================= */

const router =
    useRouter();


/* =========================================================
   STATE
========================================================= */

const profile =
    ref<Profile | null>(
        null
    );

const loading =
    ref(
        true
    );

const saving =
    ref(
        false
    );

const checkingUsername =
    ref(
        false
    );

const loggingOut =
    ref(
        false
    );

const editing =
    ref(
        false
    );

const errorMessage =
    ref(
        ""
    );

const successMessage =
    ref(
        ""
    );


/* =========================================================
   FORM
========================================================= */

const formUsername =
    ref(
        ""
    );

const formDisplayName =
    ref(
        ""
    );

const formBio =
    ref(
        ""
    );


/* =========================================================
   USERNAME STATE
========================================================= */

const usernameAvailable =
    ref<boolean | null>(
        null
    );

const usernameMessage =
    ref(
        ""
    );


/* =========================================================
   COMPUTED
========================================================= */

const hasProfile =
    computed(
        () =>
            Boolean(
                profile.value
            )
    );


const bioLength =
    computed(
        () =>
            formBio.value.length
    );


const usernameChanged =
    computed(
        () => {

            if (
                !profile.value
            ) {

                return false;

            }


            return (
                formUsername.value
                    .trim()
                    .toLowerCase()
                !==
                profile.value.username
            );

        }
    );


const canSave =
    computed(
        () => {

            if (
                !profile.value
                ||
                saving.value
            ) {

                return false;

            }


            if (
                !formUsername.value
                    .trim()
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

        }
    );


/* =========================================================
   FILL FORM
========================================================= */

function fillFormFromProfile() {

    if (
        !profile.value
    ) {

        formUsername.value =
            "";

        formDisplayName.value =
            "";

        formBio.value =
            "";

        usernameAvailable.value =
            null;

        usernameMessage.value =
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
   OPEN EDIT
========================================================= */

function openEditProfile() {

    if (
        !profile.value
    ) {
        return;
    }


    fillFormFromProfile();


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

    if (
        !profile.value
    ) {
        return;
    }


    const username =
        formUsername.value
            .trim()
            .toLowerCase();


    usernameAvailable.value =
        null;


    usernameMessage.value =
        "";


    if (
        !username
    ) {

        usernameAvailable.value =
            false;


        usernameMessage.value =
            "Le pseudo est obligatoire.";


        return;

    }


    if (
        username.length
        <
        3
    ) {

        usernameAvailable.value =
            false;


        usernameMessage.value =
            "Le pseudo doit contenir au moins 3 caractères.";


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

        /* =====================================================
           USERNAME CHECK
        ====================================================== */

        if (
            usernameChanged.value
        ) {

            const available =
                await checkUsernameAvailable(
                    formUsername.value,
                    profile.value.id
                );


            if (
                !available
            ) {

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


        /* =====================================================
           UPDATE
        ====================================================== */

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
   AVATAR UPDATED
========================================================= */

function handleAvatarUpdated(
    avatarUrl:
        string | null
) {

    if (
        !profile.value
    ) {
        return;
    }


    profile.value = {

        ...profile.value,

        avatar_url:
            avatarUrl

    };

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


        editing.value =
            false;


        await router.push({
            name:
                "login"
        });


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
   MOUNT
========================================================= */

onMounted(
    loadProfile
);

</script>


<template>

    <main
        class="profile-page"
    >

        <!-- =================================================
             HERO
        ================================================== -->

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


        <!-- =================================================
             CONTENT
        ================================================== -->

        <section
            class="profile-section"
        >

            <!-- =============================================
                 LOADING
            ============================================== -->

            <div
                v-if="loading"
                class="profile-state"
            >

                <span
                    class="profile-state__icon"
                    aria-hidden="true"
                >
                    🐙
                </span>


                <strong>
                    Chargement de ton profil...
                </strong>


                <p>
                    Une petite seconde.
                </p>

            </div>


            <!-- =============================================
                 NO PROFILE
            ============================================== -->

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


                <RouterLink
                    to="/login"
                    class="
                        profile-button
                        profile-button--primary
                    "
                >
                    Se connecter
                </RouterLink>

            </div>


            <!-- =============================================
                 PROFILE
            ============================================== -->

            <template
                v-else-if="profile"
            >

                <!-- =========================================
                     MESSAGES
                ========================================== -->

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


                <!-- =========================================
                     PROFILE CARD
                ========================================== -->

                <ProfileCard
                    v-if="
                        !editing
                    "
                    :profile="
                        profile
                    "
                    @edit="
                        openEditProfile
                    "
                />


                <!-- =========================================
                     EDIT FORM
                ========================================== -->

                <form
                    v-else
                    class="profile-form"
                    @submit.prevent="
                        saveProfile
                    "
                >

                    <!-- =====================================
                         HEADER
                    ====================================== -->

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
                            Modifie ton pseudo,
                            ton nom affiché et ta bio.
                        </p>

                    </header>


                    <!-- =====================================
                         USERNAME
                    ====================================== -->

                    <div
                        class="profile-field"
                    >

                        <label
                            for="profile-username"
                        >
                            Pseudo POUP
                        </label>


                        <div
                            class="
                                profile-field__input-row
                            "
                        >

                            <input
                                id="profile-username"
                                v-model="
                                    formUsername
                                "
                                type="text"
                                maxlength="30"
                                minlength="3"
                                autocomplete="username"
                                placeholder="Ton pseudo"
                                required
                                @blur="
                                    checkUsername
                                "
                            >


                            <button
                                type="button"
                                class="
                                    profile-field__check-button
                                "
                                :disabled="
                                    checkingUsername
                                "
                                @click="
                                    checkUsername
                                "
                            >

                                {{
                                    checkingUsername
                                        ? "..."
                                        : "Vérifier"
                                }}

                            </button>

                        </div>


                        <p
                            v-if="
                                usernameMessage
                            "
                            class="
                                profile-field__message
                            "
                            :class="{

                                'profile-field__message--success':
                                    usernameAvailable
                                    ===
                                    true,

                                'profile-field__message--error':
                                    usernameAvailable
                                    ===
                                    false

                            }"
                        >
                            {{ usernameMessage }}
                        </p>


                        <small>
                            3 à 30 caractères.
                            Lettres, chiffres,
                            tirets et underscores uniquement.
                        </small>

                    </div>


                    <!-- =====================================
                         DISPLAY NAME
                    ====================================== -->

                    <div
                        class="profile-field"
                    >

                        <label
                            for="
                                profile-display-name
                            "
                        >
                            Nom affiché
                        </label>


                        <input
                            id="
                                profile-display-name
                            "
                            v-model="
                                formDisplayName
                            "
                            type="text"
                            maxlength="40"
                            placeholder="
                                Ton nom affiché
                            "
                        >


                        <small>
                            Jusqu'à 40 caractères.
                            Tu peux le laisser vide.
                        </small>

                    </div>


                    <!-- =====================================
                         BIO
                    ====================================== -->

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
                            v-model="
                                formBio
                            "
                            maxlength="500"
                            rows="6"
                            placeholder="Présente-toi en quelques mots..."
                        ></textarea>

                    </div>


                    <!-- =====================================
                         ACTIONS
                    ====================================== -->

                    <div
                        class="
                            profile-form__actions
                        "
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


                <!-- =========================================
                     AVATAR
                ========================================== -->

                <div
                    class="
                        profile-page__avatar-section
                    "
                >

                    <ProfileAvatar
                        :profile="
                            profile
                        "
                        @avatar-updated="
                            handleAvatarUpdated
                        "
                    />

                </div>


                <!-- =========================================
                     ACCOUNT ACTIONS
                ========================================== -->

                <footer
                    class="
                        profile-account-actions
                    "
                >

                    <div>

                        <span
                            class="
                                profile-account-actions__eyebrow
                            "
                        >
                            🔐 COMPTE
                        </span>


                        <h3>
                            Gestion du compte
                        </h3>


                        <p>
                            Tu peux te déconnecter
                            de ton compte POUP ici.
                        </p>

                    </div>


                    <button
                        type="button"
                        class="
                            profile-button
                            profile-button--secondary
                        "
                        :disabled="
                            loggingOut
                        "
                        @click="
                            logout
                        "
                    >

                        {{
                            loggingOut

                                ? "Déconnexion..."

                                : "Se déconnecter"
                        }}

                    </button>

                </footer>

            </template>

        </section>

    </main>

</template>