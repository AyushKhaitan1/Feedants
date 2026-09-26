import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export const PaymentModal = () => {
  const {
    isPaymentModalVisible,
    setIsPaymentModalVisible,
    competition,
    currentUser,
    refreshCompetition,
    showToast,
    language,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!isPaymentModalVisible) return null;

  const entryFee = competition?.entryFee || 99;

  const handlePay = async () => {
    try {
      setIsProcessing(true);
      const res = await api.registerForCompetition(
        competition._id,
        currentUser._id,
        {
          method: selectedMethod,
          paymentId: `pay_rzp_${Date.now()}`,
          orderId: `order_${Date.now()}`,
        }
      );

      setSuccessData(res);
      await refreshCompetition(currentUser._id);
      showToast(language === 'ENG' ? '🎉 Registration Confirmed!' : '🎉 पंजीकरण सफल!');
    } catch (err) {
      console.error('Registration failed:', err);
      showToast(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsPaymentModalVisible(false);
    setSuccessData(null);
  };

  return (
    <Modal
      visible={isPaymentModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.razorpayBrandRow}>
              <Feather name="shield" size={16} color="#0284C7" />
              <Text style={styles.razorpayText}>Razorpay Trusted Checkout</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {successData ? (
            /* Success State */
            <View style={styles.successContainer}>
              <View style={styles.checkCircle}>
                <Feather name="check" size={32} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successSubtitle}>
                Slot #{successData.registration?.slotNumber} is officially reserved for{' '}
                {currentUser?.name}.
              </Text>

              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Transaction ID</Text>
                  <Text style={styles.receiptVal}>
                    {successData.registration?.payment?.paymentId}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Amount Paid</Text>
                  <Text style={styles.receiptVal}>₹ {entryFee}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Status</Text>
                  <Text style={[styles.receiptVal, { color: '#10B981', fontWeight: '800' }]}>
                    VERIFIED
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>Continue to Competition</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Checkout State */
            <View>
              {/* Order Summary */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>{competition?.title}</Text>
                <Text style={styles.participantName}>
                  Participant: <Text style={{ fontWeight: '700' }}>{currentUser?.name}</Text>
                </Text>

                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Entry Fee</Text>
                  <Text style={styles.priceVal}>₹ {entryFee}.00</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Convenience Fee</Text>
                  <Text style={[styles.priceVal, { color: '#10B981' }]}>FREE</Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalVal}>₹ {entryFee}.00</Text>
                </View>
              </View>

              {/* Payment Method Selector */}
              <Text style={styles.methodsTitle}>Select Payment Method</Text>

              <TouchableOpacity
                style={[styles.methodOption, selectedMethod === 'UPI' && styles.methodSelected]}
                onPress={() => setSelectedMethod('UPI')}
              >
                <Ionicons name="flash-outline" size={20} color={colors.primary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>UPI (Instant Confirmation)</Text>
                  <Text style={styles.methodDesc}>Google Pay, PhonePe, Paytm, BHIM</Text>
                </View>
                {selectedMethod === 'UPI' && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.methodOption, selectedMethod === 'CARD' && styles.methodSelected]}
                onPress={() => setSelectedMethod('CARD')}
              >
                <Ionicons name="card-outline" size={20} color={colors.primary} />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>Debit / Credit Card</Text>
                  <Text style={styles.methodDesc}>Visa, MasterCard, RuPay</Text>
                </View>
                {selectedMethod === 'CARD' && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.payBtn}
                onPress={handlePay}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.payBtnText}>Pay ₹ {entryFee} Securely</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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
  razorpayBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  razorpayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  closeBtn: {
    padding: 4,
  },
  summaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  participantName: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  priceVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  methodsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDFA',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  methodDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  payBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default PaymentModal;
