import { NextResponse } from 'next/server'
import { Recombee } from "../../lib/recombee"
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const userRecombeeId = body.userRecombeeId
    const page = body.page
    const productType = body.productType

    const recs = await Recombee.getRecs(userRecombeeId, page, productType)

    return NextResponse.json({recs})
}