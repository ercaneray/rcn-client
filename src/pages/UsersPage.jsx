import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { FilterMatchMode } from 'primereact/api';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function UsersPage() {
    const { user } = useAuthContext();
    const [data, setData] = useState([]);
    const toast = useRef(null);
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState('');
    const [filters, setFilters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['name'].value = value;

        setFilters(_filters);
        setFilterValue(value);
    };

    const fetchUsers = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const users = await response.json();
        console.log(users);
        if (response.ok) {
            setData(users.users);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="custom-action-buttons">
                <Button
                    icon="pi pi-user"
                    className="p-button-success custom-action-button-success"
                    onClick={() => navigate(`/profile/${rowData._id}`)}
                />
            </div>
        );
    };

    const filteredData = data.filter((user) => user.role !== 'admin');

    return (
        <>
            <div className="iconfield-users">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Name" value={filterValue} onChange={onFilterChange} />
                </IconField>
            </div>
            <div className="users-page">
                <Toast ref={toast} />
                <DataTable value={filteredData} stripedRows tableStyle={{ minWidth: '50rem' }} filters={filters} globalFilterFields={['name']}>
                    <Column field="name" header="Name" headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }}></Column>
                    <Column field="email" header="Email" headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }}></Column>
                    <Column field="role" header="Role" headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }}></Column>
                    <Column body={actionBodyTemplate} header="Actions" ></Column>
                </DataTable>
            </div>
        </>

    );
}

export default UsersPage;
