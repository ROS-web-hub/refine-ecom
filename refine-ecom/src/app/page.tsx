import Navbar from "@/components/navbar"
import { ProductData } from "@/types/product.type"
import { Recombee } from "./lib/recombee"
import { cookies } from 'next/headers'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import {redirect} from 'next/navigation';
import ProductsGrid from "@/components/productsgrid"
//Inspiration: https://dribbble.com/shots/20743352-Fashion-E-commerce-Landing-Page

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({cookies})
  const { data, error } = await supabase.from("scraped-products").select("id, created_at, price, url, title, image, description, site, processed, processed_img, copy_img_url, color_palate").eq("processed", true)
  let productData: ProductData[] = data ?? []

  const user = (await supabase.auth.getUser())?.data?.user
  let recombee_id: string = ""

  if(user) {
    const res = await supabase.from("ecommerce_users").select("recombee_id, onboarding_complete").eq("id", user.id).single()
    console.log("%c Line:22 🍆 res", "color:#465975", res);
    recombee_id = res.data?.recombee_id

    if(!res.data?.onboarding_complete) {
      redirect("/onboarding")
    }

    console.log("Getting recommendations for user: " + recombee_id)
    productData = await Recombee.getRecs(recombee_id, 0, "all")
  }

  return (
    <div className="bg-slate-50 w-full min-h-screen text-black flex flex-col">
      <Navbar/>
      <ProductsGrid
        products={productData}
        userRecombeeId={recombee_id}
      />
    </div>
  )
}
