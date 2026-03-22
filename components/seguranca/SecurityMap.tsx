'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LoaderCircle, LocateFixed, MapPin } from 'lucide-react'

import type { SecurityLocation } from '@/lib/seguranca-map'
import { DEFAULT_SECURITY_CENTER } from '@/lib/seguranca-map'
import { getRoute, toMapCoordinates, type MapPoint, type RouteCoordinates, type RouteMode } from '@/services/mapbox'

type SecurityMapProps = {
  locations: SecurityLocation[]
  selectedLocation: SecurityLocation | null
  onSelect: (location: SecurityLocation) => void
}

type SecurityFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      color: string
      typeLabel: string
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
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
      coordinates: [number, number]
    }
  }>
}

type RouteFeature = {
  type: 'Feature'
  properties: { mode: 'route' }
  geometry: {
    type: 'LineString'
    coordinates: RouteCoordinates
  }
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const HITBOX_LAYER_ID = 'seguranca-hitbox'
const HALO_LAYER_ID = 'seguranca-halo'
const POINT_LAYER_ID = 'seguranca-point'
const LABEL_LAYER_ID = 'seguranca-label'

const routeOutlineLayer: LayerProps = {
  id: 'seguranca-route-outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(15, 23, 42, 0.16)',
    'line-width': 10,
    'line-opacity': 0.45,
  },
}

const routeLineLayer: LayerProps = {
  id: 'seguranca-route-line',
  type: 'line',
  paint: {
    'line-color': '#0f766e',
    'line-width': 5,
    'line-dasharray': [1, 1.4],
    'line-opacity': 0.95,
  },
}

function buildRouteFeature(coordinates: RouteCoordinates): RouteFeature {
  return {
    type: 'Feature',
    properties: { mode: 'route' },
    geometry: {
      type: 'LineString',
      coordinates,
    },
  }
}

function fitMapToPoints(map: MapRef | null, points: Array<[number, number]>) {
  if (!map || points.length === 0) return

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
      padding: { top: 56, right: 32, bottom: 88, left: 32 },
      duration: 900,
      maxZoom: 15.2,
      essential: true,
    },
  )
}

function buildPoint(location: SecurityLocation): MapPoint {
  return {
    lat: location.lat,
    lng: location.lng,
  }
}

export default function SecurityMap({ locations, selectedLocation, onSelect }: SecurityMapProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null)
  const [locationMode, setLocationMode] = useState<'locating' | 'live' | 'denied' | 'unsupported'>('locating')
  const [route, setRoute] = useState<RouteFeature | null>(null)
  const [routeMode, setRouteMode] = useState<RouteMode | null>(null)
  const [isRouting, setIsRouting] = useState(false)

  const center = useMemo<MapPoint>(() => {
    if (locations.length === 0) return DEFAULT_SECURITY_CENTER

    const lat = locations.reduce((total, location) => total + location.lat, 0) / locations.length
    const lng = locations.reduce((total, location) => total + location.lng, 0) / locations.length

    return { lat, lng }
  }, [locations])

  const selectedLocationId = selectedLocation?.id ?? '__none__'
  const hoveredLocationId = hoveredId ?? '__none__'
  const userCoordinates = useMemo(() => (userLocation ? toMapCoordinates(userLocation) : null), [userLocation])

  const locationsGeoJSON = useMemo<SecurityFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: locations.map((location) => ({
        type: 'Feature',
        properties: {
          id: location.id,
          nome: location.nome,
          color: location.accentColor,
          typeLabel: location.typeLabel,
        },
        geometry: {
          type: 'Point',
          coordinates: [location.lng, location.lat],
        },
      })),
    }),
    [locations],
  )

  const userGeoJSON = useMemo<UserFeatureCollection | null>(() => {
    if (!userCoordinates) return null

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            kind: 'user',
            nome: 'Sua localização',
          },
          geometry: {
            type: 'Point',
            coordinates: userCoordinates,
          },
        },
      ],
    }
  }, [userCoordinates])

  useEffect(() => {
    let isCancelled = false
    let watchId: number | null = null

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationMode('unsupported')
      return undefined
    }

    const onSuccess = (position: GeolocationPosition) => {
      if (isCancelled) return

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
      setLocationMode('live')
    }

    const onError = () => {
      if (isCancelled) return
      setLocationMode('denied')
      setUserLocation(null)
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })

    watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    })

    return () => {
      isCancelled = true
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    if (locations.length === 0) return

    if (selectedLocation && userCoordinates) {
      fitMapToPoints(mapRef.current, [userCoordinates, [selectedLocation.lng, selectedLocation.lat]])
      return
    }

    fitMapToPoints(
      mapRef.current,
      locations.map((location) => [location.lng, location.lat] as [number, number]),
    )
  }, [locations, selectedLocation, userCoordinates])

  useEffect(() => {
    if (!selectedLocation || !userLocation) {
      setRoute(null)
      setRouteMode(null)
      setIsRouting(false)
      return
    }

    let isCancelled = false

    const syncRoute = async () => {
      setIsRouting(true)
      const result = await getRoute(userLocation, buildPoint(selectedLocation))
      if (isCancelled) return

      setRoute(buildRouteFeature(result.coordinates))
      setRouteMode(result.mode)
      setIsRouting(false)
    }

    void syncRoute()

    return () => {
      isCancelled = true
    }
  }, [selectedLocation, userLocation])

  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:h-[420px]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 14.2,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={[HITBOX_LAYER_ID]}
        cursor={hoveredId ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          setHoveredId(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id !== 'string') return

          const selectedFeature = locations.find((item) => item.id === id)
          if (selectedFeature) onSelect(selectedFeature)
        }}
      >
        {route ? (
          <Source id="seguranca-route" type="geojson" data={route}>
            <Layer {...routeOutlineLayer} />
            <Layer {...routeLineLayer} />
          </Source>
        ) : null}

        {userGeoJSON ? (
          <Source id="seguranca-user" type="geojson" data={userGeoJSON}>
            <Layer
              id="seguranca-user-halo"
              type="circle"
              paint={{
                'circle-radius': 22,
                'circle-color': '#22d3ee',
                'circle-opacity': 0.22,
              }}
            />
            <Layer
              id="seguranca-user-point"
              type="circle"
              paint={{
                'circle-radius': 9,
                'circle-color': '#111827',
                'circle-stroke-color': '#67e8f9',
                'circle-stroke-width': 4,
              }}
            />
            <Layer
              id="seguranca-user-label"
              type="symbol"
              layout={{
                'text-field': ['get', 'nome'],
                'text-size': 11,
                'text-offset': [0, 1.8],
                'text-anchor': 'top',
              }}
              paint={{
                'text-color': '#0f172a',
                'text-halo-color': '#ffffff',
                'text-halo-width': 2,
              }}
            />
          </Source>
        ) : null}

        <Source id="seguranca-points" type="geojson" data={locationsGeoJSON}>
          <Layer
            id={HITBOX_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': 24,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id={HALO_LAYER_ID}
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedLocationId], ['==', ['get', 'id'], hoveredLocationId]] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedLocationId], 23, 19],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedLocationId], 0.34, 0.22],
            }}
          />
          <Layer
            id={POINT_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedLocationId],
                13,
                ['==', ['get', 'id'], hoveredLocationId],
                11,
                9,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': ['case', ['==', ['get', 'id'], selectedLocationId], 3, 2],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedLocationId], '#0f172a', '#ffffff'],
            }}
          />
          <Layer
            id={LABEL_LAYER_ID}
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedLocationId], ['==', ['get', 'id'], hoveredLocationId]] as any}
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

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/90 via-background/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />

      <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-6rem)] flex-col gap-2">
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {locationMode === 'locating'
            ? 'Buscando sua localização...'
            : locationMode === 'live'
              ? 'Sua localização ativa'
              : 'Ative a geolocalização para visualizar sua referência'}
        </div>
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {selectedLocation
            ? !userLocation
              ? 'Selecione um ponto e ative a localização'
              : isRouting
                ? 'Gerando rota...'
                : routeMode === 'mapbox'
                  ? 'Rota do usuario ate a unidade'
                  : 'Rota aproximada do usuario ate a unidade'
            : hoveredId
              ? 'Ponto de segurança em destaque'
              : 'Toque em um marcador para ver os detalhes'}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (selectedLocation && userCoordinates) {
              fitMapToPoints(mapRef.current, [userCoordinates, [selectedLocation.lng, selectedLocation.lat]])
              return
            }

            fitMapToPoints(
              mapRef.current,
              locations.map((location) => [location.lng, location.lat] as [number, number]),
            )
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/85 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          aria-label="Mostrar todos os pontos"
        >
          <Layers3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (!userCoordinates) return

            mapRef.current?.flyTo({
              center: userCoordinates,
              zoom: 15,
              duration: 800,
              essential: true,
            })
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/85 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Centralizar no usuario"
          disabled={!userCoordinates}
        >
          {isRouting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        </button>
      </div>

      {selectedLocation ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div
              className="mt-1 h-3.5 w-3.5 rounded-full border border-white/80"
              style={{ backgroundColor: selectedLocation.accentColor }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{selectedLocation.nome}</p>
              <p className="text-xs text-muted-foreground">{selectedLocation.typeLabel}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{selectedLocation.endereco}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

