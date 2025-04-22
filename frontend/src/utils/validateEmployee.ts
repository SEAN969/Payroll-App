import { Employee } from "../types";

export const validateEmployee = (employee: Employee) => {
  const errors: { [key: string]: string } = {};

  if (!employee.firstname?.trim()) errors.firstname = "First Name is required.";
  if (!employee.surname?.trim()) errors.surname = "Surname is required.";
  if (!employee.salutation?.trim()) errors.salutation = "Salutation is required.";
  if (!employee.gender) errors.gender = "Gender is required.";
  if (!employee.employeenumber?.trim()) errors.employeenumber = "Employee Number is required.";
  if (!employee.profile_color) errors.profile_color = "Profile Color is required.";
  if (!employee.fullname?.trim()) errors.fullname = "Full Name is required.";

  // Salary validation
  if (!employee.salary) {
    errors.salary = "Salary is required";
  } else {
    // Remove spaces before checking if it's a valid number
    const numericSalary = Number(employee.salary.replace(/\s/g, ''));
    if (isNaN(numericSalary)) {
      errors.salary = "Salary must be a valid number.";
    }
  }
  
  return errors;
};