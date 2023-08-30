import { SupabaseClient, User, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Recombee } from "../../../lib/recombee"
import { v4 as uuidv4 } from "uuid"

import type { NextRequest } from 'next/server'
import { RecombeeUser } from '@/types/recombeeuser.type'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const protocol = request.url.split("://")[0]
  const host = request.headers.get("host")
  const rootUrl = `${protocol}://${host}`

  console.log("Code: " + code)

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const res = await supabase.auth.exchangeCodeForSession(code)
    console.log("Exchanged code for session:")
    console.log(res)

    console.log("User:")
    const user = res.data.user
    console.log(user)

    if(user) {
      console.log("Continuing with post-signup activities")
      await postSignup(supabase, user)
    }
  }

  return NextResponse.redirect(`${rootUrl}/onboarding`)
}


//This function is called when a user signs up, and carries out any post-signup actions
async function postSignup(supabase: SupabaseClient, user: User) {
  console.log(user, "post sign up")

  console.log("Generating recombee id")
  const recombee_id = uuidv4()
  console.log(recombee_id)

  const recombeeUser: RecombeeUser = {
    userId: recombee_id,
    supabase_id: user.id,
    favorite_colors: []
  }

  console.log("Recombee user info:")
  console.log(recombeeUser)

  const sup_res = await supabase.from("ecommerce_users").insert({id: user.id, recombee_id})
  console.log(sup_res)
  const res = await Recombee.createOrUpdateUser(recombeeUser)
  console.log(res)
}