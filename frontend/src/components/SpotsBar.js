import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function SpotsBar({ booked, total }) {
  const pct = Math.min((booked / total) * 100, 100);
  const left = total - booked;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {left > 0 ? `Only ${left} spots left` : 'All spots booked'}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.sub}>{booked} / {total} Booked</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: SPACING.xs },
  label:     { fontSize: 12, fontWeight: '600', color: COLORS.teal, marginBottom: 4 },
  track:     { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  fill:      { height: '100%', backgroundColor: COLORS.teal, borderRadius: 3 },
  sub:       { fontSize: 11, color: COLORS.muted, marginTop: 3 },
});