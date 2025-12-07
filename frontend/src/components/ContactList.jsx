import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = ({ onEdit, onSuccess }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/contacts');
      setContacts(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await axios.delete(`/contacts/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
      onSuccess('Contact deleted successfully');
    } catch (error) {
      alert('Failed to delete contact');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-white text-white px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black">No contacts yet. Add your first contact!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-black">
        {contacts.map((contact) => (
          <li key={contact.id} className="px-6 py-4 hover:bg-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-black">{contact.name}</h3>
                        <div className="mt-1 text-sm text-black">
                      <p className="flex items-center">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {contact.email}
                      </p>
                      <p className="flex items-center mt-1">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                            {contact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(contact)}
                  className="px-3 py-1 text-sm font-medium text-black hover:text-black focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="px-3 py-1 text-sm font-medium text-black hover:text-black focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;