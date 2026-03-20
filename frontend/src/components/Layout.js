import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [screenSize, setScreenSize] = useState('desktop');

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) setScreenSize('mobile');
    else if (width < 1024) setScreenSize('tablet');
    else if (width < 1440) setScreenSize('laptop');
    else setScreenSize('desktop');
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    const debouncedResize = setTimeout(handleResize, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debouncedResize);
    };
  }, [handleResize]);

  
  const responsiveStyles = {
    appLayout: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: `
        linear-gradient(135deg, #F0FDF4 0%, #FEF7C7 25%, #F0FDF4 50%, #FEF3C7 75%, #F0FDF4 100%),
        radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)
      `,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: screenSize === 'mobile' 
        ? 'rgba(255, 255, 255, 0.98)' 
        : 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(32px)',
      borderBottom: '2px solid rgba(16, 185, 129, 0.25)',
      boxShadow: `
        0 8px 32px rgba(16, 185, 129, 0.16),
        0 4px 16px rgba(245, 158, 11, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.9)
      `
    },
    contentArea: {
      flex: 1,
      padding: screenSize === 'mobile' ? '1rem' : 
               screenSize === 'tablet' ? '1.5rem 2rem' : 
               screenSize === 'laptop' ? '2rem 3rem' : '2.5rem 4rem',
      maxWidth: '1920px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    },
    contentWrapper: {
      width: '100%',
      maxWidth: screenSize === 'mobile' ? '100%' :
                screenSize === 'tablet' ? '100%' :
                screenSize === 'laptop' ? '1280px' : '1600px',
      margin: '0 auto',
      paddingLeft: screenSize === 'mobile' ? '0.5rem' :
                   screenSize === 'tablet' ? '1rem' :
                   screenSize === 'laptop' ? '1.5rem' : '2rem',
      paddingRight: screenSize === 'mobile' ? '0.5rem' :
                    screenSize === 'tablet' ? '1rem' :
                    screenSize === 'laptop' ? '1.5rem' : '2rem',
    }
  };

  return (
    <div style={responsiveStyles.appLayout}>
      <header style={responsiveStyles.header}>
        <Navbar />
      </header>

      <main style={responsiveStyles.contentArea}>
        <div style={responsiveStyles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}