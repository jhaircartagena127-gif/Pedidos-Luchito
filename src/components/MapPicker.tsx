import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPin, Navigation, ExternalLink, Check, Info } from "lucide-react";
import { SANTA_CRUZ_COORDS } from "@/data/products";
import { LocationCoordinates } from "@/types";

interface MapPickerProps {
  location: LocationCoordinates;
  onChangeLocation: (loc: LocationCoordinates) => void;
}

export function MapPicker({ location, onChangeLocation }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [locating, setLocating] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard leaflet icon path in bundlers
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat || SANTA_CRUZ_COORDS.lat, location.lng || SANTA_CRUZ_COORDS.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([location.lat, location.lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup("<b>Ubicación de entrega / Colegio</b><br>Arrastra este pin hasta la puerta exacta.").openPopup();

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChangeLocation({
          lat: Number(pos.lat.toFixed(6)),
          lng: Number(pos.lng.toFixed(6)),
          addressText: location.addressText,
        });
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChangeLocation({
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
          addressText: location.addressText,
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalidate size after modal/render
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    } else {
      // Sync marker if external position changed
      if (markerRef.current) {
        markerRef.current.setLatLng([location.lat, location.lng]);
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        onChangeLocation({
          lat,
          lng,
          addressText: location.addressText || "Ubicación detectada por GPS",
        });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
          markerRef.current.openPopup();
        }
      },
      (err) => {
        setLocating(false);
        alert("No se pudo obtener tu ubicación GPS. Puedes arrastrar el marcador manualmente en el mapa de Santa Cruz.");
      },
      { timeout: 10000 }
    );
  };

  const handleShortcut = (lat: number, lng: number, label: string) => {
    onChangeLocation({ lat, lng, addressText: label });
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.openPopup();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-black uppercase text-neutral-700 tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#d92d20]" />
          <span>Fijar Punto en el Mapa (Santa Cruz)</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseGPS}
            disabled={locating}
            className="flex items-center gap-1 text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>{locating ? "Localizando..." : "Usar mi GPS"}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-800 underline"
            title="Abrir en Google Maps"
          >
            <span>Ver en Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Quick reference shortcuts for Santa Cruz */}
      <div className="flex flex-wrap gap-1.5 text-[11px] text-neutral-600">
        <span className="font-semibold text-neutral-400">Puntos rápidos:</span>
        <button
          type="button"
          onClick={() => handleShortcut(-17.7833, -63.1821, "Plaza 24 de Septiembre (Centro)")}
          className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
        >
          Centro / Plaza 24 Sep
        </button>
        <button
          type="button"
          onClick={() => handleShortcut(-17.7712, -63.1754, "Equipetrol / San Martín")}
          className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
        >
          Equipetrol
        </button>
        <button
          type="button"
          onClick={() => handleShortcut(-17.7550, -63.1720, "Cristo Redentor / Av. Banzer")}
          className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
        >
          Av. Banzer (Norte)
        </button>
        <button
          type="button"
          onClick={() => handleShortcut(-17.8050, -63.2050, "Doble Vía a La Guardia")}
          className="bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded cursor-pointer"
        >
          Doble Vía La Guardia
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-inner h-64 sm:h-72 w-full z-0">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>

      {/* Coordinates feedback */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          Haz clic en el mapa o arrastra el pin hasta tu colegio o domicilio.
        </span>
        <span className="font-mono font-bold text-neutral-700">
          [{location.lat}, {location.lng}]
        </span>
      </div>
    </div>
  );
}
