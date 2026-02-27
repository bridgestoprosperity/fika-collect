import {View, Text, Pressable, StyleSheet, Linking, Alert} from 'react-native';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  fetchAnnouncements,
  selectAnnouncements,
  selectDismissedIds,
  dismissAnnouncement,
} from '../features/announcements';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../theme';

interface AnnouncementProps {
  id: string;
  title: string;
  body: string;
  emoji?: string;
  backgroundColor?: string;
  url?: string;
  urlText?: string;
}

function Announcement(props: AnnouncementProps) {
  const {title, url, body, id, urlText, backgroundColor, emoji} = props;
  const dispatch = useAppDispatch();

  const dismiss = (id: string) => {
    dispatch(dismissAnnouncement(id));
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColor || colors.warningLight},
      ]}>
      <View style={styles.lhs}>
        <Text style={styles.alertIcon}>{emoji || '⚠️'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        {url && (
          <Pressable
            onPress={() => {
              Linking.openURL(url).catch(err => {
                console.error("Couldn't load page", err);
                Alert.alert('Unable to open URL', err.message);
              });
            }}>
            <Text style={styles.url}>{urlText || 'Learn more →'}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.rhs}>
        <Pressable
          style={({pressed}) => [
            styles.dismissButton,
            pressed && styles.dismissButtonPressed,
          ]}
          onPress={() => dismiss(id)}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function Announcements() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const dismissedIds = useAppSelector(selectDismissedIds);
  const announcements = useAppSelector(selectAnnouncements);

  return (
    <View>
      {announcements.map((announcement, i) => {
        if (dismissedIds.includes(announcement.id)) {return null;}
        return <Announcement key={i} {...announcement} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  lhs: {
    flex: 0,
    width: 44,
    alignContent: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.xs,
  },
  alertIcon: {
    fontSize: fontSize.xl,
  },
  content: {
    flex: 1,
  },
  rhs: {
    flex: 0,
    width: 70,
    justifyContent: 'flex-start',
    marginLeft: spacing.sm,
    paddingTop: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 22,
  },
  url: {
    color: colors.link,
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  dismissButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  dismissButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
  dismissText: {
    color: colors.warning,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
