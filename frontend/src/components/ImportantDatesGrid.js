import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const ImportantDatesGrid = () => {
  const { competition, language } = useApp();

  if (!competition?.dates) return null;

  const { registerBefore, submissionStarts, submissionEnds, resultDate } = competition.dates;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>
        {language === 'ENG' ? 'Important Dates' : 'महत्वपूर्ण तिथियां'}
      </Text>

      <View style={styles.card}>
        {/* Row 1 */}
        <View style={styles.row}>
          {/* Top-Left: Register Before */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.iconWrapper}>
              <Feather name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dateLabel}>
                {language === 'ENG' ? 'Register Before' : 'पंजीकरण अंतिम तिथि'}
              </Text>
              <Text style={styles.dateMain}>{registerBefore?.dateStr || '10 Aug 26'}</Text>
              <Text style={styles.dateTime}>{registerBefore?.timeStr || '11:50 PM'}</Text>
            </View>
          </View>

          {/* Top-Right: Submission Starts */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Feather name="send" size={19} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dateLabel}>
                {language === 'ENG' ? 'Submission Starts' : 'प्रविष्टि आरंभ'}
              </Text>
              <Text style={styles.dateMain}>{submissionStarts?.dateStr || '6 Aug 26'}</Text>
              <Text style={styles.dateTime}>{submissionStarts?.timeStr || '04:00 AM'}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.horizontalDivider} />

        {/* Row 2 */}
        <View style={styles.row}>
          {/* Bottom-Left: Submission Ends */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.iconWrapper}>
              <Feather name="upload" size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dateLabel}>
                {language === 'ENG' ? 'Submission Ends' : 'प्रविष्टि समाप्ति'}
              </Text>
              <Text style={styles.dateMain}>{submissionEnds?.dateStr || '30 Aug 26'}</Text>
              <Text style={styles.dateTime}>{submissionEnds?.timeStr || '11:55 PM'}</Text>
            </View>
          </View>

          {/* Bottom-Right: Result Date */}
          <View style={styles.cell}>
            <View style={styles.iconWrapper}>
              <Ionicons name="trophy-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dateLabel}>
                {language === 'ENG' ? 'Result Date' : 'परिणाम घोषणा'}
              </Text>
              <Text style={styles.dateMain}>{resultDate?.dateStr || '1 Sept 26'}</Text>
              <Text style={styles.dateTime}>{resultDate?.timeStr || '11:50 PM'}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  iconWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  dateMain: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  dateTime: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
});

export default ImportantDatesGrid;
