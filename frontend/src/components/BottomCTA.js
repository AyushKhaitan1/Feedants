import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const BottomCTA = () => {
  const {
    competition,
    language,
    setIsPaymentModalVisible,
    setIsSubmissionModalVisible,
    showToast,
  } = useApp();

  if (!competition) return null;

  const { entryFee = 99, spotsBooked = 1, maxSpots = 20, userContext } = competition;
  const remainingSpots = Math.max(0, maxSpots - spotsBooked);
  const isRegistered = userContext?.isRegistered;
  const hasSubmitted = !!userContext?.submission;
  const isSpotsFull = spotsBooked >= maxSpots;

  const handlePress = () => {
    if (isRegistered) {
      if (hasSubmitted) {
        showToast(
          language === 'ENG'
            ? 'Your dance performance has been received and is under review by Manju Dubey!'
            : 'आपकी प्रस्तुति प्राप्त हो चुकी है और समीक्षाधीन है!'
        );
      } else {
        setIsSubmissionModalVisible(true);
      }
    } else {
      if (isSpotsFull) {
        showToast(
          language === 'ENG'
            ? 'Sorry, all spots for this competition are currently booked.'
            : 'क्षमा करें, सभी सीटें भर चुकी हैं।'
        );
      } else {
        setIsPaymentModalVisible(true);
      }
    }
  };

  // Compute Button Text & Subtext based on dynamic states
  let mainText = language === 'ENG' ? 'Upload Submission' : 'प्रविष्टि अपलोड करें';
  let subText = language === 'ENG' ? 'Registered' : 'पंजीकृत';
  let buttonBg = colors.primaryDark; // '#005C65' from mockup

  if (!isRegistered) {
    if (isSpotsFull) {
      mainText = language === 'ENG' ? 'Spots Full' : 'सीटें भर चुकी हैं';
      subText = `${maxSpots}/${maxSpots} Booked`;
      buttonBg = '#94A3B8';
    } else {
      mainText =
        language === 'ENG'
          ? `Register Now • ₹${entryFee}`
          : `अभी रजिस्टर करें • ₹${entryFee}`;
      subText =
        language === 'ENG'
          ? `Only ${remainingSpots} spots left`
          : `केवल ${remainingSpots} सीटें शेष`;
      buttonBg = colors.primaryDark;
    }
  } else if (hasSubmitted) {
    mainText = language === 'ENG' ? 'Submission Uploaded' : 'प्रविष्टि अपलोड हो गई';
    subText = language === 'ENG' ? 'Under Review' : 'समीक्षाधीन';
    buttonBg = '#047857';
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBg }]}
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={!isRegistered && isSpotsFull}
      >
        <Text style={styles.mainText}>{mainText}</Text>
        <Text style={styles.subText}>{subText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  subText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#CCFBF1',
    marginTop: 1,
  },
});

export default BottomCTA;
