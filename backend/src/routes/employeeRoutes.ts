import { Router, Request, Response } from 'express';
import db from '../config/db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees');

    res.json(rows);
  } catch (err: any) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { firstname, surname, salutation, profile_color, fullname, salary, employeenumber, gender } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO employees (firstname, surname, salutation, profile_color, fullname, salary, employeenumber, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstname, surname, salutation, profile_color, fullname, salary, employeenumber, gender]
    );
    res.status(201).json({ id: (result as any).insertId });
  } catch (err: any) {
    console.log('here' + err)
    res.status(500).json({ error: err.message });
  }
});

export default router;
