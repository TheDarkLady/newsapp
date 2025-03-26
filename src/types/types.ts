export interface FormData {
    name: string | null;
    address: string | null;
    country: string | null;
    state: string | null;
    email: string | null;
    mobile: string | null;
    feedback: string | null;
}

export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        id?: string | null;
        name: string;
    };
}