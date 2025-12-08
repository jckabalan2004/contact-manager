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
