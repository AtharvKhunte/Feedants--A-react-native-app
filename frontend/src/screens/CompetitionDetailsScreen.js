import React from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, SafeAreaView,
} from 'react-native';
import { COLORS, SPACING} from '../constants/theme';
import useCompetition from '../hooks/useCompetition';
import CountdownTimer from '../components/CountdownTimer';
import SpotsBar from '../components/SpotsBar';
import ImportantDates from '../components/ImportantDates';
import PreviousWinners from '../components/PreviousWinners';
import TabSection from '../components/TabSection';
import RewardsTable from '../components/RewardsTable';
import ReferralSection from '../components/ReferralSection';

// ⚠️  Replace COMPETITION_ID with the actual seeded MongoDB _id
const COMPETITION_ID = '6ab27635bb1e22d3abb935ac';

export default function CompetitionDetailsScreen({ navigation }) {
  const { data, loading, error, handleRegister, handleSubmit } = useCompetition(COMPETITION_ID);

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={COLORS.teal} /></View>
  );

  if (error) return (
  <View style={styles.center}>
    <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
    <TouchableOpacity onPress={refresh} style={{ backgroundColor: '#00A99D', padding: 12, borderRadius: 8 }}>
      <Text style={{ color: '#fff' }}>Retry</Text>
    </TouchableOpacity>
  </View>
);

  const { competition, userState, isRegistered, spotsLeft } = data;

  const onCTAPress = async () => {
    if (userState.stateLabel === 'can_register') {
      try {
        // In production: open Razorpay payment sheet here, then pass paymentId
        await handleRegister('SIMULATED_PAYMENT_' + Date.now());
        Alert.alert('Success', 'Registered successfully!');
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.message || 'Registration failed');
      }
    } else if (userState.stateLabel === 'can_submit') {
      // In production: open file/video picker, upload to S3/Cloudinary, pass URL
      const mockUrl = 'https://example.com/my-submission.mp4';
      try {
        await handleSubmit(mockUrl);
        Alert.alert('Success', 'Submission uploaded!');
      } catch (e) {
        Alert.alert('Error', e?.response?.data?.message || 'Submission failed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Go back</Text>
        </TouchableOpacity>
        <View style={styles.langToggle}>
          <Text style={styles.langActive}>ENG</Text>
          <Text style={styles.langInactive}>हिंदी</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Competition Card */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{competition.title}</Text>
            {isRegistered && (
              <View style={styles.registeredBadge}>
                <Text style={styles.registeredText}>✓ Registered</Text>
              </View>
            )}
          </View>
          <View style={styles.tagRow}>
            {competition.tags.map(t => (
              <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
            ))}
            {competition.winnersGetCertificate && (
              <Text style={styles.cert}>🏆 Winners get certificate</Text>
            )}
          </View>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Prize Pool</Text>
              <Text style={styles.priceValue}>₹ {competition.prizePool.toLocaleString('en-IN')}</Text>
            </View>
            <View>
              <Text style={styles.priceLabel}>Entry Fee</Text>
              <Text style={styles.priceValue}>₹ {competition.entryFee}</Text>
            </View>
            <SpotsBar booked={competition.bookedSpots} total={competition.totalSpots} />
          </View>
        </View>

        {/* Judge */}
        <View style={styles.card}>
          <View style={styles.judgeRow}>
            <Image source={{ uri: competition.judge?.photoUrl }} style={styles.judgePhoto} />
            <View style={styles.judgeInfo}>
              <Text style={styles.judgeRole}>Judge</Text>
              <Text style={styles.judgeName}>{competition.judge?.name}</Text>
              <Text style={styles.judgeCredentials}>{competition.judge?.credentials}</Text>
              <Text style={styles.judgeExp}>{competition.judge?.experience}</Text>
            </View>
            <TouchableOpacity style={styles.videoBtn}>
              <Text style={styles.videoIcon}>▶</Text>
              <Text style={styles.videoLabel}>Intro Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Countdown */}
        <CountdownTimer targetDate={competition.registrationCloseDate} />

        {/* Important Dates */}
        <ImportantDates competition={competition} />

        {/* Previous Winners */}
        <PreviousWinners winners={competition.winners} />

        {/* Tabs */}
        <TabSection competition={competition} />

        {/* Rewards */}
        <RewardsTable rewards={competition.rewards} />

        {/* Referral */}
        <ReferralSection competitionId={COMPETITION_ID} />

        {/* Bottom padding for sticky CTA */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <TouchableOpacity
        style={[styles.cta, !userState.ctaEnabled && styles.ctaDisabled]}
        onPress={onCTAPress}
        disabled={!userState.ctaEnabled}
      >
        <Text style={styles.ctaText}>{userState.cta}</Text>
        {isRegistered && <Text style={styles.ctaSub}>Registered</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.bg },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  backBtn:    {},
  backText:   { fontSize: 16, color: COLORS.text, fontWeight: '500' },
  langToggle: { flexDirection: 'row', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.teal },
  langActive: { backgroundColor: COLORS.teal, color: '#fff', paddingHorizontal: 12, paddingVertical: 5, fontSize: 13, fontWeight: '600' },
  langInactive:{ color: COLORS.teal, paddingHorizontal: 12, paddingVertical: 5, fontSize: 13 },
  scroll:     { flex: 1 },
  scrollContent: { padding: SPACING.lg },
  card:       { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  titleRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  title:      { fontSize: 20, fontWeight: '700', color: COLORS.text, flex: 1 },
  registeredBadge: { backgroundColor: '#E6F9F7', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.teal },
  registeredText: { color: COLORS.teal, fontSize: 12, fontWeight: '600' },
  tagRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  tag:        { backgroundColor: COLORS.surface, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:    { fontSize: 12, color: COLORS.text },
  cert:       { fontSize: 12, color: COLORS.teal, fontWeight: '600' },
  priceRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' },
  priceLabel: { fontSize: 11, color: COLORS.muted, marginBottom: 2 },
  priceValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  judgeRow:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  judgePhoto: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ccc' },
  judgeInfo:  { flex: 1 },
  judgeRole:  { fontSize: 11, color: COLORS.muted },
  judgeName:  { fontSize: 16, fontWeight: '700', color: COLORS.text },
  judgeCredentials: { fontSize: 12, color: COLORS.muted },
  judgeExp:   { fontSize: 12, color: COLORS.muted },
  videoBtn:   { alignItems: 'center' },
  videoIcon:  { fontSize: 24, color: COLORS.teal },
  videoLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  cta:        { backgroundColor: COLORS.teal, padding: SPACING.lg, alignItems: 'center', margin: SPACING.md, borderRadius: 12 },
  ctaDisabled:{ backgroundColor: COLORS.muted },
  ctaText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  ctaSub:     { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
});