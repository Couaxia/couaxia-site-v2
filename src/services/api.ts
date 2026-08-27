/* =========================================================
   API URL
========================================================= */

const rawApiUrl =
    import.meta.env.VITE_API_URL;


export const apiUrl =
    rawApiUrl
        ? rawApiUrl.replace(/\/+$/, "")
        : "";


if (!apiUrl) {

    throw new Error(
        "VITE_API_URL est manquante."
    );

}


/* =========================================================
   API FETCH
========================================================= */

export async function apiFetch<T>(
    path: string
):
    Promise<T> {

    const response =
        await fetch(
            `${apiUrl}${path}`,
            {
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );


    const contentType =
        response.headers.get(
            "content-type"
        );


    if (
        !contentType?.includes(
            "application/json"
        )
    ) {

        const text =
            await response.text();


        console.error(
            "Réponse API non JSON :",
            {
                path,
                status:
                    response.status,

                contentType,

                response:
                    text.slice(
                        0,
                        300
                    )
            }
        );


        throw new Error(
            "Le serveur API n'a pas renvoyé du JSON."
        );

    }


    const result =
        await response.json() as T;


    if (!response.ok) {

        throw new Error(
            `Erreur API : ${response.status}`
        );

    }


    return result;

}