<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

export type AdminTab =
    | "dashboard"
    | "polls"
    | "games"
    | "suggestions"
    | "users"
    | "artworks"
    | "messages"
    | "announcements";


interface AdminSidebarItem {

    id:
        AdminTab;

    label:
        string;

    icon:
        string;

}


/* =========================================================
   PROPS
========================================================= */

const props =
    defineProps<{

        activeTab:
            AdminTab;

    }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{

        changeTab:
            [
                tab:
                    AdminTab
            ];

        goProfile:
            [];

        goHome:
            [];

    }>();


/* =========================================================
   MENU
========================================================= */

const items:
    AdminSidebarItem[] = [

        {
            id:
                "dashboard",

            label:
                "Dashboard",

            icon:
                "📊"
        },

        {
            id:
                "polls",

            label:
                "Sondages",

            icon:
                "🗳️"
        },

        {
            id:
                "games",

            label:
                "Jeux",

            icon:
                "🎮"
        },

        {
            id:
                "suggestions",

            label:
                "Suggestions",

            icon:
                "💡"
        },

        {
            id:
                "users",

            label:
                "Utilisateurs",

            icon:
                "🐙"
        },

        {
            id:
                "artworks",

            label:
                "Arts & Crédits",

            icon:
                "🎨"
        },

        {
            id:
                "messages",

            label:
                "Messages",

            icon:
                "📬"
        },

        {
            id:
                "announcements",

            label:
                "Annonces",

            icon:
                "🔔"
        }

    ];


/* =========================================================
   CHANGE TAB
========================================================= */

function selectTab(
    tab:
        AdminTab
) {

    if (
        props.activeTab
        ===
        tab
    ) {

        return;

    }


    emit(
        "changeTab",
        tab
    );

}


/* =========================================================
   PROFILE
========================================================= */

function goToProfile() {

    emit(
        "goProfile"
    );

}


/* =========================================================
   HOME
========================================================= */

function goToHome() {

    emit(
        "goHome"
    );

}

</script>


<template>

    <aside
        class="admin-sidebar"
    >

        <!-- =================================================
             BRAND
        ================================================== -->

        <div
            class="admin-sidebar__brand"
        >

            <span
                class="
                    admin-sidebar__brand-icon
                "
                aria-hidden="true"
            >
                🐙
            </span>


            <div>

                <span>
                    COUAXIA
                </span>


                <strong>
                    Administration
                </strong>

            </div>

        </div>


        <!-- =================================================
             NAVIGATION
        ================================================== -->

        <nav
            class="admin-sidebar__nav"
            aria-label="Navigation administration"
        >

            <button
                v-for="
                    item
                    in
                    items
                "
                :key="
                    item.id
                "
                type="button"
                class="
                    admin-sidebar__nav-item
                "
                :class="{
                    'admin-sidebar__nav-item--active':
                        activeTab
                        ===
                        item.id
                }"
                :aria-current="
                    activeTab
                    ===
                    item.id
                        ? 'page'
                        : undefined
                "
                @click="
                    selectTab(
                        item.id
                    )
                "
            >

                <span
                    class="
                        admin-sidebar__nav-icon
                    "
                    aria-hidden="true"
                >
                    {{ item.icon }}
                </span>


                <span>
                    {{ item.label }}
                </span>

            </button>

        </nav>


        <!-- =================================================
             FOOTER
        ================================================== -->

        <div
            class="
                admin-sidebar__footer
            "
        >

            <button
                type="button"
                class="
                    admin-sidebar__secondary-action
                "
                @click="
                    goToProfile
                "
            >
                👤 Mon profil
            </button>


            <button
                type="button"
                class="
                    admin-sidebar__secondary-action
                "
                @click="
                    goToHome
                "
            >
                ← Retour au site
            </button>

        </div>

    </aside>

</template>