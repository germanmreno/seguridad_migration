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
  const [visitorType, setVisitorType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data states
  const [entities, setEntities] = useState([]);
  const [adminUnits, setAdminUnits] = useState([]);
  const [directions, setDirections] = useState([]);
  const [areas, setAreas] = useState([]);

  const loadEntities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEntities();
      setEntities(data);
    } catch (error) {
      toast.error('Error al cargar las gerencias');
      console.error('Error loading entities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdminUnits = useCallback(async (entityId) => {
    if (!entityId) return;
    try {
      setLoading(true);
      const data = await fetchAdminUnits(entityId);
      setAdminUnits(data);
      setDirections([]);
      setAreas([]);
    } catch (error) {
      toast.error('Error al cargar las unidades administrativas');
      console.error('Error loading admin units:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDirections = useCallback(async (adminUnitId) => {
    if (!adminUnitId) return;
    try {
      setLoading(true);
      const data = await fetchDirections(adminUnitId);
      setDirections(data);
    } catch (error) {
      toast.error('Error al cargar las direcciones');
      console.error('Error loading directions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAreas = useCallback(async (adminUnitId) => {
    if (!adminUnitId) return;
    try {
      setLoading(true);
      const data = await fetchAreas(adminUnitId);
      setAreas(data);
    } catch (error) {
      toast.error('Error al cargar las áreas');
      console.error('Error loading areas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    step,
    setStep,
    formType,
    setFormType,
    visitorType,
    setVisitorType,
    loading,
    entities,
    adminUnits,
    directions,
    areas,
    loadEntities,
    loadAdminUnits,
    loadDirections,
    loadAreas,
  };
};
