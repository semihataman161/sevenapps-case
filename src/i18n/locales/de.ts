import type { Translation } from './en';

const de: Translation = {
  common: {
    back: 'Zurück',
    cancel: 'Abbrechen',
    close: 'Schließen',
    delete: 'Löschen',
    next: 'Weiter',
    tryAgain: 'Erneut versuchen',
  },
  nav: {
    diary: 'Video-Tagebuch',
    diaryBack: 'Tagebuch',
    editDetails: 'Details bearbeiten',
    settings: 'Einstellungen',
    newClip: 'Neuer Clip',
    chooseSeconds: '{{seconds}} Sekunden wählen',
    addDetails: 'Details hinzufügen',
  },
  list: {
    emptyTitle: 'Noch keine Clips',
    emptyMessage:
      'Importiere ein Video, wähle deine liebsten {{seconds}} Sekunden und bewahre sie hier mit einer Notiz auf.',
    emptyAction: 'Ersten Clip zuschneiden',
    newClip: 'Neuer Clip',
    errorTitle: 'Tagebuch konnte nicht geladen werden',
    errorMessage: 'Beim Lesen deiner gespeicherten Clips ist etwas schiefgelaufen.',
    openClip: '{{name}} öffnen',
  },
  video: {
    notFoundTitle: 'Clip nicht gefunden',
    notFoundMessage: 'Er wurde möglicherweise gelöscht.',
    backToDiary: 'Zurück zum Tagebuch',
    clipLength: '{{duration}} Clip',
    noDescription: 'Noch keine Beschreibung – tippe, um eine hinzuzufügen.',
    edit: 'Details bearbeiten',
    delete: 'Clip löschen',
    deleteTitle: 'Clip löschen?',
    deleteMessage: '„{{name}}“ wird aus deinem Tagebuch entfernt.',
    deleteFailed: 'Clip konnte nicht gelöscht werden',
  },
  crop: {
    steps: { select: 'Auswählen', trim: 'Zuschneiden', details: 'Details' },
    stepLabel: 'Schritt {{current}} von {{total}} · {{label}}',
    pickTitle: 'Video auswählen',
    pickMessage:
      'Wähle ein beliebiges Video aus deiner Mediathek. Danach legst du die {{seconds}} Sekunden fest, die du behalten möchtest.',
    chooseFromLibrary: 'Aus Mediathek wählen',
    tooShort: 'Dieses Video ist zu kurz. Wähle eines mit mindestens {{seconds}} Sekunde Länge.',
    libraryError: 'Deine Videomediathek konnte nicht geöffnet werden.',
    playbackError: 'Dieses Video kann nicht abgespielt werden. Geh zurück und wähle ein anderes.',
    play: 'Abspielen',
    pause: 'Pausieren',
    start: 'Start',
    end: 'Ende',
    selected: '{{duration}} ausgewählt',
    dragHint:
      'Ziehe den Rahmen oder tippe auf den Streifen, um deinen {{seconds}}-Sekunden-Moment zu wählen',
    shortHint:
      'Dieses Video ist kürzer als {{seconds}} Sekunden, daher wird es vollständig behalten',
    segmentSelector: 'Abschnittsauswahl',
    segmentRange: '{{start}} bis {{end}}',
    segmentFrom: '{{duration}} aus {{file}}',
    yourVideo: 'deinem Video',
    cropAndSave: 'Zuschneiden & speichern',
    cropping: 'Wird zugeschnitten…',
  },
  form: {
    name: 'Name',
    namePlaceholder: 'z. B. Sonnenuntergang am Steg',
    description: 'Beschreibung',
    descriptionPlaceholder: 'Warum ist dieser Moment es wert, aufbewahrt zu werden?',
    saveChanges: 'Änderungen speichern',
  },
  validation: {
    nameRequired: 'Gib deinem Clip einen Namen',
    nameMin: 'Der Name muss mindestens {{min}} Zeichen lang sein',
    nameMax: 'Der Name darf höchstens {{max}} Zeichen lang sein',
    descriptionMax: 'Die Beschreibung darf höchstens {{max}} Zeichen lang sein',
  },
  errors: {
    segmentOutside:
      'Der gewählte Abschnitt liegt außerhalb des Videos. Geh zurück und passe die Auswahl an.',
    sourceUnreadable: 'Das Originalvideo konnte nicht gelesen werden. Wähle es erneut aus.',
    cropFailed: 'Beim Zuschneiden des Videos ist etwas schiefgelaufen.',
  },
  settings: {
    appearance: 'Darstellung',
    themeSystem: 'System',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    themeSystemHint: 'Folgt der Geräteeinstellung',
    language: 'Sprache',
    languageSystem: 'Gerätesprache',
    languageSystemHint: 'Aktuell {{language}}',
    about: 'Info',
    version: 'Version',
  },
  languages: {
    en: 'Englisch',
    tr: 'Türkisch',
    de: 'Deutsch',
    es: 'Spanisch',
  },
};

export default de;
