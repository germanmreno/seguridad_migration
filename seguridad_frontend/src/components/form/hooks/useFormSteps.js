import { useState, useCallback } from 'react';
import { STEPS } from '../constants';
import { toast } from 'sonner';
import {
  fetchEntities,
  fetchAdminUnits,
  fetchDirections,
  fetchAreas,
} from '../services/visitorService';

export const useFormSteps = (form) => {
  const [step, setStep] = useState(STEPS.FORM_TYPE);
  const [formType, setFormType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize arrays with empty arrays instead of undefined
  const [entities, setEntities] = useState([]);
  const [adminUnits, setAdminUnits] = useState([]);
  const [directions, setDirections] = useState([]);
  const [areas, setAreas] = useState([]);

  const loadEntities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEntities();
      setEntities(data || []);
    } catch (error) {
      toast.error('Error al cargar las gerencias');
      console.error('Error loading entities:', error);
      setEntities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdminUnits = async (entityId) => {
    if (!entityId) {
      setAdminUnits([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAdminUnits(entityId);

      if (Array.isArray(response) && response.length > 0) {
        setAdminUnits(response);
        // Clear the error if it exists
        form.clearErrors('administrativeUnitId');
      } else {
        setAdminUnits([]);
        form.setError('administrativeUnitId', {
          type: 'manual',
          message: 'No se encontraron unidades administrativas',
        });
      }
    } catch (error) {
      console.error('Error loading admin units:', error);
      setAdminUnits([]);
      form.setError('administrativeUnitId', {
        type: 'manual',
        message: 'Error al cargar las unidades administrativas',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDirections = useCallback(async (adminUnitId) => {
    if (!adminUnitId) return;
    try {
      setLoading(true);
      const data = await fetchDirections(adminUnitId);
      setDirections(data || []);
    } catch (error) {
      toast.error('Error al cargar las direcciones');
      console.error('Error loading directions:', error);
      setDirections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAreas = useCallback(async (adminUnitId) => {
    if (!adminUnitId) return;
    try {
      setLoading(true);
      const data = await fetchAreas(adminUnitId);
      setAreas(data || []);
    } catch (error) {
      toast.error('Error al cargar las áreas');
      console.error('Error loading areas:', error);
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    step,
    setStep,
    formType,
    setFormType,
    loading,
    entities: entities || [],
    adminUnits: adminUnits || [],
    directions: directions || [],
    areas: areas || [],
    loadEntities,
    loadAdminUnits,
    loadDirections,
    loadAreas,
  };
};
