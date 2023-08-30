export type ProductData = {
    price: number,
    url: string,
    title: string,
    image: string,
    description: string,
    site: ScrapedProductSite,
    processed: boolean,
    processed_img: string | null,
    copy_img_url: string | null,
    color_palate: string | null
    recombee_id?: string | null
}

export enum ScrapedProductSite {
    FARFETCH = "farfetch",
}