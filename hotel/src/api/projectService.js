import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/projects';

export const getYourData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    // Xử lý lỗi ở đây
    console.error(error);
    throw error;
  }
};
