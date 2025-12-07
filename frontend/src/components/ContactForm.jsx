import { useState, useEffect } from 'react';
import axios from 'axios';

const ContactForm = ({ contact, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (contact) {
        // Update existing contact
        await axios.put(`/contacts/${contact.id}`, formData);
        onSuccess('Contact updated successfully');
      } else {
        // Create new contact
        await axios.post('/contacts', formData);
        onSuccess('Contact created successfully');
      }
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Operation failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-black">
          {contact ? 'Edit Contact' : 'Add New Contact'}
        </h3>
        <button
          onClick={onClose}
          className="text-black hover:text-black focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {errors.general && (
          <div className="mb-4 bg-black border border-white text-white px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                  errors.name ? 'border-black' : 'border-black'
                }`}
            />
            {errors.name && (
                <p className="mt-1 text-sm text-black">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                  errors.email ? 'border-black' : 'border-black'
                }`}
            />
            {errors.email && (
                <p className="mt-1 text-sm text-black">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-black">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                  errors.phone ? 'border-black' : 'border-black'
                }`}
            />
            {errors.phone && (
                <p className="mt-1 text-sm text-black">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-white text-black border border-black rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white border border-black rounded-md hover:bg-white hover:text-black focus:outline-none"
            >
              {loading ? 'Saving...' : contact ? 'Update' : 'Create'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;