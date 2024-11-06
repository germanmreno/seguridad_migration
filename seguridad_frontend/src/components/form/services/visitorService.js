import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const searchVisitor = async (dniNumber) => {
  try {
    console.log('Calling API with DNI:', dniNumber);
    const response = await fetch(
      `${API_URL}/visitors/search-visitor?dni=${dniNumber}`
    );
    console.log('Raw API response:', response);

    if (!response.ok) {
      const error = await response.json();
      console.error('API error response:', error);
      throw new Error(error.details || 'Error searching for visitor');
    }

    const data = await response.json();
    console.log('API success response:', data);
    return data;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const fetchEntities = async () => {
  const response = await axios.get(`${API_URL}/selects/entities`);
  return response.data;
};

export const fetchAdminUnits = async (entityId) => {
  const response = await axios.get(
    `${API_URL}/selects/administrative-units/${entityId}`
  );
  return response.data;
};

export const fetchDirections = async (adminUnitId) => {
  const response = await axios.get(
    `${API_URL}/selects/directions/${adminUnitId}`
  );
  return response.data;
};

export const fetchAreas = async (
  adminUnitId,
  type = 'unit',
  directionId = null
) => {
  const endpoint =
    type === 'direction'
      ? `${API_URL}/selects/areas/${directionId}?type=direction`
      : `${API_URL}/selects/areas/${adminUnitId}?type=unit`;
  const response = await axios.get(endpoint);
  return response.data;
};

export const registerVisitor = async (formData) => {
  try {
    console.log('Sending request to:', `${API_URL}/visitors/register-complete`);
    console.log('Request payload:', formData);

    const response = await axios.post(
      `${API_URL}/visitors/register-complete`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Server response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          error.response.data.error ||
          'Error en el registro'
      );
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const fetchDashboardStats = async (timeRange = 'week') => {
  try {
    const response = await axios.get(`${API_URL}/visitors/dashboard-stats`, {
      params: { timeRange },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Error al obtener estadísticas del dashboard');
  }
};
