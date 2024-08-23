import React from 'react'
import AddForm from '../../components/AddForm'

function AddVehicle() {
  return (
    <>
      <div className="page">
      <h1 className="page-title">Add New Vehicle</h1>
      <AddForm formType="vehicles" />
    </div>
    </>
    
  )
}

export default AddVehicle