import React, { useRef, useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { TieredMenu } from 'primereact/tieredmenu';
import { Button } from 'primereact/button';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import '../index.css';

export default function Navbar() {
  const { user } = useAuthContext();
  const userMenu = useRef(null);
  const { logout } = useLogout();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      label: 'Workers',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Show Workers',
          icon: 'pi pi-list',
          url: '/workers'
        },
        ...(user?.role === 'admin' ? [{
          label: 'Add Worker',
          icon: 'pi pi-plus',
          url: '/workers/add'
        }] : [])
      ]
    },
    {
      label: 'Warehouses',
      icon: 'pi pi-warehouse',
      items: [
        {
          label: 'Show Warehouses',
          icon: 'pi pi-list',
          url: '/warehouses'
        },
        ...(user?.role === 'admin' ? [{
          label: 'Add Warehouse',
          icon: 'pi pi-plus',
          url: '/warehouses/add'
        }] : [])
      ]
    },
    {
      label: 'Vehicles',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Show Vehicles',
          icon: 'pi pi-list',
          url: '/vehicles'
        },
        ...(user?.role === 'admin' ? [{
          label: 'Add Vehicle',
          icon: 'pi pi-plus',
          url: '/vehicles/add'
        }] : [])
      ]
    },
    ...(user?.role === 'admin' ? [
      {
        label: 'Change History',
        icon: 'pi pi-history',
        url: '/change-history'
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        url: '/users'
      }
    ] : []),
    ...(isMobile ? [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          logout();
        }
      }
    ] : [])
  ];

  const userItems = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
      }
    }
  ];

  const start = (
    <div className="logo">
      <i className="pi pi-box"></i> RCN
    </div>
  );

  const end = !isMobile && (
    <div className="user-panel">
      <Button
        label={user?.name}
        icon="pi pi-user"
        className="user-button"
        onClick={(event) => userMenu.current.toggle(event)}
      />
      <TieredMenu model={userItems} popup ref={userMenu} />
    </div>
  );

  return (
    <Menubar model={items} start={start} end={end} />
  );
}
