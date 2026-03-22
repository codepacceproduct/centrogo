'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LocateFixed, LoaderCircle, Route } from 'lucide-react'

import {
  DEFAULT_EXPLORAR_CENTER,
  formatLocationScore,
  type ExplorarLocation,
} from '@/lib/explorar-map'
import { cn } from '@/lib/utils'
import {
  assertValidCoords,
  getRoute,
  toMapCoordinates,
  type MapPoint,
  type RouteCoordinates,
  type RouteMode,
} from '@/services/mapbox'

type LineFeature = {
  type: 'Feature'
  properties: {
    mode: 'route'
  }
  geometry: {
    type: 'LineString'
    coordinates: RouteCoordinates
  }
}

type PoiFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      categoria: string
    }
    geometry: {
      type: 'Point'
      coordinates: RouteCoordinates[number]
    }
  }>
}

type UserFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      kind: 'user'
      nome: string
    }
    geometry: {
      type: 'Point'
      coordinates: RouteCoordinates[number]
    }
  }>
}

type ExplorarMapLayerProps = {
  locations: ExplorarLocation[]
  selected: ExplorarLocation | null
  routeTarget?: ExplorarLocation | null
  hoveredLocationId?: string | null
  onSelect: (location: ExplorarLocation) => void
  onHoverChange?: (locationId: string | null) => void
  isMobileFullscreen?: boolean
  isFullMap?: boolean
  resetCounter?: number
  clearSelectionOnReset?: boolean
}

type MarkerEntry = {
  location: ExplorarLocation
  coordinates: RouteCoordinates[number]
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const POI_HITBOX_LAYER_ID = 'explorar-pois-hitbox'

const routeOutlineLayer: LayerProps = {
  id: 'route-outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(15, 23, 42, 0.2)',
    'line-width': 11,
    'line-opacity': 0.45,
  },
}

const routeLineLayer: LayerProps = {
  id: 'route-line',
  type: 'line',
  paint: {
    'line-color': '#0f766e',
    'line-width': 6,
    'line-dasharray': [0.75, 1.6],
    'line-opacity': 0.95,
  },
}

function buildLineFeature(coordinates: RouteCoordinates, mode: 'route'): LineFeature {
  return {
    type: 'Feature',
    properties: {
      mode,
    },
    geometry: {
      type: 'LineString',
      coordinates,
    },
  }
}

function getDistanceInKm(from: MapPoint, to: MapPoint) {
  const toRadians = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const originLat = toRadians(from.lat)
  const targetLat = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function StatusPill({
  children,
  tone = 'default',
}: {
  children: string
  tone?: 'default' | 'warning' | 'accent'
}) {
  return (
    <div
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md',
        tone === 'warning'
          ? 'border-amber-300/40 bg-amber-100/88 text-amber-950'
          : tone === 'accent'
            ? 'border-amber-300/35 bg-amber-50/92 text-amber-950'
            : 'border-white/45 bg-background/84 text-foreground',
      )}
    >
      {children}
    </div>
  )
}

export default function ExplorarMapLayer({
  locations,
  selected,
  routeTarget = null,
  hoveredLocationId = null,
  onSelect,
  onHoverChange,
  isMobileFullscreen = false,
  isFullMap = false,
  resetCounter = 0,
}: ExplorarMapLayerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [userLocation, setUserLocation] = useState<MapPoint>(DEFAULT_EXPLORAR_CENTER)
  const [locationMode, setLocationMode] = useState<'locating' | 'live' | 'fallback'>('locating')
  const [route, setRoute] = useState<LineFeature | null>(null)
  const [routeMode, setRouteMode] = useState<RouteMode | null>(null)
  const [isRouting, setIsRouting] = useState(false)
  const [mapIssue, setMapIssue] = useState<string | null>(null)

  const userMapCoordinates = useMemo(() => toMapCoordinates(userLocation), [userLocation])
  const markerEntries = useMemo<MarkerEntry[]>(
    () =>
      locations.map((location) => {
        const coordinates = toMapCoordinates(location)
        assertValidCoords(coordinates)

        return {
          location,
          coordinates,
        }
      }),
    [locations],
  )
  const selectedMarkerEntry = useMemo(
    () => markerEntries.find(({ location }) => location.id === selected?.id) ?? null,
    [markerEntries, selected?.id],
  )
  const markersGeoJSON = useMemo<PoiFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: markerEntries.map(({ location, coordinates }) => ({
        type: 'Feature',
        properties: {
          id: location.id,
          nome: location.nome,
          categoria: location.categoria,
        },
        geometry: {
          type: 'Point',
          coordinates,
        },
      })),
    }),
    [markerEntries],
  )
  const userGeoJSON = useMemo<UserFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { kind: 'user', nome: 'Sua localizacao' },
          geometry: {
            type: 'Point',
            coordinates: userMapCoordinates,
          },
        },
      ],
    }),
    [userMapCoordinates],
  )
  const selectedId = selected?.id ?? '__none__'
  const hoveredId = hoveredLocationId ?? '__none__'

  function fitMapToCoordinates(points: Array<[number, number]>) {
    const map = mapRef.current
    if (!map || points.length === 0) {
      return
    }

    let minLng = points[0][0]
    let maxLng = points[0][0]
    let minLat = points[0][1]
    let maxLat = points[0][1]

    for (const [lng, lat] of points) {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    }

    map.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: {
          top: isFullMap ? 108 : 112,
          right: 28,
          bottom: isMobileFullscreen || isFullMap ? 176 : 104,
          left: 28,
        },
        duration: 1050,
        essential: true,
        maxZoom: 14.7,
      },
    )
  }

  function focusAllLocations() {
    const shouldIncludeUser =
      locationMode === 'live' && getDistanceInKm(userLocation, DEFAULT_EXPLORAR_CENTER) <= 4
    const points = shouldIncludeUser
      ? [userMapCoordinates, ...markerEntries.map(({ coordinates }) => coordinates)]
      : markerEntries.map(({ coordinates }) => coordinates)

    fitMapToCoordinates(points)
  }

  useEffect(() => {
    let isCancelled = false

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationMode('fallback')
      return undefined
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) return

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationMode('live')
      },
      () => {
        if (isCancelled) return
        setLocationMode('fallback')
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      },
    )

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!routeTarget) {
      setRoute(null)
      setRouteMode(null)
      setIsRouting(false)
      return
    }

    mapRef.current?.flyTo({
      center: toMapCoordinates(routeTarget),
      zoom: isFullMap ? 16 : 15.1,
      duration: 1000,
      essential: true,
    })

    let isCancelled = false

    const syncRoute = async () => {
      setIsRouting(true)
      const result = await getRoute(userLocation, routeTarget)
      if (isCancelled) return

      setRoute(buildLineFeature(result.coordinates, 'route'))
      setRouteMode(result.mode)
      setIsRouting(false)
    }

    void syncRoute()

    return () => {
      isCancelled = true
    }
  }, [routeTarget, userLocation, isFullMap])

  useEffect(() => {
    if (resetCounter === 0) return

    setRoute(null)
    setRouteMode(null)
    setIsRouting(false)

    const timer = window.setTimeout(() => {
      focusAllLocations()
    }, 80)

    return () => {
      window.clearTimeout(timer)
    }
  }, [resetCounter])

  useEffect(() => {
    if (!isMobileFullscreen && !isFullMap) {
      return
    }

    const timer = window.setTimeout(() => {
      if (!selected) {
        focusAllLocations()
      }
    }, 180)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isMobileFullscreen, isFullMap, markerEntries, userLocation, userMapCoordinates, selected])

  return (
    <div className="absolute inset-0 z-0">
      <Map
        ref={mapRef}
        onLoad={() => setMapIssue(null)}
        onError={() => {
          setMapIssue('Nao foi possivel carregar a base do mapa agora.')
        }}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          onHoverChange?.(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => onHoverChange?.(null)}
        onClick={(event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id !== 'string') return

          const location = markerEntries.find((entry) => entry.location.id === id)?.location
          if (location) onSelect(location)
        }}
        interactiveLayerIds={[POI_HITBOX_LAYER_ID]}
        initialViewState={{
          longitude: userMapCoordinates[0],
          latitude: userMapCoordinates[1],
          zoom: 13.8,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        minZoom={10.8}
      >
        {route ? (
          <Source id="explorar-route" type="geojson" data={route}>
            <Layer {...routeOutlineLayer} />
            <Layer {...routeLineLayer} />
          </Source>
        ) : null}

        <Source id="explorar-user" type="geojson" data={userGeoJSON}>
          <Layer
            id="explorar-user-halo"
            type="circle"
            paint={{
              'circle-radius': 19,
              'circle-color': '#0ea5e9',
              'circle-opacity': 0.18,
            }}
          />
          <Layer
            id="explorar-user-point"
            type="circle"
            paint={{
              'circle-radius': 7,
              'circle-color': '#0ea5e9',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id="explorar-user-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'nome'],
              'text-size': 11,
              'text-offset': [0, 1.9],
              'text-anchor': 'top',
            }}
            paint={{
              'text-color': '#111827',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            }}
          />
        </Source>

        <Source id="explorar-pois" type="geojson" data={markersGeoJSON}>
          <Layer
            id={POI_HITBOX_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': 20,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id="explorar-pois-halo"
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedId], ['==', ['get', 'id'], hoveredId]] as any}
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedId],
                20,
                16,
              ],
              'circle-color': '#ffffff',
              'circle-opacity': [
                'case',
                ['==', ['get', 'id'], selectedId],
                0.34,
                0.22,
              ],
            }}
          />
          <Layer
            id="explorar-pois-layer"
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedId],
                12,
                ['==', ['get', 'id'], hoveredId],
                10,
                8,
              ],
              'circle-color': [
                'match',
                ['get', 'categoria'],
                'comercio',
                '#f59e0b',
                'turismo',
                '#10b981',
                'mobilidade',
                '#0ea5e9',
                'servicos',
                '#f43f5e',
                'referencia',
                '#334155',
                '#64748b',
              ],
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedId],
                3,
                ['==', ['get', 'id'], hoveredId],
                3,
                2,
              ],
              'circle-stroke-color': [
                'case',
                ['==', ['get', 'id'], selectedId],
                '#0f172a',
                '#ffffff',
              ],
            }}
          />
          <Layer
            id="explorar-pois-label"
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedId], ['==', ['get', 'id'], hoveredId]] as any}
            layout={{
              'text-field': ['get', 'nome'],
              'text-size': 11,
              'text-offset': [0, 2.1],
              'text-anchor': 'top',
            }}
            paint={{
              'text-color': '#111827',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            }}
          />
        </Source>
      </Map>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-background/92 via-background/45 to-transparent sm:h-32" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-background/92 via-background/35 to-transparent sm:h-36" />

      <div className="pointer-events-none absolute left-3 top-[5.5rem] z-20 flex max-w-[calc(100%-1.5rem)] flex-col gap-2 sm:left-4 sm:top-4 sm:max-w-[calc(100%-8rem)] lg:top-6 lg:max-w-sm">
        {locationMode === 'locating' ? (
          <StatusPill>Buscando sua localizacao...</StatusPill>
        ) : locationMode === 'live' ? (
          <StatusPill>Localizacao ativa</StatusPill>
        ) : (
          <StatusPill tone="warning">Localizacao aproximada em uso</StatusPill>
        )}

        {routeTarget ? (
          <StatusPill>
            {isRouting
              ? 'Gerando rota...'
              : routeMode === 'mapbox'
                ? 'Rota Mapbox via servidor'
                : 'Rota fallback mockada'}
          </StatusPill>
        ) : isMobileFullscreen || isFullMap ? (
          <StatusPill>Mapa em foco: toque nos pinos ou abra a lista</StatusPill>
        ) : (
          <StatusPill>Toque em um marcador ou card para navegar</StatusPill>
        )}
      </div>

      <div className="absolute bottom-[5.5rem] right-3 z-20 flex flex-col gap-2 sm:bottom-6 sm:right-4 lg:bottom-8">
        <button
          type="button"
          onClick={() => {
            focusAllLocations()
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/84 text-foreground shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:h-12 sm:w-12"
          aria-label="Mostrar todos os pontos"
        >
          <Layers3 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            mapRef.current?.flyTo({
              center: userMapCoordinates,
              zoom: 14,
              duration: 900,
              essential: true,
            })
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/84 text-foreground shadow-xl backdrop-blur-md transition-transform hover:scale-105 sm:h-12 sm:w-12"
          aria-label="Centralizar no usuario"
        >
          {isRouting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        </button>

        {routeTarget ? (
          <div className="hidden pointer-events-none rounded-2xl border border-white/45 bg-background/84 px-3 py-2 text-xs shadow-xl backdrop-blur-md sm:block">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Route className="h-3.5 w-3.5" />
              <span>
                {routeTarget.pesoGamificacao} x {routeTarget.multiplicadorFluxo} = {formatLocationScore(routeTarget.score)}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {mapIssue ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-[10.5rem] z-20 rounded-2xl border border-amber-300/45 bg-amber-100/90 px-4 py-3 text-sm text-amber-950 shadow-xl backdrop-blur-md sm:inset-x-auto sm:right-4 sm:bottom-24 sm:w-80">
          {mapIssue}
        </div>
      ) : null}
    </div>
  )
}
