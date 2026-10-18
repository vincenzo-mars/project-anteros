// Italian UI strings, isolated for future i18n expansion.
export const strings = {
  tabs: {
    myFiles: 'I miei file',
    shared: 'Condivisi con me',
  },
  chat: {
    title: 'Chat',
    empty: 'Nessun messaggio',
  },
  emptyState: {
    homeNoContacts: 'Aggiungi un contatto per iniziare',
    vaultEmpty: 'Importa un file per iniziare',
    firstStep: 'Il primo passo è accoppiare un dispositivo',
  },
  common: {
    comingSoon: 'In arrivo',
  },
} as const;

export type Strings = typeof strings;