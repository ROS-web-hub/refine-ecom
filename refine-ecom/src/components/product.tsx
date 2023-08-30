"use client";

import { ProductData } from "@/types/product.type"
import ShoppingCartButton from "./shoppingCartIcon"
import ColorPalateDisplay from "./colorPalateDisplay"
import { useState } from "react"

interface Props {
    product: ProductData
    userRecombeeId?: string | undefined | null
}

const Product: React.FC<Props> = ({product, userRecombeeId}) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    
    return (
        <div className="flex flex-col text-black shadow-lg p-5 rounded-lg bg-white transition-all hover:shadow-xl">
            <div className={`mb-5 transition-all ${imageLoaded ? "bg-white" : "bg-gray-100 rounded-lg shadow animate-pulse"}`}>
                <img src={product.copy_img_url ?? ""} onLoad={()=>{console.log("Image loaded"); setImageLoaded(true)}} alt={product.title} className={`mb-auto transition-all ${imageLoaded ? "opacity-100" : "opacity-0"}`}/>
            </div>
            <ColorPalateDisplay
                colorPalate={product.color_palate}
            />
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <p className="text-gray-700">{product.title}</p>
                    <p className="font-bold text-xl">${product.price.toLocaleString("en-us", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <ShoppingCartButton url={product.url} productRecombeeId={product.recombee_id} userRecombeeId={userRecombeeId}/>
            </div>
        </div>
    )
}

export default Product