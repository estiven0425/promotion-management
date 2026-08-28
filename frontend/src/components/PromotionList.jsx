import { useState } from 'react';

export const PromotionList = ({ promotions, onStatusChange, onDelete }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredPromotions = promotions.filter((promo) => {
    if (filter === 'ALL') return true;

    return promo.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      SCHEDULED: { backgroundColor: '#e2e3e5', color: '#383d41' },
      ACTIVE: { backgroundColor: '#d4edda', color: '#155724' },
      FINISHED: { backgroundColor: '#f8d7da', color: '#721c24' },
    };
    const style = styles[status] || styles.SCHEDULED;

    return (
      <span
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          ...style,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Lista de promociones</h2>
        <div>
          <label style={{ marginRight: '0.5rem' }}>Filtrar por estado:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.4rem' }}>
            <option value="ALL">Todas</option>
            <option value="SCHEDULED">Programada</option>
            <option value="ACTIVE">Activa</option>
            <option value="FINISHED">Finalizada</option>
          </select>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '0.75rem' }}>Nombre</th>
            <th style={{ padding: '0.75rem' }}>Descuento</th>
            <th style={{ padding: '0.75rem' }}>Objetivo</th>
            <th style={{ padding: '0.75rem' }}>Fechas</th>
            <th style={{ padding: '0.75rem' }}>Estado</th>
            <th style={{ padding: '0.75rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPromotions.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: '#6c757d' }}>
                No se encontraron promociones.
              </td>
            </tr>
          ) : (
            filteredPromotions.map((promo) => {
              const target = promo.targets?.[0];
              const isScheduled = promo.status === 'SCHEDULED';
              const isActive = promo.status === 'ACTIVE';

              return (
                <tr key={promo.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{promo.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {promo.discountValue}
                    {promo.discountType === 'PERCENTAGE' ? '%' : ' $'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {target ? `${target.targetType}: ${target.targetValue}` : 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      <strong>Inicio:</strong> {new Date(promo.startDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Fin:</strong> {new Date(promo.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(promo.status)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {isScheduled && (
                        <button
                          onClick={() => onStatusChange(promo.id, 'ACTIVE')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Activar
                        </button>
                      )}

                      {isActive && (
                        <button
                          onClick={() => onStatusChange(promo.id, 'FINISHED')}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Finalizar
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(promo.id)}
                        disabled={!isScheduled}
                        title={!isScheduled ? 'Solo las promociones PROGRAMADAS pueden ser eliminadas' : 'Eliminar promoción'}
                        style={{
                          padding: '0.3rem 0.6rem',
                          backgroundColor: isScheduled ? '#6c757d' : '#e2e3e5',
                          color: isScheduled ? 'white' : '#a8a8a8',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: isScheduled ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};