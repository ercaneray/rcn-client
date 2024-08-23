import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

export default function TransactionForm({ selectedData, onSave = () => { }, onHide, visible }) {
    const { user } = useAuthContext();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toast = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [toObjects, setToObjects] = useState([]);

    const toType = watch('to', 'warehouses');

    const disableScroll = (e) => e.target.blur();

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

        if (toType) {
            fetchObjects(toType, setToObjects);
        }
    }, [toType, user.token]);

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
        let type = selectedData.type;
        let id = selectedData._id;
        console.log('formdata', formData);
        console.log('selectedData:', selectedData);
        console.log('type:', type);
        console.log('id:', id);
        try {
            // Update user field for toId object
            await updateUserField(toType, formData.toId, user.name);
            let newData = { ...formData, 'from': type, 'fromId': id }
            console.log('newData:', newData);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newData)
            });

            if (response.ok) {
                const result = await response.json();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Transaction completed' });
                onSave(result);
                onHide(); // Hide the dialog after saving
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
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={onHide} style={{ width: '70vw', maxWidth: '70vw' }} content={(
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', overflowY: 'auto', maxHeight: '80vh' }} >
                    <div>
                        <label htmlFor="to" >To</label>
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
                        <label htmlFor="stock.reg">Regular</label>
                        <input id="stock.reg" type="number" {...register('stock.reg', { required: false })} defaultValue={0} onWheel={disableScroll} />
                    </div>
                    <div>
                        <label htmlFor="stock.sf">SF</label>
                        <input id="stock.sf" type="number" {...register('stock.sf', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        <div>
                            <label htmlFor="stock.blue">Blue</label>
                            <input id="stock.blue" type="number" {...register('stock.blue', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        </div>
                        <div>
                            <label htmlFor="stock.red">Red</label>
                            <input id="stock.red" type="number" {...register('stock.red', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        </div>
                        <div>
                            <label htmlFor="stock.yellow">Yellow</label>
                            <input id="stock.yellow" type="number" {...register('stock.yellow', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        </div>
                        <div>
                            <label htmlFor="stock.white">White</label>
                            <input id="stock.white" type="number" {...register('stock.white', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        </div>
                        <div>
                            <label htmlFor="stock.peach">Peach</label>
                            <input id="stock.peach" type="number" {...register('stock.peach', { required: false })} defaultValue={0} onWheel={disableScroll} />
                        </div>
                    </div>
                    <div className="form-actions">
                        <Button type="submit" label="Save" className="p-button-success" disabled={isLoading} />
                        <Button type="button" label="Cancel" className="p-button-secondary" onClick={onHide} />
                    </div>

                </form>
            )} />
        </>
    );
}