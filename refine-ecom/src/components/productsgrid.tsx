"use client";

import { ProductData } from "@/types/product.type"
import Product from "./product"
import Pagination from "@/components/pagination"
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select"

const productTypeOptions = [
    {value: "all", label: "All Products"},
    {value: "shoe", label: "Shoes"},
    {value: "shirt", label: "Shirts"},
]

interface Props {
    products: ProductData[]
    userRecombeeId?: string | undefined | null
}

const ProductsGrid: React.FC<Props> = ({products, userRecombeeId}) => {
    const [selectedProductType, setSelectedProductType] = useState(productTypeOptions[0])
    const [page, setPage] = useState(0)
    const [shoppingProducts, setShoppingProducts] = useState<ProductData[]>([])
    const [loading, setLoading] = useState(true)
    
    async function updatePage() {
        setShoppingProducts([])
        const res = await axios.post("/api/recs", {
            userRecombeeId: userRecombeeId,
            page,
            productType: selectedProductType.value
        })
        setShoppingProducts(res.data.recs)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        updatePage()
    }, [selectedProductType, page])

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <>
        <div className="flex flex-col w-fit mx-auto mb-10">
            <Select 
                className="w-40"
                options={productTypeOptions}
                defaultValue={productTypeOptions[0]}
                onChange={(e)=>{setSelectedProductType(e as any)}}
            />
        </div>
        <div className={`grid gap-9 grid-flow-row grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 px-5 pb-5 opacity-0 transition-all duration-500 ${shoppingProducts.length > 0 && "opacity-100"}`}>
            {shoppingProducts && shoppingProducts.map((product: ProductData, index: number) => (
                <Product product={product} key={index} userRecombeeId={userRecombeeId}/>
            ))}
        </div>
        
        <Pagination
            updatePage={(e)=>{setPage(e)}}
        />
        </>
    )
}

export default ProductsGrid