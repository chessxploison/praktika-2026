import React from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import LotList from './components/Lots/LotList';
import LotForm from './components/Lots/LotForm';

function App() {
  return (
    <Theme preset={presetGpnDefault}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/edit/:id" element={<CustomerForm />} />
            <Route path="/lots" element={<LotList />} />
            <Route path="/lots/new" element={<LotForm />} />
            <Route path="/lots/edit/:id" element={<LotForm />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Theme>
  );
}

export default App;
