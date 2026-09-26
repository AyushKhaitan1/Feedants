import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const PreviousWinners = () => {
  const { competition, language, setActiveVideo } = useApp();

  const winners = competition?.previousWinners || [];

  if (winners.length === 0) return null;

  const handleWinnerClick = (winner) => {
    setActiveVideo({
      title: `${winner.name} - ${winner.position}`,
      subtitle: `${winner.style || 'Classical Dance Performance'} • Feedants Hall of Fame`,
      videoUrl: winner.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>
        {language === 'ENG' ? 'Previous Winners' : 'पिछले विजेता'}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {winners.map((winner, index) => (
          <TouchableOpacity
            key={winner._id || index}
            style={styles.winnerCard}
            onPress={() => handleWinnerClick(winner)}
            activeOpacity={0.8}
          >
            {/* Thumbnail with Play Icon Overlay */}
            <View style={styles.thumbnailContainer}>
              <Image
                source={{
                  uri:
                    winner.avatarUrl ||
                    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
                }}
                style={styles.thumbnail}
              />
              <View style={styles.playBadge}>
                <Ionicons name="play" size={11} color={colors.primary} style={{ marginLeft: 1 }} />
              </View>
            </View>

            {/* Winner Name & Rank */}
            <View style={styles.winnerInfo}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.winnerRank} numberOfLines={1}>
                {winner.position}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    marginHorizontal: 16,
    letterSpacing: -0.2,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 145,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerInfo: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
    paddingRight: 4,
  },
  winnerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  winnerRank: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default PreviousWinners;
