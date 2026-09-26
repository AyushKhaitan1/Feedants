import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export const DemoControlSheet = () => {
  const {
    isDemoSheetVisible,
    setIsDemoSheetVisible,
    users,
    currentUser,
    switchUser,
    competition,
    refreshCompetition,
    showToast,
  } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);
  const [concurrencyResult, setConcurrencyResult] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  if (!isDemoSheetVisible) return null;

  const handleRunConcurrencyTest = async () => {
    try {
      setIsSimulating(true);
      setConcurrencyResult(null);
      const res = await api.simulateConcurrency(competition._id, 10);
      setConcurrencyResult(res);
      await refreshCompetition();
      showToast('Concurrency test completed successfully!');
    } catch (err) {
      showToast('Concurrency test failed: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetCompetition = async () => {
    try {
      setIsResetting(true);
      await api.resetCompetition(competition._id, 1, false);
      await refreshCompetition();
      setConcurrencyResult(null);
      showToast('Competition reset to 1/20 Booked');
    } catch (err) {
      showToast('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Modal
      visible={isDemoSheetVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsDemoSheetVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="construct-outline" size={20} color={colors.primary} />
              <Text style={styles.modalTitle}>Evaluator & Testing Console</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsDemoSheetVisible(false)}
              style={styles.closeBtn}
            >
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Section 1: Switch Active User Persona */}
            <Text style={styles.sectionLabel}>SWITCH TEST USER PERSONA</Text>
            <Text style={styles.sectionSubtext}>
              Test how the screen adapts to registered vs unregistered states dynamically:
            </Text>

            <View style={styles.usersList}>
              {users.map((user) => {
                const isSelected = currentUser?._id === user._id;
                const isRohan = user.email.includes('rohan');
                const isPriya = user.email.includes('priya');

                let personaTag = isRohan
                  ? 'Registered (Mockup Default)'
                  : isPriya
                  ? 'Unregistered (Test Registration)'
                  : 'Alternative User';

                return (
                  <TouchableOpacity
                    key={user._id}
                    style={[styles.userItem, isSelected && styles.userItemSelected]}
                    onPress={() => switchUser(user)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.userLeft}>
                      <View style={[styles.avatarCircle, isSelected && styles.avatarSelected]}>
                        <Text style={styles.avatarLetter}>{user.name[0]}</Text>
                      </View>
                      <View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userRoleTag}>{personaTag}</Text>
                      </View>
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Section 2: Concurrency & Race Condition Testing */}
            <Text style={styles.sectionLabel}>CONCURRENCY & DATA CONSISTENCY</Text>
            <Text style={styles.sectionSubtext}>
              Simulate 10 concurrent requests at the exact same millisecond to prove atomic spot
              reservation and zero overbooking:
            </Text>

            <TouchableOpacity
              style={styles.concurrencyBtn}
              onPress={handleRunConcurrencyTest}
              disabled={isSimulating}
              activeOpacity={0.85}
            >
              {isSimulating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="flash" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.concurrencyBtnText}>
                    Simulate 10 Concurrent Registrations
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {concurrencyResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>⚡ Concurrency Test Results</Text>
                <Text style={styles.resultItem}>
                  • Requests Dispatched: {concurrencyResult.simulatedRequests}
                </Text>
                <Text style={styles.resultItem}>
                  • Execution Duration: {concurrencyResult.durationMs}ms
                </Text>
                <Text style={styles.resultItem}>
                  • Successful Spots Claimed: {concurrencyResult.successfulCount}
                </Text>
                <Text style={styles.resultItem}>
                  • Clean Rejections: {concurrencyResult.rejectedCount}
                </Text>
                <Text style={styles.resultItem}>
                  • Final Spots in MongoDB:{' '}
                  <Text style={{ fontWeight: '800' }}>
                    {concurrencyResult.finalSpotsBooked} / {concurrencyResult.maxSpotsAllowed}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.resultItem,
                    {
                      color: concurrencyResult.overbookingOccurred ? '#EF4444' : '#10B981',
                      fontWeight: '800',
                      marginTop: 4,
                    },
                  ]}
                >
                  {concurrencyResult.overbookingOccurred
                    ? '❌ Overbooking Detected'
                    : '✅ Zero Overbooking Guaranteed!'}
                </Text>
              </View>
            )}

            {/* Section 3: Reset Demo Data */}
            <Text style={styles.sectionLabel}>DEMO RESET</Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetCompetition}
              disabled={isResetting}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={14} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>
                {isResetting ? 'Resetting...' : 'Reset Competition Spots to 1 / 20'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 16,
  },
  usersList: {
    gap: 8,
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  userItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDFA',
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: {
    backgroundColor: colors.primary,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRoleTag: {
    fontSize: 11,
    color: '#64748B',
  },
  concurrencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  concurrencyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resultBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  resultItem: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 3,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    marginTop: 4,
    marginBottom: 16,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default DemoControlSheet;
