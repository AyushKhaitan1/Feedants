import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('ENG'); // 'ENG' or 'HI'
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isSubmissionModalVisible, setIsSubmissionModalVisible] = useState(false);
  const [isDemoSheetVisible, setIsDemoSheetVisible] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast feedback
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Load users and initial competition data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userList = await api.getUsers();
      setUsers(userList);

      // Default user: Rohan Sharma (matches Objective_Page.png)
      const rohan = userList.find((u) => u.email.includes('rohan')) || userList[0] || null;
      setCurrentUser(rohan);

      const compRes = await api.getCompetitionDetails('featured', rohan ? rohan._id : null);
      setCompetition(compRes.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh competition state for current user
  const refreshCompetition = useCallback(async (userId = null) => {
    try {
      setRefreshing(true);
      const targetUserId = userId || (currentUser ? currentUser._id : null);
      const compRes = await api.getCompetitionDetails('featured', targetUserId);
      setCompetition(compRes.data);
    } catch (err) {
      console.error('Failed to refresh competition:', err);
    } finally {
      setRefreshing(false);
    }
  }, [currentUser]);

  // Switch active user (e.g. from Rohan [Registered] to Priya [Unregistered])
  const switchUser = async (user) => {
    setCurrentUser(user);
    await refreshCompetition(user ? user._id : null);
    showToast(`Switched active user to ${user.name}`);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        users,
        currentUser,
        setCurrentUser,
        switchUser,
        competition,
        setCompetition,
        loading,
        refreshing,
        error,
        refreshCompetition,
        showToast,
        toastMessage,

        // Modals
        activeVideo,
        setActiveVideo,
        isPaymentModalVisible,
        setIsPaymentModalVisible,
        isSubmissionModalVisible,
        setIsSubmissionModalVisible,
        isDemoSheetVisible,
        setIsDemoSheetVisible,
        isPolicyModalVisible,
        setIsPolicyModalVisible,
        isTestimonialsVisible,
        setIsTestimonialsVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
