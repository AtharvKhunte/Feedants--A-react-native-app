import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Clipboard, StyleSheet, Alert } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { getReferralLink } from '../services/api';

export default function ReferralSection({ competitionId }) {
  const [link, setLink] = useState('');

  useEffect(() => {
    getReferralLink(competitionId)
      .then(r => setLink(r.data.data.link))
      .catch(() => {});
  }, [competitionId]);

  const copyLink = () => {
    Clipboard.setString(link);
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={{ fontSize: 24 }}>📢</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Refer & Earn more discount</Text>
        <View style={styles.linkRow}>
          <TextInput style={styles.linkInput} value={link} editable={false} />
          <TouchableOpacity style={styles.copyBtn} onPress={copyLink}>
            <Text style={styles.copyText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.earnBox}>
        <Text style={styles.earnText}>You earn ₹10 for every signup</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F9F7', borderRadius: 12, padding: SPACING.md,
    flexDirection: 'column', gap: 8,
  },
  iconWrap:  { marginBottom: 4 },
  body:      {},
  title:     { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  linkRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkInput: {
    flex: 1, backgroundColor: '#fff', borderRadius: 6, padding: 8,
    fontSize: 11, color: COLORS.muted, borderWidth: 1, borderColor: COLORS.border,
  },
  copyBtn:   { backgroundColor: COLORS.teal, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
  copyText:  { color: '#fff', fontSize: 12, fontWeight: '600' },
  earnBox:   { marginTop: 4 },
  earnText:  { fontSize: 12, color: COLORS.tealDark, fontWeight: '600' },
  });