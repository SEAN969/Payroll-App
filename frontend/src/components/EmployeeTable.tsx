import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, RowClickedEvent } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import axios from 'axios';

import { validateEmployee } from '../utils/validateEmployee';
import { Employee } from '../types';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const defaultEmployee: Employee = {
    id: 0,
  firstname: '',
  surname: '',
  salutation: '',
  profile_color: '',
  gender: '',
  fullname: '',
  employeenumber: '',
  salary: '',
};

const EmployeeTable = () => {
  const [rowData, setRowData] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const columnDefs = [
    { headerName: 'Employee #', field: 'employeenumber' },
    { headerName: 'First Name', field: 'firstname' },
    { headerName: 'Surname', field: 'surname' },
    { headerName: 'Salutation', field: 'salutation' },
    { headerName: 'Profile Color', field: 'profile_color' },
  ];

    const refetchEmployees = () => {
        axios
            .get('http://localhost:5000/api/employees')
            .then((res) => {
                const formattedEmployees = res.data.map((emp: any) => ({
                    id: emp.id,
                    ...emp,
                    salary: emp.salary !== null && emp.salary !== undefined ? formatSalary(emp.salary.toString()) : ''
                }));
                setRowData(formattedEmployees);
            })
            .catch((err) => console.error(err));
    };

  useEffect(() => {
    refetchEmployees();
  }, []);

  const handleRowClick = (event: RowClickedEvent) => {
    if (event.data) {
      const employee = {
        ...event.data,
        salary: event.data.salary !== null && event.data.salary !== undefined 
          ? formatSalary(event.data.salary.toString()) 
          : ''
      };
      setSelectedEmployee(employee);
      setIsEditing(true);
      setFormErrors({});
    }
  };

  const handleAddNew = () => {
    setSelectedEmployee({...defaultEmployee});
    setIsEditing(true);
    setFormErrors({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedEmployee) return;
    const { name, value } = e.target;

    const updatedEmployee = {
      ...selectedEmployee,
      [name]: value,
    };

    if (name === 'firstname' || name === 'surname') {
      const firstName = name === 'firstname' ? value : selectedEmployee.firstname || '';
      const lastName = name === 'surname' ? value : selectedEmployee.surname || '';
      updatedEmployee.fullname = `${firstName} ${lastName}`.trim();
    }

    if (name === 'salutation') {
      switch (value) {
        case 'Mr.':
          updatedEmployee.gender = 'Male';
          break;
        case 'Ms.':
        case 'Mrs.':
          updatedEmployee.gender = 'Female';
          break;
        default:
          updatedEmployee.gender = 'Unspecified';
          break;
      }
    }
   

    setSelectedEmployee(updatedEmployee);
  };

 const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEmployee) return;

  const errors = validateEmployee(selectedEmployee);
  setFormErrors(errors);

  if (Object.keys(errors).length > 0) return;

  const updatedFullName = `${selectedEmployee.firstname} ${selectedEmployee.surname}`.trim();

  const capitalizedColor =
    selectedEmployee.profile_color.charAt(0).toUpperCase() +
    selectedEmployee.profile_color.slice(1).toLowerCase();

  const employeeForApi = {
    ...selectedEmployee,
    fullname: updatedFullName,
    profile_color: capitalizedColor,
    salary: selectedEmployee.salary
      ? Number(selectedEmployee.salary.replace(/\s/g, ''))
      : 0,
  };

  const request = selectedEmployee.id
    ? axios.put(`http://localhost:5000/api/employees/${selectedEmployee.id}`, employeeForApi)
    : axios.post(`http://localhost:5000/api/employees`, employeeForApi);
     console.log(selectedEmployee.id)

  request
    .then(() => {
      setIsEditing(false);
      setSelectedEmployee(null);
      refetchEmployees();
    })
    .catch((error) => {
      console.error('Error saving employee:', error);
      alert(`Error saving employee: ${error.response?.data?.error || error.message}`);
    });
};


  const formatSalary = (value: string) => {
    if (!value) return '';
    const cleaned = value.replace(/[^\d]/g, '');
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getColorClass = (color?: string) => {
    if (!color) return 'btn-secondary';
    
    switch (color.toLowerCase()) {
      case 'green':
        return 'btn-success';
      case 'red':
        return 'btn-danger';
      case 'blue':
        return 'btn-primary';
      default:
        return 'btn-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Current Employees</h2>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleAddNew}>
          Add New
        </button>
      </div>

      <div className="ag-theme-material mb-5" style={{ height: 300 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowModelType="clientSide"
          onRowClicked={handleRowClick}
        />
      </div>

      {isEditing && selectedEmployee && (
        <form onSubmit={handleFormSubmit}>
          <h4 className="mb-4">{selectedEmployee.id ? 'Employee Information' : 'Add New Employee'}</h4>
          <div className="container">

  <div className="row">
    {/* LEFT COLUMN */}
    <div className="col-md-6">
      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">First Name(s) *</label>
        <div className="col-sm-8">
          <input
            type="text"
            name="firstname"
            className={`form-control ${formErrors.firstname ? 'is-invalid' : ''}`}
            value={selectedEmployee.firstname || ''}
            onChange={handleFormChange}
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Last Name *</label>
        <div className="col-sm-8">
          <input
            type="text"
            name="surname"
            className={`form-control ${formErrors.surname ? 'is-invalid' : ''}`}
            value={selectedEmployee.surname || ''}
            onChange={handleFormChange}
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Salutation *</label>
        <div className="col-sm-8">
          <select
            name="salutation"
            className={`form-select ${formErrors.salutation ? 'is-invalid' : ''}`}
            value={selectedEmployee.salutation || ''}
            onChange={handleFormChange}
          >
            <option value="">Select</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Dr.">Dr.</option>
            <option value="Mx.">Mx.</option>
          </select>
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Gender *</label>
        <div className="col-sm-8 d-flex gap-3 align-items-center">
          {['Male', 'Female', 'Unspecified'].map((genderOption) => (
            <div className="form-check form-check-inline" key={genderOption}>
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id={`gender-${genderOption}`}
                value={genderOption}
                checked={selectedEmployee.gender === genderOption}
                onChange={handleFormChange}
              />
              <label className="form-check-label" htmlFor={`gender-${genderOption}`}>
                {genderOption}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Employee # *</label>
        <div className="col-sm-8 d-flex align-items-center">
          <input
            type="text"
            name="employeenumber"
            pattern="\d*"
            inputMode="numeric"
            className={`form-control ${formErrors.employeenumber ? 'is-invalid' : ''}`}
            value={selectedEmployee.employeenumber || ''}
            onChange={handleFormChange}
          />
          <span className="ms-2 text-warning fw-bold small"></span>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="col-md-6">
      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Full Name</label>
        <div className="col-sm-8">
          <input
            type="text"
            name="fullname"
            className={`form-control ${formErrors.fullname ? 'is-invalid' : ''}`}
            value={selectedEmployee.fullname || ''}
            disabled
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Gross Salary $PY</label>
        <div className="col-sm-8">
          <input
            type="text"
            name="salary"
            className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
            value={selectedEmployee.salary || ''}
            onChange={(e) =>
              setSelectedEmployee({
                ...selectedEmployee,
                salary: formatSalary(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="mb-3 row">
        <label className="col-sm-4 col-form-label">Employee Profile Colour</label>
        <div className="col-sm-8 d-flex gap-3">
          {['Green', 'Blue', 'Red', 'Default'].map((color) => (
            <div className="form-check form-check-inline" key={color}>
              <input
                className="form-check-input"
                type="radio"
                id={`color-${color}`}
                name="profile_color"
                value={color.toLowerCase()}
                checked={selectedEmployee.profile_color === color.toLowerCase()}
                onChange={handleFormChange}
              />
              <label className="form-check-label" htmlFor={`color-${color}`}>
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

          <div className="row">
            <div className="offset-sm-2 col-sm-10 d-flex gap-2">
              <button
                type="submit"
                className={`btn ${getColorClass(selectedEmployee.profile_color)}`}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
          </div>
          </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeTable;