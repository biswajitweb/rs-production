import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../src/assets/css/custom.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions : {
      queries : {
        staleTime : 5 * 60 * 1000,
        retry : 2,
        refetchOnWindowFocus: false
      }
    }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <App />
          </Provider>
        </QueryClientProvider>
        
    </HelmetProvider>
    
    
  </StrictMode>,
)
