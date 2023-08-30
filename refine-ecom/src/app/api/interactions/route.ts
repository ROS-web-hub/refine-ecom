import { NextResponse } from 'next/server'
import { Recombee } from "../../lib/recombee"
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const body = await request.json()

    await Recombee.sendClick(body.userRecombeeId, body.productRecombeeId)

    return NextResponse.json({success: true})
}