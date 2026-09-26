import { Platform } from 'react-native';

// In Expo Web or local node, localhost works; on Android emulator 10.0.2.2 is used
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

export const api = {
  /**
   * Fetch competition details with user contextual state
   */
  async getCompetitionDetails(competitionId = 'featured', userId = null) {
    const url = `${BASE_URL}/competitions/${competitionId}${userId ? `?userId=${userId}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {}),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch competition');
    }
    return data;
  },

  /**
   * Register user for competition
   */
  async registerForCompetition(competitionId, userId, paymentDetails = {}) {
    const response = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        competitionId,
        userId,
        paymentDetails,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.message || 'Registration failed');
      err.code = data.code;
      err.data = data;
      throw err;
    }
    return data;
  },

  /**
   * Submit performance video
   */
  async submitPerformance(competitionId, userId, payload) {
    const response = await fetch(`${BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        competitionId,
        userId,
        ...payload,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.message || 'Submission failed');
      err.code = data.code;
      throw err;
    }
    return data;
  },

  /**
   * Fetch all test users
   */
  async getUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    return data.data || [];
  },

  /**
   * Simulate concurrency stress test
   */
  async simulateConcurrency(competitionId, simulatedUsersCount = 10) {
    const response = await fetch(`${BASE_URL}/registrations/simulate-concurrency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competitionId, simulatedUsersCount }),
    });
    return await response.json();
  },

  /**
   * Reset competition spots & registrations for demo
   */
  async resetCompetition(competitionId, spotsBooked = 1, clearRegistrations = true) {
    const response = await fetch(`${BASE_URL}/competitions/${competitionId}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotsBooked, clearRegistrations }),
    });
    return await response.json();
  },
};

export default api;
