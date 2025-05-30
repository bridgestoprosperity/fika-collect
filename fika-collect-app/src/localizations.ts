type Locale = string;

interface Localization {
  [key: Locale]: string;
}


const localizations: Record<Locale, Localization> = {
  error: {
    'en': 'Error',
    'rw': 'Ikosa',
    'sw': 'Kosa',
    'am': 'ስህተት',
    'om': 'Dogoggora',
    'ti': 'ሓደሽቲ ግድፍ',
    'so': 'Khalad',
    'aa': 'Cubbuu',
    'fr': 'Erreur',
  },
  surveysScreenTitle: {
    'en': 'Surveys',
    'rw': 'Amakuru',
    'sw': 'Utafiti',
    'am': 'ጥናቶች',
    'om': 'Qorannoo',
    'ti': 'ምርመራ',
    'so': 'Sahan',
    'aa': 'Qoranno',
    'fr': 'Enquêtes',
  },
  myResponsesScreenTitle: {
    'en': 'My Responses',
    'rw': 'Ibisubizo byanjye',
    'sw': 'Majibu Yangu',
    'am': 'የእኔ መልስ',
    'om': 'Deebii Kootii',
    'ti': 'እተሓዊ መልስ',
    'so': 'Jawaabtayda',
    'aa': 'Deebii Koo',
    'fr': 'Mes Réponses',
  },
  settingsScreenTitle: {
    'en': 'Settings',
    'rw': 'Ibyerekeye',
    'sw': 'Mipangilio',
    'am': 'ቅንብሮች',
    'om': 'Qindaa\'ina',
    'ti': 'ቅንብሮች',
    'so': 'Dejinta',
    'aa': 'Qindaa\'ina',
    'fr': 'Paramètres',
  },
  preferredLanguage: {
    'en': 'Preferred Language',
    'rw': 'Ururimi rukunda',
    'sw': 'Lugha Inayopendwa',
    'am': 'የተመረጠ ቋንቋ',
    'om': 'Af filatame',
    'ti': 'ብዝሒ ዝምረጽ ቋንቋ',
    'so': 'Luuqada la doorbiday',
    'aa': 'Af filatame',
    'fr': 'Langue Préférée',
  },
  backButton: {
    'en': 'Back',
    'rw': 'Inyuma',
    'sw': 'Nyuma',
    'am': 'ተመለስ',
    'om': 'Deebi\'i',
    'ti': 'ኣይነት',
    'so': 'Gurmad',
    'aa': 'Duuba',
    'fr': 'Retour',
  },
  nextButton: {
    'en': 'Next',
    'rw': 'Hakurikiraho',
    'sw': 'Ifuatayo',
    'am': 'ቀጣይ',
    'om': 'Itti Aanu',
    'ti': 'ኣብ ዝኾነ',
    'so': 'Xiga',
    'aa': 'Itti aanu',
    'fr': 'Suivant',
  },
  previousButton: {
    'en': 'Previous',
    'fr': 'Précédent',
    'rw': 'Icyakera',
    'sw': 'Iliyopita',
    'am': 'ያለፈ',
    'om': 'Dura',
    'ti': 'ዝኾነ ዝርከብ',
    'so': 'Hore',
    'aa': 'Kan duraa',
  },
  submitButton: {
    'en': 'Submit',
    'rw': 'Ohereza',
    'sw': 'Tuma',
    'am': 'ላክ',
    'om': 'Ergaa',
    'ti': 'ላክ',
    'so': 'Dir',
    'fr': 'Soumettre',
    'aa': 'Galchi',
  },
  cancelButton: {
    'en': 'Cancel',
    'rw': 'Siba',
    'sw': 'Ghairi',
    'am': 'ሰርዝ',
    'om': 'Haqi',
    'ti': 'ሰርዝ',
    'so': 'Jooji',
    'fr': 'Annuler',
    'aa': 'Haquu',
  },
  noCameraAvailable: {
    'en': 'No camera available',
    'rw': 'Nta kamera iboneka',
    'sw': 'Hakuna kamera inayopatikana',
    'am': 'ካሜራ የለም',
    'om': 'Kaamera hin jiru',
    'ti': 'ካሜራ የለን',
    'so': 'Ma jiro kamarad la heli karo',
    'fr': 'Aucune caméra disponible',
    'aa': 'Kaameeraa hin jiru',
  },
  selectPhotoFromLibrary: {
    'en': 'Select photo from library',
    'rw': 'Hitamo ifoto muri bibliotheque',
    'sw': 'Chagua picha kutoka kwenye maktaba',
    'am': 'ከላይብረሪ ፎቶ ይምረጡ',
    'om': 'Suuraa kutaa maktabaa filadhu',
    'ti': 'ካልይብረሪ ፎቶ ይምረጡ',
    'so': 'Sawir ka xulo maktabadda',
    'fr': 'Sélectionner une photo depuis la bibliothèque',
    'aa': 'Suuraa galmee keessaa filadhu',
  },
  cameraPermissionRequired: {
    'en': 'Camera permission is required to take a photo',
    'rw': 'Ubusabe bwa kamera burakenewe kugirango ufate ifoto',
    'sw': 'Ruhusa ya kamera inahitajika ili kuchukua picha',
    'am': 'ፎቶ ለመነበብ የካሜራ ፈቃድ ይፈልጋል',
    'om': 'Suuraa fudhachuuf hayyama kaameraa barbaachisa',
    'ti': 'ካሜራ ፈቃድ እንደ ፎቶ ማነበብ ይፈልጋል',
    'so': 'Sawir qaadista waa in la helo ogolaansho kaamerada',
    'fr': 'L\'autorisation de la caméra est requise pour prendre une photo',
    'aa': 'Hayyama kaameeraa suuraa fudhachuuf barbaachisa',
  },
  booleanQuestionYes: {
    'en': 'Yes',
    'rw': 'Yego',
    'sw': 'Ndio',
    'am': 'አዎ',
    'om': 'Eeyyee',
    'ti': 'እወ',
    'so': 'Haa',
    'fr': 'Oui',
    'aa': 'Eeyyee',
  },
  booleanQuestionNo: {
    'en': 'No',
    'rw': 'Oya',
    'sw': 'Hapana',
    'am': 'አይ',
    'om': 'Lakki',
    'ti': 'ኣይ',
    'so': 'Maya',
    'fr': 'Non',
    'aa': 'Lakkii',
  },
  discardResponseTitle: {
    'en': 'Discard Response',
    'rw': 'Siba Igisubizo',
    'sw': 'Tupa Jibu',
    'am': 'ይቅርታ መልስ',
    'om': 'Deebii Haqi',
    'ti': 'ሰርዝ መልስ',
    'so': 'Jooji Jawaabta',
    'fr': 'Ignorer la réponse',
    'aa': 'Deebii dhiisi',
  },
  discardResponseMessage: {
    'en': 'Are you sure you want to discard this response?',
    'rw': 'Ese wemeza ko ushaka gusiba iki gisubizo?',
    'sw': 'Je, una uhakika kwamba unataka kutupa jibu hili?',
    'am': 'ይቅርታ መልስ ለመሰረዝ ይረጋገጡ?',
    'om': 'Deebii kana haqachuuf mirkaneeffatta?',
    'ti': 'ሰርዝ መልስ እንደ ምን ይረጋገጡ?',
    'so': 'Ma hubtaa inaad tirtirto jawaabtaan?',
    'fr': 'Êtes-vous sûr de vouloir ignorer cette réponse?',
    'aa': 'Deebii kana dhiisuuf mirkaneeffataa?',
  },
  discardButton: {
    'en': 'Discard',
    'rw': 'Siba',
    'sw': 'Tupa',
    'am': 'ይቅርታ',
    'om': 'Haqi',
    'ti': 'ሰርዝ',
    'so': 'Tirtir',
    'fr': 'Ignorer',
    'aa': 'Dhiisi',
  },
  gelocationRequesting: {
    'en': 'Requesting location...',
    'rw': 'Gusaba aho uri...',
    'sw': 'Inahitaji eneo...',
    'am': 'አካባቢ ማግኘት በሚገኝ ላይ ነው...',
    'om': 'Iddoo gaafachuuf...',
    'ti': 'ኣብ ዝኾነ ምርመራ ላይ ነው...',
    'so': 'Goobta la raadinayo...',
    'fr': 'Recherche de la localisation...',
    'aa': 'Iddoo gaafachaa jirra...',
  },
  geolocationDenied: {
    'en': 'Location permission denied',
    'rw': 'Ubusabe bwo kubona aho uri bwanzwe',
    'sw': 'Ruhusa ya eneo imekataliwa',
    'am': 'የአካባቢ ፈቃድ ተปርስ',
    'om': 'Hayyama iddoo hin hayyamamne',
    'ti': 'ኣብ ዝኾነ ምርመራ ፈቃድ ተገደደ',
    'so': 'Oggolaanshaha goobta waa la diiday',
    'fr': 'Autorisation de localisation refusée',
    'aa': 'Hayyama iddoo dhoorkame',
  },
  geolocationPleaseEnable: {
    'en': 'Please enable location services in your device settings',
    'rw': 'Nyamuneka shyira mu bikorwa serivisi z\'aho uri mu mabwiriza y\'igikoresho cyawe',
    'sw': 'Tafadhali wezesha huduma za eneo katika mipangilio ya kifaa chako',
    'am': 'እባክዎ በመሣሪያዎ ቅንብሮች ውስጥ የአካባቢ አገልግሎቶችን አስተካክሉ',
    'om': 'Maaloo, meeshaa iddoo meeshaa kee keessatti banuu',
    'ti': 'እባክዎ በመሣሪያዎ ቅንብሮች ውስጥ የአካባቢ አገልግሎቶችን አስተካክሉ',
    'so': 'Fadlan adeegyada goobta ku hawl geli dejimaha qalabkaaga',
    'fr': 'Veuillez activer les services de localisation dans les paramètres de votre appareil',
    'aa': 'Tajaajila iddoo settings keessa banuu',
  },
  geolocationUnable: {
    'en': 'Unable to get location',
    'rw': 'Ntabwo bishoboka kubona aho uri',
    'sw': 'Haiwezi kupata eneo',
    'am': 'አካባቢ ማግኘት አልቻለም',
    'om': 'Iddoo argachuu hin dandeenye',
    'ti': 'ኣብ ዝኾነ ምርመራ ኣካባቢ ማግኘት አልቻለም',
    'so': 'Goobta lama helin',
    'fr': 'Impossible d\'obtenir la localisation',
    'aa': 'Iddoo argachuu hin dandeenye',
  },
  geolocationGetLocationButton: {
    'en': 'Get Location',
    'rw': 'Fata Aho Uri',
    'sw': 'Pata Eneo',
    'am': 'አካባቢ ያግኙ',
    'om': 'Iddoo argadhu',
    'ti': 'ኣካባቢ ይገናኙ',
    'so': 'Hel Goobta',
    'fr': 'Obtenir la localisation',
    'aa': 'Iddoo argadhu',
  },
  loadingLocations: {
    'en': 'Loading locations...',
    'rw': 'Gukora aho uri...',
    'sw': 'Inapakia maeneo...',
    'am': 'አካባቢዎች በማስገባት ላይ ነው...',
    'om': 'Iddoo fe\'uuf hojjachaa jira',
    'ti': 'ኣብ ዝኾነ ምርመራ ኣካባቢዎች ማስገባት ላይ ነው...',
    'so': 'Goobaha la rarayo...',
    'fr': 'Chargement des localisations...',
    'aa': 'Iddoowwan fe\'amaa jiru...',
  },
  errorLoadingLocations: {
    'en': 'Error loading locations',
    'rw': 'Ikosa mu gukurura aho uri',
    'sw': 'Kosa katika kupakia maeneo',
    'am': 'አካባቢዎች ማስገባት ላይ ስህተት',
    'om': 'Iddoo fe\'uuf hojjachuu irratti dogoggora',
    'ti': 'ኣብ ዝኾነ ምርመራ ኣካባቢዎች ማስገባት ላይ ስህተት',
    'so': 'Khalad ku jira raritaanka goobaha',
    'fr': 'Erreur lors du chargement des localisations',
    'aa': 'Dogoggora iddoowwan fe\'uuf',
  },
};

export type { Localization };
export { localizations };
