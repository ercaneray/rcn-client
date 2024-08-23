import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import '../index.css';

const ProfilePage = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [profileData, setProfileData] = useState(null);
    const [cityPermissions, setCityPermissions] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [canView, setCanView] = useState(false);
    const [canUpdate, setCanUpdate] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfileData(data.user);
                    setCityPermissions(data.user.cityPermissions);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            }
        };

        if (id && user) {
            fetchProfile();
        }
    }, [id, user]);

    useEffect(() => {
        fetch('/cities.json')
            .then(response => response.json())
            .then(data => setCities(data))
            .catch(error => console.error('Error fetching cities:', error));
    }, []);

    const handleAddCityPermission = async () => {
        const newPermission = { city: selectedCity, canView, canUpdate };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}/addCityPermission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newPermission)
            });

            if (response.ok) {
                const updatedPermissions = [...cityPermissions, newPermission].filter(permission => permission.canView || permission.canUpdate);
                setCityPermissions(updatedPermissions);
                setSelectedCity('');
                setCanView(false);
                setCanUpdate(false);
            } else {
                console.error("Failed to add city permission");
            }
        } catch (error) {
            console.error("An error occurred while adding city permission", error);
        }
    };

    const handleDeleteCityPermission = async (city) => {
        const updatePermission = { city, canView: false, canUpdate: false };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}/addCityPermission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updatePermission)
            });

            if (response.ok) {
                const updatedPermissions = cityPermissions.map(permission =>
                    permission.city === city ? { ...permission, canView: false, canUpdate: false } : permission
                ).filter(permission => permission.canView || permission.canUpdate);
                setCityPermissions(updatedPermissions);
            } else {
                console.error("Failed to delete city permission");
            }
        } catch (error) {
            console.error("An error occurred while deleting city permission", error);
        }
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    const existingCities = cityPermissions.filter(permission => permission.canView || permission.canUpdate).map(permission => permission.city);
    const availableCities = cities.filter(city => !existingCities.includes(city.name));
    const cityOptions = availableCities.map(city => ({ label: city.name, value: city.name }));

    const filteredCityPermissions = cityPermissions.filter(permission => permission.canView || permission.canUpdate);

    const booleanIconTemplate = (rowData, field) => {
        return rowData[field] ? <i className="pi pi-check" style={{ color: 'green' }}></i> : <i className="pi pi-times" style={{ color: 'red' }}></i>;
    };

    const actionTemplate = (rowData) => {
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDeleteCityPermission(rowData.city)} />
        );
    };

    return (
        <div className="profile-page">
            <h1>{profileData.name}'s Profile</h1>
                <div className="city-permission-form">
                    <h2>Add City Permission</h2>
                    <div className="p-field">
                        <label htmlFor="city">City</label>
                        <Dropdown
                            id="city"
                            value={selectedCity}
                            options={cityOptions}
                            onChange={(e) => setSelectedCity(e.value)}
                            placeholder="Select a City"
                            className="custom-dropdown"
                        />
                    </div>
                    <div className="p-field-checkbox">
                        <Checkbox inputId="canView" checked={canView} onChange={(e) => setCanView(e.checked)} />
                        <label htmlFor="canView">Can View</label>
                    </div>
                    <div className="p-field-checkbox">
                        <Checkbox inputId="canUpdate" checked={canUpdate} onChange={(e) => setCanUpdate(e.checked)} />
                        <label htmlFor="canUpdate">Can Update</label>
                    </div>
                    <Button label="Add City Permission" onClick={handleAddCityPermission} className="custom-button" />
                </div>

            <div className="city-permissions-table">
                <h2>City Permissions</h2>
                <DataTable value={filteredCityPermissions} stripedRows>
                    <Column field="city" headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }} header="City"></Column>
                    <Column field="canView" body={(rowData) => booleanIconTemplate(rowData, 'canView')} headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }} header="Can View"></Column>
                    <Column field="canUpdate" body={(rowData) => booleanIconTemplate(rowData, 'canUpdate')} headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }} header="Can Update"></Column>
                    <Column body={actionTemplate} headerStyle={{ textAlign: 'left' }} bodyStyle={{ textAlign: 'left' }} header="Actions"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default ProfilePage;
