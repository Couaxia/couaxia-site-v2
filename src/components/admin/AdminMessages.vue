<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    deleteAdminContactRequest,
    getAdminContactRequests,
    updateAdminContactRequest
} from "../../services/admin.service";

import type {
    ContactRequest,
    ContactStatus
} from "../../services/contact.service";


/* =========================================================
   TYPES
========================================================= */

type StatusFilter =
    | "all"
    | ContactStatus;


/* =========================================================
   STATE
========================================================= */

const messages =
    ref<ContactRequest[]>(
        []
    );


const loading =
    ref(true);


const errorMessage =
    ref("");


const successMessage =
    ref("");


const search =
    ref("");


const statusFilter =
    ref<StatusFilter>(
        "all"
    );


const selectedMessage =
    ref<ContactRequest | null>(
        null
    );


const adminNote =
    ref("");


const savingNote =
    ref(false);


const deletingId =
    ref<string | null>(
        null
    );


const updatingStatusId =
    ref<string | null>(
        null
    );


/* =========================================================
   COUNTERS
========================================================= */

const newCount =
    computed(
        () =>
            messages.value.filter(
                message =>
                    message.status
                    ===
                    "new"
            ).length
    );


const toReplyCount =
    computed(
        () =>
            messages.value.filter(
                message =>
                    message.status
                    ===
                    "to_reply"
            ).length
    );


const repliedCount =
    computed(
        () =>
            messages.value.filter(
                message =>
                    message.status
                    ===
                    "replied"
            ).length
    );


/* =========================================================
   FILTERED MESSAGES
========================================================= */

const filteredMessages =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return messages.value.filter(
                message => {

                    const matchesStatus =
                        statusFilter.value
                        ===
                        "all"
                        ||
                        message.status
                        ===
                        statusFilter.value;


                    if (
                        !matchesStatus
                    ) {

                        return false;

                    }


                    if (
                        !query
                    ) {

                        return true;

                    }


                    const haystack =
                        [
                            message.name,
                            message.email,
                            message.discord_username,
                            message.subject,
                            message.message,
                            message.reason,
                            message.identity
                        ]
                            .filter(
                                Boolean
                            )
                            .join(
                                " "
                            )
                            .toLowerCase();


                    return haystack.includes(
                        query
                    );

                }
            );

        }
    );


/* =========================================================
   LABELS
========================================================= */

function getReasonLabel(
    reason:
        ContactRequest["reason"]
):
    string {

    const labels:
        Record<
            ContactRequest["reason"],
            string
        > = {

            event:
                "Événement",

            collaboration:
                "Collaboration",

            moderation:
                "Modération",

            sponsorship:
                "Sponsoring / Partenariat",

            art:
                "Création artistique",

            game:
                "Jeu / Clé presse",

            media:
                "Interview / Média",

            community:
                "Projet communautaire",

            report:
                "Problème / Signalement",

            other:
                "Autre"

        };


    return labels[
        reason
    ];

}


function getReasonIcon(
    reason:
        ContactRequest["reason"]
):
    string {

    const icons:
        Record<
            ContactRequest["reason"],
            string
        > = {

            event:
                "🎉",

            collaboration:
                "🤝",

            moderation:
                "🛡️",

            sponsorship:
                "💼",

            art:
                "🎨",

            game:
                "🎮",

            media:
                "🎙️",

            community:
                "🐙",

            report:
                "⚠️",

            other:
                "✉️"

        };


    return icons[
        reason
    ];

}


function getIdentityLabel(
    identity:
        ContactRequest["identity"]
):
    string {

    const labels:
        Record<
            ContactRequest["identity"],
            string
        > = {

            individual:
                "Particulier / POUP",

            creator:
                "Créateur de contenu",

            vtuber:
                "VTuber",

            artist:
                "Artiste",

            association:
                "Association",

            company:
                "Entreprise / Marque",

            studio:
                "Studio / Éditeur",

            media:
                "Média",

            other:
                "Autre"

        };


    return labels[
        identity
    ];

}


function getStatusLabel(
    status:
        ContactStatus
):
    string {

    const labels:
        Record<
            ContactStatus,
            string
        > = {

            new:
                "Nouveau",

            read:
                "Lu",

            to_reply:
                "À répondre",

            replied:
                "Répondu",

            archived:
                "Archivé"

        };


    return labels[
        status
    ];

}


function getStatusIcon(
    status:
        ContactStatus
):
    string {

    const icons:
        Record<
            ContactStatus,
            string
        > = {

            new:
                "🔴",

            read:
                "👁️",

            to_reply:
                "🕓",

            replied:
                "✅",

            archived:
                "📦"

        };


    return icons[
        status
    ];

}


function getPreferenceLabel(
    preference:
        ContactRequest["contact_preference"]
):
    string {

    switch (
        preference
    ) {

        case "email":

            return "E-mail";


        case "discord":

            return "Discord";


        case "either":

            return "E-mail ou Discord";

    }

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
    value:
        string
):
    string {

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle:
                "medium",

            timeStyle:
                "short"
        }
    ).format(
        new Date(
            value
        )
    );

}


/* =========================================================
   LOAD
========================================================= */

async function loadMessages() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        messages.value =
            await getAdminContactRequests();

    }

    catch (
        error
    ) {

        console.error(
            "Erreur chargement messages admin :",
            error
        );


        errorMessage.value =
            error
            instanceof
            Error
                ? error.message
                : "Impossible de charger les messages.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   SELECT MESSAGE
========================================================= */

async function selectMessage(
    message:
        ContactRequest
) {

    selectedMessage.value =
        message;


    adminNote.value =
        message.admin_note
        ??
        "";


    if (
        message.status
        ===
        "new"
    ) {

        await changeStatus(
            message,
            "read"
        );

    }

}


/* =========================================================
   STATUS
========================================================= */

async function changeStatus(
    message:
        ContactRequest,
    status:
        ContactStatus
) {

    if (
        updatingStatusId.value
    ) {

        return;

    }


    updatingStatusId.value =
        message.id;


    errorMessage.value =
        "";


    try {

        const updated =
            await updateAdminContactRequest(
                message.id,
                {
                    status,

                    is_read:
                        status
                        !==
                        "new"
                }
            );


        const index =
            messages.value.findIndex(
                current =>
                    current.id
                    ===
                    message.id
            );


        if (
            index
            !==
            -1
        ) {

            messages.value[
                index
            ] =
                updated;

        }


        if (
            selectedMessage.value?.id
            ===
            message.id
        ) {

            selectedMessage.value =
                updated;

        }

    }

    catch (
        error
    ) {

        console.error(
            "Erreur modification statut :",
            error
        );


        errorMessage.value =
            error
            instanceof
            Error
                ? error.message
                : "Impossible de modifier le statut.";

    }

    finally {

        updatingStatusId.value =
            null;

    }

}


/* =========================================================
   SAVE NOTE
========================================================= */

async function saveAdminNote() {

    if (
        !selectedMessage.value
        ||
        savingNote.value
    ) {

        return;

    }


    savingNote.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const updated =
            await updateAdminContactRequest(
                selectedMessage.value.id,
                {
                    admin_note:
                        adminNote.value
                            .trim()
                        ||
                        null
                }
            );


        const index =
            messages.value.findIndex(
                message =>
                    message.id
                    ===
                    updated.id
            );


        if (
            index
            !==
            -1
        ) {

            messages.value[
                index
            ] =
                updated;

        }


        selectedMessage.value =
            updated;


        successMessage.value =
            "Note enregistrée.";

    }

    catch (
        error
    ) {

        console.error(
            "Erreur sauvegarde note :",
            error
        );


        errorMessage.value =
            error
            instanceof
            Error
                ? error.message
                : "Impossible d'enregistrer la note.";

    }

    finally {

        savingNote.value =
            false;

    }

}


/* =========================================================
   COPY
========================================================= */

async function copyText(
    value:
        string,
    success:
        string
) {

    try {

        await navigator.clipboard.writeText(
            value
        );


        successMessage.value =
            success;


        window.setTimeout(
            () => {

                successMessage.value =
                    "";

            },
            2500
        );

    }

    catch (
        error
    ) {

        console.error(
            "Erreur copie :",
            error
        );


        errorMessage.value =
            "Impossible de copier dans le presse-papiers.";

    }

}


/* =========================================================
   MAIL
========================================================= */

function replyByEmail(
    message:
        ContactRequest
) {

    const subject =
        `Re: ${message.subject}`;


    const body =
        [
            `Bonjour ${message.name},`,
            "",
            "Merci pour votre message.",
            "",
            "",
            "Couaxia"
        ]
            .join(
                "\n"
            );


    const mailto =
        `mailto:${encodeURIComponent(
            message.email
        )}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(
            body
        )}`;


    window.location.href =
        mailto;


    /*
     * On ne passe PAS automatiquement à "Répondu",
     * car ouvrir le logiciel mail ne signifie pas que
     * le message a réellement été envoyé.
     */

}


/* =========================================================
   DELETE
========================================================= */

async function deleteMessage(
    message:
        ContactRequest
) {

    const confirmed =
        window.confirm(
            `Supprimer définitivement le message de ${message.name} ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    deletingId.value =
        message.id;


    errorMessage.value =
        "";


    try {

        await deleteAdminContactRequest(
            message.id
        );


        messages.value =
            messages.value.filter(
                current =>
                    current.id
                    !==
                    message.id
            );


        if (
            selectedMessage.value?.id
            ===
            message.id
        ) {

            selectedMessage.value =
                null;


            adminNote.value =
                "";

        }

    }

    catch (
        error
    ) {

        console.error(
            "Erreur suppression message :",
            error
        );


        errorMessage.value =
            error
            instanceof
            Error
                ? error.message
                : "Impossible de supprimer le message.";

    }

    finally {

        deletingId.value =
            null;

    }

}


/* =========================================================
   INIT
========================================================= */

onMounted(
    () => {

        void loadMessages();

    }
);

</script>


<template>

    <section
        class="admin-messages"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-messages__header"
        >

            <div>

                <span
                    class="admin-messages__eyebrow"
                >
                    📬 CONTACT
                </span>


                <h1>
                    Messages
                </h1>


                <p>
                    Consulte et organise les demandes reçues depuis
                    la page Contact.
                </p>

            </div>


            <button
                type="button"
                class="admin-messages__refresh"
                :disabled="
                    loading
                "
                @click="
                    loadMessages
                "
            >
                🔄 Actualiser
            </button>

        </header>


        <!-- =================================================
             STATS
        ================================================== -->

        <div
            class="admin-messages__stats"
        >

            <article>
                <strong>
                    {{ messages.length }}
                </strong>

                <span>
                    Messages
                </span>
            </article>


            <article>
                <strong>
                    {{ newCount }}
                </strong>

                <span>
                    🔴 Nouveaux
                </span>
            </article>


            <article>
                <strong>
                    {{ toReplyCount }}
                </strong>

                <span>
                    🕓 À répondre
                </span>
            </article>


            <article>
                <strong>
                    {{ repliedCount }}
                </strong>

                <span>
                    ✅ Répondus
                </span>
            </article>

        </div>


        <!-- =================================================
             FEEDBACK
        ================================================== -->

        <div
            v-if="
                errorMessage
            "
            class="
                admin-messages__alert
                admin-messages__alert--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <div
            v-if="
                successMessage
            "
            class="
                admin-messages__alert
                admin-messages__alert--success
            "
        >
            ✅ {{ successMessage }}
        </div>


        <!-- =================================================
             FILTERS
        ================================================== -->

        <div
            class="admin-messages__filters"
        >

            <input
                v-model="
                    search
                "
                type="search"
                placeholder="Rechercher un nom, e-mail, sujet..."
            >


            <select
                v-model="
                    statusFilter
                "
            >
                <option value="all">
                    Tous les statuts
                </option>

                <option value="new">
                    🔴 Nouveau
                </option>

                <option value="read">
                    👁️ Lu
                </option>

                <option value="to_reply">
                    🕓 À répondre
                </option>

                <option value="replied">
                    ✅ Répondu
                </option>

                <option value="archived">
                    📦 Archivé
                </option>
            </select>

        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="
                loading
            "
            class="admin-messages__empty"
        >
            🐙 Chargement des messages...
        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
            v-else-if="
                filteredMessages.length
                ===
                0
            "
            class="admin-messages__empty"
        >
            📭 Aucun message trouvé.
        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div
            v-else
            class="admin-messages__layout"
        >

            <!-- =============================================
                 LIST
            ============================================== -->

            <div
                class="admin-messages__list"
            >

                <button
                    v-for="
                        message
                        in
                        filteredMessages
                    "
                    :key="
                        message.id
                    "
                    type="button"
                    class="admin-message-card"
                    :class="[
                        `admin-message-card--${message.status}`,
                        {
                            'admin-message-card--selected':
                                selectedMessage?.id
                                ===
                                message.id
                        }
                    ]"
                    @click="
                        selectMessage(
                            message
                        )
                    "
                >

                    <div
                        class="admin-message-card__top"
                    >

                        <span
                            class="admin-message-card__reason"
                        >
                            {{ getReasonIcon(message.reason) }}
                            {{ getReasonLabel(message.reason) }}
                        </span>


                        <span
                            class="admin-message-card__status"
                        >
                            {{ getStatusIcon(message.status) }}
                            {{ getStatusLabel(message.status) }}
                        </span>

                    </div>


                    <strong
                        class="admin-message-card__subject"
                    >
                        {{ message.subject }}
                    </strong>


                    <span
                        class="admin-message-card__author"
                    >
                        👤 {{ message.name }}
                    </span>


                    <span
                        class="admin-message-card__preview"
                    >
                        {{ message.message }}
                    </span>


                    <time
                        :datetime="
                            message.created_at
                        "
                    >
                        {{ formatDate(message.created_at) }}
                    </time>

                </button>

            </div>


            <!-- =============================================
                 DETAIL
            ============================================== -->

            <article
                v-if="
                    selectedMessage
                "
                class="admin-message-detail"
            >

                <div
                    class="admin-message-detail__header"
                >

                    <div>

                        <span
                            class="admin-message-detail__reason"
                        >
                            {{ getReasonIcon(selectedMessage.reason) }}
                            {{ getReasonLabel(selectedMessage.reason) }}
                        </span>


                        <h2>
                            {{ selectedMessage.subject }}
                        </h2>

                    </div>


                    <span
                        class="
                            admin-message-detail__status
                        "
                        :class="
                            `admin-message-detail__status--${selectedMessage.status}`
                        "
                    >
                        {{ getStatusIcon(selectedMessage.status) }}
                        {{ getStatusLabel(selectedMessage.status) }}
                    </span>

                </div>


                <!-- =========================================
                     PERSON
                ========================================== -->

                <div
                    class="admin-message-detail__info"
                >

                    <p>
                        <strong>👤 Nom :</strong>
                        {{ selectedMessage.name }}
                    </p>


                    <p>
                        <strong>🏷️ Profil :</strong>
                        {{ getIdentityLabel(selectedMessage.identity) }}
                    </p>


                    <p>
                        <strong>📧 E-mail :</strong>
                        {{ selectedMessage.email }}
                    </p>


                    <p
                        v-if="
                            selectedMessage.discord_username
                        "
                    >
                        <strong>💬 Discord :</strong>
                        {{ selectedMessage.discord_username }}
                    </p>


                    <p>
                        <strong>❤️ Préférence :</strong>
                        {{
                            getPreferenceLabel(
                                selectedMessage.contact_preference
                            )
                        }}
                    </p>


                    <p>
                        <strong>🌐 Langue :</strong>

                        {{
                            selectedMessage.locale
                            ===
                            "fr"
                                ? "Français 🇫🇷"
                                : "English 🇬🇧"
                        }}
                    </p>


                    <p>
                        <strong>📅 Reçu :</strong>
                        {{ formatDate(selectedMessage.created_at) }}
                    </p>

                </div>


                <!-- =========================================
                     MESSAGE
                ========================================== -->

                <section
                    class="admin-message-detail__section"
                >

                    <h3>
                        Message
                    </h3>


                    <p
                        class="admin-message-detail__message"
                    >
                        {{ selectedMessage.message }}
                    </p>

                </section>


                <!-- =========================================
                     LINKS
                ========================================== -->

                <section
                    v-if="
                        selectedMessage.links
                    "
                    class="admin-message-detail__section"
                >

                    <h3>
                        🔗 Liens
                    </h3>


                    <p
                        class="admin-message-detail__message"
                    >
                        {{ selectedMessage.links }}
                    </p>

                </section>


                <!-- =========================================
                     CONTACT ACTIONS
                ========================================== -->

                <div
                    class="admin-message-detail__actions"
                >

                    <button
                        type="button"
                        class="
                            admin-message-action
                            admin-message-action--primary
                        "
                        @click="
                            replyByEmail(
                                selectedMessage
                            )
                        "
                    >
                        📧 Répondre par mail
                    </button>


                    <button
                        type="button"
                        class="admin-message-action"
                        @click="
                            copyText(
                                selectedMessage.email,
                                'Adresse e-mail copiée.'
                            )
                        "
                    >
                        📋 Copier l'adresse
                    </button>


                    <button
                        v-if="
                            selectedMessage.discord_username
                        "
                        type="button"
                        class="admin-message-action"
                        @click="
                            copyText(
                                selectedMessage.discord_username,
                                'Pseudo Discord copié.'
                            )
                        "
                    >
                        💬 Copier Discord
                    </button>

                </div>


                <!-- =========================================
                     STATUS
                ========================================== -->

                <section
                    class="admin-message-detail__section"
                >

                    <h3>
                        Statut
                    </h3>


                    <div
                        class="admin-message-detail__actions"
                    >

                        <button
                            type="button"
                            class="admin-message-action"
                            :disabled="
                                updatingStatusId
                                ===
                                selectedMessage.id
                            "
                            @click="
                                changeStatus(
                                    selectedMessage,
                                    'read'
                                )
                            "
                        >
                            👁️ Marquer comme lu
                        </button>


                        <button
                            type="button"
                            class="admin-message-action"
                            :disabled="
                                updatingStatusId
                                ===
                                selectedMessage.id
                            "
                            @click="
                                changeStatus(
                                    selectedMessage,
                                    'to_reply'
                                )
                            "
                        >
                            🕓 À répondre
                        </button>


                        <button
                            type="button"
                            class="admin-message-action"
                            :disabled="
                                updatingStatusId
                                ===
                                selectedMessage.id
                            "
                            @click="
                                changeStatus(
                                    selectedMessage,
                                    'replied'
                                )
                            "
                        >
                            ✅ Répondu
                        </button>


                        <button
                            type="button"
                            class="admin-message-action"
                            :disabled="
                                updatingStatusId
                                ===
                                selectedMessage.id
                            "
                            @click="
                                changeStatus(
                                    selectedMessage,
                                    'archived'
                                )
                            "
                        >
                            📦 Archiver
                        </button>

                    </div>

                </section>


                <!-- =========================================
                     ADMIN NOTE
                ========================================== -->

                <section
                    class="admin-message-detail__section"
                >

                    <h3>
                        📝 Note privée
                    </h3>


                    <textarea
                        v-model="
                            adminNote
                        "
                        rows="5"
                        maxlength="2000"
                        placeholder="Ajouter une note visible uniquement dans l'administration..."
                    ></textarea>


                    <button
                        type="button"
                        class="
                            admin-message-action
                            admin-message-action--primary
                        "
                        :disabled="
                            savingNote
                        "
                        @click="
                            saveAdminNote
                        "
                    >
                        {{
                            savingNote
                                ? "Enregistrement..."
                                : "💾 Enregistrer la note"
                        }}
                    </button>

                </section>


                <!-- =========================================
                     DELETE
                ========================================== -->

                <div
                    class="admin-message-detail__danger"
                >

                    <button
                        type="button"
                        class="admin-message-delete"
                        :disabled="
                            deletingId
                            ===
                            selectedMessage.id
                        "
                        @click="
                            deleteMessage(
                                selectedMessage
                            )
                        "
                    >
                        🗑
                        {{
                            deletingId
                            ===
                            selectedMessage.id
                                ? "Suppression..."
                                : "Supprimer le message"
                        }}
                    </button>

                </div>

            </article>


            <!-- =============================================
                 NO SELECTION
            ============================================== -->

            <div
                v-else
                class="admin-message-detail admin-message-detail--empty"
            >
                <span>
                    🐙
                </span>

                <strong>
                    Sélectionne un message
                </strong>

                <p>
                    Clique sur une demande pour afficher son contenu.
                </p>
            </div>

        </div>

    </section>

</template>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

.admin-messages {
    display: grid;
    gap: 24px;
    width: 100%;
}


/* =========================================================
   HEADER
========================================================= */

.admin-messages__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
}

.admin-messages__eyebrow {
    color: var(--color-cyan);
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.15em;
}

.admin-messages__header h1 {
    margin: 7px 0;
    color: var(--text-primary);
    font-size: clamp(2rem, 4vw, 3.2rem);
}

.admin-messages__header p {
    margin: 0;
    color: var(--text-secondary);
}

.admin-messages__refresh {
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid var(--border-primary);
    border-radius: 13px;
    color: var(--text-primary);
    background: var(--surface-background);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
}


/* =========================================================
   STATS
========================================================= */

.admin-messages__stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
}

.admin-messages__stats article {
    display: grid;
    gap: 5px;
    padding: 18px;
    border: 1px solid var(--border-primary);
    border-radius: 18px;
    background: var(--surface-background);
}

.admin-messages__stats strong {
    color: var(--text-primary);
    font-size: 1.8rem;
}

.admin-messages__stats span {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 800;
}


/* =========================================================
   ALERT
========================================================= */

.admin-messages__alert {
    padding: 14px 16px;
    border-radius: 14px;
    font-weight: 800;
}

.admin-messages__alert--success {
    color: var(--color-cyan);
    border: 1px solid rgba(34, 242, 239, 0.25);
    background: rgba(34, 242, 239, 0.07);
}

.admin-messages__alert--error {
    color: #ff789b;
    border: 1px solid rgba(255, 120, 155, 0.28);
    background: rgba(255, 120, 155, 0.07);
}


/* =========================================================
   FILTERS
========================================================= */

.admin-messages__filters {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 12px;
}

.admin-messages__filters input,
.admin-messages__filters select,
.admin-message-detail textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border-primary);
    border-radius: 13px;
    outline: none;
    color: var(--text-primary);
    background: var(--surface-background-secondary);
    font: inherit;
}

.admin-messages__filters input,
.admin-messages__filters select {
    min-height: 48px;
    padding: 0 14px;
}

.admin-message-detail textarea {
    min-height: 120px;
    padding: 14px;
    resize: vertical;
}


/* =========================================================
   LAYOUT
========================================================= */

.admin-messages__layout {
    display: grid;
    grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.6fr);
    gap: 20px;
    align-items: start;
}


/* =========================================================
   LIST
========================================================= */

.admin-messages__list {
    display: grid;
    gap: 10px;
    max-height: 900px;
    overflow-y: auto;
}

.admin-message-card {
    display: grid;
    gap: 9px;
    width: 100%;
    padding: 17px;
    box-sizing: border-box;
    border: 1px solid var(--border-primary);
    border-radius: 17px;
    text-align: left;
    color: var(--text-primary);
    background: var(--surface-background);
    font: inherit;
    cursor: pointer;
    transition: 0.2s ease;
}

.admin-message-card:hover,
.admin-message-card--selected {
    border-color: var(--color-pink);
    transform: translateY(-1px);
}

.admin-message-card--new {
    border-left: 4px solid #ff557f;
}

.admin-message-card__top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.admin-message-card__reason,
.admin-message-card__status {
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
}

.admin-message-card__subject {
    font-size: 1rem;
}

.admin-message-card__author,
.admin-message-card time {
    color: var(--text-secondary);
    font-size: 0.75rem;
}

.admin-message-card__preview {
    overflow: hidden;
    color: var(--text-secondary);
    font-size: 0.82rem;
    white-space: nowrap;
    text-overflow: ellipsis;
}


/* =========================================================
   DETAIL
========================================================= */

.admin-message-detail {
    display: grid;
    gap: 22px;
    padding: clamp(20px, 4vw, 30px);
    border: 1px solid var(--border-primary);
    border-radius: 22px;
    background: var(--surface-background);
}

.admin-message-detail__header {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.admin-message-detail__header h2 {
    margin: 7px 0 0;
    color: var(--text-primary);
}

.admin-message-detail__reason {
    color: var(--color-cyan);
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
}

.admin-message-detail__status {
    align-self: flex-start;
    padding: 8px 11px;
    border: 1px solid var(--border-primary);
    border-radius: 999px;
    color: var(--text-secondary);
    font-size: 0.72rem;
    font-weight: 900;
    white-space: nowrap;
}

.admin-message-detail__info {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 20px;
    padding: 18px;
    border-radius: 16px;
    background: var(--surface-background-secondary);
}

.admin-message-detail__info p {
    margin: 0;
    color: var(--text-secondary);
}

.admin-message-detail__info strong {
    color: var(--text-primary);
}

.admin-message-detail__section {
    display: grid;
    gap: 12px;
}

.admin-message-detail__section h3 {
    margin: 0;
    color: var(--text-primary);
}

.admin-message-detail__message {
    margin: 0;
    padding: 18px;
    border: 1px solid var(--border-primary);
    border-radius: 15px;
    color: var(--text-secondary);
    background: var(--surface-background-secondary);
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}


/* =========================================================
   ACTIONS
========================================================= */

.admin-message-detail__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.admin-message-action {
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    color: var(--text-primary);
    background: var(--surface-background-secondary);
    font: inherit;
    font-size: 0.78rem;
    font-weight: 900;
    cursor: pointer;
}

.admin-message-action--primary {
    color: #ffffff;
    border-color: transparent;
    background: linear-gradient(
        135deg,
        var(--color-purple),
        var(--color-pink)
    );
}

.admin-message-action:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}


/* =========================================================
   DELETE
========================================================= */

.admin-message-detail__danger {
    padding-top: 18px;
    border-top: 1px solid var(--border-primary);
}

.admin-message-delete {
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid rgba(255, 90, 125, 0.35);
    border-radius: 12px;
    color: #ff789b;
    background: rgba(255, 90, 125, 0.07);
    font: inherit;
    font-weight: 900;
    cursor: pointer;
}


/* =========================================================
   EMPTY
========================================================= */

.admin-messages__empty,
.admin-message-detail--empty {
    padding: 45px 20px;
    text-align: center;
    color: var(--text-secondary);
}

.admin-message-detail--empty span {
    font-size: 3rem;
}

.admin-message-detail--empty strong {
    color: var(--text-primary);
    font-size: 1.1rem;
}

.admin-message-detail--empty p {
    margin: 0;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

    .admin-messages__layout {
        grid-template-columns: 1fr;
    }

    .admin-messages__list {
        max-height: 450px;
    }

}


@media (max-width: 700px) {

    .admin-messages__header {
        flex-direction: column;
    }

    .admin-messages__stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .admin-messages__filters {
        grid-template-columns: 1fr;
    }

    .admin-message-detail__header {
        flex-direction: column;
    }

    .admin-message-detail__info {
        grid-template-columns: 1fr;
    }

}


@media (max-width: 450px) {

    .admin-messages__stats {
        grid-template-columns: 1fr;
    }

}

</style>