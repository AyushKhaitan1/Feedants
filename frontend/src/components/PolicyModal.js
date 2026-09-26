import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const PolicyModal = () => {
  const {
    isPolicyModalVisible,
    setIsPolicyModalVisible,
    isTestimonialsVisible,
    setIsTestimonialsVisible,
    language,
  } = useApp();

  const isVisible = isPolicyModalVisible || isTestimonialsVisible;
  const isPolicy = isPolicyModalVisible;

  const handleClose = () => {
    setIsPolicyModalVisible(false);
    setIsTestimonialsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              {isPolicy ? (
                <Feather name="shield" size={18} color={colors.primary} />
              ) : (
                <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
              )}
              <Text style={styles.modalTitle}>
                {isPolicy
                  ? language === 'ENG'
                    ? 'Feedants Refund Policy'
                    : 'रिफंड नीति'
                  : language === 'ENG'
                  ? 'Hear from Our Participants'
                  : 'प्रतियोगियों की प्रतिक्रिया'}
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {isPolicy ? (
              <View style={styles.content}>
                <Text style={styles.paragraph}>
                  Feedants guarantees a fair and transparent refund framework for all competitive
                  events:
                </Text>

                <View style={styles.policyPoint}>
                  <Text style={styles.pointTitle}>1. Competition Cancellation Guarantee</Text>
                  <Text style={styles.pointText}>
                    If an event or category is cancelled by Feedants or the jury for unforeseen
                    reasons, 100% of the entry fee (₹99) is immediately refunded to your original
                    payment method via Razorpay within 24-48 hours.
                  </Text>
                </View>

                <View style={styles.policyPoint}>
                  <Text style={styles.pointTitle}>2. Cancellation Prior to Deadline</Text>
                  <Text style={styles.pointText}>
                    Participants may withdraw their registration up to 24 hours prior to the
                    Registration Close deadline (10 Aug 26) with zero deduction.
                  </Text>
                </View>

                <View style={styles.policyPoint}>
                  <Text style={styles.pointTitle}>3. Quality Dispute & Escalation</Text>
                  <Text style={styles.pointText}>
                    In the rare event of technical failure during performance video evaluation,
                    participants can submit an appeal through our support desk for automated re-review.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.content}>
                <View style={styles.testimonialItem}>
                  <View style={styles.testimonialUserRow}>
                    <View style={styles.testimonialAvatar}>
                      <Text style={styles.avatarTxt}>S</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>Sunita Rao</Text>
                      <Text style={styles.userSubtitle}>Kathak Dancer • Pune (1st Winner '25)</Text>
                    </View>
                  </View>
                  <Text style={styles.testimonialQuote}>
                    "The feedback from judge Manju Dubey was so detailed and insightful! Winning the
                    ₹550 prize pool and verified digital certificate boosted my classical dance
                    portfolio tremendously."
                  </Text>
                </View>

                <View style={styles.testimonialItem}>
                  <View style={styles.testimonialUserRow}>
                    <View style={styles.testimonialAvatar}>
                      <Text style={styles.avatarTxt}>D</Text>
                    </View>
                    <View>
                      <Text style={styles.userName}>Devika Nambiar</Text>
                      <Text style={styles.userSubtitle}>Bharatanatyam • Bengaluru</Text>
                    </View>
                  </View>
                  <Text style={styles.testimonialQuote}>
                    "Seamless experience from registration via UPI to submission upload. Transparent
                    scores and clear judging parameters make Feedants my favorite platform."
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
              <Text style={styles.doneBtnText}>Close</Text>
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
    maxHeight: '80%',
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
  content: {
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 18,
  },
  policyPoint: {
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pointTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  pointText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  testimonialItem: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testimonialUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  testimonialAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  userSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  testimonialQuote: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PolicyModal;
