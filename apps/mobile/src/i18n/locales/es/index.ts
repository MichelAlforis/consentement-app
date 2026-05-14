// BARREL — ne jamais transformer en export * glob (R7)
import { games } from './games';
import { moduleDeBase } from './moduleDeBase';
import { pratiquesBase } from './pratiquesBase';
import { pratiquesAvancees } from './pratiquesAvancees';
import { pratiquesExplicit } from './pratiquesExplicit';
import { lexiqueConsent } from './lexiqueConsent';
import { scenariosQuotidiens } from './scenariosQuotidiens';
import { bdsmConsent } from './bdsmConsent';
import { sexting } from './sexting';
import { pressionManip } from './pressionManip';
import { ruptureHarcele } from './ruptureHarcele';
import { contentNonConsenti } from './contentNonConsenti';
import { zonesGrises } from './zonesGrises';
import { alcoolConsent } from './alcoolConsent';
import { lgbtqConsent } from './lgbtqConsent';

export const es = {
  ...games,
  ...moduleDeBase,
  ...pratiquesBase,
  ...pratiquesAvancees,
  ...pratiquesExplicit,
  ...lexiqueConsent,
  ...scenariosQuotidiens,
  ...bdsmConsent,
  ...sexting,
  ...pressionManip,
  ...ruptureHarcele,
  ...contentNonConsenti,
  ...zonesGrises,
  ...alcoolConsent,
  ...lgbtqConsent,
  // UI keys below (welcome, ageCheck, themeSelect, auth, language,
  // onboarding, ficheSection, nav, premium, tabs, headers, settings,
  // moi, homeAdult, homeMinor, homeV3, apprendre, heat)
  welcome: {
    appName: 'OuiClair',
    tagline: 'Aprender. Entender. Decidir.',
    description: 'Las películas para adultos no te enseñan sobre el consentimiento. Estamos aquí para eso — sin tabúes, sin juicios.',
  },
  ageCheck: {
    title: '¿Cuántos años tienes?',
    minor: {
      title: 'Tengo menos de 18 años',
      desc: 'Acceso educativo, sin cuenta requerida',
    },
    adult: {
      title: 'Tengo 18 años o más',
      desc: 'Acceso completo, personalización máxima',
    },
    privacy: 'Esta información permanece en tu dispositivo y nunca se comparte',
  },
  themeSelect: {
    title: 'Elige tu ambiente',
    subtitle: 'Puedes cambiarlo en cualquier momento',
  },
  auth: {
    title: '¿Cómo te llamamos?',
    subtitle: 'Un nombre es suficiente — permanece en tu dispositivo',
    nameLabel: '¿Cómo quieres que te llamemos?',
    namePlaceholder: 'Tu nombre...',
    namePrivacy: 'Este nombre permanece solo en tu dispositivo',
    nameRequired: 'Ingresa tu nombre para continuar',
    btnContinue: 'Continuar',
    pronounsLabel: 'Pronombres (opcional)',
    pronounOptions: {
      il: 'él',
      elle: 'ella',
      iel: 'elle',
      neutre: 'neutro',
    },
  },
  language: {
    title: 'Elige tu idioma',
    subtitle: 'Podrás cambiarlo en cualquier momento en ajustes',
  },
  onboarding: {
    skip: 'Omitir',
  },
  ficheSection: {
    definition: 'Definición',
    consentement: 'Consentimiento',
    loi: 'Lo que dice la ley',
    question: 'Pregunta que hacerse',
  },
  nav: {
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Terminar',
  },
  premium: {
    gateMessage: 'Este contenido está reservado para miembros Premium',
    unlockCta: 'Desbloquear Premium',
    title: 'Pasarse a Premium',
    subtitle: 'Accede a todo el contenido exclusivo, sin límites.',
    cta: 'Empezar — 4,99 € / mes',
    themesNote: 'Los temas premium forman parte de la suscripción',
    purchasing: 'Procesando…',
    restore: 'Restaurar compras',
    restoring: 'Restaurando…',
    errorTitle: 'Compra fallida',
    errorMessage: 'La compra no pudo completarse. Comprueba tu conexión o inténtalo de nuevo.',
    restoreErrorTitle: 'Restauración fallida',
    restoreErrorMessage: 'No se encontraron compras para esta cuenta.',
    features: [
      { label: 'Contenido explícito desbloqueado' },
      { label: 'Todas las posiciones del Kamasutra' },
      { label: 'Juegos premium sin restricción' },
      { label: 'Nuevas cartas cada mes' },
    ],
  },
  tabs: {
    home: 'Inicio',
    learn: 'Aprender',
    games: 'Juegos',
    me: 'Yo',
  },
  headers: {
    personalSpace: 'Mi Espacio',
    duoSpace: 'Nuestro Espacio',
    learn: 'Aprender',
    help: 'Ayuda',
    settings: 'Ajustes',
    accompagnementAdulte: 'Acompañamiento',
    annuaireSexologues: 'Directorio de sexólogos',
  },
  settings: {
    sections: {
      profile: 'Mi perfil',
      appearance: 'Apariencia',
      content: 'Contenido',
      app: 'App',
    },
    profile: {
      name: 'Nombre',
      namePlaceholder: 'Tu nombre',
      pronouns: 'Pronombres',
      pronounsOptional: '(opcional)',
      personalSpace: 'Mi espacio personal',
      personalSpaceDesc: 'Perfil de comodidad y palabra de seguridad',
    },
    language: {
      title: 'Idioma',
      desc: 'Elegir el idioma de la aplicación',
    },
    theme: {
      title: 'Tema',
      desc: 'Cambiar el estilo visual',
    },
    help: {
      title: 'Ayuda y Urgencias',
      desc: 'Números útiles, recursos disponibles 24h/24',
    },
    premium: {
      title: 'Pasarse a Premium',
      desc: 'Todos los juegos + sin publicidad',
    },
    premiumActive: {
      title: 'Premium activo',
      desc: 'Todo el contenido desbloqueado, sin publicidad',
    },
    explicit: {
      title: 'Modo Explícito',
      desc: 'Desbloquear contenido sexualmente explícito',
    },
    replayIntro: {
      title: 'Ver introducción de nuevo',
      desc: 'Volver a ver las diapositivas de presentación',
    },
    reset: {
      title: 'Restablecer la app',
      desc: 'Borrar todos los datos locales',
      confirm: 'Todos tus datos locales serán borrados. Esta acción es irreversible.',
      cta: 'Restablecer',
      cancel: 'Cancelar',
    },
    deleteAccount: {
      title: 'Eliminar mi cuenta',
      desc: 'RGPD — elimina permanentemente todos tus datos',
      confirmTitle: '¿Eliminar mis datos?',
      confirmBody: 'Esto elimina permanentemente todos tus datos personales (perfil, progreso, cartas, preferencias). De conformidad con el derecho de supresión del RGPD (Art. 17). Irreversible.',
      cta: 'Eliminar definitivamente',
      cancel: 'Cancelar',
    },
  },
  moi: {
    defaultName: 'Mi espacio',
    personalSpaceDesc: 'Explorar mis zonas de confort',
    duoSpaceDesc: 'Dialogar con mi pareja',
    helpDesc: 'Números gratuitos, anónimos, disponibles 24h/24',
    settingsDesc: 'Tema, idioma, datos personales',
    premiumDesc: 'Todos los juegos · contenido profundo · sin límite',
    accompagnementAdulteDesc: '¿Estás pasando por algo? Recursos confidenciales.',
    annuaireDesc: 'Encontrar un/a profesional — presencial o teleconsulta',
    heatTitle: 'Mi Barómetro',
    prefSection_title: 'Cómo me siento',
    prefSection_empty: 'Las preguntas aparecerán a medida que avances',
  },
  homeAdult: {
    subtitle: 'Explora tu perfil de comodidad o conéctate con tu pareja.',
    collection: {
      title: 'Mi Colección',
      empty: 'Completa un módulo para desbloquear tus primeras cartas',
    },
  },
  homeMinor: {
    badge: 'Espacio Joven',
    title: 'Lo que no te enseñan en el colegio',
    subtitle: 'Sin tabúes. Sin juicios. Solo información real.',
  },
  homeV3: {
    discovery: {
      ctaAdult: 'Empezar tu recorrido',
      ctaMinor: 'Explorar módulos',
      ctaDesc: 'Cada módulo completado desbloquea cartas',
      fomoTitle: 'Tu colección te espera',
      fomoDesc: 'Módulo base → 24 cartas · Quiz → 1 carta · Ley → 1 rara…',
    },
    learning: {
      progressLabel: 'Progreso',
      nextModuleLabel: 'Siguiente módulo',
    },
    mastery: {
      collectionOne: '1 carta desbloqueada',
      rareOne: '1 rara',
      uniqueOne: '1 única',
      viewCollection: 'Ver tu colección →',
      duoTitle: 'Nuestro Espacio',
      duoDesc: 'Juega con tus cartas desbloqueadas juntos',
      goFurther: 'Ir más lejos',
    },
  },
  apprendre: {
    subtitleEmpty: 'Cada módulo completado desbloquea cartas para tus juegos.',
    subtitleOne: '1 / {total} módulo completado',
    subtitleMany: '{count} / {total} módulos completados',
    rewardPrefix: 'Recompensa: ',
    rarityCommon: 'común',
    rarityRare: 'rara',
    rarityUnique: 'única',
    rewardCommon: '1 carta común',
    rewardRare: '1 carta rara',
    rewardUnique: '1 carta única',
    allDone: '¡Recorrido completado!',
    allDoneSub: 'Has explorado todo el contenido disponible. ¡Ahora juega!',
    heatRequired: 'Nivel {palier} requerido · {pts} pts',
    heatPoints: '+{n} pts',
    heatPointsEarned: '✓ {n} pts',
  },
  heat: {
    tiede: 'Templado',
    chaud: 'Caliente',
    ardent: 'Ardiente',
    brulant: 'Abrasador',
    incandescent: 'Incandescente',
  },
  duo: {
    title: 'Nuestro Espacio',
    createSession: 'Crear una sesión',
    createSessionDesc: 'Genera un código QR — tu pareja lo escanea',
    join: 'Unirse',
    joinDesc: 'Escanea el QR de tu pareja',
    scanQRBtn: 'Escanear código QR',
    manualCode: 'Introducir el código manualmente',
    scanQRHint: 'Apunta la cámara al código QR de tu pareja',
    shareCode: 'O comparte el código manualmente',
    waiting: 'Esperando a tu pareja…',
    waitingSub: 'En cuanto escanee el código, estaréis conectados',
    connected: '¡Pareja conectada!',
    connectedSub: 'Vuestros perfiles de confort están sincronizados',
    disconnect: 'Terminar sesión',
    enterCode: 'Código de 6 caracteres',
    cancel: 'Cancelar',
    loading: 'Conectando…',
    permissionDenied: 'Cámara no autorizada — introduce el código manualmente',
    errorInvalidCode: 'Código inválido o no encontrado',
    errorExpired: 'Esta sesión ha expirado',
    errorNetwork: 'Conexión fallida. Comprueba tu conexión.',
  },
};
