const { query } = require('../config/db');

const getAllContacts = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, created_at 
       FROM contacts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT id, name, email, phone, created_at 
       FROM contacts 
       WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const result = await query(
      `INSERT INTO contacts (user_id, name, email, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, phone, created_at`,
      [req.userId, name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create contact error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Contact with this email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const result = await query(
      `UPDATE contacts 
       SET name = $1, email = $2, phone = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING id, name, email, phone, created_at`,
      [name, email, phone, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact error:', error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Contact with this email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};