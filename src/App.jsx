import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { getSiteInfo } from './features/site/siteSlice'
import { Suspense, useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'
import PageLoader from './components/PageLoader'

function App() {

  const dispatch = useDispatch();
  const loadInitialData  = async()=>{
    await dispatch(getSiteInfo());
  }

  useEffect(()=>{
    loadInitialData();
  }, []);

  return (
    <>
      <BrowserRouter basename='/staging'>
        <ScrollToTop/>
        <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App
