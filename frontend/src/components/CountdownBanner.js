import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const CountdownBanner = () => {
  const { competition, language } = useApp();

  const targetDateStr = competition?.dates?.registrationClosesAt;

  const calculateTimeLeft = () => {
    if (!targetDateStr) {
      return { days: '01', hours: '06', minutes: '28', seconds: '32' };
    }

    const difference = new Date(targetDateStr).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  return (
    <View style={styles.banner}>
      {/* Left: Hourglass & Label */}
      <View style={styles.leftCol}>
        <Ionicons name="hourglass-outline" size={16} color={colors.primary} />
        <Text style={styles.label}>
          {language === 'ENG' ? 'Registration closes in' : 'पंजीकरण बंद होगा'}
        </Text>
      </View>

      {/* Middle: Timer String */}
      <Text style={styles.timerString}>
        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
      </Text>

      {/* Right: Hurry up */}
      <View style={styles.rightCol}>
        <Feather name="clock" size={14} color={colors.primary} />
        <Text style={styles.hurryText}>
          {language === 'ENG' ? 'Hurry up!' : 'जल्दी करें!'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E6F6F7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CEEFF2',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  timerString: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default CountdownBanner;
