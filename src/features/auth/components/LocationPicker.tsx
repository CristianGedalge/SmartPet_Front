import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Crosshair, LoaderCircle, Minus, Plus } from 'lucide-react';
import { Map as LibreMap, Marker, Popup } from 'maplibre-gl';
import { MAP_STYLE_URL as STYLE_URL } from '../../../config/map.config';
import 'maplibre-gl/dist/maplibre-gl.css';
import { isValidLocation, type LocationCoordinates } from '../../../utils/map.utils';

interface LocationPickerProps {
  value: LocationCoordinates | null;
  onChange: (location: LocationCoordinates | null) => void;
  disabled?: boolean;
  required?: boolean;
}

const INITIAL_CENTER = { latitud: -17.7833, longitud: -63.1821 };

function coordinates(latitude: number, longitude: number): LocationCoordinates {
  return {
    latitud: Number(latitude.toFixed(6)),
    longitud: Number((((longitude + 180) % 360 + 360) % 360 - 180).toFixed(6)),
  };
}

export function LocationPicker({ value, onChange, disabled = false, required = true }: LocationPickerProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const propsRef = useRef({ value, onChange, disabled });
  const [zoom, setZoom] = useState(14);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => { propsRef.current = { value, onChange, disabled }; }, [value, onChange, disabled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = propsRef.current.value;
    const center = initial && isValidLocation(initial) ? initial : INITIAL_CENTER;
    let map: LibreMap;
    try {
      map = new LibreMap({
        container, style: STYLE_URL, center: [center.longitud, center.latitud],
        zoom: 14, minZoom: 3, maxZoom: 19, keyboard: false,
      });
    } catch {
      container.replaceChildren();
      queueMicrotask(() => { if (container.isConnected) setMapError(true); });
      return;
    }
    mapRef.current = map;
    const popup = new Popup({ offset: 28 }).setText('Ubicación del establecimiento');
    const marker = new Marker({ color: '#00a884', draggable: true }).setPopup(popup);
    markerRef.current = marker;
    marker.getElement().setAttribute('aria-label', 'Ubicación seleccionada. Abrir detalles');

    const choose = (latitude: number, longitude: number) => {
      if (propsRef.current.disabled) return;
      propsRef.current.onChange(coordinates(latitude, longitude));
      setGeoError(null);
    };
    const click = (event: { lngLat: { lat: number; lng: number }; originalEvent: MouseEvent }) => {
      const target = event.originalEvent.target;
      if (target instanceof Element && target.closest('.maplibregl-marker, .maplibregl-popup, .maplibregl-control-container')) return;
      choose(event.lngLat.lat, event.lngLat.lng);
    };
    const dragEnd = () => { const point = marker.getLngLat(); choose(point.lat, point.lng); };
    const zoomEnd = () => setZoom(map.getZoom());
    const error = () => setMapError(true);
    const idle = () => { if (map.isStyleLoaded() && map.areTilesLoaded()) setMapError(false); };
    map.on('click', click);
    map.on('zoom', zoomEnd);
    map.on('error', error);
    map.on('idle', idle);
    marker.on('dragend', dragEnd);
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      map.off('click', click);
      map.off('zoom', zoomEnd);
      map.off('error', error);
      map.off('idle', idle);
      marker.off('dragend', dragEnd);
      popup.remove();
      marker.remove();
      map.remove();
      markerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    if (value && isValidLocation(value)) {
      marker.setLngLat([value.longitud, value.latitud]);
      if (!marker.getElement().isConnected) marker.addTo(map);
      if (!map.getBounds().contains([value.longitud, value.latitud])) {
        map.jumpTo({ center: [value.longitud, value.latitud] });
      }
    } else marker.remove();
  }, [value]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handlers = [map.dragPan, map.scrollZoom, map.boxZoom, map.doubleClickZoom, map.touchZoomRotate, map.dragRotate, map.touchPitch];
    handlers.forEach((handler) => disabled ? handler.disable() : handler.enable());
    map.getCanvas().tabIndex = disabled ? -1 : 0;
    markerRef.current?.setDraggable(!disabled);
    const element = markerRef.current?.getElement();
    if (element) {
      element.tabIndex = disabled ? -1 : 0;
      element.style.pointerEvents = disabled ? 'none' : '';
    }
    if (disabled) markerRef.current?.getPopup()?.remove();
  }, [disabled]);

  function choose(latitude: number, longitude: number) {
    if (disabled) return;
    onChange(coordinates(latitude, longitude));
    setGeoError(null);
  }

  function useCurrentLocation() {
    const map = mapRef.current;
    if (!map || disabled) return;
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Tu navegador no permite obtener la ubicación. Marca el punto en el mapa.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (mapRef.current !== map) return;
        setLocating(false);
        if (propsRef.current.disabled) return;
        propsRef.current.onChange(coordinates(coords.latitude, coords.longitude));
        map.jumpTo({ center: [coords.longitude, coords.latitude], zoom: 17 });
      },
      (error) => {
        if (mapRef.current !== map) return;
        setLocating(false);
        setGeoError(error.code === 1
          ? 'No diste permiso de ubicación. Puedes marcar el establecimiento en el mapa.'
          : 'No pudimos obtener tu ubicación. Marca el establecimiento en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  function mapKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const map = mapRef.current;
    if (!map || disabled || (event.target !== event.currentTarget && event.target !== map.getCanvas())) return;
    const directions: Record<string, [number, number]> = { ArrowLeft: [-80, 0], ArrowRight: [80, 0], ArrowUp: [0, -80], ArrowDown: [0, 80] };
    const offset = directions[event.key];
    if (offset) { event.preventDefault(); map.panBy(offset, { duration: 0 }); }
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); const center = map.getCenter(); choose(center.lat, center.lng);
    } else if (event.key === '+' || event.key === '-') {
      event.preventDefault(); map.setZoom(map.getZoom() + (event.key === '+' ? 1 : -1));
    }
  }

  return (
    <fieldset className="location-picker" disabled={disabled}>
      <legend>Ubicación del establecimiento {required && <span aria-hidden="true">*</span>}</legend>
      <p id={`${id}-instructions`}>Toca el mapa para marcar tu veterinaria o albergue. Arrastra para moverte y usa + / − para acercarte.</p>
      <button type="button" className="location-gps" disabled={disabled || locating} onClick={useCurrentLocation}>{locating ? <LoaderCircle size={15} className="animate-spin" /> : <Crosshair size={15} />}{locating ? 'Buscando ubicación…' : 'Usar mi ubicación actual'}</button>
      <div className="location-map-wrapper">
        <div ref={containerRef} className="location-map" role="group" aria-label="Mapa para seleccionar la ubicación del establecimiento" aria-describedby={`${id}-instructions ${id}-keyboard`} tabIndex={disabled ? -1 : 0} aria-disabled={disabled} onKeyDown={mapKeyDown} />
        <span className="location-crosshair" aria-hidden="true">+</span>
        <div className="location-zoom"><button type="button" aria-label="Acercar mapa" disabled={disabled || zoom >= 19} onClick={() => mapRef.current?.zoomIn()}><Plus size={19} /></button><button type="button" aria-label="Alejar mapa" disabled={disabled || zoom <= 3} onClick={() => mapRef.current?.zoomOut()}><Minus size={19} /></button></div>
      </div>
      <p id={`${id}-keyboard`} className="location-keyboard">Con teclado: flechas para moverte y Enter para marcar el centro. Pulsa el marcador para ver sus detalles.</p>
      {mapError && <p className="location-warning" role="status">No se pudo cargar parte del mapa. Revisa tu conexión y que tu navegador permita WebGL, y vuelve a abrir esta pantalla.</p>}
      {geoError && <p className="location-warning" role="alert">{geoError}</p>}
      <p className={'location-selection ' + (value ? 'confirmed' : '')} role="status">{value ? 'Ubicación seleccionada. Confirma que el marcador esté en tu establecimiento.' : 'Todavía no has marcado una ubicación.'}</p>
    </fieldset>
  );
}
