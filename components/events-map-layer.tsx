'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LoaderCircle, LocateFixed, MapPin } from 'lucide-react'

import type { EventMapItem } from '@/lib/eventos-map'
import { getRoute, toMapCoordinates, type MapPoint, type RouteCoordinates, type RouteMode } from '@/services/mapbox'

type EventsMapLayerProps = {
  events: EventMapItem[]
  selectedEvent: EventMapItem | null
  onSelect: (event: EventMapItem) => void
}

type EventFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      categoria: string
      descricao: string
      cor: string
      endereco: string
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
const EVENTOS_HITBOX_LAYER_ID = 'eventos-hitbox'
const EVENTOS_LAYER_ID = 'eventos-layer'
const DEFAULT_CENTER: MapPoint = { lat: -10.9478, lng: -37.0575 }

const routeOutlineLayer: LayerProps = {
  id: 'eventos-route-outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(15, 23, 42, 0.16)',
    'line-width': 10,
    'line-opacity': 0.45,
  },
}

const routeLineLayer: LayerProps = {
  id: 'eventos-route-line',
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
      maxZoom: 14.8,
      essential: true,
    },
  )
}

function buildPoint(event: EventMapItem): MapPoint {
  return {
    lat: event.latitude,
    lng: event.longitude,
  }
}

export default function EventsMapLayer({ events, selectedEvent, onSelect }: EventsMapLayerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null)
  const [locationMode, setLocationMode] = useState<'locating' | 'live' | 'denied' | 'unsupported'>('locating')
  const [route, setRoute] = useState<RouteFeature | null>(null)
  const [routeMode, setRouteMode] = useState<RouteMode | null>(null)
  const [isRouting, setIsRouting] = useState(false)

  const center = useMemo<MapPoint>(() => {
    if (events.length === 0) return DEFAULT_CENTER

    const lat = events.reduce((total, event) => total + event.latitude, 0) / events.length
    const lng = events.reduce((total, event) => total + event.longitude, 0) / events.length

    return { lat, lng }
  }, [events])

  const userCoordinates = useMemo(() => (userLocation ? toMapCoordinates(userLocation) : null), [userLocation])

  const eventosGeoJSON = useMemo<EventFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: events.map((event) => ({
        type: 'Feature',
        properties: {
          id: event.id,
          nome: event.nome,
          categoria: event.categoria,
          descricao: event.descricao,
          cor:
            event.categoria === 'show'
              ? '#E74C3C'
              : event.categoria === 'cultural'
                ? '#8E44AD'
                : event.categoria === 'religioso'
                  ? '#3498DB'
                  : event.categoria === 'corporativo'
                    ? '#2ECC71'
                    : '#F1C40F',
          endereco: event.endereco,
        },
        geometry: {
          type: 'Point',
          coordinates: [event.longitude, event.latitude],
        },
      })),
    }),
    [events],
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
            nome: 'Sua localizacao',
          },
          geometry: {
            type: 'Point',
            coordinates: userCoordinates,
          },
        },
      ],
    }
  }, [userCoordinates])

  const selectedId = selectedEvent?.id ?? '__none__'

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
    if (events.length === 0) return

    if (selectedEvent && userCoordinates) {
      fitMapToPoints(mapRef.current, [userCoordinates, [selectedEvent.longitude, selectedEvent.latitude]])
      return
    }

    fitMapToPoints(
      mapRef.current,
      events.map((event) => [event.longitude, event.latitude] as [number, number]),
    )
  }, [events, selectedEvent, userCoordinates])

  useEffect(() => {
    if (!selectedEvent || !userLocation) {
      setRoute(null)
      setRouteMode(null)
      setIsRouting(false)
      return
    }

    let isCancelled = false

    const syncRoute = async () => {
      setIsRouting(true)
      const result = await getRoute(userLocation, buildPoint(selectedEvent))
      if (isCancelled) return

      setRoute(buildRouteFeature(result.coordinates))
      setRouteMode(result.mode)
      setIsRouting(false)
    }

    void syncRoute()

    return () => {
      isCancelled = true
    }
  }, [selectedEvent, userLocation])

  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:h-[420px]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 13.6,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={[EVENTOS_HITBOX_LAYER_ID, EVENTOS_LAYER_ID]}
        cursor={hoveredId ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          setHoveredId(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id !== 'string') return

          const selected = events.find((item) => item.id === id)
          if (selected) onSelect(selected)
        }}
      >
        {route ? (
          <Source id="eventos-route" type="geojson" data={route}>
            <Layer {...routeOutlineLayer} />
            <Layer {...routeLineLayer} />
          </Source>
        ) : null}

        {userGeoJSON ? (
          <Source id="eventos-user" type="geojson" data={userGeoJSON}>
            <Layer
              id="eventos-user-halo"
              type="circle"
              paint={{
                'circle-radius': 22,
                'circle-color': '#22d3ee',
                'circle-opacity': 0.22,
              }}
            />
            <Layer
              id="eventos-user-point"
              type="circle"
              paint={{
                'circle-radius': 9,
                'circle-color': '#111827',
                'circle-stroke-color': '#67e8f9',
                'circle-stroke-width': 4,
              }}
            />
            <Layer
              id="eventos-user-label"
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

        <Source id="eventos" type="geojson" data={eventosGeoJSON}>
          <Layer
            id={EVENTOS_HITBOX_LAYER_ID}
            type="circle"
            source="eventos"
            paint={{
              'circle-radius': 20,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id="eventos-selected-halo"
            type="circle"
            source="eventos"
            filter={['==', ['get', 'id'], selectedId] as any}
            paint={{
              'circle-radius': 19,
              'circle-color': '#ffffff',
              'circle-opacity': 0.35,
            }}
          />
          <Layer
            id={EVENTOS_LAYER_ID}
            type="circle"
            source="eventos"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedId],
                11,
                ['==', ['get', 'id'], hoveredId ?? '__none__'],
                9,
                6,
              ],
              'circle-color': [
                'match',
                ['get', 'categoria'],
                'show', '#E74C3C',
                'cultural', '#8E44AD',
                'religioso', '#3498DB',
                'corporativo', '#2ECC71',
                '#F1C40F',
              ],
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedId],
                3,
                ['==', ['get', 'id'], hoveredId ?? '__none__'],
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
            id="eventos-label"
            type="symbol"
            source="eventos"
            filter={['==', ['get', 'id'], selectedId] as any}
            layout={{
              'text-field': ['get', 'nome'],
              'text-size': 11,
              'text-offset': [0, 1.9],
              'text-anchor': 'top',
            }}
            paint={{
              'text-color': '#0f172a',
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
            ? 'Buscando sua localizacao...'
            : locationMode === 'live'
              ? 'Sua localizacao ativa'
              : 'Ative a geolocalizacao para tracar a rota'}
        </div>
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {selectedEvent
            ? !userLocation
              ? 'Selecione um evento e ative a localizacao'
              : isRouting
                ? 'Gerando rota para o evento...'
                : routeMode === 'mapbox'
                  ? 'Rota do usuario ate o evento'
                  : 'Rota aproximada do usuario ate o evento'
            : 'Passe o mouse ou toque nos markers de eventos'}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (selectedEvent && userCoordinates) {
              fitMapToPoints(mapRef.current, [userCoordinates, [selectedEvent.longitude, selectedEvent.latitude]])
              return
            }

            fitMapToPoints(
              mapRef.current,
              events.map((event) => [event.longitude, event.latitude] as [number, number]),
            )
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/85 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          aria-label="Mostrar todos os eventos"
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

      {selectedEvent ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <p className="text-sm font-semibold text-foreground">{selectedEvent.nome}</p>
          <p className="text-xs text-muted-foreground">{selectedEvent.categoria}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{selectedEvent.endereco}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
