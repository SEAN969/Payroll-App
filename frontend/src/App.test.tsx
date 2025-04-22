import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EmployeeTable from './components/EmployeeTable';

describe('EmployeeTable - Salutation and Gender Logic', () => {
  test('Auto-selects gender as Male when salutation is Mr.', () => {
    render(<EmployeeTable />);

    // Click "Add New" to open form
    fireEvent.click(screen.getByText('Add New'));

    // Select "Mr." in the salutation dropdown
    fireEvent.change(screen.getByLabelText(/Salutation/i), {
      target: { value: 'Mr.' },
    });

    // Expect "Male" radio button to be checked
    const maleRadio = screen.getByLabelText('Male') as HTMLInputElement;
    expect(maleRadio.checked).toBe(true);
  });

  test('Auto-selects gender as Female when salutation is Ms. or Mrs.', () => {
    render(<EmployeeTable />);
    fireEvent.click(screen.getByText('Add New'));

    // Ms.
    fireEvent.change(screen.getByLabelText(/Salutation/i), {
      target: { value: 'Ms.' },
    });
    expect((screen.getByLabelText('Female') as HTMLInputElement).checked).toBe(true);

    // Mrs.
    fireEvent.change(screen.getByLabelText(/Salutation/i), {
      target: { value: 'Mrs.' },
    });
    expect((screen.getByLabelText('Female') as HTMLInputElement).checked).toBe(true);
  });

  test('Auto-selects gender as Unspecified for other salutations', () => {
    render(<EmployeeTable />);
    fireEvent.click(screen.getByText('Add New'));

    fireEvent.change(screen.getByLabelText(/Salutation/i), {
      target: { value: 'Mx.' },
    });

    expect((screen.getByLabelText('Unspecified') as HTMLInputElement).checked).toBe(true);
  });
});
