import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes/default.theme';
import GlobalStyles from 'themes/global.style';
import AuthProvider from 'context/AuthProvider';
import { VillaProvider } from 'context/VillaContext';
import AppRoutes from './router';
import 'antd/dist/reset.css';
import './style/index.css';
import { SearchProvider } from 'context/SearchContext';

const App = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <VillaProvider> {/* Wrap AppRoutes with VillaProvider */}
            <SearchProvider>
              <AppRoutes />
            </SearchProvider>
          </VillaProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.Fragment>
  </ThemeProvider>
);
const root = createRoot(document.getElementById('root'));
root.render(<App />);
