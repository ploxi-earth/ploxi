// src/contexts/DashboardContext.jsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [dashboardUrl, setDashboardUrl] = useState('/dashboard');

  // Load dashboard config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setDashboardConfig(config);
        
        if (config.location && config.industry && config.framework) {
          const url = `/dashboard/${config.location.code.toLowerCase()}/${config.industry.id}/${config.framework.id}`;
          setDashboardUrl(url);
        }
      } catch (error) {
        console.error('Failed to parse dashboard config:', error);
      }
    }
  }, []);

  // Update dashboard config
  const updateDashboardConfig = (config) => {
    setDashboardConfig(config);
    localStorage.setItem('dashboardConfig', JSON.stringify(config));
    
    if (config.location && config.industry && config.framework) {
      const url = `/dashboard/${config.location.code.toLowerCase()}/${config.industry.id}/${config.framework.id}`;
      setDashboardUrl(url);
    }
  };

  return (
    <DashboardContext.Provider value={{
      dashboardConfig,
      dashboardUrl,
      updateDashboardConfig
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
