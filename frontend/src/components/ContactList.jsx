import { useState, useEffect } from "react";
import { api } from "../api";

const ContactList = ({ onEdit, onSuccess }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await api("/contacts");
      setContacts(data);
      setError("");
    } catch (error) {
      setError("Failed to load contacts");
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await api(`/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      onSuccess("Contact deleted successfully");
    } catch (error) {
      alert("Failed to delete contact");
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
                <h3 className="text-lg font-medium text-black">{contact.name}</h3>
                <p className="text-sm text-black">{contact.email}</p>
                <p className="text-sm text-black">{contact.phone}</p>
              </div>

              <div className="flex space-x-2">
                <button onClick={() => onEdit(contact)} className="px-3 py-1 text-sm text-black">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="px-3 py-1 text-sm text-black"
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
