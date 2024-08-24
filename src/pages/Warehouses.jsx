import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { FilterMatchMode } from 'primereact/api';
import EditForm from '../components/EditForm';
import TransactionForm from '../components/TransactionForm';
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

function Warehouses() {
    const { user } = useAuthContext();
    const [data, setData] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [transactionDialogVisible, setTransactionDialogVisible] = useState(false);
    const [selectedWarehouseForTransaction, setSelectedWarehouseForTransaction] = useState(null);
    const toast = useRef(null);
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

    const fetchWarehouses = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/warehouses`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const warehouses = await response.json();
        if (response.ok) {
            setData(warehouses.warehouses);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWarehouses();
        }
    }, [user]);

    const deleteWarehouse = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/warehouses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });
            if (response.ok) {
                setData(data.filter((warehouse) => warehouse._id !== id));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Warehouse deleted', life: 3000 });
            } else {
                console.error('Failed to delete warehouse');
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete warehouse', life: 3000 });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting warehouse', life: 3000 });
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this warehouse?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteWarehouse(id)
        });
    };

    const handleSave = () => {
        fetchWarehouses();
        setSelectedWarehouse(null);
        setEditDialogVisible(false);
    };

    const handleCancel = () => {
        setSelectedWarehouse(null);
        setEditDialogVisible(false);
    };

    const handleTransactionSave = () => {
        fetchWarehouses();
        setSelectedWarehouseForTransaction(null);
        setTransactionDialogVisible(false);
    };

    const handleTransactionCancel = () => {
        setSelectedWarehouseForTransaction(null);
        setTransactionDialogVisible(false);
    };

    const actionBodyTemplate = (rowData) => {
        const userCityPermissions = user.cityPermissions.find(permission =>permission.city === rowData.city);
        const canUpdate = userCityPermissions ? userCityPermissions.canUpdate : false;
        const canDelete = user.role === 'admin';

        return (
            <div className="custom-action-buttons">
                {(canUpdate || user.role === 'admin') && (
                    <Button icon="pi pi-pencil" className="p-button-success custom-action-button-success" onClick={() => { setSelectedWarehouse(rowData); setEditDialogVisible(true); }} />
                )}
                {(canUpdate || user.role === 'admin') && (
                    <Button icon="pi pi-arrow-right-arrow-left" className="p-button-info custom-action-button-info" onClick={() => { setSelectedWarehouseForTransaction(rowData); setTransactionDialogVisible(true); }} />
                )}
                {canDelete && (
                    <Button icon="pi pi-trash" className="p-button-danger custom-action-button-danger" onClick={() => confirmDelete(rowData._id)} />
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="iconfield">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Name" value={filterValue} onChange={onFilterChange}/>
                </IconField>
            </div>
            <div className="warehouses-page">
                <Toast ref={toast} />
                <ConfirmDialog />
                
                <DataTable value={data} stripedRows tableStyle={{ minWidth: '50rem' }} showGridlines filters={filters} globalFilterFields={['name']}>
                    <Column field="name" header="Name" ></Column>
                    <Column field="city" header="City"></Column>
                    <Column field="stock.reg" header="Reg"></Column>
                    <Column field="stock.sf" header="SF"></Column>
                    <Column field="stock.blue" header="Blue"></Column>
                    <Column field="stock.red" header="Red"></Column>
                    <Column field="stock.yellow" header="Yellow"></Column>
                    <Column field="stock.white" header="White"></Column>
                    <Column field="stock.peach" header="Peach"></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
                {selectedWarehouse && (
                    <EditForm
                        formType="warehouses"
                        data={selectedWarehouse}
                        onSave={handleSave}
                        onHide={handleCancel}
                        visible={editDialogVisible}
                    />
                )}
                {selectedWarehouseForTransaction && (
                    <TransactionForm
                        selectedData={selectedWarehouseForTransaction}
                        onSave={handleTransactionSave}
                        onHide={handleTransactionCancel}
                        visible={transactionDialogVisible}
                    />
                )}
            </div>
        </div>
    );
}

export default Warehouses;
