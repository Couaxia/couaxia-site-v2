import {
    computed,
    ref
} from "vue";

import fr from "./fr";
import en from "./en";


/* =========================================================
   TYPES
========================================================= */

export type Locale =
    | "fr"
    | "en";



/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
    fr,
    en
};


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
    "couaxia-language";


/* =========================================================
   DEFAULT LANGUAGE
========================================================= */

function getInitialLocale():
    Locale {

    /*
     * 1. Langue déjà choisie par l'utilisateur
     */

    const savedLocale =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (
        savedLocale
        ===
        "fr"
        ||
        savedLocale
        ===
        "en"
    ) {

        return savedLocale;

    }


    /*
     * 2. Sinon on regarde la langue du navigateur
     */

    const browserLanguage =
        navigator.language
            .toLowerCase();


    if (
        browserLanguage.startsWith(
            "fr"
        )
    ) {

        return "fr";

    }


    /*
     * Pour toutes les autres langues,
     * on utilise l'anglais.
     */

    return "en";

}


/* =========================================================
   CURRENT LOCALE
========================================================= */

const locale =
    ref<Locale>(
        getInitialLocale()
    );


/* =========================================================
   HTML LANG
========================================================= */

function updateHtmlLanguage() {

    document.documentElement.lang =
        locale.value;

}


updateHtmlLanguage();


/* =========================================================
   SET LOCALE
========================================================= */

function setLocale(
    newLocale:
        Locale
) {

    locale.value =
        newLocale;


    localStorage.setItem(
        STORAGE_KEY,
        newLocale
    );


    updateHtmlLanguage();

}


/* =========================================================
   TOGGLE LANGUAGE
========================================================= */

function toggleLocale() {

    setLocale(
        locale.value
        ===
        "fr"
            ? "en"
            : "fr"
    );

}


/* =========================================================
   TRANSLATE
========================================================= */

function t(
    key: string
): string {

    const keys =
        key.split(".");


    let value: unknown =
        translations[
            locale.value
        ];


    for (
        const currentKey
        of
        keys
    ) {

        if (
            typeof value !== "object"
            ||
            value === null
            ||
            !(currentKey in value)
        ) {

            console.warn(
                `🌐 Traduction introuvable : ${key}`
            );

            return key;

        }


        value =
            (
                value as Record<string, unknown>
            )[currentKey];

    }


    if (
        typeof value !== "string"
    ) {

        console.warn(
            `🌐 La traduction "${key}" n'est pas un texte.`
        );

        return key;

    }


    return value;

}

/* =========================================================
   COMPUTED HELPERS
========================================================= */

const isFrench =
    computed(
        () =>
            locale.value
            ===
            "fr"
    );


const isEnglish =
    computed(
        () =>
            locale.value
            ===
            "en"
    );


/* =========================================================
   COMPOSABLE
========================================================= */

export function useI18n() {

    return {

        locale,

        isFrench,

        isEnglish,

        t,

        setLocale,

        toggleLocale

    };

}