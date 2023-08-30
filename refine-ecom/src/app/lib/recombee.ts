import { RecombeeUser } from "@/types/recombeeuser.type";
import recombee from "recombee-api-client"
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@supabase/supabase-js"
import { rgb } from "@/types/rgb.type";
import { ProductData } from "@/types/product.type";
import axios from "axios";

const rqs = recombee.requests;

export class Recombee {
    static client = new recombee.ApiClient("refine-app-prod", process.env.RECOMBEE_PRIVATE_KEY ?? "", {region: "ca-east"})
    static supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    
    static async createOrUpdateUser(user: RecombeeUser) {
        let id = user?.userId
        if (!id) {
            id = uuidv4();
        }
    
        const request = new rqs.SetUserValues(id, 
            {
                supabase_id: user.supabase_id,
                favorite_colors: user.favorite_colors
            },
            {
                cascadeCreate: true
            }
        );
    
        const res = await this.client.send(request);
        return res
    }

    static async getUser(supabase_id: string) {
        const request = new rqs.GetUserValues(supabase_id);
        const res = await this.client.send(request);

        return res
    }

    static async getRecs(recombee_id: string, page: number, productType: string): Promise<ProductData[]> {
        const page_size = 20
        let allProducts = []
        
        if(productType === "all") {
            allProducts = (await this.supabase.from("scraped-products").select("*"))?.data as ProductData[]
        } else {
            allProducts = (await this.supabase.from("scraped-products").select("*").eq("product_type", productType))?.data as ProductData[]
        }
        
        if(!recombee_id) return allProducts.slice(page * page_size, page * page_size + page_size)
        
        const user = (await this.getUser(recombee_id)) as any

        const favoriteColors = user?.favorite_colors?.map((hexColor: string) => rgb.fromHex(hexColor))
        
        let scoredProducts: {product: ProductData, score: number}[] = []

        for(let product of allProducts) {
            if(!product.color_palate) continue
            const productColors = rgb.fromColorPalateString(product.color_palate)

            let colorDistances: number[] = []
            productColors.forEach((color: rgb) => {
                favoriteColors?.forEach((favColor: rgb) => {
                    colorDistances.push(color.distance(favColor))
                })
            })
            const minDistance = Math.min(...colorDistances)
            const avgDistance = colorDistances.reduce((a, b) => a + b, 0) / colorDistances.length

            scoredProducts.push({
                product,
                score: avgDistance
            })
        }

        scoredProducts.sort((a,b) => a.score - b.score)
        return scoredProducts.map(a => a.product).slice(page * page_size, page * page_size + page_size)
    }

    static async sendClick(userRecombeeId: string, productRecombeeId: string) {
        const request = new rqs.AddDetailView(userRecombeeId, productRecombeeId);
        const res = await this.client.send(request);
        console.log(res)
        return res
    }
}