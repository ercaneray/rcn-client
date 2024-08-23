import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ChangeDescription from '../components/ChangeDescription';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { FilterMatchMode } from 'primereact/api';
import { useAuthContext } from '../hooks/useAuthContext';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import '../index.css';

const ChangeHistoryPage = () => {
    const { user } = useAuthContext();
    const [changes, setChanges] = useState([]);
    const [detailsDialogVisible, setDetailsDialogVisible] = useState(false);
    const [selectedChange, setSelectedChange] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const [filters, setFilters] = useState({
        user: { value: null, matchMode: FilterMatchMode.CONTAINS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setFilterValue(value);
    };

    useEffect(() => {
        const fetchChanges = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logChange`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setChanges(data);
                } else {
                    console.error("Data is not an array", data);
                }
            } catch (error) {
                console.error("Failed to fetch changes", error);
            }
        };

        fetchChanges();
    }, [user]);

    const descriptionTemplate = (rowData) => {
        const { action } = rowData;
        const changeDetails = action === 'update' ? rowData.fullDocument : rowData;
        const preImageDetails = action === 'update' ? rowData.preImage : null;

        return (
            <ChangeDescription
                action={action}
                changeDetails={changeDetails}
                preImageDetails={preImageDetails}
                userName={rowData.user}
            />
        );
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.timestamp).toLocaleString();
    };

    const userTemplate = (rowData) => {
        return rowData.action === 'update' ? rowData.fullDocument.user : rowData.user;
    };

    const detailsTemplate = (rowData) => {
        if (rowData.action === 'update') {
            return (
                <Button
                    label="Details"
                    icon="pi pi-info-circle"
                    onClick={() => {
                        setSelectedChange(rowData);
                        setDetailsDialogVisible(true);
                    }}
                    className="custom-details-button-1"
                />
            );
        }
        return null;
    };

    const renderDetailsDialog = () => {
        if (!selectedChange) return null;

        const { preImage, fullDocument } = selectedChange;

        const compareStocks = (preStock, postStock) => {
            return Object.keys(preStock).map((key) => {
                const changed = preStock[key] !== postStock[key];
                return (
                    <tr key={key} className={changed ? "highlight" : ""}>
                        <td>{key}</td>
                        <td>{preStock[key]}</td>
                        <td>{postStock[key]}</td>
                    </tr>
                );
            });
        };

        return (
            <Dialog header="Change Details" visible={detailsDialogVisible} style={{ width: '50vw' }} onHide={() => setDetailsDialogVisible(false)} className="change-details-dialog">
                <h3>Stocks Changed:</h3>
                <table className="change-details-table">
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Before</th>
                            <th>After</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compareStocks(preImage.stock, fullDocument.stock)}
                    </tbody>
                </table>
            </Dialog>
        );
    };
    console.log(changes);

    return (
        <div className="change-history-page">
            <h1 className="change-history-title">Change History</h1>
            <div className="iconfield-changes">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Name" value={filterValue} onChange={onFilterChange}/>
                </IconField>
            </div>
            <DataTable value={changes} paginator rows={10} className="p-datatable-gridlines change-history-table" sortField='timestamp' sortOrder={-1} filters={filters} globalFilterFields={['user']} >
                <Column field="user" header="User" body={userTemplate} />
                <Column field="description" header="Description" body={descriptionTemplate} />
                <Column field="timestamp" header="Date" body={dateTemplate} sortable />
                <Column header="Details" body={detailsTemplate}/>
            </DataTable>
            {renderDetailsDialog()}
        </div>
    );
};

export default ChangeHistoryPage;
