"use client";
import Link from "next/link"
import { RecombeeClient } from "@/app/lib/recombeeclient"

interface Props {
    url: string,
    userRecombeeId?: string | undefined | null
    productRecombeeId?: string | undefined | null
}

const ShoppingCartButton: React.FC<Props> = ({url, userRecombeeId, productRecombeeId}) => {
    async function sendClick() {
        if(userRecombeeId && productRecombeeId) {
            RecombeeClient.sendClick(userRecombeeId, productRecombeeId)
        } else {
            console.log("User or product recombee id is undefined")
        }
    }
    return (
        <Link href={url} onClick={sendClick}>
            <div className="bg-gray-900 p-2 rounded-lg w-10 h-10 mt-auto transition-all hover:bg-gray-700 hover:scale-105 hover:shadow-md">
                <img src="/shopping_cart.png"/>
            </div>
        </Link>
    )
}

export default ShoppingCartButton