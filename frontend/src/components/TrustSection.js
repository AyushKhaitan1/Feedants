import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const TrustSection = () => {
  const { language, setActiveVideo, setIsPolicyModalVisible } = useApp();

  const handleWatchPrizeVideo = () => {
    setActiveVideo({
      title: language === 'ENG' ? 'Prize Money Disbursement Policy' : 'पुरस्कार राशि वितरण प्रक्रिया',
      subtitle: 'Feedants Automated Bank Transfer & UPI Verification Guide',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    });
  };

  return (
    <View style={styles.container}>
      {/* Left Card: Prize Money Video */}
      <TouchableOpacity
        style={styles.cardLeft}
        onPress={handleWatchPrizeVideo}
        activeOpacity={0.8}
      >
        <View style={styles.playIconCircle}>
          <Ionicons name="play" size={16} color={colors.primary} style={{ marginLeft: 2 }} />
        </View>

        <View style={styles.cardLeftContent}>
          <Text style={styles.cardLeftTitle}>
            {language === 'ENG' ? 'How will you receive prize money?' : 'पुरस्कार राशि कैसे प्राप्त होगी?'}
          </Text>
          <Text style={styles.cardLeftSubtitle}>
            {language === 'ENG' ? 'Watch video to know more' : 'अधिक जानने के लिए वीडियो देखें'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Card: Policies & Razorpay Security */}
      <View style={styles.cardRight}>
        {/* Refund Policy */}
        <TouchableOpacity
          style={styles.policyRow}
          onPress={() => setIsPolicyModalVisible(true)}
          activeOpacity={0.7}
        >
          <Feather name="shield" size={15} color="#1E293B" />
          <Text style={styles.policyText}>
            {language === 'ENG' ? 'Refund policy' : 'रिफंड नीति'}
          </Text>
        </TouchableOpacity>

        {/* Razorpay Assurance */}
        <View style={styles.policyRow}>
          <Feather name="shield" size={15} color="#1E293B" />
          <View style={styles.razorpayContainer}>
            <Text style={styles.secureText}>
              {language === 'ENG' ? 'Secure payments powered by ' : 'सुरक्षित भुगतान '}
            </Text>
            <Text style={styles.razorpayBrand}>Razorpay</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  cardLeft: {
    flex: 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  playIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardLeftContent: {
    flex: 1,
  },
  cardLeftTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 15,
    marginBottom: 2,
  },
  cardLeftSubtitle: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '500',
  },
  cardRight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  policyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  razorpayContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  secureText: {
    fontSize: 10,
    color: '#475569',
  },
  razorpayBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    fontStyle: 'italic',
  },
});

export default TrustSection;
