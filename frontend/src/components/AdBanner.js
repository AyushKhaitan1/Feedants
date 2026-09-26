import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const AdBanner = () => {
  return (
    <View style={styles.adContainer}>
      <Feather name="volume-2" size={15} color="#94A3B8" />
      <Text style={styles.adText}>Ad Here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
  },
  adText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});

export default AdBanner;
