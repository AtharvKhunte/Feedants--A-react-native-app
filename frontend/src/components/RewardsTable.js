import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RewardsTable({ rewards }) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Rewards</Text>
        <Text style={styles.sub}>(All Positions)</Text>
      </View>
      {rewards.map((r) => (
        <View key={r.position} style={styles.row}>
          <Text style={styles.icon}>{ICONS[r.position] || '☆'}</Text>
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.amount}>₹ {r.amount}</Text>
        </View>
      ))}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ℹ️  Disclaimer: Only contributions from paid participants will be considered for judging.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:    { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.sm },
  heading:   { fontSize: 15, fontWeight: '700', color: COLORS.text },
  sub:       { fontSize: 12, color: COLORS.muted, marginLeft: 8 },
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon:      { fontSize: 20, width: 32 },
  label:     { flex: 1, fontSize: 14, color: COLORS.text },
  amount:    { fontSize: 14, fontWeight: '700', color: COLORS.text },
  disclaimer:{ backgroundColor: '#F0FDFB', borderRadius: 8, padding: SPACING.md, marginTop: SPACING.sm },
  disclaimerText: { fontSize: 12, color: COLORS.muted },
});