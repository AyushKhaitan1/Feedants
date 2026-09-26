import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import MainCompetitionCard from '../components/MainCompetitionCard';
import JudgeCard from '../components/JudgeCard';
import CountdownBanner from '../components/CountdownBanner';
import ImportantDatesGrid from '../components/ImportantDatesGrid';
import PreviousWinners from '../components/PreviousWinners';
import CompetitionTabs from '../components/CompetitionTabs';
import RewardsSection from '../components/RewardsSection';
import TrustSection from '../components/TrustSection';
import ReferEarnBanner from '../components/ReferEarnBanner';
import TestimonialBanner from '../components/TestimonialBanner';
import AdBanner from '../components/AdBanner';
import BottomCTA from '../components/BottomCTA';
import BottomNavBar from '../components/BottomNavBar';
import PaymentModal from '../components/PaymentModal';
import SubmissionModal from '../components/SubmissionModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import DemoControlSheet from '../components/DemoControlSheet';
import PolicyModal from '../components/PolicyModal';
import colors from '../theme/colors';

export const CompetitionDetailScreen = () => {
  const { loading, refreshing, refreshCompetition, toastMessage, error } = useApp();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Competition Details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Could not connect to backend server.</Text>
        <Text style={styles.errorSubtext}>Ensure the Node.js API is running on port 5000.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenWrapper}>
        <View style={styles.phoneFrame}>
          {/* Header & Status Bar */}
          <Header />

          {/* Scrollable Content Body */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => refreshCompetition()}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {/* 1. Main Competition Title, Metrics & Badges */}
            <MainCompetitionCard />

            {/* 2. Judge Card */}
            <JudgeCard />

            {/* 3. Live Countdown Banner */}
            <CountdownBanner />

            {/* 4. Important Dates (2x2 Grid) */}
            <ImportantDatesGrid />

            {/* 5. Previous Winners Horizontal Carousel */}
            <PreviousWinners />

            {/* 6. Tabs: About / Judging Parameters / Rules */}
            <CompetitionTabs />

            {/* 7. Rewards (All Positions) & Disclaimer */}
            <RewardsSection />

            {/* 8. Trust & Assurance (Prize Video & Razorpay) */}
            <TrustSection />

            {/* 9. Refer & Earn More Discount */}
            <ReferEarnBanner />

            {/* 10. User Testimonial Link */}
            <TestimonialBanner />

            {/* 11. Ad Placeholder */}
            <AdBanner />

            {/* Bottom Spacing */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Sticky Bottom Call-to-Action Bar */}
          <BottomCTA />

          {/* Sticky Bottom Navigation Bar */}
          <BottomNavBar />

          {/* Toast Notification Alert */}
          {toastMessage && (
            <View style={styles.toastContainer}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          )}

          {/* Interactive Flow Modals */}
          <PaymentModal />
          <SubmissionModal />
          <VideoPlayerModal />
          <DemoControlSheet />
          <PolicyModal />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        overflow: 'hidden',
      },
    }),
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default CompetitionDetailScreen;
