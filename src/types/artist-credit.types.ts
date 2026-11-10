export interface ArtistCreditLink {
    label: string;
    url: string;
}

export interface ArtistCredit {
    id?: string;
    artistName: string;
    contribution: string;
    links: ArtistCreditLink[];
    sortOrder: number;
}