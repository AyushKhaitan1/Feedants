import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const RewardsSection = () => {
  const { competition, language } = useApp();

  const rewards = competition?.rewards || [
    { rank: 1, title: '1st Winner', amount: 550, iconType: 'trophy' },
    { rank: 2, title: '2nd Winner', amount: 300, iconType: 'medal' },
    { rank: 3, title: '3rd Winner', amount: 240, iconType: 'medal' },
    { rank: 4, title: '4th Winner', amount: 200, iconType: 'star' },
    { rank: 5, title: '5th Winner', amount: 130, iconType: 'star' },
    { rank: 6, title: '6th Winner', amount: 80, iconType: 'star' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Text style={styles.emojiIcon}>🏆</Text>;
      case 2:
        return <Text style={styles.emojiIcon}>🥈</Text>;
      case 3:
        return <Text style={styles.emojiIcon}>🥉</Text>;
      case 4:
      case 5:
      case 6:
      default:
        return <Feather name="star" size={17} color={colors.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>
        {language === 'ENG' ? 'Rewards' : 'पुरस्कार'}{' '}
        <Text style={styles.subHeading}>(All Positions)</Text>
      </Text>

      {/* Rewards List */}
      <View style={styles.rewardsList}>
        {rewards.map((reward) => (
          <View key={reward.rank} style={styles.rewardRow}>
            <View style={styles.rankLeft}>
              <View style={styles.iconContainer}>{getRankIcon(reward.rank)}</View>
              <Text style={styles.rankTitle}>{reward.title}</Text>
            </View>
            <Text style={styles.amountText}>₹ {reward.amount}</Text>
          </View>
        ))}
      </View>

      {/* Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
        <Text style={styles.disclaimerText}>
          {competition?.disclaimer ||
            'Disclaimer: Only contributions from paid participants will be considered for judging.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  rewardsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 18,
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F6F7',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#1E293B',
    flex: 1,
    lineHeight: 15,
    fontWeight: '500',
  },
});

export default RewardsSection;
