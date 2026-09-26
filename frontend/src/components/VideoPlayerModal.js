import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';

export const VideoPlayerModal = () => {
  const { activeVideo, setActiveVideo } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(35); // simulated playback progress

  if (!activeVideo) return null;

  return (
    <Modal
      visible={!!activeVideo}
      transparent
      animationType="fade"
      onRequestClose={() => setActiveVideo(null)}
    >
      <View style={styles.overlay}>
        <View style={styles.playerCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.title} numberOfLines={1}>
                {activeVideo.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {activeVideo.subtitle || 'Feedants Official Media'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setActiveVideo(null)} style={styles.closeBtn}>
              <Feather name="x" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Player Frame */}
          <View style={styles.videoFrame}>
            {/* Ambient Background & Media Graphic */}
            <View style={styles.videoStage}>
              <Ionicons name="musical-notes-outline" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={styles.stageText}>Feedants High Definition Player</Text>
              <Text style={styles.streamText}>HLS 1080p • 60 FPS • Stereo Audio</Text>
            </View>

            {/* Center Play/Pause button */}
            <TouchableOpacity
              style={styles.playPauseOverlay}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={34}
                color="#FFFFFF"
                style={{ marginLeft: isPlaying ? 0 : 3 }}
              />
            </TouchableOpacity>

            {/* Video Controls Bar */}
            <View style={styles.controlsBar}>
              <Text style={styles.timeLabel}>01:14</Text>

              {/* Progress Scrub Bar */}
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <Text style={styles.timeLabel}>03:45</Text>
              <Ionicons name="volume-medium-outline" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              <Ionicons name="scan-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </View>
          </View>

          {/* Info Footer */}
          <View style={styles.footer}>
            <View style={styles.badgeRow}>
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={12} color="#10B981" />
                <Text style={styles.badgeText}>Verified Feedants Entry</Text>
              </View>
              <Text style={styles.ratingText}>★ 4.9 Rating</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  playerCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  videoFrame: {
    width: '100%',
    height: 220,
    backgroundColor: '#020617',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoStage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 6,
  },
  streamText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  playPauseOverlay: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 125, 136, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeLabel: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  footer: {
    padding: 12,
    backgroundColor: '#0F172A',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  ratingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
  },
});

export default VideoPlayerModal;
