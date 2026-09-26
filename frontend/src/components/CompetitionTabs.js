import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const CompetitionTabs = () => {
  const { competition, language } = useApp();
  const [activeTab, setActiveTab] = useState('ABOUT'); // 'ABOUT', 'PARAMETERS', 'RULES'
  const [isExpanded, setIsExpanded] = useState(false);

  const tabsData = competition?.tabs;

  const aboutShort = language === 'ENG' ? tabsData?.about?.shortEn : tabsData?.about?.shortHi;
  const aboutFull = language === 'ENG' ? tabsData?.about?.fullEn : tabsData?.about?.fullHi;

  return (
    <View style={styles.container}>
      {/* Tab Navigation Headers */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ABOUT' && styles.activeTabButton]}
          onPress={() => setActiveTab('ABOUT')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'ABOUT' && styles.activeTabText]}>
            {language === 'ENG' ? 'About Competition' : 'प्रतियोगिता विवरण'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'PARAMETERS' && styles.activeTabButton]}
          onPress={() => setActiveTab('PARAMETERS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'PARAMETERS' && styles.activeTabText]}>
            {language === 'ENG' ? 'Judging Parameters' : 'मूल्यांकन मानदंड'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'RULES' && styles.activeTabButton]}
          onPress={() => setActiveTab('RULES')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'RULES' && styles.activeTabText]}>
            {language === 'ENG' ? 'Rules & Eligibility' : 'नियम व पात्रता'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: About Competition */}
      {activeTab === 'ABOUT' && (
        <View style={styles.contentContainer}>
          <Text style={styles.bodyText}>
            {isExpanded ? (aboutFull || aboutShort) : (aboutShort || aboutFull)}
          </Text>

          <TouchableOpacity
            style={styles.viewMoreBtn}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewMoreText}>
              {isExpanded
                ? language === 'ENG' ? 'View less' : 'कम देखें'
                : language === 'ENG' ? 'View more' : 'और देखें'}
            </Text>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Tab 2: Judging Parameters */}
      {activeTab === 'PARAMETERS' && (
        <View style={styles.contentContainer}>
          {tabsData?.judgingParameters?.map((param, index) => (
            <View key={index} style={styles.paramItem}>
              <View style={styles.paramHeader}>
                <Text style={styles.paramTitle}>{param.title}</Text>
                <View style={styles.weightBadge}>
                  <Text style={styles.weightBadgeText}>{param.weight}</Text>
                </View>
              </View>
              {param.description ? (
                <Text style={styles.paramDesc}>{param.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* Tab 3: Rules & Eligibility */}
      {activeTab === 'RULES' && (
        <View style={styles.contentContainer}>
          {tabsData?.rulesAndEligibility?.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 18,
    position: 'relative',
  },
  activeTabButton: {
    borderBottomWidth: 2.5,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '800',
  },
  contentContainer: {
    paddingTop: 14,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 4,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  paramItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  weightBadge: {
    backgroundColor: '#E6F6F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weightBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  paramDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  ruleText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    flex: 1,
  },
});

export default CompetitionTabs;
