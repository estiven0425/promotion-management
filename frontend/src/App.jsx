import { useState, useEffect, useCallback } from 'react';
import { getPromotions, getSummary, createPromotion, updateStatus, deletePromotion } from './services/api';
import { SummaryCards } from './components/SummaryCards';
import { PromotionForm } from './components/PromotionForm';
import { PromotionList } from './components/PromotionList';

function App() {
  const [promotions, setPromotions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadData = useCallback(async () => {
    try {
      const [promosRes, summaryRes] = await Promise.all([
        getPromotions(),
        getSummary(),
      ]);
      setPromotions(promosRes.data);
      setSummary(summaryRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los datos del panel de control.');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [promosRes, summaryRes] = await Promise.all([
          getPromotions(),
          getSummary(),
        ]);
        if (isMounted) {
          setPromotions(promosRes.data);
          setSummary(summaryRes.data);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Error al cargar los datos del panel de control.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePromotion = async (formData) => {
    await createPromotion(formData);
    await reloadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      await reloadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar el estado.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) return;
    try {
      await deletePromotion(id);
      await reloadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar la promoción.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#1a1a1a' }}>Panel de control de gestión de promociones</h1>
        <p style={{ color: '#666' }}>Gestiona y supervisa las campañas promocionales de tu negocio.</p>
      </header>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Cargando aplicación...</p>
      ) : (
        <>
          <SummaryCards summary={summary} />
          <PromotionForm onPromotionCreated={handleCreatePromotion} />
          <PromotionList
            promotions={promotions}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}

export default App;