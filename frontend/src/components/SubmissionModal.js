import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export const SubmissionModal = () => {
  const {
    isSubmissionModalVisible,
    setIsSubmissionModalVisible,
    competition,
    currentUser,
    refreshCompetition,
    showToast,
    language,
  } = useApp();

  const [title, setTitle] = useState('');
  const [danceForm, setDanceForm] = useState('Kathak');
  const [mediaUrl, setMediaUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSubmissionModalVisible) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast('Please enter your performance title');
      return;
    }
    if (!mediaUrl.trim()) {
      showToast('Please provide a video URL or Drive link');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitPerformance(competition._id, currentUser._id, {
        title,
        danceForm,
        mediaUrl,
        notes,
      });

      await refreshCompetition(currentUser._id);
      setIsSubmissionModalVisible(false);
      showToast(
        language === 'ENG'
          ? '🎉 Submission uploaded successfully!'
          : '🎉 प्रविष्टि सफलतापूर्वक अपलोड हो गई!'
      );
    } catch (err) {
      console.error('Submission failed:', err);
      showToast(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const danceForms = ['Kathak', 'Bharatanatyam', 'Odissi', 'Kuchipudi', 'Mohiniyattam'];

  return (
    <Modal
      visible={isSubmissionModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsSubmissionModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.modalTitle}>
                {language === 'ENG' ? 'Upload Performance Entry' : 'अपनी प्रस्तुति अपलोड करें'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {competition?.title} • {currentUser?.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsSubmissionModalVisible(false)}
              style={styles.closeBtn}
            >
              <Feather name="x" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Input: Title */}
            <Text style={styles.inputLabel}>Performance Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kathak Tarana in Teentaal"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            {/* Select Dance Form */}
            <Text style={styles.inputLabel}>Classical Dance Style</Text>
            <View style={styles.chipsRow}>
              {danceForms.map((form) => (
                <TouchableOpacity
                  key={form}
                  style={[styles.styleChip, danceForm === form && styles.styleChipActive]}
                  onPress={() => setDanceForm(form)}
                >
                  <Text
                    style={[
                      styles.styleChipText,
                      danceForm === form && styles.styleChipTextActive,
                    ]}
                  >
                    {form}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Input: Video / Drive Link */}
            <Text style={styles.inputLabel}>Video URL / Google Drive Link *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="link-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.inputField}
                placeholder="https://..."
                placeholderTextColor="#94A3B8"
                value={mediaUrl}
                onChangeText={setMediaUrl}
                autoCapitalize="none"
              />
            </View>

            {/* Input: Notes */}
            <Text style={styles.inputLabel}>Choreographer / Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mention guru name, raga, or specific taal details..."
              placeholderTextColor="#94A3B8"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            {/* Guidelines Notice */}
            <View style={styles.infoNotice}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.noticeText}>
                Video length must be between 2 and 5 minutes. Evaluation results will be published on{' '}
                {competition?.dates?.resultDate?.dateStr || '1 Sept 26'}.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Entry For Evaluation</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  styleChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  styleChipActive: {
    backgroundColor: colors.primaryDark,
  },
  styleChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  styleChipTextActive: {
    color: '#FFFFFF',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: '#E6F6F7',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
    gap: 8,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 11,
    color: '#1E293B',
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SubmissionModal;
