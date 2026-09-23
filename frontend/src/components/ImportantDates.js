import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

function fmt(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

const DATE_ITEMS = [
  { key: 'registrationCloseDate', icon: '📅', label: 'Register Before' },
  { key: 'submissionStartDate',   icon: '📤', label: 'Submission Starts' },
  { key: 'submissionEndDate',     icon: '⬆️', label: 'Submission Ends' },
  { key: 'resultDate',            icon: '🏆', label: 'Result Date' },
];

export default function ImportantDates({ competition }) {
  return (
    <View>
      <Text style={styles.heading}>Important Dates</Text>
      <View style={styles.grid}>
        {DATE_ITEMS.map(({ key, icon, label }) => (
          <View key={key} style={styles.cell}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.date}>{fmt(competition[key])}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell:    { width: '48%', backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, marginBottom: 8 },
  icon:    { fontSize: 20, marginBottom: 4 },
  label:   { fontSize: 11, color: COLORS.muted },
  date:    { fontSize: 13, fontWeight: '600', color: COLORS.text, marginTop: 2 },
});