import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const BottomNavBar = () => {
  const { language, currentUser, setIsDemoSheetVisible } = useApp();

  return (
    <View style={styles.navBar}>
      {/* 1. Home */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Feather name="home" size={20} color="#94A3B8" />
        <Text style={styles.navText}>{language === 'ENG' ? 'Home' : 'होम'}</Text>
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Feather name="search" size={20} color="#94A3B8" />
        <Text style={styles.navText}>{language === 'ENG' ? 'Explore' : 'खोजें'}</Text>
      </TouchableOpacity>

      {/* 3. Floating Action Center (+) */}
      <TouchableOpacity
        style={styles.centerFab}
        onPress={() => setIsDemoSheetVisible(true)}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Ionicons name="trophy" size={20} color={colors.primary} />
        <Text style={[styles.navText, styles.activeNavText]}>
          {language === 'ENG' ? 'Competitions' : 'प्रतियोगिताएं'}
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setIsDemoSheetVisible(true)}
        activeOpacity={0.7}
      >
        {currentUser?.avatarUrl ? (
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatarIcon} />
        ) : (
          <Feather name="user" size={20} color="#94A3B8" />
        )}
        <Text style={styles.navText}>{language === 'ENG' ? 'Profile' : 'प्रोफ़ाइल'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  activeNavText: {
    color: colors.primary,
    fontWeight: '700',
  },
  centerFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 4,
  },
  avatarIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
});

export default BottomNavBar;
