import { SupabaseClient, User, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Recombee } from "../../../lib/recombee"
import { v4 as uuidv4 } from "uuid"

import type { NextRequest } from 'next/server'
import { RecombeeUser } from '@/types/recombeeuser.type'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {

    const supabase = createRouteHandlerClient({ cookies })
    const res = await supabase.auth.getUser()

    if(!res.error) {

        const user = res.data.user
        await postSignin(supabase, user)
    }

    return NextResponse.json({success: true})
}

async function postSignin(supabase: SupabaseClient, user: User) {

    const supabaseRes = await supabase.from("ecommerce_users").select("*").eq("id", user.id)
    if(supabaseRes.error) {
        console.log("Unable to find user " + user.id) + " in supabase"
        return
    }

    let recombee_id = supabaseRes?.data[0]?.recombee_id
    console.log("Recombee ID: ")
    console.log(recombee_id)

    //If the user does not currently have a linked Recombee entry
    if(!recombee_id) {
        console.log("Creating entry in Recombee")
        recombee_id = uuidv4()
        const recombeeUser: RecombeeUser = {
            userId: recombee_id,
            supabase_id: user.id,
            favorite_colors: []
        }
        console.log(recombeeUser)
        const res = await Recombee.createOrUpdateUser(recombeeUser) //Create a new Recombee user
        console.log(res)
        const res2 = await supabase.from("ecommerce_users").upsert({
            recombee_id,
            id: user.id
        }).eq("id", user.id) //Link their supabase record to the new Recombee user
        console.log(res2)
    }
}