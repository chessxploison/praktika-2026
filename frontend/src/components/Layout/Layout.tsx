import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs } from '@consta/uikit/Tabs';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

interface TabItem {
  label: string;
  to: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const tabs: TabItem[] = [
    { label: 'Контрагенты', to: '/customers' },
    { label: 'Лоты', to: '/lots' },
  ];

  const activeTab = tabs.find(tab => 
    location.pathname.startsWith(tab.to)
  ) || tabs[0];

  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Система управления закупками</h1>
        <Tabs
          value={activeTab}
          onChange={() => {}}
          items={tabs}
          getItemLabel={(item) => (
            <Link to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.label}
            </Link>
          )}
          view="clear"
        />
      </header>
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
