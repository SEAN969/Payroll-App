import { ColumnDef } from '@tanstack/react-table';

export type Employee = {
  employeenumber: string;
  firstname: string;
  surname: string;
  salutation: string;
  profile_color: string;
};

export const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'employeenumber', header: 'Employee #' },
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'surname', header: 'Surname' },
  { accessorKey: 'salutation', header: 'Salutation' },
  { accessorKey: 'profile_color', header: 'Profile Color' },
];
