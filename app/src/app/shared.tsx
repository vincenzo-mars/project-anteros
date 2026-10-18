import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { strings } from '@/i18n/strings';

export default function SharedScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">{strings.tabs.shared}</ThemedText>
      <ThemedText type="small">{strings.emptyState.homeNoContacts}</ThemedText>
    </ThemedView>
  );
}
