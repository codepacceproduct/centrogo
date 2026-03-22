'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type LayerProps, type MapRef } from 'react-map-gl/maplibre'
import { Layers3, LoaderCircle, LocateFixed, MapPin } from 'lucide-react'

import {
  DEFAULT_SERVICOS_CENTER,
  SERVICOS_CATEGORY_META,
  formatDistance,
  getDistanceInMeters,
  type ServicoPublico,
} from '@/lib/servicos-map'
import { cn } from '@/lib/utils'
import { toMapCoordinates, type MapPoint } from '@/services/mapbox'

type ServicoMapProps = {
  servicos: ServicoPublico[]
  selectedServico: ServicoPublico | null
  userLocation: MapPoint | null
  nearestServicoId?: string | null
  isMapFull?: boolean
  isMobileFullscreen?: boolean
  onSelect: (servico: ServicoPublico) => void
}

type MarkerFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      nome: string
      categoria: string
      destaque: boolean
      highlighted: boolean
      label: string
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

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const SERVICE_MARKER_COLOR = '#10b981'
const SERVICOS_CLUSTER_LAYER_ID = 'servicos-clusters'
const SERVICOS_CLUSTER_COUNT_LAYER_ID = 'servicos-cluster-count'
const SERVICOS_HITBOX_LAYER_ID = 'servicos-hitbox'
const SERVICOS_HALO_LAYER_ID = 'servicos-halo'
const SERVICOS_POINT_LAYER_ID = 'servicos-point'
const SERVICOS_LABEL_LAYER_ID = 'servicos-label'

const clusterLayer: LayerProps = {
  id: SERVICOS_CLUSTER_LAYER_ID,
  type: 'circle',
  filter: ['has', 'point_count'] as any,
  paint: {
    'circle-color': '#334155',
    'circle-radius': ['step', ['get', 'point_count'], 22, 5, 26, 10, 32],
    'circle-opacity': 0.96,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 3,
  },
}

const clusterCountLayer: LayerProps = {
  id: SERVICOS_CLUSTER_COUNT_LAYER_ID,
  type: 'symbol',
  filter: ['has', 'point_count'] as any,
  layout: {
    'text-field': ['concat', ['get', 'point_count_abbreviated'], ' serv'],
    'text-size': 11,
  },
  paint: {
    'text-color': '#ffffff',
  },
}

function fitMapToPoints(map: MapRef | null, points: Array<[number, number]>, isMapFull: boolean, isMobileFullscreen: boolean) {
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
      padding: {
        top: isMapFull ? 104 : 72,
        right: 24,
        bottom: isMobileFullscreen || isMapFull ? 176 : 72,
        left: 24,
      },
      duration: 900,
      maxZoom: 15.2,
      essential: true,
    },
  )
}

function getServicoMarkerLabel(servico: ServicoPublico) {
  if (servico.horario === '24h') return '24h'
  return servico.horario.split(' - ')[0] ?? servico.horario
}

export default function ServicoMap({
  servicos,
  selectedServico,
  userLocation,
  nearestServicoId = null,
  isMapFull = false,
  isMobileFullscreen = false,
  onSelect,
}: ServicoMapProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const center = userLocation ?? DEFAULT_SERVICOS_CENTER
  const userCoordinates = userLocation ? toMapCoordinates(userLocation) : null
  const selectedId = selectedServico?.id ?? '__none__'
  const hoveredFeatureId = hoveredId ?? '__none__'

  const markersGeoJSON = useMemo<MarkerFeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: servicos.map((servico) => ({
        type: 'Feature',
        properties: {
          id: servico.id,
          nome: servico.nome,
          categoria: servico.categoria,
          destaque: servico.destaque,
          highlighted: servico.destaque || nearestServicoId === servico.id,
          label: getServicoMarkerLabel(servico),
        },
        geometry: {
          type: 'Point',
          coordinates: [servico.lng, servico.lat],
        },
      })),
    }),
    [nearestServicoId, servicos],
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

  useEffect(() => {
    const points = servicos.map((servico) => [servico.lng, servico.lat] as [number, number])
    if (userCoordinates) points.unshift(userCoordinates)
    fitMapToPoints(mapRef.current, points, isMapFull, isMobileFullscreen)
  }, [servicos, userCoordinates, isMapFull, isMobileFullscreen])

  useEffect(() => {
    if (!selectedServico) return

    mapRef.current?.flyTo({
      center: [selectedServico.lng, selectedServico.lat],
      zoom: isMapFull ? 15.8 : 15.1,
      duration: 850,
      essential: true,
    })
  }, [selectedServico, isMapFull])

  const nearestDistanceLabel = useMemo(() => {
    if (!userLocation || !nearestServicoId) return null
    const nearest = servicos.find((servico) => servico.id === nearestServicoId)
    if (!nearest) return null
    return formatDistance(getDistanceInMeters(userLocation, { lat: nearest.lat, lng: nearest.lng }))
  }, [nearestServicoId, servicos, userLocation])

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:min-h-[420px]">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 13.8,
        }}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={[SERVICOS_CLUSTER_LAYER_ID, SERVICOS_HITBOX_LAYER_ID]}
        cursor={hoveredId ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          setHoveredId(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(event) => {
          const feature = event.features?.[0]
          if (!feature) return

          const cluster = feature.properties?.cluster
          if (cluster) {
            const coords = feature.geometry && 'coordinates' in feature.geometry ? feature.geometry.coordinates as [number, number] : null
            if (!coords) return
            mapRef.current?.flyTo({
              center: coords,
              zoom: Math.min((mapRef.current?.getZoom() ?? 13) + 1.6, 16),
              duration: 700,
              essential: true,
            })
            return
          }

          const id = feature.properties?.id
          if (typeof id !== 'string') return
          const selectedFeature = servicos.find((servico) => servico.id === id)
          if (selectedFeature) onSelect(selectedFeature)
        }}
      >
        {userGeoJSON ? (
          <Source id="servicos-user" type="geojson" data={userGeoJSON}>
            <Layer
              id="servicos-user-halo"
              type="circle"
              paint={{
                'circle-radius': 18,
                'circle-color': '#0ea5e9',
                'circle-opacity': 0.18,
              }}
            />
            <Layer
              id="servicos-user-point"
              type="circle"
              paint={{
                'circle-radius': 7,
                'circle-color': '#0ea5e9',
                'circle-stroke-width': 3,
                'circle-stroke-color': '#ffffff',
              }}
            />
          </Source>
        ) : null}

        <Source id="servicos" type="geojson" data={markersGeoJSON} cluster clusterRadius={46} clusterMaxZoom={11}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer
            id={SERVICOS_HITBOX_LAYER_ID}
            type="circle"
            filter={['!', ['has', 'point_count']] as any}
            paint={{
              'circle-radius': 24,
              'circle-color': '#000000',
              'circle-opacity': 0.01,
            }}
          />
          <Layer
            id={SERVICOS_HALO_LAYER_ID}
            type="circle"
            filter={[
              'all',
              ['!', ['has', 'point_count']],
              ['any', ['==', ['get', 'id'], selectedId], ['==', ['get', 'id'], hoveredFeatureId]],
            ] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedId], 23, 19],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedId], 0.34, 0.24],
            }}
          />
          <Layer
            id={SERVICOS_POINT_LAYER_ID}
            type="circle"
            filter={['!', ['has', 'point_count']] as any}
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedId],
                13,
                ['==', ['get', 'id'], hoveredFeatureId],
                11,
                9,
              ],
              'circle-color': SERVICE_MARKER_COLOR,
              'circle-stroke-width': [
                'case',
                ['==', ['get', 'id'], selectedId],
                3,
                ['==', ['get', 'highlighted'], true],
                3,
                2,
              ],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedId], '#064e3b', '#ffffff'],
            }}
          />
          <Layer
            id={SERVICOS_LABEL_LAYER_ID}
            type="symbol"
            filter={[
              'all',
              ['!', ['has', 'point_count']],
              ['any', ['==', ['get', 'id'], selectedId], ['==', ['get', 'id'], hoveredFeatureId]],
            ] as any}
            layout={{
              'text-field': ['get', 'label'],
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

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background/90 via-background/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[calc(100%-6rem)] flex-col gap-2">
        <div className="rounded-full border border-white/55 bg-background/84 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {userLocation ? 'Servicos proximos com geolocalizacao ativa' : 'Mapa urbano com localizacao aproximada do centro'}
        </div>
        {nearestDistanceLabel ? (
          <div className="rounded-full border border-white/55 bg-background/84 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
            Mais proximo a {nearestDistanceLabel}
          </div>
        ) : null}
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            const points = servicos.map((servico) => [servico.lng, servico.lat] as [number, number])
            if (userCoordinates) points.unshift(userCoordinates)
            fitMapToPoints(mapRef.current, points, isMapFull, isMobileFullscreen)
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/84 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          aria-label="Ver todos os servicos"
        >
          <Layers3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (!userCoordinates) return
            mapRef.current?.flyTo({ center: userCoordinates, zoom: 14.8, duration: 800, essential: true })
          }}
          disabled={!userCoordinates}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/84 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105 disabled:opacity-50"
          aria-label="Centralizar no usuario"
        >
          {userLocation ? <LocateFixed className="h-4 w-4" /> : <LoaderCircle className="h-4 w-4 animate-spin" />}
        </button>
      </div>

      {selectedServico ? (
        <div className="pointer-events-none absolute bottom-3 left-3 right-20 z-20 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{selectedServico.nome}</p>
              <p className={cn('mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', SERVICOS_CATEGORY_META[selectedServico.categoria].pillClass)}>
                {SERVICOS_CATEGORY_META[selectedServico.categoria].label}
              </p>
            </div>
            {selectedServico.destaque ? <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">Destaque</span> : null}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{selectedServico.endereco}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}


