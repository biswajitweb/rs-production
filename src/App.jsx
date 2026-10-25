import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { getSiteInfo } from './features/site/siteSlice'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import PageLoader from './components/PageLoader'

function App() {
  const dispatch = useDispatch();

  const loadInitialData = async () => {
    await dispatch(getSiteInfo());
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Automatic day/night theme
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();

      // Light: 6 AM to 5:59 PM
      // Dark: 6 PM to 5:59 AM
      const theme = hour >= 6 && hour < 18
        ? 'light'
        : 'dark';

      document.documentElement.setAttribute(
        'data-bs-theme',
        theme
      );
    };

    updateTheme();

    const intervalId = setInterval(updateTheme, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <BrowserRouter basename='/staging'>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
