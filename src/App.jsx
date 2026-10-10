import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { getSiteInfo } from './features/site/siteSlice'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop'

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
      <BrowserRouter>
        <ScrollToTop/>
        <AppRoutes/>
        
      </BrowserRouter>
    </>
  )
}

export default App
