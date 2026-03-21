export interface MapPoint {
  lat: number
  lng: number
}

export type MapCoordinates = [lng: number, lat: number]
export type RouteCoordinates = MapCoordinates[]
export type RouteMode = 'mapbox' | 'fallback'

export interface RouteResult {
  coordinates: RouteCoordinates
  mode: RouteMode
}

interface RouteApiResponse {
  coordinates?: RouteCoordinates
  mode?: RouteMode
}

export function isMapPoint(value: unknown): value is MapPoint {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const point = value as Partial<MapPoint>
  return typeof point.lat === 'number' && typeof point.lng === 'number'
}

export function assertValidCoords([lng, lat]: MapCoordinates) {
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    throw new Error('Coordenadas invalidas')
  }

  if (lat < -90 || lat > 90) {
    throw new Error('Latitude invalida')
  }

  if (lng < -180 || lng > 180) {
    throw new Error('Longitude invalida')
  }
}

export function normalizeRouteCoordinates(coordinates: RouteCoordinates): RouteCoordinates {
  coordinates.forEach(assertValidCoords)
  return coordinates
}

export function toMapCoordinates(point: MapPoint): MapCoordinates {
  const coordinates: MapCoordinates = [point.lng, point.lat]
  assertValidCoords(coordinates)

  if (process.env.NODE_ENV !== 'production') {
    console.log({
      original: point,
      mapped: coordinates,
    })
  }

  return coordinates
}

export function toMapboxCoordinateString(point: MapPoint) {
  return toMapCoordinates(point).join(',')
}

export function getStraightLineRoute(
  from: MapPoint,
  to: MapPoint,
): RouteCoordinates {
  return normalizeRouteCoordinates([toMapCoordinates(from), toMapCoordinates(to)])
}

export async function getRoute(
  from: MapPoint,
  to: MapPoint,
): Promise<RouteResult> {
  try {
    const response = await fetch('/api/mapbox/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to }),
    })

    if (!response.ok) {
      throw new Error(`Route request failed with status ${response.status}`)
    }

    const data = (await response.json()) as RouteApiResponse

    if (!data.coordinates?.length) {
      throw new Error('Route API returned no coordinates')
    }

    return {
      coordinates: normalizeRouteCoordinates(data.coordinates),
      mode: data.mode === 'mapbox' ? 'mapbox' : 'fallback',
    }
  } catch {
    return {
      coordinates: getStraightLineRoute(from, to),
      mode: 'fallback',
    }
  }
}
