import { useState, useEffect } from "react";
import { api } from "../api";

const ContactForm = ({ contact, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+63",
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

  // -------------------------------------------------------
  // VALIDATION
  // -------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    // NAME VALIDATION (letters, spaces, hyphens, apostrophes only)
    const nameRegex = /^(?!.*['\-]{2})(?!.*\s{2})[A-Za-z][A-Za-z\s'\-]*[A-Za-z]$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name =
        "Name may only contain letters, spaces, hyphens, apostrophes, and must not include special characters.";
    }

    // EMAIL VALIDATION – Gmail only, lowercase gmail.com, no double dots
    const emailRegex =
      /^(?!.*\.\.)[A-Za-z][A-Za-z0-9._]*@gmail\.com$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email =
        "Email must be a valid Gmail address (lowercase @gmail.com, starts with a letter, no double dots).";
    }

    // PHONE VALIDATION – must be +63 + 10 digits
    if (!/^(\+63)[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone must be +63 followed by 10 digits (e.g. +639123456789).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------------------------------
  // HANDLE CHANGE WITH +63 LOCKED PHONE
  // -------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // SPECIAL PHONE HANDLING
    if (name === "phone") {
      let v = value;

      // Always force prefix +63
      if (!v.startsWith("+63")) {
        v = "+63" + v.replace(/\D/g, "");
      }

      // Only allow digits after +63
      let suffix = v.slice(3).replace(/\D/g, "");

      // Limit to 10 digits
      suffix = suffix.slice(0, 10);

      setFormData({
        ...formData,
        phone: "+63" + suffix,
      });

      return;
    }

    // NORMAL FIELDS
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // -------------------------------------------------------
  // PREVENT CURSOR FROM ENTERING +63
  // -------------------------------------------------------
  const handlePhoneCursor = (e) => {
    const cursorPos = e.target.selectionStart;
    if (cursorPos < 3) {
      e.target.setSelectionRange(3, 3);
    }
  };

  // -------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------
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
          {/* NAME INPUT */}
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name}</p>
          )}

          {/* EMAIL INPUT */}
          <input
            name="email"
            placeholder="Gmail Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}

          {/* PHONE INPUT */}
          <input
            name="phone"
            placeholder="+639123456789"
            value={formData.phone}
            onChange={handleChange}
            onClick={handlePhoneCursor}
            onKeyUp={handlePhoneCursor}
            className="w-full border px-3 py-2"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone}</p>
          )}
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

export default ContactForm;
