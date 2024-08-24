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
import TransactionForm from '../components/TransactionForm'; // Import the TransactionForm component
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

function Workers() {
    const { user } = useAuthContext();
    const [data, setData] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [transactionDialogVisible, setTransactionDialogVisible] = useState(false);
    const [selectedWorkerForTransaction, setSelectedWorkerForTransaction] = useState(null);
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

    const fetchWorkers = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const workers = await response.json();
        if (response.ok) {
            setData(workers.workers);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWorkers();
        }
    }, [user]);

    const deleteWorker = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                method: 'DELETE'
            });
            if (response.ok) {
                setData(data.filter((worker) => worker._id !== id));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Worker deleted', life: 3000 });
            } else {
                console.error('Failed to delete worker');
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete worker', life: 3000 });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while deleting worker', life: 3000 });
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this worker?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteWorker(id)
        });
    };

    const handleSave = () => {
        fetchWorkers();
        setSelectedWorker(null);
        setEditDialogVisible(false);
    };

    const handleCancel = () => {
        setSelectedWorker(null);
        setEditDialogVisible(false);
    };

    const handleTransactionSave = () => {
        fetchWorkers();
        setSelectedWorkerForTransaction(null);
        setTransactionDialogVisible(false);
    };

    const handleTransactionCancel = () => {
        setSelectedWorkerForTransaction(null);
        setTransactionDialogVisible(false);
    };

    const actionBodyTemplate = (rowData) => {
        const userCityPermissions = user.cityPermissions.find(permission => permission.city === rowData.city);
        const canUpdate = userCityPermissions ? userCityPermissions.canUpdate : false;
        const canDelete = user.role === 'admin';

        return (
            <div className="custom-action-buttons">
                {(canUpdate || user.role === 'admin') && (
                    <Button icon="pi pi-pencil" className="p-button-success custom-action-button-success" onClick={() => { setSelectedWorker(rowData); setEditDialogVisible(true); }} />
                )}
                {(canUpdate || user.role === 'admin') && (
                    <Button icon="pi pi-arrow-right-arrow-left" className="p-button-info custom-action-button-info" onClick={() => { setSelectedWorkerForTransaction(rowData); setTransactionDialogVisible(true); }} />
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
                    <InputText placeholder="Name" value={filterValue} onChange={onFilterChange} />
                </IconField>
            </div>
            <div className="workers-page">
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
                {selectedWorker && (
                    <EditForm
                        formType="workers"
                        data={selectedWorker}
                        onSave={handleSave}
                        onHide={handleCancel}
                        visible={editDialogVisible}
                    />
                )}
                {selectedWorkerForTransaction && (
                    <TransactionForm
                        selectedData={selectedWorkerForTransaction}
                        onSave={handleTransactionSave}
                        onHide={handleTransactionCancel}
                        visible={transactionDialogVisible}
                    />
                )}
            </div>
        </div>

    );
}

export default Workers;