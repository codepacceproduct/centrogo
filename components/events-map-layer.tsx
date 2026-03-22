'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LoaderCircle, LocateFixed, MapPin, Star } from 'lucide-react'

import { EVENT_CATEGORY_META, type AmbulanteMapItem, type EventMapItem } from '@/lib/eventos-map'
import { getRoute, toMapCoordinates, type MapPoint, type RouteCoordinates, type RouteMode } from '@/services/mapbox'

type EventsMapLayerProps = {
  events: EventMapItem[]
  selectedEvent: EventMapItem | null
  selectedAmbulante: AmbulanteMapItem | null
  onSelect: (event: EventMapItem) => void
  onSelectAmbulante: (ambulante: AmbulanteMapItem) => void
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

type EventFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      categoria: string
      highlighted: boolean
      label: string
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

type AmbulanteFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      highlighted: boolean
      label: string
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
const EVENT_MARKER_COLOR = '#7c3aed'
const AMBULANTE_MARKER_COLOR = '#f59e0b'
const DEFAULT_CENTER: MapPoint = { lat: -10.9478, lng: -37.0575 }
const EVENT_HITBOX_LAYER_ID = 'eventos-hitbox'
const EVENT_HALO_LAYER_ID = 'eventos-halo'
const EVENT_POINT_LAYER_ID = 'eventos-point'
const EVENT_LABEL_LAYER_ID = 'eventos-label'
const AMBULANTE_HITBOX_LAYER_ID = 'ambulantes-hitbox'
const AMBULANTE_HALO_LAYER_ID = 'ambulantes-halo'
const AMBULANTE_POINT_LAYER_ID = 'ambulantes-point'
const AMBULANTE_LABEL_LAYER_ID = 'ambulantes-label'

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
      maxZoom: 15.2,
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

function getEventMarkerLabel(event: EventMapItem) {
  return EVENT_CATEGORY_META[event.categoria].label
}

function getAmbulanteMarkerLabel(ambulante: AmbulanteMapItem) {
  const priceMatch = ambulante.precoMedio.match(/R\$\s*\d+/)
  return priceMatch?.[0] ?? ambulante.nome.split(' ')[0] ?? 'Food'
}

export default function EventsMapLayer({
  events,
  selectedEvent,
  selectedAmbulante,
  onSelect,
  onSelectAmbulante,
}: EventsMapLayerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredAmbulanteId, setHoveredAmbulanteId] = useState<string | null>(null)
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
  const ambulantes = useMemo(() => events.flatMap((event) => event.ambulantes), [events])
  const selectedEventId = selectedEvent?.id ?? '__none__'
  const selectedAmbulanteId = selectedAmbulante?.id ?? '__none__'
  const hoveredEventFeatureId = hoveredId ?? '__none__'
  const hoveredAmbulanteFeatureId = hoveredAmbulanteId ?? '__none__'

  const eventsGeoJSON = useMemo<EventFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: events.map((event) => ({
        type: 'Feature',
        properties: {
          id: event.id,
          nome: event.nome,
          categoria: event.categoria,
          highlighted: event.ambulantes.some((ambulante) => ambulante.destaque),
          label: getEventMarkerLabel(event),
        },
        geometry: {
          type: 'Point',
          coordinates: [event.longitude, event.latitude],
        },
      })),
    }),
    [events],
  )

  const ambulantesGeoJSON = useMemo<AmbulanteFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: ambulantes.map((ambulante) => ({
        type: 'Feature',
        properties: {
          id: ambulante.id,
          nome: ambulante.nome,
          highlighted: ambulante.destaque,
          label: getAmbulanteMarkerLabel(ambulante),
        },
        geometry: {
          type: 'Point',
          coordinates: [ambulante.longitude, ambulante.latitude],
        },
      })),
    }),
    [ambulantes],
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
    if (events.length === 0) return

    if (selectedEvent?.ambulantes.length) {
      const selectedPoints = selectedEvent.ambulantes.map(
        (ambulante) => [ambulante.longitude, ambulante.latitude] as [number, number],
      )

      if (userCoordinates) {
        fitMapToPoints(mapRef.current, [
          userCoordinates,
          [selectedEvent.longitude, selectedEvent.latitude],
          ...selectedPoints,
        ])
        return
      }

      fitMapToPoints(mapRef.current, [[selectedEvent.longitude, selectedEvent.latitude], ...selectedPoints])
      return
    }

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
        interactiveLayerIds={[EVENT_HITBOX_LAYER_ID, AMBULANTE_HITBOX_LAYER_ID]}
        cursor={hoveredId || hoveredAmbulanteId ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const feature = event.features?.[0]
          const id = feature?.properties?.id
          const layerId = feature?.layer?.id

          if (typeof id !== 'string') {
            setHoveredId(null)
            setHoveredAmbulanteId(null)
            return
          }

          if (layerId === EVENT_HITBOX_LAYER_ID) {
            setHoveredId(id)
            setHoveredAmbulanteId(null)
            return
          }

          if (layerId === AMBULANTE_HITBOX_LAYER_ID) {
            setHoveredId(null)
            setHoveredAmbulanteId(id)
            return
          }

          setHoveredId(null)
          setHoveredAmbulanteId(null)
        }}
        onMouseLeave={() => {
          setHoveredId(null)
          setHoveredAmbulanteId(null)
        }}
        onClick={(event) => {
          const feature = event.features?.[0]
          const id = feature?.properties?.id
          const layerId = feature?.layer?.id
          if (typeof id !== 'string') return

          if (layerId === EVENT_HITBOX_LAYER_ID) {
            const selectedFeature = events.find((item) => item.id === id)
            if (selectedFeature) onSelect(selectedFeature)
            return
          }

          if (layerId === AMBULANTE_HITBOX_LAYER_ID) {
            const selectedFeature = ambulantes.find((item) => item.id === id)
            if (selectedFeature) onSelectAmbulante(selectedFeature)
          }
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

        <Source id="eventos-points" type="geojson" data={eventsGeoJSON}>
          <Layer
            id={EVENT_HITBOX_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': 24,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id={EVENT_HALO_LAYER_ID}
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedEventId], ['==', ['get', 'id'], hoveredEventFeatureId]] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedEventId], 23, 19],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedEventId], 0.32, 0.22],
            }}
          />
          <Layer
            id={EVENT_POINT_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedEventId],
                13,
                ['==', ['get', 'id'], hoveredEventFeatureId],
                11,
                9,
              ],
              'circle-color': EVENT_MARKER_COLOR,
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedEventId],
                3,
                ['==', ['get', 'highlighted'], true],
                3,
                2,
              ],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedEventId], '#4c1d95', '#ffffff'],
            }}
          />
          <Layer
            id={EVENT_LABEL_LAYER_ID}
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedEventId], ['==', ['get', 'id'], hoveredEventFeatureId]] as any}
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

        <Source id="ambulantes-points" type="geojson" data={ambulantesGeoJSON}>
          <Layer
            id={AMBULANTE_HITBOX_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': 24,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id={AMBULANTE_HALO_LAYER_ID}
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedAmbulanteId], ['==', ['get', 'id'], hoveredAmbulanteFeatureId]] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedAmbulanteId], 23, 19],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedAmbulanteId], 0.32, 0.22],
            }}
          />
          <Layer
            id={AMBULANTE_POINT_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedAmbulanteId],
                13,
                ['==', ['get', 'id'], hoveredAmbulanteFeatureId],
                11,
                9,
              ],
              'circle-color': AMBULANTE_MARKER_COLOR,
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedAmbulanteId],
                3,
                ['==', ['get', 'highlighted'], true],
                3,
                2,
              ],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedAmbulanteId], '#92400e', '#ffffff'],
            }}
          />
          <Layer
            id={AMBULANTE_LABEL_LAYER_ID}
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedAmbulanteId], ['==', ['get', 'id'], hoveredAmbulanteFeatureId]] as any}
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
              : 'Ative a geolocalização para traçar a rota'}
        </div>
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {selectedAmbulante
            ? 'Ambulante destacado no mapa'
            : selectedEvent
              ? !userLocation
                ? 'Selecione um evento e ative a localização'
                : isRouting
                  ? 'Gerando rota para o evento...'
                  : routeMode === 'mapbox'
                    ? 'Rota do usuario ate o evento'
                    : 'Rota aproximada do usuario ate o evento'
              : hoveredId || hoveredAmbulanteId
                ? 'Marker premium em foco'
                : 'Passe o mouse ou toque nos markers de eventos'}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (selectedEvent?.ambulantes.length) {
              const selectedPoints = selectedEvent.ambulantes.map(
                (ambulante) => [ambulante.longitude, ambulante.latitude] as [number, number],
              )
              fitMapToPoints(mapRef.current, [[selectedEvent.longitude, selectedEvent.latitude], ...selectedPoints])
              return
            }

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

      {selectedAmbulante ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{selectedAmbulante.nome}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {selectedAmbulante.tipo} • {selectedAmbulante.precoMedio}
              </p>
            </div>
            {selectedAmbulante.destaque ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : null}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{selectedAmbulante.eventNome}</span>
          </div>
        </div>
      ) : selectedEvent ? (
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



