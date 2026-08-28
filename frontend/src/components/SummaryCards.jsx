export const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3>Programadas</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{summary.scheduled}</p>
      </div>

      <div style={{ padding: '1rem', border: '1px solid #28a745', borderRadius: '8px', backgroundColor: '#eef9f0' }}>
        <h3>Activas</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#28a745' }}>{summary.active}</p>
      </div>

      <div style={{ padding: '1rem', border: '1px solid #dc3545', borderRadius: '8px', backgroundColor: '#fdf2f2' }}>
        <h3>Finalizadas</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#dc3545' }}>{summary.finished}</p>
      </div>

      <div style={{ padding: '1rem', border: '1px solid #0d6efd', borderRadius: '8px', backgroundColor: '#f0f7ff' }}>
        <h3>Vigentes Hoy</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#0d6efd' }}>{summary.activeToday}</p>
      </div>
    </div>
  );
};