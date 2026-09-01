<script setup lang="ts">

import {
    computed
} from "vue";

import type {
    Profile
} from "../../services/profile.service";

import {
    getProfileAvatar,
    getProfileDisplayName,
    getProfileRoleLabel
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
   DISPLAY NAME
========================================================= */

const displayName =
    computed(
        () =>
            getProfileDisplayName(
                props.profile
            )
    );


/* =========================================================
   AVATAR
========================================================= */

const avatarUrl =
    computed(
        () =>
            getProfileAvatar(
                props.profile
            )
    );


/* =========================================================
   USERNAME
========================================================= */

const username =
    computed(
        () => {

            const value =
                props.profile.username
                    ?.trim();


            if (
                value
            ) {

                return (
                    "@"
                    +
                    value
                );

            }


            return "@poup";

        }
    );


/* =========================================================
   BIO
========================================================= */

const hasBio =
    computed(
        () =>
            Boolean(
                props.profile.bio
                    ?.trim()
            )
    );


const bio =
    computed(
        () => {

            const value =
                props.profile.bio
                    ?.trim();


            if (
                value
            ) {

                return value;

            }


            return "Ce POUP n'a pas encore écrit de bio.";

        }
    );


/* =========================================================
   MEMBER SINCE
========================================================= */

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


/* =========================================================
   INITIAL
========================================================= */

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
   ROLE
========================================================= */

const role =
    computed(
        () =>
            props.profile.role
            ||
            "user"
    );


/* =========================================================
   ROLE LABEL
========================================================= */

const roleLabel =
    computed(
        () =>
            getProfileRoleLabel(
                props.profile
            )
    );


/* =========================================================
   ROLE CLASS
========================================================= */

const roleClass =
    computed(
        () => {

            switch (
                role.value
            ) {

                case "admin":

                    return "profile-role--admin";


                case "moderator":

                    return "profile-role--moderator";


                default:

                    return "profile-role--user";

            }

        }
    );


/* =========================================================
   ROLE ICON
========================================================= */

const roleIcon =
    computed(
        () => {

            switch (
                role.value
            ) {

                case "admin":

                    return "👑";


                case "moderator":

                    return "🛡️";


                default:

                    return "🐙";

            }

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
             AVATAR COLUMN
        ================================================== -->

        <div
            class="profile-card__avatar-column"
        >

            <div
                class="profile-card__avatar-wrapper"
            >

                <!-- =========================================
                     AVATAR
                ========================================== -->

                <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    :alt="`Avatar de ${displayName}`"
                    class="profile-card__avatar"
                >


                <!-- =========================================
                     FALLBACK
                ========================================== -->

                <div
                    v-else
                    class="
                        profile-card__avatar
                        profile-card__avatar--fallback
                    "
                    aria-hidden="true"
                >

                    {{ profileInitial }}

                </div>


                <!-- =========================================
                     POUP STATUS
                ========================================== -->

                <span
                    class="profile-card__avatar-status"
                    title="Compte POUP"
                    aria-label="Compte POUP"
                >

                    🐙

                </span>

            </div>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div
            class="profile-card__content"
        >

            <!-- =================================================
                 HEADER
            ================================================== -->

            <header
                class="profile-card__header"
            >

                <!-- =============================================
                     IDENTITY
                ============================================== -->

                <div
                    class="profile-card__identity"
                >

                    <!-- POUP -->

                    <span
                        class="profile-card__eyebrow"
                    >

                        🐙 POUP

                    </span>


                    <!-- DISPLAY NAME -->

                    <h2
                        class="profile-card__display-name"
                    >

                        {{ displayName }}

                    </h2>


                    <!-- USERNAME -->

                    <span
                        class="profile-card__username"
                    >

                        {{ username }}

                    </span>

                </div>


                <!-- =============================================
                     ROLE
                ============================================== -->

                <span
                    class="profile-role"
                    :class="roleClass"
                >

                    <span
                        class="profile-role__icon"
                        aria-hidden="true"
                    >

                        {{ roleIcon }}

                    </span>


                    <span>

                        {{ roleLabel }}

                    </span>

                </span>

            </header>


            <!-- =================================================
                 BIO
            ================================================== -->

            <div
                class="profile-card__bio-wrapper"
            >

                <p
                    class="profile-card__bio"
                    :class="{
                        'profile-card__bio--empty':
                            !hasBio
                    }"
                >

                    {{ bio }}

                </p>

            </div>


            <!-- =================================================
                 META INFORMATIONS
            ================================================== -->

            <div
                class="profile-card__meta"
            >

                <!-- =============================================
                     MEMBER SINCE
                ============================================== -->

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


                    <div
                        class="profile-card__meta-content"
                    >

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


                <!-- =============================================
                     COMMUNITY
                ============================================== -->

                <div
                    class="profile-card__meta-item"
                >

                    <span
                        class="profile-card__meta-icon"
                        aria-hidden="true"
                    >

                        💜

                    </span>


                    <div
                        class="profile-card__meta-content"
                    >

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


            <!-- =================================================
                 ACTIONS
            ================================================== -->

            <div
                class="profile-card__actions"
            >

                <button
                    type="button"
                    class="
                        profile-button
                        profile-button--primary
                    "
                    @click="
                        requestEdit
                    "
                >

                    <span
                        class="profile-button__icon"
                        aria-hidden="true"
                    >

                        ✏️

                    </span>


                    <span>

                        Modifier mon profil

                    </span>

                </button>

            </div>

        </div>

    </article>

</template>