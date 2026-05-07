import { adminAuth } from '@/utilities/firebaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the caller is already an admin
  const callerToken = authHeader.split('Bearer ')[1]
  const decoded = await adminAuth.verifyIdToken(callerToken).catch(() => null)
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { uid } = await req.json()
  if (!uid) {
    return NextResponse.json({ error: 'uid is required' }, { status: 400 })
  }

  await adminAuth.setCustomUserClaims(uid, { role: 'admin' })
  return NextResponse.json({ success: true })
}
