<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    getAdminUsers,
    updateUserRole
} from "../../services/admin.service";

import type {
    AdminProfile,
    UserRole
} from "../../services/admin.service";


/* =========================================================
   TYPES
========================================================= */

type UserFilter =
    | "all"
    | UserRole;


/* =========================================================
   STATE
========================================================= */

const users =
    ref<AdminProfile[]>([]);


const loading =
    ref(true);


const actionLoading =
    ref<string | null>(
        null
    );


const errorMessage =
    ref("");


const successMessage =
    ref("");


const search =
    ref("");


const filter =
    ref<UserFilter>(
        "all"
    );


/* =========================================================
   FILTERED USERS
========================================================= */

const filteredUsers =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return users.value.filter(
                user => {

                    const matchesRole =
                        filter.value
                        ===
                        "all"
                        ||
                        user.role
                        ===
                        filter.value;


                    const content = [
                        user.username
                        ??
                        "",

                        user.display_name
                        ??
                        "",

                        user.bio
                        ??
                        ""
                    ]
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        !query
                        ||
                        content.includes(
                            query
                        );


                    return (
                        matchesRole
                        &&
                        matchesSearch
                    );

                }
            );

        }
    );


/* =========================================================
   COUNTERS
========================================================= */

const totalCount =
    computed(
        () =>
            users.value.length
    );


const userCount =
    computed(
        () =>
            users.value.filter(
                user =>
                    user.role
                    ===
                    "user"
            ).length
    );


const moderatorCount =
    computed(
        () =>
            users.value.filter(
                user =>
                    user.role
                    ===
                    "moderator"
            ).length
    );


const adminCount =
    computed(
        () =>
            users.value.filter(
                user =>
                    user.role
                    ===
                    "admin"
            ).length
    );


/* =========================================================
   LOAD USERS
========================================================= */

async function loadUsers() {

    loading.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        users.value =
            await getAdminUsers();

    }
    catch (
        error
    ) {

        console.error(
            "Erreur chargement utilisateurs :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les utilisateurs.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value:
        string | null | undefined
): string {

    if (
        !value
    ) {

        return "Date inconnue";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Date inconnue";

    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day:
                "2-digit",

            month:
                "long",

            year:
                "numeric"
        }
    ).format(
        date
    );

}


/* =========================================================
   DISPLAY NAME
========================================================= */

function getDisplayName(
    user:
        AdminProfile
): string {

    return (
        user.display_name
        ||
        user.username
        ||
        "POUP"
    );

}


/* =========================================================
   INITIAL
========================================================= */

function getInitial(
    user:
        AdminProfile
): string {

    return getDisplayName(
        user
    )
        .charAt(0)
        .toUpperCase()
        ||
        "P";

}


/* =========================================================
   ROLE LABEL
========================================================= */

function getRoleLabel(
    role:
        UserRole
): string {

    switch (
        role
    ) {

        case "admin":

            return "Administrateur";


        case "moderator":

            return "Modérateur";


        default:

            return "Utilisateur";

    }

}


/* =========================================================
   ROLE CLASS
========================================================= */

function getRoleClass(
    role:
        UserRole
): string {

    switch (
        role
    ) {

        case "admin":

            return "admin-user-role--admin";


        case "moderator":

            return "admin-user-role--moderator";


        default:

            return "admin-user-role--user";

    }

}


/* =========================================================
   CHANGE ROLE
========================================================= */

async function changeRole(
    user:
        AdminProfile,

    role:
        UserRole
) {

    if (
        actionLoading.value
    ) {

        return;

    }


    if (
        user.role
        ===
        role
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Changer le rôle de ${getDisplayName(user)} en "${getRoleLabel(role)}" ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    actionLoading.value =
        user.id;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const updated =
            await updateUserRole(
                user.id,
                role
            );


        const index =
            users.value.findIndex(
                item =>
                    item.id
                    ===
                    user.id
            );


        if (
            index
            !==
            -1
        ) {

            users.value[index] =
                updated;

        }


        successMessage.value =
            `Le rôle de ${getDisplayName(updated)} a été modifié.`;

    }
    catch (
        error
    ) {

        console.error(
            "Erreur modification rôle :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de modifier le rôle.";

    }
    finally {

        actionLoading.value =
            null;

    }

}


/* =========================================================
   ROLE SELECT CHANGE
========================================================= */

function handleRoleChange(
    user:
        AdminProfile,

    event:
        Event
) {

    const target =
        event.target as HTMLSelectElement | null;


    if (
        !target
    ) {

        return;

    }


    const role =
        target.value as UserRole;


    void changeRole(
        user,
        role
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadUsers
);

</script>


<template>

    <section
        class="admin-users"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-section-header"
        >

            <div>

                <span
                    class="admin-section-header__eyebrow"
                >
                    🐙 COMMUNAUTÉ
                </span>


                <h2>
                    Utilisateurs
                </h2>


                <p>
                    Consulte les comptes POUP
                    et gère les rôles de la communauté.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--secondary
                "
                :disabled="
                    loading
                "
                @click="
                    loadUsers
                "
            >
                {{
                    loading
                        ? "Actualisation..."
                        : "↻ Actualiser"
                }}
            </button>

        </header>


        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
            v-if="
                successMessage
            "
            class="
                admin-message
                admin-message--success
            "
        >
            ✓ {{ successMessage }}
        </div>


        <div
            v-if="
                errorMessage
            "
            class="
                admin-message
                admin-message--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="
                loading
            "
            class="admin-loading"
        >

            <span>
                🐙
            </span>


            <strong>
                Chargement des comptes POUP...
            </strong>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <template
            v-else
        >

            <!-- =============================================
                 STATS
            ============================================== -->

            <div
                class="admin-users-stats"
            >

                <button
                    type="button"
                    class="admin-user-stat"
                    :class="{
                        'admin-user-stat--active':
                            filter === 'all'
                    }"
                    @click="
                        filter = 'all'
                    "
                >

                    <span>
                        Tous
                    </span>


                    <strong>
                        {{ totalCount }}
                    </strong>

                </button>


                <button
                    type="button"
                    class="admin-user-stat"
                    :class="{
                        'admin-user-stat--active':
                            filter === 'user'
                    }"
                    @click="
                        filter = 'user'
                    "
                >

                    <span>
                        Utilisateurs
                    </span>


                    <strong>
                        {{ userCount }}
                    </strong>

                </button>


                <button
                    type="button"
                    class="admin-user-stat"
                    :class="{
                        'admin-user-stat--active':
                            filter === 'moderator'
                    }"
                    @click="
                        filter = 'moderator'
                    "
                >

                    <span>
                        Modérateurs
                    </span>


                    <strong>
                        {{ moderatorCount }}
                    </strong>

                </button>


                <button
                    type="button"
                    class="admin-user-stat"
                    :class="{
                        'admin-user-stat--active':
                            filter === 'admin'
                    }"
                    @click="
                        filter = 'admin'
                    "
                >

                    <span>
                        Admins
                    </span>


                    <strong>
                        {{ adminCount }}
                    </strong>

                </button>

            </div>


            <!-- =============================================
                 TOOLBAR
            ============================================== -->

            <div
                class="admin-users-toolbar"
            >

                <div
                    class="admin-search"
                >

                    <span
                        aria-hidden="true"
                    >
                        🔎
                    </span>


                    <input
                        v-model="
                            search
                        "
                        type="search"
                        placeholder="Pseudo, nom affiché, bio..."
                    >

                </div>


                <select
                    v-model="
                        filter
                    "
                    class="
                        admin-select
                        admin-users-filter
                    "
                >

                    <option
                        value="all"
                    >
                        Tous les rôles
                    </option>


                    <option
                        value="user"
                    >
                        Utilisateurs
                    </option>


                    <option
                        value="moderator"
                    >
                        Modérateurs
                    </option>


                    <option
                        value="admin"
                    >
                        Administrateurs
                    </option>

                </select>

            </div>


            <!-- =============================================
                 COUNT
            ============================================== -->

            <p
                class="admin-users-count"
            >
                {{ filteredUsers.length }}

                compte{{
                    filteredUsers.length > 1
                        ? "s"
                        : ""
                }}
            </p>


            <!-- =============================================
                 EMPTY
            ============================================== -->

            <div
                v-if="
                    filteredUsers.length
                    ===
                    0
                "
                class="admin-empty"
            >

                <span>
                    🐙
                </span>


                <strong>
                    Aucun utilisateur
                </strong>


                <p>
                    Aucun compte ne correspond
                    à ta recherche.
                </p>

            </div>


            <!-- =============================================
                 USERS
            ============================================== -->

            <div
                v-else
                class="admin-users-list"
            >

                <article
                    v-for="
                        user
                        in
                        filteredUsers
                    "
                    :key="
                        user.id
                    "
                    class="admin-user-card"
                >

                    <!-- =====================================
                         PROFILE
                    ====================================== -->

                    <div
                        class="
                            admin-user-card__profile
                        "
                    >

                        <div
                            class="
                                admin-user-card__avatar
                            "
                        >

                            <img
                                v-if="
                                    user.avatar_url
                                "
                                :src="
                                    user.avatar_url
                                "
                                :alt="
                                    getDisplayName(
                                        user
                                    )
                                "
                            >


                            <span
                                v-else
                                aria-hidden="true"
                            >
                                {{
                                    getInitial(
                                        user
                                    )
                                }}
                            </span>

                        </div>


                        <div
                            class="
                                admin-user-card__identity
                            "
                        >

                            <div
                                class="
                                    admin-user-card__name-row
                                "
                            >

                                <h3>
                                    {{
                                        getDisplayName(
                                            user
                                        )
                                    }}
                                </h3>


                                <span
                                    class="
                                        admin-user-role
                                    "
                                    :class="
                                        getRoleClass(
                                            user.role
                                        )
                                    "
                                >
                                    {{
                                        getRoleLabel(
                                            user.role
                                        )
                                    }}
                                </span>

                            </div>


                            <span
                                class="
                                    admin-user-card__username
                                "
                            >
                                @{{ user.username }}
                            </span>


                            <p
                                v-if="
                                    user.bio
                                "
                                class="
                                    admin-user-card__bio
                                "
                            >
                                {{ user.bio }}
                            </p>


                            <p
                                v-else
                                class="
                                    admin-user-card__bio
                                    admin-user-card__bio--empty
                                "
                            >
                                Aucune bio.
                            </p>

                        </div>

                    </div>


                    <!-- =====================================
                         META
                    ====================================== -->

                    <div
                        class="
                            admin-user-card__meta
                        "
                    >

                        <div>

                            <span>
                                Inscription
                            </span>


                            <strong>
                                {{
                                    formatDate(
                                        user.created_at
                                    )
                                }}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Identifiant
                            </span>


                            <code>
                                {{ user.id }}
                            </code>

                        </div>

                    </div>


                    <!-- =====================================
                         ROLE
                    ====================================== -->

                    <div
                        class="
                            admin-user-card__role
                        "
                    >

                        <div>

                            <span
                                class="
                                    admin-user-card__role-label
                                "
                            >
                                Rôle du compte
                            </span>


                            <small>
                                Attention : les administrateurs
                                ont accès à l'espace admin.
                            </small>

                        </div>


                        <select
                            :value="
                                user.role
                            "
                            class="
                                admin-select
                                admin-user-role-select
                            "
                            :disabled="
                                actionLoading
                                ===
                                user.id
                            "
                            @change="
                                handleRoleChange(
                                    user,
                                    $event
                                )
                            "
                        >

                            <option
                                value="user"
                            >
                                Utilisateur
                            </option>


                            <option
                                value="moderator"
                            >
                                Modérateur
                            </option>


                            <option
                                value="admin"
                            >
                                Administrateur
                            </option>

                        </select>

                    </div>


                    <!-- =====================================
                         LOADING
                    ====================================== -->

                    <div
                        v-if="
                            actionLoading
                            ===
                            user.id
                        "
                        class="
                            admin-user-card__loading
                        "
                    >
                        Modification du rôle...
                    </div>

                </article>

            </div>

        </template>

    </section>

</template>