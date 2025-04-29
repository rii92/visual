import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div className="theme-toggle">
      <input
        type="checkbox"
        id="theme-switch"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-switch" className="toggle-label">
        <span className="toggle-icon">🌙</span>
        <span className="toggle-icon">☀️</span>
      </label>
    </div>
  );
};

export default ThemeToggle;