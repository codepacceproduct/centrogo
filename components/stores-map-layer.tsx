'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LoaderCircle, LocateFixed, MapPin } from 'lucide-react'

import type { Store } from '@/lib/data'
import { getRoute, toMapCoordinates, type MapPoint, type RouteCoordinates, type RouteMode } from '@/services/mapbox'

type StoresMapLayerProps = {
  stores: Store[]
  selectedStore: Store | null
  onSelect: (store: Store) => void
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

type StoreFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      highlighted: boolean
      label: string
      color: string
      group: string
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
const STORE_MARKER_COLOR = '#2563eb'
const DEFAULT_CENTER: MapPoint = { lat: -10.9108, lng: -37.0494 }
const STORE_HITBOX_LAYER_ID = 'stores-hitbox'
const STORE_HALO_LAYER_ID = 'stores-halo'
const STORE_POINT_LAYER_ID = 'stores-point'
const STORE_LABEL_LAYER_ID = 'stores-label'

const routeOutlineLayer: LayerProps = {
  id: 'stores-route-outline',
  type: 'line',
  paint: {
    'line-color': 'rgba(15, 23, 42, 0.16)',
    'line-width': 10,
    'line-opacity': 0.45,
  },
}

const routeLineLayer: LayerProps = {
  id: 'stores-route-line',
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

function buildPoint(store: Store): MapPoint {
  return {
    lat: store.latitude,
    lng: store.longitude,
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
      maxZoom: 15.1,
      essential: true,
    },
  )
}

function getStoreMarkerLabel(store: Store) {
  return `${store.loyaltyPoints} pts`
}

export default function StoresMapLayer({ stores, selectedStore, onSelect }: StoresMapLayerProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null)
  const [locationMode, setLocationMode] = useState<'locating' | 'live' | 'denied' | 'unsupported'>('locating')
  const [route, setRoute] = useState<RouteFeature | null>(null)
  const [routeMode, setRouteMode] = useState<RouteMode | null>(null)
  const [isRouting, setIsRouting] = useState(false)

  const center = useMemo<MapPoint>(() => {
    if (stores.length === 0) return DEFAULT_CENTER

    const lat = stores.reduce((total, store) => total + store.latitude, 0) / stores.length
    const lng = stores.reduce((total, store) => total + store.longitude, 0) / stores.length

    return { lat, lng }
  }, [stores])

  const userCoordinates = useMemo(() => (userLocation ? toMapCoordinates(userLocation) : null), [userLocation])
  const selectedStoreId = selectedStore?.id ?? '__none__'
  const hoveredStoreId = hoveredId ?? '__none__'

  const storesGeoJSON = useMemo<StoreFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: stores.map((store) => ({
        type: 'Feature',
        properties: {
          id: store.id,
          nome: store.name,
          highlighted: store.hasPromotion,
          label: getStoreMarkerLabel(store),
          color: store.color,
          group: store.group,
        },
        geometry: {
          type: 'Point',
          coordinates: [store.longitude, store.latitude],
        },
      })),
    }),
    [stores],
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
    if (stores.length === 0) return

    if (selectedStore && userCoordinates) {
      fitMapToPoints(mapRef.current, [userCoordinates, [selectedStore.longitude, selectedStore.latitude]])
      return
    }

    fitMapToPoints(
      mapRef.current,
      stores.map((store) => [store.longitude, store.latitude] as [number, number]),
    )
  }, [selectedStore, stores, userCoordinates])

  useEffect(() => {
    if (!selectedStore || !userLocation) {
      setRoute(null)
      setRouteMode(null)
      setIsRouting(false)
      return
    }

    let isCancelled = false

    const syncRoute = async () => {
      setIsRouting(true)
      const result = await getRoute(userLocation, buildPoint(selectedStore))
      if (isCancelled) return

      setRoute(buildRouteFeature(result.coordinates))
      setRouteMode(result.mode)
      setIsRouting(false)
    }

    void syncRoute()

    return () => {
      isCancelled = true
    }
  }, [selectedStore, userLocation])

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
        interactiveLayerIds={[STORE_HITBOX_LAYER_ID]}
        cursor={hoveredId ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          setHoveredId(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id !== 'string') return

          const selectedFeature = stores.find((item) => item.id === id)
          if (selectedFeature) onSelect(selectedFeature)
        }}
      >
        {route ? (
          <Source id="stores-route" type="geojson" data={route}>
            <Layer {...routeOutlineLayer} />
            <Layer {...routeLineLayer} />
          </Source>
        ) : null}

        {userGeoJSON ? (
          <Source id="stores-user" type="geojson" data={userGeoJSON}>
            <Layer
              id="stores-user-halo"
              type="circle"
              paint={{
                'circle-radius': 22,
                'circle-color': '#22d3ee',
                'circle-opacity': 0.22,
              }}
            />
            <Layer
              id="stores-user-point"
              type="circle"
              paint={{
                'circle-radius': 9,
                'circle-color': '#111827',
                'circle-stroke-color': '#67e8f9',
                'circle-stroke-width': 4,
              }}
            />
            <Layer
              id="stores-user-label"
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

        <Source id="stores-points" type="geojson" data={storesGeoJSON}>
          <Layer
            id={STORE_HITBOX_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': 24,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id={STORE_HALO_LAYER_ID}
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedStoreId], ['==', ['get', 'id'], hoveredStoreId]] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedStoreId], 23, 19],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedStoreId], 0.34, 0.22],
            }}
          />
          <Layer
            id={STORE_POINT_LAYER_ID}
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedStoreId],
                13,
                ['==', ['get', 'id'], hoveredStoreId],
                11,
                9,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedStoreId],
                3,
                ['==', ['get', 'highlighted'], true],
                3,
                2,
              ],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedStoreId], '#0f172a', '#ffffff'],
            }}
          />
          <Layer
            id={STORE_LABEL_LAYER_ID}
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedStoreId], ['==', ['get', 'id'], hoveredStoreId]] as any}
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
          {selectedStore
            ? !userLocation
              ? 'Aguardando sua localização para gerar a rota'
              : isRouting
                ? 'Gerando rota...'
                : routeMode === 'mapbox'
                  ? 'Rota do usuario ate o destino'
                  : 'Rota aproximada do usuario ate o destino'
            : hoveredId
              ? 'Marker premium ativo no mapa'
              : 'Toque em um marker para ver os dados'}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            if (selectedStore && userCoordinates) {
              fitMapToPoints(mapRef.current, [userCoordinates, [selectedStore.longitude, selectedStore.latitude]])
              return
            }

            fitMapToPoints(
              mapRef.current,
              stores.map((store) => [store.longitude, store.latitude] as [number, number]),
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

      {selectedStore ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div
              className="mt-1 h-3.5 w-3.5 rounded-full border border-white/80"
              style={{ backgroundColor: selectedStore.color }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{selectedStore.name}</p>
              <p className="text-xs text-muted-foreground">{selectedStore.subcategoryLabel}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{selectedStore.address}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}




