import { useEffect } from 'react';

export const useFormData = (
  form,
  { loadEntities, loadAdminUnits, loadDirections, loadAreas }
) => {
  const entityId = form.watch('entityId');
  const adminUnitId = form.watch('administrativeUnitId');

  // Load initial entities
  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  // Load admin units when entity changes
  useEffect(() => {
    if (entityId) {
      loadAdminUnits(entityId);
    }
  }, [entityId, loadAdminUnits]);

  // Load directions and areas when admin unit changes
  useEffect(() => {
    if (adminUnitId) {
      loadDirections(adminUnitId);
      loadAreas(adminUnitId);
    }
  }, [adminUnitId, loadDirections, loadAreas]);
};
