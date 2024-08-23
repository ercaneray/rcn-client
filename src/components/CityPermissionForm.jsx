import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

const CityPermissionForm = ({ onAdd }) => {
    const [city, setCity] = useState('');
    const [canView, setCanView] = useState(false);
    const [canUpdate, setCanUpdate] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city) {
            onAdd({ city, canView, canUpdate });
            setCity('');
            setCanView(false);
            setCanUpdate(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-field">
                <label htmlFor="city">City</label>
                <input 
                    type="text" 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                />
            </div>
            <div className="p-field-checkbox">
                <Checkbox 
                    inputId="canView" 
                    checked={canView} 
                    onChange={(e) => setCanView(e.checked)} 
                />
                <label htmlFor="canView">Can View</label>
            </div>
            <div className="p-field-checkbox">
                <Checkbox 
                    inputId="canUpdate" 
                    checked={canUpdate} 
                    onChange={(e) => setCanUpdate(e.checked)} 
                />
                <label htmlFor="canUpdate">Can Update</label>
            </div>
            <Button type="submit" label="Add City" />
        </form>
    );
};

export default CityPermissionForm;
