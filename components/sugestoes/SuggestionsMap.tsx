'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Map, Source, type MapRef } from 'react-map-gl/maplibre'
import { Crosshair, Layers3, MapPin } from 'lucide-react'

import {
  defaultSuggestionCenter,
  suggestionCategoryColors,
  type Suggestion,
  type SuggestionLocation,
} from '@/lib/sugestoes-map'

type SuggestionsMapProps = {
  suggestions: Suggestion[]
  selectedSuggestionId?: string | null
  onSelectSuggestion?: (suggestionId: string) => void
  pickerMode?: boolean
  pickedLocation?: SuggestionLocation | null
  onPickLocation?: (location: SuggestionLocation) => void
}

type SuggestionsFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      id: string
      titulo: string
      categoria: string
      color: string
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

type PickerFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: {
      kind: 'draft'
      titulo: string
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const HITBOX_LAYER_ID = 'sugestoes-hitbox'

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
      padding: { top: 56, right: 28, bottom: 76, left: 28 },
      duration: 800,
      maxZoom: 15.4,
      essential: true,
    },
  )
}

export default function SuggestionsMap({
  suggestions,
  selectedSuggestionId = null,
  onSelectSuggestion,
  pickerMode = false,
  pickedLocation = null,
  onPickLocation,
}: SuggestionsMapProps) {
  const mapRef = useRef<MapRef | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const publicSuggestions = useMemo(
    () => suggestions.filter((suggestion) => suggestion.tipo_envio === 'publico' && suggestion.localizacao),
    [suggestions],
  )

  const center = useMemo(() => {
    if (publicSuggestions.length === 0) return defaultSuggestionCenter

    const lat = publicSuggestions.reduce((total, suggestion) => total + (suggestion.localizacao?.lat ?? 0), 0) / publicSuggestions.length
    const lng = publicSuggestions.reduce((total, suggestion) => total + (suggestion.localizacao?.lng ?? 0), 0) / publicSuggestions.length

    return { lat, lng }
  }, [publicSuggestions])

  const geoJson = useMemo<SuggestionsFeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: publicSuggestions.flatMap((suggestion) => {
      if (!suggestion.localizacao) return []

      return [{
        type: 'Feature',
        properties: {
          id: suggestion.id,
          titulo: suggestion.titulo,
          categoria: suggestion.categoria,
          color: suggestionCategoryColors[suggestion.categoria],
        },
        geometry: {
          type: 'Point',
          coordinates: [suggestion.localizacao.lng, suggestion.localizacao.lat],
        },
      }]
    }),
  }), [publicSuggestions])

  const pickerGeoJson = useMemo<PickerFeatureCollection | null>(() => {
    if (!pickedLocation) return null

    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          kind: 'draft',
          titulo: 'Nova sugestao',
        },
        geometry: {
          type: 'Point',
          coordinates: [pickedLocation.lng, pickedLocation.lat],
        },
      }],
    }
  }, [pickedLocation])

  useEffect(() => {
    const points = publicSuggestions
      .filter((suggestion) => suggestion.localizacao)
      .map((suggestion) => [suggestion.localizacao!.lng, suggestion.localizacao!.lat] as [number, number])

    if (pickedLocation) {
      points.push([pickedLocation.lng, pickedLocation.lat])
    }

    if (selectedSuggestionId) {
      const selected = publicSuggestions.find((suggestion) => suggestion.id === selectedSuggestionId)
      if (selected?.localizacao) {
        fitMapToPoints(mapRef.current, [[selected.localizacao.lng, selected.localizacao.lat], ...points])
        return
      }
    }

    fitMapToPoints(mapRef.current, points)
  }, [pickedLocation, publicSuggestions, selectedSuggestionId])

  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:h-[420px]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 14.1,
        }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={[HITBOX_LAYER_ID]}
        cursor={hoveredId || pickerMode ? 'pointer' : 'grab'}
        onMouseMove={(event) => {
          const id = event.features?.[0]?.properties?.id
          setHoveredId(typeof id === 'string' ? id : null)
        }}
        onMouseLeave={() => setHoveredId(null)}
        onClick={(event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id === 'string') {
            onSelectSuggestion?.(id)
            return
          }

          if (!pickerMode || !onPickLocation) return

          onPickLocation({
            endereco: 'Ponto selecionado no mapa',
            lat: event.lngLat.lat,
            lng: event.lngLat.lng,
          })
        }}
      >
        <Source id="sugestoes-points" type="geojson" data={geoJson}>
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
            id="sugestoes-halo"
            type="circle"
            filter={['any', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], ['==', ['get', 'id'], hoveredId ?? '__none__']] as any}
            paint={{
              'circle-radius': ['case', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], 22, 18],
              'circle-color': '#ffffff',
              'circle-opacity': ['case', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], 0.34, 0.2],
            }}
          />
          <Layer
            id="sugestoes-point"
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'],
                13,
                ['==', ['get', 'id'], hoveredId ?? '__none__'],
                11,
                9,
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': ['case', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], 3, 2],
              'circle-stroke-color': ['case', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], '#0f172a', '#ffffff'],
            }}
          />
          <Layer
            id="sugestoes-label"
            type="symbol"
            filter={['any', ['==', ['get', 'id'], selectedSuggestionId ?? '__none__'], ['==', ['get', 'id'], hoveredId ?? '__none__']] as any}
            layout={{
              'text-field': ['get', 'titulo'],
              'text-size': 11,
              'text-offset': [0, 2],
              'text-anchor': 'top',
            }}
            paint={{
              'text-color': '#111827',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
            }}
          />
        </Source>

        {pickerGeoJson ? (
          <Source id="sugestoes-picker" type="geojson" data={pickerGeoJson}>
            <Layer
              id="sugestoes-picker-halo"
              type="circle"
              paint={{
                'circle-radius': 21,
                'circle-color': '#ffffff',
                'circle-opacity': 0.28,
              }}
            />
            <Layer
              id="sugestoes-picker-point"
              type="circle"
              paint={{
                'circle-radius': 11,
                'circle-color': '#0f172a',
                'circle-stroke-color': '#f59e0b',
                'circle-stroke-width': 3,
              }}
            />
          </Source>
        ) : null}
      </Map>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/90 via-background/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />

      <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-6rem)] flex-col gap-2">
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {pickerMode
            ? 'Toque no mapa para definir a localizacao da sua sugestao'
            : 'Sugestoes publicas visiveis no mapa do centro'}
        </div>
        <div className="rounded-full border border-white/55 bg-background/85 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md">
          {pickerMode
            ? pickedLocation
              ? 'Ponto selecionado para o envio'
              : 'Selecione um ponto de referencia'
            : selectedSuggestionId
              ? 'Sugestao sincronizada com o feed'
              : 'Toque em um pin para destacar no feed'}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            const points = publicSuggestions
              .filter((suggestion) => suggestion.localizacao)
              .map((suggestion) => [suggestion.localizacao!.lng, suggestion.localizacao!.lat] as [number, number])

            if (pickedLocation) {
              points.push([pickedLocation.lng, pickedLocation.lat])
            }

            fitMapToPoints(mapRef.current, points)
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-background/85 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-105"
          aria-label="Mostrar todos os pontos"
        >
          <Layers3 className="h-4 w-4" />
        </button>
      </div>

      {pickerMode && pickedLocation ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <Crosshair className="mt-0.5 h-4 w-4 text-amber-600" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Localizacao selecionada</p>
              <p className="text-xs text-muted-foreground">Lat {pickedLocation.lat.toFixed(5)} / Lng {pickedLocation.lng.toFixed(5)}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!pickerMode && selectedSuggestionId ? (
        <div className="absolute bottom-3 left-3 right-20 z-10 rounded-2xl border border-white/55 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Sugestao em destaque</p>
              <p className="text-xs text-muted-foreground">Pin sincronizado com a lista publica</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

