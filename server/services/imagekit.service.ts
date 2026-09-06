import ImageKit from "imagekit";


/* =========================================================
   ENV
========================================================= */

const publicKey =
    process.env.IMAGEKIT_PUBLIC_KEY;

const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY;

const urlEndpoint =
    process.env.IMAGEKIT_URL_ENDPOINT;


if (
    !publicKey
    ||
    !privateKey
    ||
    !urlEndpoint
) {

    throw new Error(
        "Variables ImageKit manquantes."
    );

}


/* =========================================================
   CLIENT
========================================================= */

export const imagekit =
    new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint
    });


/* =========================================================
   UPLOAD
========================================================= */

export interface UploadImageKitOptions {

    file:
        Buffer | string;

    fileName:
        string;

    folder?:
        string;

}


export async function uploadToImageKit(
    options:
        UploadImageKitOptions
) {

    const result =
        await imagekit.upload({

            file:
                options.file,

            fileName:
                options.fileName,

            folder:
                options.folder
                ??
                "/artworks",

            useUniqueFileName:
                true,

            isPrivateFile:
                false

        });


    return {

        fileId:
            result.fileId,

        name:
            result.name,

        url:
            result.url,

        filePath:
            result.filePath,

        thumbnailUrl:
            result.thumbnailUrl,

        size:
            result.size

    };

}import ImageKit from "imagekit";


/* =========================================================
   ENV
========================================================= */

const publicKey =
    process.env.IMAGEKIT_PUBLIC_KEY;

const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY;

const urlEndpoint =
    process.env.IMAGEKIT_URL_ENDPOINT;


if (
    !publicKey
    ||
    !privateKey
    ||
    !urlEndpoint
) {

    throw new Error(
        "Variables ImageKit manquantes."
    );

}


/* =========================================================
   CLIENT
========================================================= */

export const imagekit =
    new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint
    });


/* =========================================================
   UPLOAD
========================================================= */

export interface UploadImageKitOptions {

    file:
        Buffer | string;

    fileName:
        string;

    folder?:
        string;

}


export async function uploadToImageKit(
    options:
        UploadImageKitOptions
) {

    const result =
        await imagekit.upload({

            file:
                options.file,

            fileName:
                options.fileName,

            folder:
                options.folder
                ??
                "/artworks",

            useUniqueFileName:
                true,

            isPrivateFile:
                false

        });


    return {

        fileId:
            result.fileId,

        name:
            result.name,

        url:
            result.url,

        filePath:
            result.filePath,

        thumbnailUrl:
            result.thumbnailUrl,

        size:
            result.size

    };

}