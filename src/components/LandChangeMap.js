import React from 'react';
import { MapContainer, TileLayer, GeoJSON, ScaleControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LandChangeMap.css';

// Data perubahan lahan yang lebih lengkap
const landChangeData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Kalimantan Timur",
        landChange: "Deforestasi",
        year: "2023",
        areaSqKm: 150,
        cause: "Pembukaan Lahan",
        impact: "Tinggi"
      },
      geometry: {
        type: "Point",
        coordinates: [116.419389, 0.538659]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Sumatera Selatan",
        landChange: "Konversi Pertanian",
        year: "2023",
        areaSqKm: 200,
        cause: "Ekspansi Pertanian",
        impact: "Sedang"
      },
      geometry: {
        type: "Point",
        coordinates: [104.757008, -2.990934]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Papua Barat",
        landChange: "Degradasi Hutan",
        year: "2023",
        areaSqKm: 175,
        cause: "Penebangan Liar",
        impact: "Tinggi"
      },
      geometry: {
        type: "Point",
        coordinates: [132.902344, -2.528373]
      }
    }
  ]
};

const LandChangeMap = () => {
  // Style yang lebih sophisticated untuk visualisasi
  const getFeatureStyle = (feature) => {
    const landChangeType = feature.properties.landChange;
    const impact = feature.properties.impact;
    const area = feature.properties.areaSqKm;
    
    // Radius berdasarkan area
    const baseRadius = Math.sqrt(area) * 2;
    
    let fillColor;
    switch (landChangeType) {
      case 'Deforestasi':
        fillColor = '#E31A1C';
        break;
      case 'Konversi Pertanian':
        fillColor = '#33A02C';
        break;
      case 'Degradasi Hutan':
        fillColor = '#FF7F00';
        break;
      default:
        fillColor = '#6A51A3';
        break;
    }

    // Opacity berdasarkan impact
    let opacity = 0.6;
    switch (impact) {
      case "Tinggi":
        opacity = 0.9;
        break;
      case "Sedang":
        opacity = 0.7;
        break;
      case "Rendah":
        opacity = 0.5;
        break;
      default:
        opacity = 0.6;
        break;
    }

    return {
      fillColor: fillColor,
      color: '#fff',
      weight: 2,
      radius: baseRadius,
      fillOpacity: opacity
    };
  };

  const pointToLayer = (feature, latlng) => {
    const style = getFeatureStyle(feature);
    return L.circleMarker(latlng, style);
  };

  const onEachFeature = (feature, layer) => {
    const popupContent = `
      <div class="custom-popup">
        <h3>${feature.properties.name}</h3>
        <div class="popup-content">
          <p><strong>Jenis Perubahan:</strong> ${feature.properties.landChange}</p>
          <p><strong>Tahun:</strong> ${feature.properties.year}</p>
          <p><strong>Luas:</strong> ${feature.properties.areaSqKm.toLocaleString()} km²</p>
          <p><strong>Penyebab:</strong> ${feature.properties.cause}</p>
          <p><strong>Dampak:</strong> ${feature.properties.impact}</p>
        </div>
      </div>
    `;
    
    const popupOptions = {
      maxWidth: 300,
      className: 'custom-popup-container'
    };
    
    layer.bindPopup(popupContent, popupOptions);
    
    layer.on('mouseover', function (e) {
      this.openPopup();
    });
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[-2.548926, 118.014863]}
        zoom={5}
        className="map"
        scrollWheelZoom={false} // Menonaktifkan zoom dengan scroll
        doubleClickZoom={false} // Menonaktifkan zoom dengan double click
        zoomControl={false} // Menonaktifkan kontrol zoom default
      >
        <ZoomControl position="topleft" /> {/* Menambahkan kontrol zoom terpisah */}
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <GeoJSON 
          data={landChangeData}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
        />
        
        <ScaleControl position="bottomleft" />
      </MapContainer>

      <div className="map-legend">
        <h3>Jenis Perubahan Lahan</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#E31A1C' }}></span>
            <span>Deforestasi</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#33A02C' }}></span>
            <span>Konversi Pertanian</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FF7F00' }}></span>
            <span>Degradasi Hutan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandChangeMap;












