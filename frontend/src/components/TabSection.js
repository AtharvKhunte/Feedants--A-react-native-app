import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING} from '../constants/theme';

const TABS = [
  { key: 'about',              label: 'About Competition' },
  { key: 'judgingParameters',  label: 'Judging Parameters' },
  { key: 'rulesAndEligibility',label: 'Rules & Eligibility' },
];

export default function TabSection({ competition }) {
  const [active, setActive] = useState('about');
  const [expanded, setExpanded] = useState(false);
  const content = competition[active] || '';

  return (
    <View>
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} onPress={() => { setActive(t.key); setExpanded(false); }} style={styles.tab}>
            <Text style={[styles.tabLabel, active === t.key && styles.tabActive]}>{t.label}</Text>
            {active === t.key && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.body} numberOfLines={expanded ? undefined : 3}>{content}</Text>
        {content.length > 100 && (
          <TouchableOpacity onPress={() => setExpanded(e => !e)}>
            <Text style={styles.viewMore}>{expanded ? 'View less ▲' : 'View more ▼'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar:    { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab:       { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, position: 'relative' },
  tabLabel:  { fontSize: 12, color: COLORS.muted, textAlign: 'center' },
  tabActive: { color: COLORS.teal, fontWeight: '600' },
  indicator: { position: 'absolute', bottom: -1, left: '10%', right: '10%', height: 2, backgroundColor: COLORS.teal },
  content:   { paddingVertical: SPACING.md },
  body:      { fontSize: 13, color: COLORS.muted, lineHeight: 20 },
  viewMore:  { fontSize: 13, color: COLORS.teal, marginTop: 6, fontWeight: '600' },
});