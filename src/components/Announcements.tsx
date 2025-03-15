import {View, Text, Pressable, StyleSheet, Linking, Alert} from 'react-native';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  fetchAnnouncements,
  selectAnnouncements,
  selectDismissedIds,
  dismissAnnouncement,
} from '../features/announcements';

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
        {backgroundColor: backgroundColor || '#ffbb88'},
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
        <Pressable onPress={() => {}}>
          <Text style={styles.dismiss} onPress={() => dismiss(id)}>
            Dismiss
          </Text>
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
        if (dismissedIds.includes(announcement.id)) return null;
        return <Announcement key={i} {...announcement} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  lhs: {
    flex: 0,
    width: 50,
    alignContent: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    fontSize: 20,
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 2,
  },
  content: {flex: 1},
  rhs: {flex: 0, width: 60, justifyContent: 'center', marginLeft: 10},
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    marginTop: 5,
  },
  url: {
    color: 'blue',
    marginTop: 5,
    fontSize: 16,
  },
  dismiss: {
    color: '#cc6600',
  },
});
