import React from 'react';
import './App.css';
import LandChangeMap from './components/LandChangeMap';

function App() {
  return (
    <div>
      <header>
        <h1>Analisis Perubahan Lahan Indonesia</h1>
      </header>
      <main>
        <LandChangeMap />
      </main>
    </div>
  );
}

export default App;
