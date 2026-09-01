<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRoute,
    useRouter
} from "vue-router";

import {
    supabase
} from "../lib/supabase";

import "../assets/styles/pages/login.css";


/* =========================================================
   TYPES
========================================================= */

type AuthMode =
    | "login"
    | "register";


/* =========================================================
   ROUTER
========================================================= */

const router =
    useRouter();


const route =
    useRoute();


/* =========================================================
   STATE
========================================================= */

const mode =
    ref<AuthMode>(
        "login"
    );


const email =
    ref("");


const password =
    ref("");


const confirmPassword =
    ref("");


const username =
    ref("");


const showPassword =
    ref(false);


const showConfirmPassword =
    ref(false);


const loading =
    ref(false);


const checkingSession =
    ref(true);


const errorMessage =
    ref("");


const successMessage =
    ref("");


/* =========================================================
   COMPUTED
========================================================= */

const isLogin =
    computed(
        () =>
            mode.value
            ===
            "login"
    );


const title =
    computed(
        () =>
            isLogin.value
                ? "Connexion"
                : "Créer mon compte"
    );


const subtitle =
    computed(
        () =>
            isLogin.value
                ? "Connecte-toi à ton compte POUP."
                : "Rejoins la communauté et crée ton compte POUP."
    );


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

const passwordValid =
    computed(
        () =>
            password.value.length
            >=
            8
    );


const passwordsMatch =
    computed(
        () =>
            password.value
            ===
            confirmPassword.value
    );


/* =========================================================
   FORM VALID
========================================================= */

const formValid =
    computed(
        () => {

            if (
                loading.value
            ) {

                return false;

            }


            if (
                !email.value.trim()
                ||
                !password.value
            ) {

                return false;

            }


            if (
                isLogin.value
            ) {

                return true;

            }


            if (
                !username.value.trim()
            ) {

                return false;

            }


            if (
                !passwordValid.value
            ) {

                return false;

            }


            if (
                !passwordsMatch.value
            ) {

                return false;

            }


            return true;

        }
    );


/* =========================================================
   NORMALIZE USERNAME
========================================================= */

function normalizeUsername(
    value:
        string
): string {

    return value
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            "_"
        )
        .replace(
            /[^a-z0-9_-]/g,
            ""
        );

}


/* =========================================================
   SWITCH MODE
========================================================= */

function switchMode(
    newMode:
        AuthMode
) {

    mode.value =
        newMode;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    password.value =
        "";


    confirmPassword.value =
        "";


    showPassword.value =
        false;


    showConfirmPassword.value =
        false;

}


/* =========================================================
   REDIRECT AFTER LOGIN
========================================================= */

async function redirectAfterLogin() {

    const redirect =
        route.query.redirect;


    if (
        typeof redirect
        ===
        "string"
        &&
        redirect.startsWith("/")
        &&
        !redirect.startsWith("//")
    ) {

        await router.replace(
            redirect
        );


        return;

    }


    await router.replace({
        name:
            "profile"
    });

}


/* =========================================================
   LOGIN
========================================================= */

async function login() {

    loading.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const {
            error
        } =
            await supabase.auth.signInWithPassword({

                email:
                    email.value
                        .trim()
                        .toLowerCase(),

                password:
                    password.value

            });


        if (
            error
        ) {

            throw error;

        }


        successMessage.value =
            "Connexion réussie 💜";


        await redirectAfterLogin();

    }
    catch (
        error
    ) {

        console.error(
            "Erreur connexion :",
            error
        );


        if (
            error instanceof Error
        ) {

            switch (
                error.message
            ) {

                case "Invalid login credentials":

                    errorMessage.value =
                        "Adresse e-mail ou mot de passe incorrect.";

                    break;


                case "Email not confirmed":

                    errorMessage.value =
                        "Tu dois confirmer ton adresse e-mail avant de te connecter.";

                    break;


                default:

                    errorMessage.value =
                        error.message;

            }

        }
        else {

            errorMessage.value =
                "Impossible de te connecter.";

        }

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   REGISTER
========================================================= */

async function register() {

    const cleanUsername =
        normalizeUsername(
            username.value
        );


    if (
        cleanUsername.length
        <
        3
    ) {

        errorMessage.value =
            "Ton pseudo doit contenir au moins 3 caractères.";

        return;

    }


    if (
        !passwordValid.value
    ) {

        errorMessage.value =
            "Ton mot de passe doit contenir au moins 8 caractères.";

        return;

    }


    if (
        !passwordsMatch.value
    ) {

        errorMessage.value =
            "Les deux mots de passe ne correspondent pas.";

        return;

    }


    loading.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const {
            data,
            error
        } =
            await supabase.auth.signUp({

                email:
                    email.value
                        .trim()
                        .toLowerCase(),

                password:
                    password.value,

                options: {

                    data: {

                        username:
                            cleanUsername

                    }

                }

            });


        if (
            error
        ) {

            throw error;

        }


        /*
         * Si Supabase renvoie directement une session,
         * la confirmation e-mail est désactivée.
         */

        if (
            data.session
        ) {

            successMessage.value =
                "Ton compte POUP a été créé 💜";


            await redirectAfterLogin();


            return;

        }


        /*
         * Sinon Supabase attend la validation
         * de l'adresse e-mail.
         */

        successMessage.value =
            "Compte créé ! Vérifie maintenant ta boîte mail pour confirmer ton adresse 💌";


        password.value =
            "";


        confirmPassword.value =
            "";

    }
    catch (
        error
    ) {

        console.error(
            "Erreur inscription :",
            error
        );


        if (
            error instanceof Error
        ) {

            const message =
                error.message
                    .toLowerCase();


            if (
                message.includes(
                    "already registered"
                )
                ||
                message.includes(
                    "already exists"
                )
            ) {

                errorMessage.value =
                    "Un compte existe déjà avec cette adresse e-mail.";

            }
            else {

                errorMessage.value =
                    error.message;

            }

        }
        else {

            errorMessage.value =
                "Impossible de créer ton compte.";

        }

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   SUBMIT
========================================================= */

async function submit() {

    if (
        !formValid.value
    ) {

        return;

    }


    if (
        isLogin.value
    ) {

        await login();

        return;

    }


    await register();

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function forgotPassword() {

    errorMessage.value =
        "";


    successMessage.value =
        "";


    const cleanEmail =
        email.value
            .trim()
            .toLowerCase();


    if (
        !cleanEmail
    ) {

        errorMessage.value =
            "Entre d'abord ton adresse e-mail.";

        return;

    }


    loading.value =
        true;


    try {

        const {
            error
        } =
            await supabase.auth.resetPasswordForEmail(
                cleanEmail,
                {
                    redirectTo:
                        `${window.location.origin}/login`
                }
            );


        if (
            error
        ) {

            throw error;

        }


        successMessage.value =
            "Un e-mail de réinitialisation vient de t'être envoyé 💌";

    }
    catch (
        error
    ) {

        console.error(
            "Erreur reset password :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'envoyer l'e-mail de réinitialisation.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   CHECK EXISTING SESSION
========================================================= */

async function checkSession() {

    checkingSession.value =
        true;


    try {

        const {
            data: {
                session
            }
        } =
            await supabase.auth.getSession();


        if (
            session?.user
        ) {

            await redirectAfterLogin();

        }

    }
    catch (
        error
    ) {

        console.error(
            "Erreur vérification session :",
            error
        );

    }
    finally {

        checkingSession.value =
            false;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    checkSession
);

</script>


<template>

    <main
        class="login-page"
    >

        <!-- =================================================
             CHECK SESSION
        ================================================== -->

        <section
            v-if="checkingSession"
            class="login-loading"
        >

            <span>
                🐙
            </span>


            <strong>
                Chargement...
            </strong>

        </section>


        <!-- =================================================
             LOGIN
        ================================================== -->

        <section
            v-else
            class="login-container"
        >

            <!-- =============================================
                 DECORATION
            ============================================== -->

            <div
                class="login-decoration"
                aria-hidden="true"
            >

                <div
                    class="login-decoration__glow"
                ></div>


                <span
                    class="login-decoration__octopus"
                >
                    🐙
                </span>


                <span
                    class="login-decoration__brand"
                >
                    COUAXIA
                </span>


                <h1>
                    Bienvenue chez les
                    <strong>
                        POUP
                    </strong>
                </h1>


                <p>
                    Connecte-toi pour voter,
                    personnaliser ton profil et
                    participer à la communauté.
                </p>

            </div>


            <!-- =============================================
                 CARD
            ============================================== -->

            <div
                class="login-card"
            >

                <!-- =========================================
                     HEADER
                ========================================== -->

                <header
                    class="login-card__header"
                >

                    <span
                        class="login-card__eyebrow"
                    >
                        🐙 ESPACE POUP
                    </span>


                    <h2>
                        {{ title }}
                    </h2>


                    <p>
                        {{ subtitle }}
                    </p>

                </header>


                <!-- =========================================
                     TABS
                ========================================== -->

                <div
                    class="login-tabs"
                >

                    <button
                        type="button"
                        :class="{
                            'login-tabs__button--active':
                                isLogin
                        }"
                        @click="
                            switchMode(
                                'login'
                            )
                        "
                    >
                        Connexion
                    </button>


                    <button
                        type="button"
                        :class="{
                            'login-tabs__button--active':
                                !isLogin
                        }"
                        @click="
                            switchMode(
                                'register'
                            )
                        "
                    >
                        Inscription
                    </button>

                </div>


                <!-- =========================================
                     MESSAGES
                ========================================== -->

                <div
                    v-if="errorMessage"
                    class="
                        login-message
                        login-message--error
                    "
                >
                    ⚠️ {{ errorMessage }}
                </div>


                <div
                    v-if="successMessage"
                    class="
                        login-message
                        login-message--success
                    "
                >
                    ✓ {{ successMessage }}
                </div>


                <!-- =========================================
                     FORM
                ========================================== -->

                <form
                    class="login-form"
                    @submit.prevent="
                        submit
                    "
                >

                    <!-- =====================================
                         USERNAME
                    ====================================== -->

                    <div
                        v-if="
                            !isLogin
                        "
                        class="login-field"
                    >

                        <label
                            for="login-username"
                        >
                            Pseudo
                        </label>


                        <div
                            class="login-input"
                        >

                            <span
                                aria-hidden="true"
                            >
                                🐙
                            </span>


                            <input
                                id="login-username"
                                v-model="
                                    username
                                "
                                type="text"
                                autocomplete="username"
                                minlength="3"
                                maxlength="30"
                                placeholder="Ton pseudo"
                                :disabled="
                                    loading
                                "
                                required
                            >

                        </div>


                        <small>
                            Ce pseudo sera visible
                            sur ton profil POUP.
                        </small>

                    </div>


                    <!-- =====================================
                         EMAIL
                    ====================================== -->

                    <div
                        class="login-field"
                    >

                        <label
                            for="login-email"
                        >
                            Adresse e-mail
                        </label>


                        <div
                            class="login-input"
                        >

                            <span
                                aria-hidden="true"
                            >
                                ✉️
                            </span>


                            <input
                                id="login-email"
                                v-model="
                                    email
                                "
                                type="email"
                                autocomplete="email"
                                placeholder="ton@email.fr"
                                :disabled="
                                    loading
                                "
                                required
                            >

                        </div>

                    </div>


                    <!-- =====================================
                         PASSWORD
                    ====================================== -->

                    <div
                        class="login-field"
                    >

                        <div
                            class="login-field__heading"
                        >

                            <label
                                for="login-password"
                            >
                                Mot de passe
                            </label>


                            <button
                                v-if="
                                    isLogin
                                "
                                type="button"
                                class="
                                    login-forgot
                                "
                                :disabled="
                                    loading
                                "
                                @click="
                                    forgotPassword
                                "
                            >
                                Mot de passe oublié ?
                            </button>

                        </div>


                        <div
                            class="login-input"
                        >

                            <span
                                aria-hidden="true"
                            >
                                🔒
                            </span>


                            <input
                                id="login-password"
                                v-model="
                                    password
                                "
                                :type="
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                "
                                :autocomplete="
                                    isLogin
                                        ? 'current-password'
                                        : 'new-password'
                                "
                                placeholder="••••••••"
                                :minlength="
                                    isLogin
                                        ? undefined
                                        : 8
                                "
                                :disabled="
                                    loading
                                "
                                required
                            >


                            <button
                                type="button"
                                class="
                                    login-password-toggle
                                "
                                :aria-label="
                                    showPassword
                                        ? 'Masquer le mot de passe'
                                        : 'Afficher le mot de passe'
                                "
                                @click="
                                    showPassword =
                                        !showPassword
                                "
                            >
                                {{
                                    showPassword
                                        ? "🙈"
                                        : "👁️"
                                }}
                            </button>

                        </div>


                        <small
                            v-if="
                                !isLogin
                            "
                            :class="{
                                'login-field__valid':
                                    passwordValid
                            }"
                        >
                            Minimum 8 caractères.
                        </small>

                    </div>


                    <!-- =====================================
                         CONFIRM PASSWORD
                    ====================================== -->

                    <div
                        v-if="
                            !isLogin
                        "
                        class="login-field"
                    >

                        <label
                            for="login-confirm-password"
                        >
                            Confirmer le mot de passe
                        </label>


                        <div
                            class="login-input"
                        >

                            <span
                                aria-hidden="true"
                            >
                                🔐
                            </span>


                            <input
                                id="login-confirm-password"
                                v-model="
                                    confirmPassword
                                "
                                :type="
                                    showConfirmPassword
                                        ? 'text'
                                        : 'password'
                                "
                                autocomplete="new-password"
                                placeholder="••••••••"
                                minlength="8"
                                :disabled="
                                    loading
                                "
                                required
                            >


                            <button
                                type="button"
                                class="
                                    login-password-toggle
                                "
                                :aria-label="
                                    showConfirmPassword
                                        ? 'Masquer le mot de passe'
                                        : 'Afficher le mot de passe'
                                "
                                @click="
                                    showConfirmPassword =
                                        !showConfirmPassword
                                "
                            >
                                {{
                                    showConfirmPassword
                                        ? "🙈"
                                        : "👁️"
                                }}
                            </button>

                        </div>


                        <small
                            v-if="
                                confirmPassword
                            "
                            :class="{
                                'login-field__valid':
                                    passwordsMatch,

                                'login-field__invalid':
                                    !passwordsMatch
                            }"
                        >
                            {{
                                passwordsMatch
                                    ? "Les mots de passe correspondent."
                                    : "Les mots de passe ne correspondent pas."
                            }}
                        </small>

                    </div>


                    <!-- =====================================
                         SUBMIT
                    ====================================== -->

                    <button
                        type="submit"
                        class="
                            login-submit
                        "
                        :disabled="
                            !formValid
                        "
                    >

                        <span
                            v-if="
                                loading
                            "
                            class="
                                login-submit__loader
                            "
                        ></span>


                        <template
                            v-if="
                                loading
                            "
                        >
                            {{
                                isLogin
                                    ? "Connexion..."
                                    : "Création..."
                            }}
                        </template>


                        <template
                            v-else
                        >
                            {{
                                isLogin
                                    ? "Se connecter"
                                    : "Créer mon compte POUP"
                            }}
                        </template>

                    </button>

                </form>


                <!-- =========================================
                     SWITCH
                ========================================== -->

                <footer
                    class="login-card__footer"
                >

                    <template
                        v-if="
                            isLogin
                        "
                    >

                        <span>
                            Pas encore de compte ?
                        </span>


                        <button
                            type="button"
                            @click="
                                switchMode(
                                    'register'
                                )
                            "
                        >
                            Créer un compte
                        </button>

                    </template>


                    <template
                        v-else
                    >

                        <span>
                            Déjà un compte ?
                        </span>


                        <button
                            type="button"
                            @click="
                                switchMode(
                                    'login'
                                )
                            "
                        >
                            Se connecter
                        </button>

                    </template>

                </footer>

            </div>

        </section>

    </main>

</template>