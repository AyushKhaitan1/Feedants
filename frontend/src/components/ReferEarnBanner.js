import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const ReferEarnBanner = () => {
  const { competition, language, showToast, currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const refSlug = currentUser?.referralCode || competition?.referral?.slug || 'referral123';
  const referralLink = `https://feedants.com/r/${refSlug}`;
  const bonusAmount = competition?.referral?.bonusPerSignup || 10;

  const handleCopyLink = () => {
    // Copy link
    setCopied(true);
    showToast(language === 'ENG' ? 'Referral link copied to clipboard!' : 'रेफरल लिंक कॉपी हो गया!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReferNow = async () => {
    try {
      await Share.share({
        message: `Join me on Feedants Classical Dance Competition and win from ₹1,500 prize pool! Use my link: ${referralLink}`,
      });
    } catch (err) {
      handleCopyLink();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Megaphone icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="megaphone-outline" size={24} color={colors.primary} />
        </View>

        {/* Title and Share Action */}
        <View style={styles.headerTextGroup}>
          <Text style={styles.title}>
            {language === 'ENG' ? 'Refer & Earn more discount' : 'रेफर करें और छूट पाएं'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.referNowBtn}
          onPress={handleReferNow}
          activeOpacity={0.8}
        >
          <Text style={styles.referNowText}>
            {language === 'ENG' ? 'Refer Now' : 'रेफर करें'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Link Input Row & Copy Button */}
      <View style={styles.bottomRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.linkText} numberOfLines={1}>
            {referralLink}
          </Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopyLink}
            activeOpacity={0.7}
          >
            <Text style={styles.copyBtnText}>
              {copied ? 'Copied' : language === 'ENG' ? 'Copy Link' : 'कॉपी करें'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rewardSubtext}>
          {language === 'ENG'
            ? `You earn ₹${bonusAmount} for every signup`
            : `प्रत्येक साइनअप पर आपको ₹${bonusAmount} मिलेंगे`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAF8F5',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#C7EDE2',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    marginRight: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 17,
  },
  referNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  referNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomRow: {
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1EAE2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  rewardSubtext: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
});

export default ReferEarnBanner;
