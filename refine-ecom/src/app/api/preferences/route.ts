import { SupabaseClient, User, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Recombee } from "../../lib/recombee"
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    const res = await supabase.auth.getUser()

    if(!res.error) {
        const user = res.data.user
        await savePreferences(supabase, user, body.favoriteColors, body.name)
    }

    return NextResponse.json({success: true})
}

export async function GET(request: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies })
    const res = await supabase.auth.getUser()

    if(!res.error) {
        const user = res.data.user
        const preferences = await loadPreferences(supabase, user.id)
        return NextResponse.json(preferences)
    }

    return NextResponse.json({})
}

async function loadPreferences(supabase: SupabaseClient, supabase_id: string) {
    const supabaseRes = await supabase.from("ecommerce_users").select("name, recombee_id").eq("id", supabase_id).single()
    if(supabaseRes.error) {
        console.log("Unable to find user " + supabase_id) + " in supabase"
        return
    }

    let recombee_id = supabaseRes.data.recombee_id
    const recombeeRes = await Recombee.getUser(recombee_id) as any

    if(recombeeRes.error) {
        console.log("Unable to find user " + recombee_id) + " in recombee"
        return
    }

    return {
        name: supabaseRes.data.name,
        favorite_colors: recombeeRes.favorite_colors
    }
}

async function savePreferences(supabase: SupabaseClient, user: User, favorite_colors: string[], name: string) {
    const supabaseRes = await supabase.from("ecommerce_users").select("*").eq("id", user.id)
    if(supabaseRes.error) {
        console.log("Unable to find user " + user.id) + " in supabase"
        return
    }

    let recombee_id = supabaseRes.data[0]?.recombee_id
    await Recombee.createOrUpdateUser({
        userId: recombee_id,
        supabase_id: user.id,
        favorite_colors
    })

    await supabase.from("ecommerce_users").update({name, onboarding_complete: true}).eq("id", user.id)
}