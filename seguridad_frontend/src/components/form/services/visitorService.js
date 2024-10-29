import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const searchVisitor = async (dni) => {
  try {
    const response = await axios.get(`${API_URL}/visitors/search-visitor`, {
      params: { dni },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Visitor not found
    }
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
