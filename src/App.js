
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ClientInfoPage from './components/pages/ClientInfo';
import FinalInvoicePage from './components/pages/FinalInvoice';
import GenerateInvoicePage from './components/pages/GenerateInvoice';
import LoginPage from './components/pages/LoginPage';
import UserProfilePage from './components/pages/UserProfile';



function App() {
  return (
    <Layout>

      <Routes>

        <Route path='/' element={<LoginPage />} />
        <Route path='/user-profile' element={<UserProfilePage />} />
        <Route path='/client' element={<ClientInfoPage />} />
        <Route path='/generate-invoice' element={<GenerateInvoicePage />} />
        <Route path='/finalize-invoice' element={<FinalInvoicePage />} />

      </Routes>

    </Layout>
  );
}

export default App;
