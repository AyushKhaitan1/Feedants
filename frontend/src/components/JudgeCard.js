import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const JudgeCard = () => {
  const { competition, language, setActiveVideo } = useApp();

  if (!competition?.judge) return null;

  const { judge } = competition;

  const handlePlayIntro = () => {
    setActiveVideo({
      title: `${judge.name} - ${language === 'ENG' ? 'Intro Video' : 'परिचय वीडियो'}`,
      subtitle: `${judge.designation} • ${judge.experience}`,
      videoUrl: judge.introVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    });
  };

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <Image
        source={{
          uri:
            judge.avatarUrl ||
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        }}
        style={styles.avatar}
      />

      {/* Info Column */}
      <View style={styles.infoCol}>
        <Text style={styles.judgeLabel}>{language === 'ENG' ? 'Judge' : 'निर्णायक'}</Text>
        <Text style={styles.judgeName}>{judge.name}</Text>
        <Text style={styles.designation}>{judge.designation}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>

      {/* Intro Video CTA */}
      <TouchableOpacity
        style={styles.videoCta}
        onPress={handlePlayIntro}
        activeOpacity={0.7}
      >
        <View style={styles.playCircle}>
          <Ionicons name="play" size={16} color={colors.primary} style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoLabel}>
          {language === 'ENG' ? 'Intro Video' : 'वीडियो देखें'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  judgeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 1,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  designation: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  experience: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  videoCta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F6F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  videoLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
});

export default JudgeCard;
