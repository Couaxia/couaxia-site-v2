import {
    Router,
    type Response
} from "express";

import {
    supabaseAdmin
} from "../services/supabase-admin.service.js";

import {
    requireAdmin
} from "../middleware/admin.middleware.js";

import {
    uploadToImageKit
} from "../services/imagekit.service.js";


/* =========================================================
   ROUTER
========================================================= */

const router =
    Router();


/* =========================================================
   ADMIN SECURITY
========================================================= */

router.use(
    requireAdmin
);


/* =========================================================
   TYPES
========================================================= */

type CardRarity =
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary"
    | "mythic";


type CardCategory =
    | "couaxia"
    | "natsu"
    | "character"
    | "lore"
    | "event"
    | "special";


type CardStatus =
    | "draft"
    | "active"
    | "disabled";


interface DatabaseCard {

    id:
        string;

    number:
        number;

    name:
        string;

    description:
        string | null;

    rarity:
        CardRarity;

    category:
        CardCategory;

    image_url:
        string;

    back_image_url:
        string | null;

    artist:
        string | null;

    artist_url:
        string | null;

    weight:
        number;

    status:
        CardStatus;

    limited:
        boolean;

    available_from:
        string | null;

    available_until:
        string | null;

    reveal_sound_url:
        string | null;

    reveal_animation:
        string | null;

    created_at:
        string;

    updated_at:
        string;

}


interface CardPayload {

    number?:
        unknown;

    name?:
        unknown;

    description?:
        unknown;

    rarity?:
        unknown;

    category?:
        unknown;

    imageUrl?:
        unknown;

    backImageUrl?:
        unknown;

    artist?:
        unknown;

    artistUrl?:
        unknown;

    weight?:
        unknown;

    status?:
        unknown;

    limited?:
        unknown;

    availableFrom?:
        unknown;

    availableUntil?:
        unknown;

    revealSoundUrl?:
        unknown;

    revealAnimation?:
        unknown;

}


interface CardImageUploadPayload {

    file?:
        unknown;

    fileName?:
        unknown;

    mimeType?:
        unknown;

    type?:
        unknown;

}


/* =========================================================
   CONSTANTS
========================================================= */

const CARD_RARITIES:
    CardRarity[] = [

        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic"

    ];


const CARD_CATEGORIES:
    CardCategory[] = [

        "couaxia",
        "natsu",
        "character",
        "lore",
        "event",
        "special"

    ];


const CARD_STATUSES:
    CardStatus[] = [

        "draft",
        "active",
        "disabled"

    ];


const ALLOWED_IMAGE_TYPES = [

    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif"

];


const MAX_IMAGE_SIZE =
    10
    *
    1024
    *
    1024;


/* =========================================================
   STRING HELPERS
========================================================= */

function cleanRequiredString(
    value: unknown
): string {

    if (
        typeof value !== "string"
    ) {

        return "";

    }


    return value.trim();

}


function cleanNullableString(
    value: unknown
):
    string | null {

    if (
        value === null
        ||
        value === undefined
    ) {

        return null;

    }


    if (
        typeof value !== "string"
    ) {

        return null;

    }


    const clean =
        value.trim();


    return clean || null;

}


/* =========================================================
   DATE
========================================================= */

function cleanNullableDate(
    value: unknown
):
    string | null {

    const clean =
        cleanNullableString(
            value
        );


    if (
        !clean
    ) {

        return null;

    }


    const date =
        new Date(
            clean
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        throw new Error(
            `Date invalide : ${clean}`
        );

    }


    return date.toISOString();

}


/* =========================================================
   MAP CARD
========================================================= */

function mapCard(
    card:
        DatabaseCard
) {

    return {

        id:
            card.id,

        number:
            card.number,

        name:
            card.name,

        description:
            card.description,

        rarity:
            card.rarity,

        category:
            card.category,

        imageUrl:
            card.image_url,

        backImageUrl:
            card.back_image_url,

        artist:
            card.artist,

        artistUrl:
            card.artist_url,

        weight:
            card.weight,

        status:
            card.status,

        limited:
            card.limited,

        availableFrom:
            card.available_from,

        availableUntil:
            card.available_until,

        revealSoundUrl:
            card.reveal_sound_url,

        revealAnimation:
            card.reveal_animation,

        createdAt:
            card.created_at,

        updatedAt:
            card.updated_at

    };

}


/* =========================================================
   ENUM VALIDATION
========================================================= */

function isCardRarity(
    value: unknown
):
    value is CardRarity {

    return (
        typeof value === "string"
        &&
        CARD_RARITIES.includes(
            value as CardRarity
        )
    );

}


function isCardCategory(
    value: unknown
):
    value is CardCategory {

    return (
        typeof value === "string"
        &&
        CARD_CATEGORIES.includes(
            value as CardCategory
        )
    );

}


function isCardStatus(
    value: unknown
):
    value is CardStatus {

    return (
        typeof value === "string"
        &&
        CARD_STATUSES.includes(
            value as CardStatus
        )
    );

}


/* =========================================================
   CARD NUMBER
========================================================= */

function getCardNumber(
    value: unknown
):
    number {

    const number =
        Number(
            value
        );


    if (
        !Number.isInteger(
            number
        )
        ||
        number <= 0
    ) {

        throw new Error(
            "Le numéro de la carte doit être un entier supérieur à 0."
        );

    }


    return number;

}


/* =========================================================
   WEIGHT
========================================================= */

function getCardWeight(
    value: unknown
):
    number {

    const weight =
        Number(
            value
        );


    if (
        !Number.isInteger(
            weight
        )
        ||
        weight < 0
    ) {

        throw new Error(
            "Le poids de la carte doit être un entier supérieur ou égal à 0."
        );

    }


    return weight;

}


/* =========================================================
   CREATE PAYLOAD
========================================================= */

function buildCreatePayload(
    payload:
        CardPayload
) {

    const number =
        getCardNumber(
            payload.number
        );


    const name =
        cleanRequiredString(
            payload.name
        );


    if (
        !name
    ) {

        throw new Error(
            "Le nom de la carte est obligatoire."
        );

    }


    if (
        !isCardRarity(
            payload.rarity
        )
    ) {

        throw new Error(
            "La rareté de la carte est invalide."
        );

    }


    if (
        !isCardCategory(
            payload.category
        )
    ) {

        throw new Error(
            "La catégorie de la carte est invalide."
        );

    }


    const imageUrl =
        cleanRequiredString(
            payload.imageUrl
        );


    if (
        !imageUrl
    ) {

        throw new Error(
            "L'image de la carte est obligatoire."
        );

    }


    const weight =
        payload.weight === undefined
            ? 1
            : getCardWeight(
                payload.weight
            );


    const statusValue =
        payload.status === undefined
            ? "draft"
            : payload.status;


    if (
        !isCardStatus(
            statusValue
        )
    ) {

        throw new Error(
            "Le statut de la carte est invalide."
        );

    }


    const availableFrom =
        cleanNullableDate(
            payload.availableFrom
        );


    const availableUntil =
        cleanNullableDate(
            payload.availableUntil
        );


    if (
        availableFrom
        &&
        availableUntil
        &&
        new Date(
            availableUntil
        ).getTime()
        <=
        new Date(
            availableFrom
        ).getTime()
    ) {

        throw new Error(
            "La date de fin doit être postérieure à la date de début."
        );

    }


    return {

        number,

        name,

        description:
            cleanNullableString(
                payload.description
            ),

        rarity:
            payload.rarity,

        category:
            payload.category,

        image_url:
            imageUrl,

        back_image_url:
            cleanNullableString(
                payload.backImageUrl
            ),

        artist:
            cleanNullableString(
                payload.artist
            ),

        artist_url:
            cleanNullableString(
                payload.artistUrl
            ),

        weight,

        status:
            statusValue,

        limited:
            payload.limited === true,

        available_from:
            availableFrom,

        available_until:
            availableUntil,

        reveal_sound_url:
            cleanNullableString(
                payload.revealSoundUrl
            ),

        reveal_animation:
            cleanNullableString(
                payload.revealAnimation
            )

    };

}


/* =========================================================
   UPDATE PAYLOAD
========================================================= */

function buildUpdatePayload(
    payload:
        CardPayload
) {

    const update:
        Record<string, unknown> = {};


    if (
        payload.number !== undefined
    ) {

        update.number =
            getCardNumber(
                payload.number
            );

    }


    if (
        payload.name !== undefined
    ) {

        const name =
            cleanRequiredString(
                payload.name
            );


        if (
            !name
        ) {

            throw new Error(
                "Le nom de la carte ne peut pas être vide."
            );

        }


        update.name =
            name;

    }


    if (
        payload.description !== undefined
    ) {

        update.description =
            cleanNullableString(
                payload.description
            );

    }


    if (
        payload.rarity !== undefined
    ) {

        if (
            !isCardRarity(
                payload.rarity
            )
        ) {

            throw new Error(
                "La rareté de la carte est invalide."
            );

        }


        update.rarity =
            payload.rarity;

    }


    if (
        payload.category !== undefined
    ) {

        if (
            !isCardCategory(
                payload.category
            )
        ) {

            throw new Error(
                "La catégorie de la carte est invalide."
            );

        }


        update.category =
            payload.category;

    }


    if (
        payload.imageUrl !== undefined
    ) {

        const imageUrl =
            cleanRequiredString(
                payload.imageUrl
            );


        if (
            !imageUrl
        ) {

            throw new Error(
                "L'image de la carte ne peut pas être vide."
            );

        }


        update.image_url =
            imageUrl;

    }


    if (
        payload.backImageUrl !== undefined
    ) {

        update.back_image_url =
            cleanNullableString(
                payload.backImageUrl
            );

    }


    if (
        payload.artist !== undefined
    ) {

        update.artist =
            cleanNullableString(
                payload.artist
            );

    }


    if (
        payload.artistUrl !== undefined
    ) {

        update.artist_url =
            cleanNullableString(
                payload.artistUrl
            );

    }


    if (
        payload.weight !== undefined
    ) {

        update.weight =
            getCardWeight(
                payload.weight
            );

    }


    if (
        payload.status !== undefined
    ) {

        if (
            !isCardStatus(
                payload.status
            )
        ) {

            throw new Error(
                "Le statut de la carte est invalide."
            );

        }


        update.status =
            payload.status;

    }


    if (
        payload.limited !== undefined
    ) {

        if (
            typeof payload.limited
            !==
            "boolean"
        ) {

            throw new Error(
                "La valeur limited doit être un booléen."
            );

        }


        update.limited =
            payload.limited;

    }


    if (
        payload.availableFrom !== undefined
    ) {

        update.available_from =
            cleanNullableDate(
                payload.availableFrom
            );

    }


    if (
        payload.availableUntil !== undefined
    ) {

        update.available_until =
            cleanNullableDate(
                payload.availableUntil
            );

    }


    if (
        payload.revealSoundUrl !== undefined
    ) {

        update.reveal_sound_url =
            cleanNullableString(
                payload.revealSoundUrl
            );

    }


    if (
        payload.revealAnimation !== undefined
    ) {

        update.reveal_animation =
            cleanNullableString(
                payload.revealAnimation
            );

    }


    update.updated_at =
        new Date()
            .toISOString();


    return update;

}


/* =========================================================
   VALIDATION ERROR
========================================================= */

function sendValidationError(
    res:
        Response,
    error:
        unknown
) {

    res
        .status(
            400
        )
        .json(
            {

                success:
                    false,

                error:
                    error instanceof Error
                        ? error.message
                        : "Données invalides."

            }
        );

}


/* =========================================================
   IMAGEKIT UPLOAD

   POST /api/admin/cards/upload
========================================================= */

router.post(
    "/upload",

    async (
        req,
        res,
        next
    ) => {

        try {

            const payload =
                req.body as CardImageUploadPayload;


            const file =
                cleanRequiredString(
                    payload.file
                );


            const fileName =
                cleanRequiredString(
                    payload.fileName
                );


            const mimeType =
                cleanRequiredString(
                    payload.mimeType
                );


            const uploadType =
                payload.type === "back"
                    ? "back"
                    : "artwork";


            if (
                !file
                ||
                !fileName
                ||
                !mimeType
            ) {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Le fichier est incomplet."

                        }
                    );

                return;

            }


            if (
                !ALLOWED_IMAGE_TYPES.includes(
                    mimeType
                )
            ) {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Format non autorisé. Utilise PNG, JPG, WEBP ou GIF."

                        }
                    );

                return;

            }


            let buffer:
                Buffer;


            try {

                buffer =
                    Buffer.from(
                        file,
                        "base64"
                    );

            }
            catch {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Le fichier envoyé est invalide."

                        }
                    );

                return;

            }


            if (
                buffer.length === 0
            ) {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Le fichier envoyé est vide."

                        }
                    );

                return;

            }


            if (
                buffer.length
                >
                MAX_IMAGE_SIZE
            ) {

                res
                    .status(
                        413
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "L'image ne peut pas dépasser 10 Mo."

                        }
                    );

                return;

            }


            const extension =
                fileName
                    .split(".")
                    .pop()
                    ?.toLowerCase()
                ??
                "webp";


            const safeBaseName =
                fileName
                    .replace(
                        /\.[^.]+$/,
                        ""
                    )
                    .normalize(
                        "NFD"
                    )
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        "-"
                    )
                    .replace(
                        /-+/g,
                        "-"
                    )
                    .replace(
                        /^[-_]+|[-_]+$/g,
                        ""
                    )
                ||
                "card";


            const safeFileName =
                `${safeBaseName}.${extension}`;


            const folder =
                uploadType === "back"
                    ? "/cards/backs"
                    : "/cards/artworks";


            const result =
                await uploadToImageKit(
                    {

                        file:
                            buffer,

                        fileName:
                            safeFileName,

                        folder

                    }
                );


            res.json(
                {

                    success:
                        true,

                    data:
                        result

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   NEXT NUMBER

   GET /api/admin/cards/next-number
========================================================= */

router.get(
    "/next-number",

    async (
        _req,
        res,
        next
    ) => {

        try {

            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "number"
                    )
                    .order(
                        "number",
                        {
                            ascending:
                                false
                        }
                    )
                    .limit(
                        1
                    )
                    .maybeSingle();


            if (
                error
            ) {

                throw error;

            }


            const nextNumber =
                data?.number
                    ? Number(
                        data.number
                    ) + 1
                    : 1;


            res.json(
                {

                    success:
                        true,

                    data:
                        {
                            number:
                                nextNumber
                        }

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   GET ALL CARDS
========================================================= */

router.get(
    "/",

    async (
        _req,
        res,
        next
    ) => {

        try {

            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "*"
                    )
                    .order(
                        "number",
                        {
                            ascending:
                                true
                        }
                    );


            if (
                error
            ) {

                throw error;

            }


            const cards =
                (
                    data
                    ??
                    []
                ) as DatabaseCard[];


            res.json(
                {

                    success:
                        true,

                    data:
                        cards.map(
                            mapCard
                        )

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   GET ONE CARD
========================================================= */

router.get(
    "/:id",

    async (
        req,
        res,
        next
    ) => {

        try {

            const cardId =
                String(
                    req.params.id
                );


            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "*"
                    )
                    .eq(
                        "id",
                        cardId
                    )
                    .maybeSingle();


            if (
                error
            ) {

                throw error;

            }


            if (
                !data
            ) {

                res
                    .status(
                        404
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Carte introuvable."

                        }
                    );

                return;

            }


            res.json(
                {

                    success:
                        true,

                    data:
                        mapCard(
                            data as DatabaseCard
                        )

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   CREATE CARD
========================================================= */

router.post(
    "/",

    async (
        req,
        res,
        next
    ) => {

        try {

            let payload:
                ReturnType<
                    typeof buildCreatePayload
                >;


            try {

                payload =
                    buildCreatePayload(
                        req.body as CardPayload
                    );

            }
            catch (
                error
            ) {

                sendValidationError(
                    res,
                    error
                );

                return;

            }


            const {
                data: existingCard,
                error: existingError
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "id"
                    )
                    .eq(
                        "number",
                        payload.number
                    )
                    .maybeSingle();


            if (
                existingError
            ) {

                throw existingError;

            }


            if (
                existingCard
            ) {

                res
                    .status(
                        409
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                `La carte n°${payload.number} existe déjà.`

                        }
                    );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .insert(
                        payload
                    )
                    .select()
                    .single();


            if (
                error
            ) {

                throw error;

            }


            res
                .status(
                    201
                )
                .json(
                    {

                        success:
                            true,

                        data:
                            mapCard(
                                data as DatabaseCard
                            )

                    }
                );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   UPDATE CARD
========================================================= */

router.put(
    "/:id",

    async (
        req,
        res,
        next
    ) => {

        try {

            const cardId =
                String(
                    req.params.id
                );


            let payload:
                Record<string, unknown>;


            try {

                payload =
                    buildUpdatePayload(
                        req.body as CardPayload
                    );

            }
            catch (
                error
            ) {

                sendValidationError(
                    res,
                    error
                );

                return;

            }


            const {
                data: currentCard,
                error: currentError
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "*"
                    )
                    .eq(
                        "id",
                        cardId
                    )
                    .maybeSingle();


            if (
                currentError
            ) {

                throw currentError;

            }


            if (
                !currentCard
            ) {

                res
                    .status(
                        404
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Carte introuvable."

                        }
                    );

                return;

            }


            if (
                payload.number !== undefined
            ) {

                const {
                    data: existingNumber,
                    error: numberError
                } =
                    await supabaseAdmin
                        .from(
                            "cards"
                        )
                        .select(
                            "id"
                        )
                        .eq(
                            "number",
                            payload.number
                        )
                        .neq(
                            "id",
                            cardId
                        )
                        .maybeSingle();


                if (
                    numberError
                ) {

                    throw numberError;

                }


                if (
                    existingNumber
                ) {

                    res
                        .status(
                            409
                        )
                        .json(
                            {

                                success:
                                    false,

                                error:
                                    `La carte n°${payload.number} existe déjà.`

                            }
                        );

                    return;

                }

            }


            const finalAvailableFrom =
                payload.available_from !== undefined
                    ? payload.available_from
                    : currentCard.available_from;


            const finalAvailableUntil =
                payload.available_until !== undefined
                    ? payload.available_until
                    : currentCard.available_until;


            if (
                typeof finalAvailableFrom === "string"
                &&
                typeof finalAvailableUntil === "string"
                &&
                new Date(
                    finalAvailableUntil
                ).getTime()
                <=
                new Date(
                    finalAvailableFrom
                ).getTime()
            ) {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "La date de fin doit être postérieure à la date de début."

                        }
                    );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .update(
                        payload
                    )
                    .eq(
                        "id",
                        cardId
                    )
                    .select()
                    .single();


            if (
                error
            ) {

                throw error;

            }


            res.json(
                {

                    success:
                        true,

                    data:
                        mapCard(
                            data as DatabaseCard
                        )

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   UPDATE STATUS
========================================================= */

router.patch(
    "/:id/status",

    async (
        req,
        res,
        next
    ) => {

        try {

            const cardId =
                String(
                    req.params.id
                );


            const status =
                req.body?.status;


            if (
                !isCardStatus(
                    status
                )
            ) {

                res
                    .status(
                        400
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Statut invalide."

                        }
                    );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .update(
                        {

                            status,

                            updated_at:
                                new Date()
                                    .toISOString()

                        }
                    )
                    .eq(
                        "id",
                        cardId
                    )
                    .select()
                    .maybeSingle();


            if (
                error
            ) {

                throw error;

            }


            if (
                !data
            ) {

                res
                    .status(
                        404
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Carte introuvable."

                        }
                    );

                return;

            }


            res.json(
                {

                    success:
                        true,

                    data:
                        mapCard(
                            data as DatabaseCard
                        )

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


/* =========================================================
   DELETE CARD
========================================================= */

router.delete(
    "/:id",

    async (
        req,
        res,
        next
    ) => {

        try {

            const cardId =
                String(
                    req.params.id
                );


            /*
             * On vérifie d'abord que la carte existe.
             */
            const {
                data: card,
                error: cardError
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .select(
                        "id"
                    )
                    .eq(
                        "id",
                        cardId
                    )
                    .maybeSingle();


            if (
                cardError
            ) {

                throw cardError;

            }


            if (
                !card
            ) {

                res
                    .status(
                        404
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Carte introuvable."

                        }
                    );

                return;

            }


            /*
             * Protection collection utilisateur.
             */
            const {
                count: userCardCount,
                error: userCardError
            } =
                await supabaseAdmin
                    .from(
                        "user_cards"
                    )
                    .select(
                        "id",
                        {
                            count:
                                "exact",
                            head:
                                true
                        }
                    )
                    .eq(
                        "card_id",
                        cardId
                    );


            if (
                userCardError
            ) {

                throw userCardError;

            }


            if (
                (
                    userCardCount
                    ??
                    0
                ) > 0
            ) {

                res
                    .status(
                        409
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Cette carte appartient déjà à une collection et ne peut pas être supprimée."

                        }
                    );

                return;

            }


            /*
             * Protection historique d'ouverture.
             */
            const {
                count: openingCount,
                error: openingError
            } =
                await supabaseAdmin
                    .from(
                        "card_opening_results"
                    )
                    .select(
                        "id",
                        {
                            count:
                                "exact",
                            head:
                                true
                        }
                    )
                    .eq(
                        "card_id",
                        cardId
                    );


            if (
                openingError
            ) {

                throw openingError;

            }


            if (
                (
                    openingCount
                    ??
                    0
                ) > 0
            ) {

                res
                    .status(
                        409
                    )
                    .json(
                        {

                            success:
                                false,

                            error:
                                "Cette carte existe dans l'historique des ouvertures et ne peut pas être supprimée."

                        }
                    );

                return;

            }


            const {
                error: deleteError
            } =
                await supabaseAdmin
                    .from(
                        "cards"
                    )
                    .delete()
                    .eq(
                        "id",
                        cardId
                    );


            if (
                deleteError
            ) {

                throw deleteError;

            }


            res.json(
                {

                    success:
                        true,

                    data:
                        {
                            id:
                                cardId
                        }

                }
            );

        }
        catch (
            error
        ) {

            next(
                error
            );

        }

    }
);


export default router;