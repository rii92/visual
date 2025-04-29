import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, ScaleControl } from 'react-leaflet';
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
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedImpact, setSelectedImpact] = useState("all");
  const [isStatsVisible, setIsStatsVisible] = useState(true);

  // Style yang lebih sophisticated untuk visualisasi
  const getFeatureStyle = (feature) => {
    const landChangeType = feature.properties.landChange;
    const impact = feature.properties.impact;
    const area = feature.properties.areaSqKm;
    
    // Radius dinamis berdasarkan area
    const baseRadius = Math.sqrt(area) * 2;
    
    // Color scheme yang lebih sophisticated
    let fillColor;
    switch (landChangeType) {
      case 'Deforestasi':
        fillColor = '#E31A1C'; // Merah yang lebih sophisticated
        break;
      case 'Konversi Pertanian':
        fillColor = '#33A02C'; // Hijau forest
        break;
      case 'Degradasi Hutan':
        fillColor = '#FF7F00'; // Orange burnt
        break;
      default:
        fillColor = '#6A51A3'; // Ungu untuk kasus lain
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
      fillOpacity: opacity,
      className: 'pulse-marker'
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
          <p><strong>Luas:</strong> ${feature.properties.areaSqKm} km²</p>
          <p><strong>Penyebab:</strong> ${feature.properties.cause}</p>
          <p><strong>Dampak:</strong> ${feature.properties.impact}</p>
        </div>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  // Filter data berdasarkan tahun dan dampak
  const filteredData = {
    ...landChangeData,
    features: landChangeData.features.filter(feature => {
      const yearMatch = feature.properties.year === selectedYear;
      const impactMatch = selectedImpact === "all" || feature.properties.impact === selectedImpact;
      return yearMatch && impactMatch;
    })
  };

  // Komponen Statistics
  const Statistics = () => {
    const totalArea = filteredData.features.reduce((sum, feature) => 
      sum + feature.properties.areaSqKm, 0
    );

    const countByType = filteredData.features.reduce((acc, feature) => {
      const type = feature.properties.landChange;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className={`statistics-panel ${isStatsVisible ? 'visible' : ''}`}>
        <div className="stats-header">
          <h4>Statistik Analisis</h4>
          <button className="toggle-stats" onClick={() => setIsStatsVisible(!isStatsVisible)}>
            {isStatsVisible ? '−' : '+'}
          </button>
        </div>
        <div className="stats-content">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <span className="stat-label">Total Area</span>
              <span className="stat-value">{totalArea.toLocaleString()} km²</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-details">
              <span className="stat-label">Jumlah Lokasi</span>
              <span className="stat-value">{filteredData.features.length}</span>
            </div>
          </div>
          {Object.entries(countByType).map(([type, count]) => (
            <div className="stat-card" key={type}>
              <div className="stat-icon">🔍</div>
              <div className="stat-details">
                <span className="stat-label">{type}</span>
                <span className="stat-value">{count} lokasi</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="map-container">
      <div className="controls-container">
        <div className="controls">
          <div className="control-group">
            <label htmlFor="year-select">Tahun</label>
            <select 
              id="year-select"
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select-control"
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="impact-select">Dampak</label>
            <select 
              id="impact-select"
              value={selectedImpact} 
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="select-control"
            >
              <option value="all">Semua Dampak</option>
              <option value="Tinggi">Dampak Tinggi</option>
              <option value="Sedang">Dampak Sedang</option>
              <option value="Rendah">Dampak Rendah</option>
            </select>
          </div>
        </div>
      </div>

      <MapContainer
        center={[-2.548926, 118.014863]}
        zoom={5}
        className="map"
      >
        <LayersControl position="topright">
          {/* Dark Theme Base Map */}
          <LayersControl.BaseLayer name="Dark Theme">
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            />
          </LayersControl.BaseLayer>

          {/* Terrain Base Map */}
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
            />
          </LayersControl.BaseLayer>

          {/* Satellite Imagery */}
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>

          {/* Topographic Layer */}
          <LayersControl.Overlay name="Topografi">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              opacity={0.5}
            />
          </LayersControl.Overlay>

          {/* Temperature Layer */}
          <LayersControl.Overlay name="Suhu">
            <TileLayer
              url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
              opacity={0.5}
            />
          </LayersControl.Overlay>

          {/* Precipitation Layer */}
          <LayersControl.Overlay name="Curah Hujan">
            <TileLayer
              url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
              opacity={0.5}
            />
          </LayersControl.Overlay>
        </LayersControl>
        
        <GeoJSON 
          data={filteredData}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
        />
        
        <ScaleControl position="bottomleft" />
        <Statistics />
      </MapContainer>

      <div className="info-overlay">
        <Statistics />
        <div className="legend-container">
          <h4>Legenda</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#E31A1C' }}></span>
              <span className="legend-label">Deforestasi</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#33A02C' }}></span>
              <span className="legend-label">Konversi Pertanian</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#FF7F00' }}></span>
              <span className="legend-label">Degradasi Hutan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandChangeMap;






