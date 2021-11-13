
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ClientInfoPage from './pages/ClientInfo';
import FinalInvoicePage from './pages/FinalInvoice';
import GenerateInvoicePage from './pages/GenerateInvoice';
import UserProfilePage from './pages/UserProfile';



function App() {
  return (

    <BrowserRouter>
      <Layout>

        <Routes>

          <Route path='/' element={<UserProfilePage />} />
          <Route path='/client' element={<ClientInfoPage />} />
          <Route path='/generate-invoice' element={<GenerateInvoicePage />} />
          <Route path='/finalize-invoice' element={<FinalInvoicePage />} />

        </Routes>

      </Layout>
    </BrowserRouter>

  );
}

export default App;
