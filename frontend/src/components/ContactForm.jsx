import { useState, useEffect } from "react";
import { api } from "../api";

const ContactForm = ({ contact, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (contact) {
        await api(`/contacts/${contact.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        onSuccess("Contact updated successfully");
      } else {
        await api("/contacts", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        onSuccess("Contact created successfully");
      }

      onClose();
    } catch (error) {
      setErrors({ general: error.message || "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-black mb-4">
        {contact ? "Edit Contact" : "Add New Contact"}
      </h3>

      {errors.general && (
        <div className="mb-4 bg-black text-white px-4 py-2 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border px-3 py-2"
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border px-3 py-2"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border px-3 py-2"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-black text-white">
            {loading ? "Saving..." : contact ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

expo
