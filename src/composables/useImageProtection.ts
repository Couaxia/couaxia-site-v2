/* =========================================================
   GLOBAL CONTENT PROTECTION
========================================================= */

/*
 * Protection légère des médias du site.
 *
 * Protège :
 * - images
 * - GIFs
 * - vidéos
 *
 * Empêche :
 * - clic droit
 * - glisser / déposer
 * - copie directe du média
 *
 * IMPORTANT :
 * Cela ne peut pas empêcher totalement la récupération
 * d'un fichier affiché dans un navigateur.
 */


/* =========================================================
   TYPES
========================================================= */

type ProtectedMedia =
    HTMLImageElement |
    HTMLVideoElement;


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const protectionMessages = [

    "Hé ! Pas touche ! 🐙",

    "Mes tentacules surveillent les créations ! 👀",

    "Cette création appartient à son artiste. 💜",

    "On regarde avec les yeux, pas avec le clic droit ! 👀",

    "Nope ! Cette création reste ici ! 🐙",

    "Attention... mes tentacules t'ont vu faire ! 👀",

    "Pas de vol intergalactique aujourd'hui ! 🌌",

    "Cette œuvre est protégée par la brigade des tentacules ! 🐙",

    "Tu pensais vraiment échapper à ma surveillance ? 👀",

    "Respectons le travail des artistes. 💜"

];


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomProtectionMessage():
    string {

    const randomIndex =
        Math.floor(
            Math.random() *
            protectionMessages.length
        );


    return (
        protectionMessages[randomIndex]
        ??
        "Cette création est protégée. 💜"
    );

}


/* =========================================================
   MASCOT
========================================================= */

function speakProtectionMessage() {

    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message:
                        getRandomProtectionMessage()
                }
            }
        )
    );

}


/* =========================================================
   GET MEDIA
========================================================= */

function getProtectedMedia(
    target:
        EventTarget | null
):
    ProtectedMedia | null {

    if (
        !(target instanceof HTMLElement)
    ) {

        return null;

    }


    const media =
        target.closest(
            "img, video"
        );


    if (
        !media
    ) {

        return null;

    }


    if (
        !(
            media instanceof HTMLImageElement
            ||
            media instanceof HTMLVideoElement
        )
    ) {

        return null;

    }


    /*
     * Permet d'autoriser volontairement un média :
     *
     * data-content-protection="false"
     */

    if (
        media.dataset.contentProtection ===
        "false"
    ) {

        return null;

    }


    return media;

}


/* =========================================================
   CONTEXT MENU
========================================================= */

function preventContextMenu(
    event:
        MouseEvent
) {

    const media =
        getProtectedMedia(
            event.target
        );


    if (
        !media
    ) {

        return;

    }


    event.preventDefault();


    speakProtectionMessage();

}


/* =========================================================
   DRAG
========================================================= */

function preventDrag(
    event:
        DragEvent
) {

    const media =
        getProtectedMedia(
            event.target
        );


    if (
        !media
    ) {

        return;

    }


    event.preventDefault();

}


/* =========================================================
   COPY
========================================================= */

function preventMediaCopy(
    event:
        ClipboardEvent
) {

    const selection =
        window.getSelection();


    if (
        !selection
        ||
        selection.rangeCount === 0
    ) {

        return;

    }


    const range =
        selection.getRangeAt(
            0
        );


    const container =
        range.commonAncestorContainer;


    const element =
        container.nodeType ===
        Node.ELEMENT_NODE

            ? container as HTMLElement

            : container.parentElement;


    if (
        !element
    ) {

        return;

    }


    const media =
        element.closest(
            "img, video"
        );


    if (
        !media
    ) {

        return;

    }


    if (
        media instanceof HTMLElement
        &&
        media.dataset.contentProtection ===
            "false"
    ) {

        return;

    }


    event.preventDefault();


    speakProtectionMessage();

}


/* =========================================================
   DISABLE NATIVE DRAG
========================================================= */

function protectExistingMedia() {

    const mediaElements =
        document.querySelectorAll<
            HTMLImageElement |
            HTMLVideoElement
        >(
            "img, video"
        );


    mediaElements.forEach(
        (
            media
        ) => {

            if (
                media.dataset.contentProtection ===
                "false"
            ) {

                return;

            }


            media.draggable =
                false;

        }
    );

}


/* =========================================================
   OBSERVER
========================================================= */

/*
 * Important pour Vue :
 *
 * certaines images apparaissent après le chargement
 * (Supabase, galerie, composants conditionnels...).
 */

let mediaObserver:
    MutationObserver | null =
        null;


function startMediaObserver() {

    mediaObserver =
        new MutationObserver(
            () => {

                protectExistingMedia();

            }
        );


    mediaObserver.observe(
        document.body,
        {
            childList:
                true,

            subtree:
                true
        }
    );

}


/* =========================================================
   ENABLE
========================================================= */

export function enableContentProtection() {

    protectExistingMedia();


    document.addEventListener(
        "contextmenu",
        preventContextMenu
    );


    document.addEventListener(
        "dragstart",
        preventDrag
    );


    document.addEventListener(
        "copy",
        preventMediaCopy
    );


    startMediaObserver();

}


/* =========================================================
   DISABLE
========================================================= */

export function disableContentProtection() {

    document.removeEventListener(
        "contextmenu",
        preventContextMenu
    );


    document.removeEventListener(
        "dragstart",
        preventDrag
    );


    document.removeEventListener(
        "copy",
        preventMediaCopy
    );


    if (
        mediaObserver
    ) {

        mediaObserver.disconnect();


        mediaObserver =
            null;

    }

}