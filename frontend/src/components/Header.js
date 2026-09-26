import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { language, setLanguage, setIsDemoSheetVisible, currentUser } = useApp();

  return (
    <View style={styles.headerContainer}>
      {/* Simulated Device Status Bar */}
      <View style={styles.statusBarRow}>
        <Text style={styles.statusTime}>9:41</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="cellular" size={14} color="#111827" style={styles.statusIcon} />
          <Ionicons name="wifi" size={14} color="#111827" style={styles.statusIcon} />
          <Ionicons name="battery-full" size={18} color="#111827" />
        </View>
      </View>

      {/* Main Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.goBackBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={22} color="#111827" />
          <Text style={styles.goBackText}>{language === 'ENG' ? 'Go back' : 'पीछे जाएं'}</Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {/* Quick Demo Switcher Indicator */}
          <TouchableOpacity
            style={styles.demoBadge}
            onPress={() => setIsDemoSheetVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pulseDot} />
            <Text style={styles.demoBadgeText} numberOfLines={1}>
              {currentUser ? currentUser.name.split(' ')[0] : 'Demo'}
            </Text>
          </TouchableOpacity>

          {/* Language Toggle Pill */}
          <View style={styles.langTogglePill}>
            <TouchableOpacity
              style={[styles.langSegment, language === 'ENG' && styles.langSegmentActive]}
              onPress={() => setLanguage('ENG')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langText, language === 'ENG' && styles.langTextActive]}>
                ENG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langSegment, language === 'HI' && styles.langSegmentActive]}
              onPress={() => setLanguage('HI')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langText, language === 'HI' && styles.langTextActive]}>
                हिंदी
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  statusTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 6,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  demoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  langTogglePill: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langSegment: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  langSegmentActive: {
    backgroundColor: colors.primaryDark,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
});

export default Header;
