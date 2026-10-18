import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { strings } from '@/i18n/strings';

export default function ChatScreen() {
  const { contactId } = useLocalSearchParams<{ contactId: string }>();

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: strings.chat.title }} />
      <ThemedText type="small">{strings.chat.empty}</ThemedText>
      <ThemedText type="code">{contactId}</ThemedText>
    </ThemedView>
  );
}
