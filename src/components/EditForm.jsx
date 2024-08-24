import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

export default function EditForm({ formType, data, onSave, onHide, visible }) {
  const { user } = useAuthContext();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [cities, setCities] = useState([]);
  const toast = useRef(null);

  const disableScroll = (e) => e.target.blur();

  useEffect(() => {
    fetch('/cities.json')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error fetching cities:', error));
  }, []);

  useEffect(() => {
    if (data) {
      if (formType === 'vehicles') {
        setValue("name", data.name);
      } else {
        setValue("name", data.name);
        setValue("city", data.city);
      }
      setValue("stock.reg", data.stock?.reg || 0);
      setValue("stock.sf", data.stock?.sf || 0);
      setValue("stock.blue", data.stock?.blue || 0);
      setValue("stock.red", data.stock?.red || 0);
      setValue("stock.yellow", data.stock?.yellow || 0);
      setValue("stock.white", data.stock?.white || 0);
      setValue("stock.peach", data.stock?.peach || 0);

    }
  }, [data, setValue, formType]);

  const onSubmit = async (formData) => {
    if (!user) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please log in', life: 3000 });
      return
    }
    try {

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${formType}/${data._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ ...formData, "user": user.name })

      });
      if (response.ok) {
        onSave();
        onHide();
        toast.current.show({ severity: 'success', summary: 'Success', detail: `${formType.charAt(0).toUpperCase() + formType.slice(1)} updated successfully`, life: 3000 });
      } else {
        console.error(`Failed to update ${formType}`);
        toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to update ${formType}`, life: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: `An error occurred while updating ${formType}`, life: 3000 });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog visible={visible} onHide={onHide} style={{ width: '70vw', maxWidth: '70vw'}} content={(
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', overflowY: 'auto', maxHeight: '80vh' }}>
          {formType === 'vehicles' ? (
            <div>
              <label>Plate</label>
              <input
                type="text"
                {...register("name", { required: "Plate is required" })}
              />
              {errors.plate && <p>{errors.plate.message}</p>}
            </div>
          ) : (
            <>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p>{errors.name.message}</p>}
              </div>
              <div>
                <label>City</label>
                <select {...register("city", { required: "City is required" })}>
                  {cities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
                {errors.city && <p>{errors.city.message}</p>}
              </div>
            </>
          )}

          <div>
            <label>Regular</label>
            <input
              type="number"
              {...register("stock.reg", { required: "Stock Reg is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.reg && <p>{errors.stock.reg.message}</p>}
          </div>
          <div>
            <label>SF</label>
            <input
              type="number"
              {...register("stock.sf", { required: "Stock SF is required" })}
              onWheel={disableScroll}
            />
          </div>
          <div>
            <label>Blue</label>
            <input
              type="number"
              {...register("stock.blue", { required: "Stock Blue is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.blue && <p>{errors.stock.blue.message}</p>}
          </div>

          <div>
            <label>Red</label>
            <input
              type="number"
              {...register("stock.red", { required: "Stock Red is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.red && <p>{errors.stock.red.message}</p>}
          </div>
          <div>
            <label>Yellow</label>
            <input
              type="number"
              {...register("stock.yellow", { required: "Stock Yellow is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.yellow && <p>{errors.stock.yellow.message}</p>}
          </div>
          <div>
            <label>White</label>
            <input
              type="number"
              {...register("stock.white", { required: "Stock White is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.white && <p>{errors.stock.white.message}</p>}
          </div>
          <div>
            <label>Peach</label>
            <input
              type="number"
              {...register("stock.peach", { required: "Stock Peach is required" })}
              onWheel={disableScroll}
            />
            {errors.stock && errors.stock.peach && <p>{errors.stock.peach.message}</p>}
          </div>

          <div className="form-actions">
            <Button type="submit" label="Save" className="p-button-success" />
            <Button type="button" label="Cancel" className="p-button-secondary" onClick={onHide} />
          </div>
        </form>
      )} />
    </>
  );
}
