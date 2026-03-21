import { NextResponse } from 'next/server'

import {
  assertValidCoords,
  getStraightLineRoute,
  isMapPoint,
  toMapboxCoordinateString,
  type RouteCoordinates,
} from '@/services/mapbox'

interface DirectionsResponse {
  routes?: Array<{
    geometry?: {
      coordinates?: RouteCoordinates
    }
  }>
}

const DIRECTIONS_PROFILE = 'mapbox/driving-traffic'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  const from = payload?.from
  const to = payload?.to

  if (!isMapPoint(from) || !isMapPoint(to)) {
    return NextResponse.json({ error: 'Invalid route payload.' }, { status: 400 })
  }

  const fallback = getStraightLineRoute(from, to)
  const token = process.env.MAPBOX_SECRET_TOKEN

  if (!token) {
    return NextResponse.json({ coordinates: fallback, mode: 'fallback' })
  }

  try {
    const url = new URL(
      `https://api.mapbox.com/directions/v5/${DIRECTIONS_PROFILE}/${toMapboxCoordinateString(from)};${toMapboxCoordinateString(to)}`,
    )

    url.searchParams.set('alternatives', 'false')
    url.searchParams.set('geometries', 'geojson')
    url.searchParams.set('overview', 'full')
    url.searchParams.set('steps', 'false')
    url.searchParams.set('access_token', token)

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Mapbox directions failed with status ${response.status}`)
    }

    const data = (await response.json()) as DirectionsResponse
    const coordinates = data.routes?.[0]?.geometry?.coordinates

    coordinates?.forEach(assertValidCoords)

    if (!coordinates?.length) {
      return NextResponse.json({ coordinates: fallback, mode: 'fallback' })
    }

    return NextResponse.json({ coordinates, mode: 'mapbox' })
  } catch {
    return NextResponse.json({ coordinates: fallback, mode: 'fallback' })
  }
}
