<script setup lang="ts">

import {
    computed,
    onMounted,
    reactive,
    ref
} from "vue";

import {
    createAdminAnnouncement,
    deleteAdminAnnouncement,
    getAdminAnnouncements,
    updateAdminAnnouncement
} from "../../services/admin.service";

import type {
    AdminAnnouncement,
    AnnouncementPayload,
    AnnouncementType
} from "../../services/admin.service";


/* =========================================================
   STATE
========================================================= */

const announcements =
    ref<AdminAnnouncement[]>([]);

const loading =
    ref(true);

const saving =
    ref(false);

const deletingId =
    ref<string | null>(null);

const formOpen =
    ref(false);

const editing =
    ref(false);

const selectedAnnouncement =
    ref<AdminAnnouncement | null>(null);

const errorMessage =
    ref("");

const successMessage =
    ref("");

const search =
    ref("");

const filter =
    ref<
        "all"
        |
        "published"
        |
        "draft"
        |
        "pinned"
        |
        "important"
    >("all");


/* =========================================================
   TYPES
========================================================= */

const typeOptions:
    Array<{
        value:
            AnnouncementType;

        label:
            string;

        icon:
            string;
    }> = [

        {
            value: "announcement",
            label: "Annonce",
            icon: "📢"
        },

        {
            value: "poll",
            label: "Sondage",
            icon: "🗳️"
        },

        {
            value: "game",
            label: "Jeu",
            icon: "🎮"
        },

        {
            value: "artwork",
            label: "Artwork",
            icon: "🎨"
        },

        {
            value: "lore",
            label: "Lore",
            icon: "📖"
        },

        {
            value: "event",
            label: "Événement",
            icon: "📅"
        },

        {
            value: "stream",
            label: "Stream",
            icon: "🔴"
        },

        {
            value: "other",
            label: "Autre",
            icon: "✨"
        }

    ];


/* =========================================================
   FORM
========================================================= */

interface AnnouncementForm {

    type:
        AnnouncementType;

    title:
        string;

    message:
        string;

    icon:
        string;

    image_url:
        string;

    link_url:
        string;

    link_label:
        string;

    is_published:
        boolean;

    is_pinned:
        boolean;

    is_important:
        boolean;

    published_at:
        string;

    expires_at:
        string;

    source_type:
        string;

    source_id:
        string;

}


function createEmptyForm():
    AnnouncementForm {

    return {

        type:
            "announcement",

        title:
            "",

        message:
            "",

        icon:
            "📢",

        image_url:
            "",

        link_url:
            "",

        link_label:
            "",

        is_published:
            false,

        is_pinned:
            false,

        is_important:
            false,

        published_at:
            "",

        expires_at:
            "",

        source_type:
            "",

        source_id:
            ""

    };

}


const form =
    reactive<AnnouncementForm>(
        createEmptyForm()
    );


function resetForm() {

    Object.assign(
        form,
        createEmptyForm()
    );

}


/* =========================================================
   HELPERS
========================================================= */

function getDefaultIcon(
    type:
        AnnouncementType
):
    string {

    return (
        typeOptions.find(
            option =>
                option.value ===
                type
        )?.icon
        ??
        "✨"
    );

}


function syncIconFromType() {

    form.icon =
        getDefaultIcon(
            form.type
        );

}


function getTypeLabel(
    type:
        AnnouncementType
):
    string {

    return (
        typeOptions.find(
            option =>
                option.value ===
                type
        )?.label
        ??
        "Autre"
    );

}


function toDateTimeLocal(
    value:
        string | null
):
    string {

    if (
        !value
    ) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const pad =
        (
            number:
                number
        ) =>
            String(number)
                .padStart(
                    2,
                    "0"
                );


    return (
        `${date.getFullYear()}-`
        +
        `${pad(date.getMonth() + 1)}-`
        +
        `${pad(date.getDate())}T`
        +
        `${pad(date.getHours())}:`
        +
        `${pad(date.getMinutes())}`
    );

}


function formatDate(
    value:
        string | null
):
    string {

    if (
        !value
    ) {

        return "—";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    ).format(date);

}


/* =========================================================
   LOAD
========================================================= */

async function loadAnnouncements() {

    loading.value =
        true;

    errorMessage.value =
        "";


    try {

        announcements.value =
            await getAdminAnnouncements();

    }

    catch (error) {

        console.error(
            "Erreur chargement annonces :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les annonces.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   STATS
========================================================= */

const stats =
    computed(
        () => ({

            total:
                announcements.value.length,

            published:
                announcements.value.filter(
                    announcement =>
                        announcement.is_published
                ).length,

            drafts:
                announcements.value.filter(
                    announcement =>
                        !announcement.is_published
                ).length,

            important:
                announcements.value.filter(
                    announcement =>
                        announcement.is_important
                ).length

        })
    );


/* =========================================================
   FILTER
========================================================= */

const filteredAnnouncements =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return announcements.value.filter(
                announcement => {

                    const matchesText =
                        !query
                        ||
                        announcement.title
                            .toLowerCase()
                            .includes(query)
                        ||
                        announcement.message
                            .toLowerCase()
                            .includes(query)
                        ||
                        getTypeLabel(
                            announcement.type
                        )
                            .toLowerCase()
                            .includes(query);


                    if (
                        !matchesText
                    ) {

                        return false;

                    }


                    switch (
                        filter.value
                    ) {

                        case "published":
                            return announcement.is_published;

                        case "draft":
                            return !announcement.is_published;

                        case "pinned":
                            return announcement.is_pinned;

                        case "important":
                            return announcement.is_important;

                        default:
                            return true;

                    }

                }
            );

        }
    );


/* =========================================================
   OPEN CREATE
========================================================= */

function openCreate() {

    editing.value =
        false;

    selectedAnnouncement.value =
        null;

    resetForm();

    errorMessage.value =
        "";

    successMessage.value =
        "";

    formOpen.value =
        true;

}


/* =========================================================
   OPEN EDIT
========================================================= */

function openEdit(
    announcement:
        AdminAnnouncement
) {

    editing.value =
        true;

    selectedAnnouncement.value =
        announcement;


    Object.assign(
        form,
        {
            type:
                announcement.type,

            title:
                announcement.title,

            message:
                announcement.message,

            icon:
                announcement.icon
                ??
                getDefaultIcon(
                    announcement.type
                ),

            image_url:
                announcement.image_url
                ??
                "",

            link_url:
                announcement.link_url
                ??
                "",

            link_label:
                announcement.link_label
                ??
                "",

            is_published:
                announcement.is_published,

            is_pinned:
                announcement.is_pinned,

            is_important:
                announcement.is_important,

            published_at:
                toDateTimeLocal(
                    announcement.published_at
                ),

            expires_at:
                toDateTimeLocal(
                    announcement.expires_at
                ),

            source_type:
                announcement.source_type
                ??
                "",

            source_id:
                announcement.source_id
                ??
                ""
        }
    );


    errorMessage.value =
        "";

    successMessage.value =
        "";

    formOpen.value =
        true;

}


/* =========================================================
   CLOSE
========================================================= */

function closeForm() {

    if (
        saving.value
    ) {

        return;

    }


    formOpen.value =
        false;

    editing.value =
        false;

    selectedAnnouncement.value =
        null;

    resetForm();

}


/* =========================================================
   PAYLOAD
========================================================= */

function createPayload():
    AnnouncementPayload {

    const title =
        form.title.trim();


    if (
        !title
    ) {

        throw new Error(
            "Le titre est obligatoire."
        );

    }


    if (
        form.published_at
        &&
        form.expires_at
        &&
        new Date(form.expires_at).getTime()
        <=
        new Date(form.published_at).getTime()
    ) {

        throw new Error(
            "La date d'expiration doit être postérieure à la date de publication."
        );

    }


    return {

        type:
            form.type,

        title,

        message:
            form.message.trim(),

        icon:
            form.icon.trim()
            ||
            getDefaultIcon(
                form.type
            ),

        image_url:
            form.image_url.trim()
            ||
            null,

        link_url:
            form.link_url.trim()
            ||
            null,

        link_label:
            form.link_label.trim()
            ||
            null,

        is_published:
            form.is_published,

        is_pinned:
            form.is_pinned,

        is_important:
            form.is_important,

        published_at:
            form.published_at
                ? new Date(
                    form.published_at
                ).toISOString()
                : null,

        expires_at:
            form.expires_at
                ? new Date(
                    form.expires_at
                ).toISOString()
                : null,

        source_type:
            form.source_type.trim()
            ||
            null,

        source_id:
            form.source_id.trim()
            ||
            null

    };

}


/* =========================================================
   SAVE
========================================================= */

async function saveAnnouncement() {

    if (
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

        const payload =
            createPayload();


        if (
            editing.value
            &&
            selectedAnnouncement.value
        ) {

            await updateAdminAnnouncement(
                selectedAnnouncement.value.id,
                payload
            );


            successMessage.value =
                "Annonce modifiée avec succès.";

        }

        else {

            await createAdminAnnouncement(
                payload
            );


            successMessage.value =
                "Annonce créée avec succès.";

        }


        await loadAnnouncements();


        formOpen.value =
            false;

        editing.value =
            false;

        selectedAnnouncement.value =
            null;

        resetForm();

    }

    catch (error) {

        console.error(
            "Erreur sauvegarde annonce :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'enregistrer l'annonce.";

    }

    finally {

        saving.value =
            false;

    }

}


/* =========================================================
   DELETE
========================================================= */

async function removeAnnouncement(
    announcement:
        AdminAnnouncement
) {

    const confirmed =
        window.confirm(
            `Supprimer définitivement l'annonce "${announcement.title}" ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    deletingId.value =
        announcement.id;

    errorMessage.value =
        "";

    successMessage.value =
        "";


    try {

        await deleteAdminAnnouncement(
            announcement.id
        );


        announcements.value =
            announcements.value.filter(
                current =>
                    current.id !==
                    announcement.id
            );


        successMessage.value =
            "Annonce supprimée.";

    }

    catch (error) {

        console.error(
            "Erreur suppression annonce :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de supprimer l'annonce.";

    }

    finally {

        deletingId.value =
            null;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadAnnouncements
);

</script>


<template>

    <section
        class="admin-announcements"
    >

        <header
            class="admin-announcements__header"
        >

            <div>

                <span
                    class="admin-announcements__eyebrow"
                >
                    🔔 COMMUNICATION
                </span>

                <h1>
                    Annonces & Notifications
                </h1>

                <p>
                    Crée, publie, modifie et supprime les annonces
                    affichées dans les notifications du site.
                </p>

            </div>


            <button
                type="button"
                class="admin-announcements__primary"
                @click="openCreate"
            >
                + Créer une annonce
            </button>

        </header>


        <div
            v-if="errorMessage"
            class="
                admin-announcements__alert
                admin-announcements__alert--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <div
            v-if="successMessage"
            class="
                admin-announcements__alert
                admin-announcements__alert--success
            "
        >
            ✅ {{ successMessage }}
        </div>


        <div
            class="admin-announcements__stats"
        >

            <article>
                <span>Total</span>
                <strong>{{ stats.total }}</strong>
            </article>

            <article>
                <span>Publiées</span>
                <strong>{{ stats.published }}</strong>
            </article>

            <article>
                <span>Brouillons</span>
                <strong>{{ stats.drafts }}</strong>
            </article>

            <article>
                <span>Importantes</span>
                <strong>{{ stats.important }}</strong>
            </article>

        </div>


        <div
            class="admin-announcements__tools"
        >

            <label
                class="admin-announcements__search"
            >
                <span aria-hidden="true">
                    🔎
                </span>

                <input
                    v-model="search"
                    type="search"
                    placeholder="Rechercher une annonce..."
                >
            </label>


            <select
                v-model="filter"
                class="admin-announcements__filter"
            >
                <option value="all">
                    Toutes les annonces
                </option>

                <option value="published">
                    Publiées
                </option>

                <option value="draft">
                    Brouillons
                </option>

                <option value="pinned">
                    Épinglées
                </option>

                <option value="important">
                    Importantes
                </option>
            </select>

        </div>


        <div
            v-if="loading"
            class="admin-announcements__empty"
        >
            Chargement des annonces...
        </div>


        <div
            v-else-if="
                filteredAnnouncements.length === 0
            "
            class="admin-announcements__empty"
        >
            <span aria-hidden="true">
                🔔
            </span>

            <strong>
                Aucune annonce
            </strong>

            <p>
                Crée ta première notification pour les POUP.
            </p>
        </div>


        <div
            v-else
            class="admin-announcements__list"
        >

            <article
                v-for="
                    announcement
                    in
                    filteredAnnouncements
                "
                :key="announcement.id"
                class="announcement-card"
                :class="{
                    'announcement-card--important':
                        announcement.is_important,
                    'announcement-card--pinned':
                        announcement.is_pinned
                }"
            >

                <div
                    class="announcement-card__icon"
                    aria-hidden="true"
                >
                    {{
                        announcement.icon
                        ||
                        getDefaultIcon(
                            announcement.type
                        )
                    }}
                </div>


                <div
                    class="announcement-card__content"
                >

                    <div
                        class="announcement-card__top"
                    >

                        <div>

                            <div
                                class="announcement-card__badges"
                            >
                                <span>
                                    {{
                                        getTypeLabel(
                                            announcement.type
                                        )
                                    }}
                                </span>

                                <span
                                    v-if="announcement.is_published"
                                    class="is-published"
                                >
                                    Publiée
                                </span>

                                <span
                                    v-else
                                    class="is-draft"
                                >
                                    Brouillon
                                </span>

                                <span
                                    v-if="announcement.is_pinned"
                                >
                                    📌 Épinglée
                                </span>

                                <span
                                    v-if="announcement.is_important"
                                    class="is-important"
                                >
                                    ⚠️ Importante
                                </span>
                            </div>


                            <h2>
                                {{ announcement.title }}
                            </h2>

                        </div>


                        <div
                            class="announcement-card__actions"
                        >
                            <button
                                type="button"
                                @click="
                                    openEdit(
                                        announcement
                                    )
                                "
                            >
                                ✏️ Modifier
                            </button>

                            <button
                                type="button"
                                class="is-danger"
                                :disabled="
                                    deletingId ===
                                    announcement.id
                                "
                                @click="
                                    removeAnnouncement(
                                        announcement
                                    )
                                "
                            >
                                {{
                                    deletingId === announcement.id
                                        ? "Suppression..."
                                        : "🗑 Supprimer"
                                }}
                            </button>
                        </div>

                    </div>


                    <p
                        v-if="announcement.message"
                        class="announcement-card__message"
                    >
                        {{ announcement.message }}
                    </p>


                    <img
                        v-if="announcement.image_url"
                        :src="announcement.image_url"
                        :alt="announcement.title"
                        class="announcement-card__image"
                    >


                    <div
                        class="announcement-card__meta"
                    >
                        <span>
                            Créée :
                            {{
                                formatDate(
                                    announcement.created_at
                                )
                            }}
                        </span>

                        <span
                            v-if="announcement.published_at"
                        >
                            Publication :
                            {{
                                formatDate(
                                    announcement.published_at
                                )
                            }}
                        </span>

                        <span
                            v-if="announcement.expires_at"
                        >
                            Expiration :
                            {{
                                formatDate(
                                    announcement.expires_at
                                )
                            }}
                        </span>
                    </div>

                </div>

            </article>

        </div>


        <Teleport to="body">

            <div
                v-if="formOpen"
                class="announcement-modal"
                @click.self="closeForm"
            >

                <div
                    class="announcement-modal__dialog"
                >

                    <header
                        class="announcement-modal__header"
                    >
                        <div>
                            <span>
                                🔔 NOTIFICATION
                            </span>

                            <h2>
                                {{
                                    editing
                                        ? "Modifier l'annonce"
                                        : "Créer une annonce"
                                }}
                            </h2>
                        </div>

                        <button
                            type="button"
                            :disabled="saving"
                            @click="closeForm"
                        >
                            ✕
                        </button>
                    </header>


                    <form
                        class="announcement-form"
                        @submit.prevent="saveAnnouncement"
                    >

                        <div
                            class="announcement-form__grid"
                        >
                            <label>
                                <span>Type</span>

                                <select
                                    v-model="form.type"
                                    @change="syncIconFromType"
                                >
                                    <option
                                        v-for="option in typeOptions"
                                        :key="option.value"
                                        :value="option.value"
                                    >
                                        {{ option.icon }}
                                        {{ option.label }}
                                    </option>
                                </select>
                            </label>


                            <label>
                                <span>Icône</span>

                                <input
                                    v-model="form.icon"
                                    type="text"
                                    maxlength="12"
                                    placeholder="📢"
                                >
                            </label>
                        </div>


                        <label>
                            <span>Titre *</span>

                            <input
                                v-model="form.title"
                                type="text"
                                maxlength="160"
                                required
                                placeholder="Ex : Soirée communautaire !"
                            >
                        </label>


                        <label>
                            <span>Message</span>

                            <textarea
                                v-model="form.message"
                                rows="5"
                                placeholder="Ton message pour les POUP..."
                            ></textarea>
                        </label>


                        <label>
                            <span>URL de l'image</span>

                            <input
                                v-model="form.image_url"
                                type="url"
                                placeholder="https://..."
                            >
                        </label>


                        <img
                            v-if="form.image_url"
                            :src="form.image_url"
                            alt="Aperçu de l'annonce"
                            class="announcement-form__preview"
                        >


                        <div
                            class="announcement-form__grid"
                        >
                            <label>
                                <span>Lien</span>

                                <input
                                    v-model="form.link_url"
                                    type="url"
                                    placeholder="https://..."
                                >
                            </label>

                            <label>
                                <span>Texte du bouton</span>

                                <input
                                    v-model="form.link_label"
                                    type="text"
                                    placeholder="En savoir plus"
                                >
                            </label>
                        </div>


                        <div
                            class="announcement-form__options"
                        >
                            <label>
                                <input
                                    v-model="form.is_published"
                                    type="checkbox"
                                >

                                <span>
                                    <strong>
                                        👁️ Publier
                                    </strong>
                                    <small>
                                        Visible dans les notifications.
                                    </small>
                                </span>
                            </label>

                            <label>
                                <input
                                    v-model="form.is_pinned"
                                    type="checkbox"
                                >

                                <span>
                                    <strong>
                                        📌 Épingler
                                    </strong>
                                    <small>
                                        Affichée en priorité.
                                    </small>
                                </span>
                            </label>

                            <label>
                                <input
                                    v-model="form.is_important"
                                    type="checkbox"
                                >

                                <span>
                                    <strong>
                                        ⚠️ Important
                                    </strong>
                                    <small>
                                        Mise en avant spéciale.
                                    </small>
                                </span>
                            </label>
                        </div>


                        <div
                            class="announcement-form__grid"
                        >
                            <label>
                                <span>Publication</span>

                                <input
                                    v-model="form.published_at"
                                    type="datetime-local"
                                >

                                <small>
                                    Vide = maintenant si publiée.
                                </small>
                            </label>

                            <label>
                                <span>Expiration</span>

                                <input
                                    v-model="form.expires_at"
                                    type="datetime-local"
                                >

                                <small>
                                    Facultatif.
                                </small>
                            </label>
                        </div>


                        <details
                            class="announcement-form__advanced"
                        >
                            <summary>
                                Paramètres avancés
                            </summary>

                            <div
                                class="announcement-form__grid"
                            >
                                <label>
                                    <span>Type source</span>

                                    <input
                                        v-model="form.source_type"
                                        type="text"
                                        placeholder="game, poll..."
                                    >
                                </label>

                                <label>
                                    <span>ID source</span>

                                    <input
                                        v-model="form.source_id"
                                        type="text"
                                        placeholder="ID lié"
                                    >
                                </label>
                            </div>
                        </details>


                        <footer
                            class="announcement-form__actions"
                        >
                            <button
                                type="button"
                                :disabled="saving"
                                @click="closeForm"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                class="is-primary"
                                :disabled="saving"
                            >
                                {{
                                    saving
                                        ? "Enregistrement..."
                                        : editing
                                            ? "💾 Enregistrer"
                                            : "🔔 Créer l'annonce"
                                }}
                            </button>
                        </footer>

                    </form>

                </div>

            </div>

        </Teleport>

    </section>

</template>


<style>

.admin-announcements {
    display: flex;
    flex-direction: column;
    gap: 26px;
    padding: 6px 4px 80px;
}

.admin-announcements__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-announcements__eyebrow {
    display: inline-block;
    margin-bottom: 8px;
    color: #22f2ef;
    font-size: 0.84rem;
    font-weight: 900;
    letter-spacing: 0.18em;
}

.admin-announcements__header h1 {
    margin: 0;
    color: #fff;
    font-size: clamp(2rem, 4vw, 3rem);
}

.admin-announcements__header p {
    max-width: 680px;
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.52);
    line-height: 1.65;
}

.admin-announcements__primary {
    min-height: 58px;
    padding: 0 24px;
    border: 1px solid rgba(255, 0, 174, 0.7);
    border-radius: 18px;
    background: linear-gradient(135deg, #9f20ff, #f000ad);
    color: #fff;
    font: inherit;
    font-weight: 900;
    cursor: pointer;
}

.admin-announcements__alert {
    padding: 16px 20px;
    border-radius: 16px;
    font-weight: 800;
}

.admin-announcements__alert--error {
    border: 1px solid rgba(255, 72, 117, 0.42);
    background: rgba(98, 8, 35, 0.35);
    color: #ff9db7;
}

.admin-announcements__alert--success {
    border: 1px solid rgba(34, 242, 239, 0.3);
    background: rgba(34, 242, 239, 0.08);
    color: #62fffc;
}

.admin-announcements__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
}

.admin-announcements__stats article {
    min-height: 120px;
    padding: 24px;
    border: 1px solid rgba(150, 54, 196, 0.24);
    border-radius: 24px;
    background: linear-gradient(
        145deg,
        rgba(33, 8, 47, 0.94),
        rgba(14, 8, 20, 0.96)
    );
}

.admin-announcements__stats span {
    display: block;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 800;
}

.admin-announcements__stats strong {
    color: #fff;
    font-size: 2.2rem;
}

.admin-announcements__tools {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 18px;
}

.admin-announcements__search {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 58px;
    padding: 0 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    background: rgba(15, 9, 19, 0.9);
}

.admin-announcements__search input,
.admin-announcements__filter {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #fff;
    font: inherit;
}

.admin-announcements__filter {
    min-height: 58px;
    padding: 0 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    background: #100a16;
}

.admin-announcements__filter option {
    background: #100a16;
}

.admin-announcements__empty {
    display: grid;
    place-items: center;
    min-height: 260px;
    padding: 40px;
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    color: rgba(255, 255, 255, 0.55);
    text-align: center;
}

.admin-announcements__empty > span {
    font-size: 2.4rem;
}

.admin-announcements__empty strong {
    margin-top: 12px;
    color: #fff;
    font-size: 1.35rem;
}

.admin-announcements__list {
    display: grid;
    gap: 18px;
}

.announcement-card {
    display: grid;
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 20px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    background: rgba(16, 9, 22, 0.94);
}

.announcement-card--pinned {
    border-color: rgba(34, 242, 239, 0.3);
}

.announcement-card--important {
    box-shadow: inset 4px 0 0 #ff4a88;
}

.announcement-card__icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border: 1px solid rgba(161, 53, 219, 0.35);
    border-radius: 20px;
    background: rgba(91, 11, 120, 0.28);
    font-size: 1.8rem;
}

.announcement-card__top {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.announcement-card__top h2 {
    margin: 10px 0 0;
    color: #fff;
}

.announcement-card__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.announcement-card__badges span {
    padding: 6px 10px;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    font-weight: 900;
}

.announcement-card__badges .is-published {
    color: #55f9f6;
}

.announcement-card__badges .is-important {
    color: #ff7da8;
}

.announcement-card__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
}

.announcement-card__actions button,
.announcement-form__actions button {
    min-height: 44px;
    padding: 0 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}

.announcement-card__actions .is-danger {
    border-color: rgba(255, 74, 136, 0.28);
    color: #ff8eb4;
}

.announcement-card__message {
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.65;
    white-space: pre-wrap;
}

.announcement-card__image {
    display: block;
    width: min(100%, 620px);
    max-height: 320px;
    margin-top: 18px;
    border-radius: 18px;
    object-fit: cover;
}

.announcement-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.78rem;
}

.announcement-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(4, 0, 8, 0.78);
    backdrop-filter: blur(12px);
}

.announcement-modal__dialog {
    width: min(920px, 100%);
    max-height: calc(100vh - 48px);
    overflow: auto;
    border: 1px solid rgba(172, 40, 214, 0.35);
    border-radius: 30px;
    background: #12091b;
}

.announcement-modal__header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 26px 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(18, 9, 27, 0.97);
}

.announcement-modal__header span {
    color: #22f2ef;
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.16em;
}

.announcement-modal__header h2 {
    margin: 8px 0 0;
    color: #fff;
}

.announcement-modal__header > button {
    width: 48px;
    height: 48px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    cursor: pointer;
}

.announcement-form {
    display: grid;
    gap: 22px;
    padding: 30px;
}

.announcement-form label {
    display: grid;
    gap: 9px;
    color: #fff;
    font-weight: 800;
}

.announcement-form input,
.announcement-form textarea,
.announcement-form select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 16px;
    outline: 0;
    background: #0c0712;
    color: #fff;
    font: inherit;
}

.announcement-form input,
.announcement-form select {
    min-height: 54px;
    padding: 0 16px;
}

.announcement-form textarea {
    min-height: 130px;
    padding: 16px;
    resize: vertical;
}

.announcement-form small {
    color: rgba(255, 255, 255, 0.42);
}

.announcement-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

.announcement-form__preview {
    width: min(100%, 560px);
    max-height: 300px;
    border-radius: 18px;
    object-fit: cover;
}

.announcement-form__options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

.announcement-form__options label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 12px;
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.025);
}

.announcement-form__options input {
    width: 20px;
    min-height: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: #ec00b5;
}

.announcement-form__options strong,
.announcement-form__options small {
    display: block;
}

.announcement-form__advanced {
    padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
}

.announcement-form__advanced summary {
    color: #fff;
    font-weight: 900;
    cursor: pointer;
}

.announcement-form__advanced .announcement-form__grid {
    margin-top: 18px;
}

.announcement-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.announcement-form__actions .is-primary {
    border-color: rgba(255, 0, 174, 0.7);
    background: linear-gradient(135deg, #9f20ff, #f000ad);
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

@media (max-width: 950px) {

    .admin-announcements__stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .admin-announcements__tools,
    .announcement-form__grid,
    .announcement-form__options {
        grid-template-columns: 1fr;
    }

    .announcement-card__top,
    .admin-announcements__header {
        flex-direction: column;
    }

}

@media (max-width: 640px) {

    .admin-announcements__stats {
        grid-template-columns: 1fr;
    }

    .announcement-card {
        grid-template-columns: 1fr;
    }

    .announcement-modal {
        padding: 0;
    }

    .announcement-modal__dialog {
        min-height: 100vh;
        max-height: 100vh;
        border-radius: 0;
    }

}


/* =========================================================
   LIGHT MODE
========================================================= */

html[data-theme="light"] .admin-announcements {
    color: #48135d;
}


/* =========================================================
   LIGHT MODE — HEADER
========================================================= */

html[data-theme="light"] .admin-announcements__header {
    border-bottom-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-announcements__eyebrow {
    color: #008f91;
}

html[data-theme="light"] .admin-announcements__header h1 {
    color: #48135d;
}

html[data-theme="light"] .admin-announcements__header p {
    color: #74527f;
}


/* =========================================================
   LIGHT MODE — ALERTS
========================================================= */

html[data-theme="light"] .admin-announcements__alert--error {
    color: #c62563;
    background: rgba(198, 37, 99, 0.07);
    border-color: rgba(198, 37, 99, 0.25);
}

html[data-theme="light"] .admin-announcements__alert--success {
    color: #087c68;
    background: rgba(8, 124, 104, 0.07);
    border-color: rgba(8, 124, 104, 0.24);
}


/* =========================================================
   LIGHT MODE — STATS
========================================================= */

html[data-theme="light"] .admin-announcements__stats article {
    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );

    border-color: rgba(109, 0, 163, 0.18);

    box-shadow:
        0
        14px
        34px
        rgba(72, 19, 93, 0.10);
}

html[data-theme="light"] .admin-announcements__stats span {
    color: #74527f;
}

html[data-theme="light"] .admin-announcements__stats strong {
    color: #48135d;
}


/* =========================================================
   LIGHT MODE — SEARCH / FILTER
========================================================= */

html[data-theme="light"] .admin-announcements__search {
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);

    box-shadow:
        0
        10px
        26px
        rgba(72, 19, 93, 0.07);
}

html[data-theme="light"] .admin-announcements__search input {
    color: #48135d;
}

html[data-theme="light"] .admin-announcements__search input::placeholder {
    color: #9b82a3;
}

html[data-theme="light"] .admin-announcements__filter {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .admin-announcements__filter option {
    color: #48135d;
    background: #ffffff;
}


/* =========================================================
   LIGHT MODE — EMPTY
========================================================= */

html[data-theme="light"] .admin-announcements__empty {
    color: #74527f;
    background: rgba(255, 255, 255, 0.72);
    border-color: rgba(109, 0, 163, 0.18);

    box-shadow:
        0
        12px
        28px
        rgba(72, 19, 93, 0.07);
}

html[data-theme="light"] .admin-announcements__empty strong {
    color: #48135d;
}


/* =========================================================
   LIGHT MODE — ANNOUNCEMENT CARDS
========================================================= */

html[data-theme="light"] .announcement-card {
    color: #48135d;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );

    border-color: rgba(109, 0, 163, 0.18);

    box-shadow:
        0
        16px
        38px
        rgba(72, 19, 93, 0.10);
}

html[data-theme="light"] .announcement-card--pinned {
    border-color: rgba(0, 143, 145, 0.28);
}

html[data-theme="light"] .announcement-card--important {
    box-shadow:
        inset 4px 0 0 #c62563,
        0
        16px
        38px
        rgba(72, 19, 93, 0.10);
}

html[data-theme="light"] .announcement-card__icon {
    background: rgba(109, 0, 163, 0.07);
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .announcement-card__top h2 {
    color: #48135d;
}

html[data-theme="light"] .announcement-card__badges span {
    color: #74527f;
    background: rgba(109, 0, 163, 0.035);
    border-color: rgba(109, 0, 163, 0.14);
}

html[data-theme="light"] .announcement-card__badges .is-published {
    color: #008f91;
}

html[data-theme="light"] .announcement-card__badges .is-draft {
    color: #8a5a00;
}

html[data-theme="light"] .announcement-card__badges .is-important {
    color: #c62563;
}

html[data-theme="light"] .announcement-card__message {
    color: #74527f;
}

html[data-theme="light"] .announcement-card__meta {
    color: #9b82a3;
}


/* =========================================================
   LIGHT MODE — CARD ACTIONS
========================================================= */

html[data-theme="light"] .announcement-card__actions button,
html[data-theme="light"] .announcement-form__actions button {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .announcement-card__actions button:hover,
html[data-theme="light"] .announcement-form__actions button:hover {
    background: #f6eefe;
    border-color: rgba(194, 24, 120, 0.25);
}

html[data-theme="light"] .announcement-card__actions .is-danger {
    color: #c62563;
    background: rgba(198, 37, 99, 0.055);
    border-color: rgba(198, 37, 99, 0.24);
}


/* =========================================================
   LIGHT MODE — MODAL
========================================================= */

html[data-theme="light"] .announcement-modal {
    background: rgba(72, 19, 93, 0.28);
}

html[data-theme="light"] .announcement-modal__dialog {
    color: #48135d;

    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );

    border-color: rgba(109, 0, 163, 0.20);

    box-shadow:
        0
        28px
        80px
        rgba(72, 19, 93, 0.22);
}

html[data-theme="light"] .announcement-modal__header {
    background: rgba(255, 251, 255, 0.97);
    border-bottom-color: rgba(109, 0, 163, 0.15);
}

html[data-theme="light"] .announcement-modal__header span {
    color: #008f91;
}

html[data-theme="light"] .announcement-modal__header h2 {
    color: #48135d;
}

html[data-theme="light"] .announcement-modal__header > button {
    color: #48135d;
    background: #f7eefb;
    border-color: rgba(109, 0, 163, 0.16);
}


/* =========================================================
   LIGHT MODE — FORM
========================================================= */

html[data-theme="light"] .announcement-form {
    color: #48135d;
}

html[data-theme="light"] .announcement-form label {
    color: #48135d;
}

html[data-theme="light"] .announcement-form input,
html[data-theme="light"] .announcement-form textarea,
html[data-theme="light"] .announcement-form select {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .announcement-form input::placeholder,
html[data-theme="light"] .announcement-form textarea::placeholder {
    color: #9b82a3;
}

html[data-theme="light"] .announcement-form select option {
    color: #48135d;
    background: #ffffff;
}

html[data-theme="light"] .announcement-form small {
    color: #74527f;
}

html[data-theme="light"] .announcement-form__options label {
    color: #48135d;
    background: #f7eefb;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .announcement-form__advanced {
    background: rgba(255, 255, 255, 0.58);
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .announcement-form__advanced summary {
    color: #48135d;
}

html[data-theme="light"] .announcement-form__actions {
    border-top-color: rgba(109, 0, 163, 0.13);
}

html[data-theme="light"] .announcement-form__actions .is-primary {
    color: #ffffff;

    background:
        linear-gradient(
            135deg,
            #9f20ff,
            #f000ad
        );

    border-color: rgba(255, 0, 174, 0.7);
}


/* =========================================================
   LIGHT MODE — PREVIEW
========================================================= */

html[data-theme="light"] .announcement-form__preview,
html[data-theme="light"] .announcement-card__image {
    background: #efe4f4;
}


/* =========================================================
   LIGHT MODE — FOCUS
========================================================= */

html[data-theme="light"] .announcement-form input:focus,
html[data-theme="light"] .announcement-form textarea:focus,
html[data-theme="light"] .announcement-form select:focus,
html[data-theme="light"] .admin-announcements__filter:focus,
html[data-theme="light"] .admin-announcements__search:focus-within {
    border-color: rgba(194, 24, 120, 0.45);

    box-shadow:
        0
        0
        0
        3px
        rgba(194, 24, 120, 0.08);
}


</style>
