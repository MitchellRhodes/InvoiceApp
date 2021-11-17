
import { Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { UserContext, userContext } from './contexts/UserContext';

import Layout from './components/layout/Layout';
import ClientInfoPage from './components/pages/ClientInfo';
import FinalInvoicePage from './components/pages/FinalInvoice';
import GenerateInvoicePage from './components/pages/GenerateInvoice';
import LoginPage from './components/pages/LoginPage';
import UserProfilePage from './components/pages/UserProfile';



function App() {

  const [loggedUser, setLoggedUser] = useState(null);

  const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser]);

  return (
    <Layout>

      <UserContext.Provider value={userValue}>
        <Routes>

          <Route path='/' element={<LoginPage />} />
          <Route path='/user-profile' element={<UserProfilePage />} />
          <Route path='/client' element={<ClientInfoPage />} />
          <Route path='/generate-invoice' element={<GenerateInvoicePage />} />
          <Route path='/finalize-invoice' element={<FinalInvoicePage />} />

        </Routes>
      </UserContext.Provider>
    </Layout>
  );
}

export default App;
