/* =========================================================
   CARD RARITY

   Les différentes raretés disponibles
   dans la collection Couaxia.
========================================================= */

export type CardRarity =
    | "common"
    | "uncommon"
    | "rare"
    | "epic"
    | "legendary"
    | "mythic";


/* =========================================================
   CARD CATEGORY

   Permet de classer les cartes par univers/type.
========================================================= */

export type CardCategory =
    | "couaxia"
    | "natsu"
    | "character"
    | "lore"
    | "event"
    | "special";


/* =========================================================
   CARD STATUS
========================================================= */

export type CardStatus =
    | "draft"
    | "active"
    | "disabled";


/* =========================================================
   CARD

   Modèle principal d'une carte.
========================================================= */

export interface Card {

    /* -----------------------------------------------------
       IDENTIFICATION
    ------------------------------------------------------ */

    id: string;


    /*
        Numéro de la carte dans la collection.

        Exemple :
        1 → #001
        25 → #025
    */

    number: number;


    /*
        Nom affiché sur la carte.
    */

    name: string;


    /*
        Description / petit texte de lore.
    */

    description:
        string | null;


    /* -----------------------------------------------------
       CLASSIFICATION
    ------------------------------------------------------ */

    rarity:
        CardRarity;


    category:
        CardCategory;


    /* -----------------------------------------------------
       VISUELS
    ------------------------------------------------------ */

    /*
        Illustration principale.
    */

    imageUrl:
        string;


    /*
        Dos de la carte.

        Peut être null si toutes les cartes
        utilisent le même dos global.
    */

    backImageUrl:
        string | null;


    /* -----------------------------------------------------
       ARTISTE
    ------------------------------------------------------ */

    artist:
        string | null;


    artistUrl:
        string | null;


    /* -----------------------------------------------------
       TIRAGE
    ------------------------------------------------------ */

    /*
        Poids individuel.

        Il permettra éventuellement de rendre
        certaines cartes plus rares que d'autres
        dans une même rareté.
    */

    weight:
        number;


    /* -----------------------------------------------------
       DISPONIBILITÉ
    ------------------------------------------------------ */

    status:
        CardStatus;


    /*
        Carte disponible uniquement
        pendant une période spéciale.
    */

    limited:
        boolean;


    availableFrom:
        string | null;


    availableUntil:
        string | null;


    /* -----------------------------------------------------
       OUVERTURE
    ------------------------------------------------------ */

    /*
        Son personnalisé facultatif.

        Sinon on pourra utiliser le son
        correspondant à la rareté.
    */

    revealSoundUrl:
        string | null;


    /*
        Animation personnalisée facultative.
    */

    revealAnimation:
        string | null;


    /* -----------------------------------------------------
       DATES
    ------------------------------------------------------ */

    createdAt:
        string;


    updatedAt:
        string;
}


/* =========================================================
   CARD RARITY CONFIG

   Configuration complète d'une rareté.

   Ces informations pourront ensuite venir
   directement de Supabase.
========================================================= */

export interface CardRarityConfig {

    id:
        CardRarity;


    /*
        Nom affiché.

        Exemple :
        "Commune"
        "Rare"
        "Légendaire"
    */

    name:
        string;


    /*
        Poids de tirage de cette rareté.
    */

    weight:
        number;


    /*
        Couleur principale utilisée
        dans l'interface et les animations.
    */

    color:
        string;


    /*
        Couleur secondaire facultative.
    */

    secondaryColor:
        string | null;


    /*
        Son par défaut lors de l'ouverture.
    */

    revealSoundUrl:
        string | null;


    /*
        Animation par défaut.
    */

    revealAnimation:
        string | null;
}


/* =========================================================
   USER CARD

   Représente une carte possédée
   par un utilisateur.
========================================================= */

export interface UserCard {

    id:
        string;


    userId:
        string;


    cardId:
        string;


    /*
        Nombre d'exemplaires possédés.
    */

    quantity:
        number;


    /*
        Première obtention.
    */

    firstObtainedAt:
        string;


    /*
        Dernière obtention.
    */

    lastObtainedAt:
        string;
}


/* =========================================================
   USER CARD WITH DETAILS

   Très utile pour afficher directement
   une collection.
========================================================= */

export interface UserCardWithDetails
    extends UserCard {

    card:
        Card;
}


/* =========================================================
   CARD PACK
========================================================= */

export interface CardPack {

    id:
        string;


    name:
        string;


    description:
        string | null;


    /*
        Illustration du booster.
    */

    imageUrl:
        string | null;


    /*
        Nombre de cartes obtenues
        lors d'une ouverture.
    */

    cardsPerPack:
        number;


    /*
        Booster actif ou non.
    */

    active:
        boolean;


    /*
        Booster limité.
    */

    limited:
        boolean;


    availableFrom:
        string | null;


    availableUntil:
        string | null;


    createdAt:
        string;


    updatedAt:
        string;
}


/* =========================================================
   PACK CARD

   Relation entre un booster
   et les cartes qu'il peut contenir.
========================================================= */

export interface CardPackCard {

    id:
        string;


    packId:
        string;


    cardId:
        string;


    /*
        Permet éventuellement de modifier
        le poids d'une carte uniquement
        pour ce booster.
    */

    weightOverride:
        number | null;
}


/* =========================================================
   CARD OPENING SOURCE

   Permet de savoir d'où vient
   une ouverture.

   Important pour le futur :
   site / Twitch / admin / événement.
========================================================= */

export type CardOpeningSource =
    | "website"
    | "twitch"
    | "admin"
    | "event";


/* =========================================================
   CARD OPENING

   Une ouverture de booster effectuée
   par un utilisateur.
========================================================= */

export interface CardOpening {

    id:
        string;


    userId:
        string;


    packId:
        string;


    source:
        CardOpeningSource;


    openedAt:
        string;
}


/* =========================================================
   CARD OPENING RESULT

   Chaque carte obtenue lors
   d'une ouverture.
========================================================= */

export interface CardOpeningResult {

    id:
        string;


    openingId:
        string;


    cardId:
        string;


    /*
        Position de la carte dans le booster.

        Exemple :
        0
        1
        2
        3
        4
    */

    position:
        number;


    /*
        Permet de savoir immédiatement
        si le joueur possédait déjà la carte.
    */

    duplicate:
        boolean;
}


/* =========================================================
   PACK OPENING RESPONSE

   Objet que notre API pourra renvoyer
   au site / Twitch / OBS.
========================================================= */

export interface PackOpeningResponse {

    opening:
        CardOpening;


    pack:
        CardPack;


    cards:
        PackOpeningCardResult[];
}


/* =========================================================
   PACK OPENING CARD RESULT
========================================================= */

export interface PackOpeningCardResult {

    card:
        Card;


    duplicate:
        boolean;


    /*
        Nombre total d'exemplaires possédés
        après cette ouverture.
    */

    quantity:
        number;
}


/* =========================================================
   COLLECTION STATS
========================================================= */

export interface CardCollectionStats {

    /*
        Nombre de cartes différentes possédées.
    */

    uniqueCards:
        number;


    /*
        Nombre total de cartes existantes
        actuellement disponibles dans la collection.
    */

    totalCards:
        number;


    /*
        Nombre total d'exemplaires,
        doublons compris.
    */

    totalCopies:
        number;


    /*
        Pourcentage de collection complétée.

        Exemple :
        72.5
    */

    completion:
        number;
}


/* =========================================================
   COLLECTION

   Objet pratique pour Profile.vue
   ou la future page Collection.vue.
========================================================= */

export interface CardCollection {

    userId:
        string;


    cards:
        UserCardWithDetails[];


    stats:
        CardCollectionStats;
}


/* =========================================================
   OBS REVEAL EVENT

   Données minimales envoyées à OBS
   lorsqu'une carte doit apparaître en stream.
========================================================= */

export interface CardRevealEvent {

    /*
        Identifiant unique de l'événement.
    */

    eventId:
        string;


    /*
        Carte obtenue.
    */

    card:
        Card;


    /*
        Viewer ayant obtenu la carte.
    */

    username:
        string;


    /*
        Avatar Twitch éventuel.
    */

    avatarUrl:
        string | null;


    /*
        Doublon ou nouvelle carte.
    */

    duplicate:
        boolean;


    /*
        Nombre d'exemplaires après obtention.
    */

    quantity:
        number;


    /*
        Origine du tirage.
    */

    source:
        CardOpeningSource;


    /*
        Date de l'événement.
    */

    createdAt:
        string;
}


/* =========================================================
   TWITCH USER

   Informations minimales dont le système
   de cartes aura besoin pour Twitch.
========================================================= */

export interface CardTwitchUser {

    twitchId:
        string;


    login:
        string;


    displayName:
        string;


    profileImageUrl:
        string | null;
}


/* =========================================================
   CARD FILTERS

   Utilisé plus tard pour filtrer
   la collection.
========================================================= */

export interface CardFilters {

    search?:
        string;


    rarity?:
        CardRarity | "all";


    category?:
        CardCategory | "all";


    owned?:
        boolean;


    limited?:
        boolean;
}


/* =========================================================
   CARD SORT
========================================================= */

export type CardSort =
    | "number-asc"
    | "number-desc"
    | "name-asc"
    | "name-desc"
    | "rarity"
    | "newest";