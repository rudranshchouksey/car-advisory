import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const cars = await prisma.car.findMany({
    orderBy: { price: 'asc' },
  })
  return NextResponse.json(cars)
}