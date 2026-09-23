import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const POSITION_LABELS = { 1: '1st Winner', 2: '2nd Winner', 3: '3rd Winner' };

export default function PreviousWinners({ winners }) {
  if (!winners || winners.length === 0) return null;
  return (
    <View>
      <Text style={styles.heading}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {winners.map((w, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <Image source={{ uri: w.photoUrl }} style={styles.photo} />
            <View style={styles.playBtn}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <Text style={styles.name}>{w.name}</Text>
            <Text style={styles.pos}>{POSITION_LABELS[w.position] || `${w.position}th Winner`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading:  { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  card:     { width: 100, marginRight: SPACING.sm, alignItems: 'center' },
  photo:    { width: 90, height: 90, borderRadius: 8, backgroundColor: '#ccc' },
  playBtn:  {
    position: 'absolute', top: 28, left: 28, width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 14 },
  name:     { fontSize: 12, fontWeight: '600', color: COLORS.text, marginTop: 5, textAlign: 'center' },
  pos:      { fontSize: 10, color: COLORS.muted, textAlign: 'center' },
});