export const spaces = {
  personalSpace: {
    title: 'Mi perfil de comodidad',
    subtitle: 'Tómate un momento para reflexionar sobre tus zonas de comodidad. Es personal.',
    safeword: {
      title: 'Mi palabra de seguridad (safeword)',
      desc: 'Una palabra para parar todo de inmediato, sin discusión.',
      placeholder: 'Ej: rojo, stop, piña...',
    },
    saveBtn: 'Guardar mi perfil',
    privacy: 'Esta información permanece privada hasta que decidas compartirla.',
  },

  duo: {
    title: 'Nuestro Espacio',
    subtitle: 'Conéctate con tu pareja para dialogar juntos.',
    bump: {
      title: 'Bump',
      tag: 'Recomendado',
      desc: 'Acercad vuestros teléfonos para conectaros',
      waiting: {
        instruction: 'Acercad vuestros teléfonos',
        sub: 'Haced un "bump" para conectaros',
        searching: 'Buscando...',
        simBump: 'Simular bump (demo)',
        simFail: 'Simular un fallo',
      },
      detecting: {
        title: '¡Dispositivo detectado!',
        sub: 'Conectando...',
      },
      success: '¡Bump exitoso!',
      failed: {
        title: 'Conexión difícil',
        sub: '¡No hay problema! Usemos el código QR en su lugar.',
        why: {
          title: '¿Por qué no funcionó?',
          sub: 'La conexión directa puede fallar si:',
          reason1: 'iPhone ↔ Android (limitaciones de Apple)',
          reason2: 'Bluetooth desactivado',
          reason3: 'Teléfonos demasiado separados',
        },
        useQr: 'Usar el código QR',
        retry: 'Reintentar bump',
      },
    },
    qr: {
      title: 'Código QR / Código manual',
      desc: 'Alternativa si el bump no funciona',
    },
    how: {
      title: '¿Cómo funciona?',
      step1: 'Estáis juntos, cada uno con vuestro teléfono',
      step2: 'Acercad vuestros teléfonos (o escaned el código QR)',
      step3: 'Rellenáis vuestros perfiles por separado',
      step4: "La app revela vuestras zonas comunes",
    },
    qrFallback: {
      title: 'Conexión por código QR',
      subtitle: 'Elige tu método de conexión',
    },
    generate: {
      title: 'Generar mi código',
      desc: 'Mi pareja lo escaneará',
      codeLabel: 'Código de conexión',
      waiting: 'Esperando...',
      simulate: 'Simular conexión (demo)',
    },
    scan: {
      title: 'Escanear un código',
      desc: 'Escaneo el código de mi pareja',
      cancel: 'Cancelar',
    },
    manual: {
      title: 'Código manual',
      desc: 'Introduce el código de 6 dígitos',
      connect: 'Conectarse',
      back: 'Volver',
    },
    newSession: 'Nueva sesión',
    you: 'Tú',
    partner: 'Pareja',
    pact: {
      title: 'Nuestro pacto',
      subtitle: 'Antes de empezar, un recordatorio importante',
      items: {
        dialog: 'Este espacio es para dialogar, no para demostrar',
        revocable: 'El consentimiento sigue siendo revocable en cualquier momento',
        zones: 'Solo vuestras zonas comunes serán reveladas',
      },
      acceptBtn: 'Lo entendemos 💜',
      waitingPartner: 'Esperando a {name}...',
      bothAccepted: 'Estáis de acuerdo los dos',
    },
  },
} as const;
