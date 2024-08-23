import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

export default function TransactionForm({ onSave = () => {} }) { // Default value for onSave
    const { user } = useAuthContext();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toast = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [fromObjects, setFromObjects] = useState([]);
    const [toObjects, setToObjects] = useState([]);

    const fromType = watch('from', 'warehouses');
    const toType = watch('to', 'warehouses');

    useEffect(() => {
        const fetchObjects = async (type, setObjects) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${type}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const objects = data[type] || [];
                    setObjects(objects);
                } else {
                    const errorText = await response.text();
                    toast.current.show({ severity: 'error', summary: 'Error', detail: errorText });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data' });
            } finally {
                setIsLoading(false);
            }
        };

        if (fromType) {
            fetchObjects(fromType, setFromObjects);
        }
        if (toType) {
            fetchObjects(toType, setToObjects);
        }
    }, [fromType, toType, user.token]);

    const updateUserField = async (type, id, userName) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${type}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ user: userName })
            });

            if (!response.ok) {
                const errorText = await response.text();
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorText });
                throw new Error(errorText);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user field' });
            throw error;
        }
    };

    const onSubmit = async (formData) => {
        console.log(formData);
        try {
            // Update user field for fromId and toId objects
            await updateUserField(fromType, formData.fromId, user.name);
            await updateUserField(toType, formData.toId, user.name);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Transaction completed' });
                onSave(result);
            } else {
                const errorText = await response.text();
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorText });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Transaction failed' });
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="from">From</label>
                    <select id="from" {...register('from', { required: true })}>
                        <option value="" disabled>Select From</option>
                        <option value="warehouses">Warehouses</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="workers">Workers</option>
                    </select>
                    {errors.from && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="fromId">From ID</label>
                    <select id="fromId" {...register('fromId', { required: true })} disabled={isLoading}>
                        <option value="" disabled>Select From ID</option>
                        {!isLoading ? fromObjects.map(obj => (
                            <option key={obj._id} value={obj._id}>{obj.name || obj.id}</option>
                        )) : <option>Loading...</option>}
                    </select>
                    {errors.fromId && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="to">To</label>
                    <select id="to" {...register('to', { required: true })}>
                        <option value="" disabled>Select To</option>
                        <option value="warehouses">Warehouses</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="workers">Workers</option>
                    </select>
                    {errors.to && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="toId">To ID</label>
                    <select id="toId" {...register('toId', { required: true })} disabled={isLoading}>
                        <option value="" disabled>Select To ID</option>
                        {!isLoading ? toObjects.map(obj => (
                            <option key={obj._id} value={obj._id}>{obj.name || obj.id}</option>
                        )) : <option>Loading...</option>}
                    </select>
                    {errors.toId && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="stock.reg">Stock (Regular)</label>
                    <input id="stock.reg" type="number" {...register('stock.reg', { required: false })} defaultValue={0} />
                </div>
                <div>
                    <label htmlFor="stock.blue">Stock (Blue)</label>
                    <input id="stock.blue" type="number" {...register('stock.blue', { required: false })} defaultValue={0} />
                </div>
                <div>
                    <label htmlFor="stock.red">Stock (Red)</label>
                    <input id="stock.red" type="number" {...register('stock.red', { required: false })} defaultValue={0} />
                </div>
                <div>
                    <label htmlFor="stock.yellow">Stock (Yellow)</label>
                    <input id="stock.yellow" type="number" {...register('stock.yellow', { required: false })} defaultValue={0} />
                </div>
                <div>
                    <label htmlFor="stock.white">Stock (White)</label>
                    <input id="stock.white" type="number" {...register('stock.white', { required: false })} defaultValue={0} />
                </div>
                <Button type="submit" label="Submit" disabled={isLoading} />
            </form>
            <Toast ref={toast} />
        </div>
    );
}