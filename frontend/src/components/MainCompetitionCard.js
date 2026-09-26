import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const MainCompetitionCard = () => {
  const { competition, language } = useApp();

  if (!competition) return null;

  const {
    title,
    prizePool = 1500,
    entryFee = 99,
    maxSpots = 20,
    spotsBooked = 1,
    tags = ['Dance', 'Multi-Win', 'Winners get certificate'],
    userContext,
  } = competition;

  const remainingSpots = Math.max(0, maxSpots - spotsBooked);
  const isRegistered = userContext?.isRegistered;
  const progressRatio = Math.min(1, Math.max(0, spotsBooked / maxSpots));

  return (
    <View style={styles.card}>
      {/* Title & Status Badge Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Feather name="check-circle" size={13} color={colors.primary} style={styles.badgeIcon} />
            <Text style={styles.registeredBadgeText}>
              {language === 'ENG' ? 'Registered' : 'पंजीकृत'}
            </Text>
          </View>
        ) : (
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>
              {remainingSpots <= 3 ? 'Fast Filling' : 'Registration Open'}
            </Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{tags[0] || 'Dance'}</Text>
        </View>

        <View style={styles.chip}>
          <Text style={styles.chipText}>{tags[1] || 'Multi-Win'}</Text>
        </View>

        <View style={styles.certificateTag}>
          <Ionicons name="trophy-outline" size={14} color={colors.primary} />
          <Text style={styles.certificateText}>
            {language === 'ENG' ? 'Winners get certificate' : 'विजेताओं को प्रमाणपत्र'}
          </Text>
        </View>
      </View>

      {/* Metrics Row (Prize Pool, Entry Fee, Spots Booked) */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>
            {language === 'ENG' ? 'Prize Pool' : 'पुरस्कार राशि'}
          </Text>
          <Text style={styles.prizeValue}>₹ {prizePool.toLocaleString()}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>
            {language === 'ENG' ? 'Entry Fee' : 'प्रवेश शुल्क'}
          </Text>
          <Text style={styles.entryFeeValue}>₹ {entryFee}</Text>
        </View>

        {/* Spots Left & Progress Bar */}
        <View style={styles.spotsCol}>
          <View style={styles.spotsCountRow}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={styles.spotsCountText}>
              {language === 'ENG'
                ? `Only ${remainingSpots} spots left`
                : `केवल ${remainingSpots} सीटें शेष`}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, progressRatio * 100)}%` }]} />
          </View>

          <Text style={styles.bookedText}>
            {spotsBooked} / {maxSpots} {language === 'ENG' ? 'Booked' : 'बुक हुई'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    paddingRight: 8,
    letterSpacing: -0.3,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F6F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  registeredBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  openBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  openBadgeText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  certificateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificateText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
    paddingTop: 8,
  },
  metricCol: {
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  prizeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  entryFeeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  spotsCol: {
    minWidth: 110,
    alignItems: 'flex-start',
  },
  spotsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  spotsCountText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  bookedText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default MainCompetitionCard;
