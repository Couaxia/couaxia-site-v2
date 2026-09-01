<script setup lang="ts">

import {
    computed
} from "vue";

import type {
    Profile
} from "../../services/profile.service";

import {
    getProfileAvatar,
    getProfileDisplayName
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

        edit:
            [];

    }>();


/* =========================================================
   COMPUTED
========================================================= */

/*
 * Nom affiché du POUP.
 */

const displayName =
    computed(
        () =>
            getProfileDisplayName(
                props.profile
            )
    );


/*
 * Avatar du POUP.
 */

const avatarUrl =
    computed(
        () =>
            getProfileAvatar(
                props.profile
            )
    );


/*
 * Username.
 */

const username =
    computed(
        () => {

            if (
                props.profile.username
            ) {

                return (
                    "@"
                    +
                    props.profile.username
                );

            }


            return "@poup";

        }
    );


/*
 * Bio.
 */

const bio =
    computed(
        () =>
            props.profile.bio
            ||
            "Ce POUP n'a pas encore écrit de bio."
    );


/*
 * Date de création du compte.
 */

const memberSince =
    computed(
        () => {

            if (
                !props.profile.created_at
            ) {

                return null;

            }


            const date =
                new Date(
                    props.profile.created_at
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return null;

            }


            return new Intl.DateTimeFormat(
                "fr-FR",
                {
                    month:
                        "long",

                    year:
                        "numeric"
                }
            ).format(
                date
            );

        }
    );


/*
 * Initiale utilisée lorsqu'il n'y a
 * pas encore d'avatar.
 */

const profileInitial =
    computed(
        () => {

            const name =
                displayName.value
                    .trim();


            if (
                !name
            ) {

                return "P";

            }


            return name
                .charAt(0)
                .toUpperCase();

        }
    );


/* =========================================================
   EDIT
========================================================= */

function requestEdit() {

    emit(
        "edit"
    );

}

</script>


<template>

    <article
        class="profile-card"
    >

        <!-- =================================================
             BANNIÈRE
        ================================================== -->

        <div
            class="profile-card__banner"
            aria-hidden="true"
        >

            <span
                class="profile-card__banner-orb profile-card__banner-orb--one"
            ></span>

            <span
                class="profile-card__banner-orb profile-card__banner-orb--two"
            ></span>

            <span
                class="profile-card__banner-orb profile-card__banner-orb--three"
            ></span>

        </div>


        <!-- =================================================
             CONTENU
        ================================================== -->

        <div
            class="profile-card__content"
        >

            <!-- =============================================
                 AVATAR
            ============================================== -->

            <div
                class="profile-card__avatar-wrapper"
            >

                <div
                    class="profile-card__avatar"
                >

                    <img
                        v-if="avatarUrl"
                        :src="avatarUrl"
                        :alt="`Avatar de ${displayName}`"
                    >


                    <span
                        v-else
                        class="profile-card__avatar-fallback"
                        aria-hidden="true"
                    >

                        {{ profileInitial }}

                    </span>

                </div>


                <span
                    class="profile-card__status"
                    title="POUP"
                    aria-label="Compte POUP"
                >

                    🐙

                </span>

            </div>


            <!-- =============================================
                 IDENTITÉ
            ============================================== -->

            <div
                class="profile-card__identity"
            >

                <div
                    class="profile-card__name-row"
                >

                    <div
                        class="profile-card__names"
                    >

                        <span
                            class="profile-card__eyebrow"
                        >
                            POUP
                        </span>


                        <h2>
                            {{ displayName }}
                        </h2>


                        <span
                            class="profile-card__username"
                        >
                            {{ username }}
                        </span>

                    </div>


                    <button
                        type="button"
                        class="profile-card__edit"
                        @click="requestEdit"
                    >

                        <span
                            aria-hidden="true"
                        >
                            ✎
                        </span>

                        Modifier mon profil

                    </button>

                </div>


                <!-- =========================================
                     BIO
                ========================================== -->

                <p
                    class="profile-card__bio"
                    :class="{
                        'profile-card__bio--empty':
                            !profile.bio
                    }"
                >

                    {{ bio }}

                </p>


                <!-- =========================================
                     INFORMATIONS
                ========================================== -->

                <div
                    class="profile-card__meta"
                >

                    <div
                        v-if="memberSince"
                        class="profile-card__meta-item"
                    >

                        <span
                            class="profile-card__meta-icon"
                            aria-hidden="true"
                        >
                            ✦
                        </span>


                        <div>

                            <span
                                class="profile-card__meta-label"
                            >
                                POUP depuis
                            </span>

                            <strong>
                                {{ memberSince }}
                            </strong>

                        </div>

                    </div>


                    <div
                        class="profile-card__meta-item"
                    >

                        <span
                            class="profile-card__meta-icon"
                            aria-hidden="true"
                        >
                            💜
                        </span>


                        <div>

                            <span
                                class="profile-card__meta-label"
                            >
                                Communauté
                            </span>

                            <strong>
                                Les POUP
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- =================================================
             FOOTER
        ================================================== -->

        <footer
            class="profile-card__footer"
        >

            <span
                class="profile-card__footer-icon"
                aria-hidden="true"
            >
                🐙
            </span>


            <span>
                Membre de l'univers de Couaxia
            </span>

        </footer>

    </article>

</template>