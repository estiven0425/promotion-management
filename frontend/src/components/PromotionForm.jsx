import { useState } from 'react';

export const PromotionForm = ({ onPromotionCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    targetType: 'PRODUCT',
    targetValue: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('La fecha de finalización debe ser estrictamente posterior a la fecha de inicio.');
      return;
    }

    if (formData.discountType === 'PERCENTAGE') {
      const val = Number(formData.discountValue);
      if (val < 1 || val > 100) {
        setError('El descuento porcentual debe estar entre 1 y 100.');
        return;
      }
    }

    try {
      setLoading(true);
      await onPromotionCreated(formData);

      setFormData({
        name: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        startDate: '',
        endDate: '',
        targetType: 'PRODUCT',
        targetValue: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la promoción.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    boxSizing: 'border-box',
  };

  const fieldGroupStyle = {
    flex: '1 1 calc(50% - 0.5rem)',
    minWidth: '250px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Crear Nueva Promoción</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 100%' }}>
          <label style={{ display: 'block', fontWeight: '500' }}>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Tipo de Descuento:</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="PERCENTAGE">Porcentaje (%)</option>
            <option value="FIXED_AMOUNT">Monto Fijo ($)</option>
          </select>
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Valor del Descuento:</label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Fecha de inicio:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Fecha de finalización:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Tipo de objetivo:</label>
          <select
            name="targetType"
            value={formData.targetType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="PRODUCT">Producto</option>
            <option value="CATEGORY">Categoría</option>
          </select>
        </div>
        <div style={fieldGroupStyle}>
          <label style={{ display: 'block', fontWeight: '500' }}>Valor del Objetivo:</label>
          <input
            type="text"
            name="targetValue"
            placeholder={formData.targetType === 'PRODUCT' ? 'ej. Zapatos de deporte' : 'ej. Aseo'}
            value={formData.targetValue}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0d6efd',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Creando...' : 'Crear Promoción'}
      </button>
    </form>
  );
};