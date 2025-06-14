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
    'ti': 'ጌጋ',
    'so': 'Khalad',
    'aa': 'Cubbuu',
    'fr': 'Erreur',
  },
  surveysScreenTitle: {
    'en': 'Surveys',
    'rw': 'Ubushakashatsi',
    'sw': 'Utafiti',
    'am': 'ጥናቶች',
    'om': 'Qorannoowwan',
    'ti': 'ምርመራታት',
    'so': 'Sahan',
    'aa': 'Qoranno',
    'fr': 'Enquêtes',
  },
  myResponsesScreenTitle: {
    'en': 'My Responses',
    'rw': 'Ibisubizo byanjye',
    'sw': 'Majibu Yangu',
    'am': 'የእኔ መልስ',
    'om': 'Deebiiwwan Koo',
    'ti': 'ናተይ መልስ',
    'so': 'Jawaabtayda',
    'aa': 'Deebii Koo',
    'fr': 'Mes Réponses',
  },
  settingsScreenTitle: {
    'en': 'Settings',
    'rw': 'Igenamiterere',
    'sw': 'Mipangilio',
    'am': 'ቅንብሮች',
    'om': 'Qindaa\'ina',
    'ti': 'ኩነታት',
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
    'ti': 'ተመለስ',
    'so': 'Gadaal',
    'aa': 'Duuba',
    'fr': 'Retour',
  },
  nextButton: {
    'en': 'Next',
    'rw': 'Ahakurikira',
    'sw': 'Ifuatayo',
    'am': 'ቀጣይ',
    'om': 'Kan Itti Aanu',
    'ti': 'ቀፃሊ',
    'so': 'Midka',
    'aa': 'Itti aanu',
    'fr': 'Suivant',
  },
  previousButton: {
    'en': 'Previous',
    'fr': 'Précédent',
    'rw': 'Ahabanze',
    'sw': 'Iliyopita',
    'am': 'ያለፈ',
    'om': 'Kan kanaan duraa',
    'ti': 'ዝሓለፈ',
    'so': 'Ee hore',
    'aa': 'Kan duraa',
  },
  submitButton: {
    'en': 'Submit',
    'rw': 'Ohereza',
    'sw': 'Tuma',
    'am': 'ላክ',
    'om': 'Ergii',
    'ti': 'ለአኽ',
    'so': 'Dir',
    'fr': 'Soumettre',
    'aa': 'Galchi',
  },
  cancelButton: {
    'en': 'Cancel',
    'rw': 'Siba',
    'sw': 'Ghairi',
    'am': 'ሰርዝ',
    'om': 'Balleessii',
    'ti': 'አጥፍዕ',
    'so': 'Burin',
    'fr': 'Annuler',
    'aa': 'Haquu',
  },
  noCameraAvailable: {
    'en': 'No camera available',
    'rw': 'Nta kamera iboneka',
    'sw': 'Kamera Haipatikani',
    'am': 'ካሜራ የለም',
    'om': 'Kaamera hin jiru',
    'ti': 'ካሜራ የለን',
    'so': 'Ma jiro sawire la heli karo',
    'fr': 'Aucune caméra disponible',
    'aa': 'Kaameeraa hin jiru',
  },
  selectPhotoFromLibrary: {
    'en': 'Select photo from library',
    'rw': 'Hitamo ifoto muri telefone',
    'sw': 'Chagua picha kutoka maktaba',
    'am': 'ከላይብረሪ ፎቶ ይምረጡ',
    'om': 'Suuraa gallery keessaa filadhu',
    'ti': 'ካብ ካልይብረሪ ፎቶ ምረፁ',
    'so': 'Sawir ka xulo maktabadda sawirada',
    'fr': 'Sélectionner une photo depuis la bibliothèque',
    'aa': 'Suuraa galmee keessaa filadhu',
  },
  cameraPermissionRequired: {
    'en': 'Camera permission is required to take a photo',
    'rw': 'Kwemeza kamera birakenewe kugirango ufate ifoto',
    'sw': 'Ruhusa ya kamera inahitajika ili kuchukua picha',
    'am': 'ፎቶ ለማንሳት የካሜራ ፍቃድ ያስፈልጋል',
    'om': 'Suuraa kaasuuf hayyama ni barbaachisa',
    'ti': 'ፎቶ ንምርዓይ ናይ ካሜራ ፍቃድ የድሊ',
    'so': 'Sawir qaadista waa in la helo ogolaansho sawire',
    'fr': 'L\'autorisation de la caméra est requise pour prendre une photo',
    'aa': 'Hayyama kaameeraa suuraa fudhachuuf barbaachisa',
  },
  retakePhotoButton: {
    'en': 'Retake Photo',
    'rw': 'Fata Ifoto Usubiremo',
    'sw': 'Chukua Picha Tena',
    'am': 'ፎቶ ይደግሙ',
    'om': 'Suuraa haaromsaa',
    'ti': 'ፎቶ ይደግሙ',
    'so': 'Sawirka dib u qaado',
    'fr': 'Reprendre la photo',
    'aa': 'Suuraa haaromsaa',
  },
  usePhotoButton: {
    'en': 'Use Photo',
    'rw': 'Koresha Ifoto',
    'sw': 'Tumia Picha',
    'am': 'ፎቶ ይጠቀሙ',
    'om': 'Suuraa fayyadami',
    'ti': 'ፎቶ ይጠቀሙ',
    'so': 'Sawirka isticmaal',
    'fr': 'Utiliser la photo',
    'aa': 'Suuraa fayyadami',
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
    'ti': 'አይኮነን',
    'so': 'Maya',
    'fr': 'Non',
    'aa': 'Lakkii',
  },
  discardResponseTitle: {
    'en': 'Discard Response',
    'rw': 'Siba Igisubizo',
    'sw': 'Tupa Jibu',
    'am': 'ምላሽ አስወግድ',
    'om': 'Deebii Haqi',
    'ti': 'ቅሬታ መልሲ አጥፍዕ',
    'so': 'Tuur Jawaabta',
    'fr': 'Rejeter la réponse',
    'aa': 'Deebii dhiisi',
  },
  discardResponseMessage: {
    'en': 'Are you sure you want to discard this response?',
    'rw': 'Ese nibyo koko urashaka gusiba iki gisubizo?',
    'sw': 'Je, una uhakika kwamba unataka kutupa jibu hili?',
    'am': 'እርግጠኛ ነዎት ይህን ምላሽ መተው ይፈልጋሉ?',
    'om': 'Dhuguma deebii kana haquu barbaaddaa?',
    'ti': 'ይቅሬታ መልሲ ንምጥፋዕ የረጋግፁ',
    'so': 'Ma hubtaa inaad tirtirto jawaabtaan?',
    'fr': 'Êtes-vous sûr de vouloir rejeter cette réponse?',
    'aa': 'Deebii kana dhiisuuf mirkaneeffataa?',
  },
  discardButton: {
    'en': 'Discard',
    'rw': 'Siba',
    'sw': 'Tupa',
    'am': 'አስወግድ',
    'om': 'Haqi',
    'ti': 'ሰርዝ',
    'so': 'Tirtir',
    'fr': 'Rejeter',
    'aa': 'Dhiisi',
  },
  gelocationRequesting: {
    'en': 'Requesting location...',
    'rw': 'Gushakisha ahantu...',
    'sw': 'Inahitaji eneo...',
    'am': 'አካባቢን በመጠየቅ ላይ...',
    'om': 'Iddoo gaafachuuf...',
    'ti': 'ናይ ቦታ መረዳእታ...',
    'so': 'Goobta la raadinayo...',
    'fr': 'Demande de la localisation...',
    'aa': 'Iddoo gaafachaa jirra...',
  },
  geolocationDenied: {
    'en': 'Location permission denied.',
    'rw': 'Ubusabe bwo kubona ahantu bwanzwe',
    'sw': 'Ruhusa ya eneo imekataliwa.',
    'am': 'የአካባቢ ፈቃድ ተከልክሏል.',
    'om': 'Hayyamni iddoo dhorkame.',
    'ti': 'ናይ ቦታ ፈቃድ ዘይቅቡል.',
    'so': 'Oggolaanshaha goobta waa la diiday.',
    'fr': 'Autorisation de localisation refusée.',
    'aa': 'Hayyama iddoo dhoorkame.',
  },
  geolocationPleaseEnable: {
    'en': 'Please enable location services in your device settings',
    'rw': 'Emeza serivice ndangahantu mu igenamiterere muri telefone yawe',
    'sw': 'Tafadhali wezesha huduma za eneo katika mipangilio ya kifaa chako',
    'am': 'እባክዎ በመሣሪያዎ ቅንብሮች ውስጥ የአካባቢ አገልግሎቶችን አስተካክሉ',
    'om': 'Maaloo argama iddoo taableet/moobaayilii kee irraa sirreessi',
    'ti': 'ቦታ አገልግሎት ኣብ ሓንደበት መሳርሒኻ አንብብ',
    'so': 'Fadlan adeegyada goobta ku hawl geli dejimaha qalabkaaga',
    'fr': 'Veuillez activer les services de localisation dans les paramètres de votre appareil',
    'aa': 'Tajaajila iddoo settings keessa banuu',
  },
  geolocationUnable: {
    'en': 'Unable to get location',
    'rw': 'Ntibiskoboka kubona ahantu',
    'sw': 'Eneo halipatikani',
    'am': 'አካባቢ ማግኘት አልቻለም',
    'om': 'Iddoo argachuu hin dandeenye',
    'ti': 'ቦታ ምምጻዕ አይተኽአለን',
    'so': 'Goobta lama heli karo',
    'fr': 'Impossible d\'obtenir la localisation',
    'aa': 'Iddoo argachuu hin dandeenye',
  },
  geolocationGetLocationButton: {
    'en': 'Get Location',
    'rw': 'Kubona ahantu',
    'sw': 'Pata Eneo',
    'am': 'አካባቢ ያግኙ',
    'om': 'Iddoo argadhu',
    'ti': 'ቦታ አውጽእ',
    'so': 'Hel Goobta',
    'fr': 'Obtenir la localisation',
    'aa': 'Iddoo argadhu',
  },
  loadingLocations: {
    'en': 'Loading locations...',
    'rw': 'Gushakisha ahantu...',
    'sw': 'Inapakia maeneo...',
    'am': 'አካባቢዎች በማስገባት ላይ ነው...',
    'om': 'Iddoo barbaaduu jira',
    'ti': 'ቦታ አብ ምፅዓን አሎ...',
    'so': 'Goobaha la raadinayo...',
    'fr': 'Chargement des localisations...',
    'aa': 'Iddoowwan fe\'amaa jiru...',
  },
  errorLoadingLocations: {
    'en': 'Error loading locations',
    'rw': 'Ikosa mu gushakisha ahantu',
    'sw': 'Kosa katika kupakia maeneo',
    'am': 'አካባቢዎች ማስገባት ላይ ስህተት',
    'om': 'Iddoo barbaaduun irratti dogoggora',
    'ti': 'ሓገዝ ቦታ ምጽዓን ፀገም አለዎ',
    'so': 'Raadinta goobaha khaladku kujiro',
    'fr': 'Erreur lors du chargement des localisations',
    'aa': 'Dogoggora iddoowwan fe\'uuf',
  },
  selectYourLocation: {
    'en': 'Select your location below',
    'rw': 'Hitamo aho uri hasi',
    'sw': 'Chagua eneo lako hapa chini',
    'am': 'እባክዎ ከሚ below ያለው አካባቢዎን ይምረጡ',
    'om': 'Iddoo kee armaan gadi filadhu',
    'ti': 'ኣብ ዝኾነ ምርመራ ኣካባቢዎን ይምረጡ',
    'so': 'Fadlan hoos ka xulo goobtaada',
    'fr': 'Sélectionnez votre localisation ci-dessous',
    'aa': 'Iddoo kee armaan gadi filadhu',
  }
};

export type { Localization };
export { localizations };
