import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

function pad(n) { return String(n).padStart(2, '0'); }

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>⏳ Registration closes in</Text>
      <Text style={styles.countdown}>
        {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
      </Text>
      <Text style={styles.hurry}>⏱ Hurry up!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#E6F9F7', borderRadius: 10, padding: SPACING.md, marginVertical: SPACING.sm,
  },
  label:     { fontSize: 12, color: COLORS.muted, flex: 1 },
  countdown: { fontSize: 15, fontWeight: '700', color: COLORS.teal },
  hurry:     { fontSize: 12, color: COLORS.muted, marginLeft: SPACING.sm },
});