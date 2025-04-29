import React, { useEffect, useState } from 'react';
import './App.css';
import LandChangeMap from './components/LandChangeMap';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));

    return () => {
      fadeElements.forEach(element => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="app-container">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <section className="hero-section">
        <h1>Analisis Perubahan Lahan Indonesia</h1>
        <p className="subtitle">Melihat transformasi landscape Indonesia tahun 2023</p>
      </section>

      <section className="intro-section">
        <div className="content-wrapper">
          <h2 className="fade-in">Perubahan Signifikan</h2>
          <p className="fade-in">
            Sepanjang tahun 2023, Indonesia mengalami berbagai perubahan lahan yang signifikan. 
            Dari deforestasi hingga konversi lahan pertanian, perubahan ini membawa dampak besar 
            bagi ekosistem dan masyarakat sekitar.
          </p>
        </div>
      </section>

      <section className="map-section">
        <div className="content-wrapper">
          <h2 className="fade-in">Peta Perubahan Lahan</h2>
          <p className="fade-in">Visualisasi persebaran perubahan lahan di berbagai wilayah Indonesia</p>
          <div className="fade-in">
            <LandChangeMap />
          </div>
        </div>
      </section>

      <section className="analysis-section">
        <div className="content-wrapper">
          <h2 className="fade-in">Analisis Data</h2>
          <div className="stats-grid">
            <div className="stat-card fade-in">
              <h3>525 km²</h3>
              <p>Total Area Perubahan</p>
            </div>
            <div className="stat-card fade-in">
              <h3>3 Wilayah</h3>
              <p>Lokasi Terdampak</p>
            </div>
            <div className="stat-card fade-in">
              <h3>150 km²</h3>
              <p>Deforestasi</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="content-wrapper">
          <h2 className="fade-in">Dampak dan Tantangan</h2>
          <div className="impact-grid">
            <div className="impact-card fade-in">
              <h3>Kalimantan Timur</h3>
              <p>Deforestasi seluas 150 km² akibat pembukaan lahan telah berdampak signifikan 
                 pada ekosistem lokal dan habitat satwa liar.</p>
            </div>
            <div className="impact-card fade-in">
              <h3>Sumatera Selatan</h3>
              <p>Konversi lahan pertanian mencapai 200 km² telah mengubah landscape dan 
                 pola pertanian masyarakat setempat.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;




