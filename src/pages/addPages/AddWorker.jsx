import React from 'react';
import AddForm from '../../components/AddForm';
import '../../index.css';

function AddWorker() {
  return (
    <div className="page">
      <h1 className="page-title">Add New Worker</h1>
      <AddForm formType="workers" />
    </div>
  );
}

export default AddWorker;
