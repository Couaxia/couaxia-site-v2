<script setup lang="ts">

import {
    computed,
    ref
} from "vue";

import {
    createContactRequest
} from "../services/contact.service";

import {
    useI18n
} from "../local/i18n";

import type {
    ContactIdentity,
    ContactPreference,
    ContactReason
} from "../services/contact.service";


/* =========================================================
   I18N
========================================================= */

const {
    locale,
    t,
    setLocale
} =
    useI18n();


/* =========================================================
   FORM
========================================================= */

const name =
    ref("");


const email =
    ref("");


const identity =
    ref<ContactIdentity>(
        "individual"
    );


const reason =
    ref<ContactReason>(
        "collaboration"
    );


const subject =
    ref("");


const message =
    ref("");


const links =
    ref("");


const contactPreference =
    ref<ContactPreference>(
        "email"
    );


const discordUsername =
    ref("");


const consent =
    ref(false);


const submitting =
    ref(false);


const successMessage =
    ref("");


const errorMessage =
    ref("");


/* =========================================================
   OPTIONS
========================================================= */

const identityOptions:
    ContactIdentity[] = [
        "individual",
        "creator",
        "vtuber",
        "artist",
        "association",
        "company",
        "studio",
        "media",
        "other"
    ];


const reasonOptions:
    ContactReason[] = [
        "event",
        "collaboration",
        "moderation",
        "sponsorship",
        "art",
        "game",
        "media",
        "community",
        "report",
        "other"
    ];


const contactPreferenceOptions:
    ContactPreference[] = [
        "email",
        "discord",
        "either"
    ];


/* =========================================================
   CONTACT PREFERENCE LABEL
========================================================= */

function getContactPreferenceLabel(
    preference:
        ContactPreference
):
    string {

    if (
        locale.value
        ===
        "fr"
    ) {

        switch (
            preference
        ) {

            case "email":

                return "E-mail";


            case "discord":

                return "Discord";


            case "either":

                return "Peu importe";

        }

    }


    switch (
        preference
    ) {

        case "email":

            return "Email";


        case "discord":

            return "Discord";


        case "either":

            return "Either";

    }

}


/* =========================================================
   SHOW DISCORD FIELD
========================================================= */

const showDiscordField =
    computed(
        () =>
            contactPreference.value
            ===
            "discord"
            ||
            contactPreference.value
            ===
            "either"
    );


/* =========================================================
   VALIDATION
========================================================= */

const emailValid =
    computed(
        () =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(
                    email.value.trim()
                )
    );


const discordValid =
    computed(
        () => {

            if (
                !showDiscordField.value
            ) {

                return true;

            }


            return Boolean(
                discordUsername.value
                    .trim()
            );

        }
    );


const canSubmit =
    computed(
        () =>
            Boolean(
                name.value.trim()
            )
            &&
            emailValid.value
            &&
            Boolean(
                subject.value.trim()
            )
            &&
            Boolean(
                message.value.trim()
            )
            &&
            discordValid.value
            &&
            consent.value
            &&
            !submitting.value
    );


/* =========================================================
   RESET
========================================================= */

function resetForm() {

    name.value =
        "";


    email.value =
        "";


    identity.value =
        "individual";


    reason.value =
        "collaboration";


    subject.value =
        "";


    message.value =
        "";


    links.value =
        "";


    contactPreference.value =
        "email";


    discordUsername.value =
        "";


    consent.value =
        false;

}


/* =========================================================
   MASCOT
========================================================= */

function sendMascotMessage(
    content:
        string
) {

    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message:
                        content
                }
            }
        )
    );

}


/* =========================================================
   SUBMIT
========================================================= */

async function submitContact() {

    if (
        !canSubmit.value
    ) {

        return;

    }


    submitting.value =
        true;


    successMessage.value =
        "";


    errorMessage.value =
        "";


    try {

        await createContactRequest(
            {
                name:
                    name.value,

                email:
                    email.value,

                identity:
                    identity.value,

                reason:
                    reason.value,

                subject:
                    subject.value,

                message:
                    message.value,

                links:
                    links.value,

                contact_preference:
                    contactPreference.value,

                discord_username:
                    showDiscordField.value
                        ? discordUsername.value
                        : null,

                locale:
                    locale.value
            }
        );


        successMessage.value =
            t(
                "contact.messages.success"
            );


        sendMascotMessage(
            t(
                "contact.messages.success"
            )
        );


        resetForm();

    }

    catch (
        error
    ) {

        console.error(
            "Erreur envoi formulaire contact :",
            error
        );


        errorMessage.value =
            error
            instanceof
            Error
                ? error.message
                : t(
                    "contact.messages.error"
                );

    }

    finally {

        submitting.value =
            false;

    }

}

</script>


<template>

    <main
        class="contact-page"
    >

        <!-- =================================================
             HERO
        ================================================== -->

        <section
            class="contact-hero"
        >

            <!-- =============================================
                 LANGUAGE
            ============================================== -->

            <div
                class="contact-hero__language"
            >

                <button
                    type="button"
                    :class="{
                        'is-active':
                            locale
                            ===
                            'fr'
                    }"
                    @click="
                        setLocale(
                            'fr'
                        )
                    "
                >
                    🇫🇷 FR
                </button>


                <button
                    type="button"
                    :class="{
                        'is-active':
                            locale
                            ===
                            'en'
                    }"
                    @click="
                        setLocale(
                            'en'
                        )
                    "
                >
                    🇬🇧 EN
                </button>

            </div>


            <span
                class="
                    contact-hero__eyebrow
                "
            >
                🐙 {{ t("contact.eyebrow") }}
            </span>


            <h1>
                {{ t("contact.title") }}
            </h1>


            <p>
                {{ t("contact.subtitle") }}
            </p>

        </section>


        <!-- =================================================
             FORM
        ================================================== -->

        <section
            class="contact-section"
        >

            <form
                class="contact-form"
                @submit.prevent="
                    submitContact
                "
            >

                <!-- =========================================
                     NAME
                ========================================== -->

                <div
                    class="contact-field"
                >

                    <label
                        for="contact-name"
                    >
                        {{ t("contact.form.name") }} *
                    </label>


                    <input
                        id="contact-name"
                        v-model="
                            name
                        "
                        type="text"
                        maxlength="80"
                        autocomplete="name"
                        required
                    >

                </div>


                <!-- =========================================
                     EMAIL
                ========================================== -->

                <div
                    class="contact-field"
                >

                    <label
                        for="contact-email"
                    >
                        {{ t("contact.form.email") }} *
                    </label>


                    <input
                        id="contact-email"
                        v-model="
                            email
                        "
                        type="email"
                        maxlength="160"
                        autocomplete="email"
                        required
                    >

                </div>


                <!-- =========================================
                     IDENTITY
                ========================================== -->

                <div
                    class="contact-field"
                >

                    <label
                        for="contact-identity"
                    >
                        {{ t("contact.form.identity") }}
                    </label>


                    <select
                        id="contact-identity"
                        v-model="
                            identity
                        "
                    >

                        <option
                            v-for="
                                option
                                in
                                identityOptions
                            "
                            :key="
                                option
                            "
                            :value="
                                option
                            "
                        >
                            {{
                                t(
                                    `contact.identities.${option}`
                                )
                            }}
                        </option>

                    </select>

                </div>


                <!-- =========================================
                     REASON
                ========================================== -->

                <div
                    class="contact-field"
                >

                    <label
                        for="contact-reason"
                    >
                        {{ t("contact.form.reason") }} *
                    </label>


                    <select
                        id="contact-reason"
                        v-model="
                            reason
                        "
                        required
                    >

                        <option
                            v-for="
                                option
                                in
                                reasonOptions
                            "
                            :key="
                                option
                            "
                            :value="
                                option
                            "
                        >
                            {{
                                t(
                                    `contact.reasons.${option}`
                                )
                            }}
                        </option>

                    </select>

                </div>


                <!-- =========================================
                     SUBJECT
                ========================================== -->

                <div
                    class="
                        contact-field
                        contact-field--full
                    "
                >

                    <label
                        for="contact-subject"
                    >
                        {{ t("contact.form.subject") }} *
                    </label>


                    <input
                        id="contact-subject"
                        v-model="
                            subject
                        "
                        type="text"
                        maxlength="180"
                        required
                    >

                </div>


                <!-- =========================================
                     MESSAGE
                ========================================== -->

                <div
                    class="
                        contact-field
                        contact-field--full
                    "
                >

                    <label
                        for="contact-message"
                    >
                        {{ t("contact.form.message") }} *
                    </label>


                    <textarea
                        id="contact-message"
                        v-model="
                            message
                        "
                        maxlength="5000"
                        rows="9"
                        required
                    ></textarea>

                </div>


                <!-- =========================================
                     LINKS
                ========================================== -->

                <div
                    class="
                        contact-field
                        contact-field--full
                    "
                >

                    <label
                        for="contact-links"
                    >
                        {{ t("contact.form.links") }}
                    </label>


                    <textarea
                        id="contact-links"
                        v-model="
                            links
                        "
                        maxlength="1500"
                        rows="3"
                        :placeholder="
                            locale
                            ===
                            'fr'
                                ? 'Twitch, YouTube, site, portfolio...'
                                : 'Twitch, YouTube, website, portfolio...'
                        "
                    ></textarea>

                </div>


                <!-- =========================================
                     CONTACT PREFERENCE
                ========================================== -->

                <fieldset
                    class="
                        contact-preference
                        contact-field--full
                    "
                >

                    <legend>

                        {{
                            locale
                            ===
                            "fr"
                                ? "Comment préférez-vous être contacté ?"
                                : "How would you prefer to be contacted?"
                        }}

                        *

                    </legend>


                    <div
                        class="
                            contact-preference__options
                        "
                    >

                        <label
                            v-for="
                                option
                                in
                                contactPreferenceOptions
                            "
                            :key="
                                option
                            "
                            class="
                                contact-preference__option
                            "
                            :class="{
                                'contact-preference__option--selected':
                                    contactPreference
                                    ===
                                    option
                            }"
                        >

                            <input
                                v-model="
                                    contactPreference
                                "
                                type="radio"
                                name="contact-preference"
                                :value="
                                    option
                                "
                            >


                            <span
                                class="
                                    contact-preference__icon
                                "
                                aria-hidden="true"
                            >

                                {{
                                    option
                                    ===
                                    "email"
                                        ? "📧"
                                        : (
                                            option
                                            ===
                                            "discord"
                                                ? "💬"
                                                : "✨"
                                        )
                                }}

                            </span>


                            <span>

                                {{
                                    getContactPreferenceLabel(
                                        option
                                    )
                                }}

                            </span>

                        </label>

                    </div>

                </fieldset>


                <!-- =========================================
                     DISCORD
                ========================================== -->

                <div
                    v-if="
                        showDiscordField
                    "
                    class="
                        contact-field
                        contact-field--full
                        contact-discord-field
                    "
                >

                    <label
                        for="contact-discord"
                    >

                        💬

                        {{
                            locale
                            ===
                            "fr"
                                ? "Pseudo Discord"
                                : "Discord username"
                        }}

                        *

                    </label>


                    <input
                        id="contact-discord"
                        v-model="
                            discordUsername
                        "
                        type="text"
                        maxlength="100"
                        autocomplete="off"
                        :placeholder="
                            locale
                            ===
                            'fr'
                                ? '@Hylda ou hylda'
                                : '@Hylda or hylda'
                        "
                        required
                    >


                    <small>

                        {{
                            locale
                            ===
                            "fr"
                                ? "Indique le pseudo permettant de te retrouver sur Discord."
                                : "Enter the username I can use to find you on Discord."
                        }}

                    </small>

                </div>


                <!-- =========================================
                     CONSENT
                ========================================== -->

                <label
                    class="
                        contact-consent
                        contact-field--full
                    "
                >

                    <input
                        v-model="
                            consent
                        "
                        type="checkbox"
                    >


                    <span>

                        {{
                            locale
                            ===
                            "fr"
                                ? "J'accepte que les informations envoyées soient utilisées afin de répondre à ma demande."
                                : "I agree that the information I submit may be used to respond to my request."
                        }}

                    </span>

                </label>


                <!-- =========================================
                     MESSAGES
                ========================================== -->

                <div
                    v-if="
                        successMessage
                    "
                    class="
                        contact-message
                        contact-message--success
                    "
                >
                    ✅ {{ successMessage }}
                </div>


                <div
                    v-if="
                        errorMessage
                    "
                    class="
                        contact-message
                        contact-message--error
                    "
                >
                    ⚠️ {{ errorMessage }}
                </div>


                <!-- =========================================
                     SUBMIT
                ========================================== -->

                <div
                    class="
                        contact-form__actions
                        contact-field--full
                    "
                >

                    <button
                        type="submit"
                        class="
                            contact-submit
                        "
                        :disabled="
                            !canSubmit
                        "
                    >

                        <span
                            aria-hidden="true"
                        >
                            💌
                        </span>


                        {{
                            submitting
                                ? (
                                    locale
                                    ===
                                    "fr"
                                        ? "Envoi..."
                                        : "Sending..."
                                )
                                : t(
                                    "contact.form.submit"
                                )
                        }}

                    </button>

                </div>

            </form>

        </section>

    </main>

</template>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

.contact-page {

    width:
        100%;

    min-height:
        100vh;

    padding:
        45px
        20px
        80px;

    box-sizing:
        border-box;

}


/* =========================================================
   HERO
========================================================= */

.contact-hero {

    position:
        relative;

    width:
        min(
            1100px,
            100%
        );

    margin:
        0
        auto
        35px;

    padding:
        50px
        30px;

    box-sizing:
        border-box;

    text-align:
        center;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        30px;

    background:
        var(--surface-background);

    box-shadow:
        var(--shadow-primary);

}


.contact-hero__language {

    position:
        absolute;

    top:
        18px;

    right:
        18px;

    display:
        flex;

    gap:
        8px;

}


.contact-hero__language button {

    padding:
        8px
        11px;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        999px;

    color:
        var(--text-secondary);

    background:
        var(--surface-background-secondary);

    font:
        inherit;

    font-size:
        0.72rem;

    font-weight:
        900;

    cursor:
        pointer;

}


.contact-hero__language button.is-active {

    color:
        #ffffff;

    border-color:
        transparent;

    background:
        linear-gradient(
            135deg,
            var(--color-purple),
            var(--color-pink)
        );

}


.contact-hero__eyebrow {

    color:
        var(--color-cyan);

    font-size:
        0.78rem;

    font-weight:
        900;

    letter-spacing:
        0.16em;

}


.contact-hero h1 {

    margin:
        12px
        0;

    color:
        var(--text-primary);

    font-size:
        clamp(
            2.4rem,
            5vw,
            4.5rem
        );

}


.contact-hero p {

    max-width:
        720px;

    margin:
        0
        auto;

    color:
        var(--text-secondary);

    line-height:
        1.7;

}


/* =========================================================
   SECTION
========================================================= */

.contact-section {

    width:
        min(
            1100px,
            100%
        );

    margin:
        0
        auto;

}


/* =========================================================
   FORM
========================================================= */

.contact-form {

    display:
        grid;

    grid-template-columns:
        repeat(
            2,
            minmax(
                0,
                1fr
            )
        );

    gap:
        20px;

    padding:
        clamp(
            24px,
            5vw,
            42px
        );

    border:
        1px solid
        var(--border-primary);

    border-radius:
        28px;

    background:
        var(--surface-background);

    box-shadow:
        var(--shadow-primary);

}


/* =========================================================
   FIELD
========================================================= */

.contact-field {

    display:
        grid;

    gap:
        8px;

}


.contact-field--full {

    grid-column:
        1
        /
        -1;

}


.contact-field label {

    color:
        var(--text-primary);

    font-size:
        0.86rem;

    font-weight:
        900;

}


.contact-field input,
.contact-field select,
.contact-field textarea {

    width:
        100%;

    box-sizing:
        border-box;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        15px;

    outline:
        none;

    color:
        var(--text-primary);

    background:
        var(--surface-background-secondary);

    font:
        inherit;

}


.contact-field input,
.contact-field select {

    min-height:
        52px;

    padding:
        0
        15px;

}


.contact-field textarea {

    padding:
        15px;

    resize:
        vertical;

}


.contact-field input:focus,
.contact-field select:focus,
.contact-field textarea:focus {

    border-color:
        var(--color-pink);

    box-shadow:
        0
        0
        0
        3px
        rgba(
            242,
            34,
            146,
            0.08
        );

}


.contact-field small {

    color:
        var(--text-muted);

    font-size:
        0.72rem;

}


/* =========================================================
   CONTACT PREFERENCE
========================================================= */

.contact-preference {

    min-width:
        0;

    margin:
        0;

    padding:
        20px;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        18px;

    background:
        var(--surface-background-secondary);

}


.contact-preference legend {

    padding:
        0
        8px;

    color:
        var(--text-primary);

    font-size:
        0.9rem;

    font-weight:
        900;

}


.contact-preference__options {

    display:
        grid;

    grid-template-columns:
        repeat(
            3,
            minmax(
                0,
                1fr
            )
        );

    gap:
        12px;

}


.contact-preference__option {

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        8px;

    min-height:
        58px;

    padding:
        10px
        14px;

    box-sizing:
        border-box;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        15px;

    color:
        var(--text-secondary);

    background:
        var(--surface-background);

    font-size:
        0.85rem;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        0.2s ease;

}


.contact-preference__option:hover {

    border-color:
        var(--color-pink);

    transform:
        translateY(
            -1px
        );

}


.contact-preference__option--selected {

    color:
        var(--text-primary);

    border-color:
        var(--color-pink);

    box-shadow:
        0
        0
        0
        3px
        rgba(
            242,
            34,
            146,
            0.08
        );

}


.contact-preference__option input {

    accent-color:
        var(--color-pink);

}


.contact-preference__icon {

    font-size:
        1.15rem;

}


/* =========================================================
   DISCORD
========================================================= */

.contact-discord-field {

    padding:
        18px;

    box-sizing:
        border-box;

    border:
        1px solid
        rgba(
            88,
            101,
            242,
            0.28
        );

    border-radius:
        18px;

    background:
        rgba(
            88,
            101,
            242,
            0.06
        );

}


/* =========================================================
   CONSENT
========================================================= */

.contact-consent {

    display:
        flex;

    align-items:
        flex-start;

    gap:
        11px;

    padding:
        15px;

    border:
        1px solid
        var(--border-primary);

    border-radius:
        15px;

    color:
        var(--text-secondary);

    background:
        var(--surface-background-secondary);

    line-height:
        1.5;

}


.contact-consent input {

    margin-top:
        3px;

    accent-color:
        var(--color-pink);

}


/* =========================================================
   MESSAGES
========================================================= */

.contact-message {

    grid-column:
        1
        /
        -1;

    padding:
        14px
        16px;

    border-radius:
        14px;

    font-weight:
        800;

}


.contact-message--success {

    color:
        var(--color-cyan);

    border:
        1px solid
        rgba(
            34,
            242,
            239,
            0.28
        );

    background:
        rgba(
            34,
            242,
            239,
            0.07
        );

}


.contact-message--error {

    color:
        #ff789b;

    border:
        1px solid
        rgba(
            255,
            120,
            155,
            0.3
        );

    background:
        rgba(
            255,
            120,
            155,
            0.07
        );

}


/* =========================================================
   ACTIONS
========================================================= */

.contact-form__actions {

    display:
        flex;

    justify-content:
        center;

}


.contact-submit {

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        8px;

    min-height:
        52px;

    padding:
        0
        28px;

    border:
        0;

    border-radius:
        15px;

    color:
        #ffffff;

    background:
        linear-gradient(
            135deg,
            var(--color-purple),
            var(--color-pink)
        );

    font:
        inherit;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        0.2s ease;

}


.contact-submit:not(:disabled):hover {

    transform:
        translateY(
            -2px
        );

}


.contact-submit:disabled {

    cursor:
        not-allowed;

    opacity:
        0.5;

}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (
    max-width:
    750px
) {

    .contact-page {

        padding:
            25px
            12px
            60px;

    }


    .contact-hero {

        padding:
            70px
            20px
            32px;

    }


    .contact-hero__language {

        top:
            14px;

        right:
            14px;

    }


    .contact-form {

        grid-template-columns:
            1fr;

        padding:
            22px
            14px;

    }


    .contact-field--full {

        grid-column:
            auto;

    }


    .contact-message {

        grid-column:
            auto;

    }


    .contact-preference {

        grid-column:
            auto;

    }


    .contact-preference__options {

        grid-template-columns:
            1fr;

    }


    .contact-preference__option {

        justify-content:
            flex-start;

    }

}

</style>