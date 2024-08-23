import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom'
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

export default function AddForm({ formType }) {
    const { user } = useAuthContext();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [cities, setCities] = useState([]);
    const toast = useRef(null);
    
    const navigate = useNavigate();

    const handleNavigation = () => {
        setTimeout(() => {
            navigate('/' + formType);
        }, 1000);
    };

    useEffect(() => {
        const fetchCities = async () => {
            const response = await fetch('/cities.json');
            const data = await response.json();
            setCities(data);
        };
        fetchCities();
    }, []);

    const onSubmit = async (data) => {
        if (!user) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please log in', life: 3000 });
            return
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${formType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ...data, "user": user.name, "type": formType })
            });
            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: `${formType.charAt(0).toUpperCase() + formType.slice(1)} added successfully`, life: 3000 });
                handleNavigation();
                
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to add ${formType}`, life: 3000 });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)}>
                {formType === 'workers' && (
                    <>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p>{errors.name.message}</p>}
                        </div>

                        <div>
                            <label>City</label>
                            <select {...register("city", { required: "City is required" })}>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.city && <p>{errors.city.message}</p>}
                        </div>
                    </>
                )}

                {formType === 'vehicles' && (
                    <>
                        <div>
                            <label>Plate</label>
                            <input
                                type="text"
                                placeholder="Plate"
                                {...register("name", { required: "Plate is required" })}
                            />
                            {errors.plate && <p>{errors.plate.message}</p>}
                        </div>
                    </>
                )}

                {formType === 'warehouses' && (
                    <>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p>{errors.name.message}</p>}
                        </div>

                        <div>
                            <label>City</label>
                            <select {...register("city", { required: "City is required" })}>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.city && <p>{errors.city.message}</p>}
                        </div>
                    </>
                )}

                <input type="submit" />
            </form>
        </>
    );
}
