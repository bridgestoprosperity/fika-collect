type Locale = string;

interface Localization {
  [key: Locale]: string;
}

const localizations: Record<Locale, Localization> = {
  error: {
    'en': 'Error',
    'es': 'Error',
  },
  surveysScreenTitle: {
    'en': 'Surveys',
    'es': 'Encuestas',
  },
  myResponsesScreenTitle: {
    'en': 'My Responses',
    'es': 'Mis Respuestas',
  },
  backButton: {
    'en': 'Back',
    'es': 'Atrás',
  },
  nextButton: {
    'en': 'Next',
    'es': 'Siguiente',
  },
  submitButton: {
    'en': 'Submit',
    'es': 'Enviar',
  },
  previousButton: {
    'en': 'Previous',
    'es': 'Anterior',
  },
  cancelButton: {
    'en': 'Cancel',
    'es': 'Cancelar',
  },
  discardButton: {
    'en': 'Discard',
    'es': 'Descartar',
  },
  questionCountLabel: {
    'en': 'Question',
    'es': 'Pregunta',
  },
  noCameraAvailable: {
    'en': 'No camera available',
    'es': 'No hay cámara disponible',
  },
  selectPhotoFromLibrary: {
    'en': 'Select photo from library',
    'es': 'Seleccionar foto de la biblioteca',
  },
  cameraPermissionRequired: {
    'en': 'Camera permission is required to take a photo',
    'es': 'Se requiere permiso de cámara para tomar una foto',
  },
  booleanQuestionYes: {
    'en': 'Yes',
    'es': 'Sí',
  },
  booleanQuestionNo: {
    'en': 'No',
    'es': 'No',
  },
  discardResponseTitle: {
    'en': 'Discard Response',
    'es': 'Descartar Respuesta',
  },
  discardResponseMessage: {
    'en': 'Are you sure you want to discard this response?',
    'es': '¿Está seguro de que desea descartar esta respuesta?',
  },
  gelocationRequesting: {
    'en': 'Requesting location...',
    'es': 'Solicitando ubicación...',
  },
  geolocationDenied: {
    'en': 'Location permission denied',
    'es': 'Permiso de ubicación denegado',
  },
  geolocationPleaseEnable: {
    'en': 'Please enable location services in your device settings',
    'es': 'Habilite los servicios de ubicación en la configuración de su dispositivo',
  },
  geolocationUnable: {
    'en': 'Unable to get location',
    'es': 'No se puede obtener la ubicación',
  },
  geolocationGetLocationButton: {
    'en': 'Get Location',
    'es': 'Obtener Ubicación',
  },

};

export type { Localization };
export { localizations };
