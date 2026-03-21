import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, country, website, email, phone, whatsapp, logo } = await request.json()

    // Check if user already has a company
    const existingCompany = await db.company.findUnique({
      where: { userId: session.user.id }
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: 'User already has a company profile' },
        { status: 400 }
      )
    }

    // Create company
    const company = await db.company.create({
      data: {
        name,
        description,
        country,
        website: website || null,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        logo: logo || null,
        userId: session.user.id
      }
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Company creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}