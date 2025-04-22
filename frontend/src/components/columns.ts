import { ColumnDef } from '@tanstack/react-table';

export type Employee = {
  id: number;
  firstname: string;
  surname: string;
  salutation: string;
  profile_color: string;
};

export const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'surname', header: 'Surname' },
  { accessorKey: 'salutation', header: 'Salutation' },
  { accessorKey: 'profile_color', header: 'Profile Color' },
];
