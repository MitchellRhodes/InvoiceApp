
import { Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { UserContext } from './contexts/UserContext';

import Layout from './components/layout/Layout';
import ClientInfoPage from './components/pages/ClientInfo';
import FinalInvoicePage from './components/pages/FinalInvoice';
import GenerateInvoicePage from './components/pages/GenerateInvoice';
import LoginPage from './components/pages/LoginPage';
import UserProfilePage from './components/pages/UserProfile';
import { LoadedClientsContextProvider } from './contexts/LoadedClientContext';



function App() {

  const [loggedUser, setLoggedUser] = useState(null);

  const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser]);

  return (
    <Layout>

      <UserContext.Provider value={userValue}>
        <LoadedClientsContextProvider>
          <Routes>

            <Route path='/' element={<LoginPage />} />
            <Route path='/user-profile' element={<UserProfilePage />} />
            <Route path='/client' element={<ClientInfoPage />} />
            <Route path='/generate-invoice/:clientId' element={<GenerateInvoicePage />} />
            <Route path='/finalize-invoice' element={<FinalInvoicePage />} />

          </Routes>
        </LoadedClientsContextProvider>
      </UserContext.Provider>
    </Layout>
  );
}

export default App;
