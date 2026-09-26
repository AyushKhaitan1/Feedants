import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const TestimonialBanner = () => {
  const { language, setIsTestimonialsVisible } = useApp();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsTestimonialsVisible(true)}
      activeOpacity={0.8}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="chatbubbles-outline" size={20} color="#334155" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {language === 'ENG' ? 'Hear from Our Users' : 'हमारे उपयोगकर्ताओं से सुनें'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'ENG'
            ? 'See what participants say about Feedants'
            : 'देखें प्रतियोगी Feedants के बारे में क्या कहते हैं'}
        </Text>
      </View>

      <Feather name="chevron-right" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
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
  iconCircle: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
});

export default TestimonialBanner;
