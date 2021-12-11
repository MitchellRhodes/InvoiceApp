
import { Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { UserContext } from './contexts/UserContext';

import Layout from './components/layout/Layout';
import ClientInfoPage from './components/pages/ClientInfo';
import GenerateInvoicePage from './components/pages/GenerateInvoice';
import LoginPage from './components/pages/LoginPage';
import UserProfilePage from './components/pages/UserProfile';
import { LoadedClientsContextProvider } from './contexts/LoadedClientContext';
import { LoadedInvoicesContextProvider } from './contexts/loadedInvoicesContext';
import AllClientInvoicesPage from './components/pages/AllClientInvoices';



function App() {

  const [loggedUser, setLoggedUser] = useState(null);

  const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser]);

  return (
    <Layout>

      <UserContext.Provider value={userValue}>
        <LoadedClientsContextProvider>
          <LoadedInvoicesContextProvider>
            <Routes>

              <Route path='/' element={<LoginPage />} />
              <Route path='/user-profile' element={<UserProfilePage />} />
              <Route path='/client' element={<ClientInfoPage />} />
              <Route path='/generate-invoice/:clientId' element={<GenerateInvoicePage />} />
              <Route path='/client-invoices/:clientId' element={<AllClientInvoicesPage />} />

            </Routes>
          </LoadedInvoicesContextProvider>
        </LoadedClientsContextProvider>
      </UserContext.Provider>
    </Layout>
  );
}

export default App;
