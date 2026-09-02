import React from 'react';
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/Screen';
import { MOCK_TUTOR_POSTS } from '../../src/constants/mockData';
import { TutorPost } from '../../src/types';
import { formatRelativeTime } from '../../src/utils/date';
import { colors, radius, spacing } from '../../src/constants/theme';

function TutorCard({ post }: { post: TutorPost }) {
  return (
    <Pressable style={styles.card} onPress={() => Linking.openURL(post.videoUrl)}>
      <View style={styles.thumbnail}>
        <Ionicons name="play-circle" size={34} color={colors.textPrimary} />
        <Text style={styles.duration}>{post.durationLabel}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subject}>{post.subject.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.meta}>
          {post.tutorName} · {formatRelativeTime(post.postedAt)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function TutorHubScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.heading}>Tutor Hub</Text>
        <Text style={styles.subheading}>Short lessons from online tutors.</Text>
      </View>
      <FlatList
        data={MOCK_TUTOR_POSTS}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <TutorCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: 84,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  duration: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    color: colors.textSecondary,
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  subject: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
