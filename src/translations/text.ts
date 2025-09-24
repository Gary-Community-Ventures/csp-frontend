const generalNavBar = {
  menu: {
    support: {
      en: 'Help/Support',
      es: 'Ayuda/Apoyo',
    },
    supportLinks: {
      en: 'https://www.capcolorado.org/en/contact',
      es: 'https://www.capcolorado.org/es/contact',
    },
    yourProfile: {
      en: 'Your Profile',
      es: 'Tu Perfil',
    },
    signOut: {
      en: 'Sign Out',
      es: 'Cerrar Sesión',
    },
  },
  links: {
    home: {
      en: 'Home',
      es: 'Inicio',
    },
    messages: {
      en: 'Messages',
      es: 'Mensajes',
    },
    activity: {
      en: 'Activity',
      es: 'Actividad',
    },
  },
} as const

const statuses = {
  approved: {
    en: 'Approved',
    es: 'Aprobado',
  },
  pending: {
    en: 'Pending',
    es: 'Pendiente',
  },
  denied: {
    en: 'Denied',
    es: 'Denegado',
  },
} as const

const paymentStatuses = {
  success: {
    en: 'Success',
    es: 'Exitoso',
  },
  failed: {
    en: 'Failed',
    es: 'Fallido',
  },
  pending: {
    en: 'Pending',
    es: 'Pendiente',
  },
} as const

const submitButton = {
  en: 'Submit',
  es: 'Enviar',
} as const

const submittingButton = {
  en: 'Submitting...',
  es: 'Enviando...',
} as const

const cancelButton = {
  en: 'Cancel',
  es: 'Cancelar',
} as const

const successMessage = {
  en: 'Invite sent successfully',
  es: 'Invitación enviada exitosamente',
} as const

const emailError = {
  en: 'Please enter a valid email address',
  es: 'Por favor ingresa un correo electrónico válido',
} as const

const phoneError = {
  en: 'Please enter a valid phone number',
  es: 'Por favor ingresa un número de teléfono válido',
} as const

const signInButton = {
  en: 'Sign in',
  es: 'Iniciar sesión',
} as const

const returnHomeButton = {
  en: 'Return home',
  es: 'Volver a inicio',
} as const

const translatedLanguages = {
  en: {
    en: 'English',
    es: 'Inglés',
  },
  es: {
    en: 'Spanish',
    es: 'Español',
  },
} as const

const notificationBanner = {
  applicationPending: {
    en: 'Application awaiting approval',
    es: 'Solicitud pendiente de aprobación',
  },
  attendance: {
    en: 'Submit your care hours for last week',
    es: 'Envía tus horas de cuidado para la última semana',
  },
} as const

const attendance = {
  header: {
    en: 'Log Your Care',
    es: 'Registre Tu Asistencia',
  },
  success: {
    en: 'Attendance submitted successfully',
    es: 'Asistencia enviada exitosamente',
  },
  allSet: {
    en: 'All of your attendance has been submitted.',
    es: 'Toda tu asistencia ha sido enviada.',
  },
  allSetDescription: {
    en: 'Come back next week to submit your attendance for this week.',
    es: 'Vuelve la semana siguiente para enviar tu asistencia para esta semana.',
  },
  returnHome: returnHomeButton,
  submit: submitButton,
} as const

export const translations = {
  family: {
    calendar: {
      halfDay: {
        en: 'Half Day:',
        es: 'Medio Día:',
      },
      fullDay: {
        en: 'Full Day:',
        es: 'Día Completo:',
      },
      tapInstructions: {
        en: 'Tap once for half day, twice for full day, three times to remove.',
        es: 'Toque una vez para medio día, toque dos veces para día completo y toque tres veces para eliminar.',
      },
      daysOfWeek: {
        mon: {
          en: 'Mon',
          es: 'Lun',
        },
        tue: {
          en: 'Tue',
          es: 'Mar',
        },
        wed: {
          en: 'Wed',
          es: 'Mié',
        },
        thu: {
          en: 'Thu',
          es: 'Jue',
        },
        fri: {
          en: 'Fri',
          es: 'Vie',
        },
        sat: {
          en: 'Sat',
          es: 'Sáb',
        },
        sun: {
          en: 'Sun',
          es: 'Dom',
        },
      },
      needsSubmission: {
        en: 'Needs Submission',
        es: 'Necesita Presentación',
      },
      submitted: {
        en: 'Submitted',
        es: 'Enviado',
      },
      needsResubmission: {
        en: 'Needs Resubmission',
        es: 'Necesita Reenvío',
      },
      disabledDay: {
        notCurrentMonth: {
          en: 'This day is not in the current month. Please navigate to the correct month to make change to this day.',
          es: 'Este día no está en el mes actual. Por favor, navega al mes correcto para realizar cambios en este día.',
        },
        dayLockedGeneral: {
          en: 'This day has been locked and can no longer be modified.',
          es: 'Este día ha sido bloqueado y no se puede modificar.',
        },
        dayLockedNotYetAvailable: {
          en: 'This day is not yet available for making payments.',
          es: 'Este día aún no está disponible para realizar pagos.',
        },
        alreadySubmitted: {
          en: 'This day has already been submitted and cannot be modified.',
          es: 'Este día ya ha sido enviado y no se puede modificar.',
        },
      },
      cancel: {
        en: 'Cancel',
        es: 'Cancelar',
      },
    },
    calendarPaymentPage: {
      loading: {
        en: 'Loading...',
        es: 'Cargando...',
      },
      allocationNotFound: {
        en: 'Allocation Not Found',
        es: 'Asignación no encontrada',
      },
      allocationNotFoundDescription: {
        en: 'The monthly allocation could not be loaded. Please try again or contact support if the problem persists.',
        es: 'No se pudo cargar la asignación mensual. Por favor, inténtelo de nuevo o contacte al soporte si el problema persiste.',
      },
      noPaymentRate: {
        part1: {
          en: 'Your provider has not set their care rates yet. Please have them  log into the portal and set their rates for ',
          es: 'Su proveedor aún no ha establecido sus tasas de atención. Por favor, haga que se registre en el portal y configure sus tasas para ',
        },
        part2: {
          en: ". Once rates are set, you'll be able to schedule half-day and full-day payments for this provider.",
          es: '. Una vez que se establezcan las tasas, podrás programar pagos de media hora y día completo para este proveedor.',
        },
      },
      unsavedChangesBlocker: {
        en: 'Are you sure you want to leave?',
        es: '¿Estás seguro de que quieres salir?',
      },
      unsavedChangesBlockerDescription: {
        en: "Your changes haven't been submitted. If you leave, your provider will not receive your updates.",
        es: 'Tus cambios no han sido enviados. Si sales, tu proveedor no recibirá tus actualizaciones.',
      },
      stayButton: {
        en: 'Stay',
        es: 'Quedarse',
      },
      leaveButton: {
        en: 'Leave',
        es: 'Salir',
      },
      paymentDescription: {
        en: "Select the days you need care with {providerName} for {childFirstName}. Click submit to send these days to your provider. When you click submit, the days you've selected will be locked in and payment will be processed. **This action cannot be undone**.",
        es: 'Seleccione los días que necesita atención con {providerName} para {childFirstName}. Haga clic en Enviar para enviar estos días a su proveedor. Cuando haga clic en Enviar, los días que ha seleccionado se bloquearán y se procesará el pago. **Esta acción no se puede deshacer**.',
      },
      monthBalance: {
        en: 'Month Balance',
        es: 'Balance del Mes',
      },
      submitButton: submitButton,
      submittingButton: submittingButton,
    },
    paymentPage: {
      providerNotFound: {
        en: 'Provider not found',
        es: 'Proveedor no encontrado',
      },
      paymentFor: {
        en: 'Payment for {providerName}',
        es: 'Pago para {providerName}',
      },
    },
    lumpPaymentPage: {
      allocationNotFound: {
        en: 'Allocation Not Found',
        es: 'Asignación no encontrada',
      },
      allocationNotFoundDescription: {
        en: 'The monthly allocation could not be loaded. Please try again or contact support if the problem persists.',
        es: 'No se pudo cargar la asignación mensual. Por favor, inténtelo de nuevo o contacte al soporte si el problema persiste.',
      },
      amountRequired: {
        en: 'Amount must be a positive number',
        es: 'El monto debe ser un número positivo',
      },
      hoursRequired: {
        en: 'Hours must be a positive number',
        es: 'Las horas deben ser un número positivo',
      },
      paymentDescription: {
        en: 'Submit the payment amount and hours to {providerName} for {childFirstName}.',
        es: 'Enviar el monto del pago y las horas a {providerName} para {childFirstName}.',
      },
      amountLabel: {
        en: 'Amount (USD)',
        es: 'Monto (USD)',
      },
      hoursLabel: {
        en: 'Hours',
        es: 'Horas',
      },
      submitButton: submitButton,
      monthBalance: {
        en: 'Balance',
        es: 'Balance',
      },
      lumpPaymentSuccess: {
        en: 'Payment successful!',
        es: '¡Pago exitoso!',
      },
      monthlyAllocationExceededError: {
        en: 'Adding this payment would exceed the monthly allocation.',
        es: 'Agregar este pago excedería la asignación mensual.',
      },
      lumpPaymentError: {
        en: 'Failed to submit payment',
        es: 'Error al enviar el pago',
      },
    },
    lumpSumConfirmationPage: {
      header: {
        en: 'Payment Submitted',
        es: 'Pago Enviado',
      },
      successMessage: {
        en: 'Your payment has been successfully submitted.',
        es: 'Su pago ha sido enviado exitosamente.',
      },
      providerLabel: {
        en: 'Provider',
        es: 'Proveedor',
      },
      childLabel: {
        en: 'Child',
        es: 'Niño',
      },
      monthLabel: {
        en: 'Month',
        es: 'Mes',
      },
      hoursLabel: {
        en: 'Hours',
        es: 'Horas',
      },
      amountLabel: {
        en: 'Amount',
        es: 'Monto',
      },
      backButton: {
        en: 'Back to Home',
        es: 'Volver a Inicio',
      },
    },
    navBar: {
      menu: {
        ...generalNavBar.menu,
        selectedChild: {
          en: 'Select Child',
          es: 'Seleccionar Niño',
        },
        providerHome: {
          en: 'Go to Provider Home',
          es: 'Ir a Inicio del Proveedor',
        },
      },
      links: {
        ...generalNavBar.links,
        providers: {
          en: 'Providers',
          es: 'Proveedores',
        },
      },
      notificationBanner: {
        ...notificationBanner,
        applicationDenied: {
          en: 'Unfortunately, your application was denied for this child',
          es: 'Lamentablemente, tu solicitud fue rechazada para este niño',
        },
      },
    },
    home: {
      balance: {
        en: '{month} Balance',
        es: 'Balance de {month}',
      },
      balanceLoading: {
        en: 'Loading...',
        es: 'Cargando...',
      },
      balanceUnavailable: {
        en: 'Unavailable',
        es: 'No disponible',
      },
      providers: {
        en: 'Providers',
        es: 'Proveedores',
      },
      recentTransactions: {
        en: 'Recent Transactions',
        es: 'Transacciones Recientes',
      },
    },
    providerList: {
      ...statuses,
      payProvider: {
        en: 'Pay Provider',
        es: 'Pagar Proveedor',
      },
      paymentsDisabled: {
        en: 'Payments Not Enabled',
        es: 'Pagos No Habilitados',
      },
    },
    providerPage: {
      header: {
        main: {
          en: 'Pay your existing provider or switch to a new one.',
          es: 'Paga tu proveedor existente o cambia a uno nuevo.',
        },
        knownProvider: {
          part1: {
            en: 'If you already know which provider you want to use, invite them to join the pilot using the button below. They will need to apply and be approved to receive funding -- see application rules ',
            es: 'Si ya sabes qué proveedor quieres usar, invítalos a unirse al piloto usando el botón de abajo. Necesitarán aplicar y ser aprobados para recibir fondos -- ve las reglas de aplicación ',
          },
          linkText: {
            en: 'here',
            es: 'aquí',
          },
          part2: {
            en: '.',
            es: '.',
          },
        },
        newProvider: {
          part1: {
            en: 'If you are looking for a new provider, you can find licensed childcare centers or homes on ',
            es: 'Si estás buscando un nuevo proveedor, puedes encontrar centros de cuidado infantil autorizados u hogares en ',
          },
          coloradoShinesText: {
            en: 'Colorado Shines',
            es: 'Colorado Shines',
          },
          part2: {
            en: ', or contact a family, friend or neighbor who provides care.',
            es: ', o contactar a un familiar, amigo o vecino que proporcione cuidado.',
          },
        },
      },
      yourProviders: {
        en: 'Your Providers',
        es: 'Tus Proveedores',
      },
      addProvider: {
        en: 'Add a Provider',
        es: 'Agregar un Proveedor',
      },
      invite: {
        en: 'Invite a provider',
        es: 'Invitar a un proveedor',
      },
      inviteButton: {
        en: 'Invite',
        es: 'Invitar',
      },
    },
    inviteProviderPage: {
      header: {
        en: 'Invite a provider',
        es: 'Invitar a un proveedor',
      },
      emailError: emailError,
      phoneError: phoneError,
      successMessage: successMessage,
      cancelButton: cancelButton,
      submitButton: submitButton,
      languageOptions: translatedLanguages,
      childrenHeader: {
        en: 'Which children does this provider care for?',
        es: '¿A cuales niños cuida este proveedor?',
      },
      confirmationPage: {
        backButton: {
          en: 'Back to Providers',
          es: 'Volver a Proveedores',
        },
      },
    },
    attendance: {
      ...attendance,
      description: {
        en: 'Please confirm the hours of care you received for each child for the week. If you did not receive care, please enter 0.',
        es: 'Confirme las horas de cuidado que recibió para cada niño para la semana. Si no recibió cuidado, ingrese 0.',
      },
    },
  },
  provider: {
    navBar: {
      menu: {
        ...generalNavBar.menu,
        familyHome: {
          en: 'Go to Family Home',
          es: 'Ir a Inicio de Familia',
        },
      },
      links: {
        ...generalNavBar.links,
        resources: {
          en: 'Resources',
          es: 'Recursos',
        },
        attendance: {
          en: 'Attendance',
          es: 'Asistencia',
        },
        paymentSettings: {
          en: 'Payment Settings',
          es: 'Configuración de Pagos',
        },
      },
      notificationBanner: {
        ...notificationBanner,
        applicationDenied: {
          en: 'Unfortunately, your application was denied',
          es: 'Lamentablemente, tu solicitud fue rechazada',
        },
      },
    },
    home: {
      content: {
        en: 'Content',
        es: 'Contenido',
      },
      children: {
        en: 'Children',
        es: 'Niños',
      },
      inviteFamily: {
        en: 'ADD A FAMILY',
        es: 'AGREGAR FAMILIA',
      },
      messageParent: {
        en: 'Message Parent',
        es: 'Mensaje al Padre',
      },
      payments: {
        en: 'Recent Payments',
        es: 'Pagos Recientes',
      },
      childrenList: {
        setRate: {
          en: 'Set Rate',
          es: 'Establecer Tarifa',
        },
        halfDayRate: {
          en: 'Half Day: ',
          es: 'Media Hora: ',
        },
        fullDayRate: {
          en: 'Full Day: ',
          es: 'Día Completo: ',
        },
      },
    },
    setRate: {
      setPaymentRates: {
        en: 'Set Payment Rates for ',
        es: 'Establecer tarifas de pago para ',
      },
      setPaymentRatesDescription: {
        en: 'Before the family can schedule care days, you must set your rates for ',
        es: 'Antes de que la familia pueda programar los días de cuidado, debes establecer tus tarifas para ',
      },
      halfDayRate: {
        en: 'Half Day Rate (USD)',
        es: 'Tarifa de Medio Día (USD)',
      },
      fullDayRate: {
        en: 'Full Day Rate (USD)',
        es: 'Tarifa de Día Completo (USD)',
      },
      setRatesButton: {
        en: 'Set Rates',
        es: 'Establecer Tarifas',
      },
      rateError: {
        part1: {
          en: 'Rate must be a number between $',
          es: 'La tarifa debe ser un número entre $',
        },
        part2: {
          en: ' and $',
          es: ' y $',
        },
      },
    },
    paymentSettings: {
      title: {
        en: 'Payment Settings',
        es: 'Configuración de Pagos',
      },
      loading: {
        en: 'Loading payment settings...',
        es: 'Cargando configuración de pagos...',
      },
      disabled: {
        en: 'Payment is not enabled on your account.',
        es: 'El pago no está habilitado en tu cuenta.',
      },
      failedToLoad: {
        en: 'Failed to load payment settings. Please try again.',
        es: 'Error al cargar la configuración de pagos. Inténtalo de nuevo.',
      },
      paymentMethod: {
        title: {
          en: 'Payment Method',
          es: 'Método de Pago',
        },
        virtualCard: {
          title: {
            en: 'Virtual Card',
            es: 'Tarjeta Virtual',
          },
          description: {
            en: 'Receive payments via virtual card',
            es: 'Recibir pagos mediante tarjeta virtual',
          },
        },
        ach: {
          title: {
            en: 'ACH/Direct Pay',
            es: 'ACH/Pago Directo',
          },
          description: {
            en: 'Receive payments via ACH bank transfer',
            es: 'Recibir pagos mediante transferencia bancaria ACH',
          },
        },
        updateButton: {
          en: 'Update Payment Method',
          es: 'Actualizar Método de Pago',
        },
        initializeButton: {
          en: 'Initialize Payment Method',
          es: 'Inicializar Método de Pago',
        },
        updateSuccess: {
          en: 'Payment method updated successfully',
          es: 'Método de pago actualizado exitosamente',
        },
        updateError: {
          en: 'Failed to update payment method',
          es: 'Error al actualizar el método de pago',
        },
        setupRequired: {
          en: 'Payment account setup is required before you can select a payment method. Please contact support.',
          es: 'Se requiere configurar la cuenta de pago antes de poder seleccionar un método de pago. Por favor contacte a soporte.',
        },
        chekSetupMessage: {
          en: 'After submitting, you will receive an email from our payment provider Chek to set up your account and configure your payment method.',
          es: 'Después de enviar, recibirá un correo electrónico de nuestro proveedor de pagos Chek para configurar su cuenta y configurar su método de pago.',
        },
        inviteSentMessage: {
          en: 'An invitation email has been sent to {email} to set up your payment account. Please check your email.',
          es: 'Se ha enviado un correo electrónico de invitación a {email} para configurar su cuenta de pago. Por favor, revise su correo electrónico.',
        },
      },
      additionalInfo: {
        title: {
          en: 'Additional Information',
          es: 'Información Adicional',
        },
        providerId: {
          en: 'Provider ID',
          es: 'ID del Proveedor',
        },
        chekUserId: {
          en: 'Chek User ID',
          es: 'ID de Usuario Chek',
        },
        lastUpdated: {
          en: 'Last Updated',
          es: 'Última Actualización',
        },
        lastSync: {
          en: 'Last Sync',
          es: 'Última Sincronización',
        },
        needsRefresh: {
          en: '⚠️ Payment status needs refresh',
          es: '⚠️ El estado de pago necesita actualización',
        },
      },
      status: {
        active: {
          en: 'Active',
          es: 'Activo',
        },
        invited: {
          en: 'Invited',
          es: 'Invitado',
        },
        notAvailable: {
          en: 'Not Available',
          es: 'No Disponible',
        },
        notConfigured: {
          en: 'Not Yet Configured',
          es: 'Aún No Configurado',
        },
      },
      setupPaymentButton: {
        en: 'Setup Payment Settings',
        es: 'Configurar Ajustes de Pago',
      },
    },
    resources: {
      title: {
        en: 'Resources',
        es: 'Recursos',
      },
      description: {
        en: "A key step to fully participate in the CAP program and receive payments from families is to complete mandatory health and safety training. We've put together a series of online videos and readings that you can access from home.",
        es: 'Un paso clave para participar completamente en el programa CAP y recibir pagos de familias es completar el entrenamiento obligatorio de salud y seguridad. Hemos creado una serie de videos y lecturas en línea que puedes acceder desde casa.',
      },
      getStarted: {
        en: 'Get Started',
        es: 'Empezar',
      },
      getStartedLink: {
        en: 'https://docs.google.com/document/d/1SBK4GkX5kzHG5JByqhRKw_w2I0d1t4eCEcPMrp-KpgU/edit?tab=t.0',
        es: 'https://docs.google.com/document/d/1RVW3gSiCPRFQeekaKGGpEh1TXJzCvZi3R82Nu3y-bgk/edit?tab=t.0',
      },
      pageTitle: {
        en: 'Childcare Affordability Pilot (CAP) Training Module',
        es: 'Módulo de Capacitación del Programa Piloto de Asequibilidad de Cuidado Infantil (CAP)',
      },
      welcome: {
        en: "Welcome to the Childcare Affordability Pilot (CAP)! We're thrilled to have you join us. This small invite-only test is all about supporting you as you provide vital care to children in Colorado.",
        es: '¡Bienvenido al Programa Piloto Childcare Affordability Pilot (CAP)! Nos complace contar con su participación. Esta pequeña prueba solo por invitación se centra en ayudarle mientras brinda atención vital a los niños de Colorado.',
      },
      keyStep: {
        en: "A key step to fully participate in the CAP program and receive payments from families is to complete mandatory health and safety training. We've put together a series of online videos and readings that you can access from home.",
        es: 'Un paso clave para participar en el programa CAP y recibir pagos de las familias es completar la capacitación esencial sobre salud y seguridad. Hemos creado una serie de videos y lecturas en línea a los que puede acceder desde casa.',
      },
      pleaseNote: {
        en: 'Please note: All training outlined below must be completed PRIOR TO FORMAL APPROVAL into the Childcare Affordability Pilot (CAP).',
        es: 'Tenga en cuenta: toda la capacitación descrita a continuación debe completarse ANTES DE LA APROBACIÓN FORMAL en el Programa Piloto Childcare Affordability Pilot (CAP).',
      },
      readCarefully: {
        en: 'Please read these instructions carefully, especially about the CPR training, as it has a unique process.',
        es: 'Lea atentamente estas instrucciones, especialmente sobre el entrenamiento en RCP (reanimación cardiopulmonar), ya que es un proceso único.',
      },
      trainingOverviewTitle: {
        en: 'Your Training Overview',
        es: 'Descripción general de su entrenamiento',
      },
      trainingOverviewDescription: {
        en: "We've organized your training into four main sections. Please complete these in the order they are presented, as they build upon important knowledge for providing the best care.",
        es: 'Hemos organizado su capacitación en cuatro secciones principales. Por favor, complételas en el orden en que se presentan, ya que se basan en conocimientos importantes para brindar la mejor atención.',
      },
      markAsComplete: {
        en: 'Mark as Complete',
        es: 'Marcar como Completado',
      },
      completed: {
        en: 'Completed',
        es: 'Completado',
      },
      checkWhenDone: {
        en: 'Check when done',
        es: 'Marcar al terminar',
      },
      cprTooltip: {
        en: 'We will check this box once we have received your training documents',
        es: 'Marcaremos esta casilla una vez que hayamos recibido sus documentos de capacitación',
      },
      section1: {
        title: {
          en: 'Section 1: Adult, Child, and Baby First Aid/CPR/AED Online',
          es: 'Sección 1: Primeros auxilios/RCP (reanimación cardiopulmonar) /DEA (Desfibrilador externo automático) en línea para adultos, niños y bebés',
        },
        estimatedTime: {
          en: 'Estimated Time: Approximately 3 hours, 50 minutes',
          es: 'Tiempo estimado: Aproximadamente 3 horas, 50 minutos',
        },
        description: {
          en: 'This training is vital for knowing how to respond in a medical emergency. For the CAP small invite-only test, you will complete the online portion of this course to fulfill the requirement.',
          es: 'Esta capacitación es vital para saber cómo responder en una emergencia médica. Para CAP, la pequeña prueba solo por invitación, deberá completar la parte en línea de este curso para cumplir con el requisito.',
        },
        cprInstructions: {
          en: 'Instructions for CPR Training (PLEASE READ CAREFULLY):',
          es: 'Instrucciones para la capacitación en RCP (POR FAVOR LEA ATENTAMENTE):',
        },
        goToLink: {
          en: 'Go to this link:',
          es: 'Vaya a este enlace:',
        },
        noCprLink: {
          en: 'No CPR training link available. Please contact',
          es: 'No hay enlace de capacitación en RCP disponible. Por favor contacte',
        },
        enterInfo: {
          en: 'Enter name, email address and phone number. Do not change the auto-populated voucher number on the registration page.',
          es: 'Ingrese su nombre, correo electrónico y número de teléfono. No modifique el número de cupón que se completa automáticamente en la página de registro.',
        },
        passwordReset: {
          en: "You will receive an email to reset your password. If an email isn't received, navigate to",
          es: 'Recibirá un correo electrónico para restablecer su contraseña. Si no lo recibe, visite',
        },
        selectLogin: {
          en: ', select "Login" and then select "Forgot Password".',
          es: ', seleccione "Iniciar sesión" y luego "Olvidé mi contraseña".',
        },
        completeCourse: {
          en: 'Access and complete the online course.',
          es: 'Accede y completa el curso online.',
        },
        shareCertificate: {
          en: 'Share Your Certificate:',
          es: 'Comparta su certificado:',
        },
        certificateDescription: {
          en: 'Once you have successfully completed the online course, you will receive a completion certificate or confirmation.',
          es: 'Una vez que haya completado el curso en línea, recibirá un certificado de finalización o una confirmación.',
        },
        important: {
          en: 'IMPORTANT:',
          es: 'IMPORTANTE:',
        },
        emailCopy: {
          en: 'Please email a copy (photo or scan) of your completed certificate to:',
          es: 'Envíe una copia (foto o escaneo) de su certificado completo a:',
        },
        emailCopyReason: {
          en: 'as soon as you receive it. This is essential for verifying your training for CAP approval.',
          es: 'Tan pronto como lo reciba. Esto es esencial para verificar su capacitación y obtener la aprobación de CAP.',
        },
      },
      section2: {
        title: {
          en: 'Section 2: Child Safety Module (Videos)',
          es: 'Sección 2: Módulo de seguridad infantil (Videos)',
        },
        estimatedTime: {
          en: 'Estimated Time: Approximately 40 minutes (total for all resources in this section)',
          es: 'Tiempo estimado: Aproximadamente 40 minutos (total para todos los recursos de esta sección)',
        },
        description: {
          en: 'This module provides critical information on keeping children safe.',
          es: 'Este módulo proporciona información importante sobre cómo mantener a los niños seguros.',
        },
        overviewLink: {
          en: 'Overview Link:',
          es: 'Enlace de descripción general:',
        },
        overviewUrl: {
          en: 'https://headstart.gov/safety-practices/article/child-safety',
          es: 'https://headstart.gov/es/safety-practices/article/seguridad-infantil',
        },
        clickInstruction: {
          en: 'From this page, click on each topic below to view the specific video or resource.',
          es: 'Desde esta página, haga clic en cada tema a continuación para ver el video o recurso específico.',
        },
        topicsTitle: {
          en: 'Topics & Estimated Times:',
          es: 'Temas y tiempos estimados:',
        },
        abusiveHeadTrauma: {
          en: 'Abusive Head Trauma (Video): ~6 minutes',
          es: 'Traumatismo craneoencefálico por maltrato (vídeo): ~6 minutos',
        },
        childAbuse: {
          en: 'Child Abuse and Maltreatment (Video): ~7 minutes',
          es: 'Abuso y maltrato infantil (Video): ~7 minutos',
        },
        childDevelopment: {
          en: 'Child Development (Video): ~7 minutes',
          es: 'Desarrollo infantil (vídeo): ~7 minutos',
        },
        medicationAdmin: {
          en: 'Medication Administration (Video): ~7 minutes',
          es: 'Administración de medicamentos (video): ~7 minutos',
        },
        foodAllergies: {
          en: 'Food Allergies (Video): ~7 minutes',
          es: 'Alergias alimentarias (vídeo): ~7 minutos',
        },
      },
      section3: {
        title: {
          en: 'Section 3: Safe Sleep for Infants (Videos & Readings)',
          es: 'Sección 3: Sueño seguro para bebés (Videos y lecturas)',
        },
        estimatedTime: {
          en: 'Estimated Time: Approximately 30 minutes',
          es: 'Tiempo estimado: Aproximadamente 30 minutos',
        },
        description: {
          en: 'Learn vital information to ensure a safe sleep environment for infants and reduce risks.',
          es: 'Conozca información vital para garantizar un ambiente de sueño seguro para los bebés y reducir los riesgos.',
        },
        nihResources: {
          en: 'NIH Safe to Sleep® Campaign Resources (Readings):',
          es: 'Recursos de la campaña "Seguro para dormir®" de NIH (lecturas):',
        },
        link: {
          en: 'Link:',
          es: 'Enlace:',
        },
        nihUrl: {
          en: 'https://safetosleep.nichd.nih.gov/safe-sleep',
          es: 'https://espanol.nichd.nih.gov/actividades-proyectos/sts',
        },
        estimatedTimeReading: {
          en: 'Estimated Time: ~20-30 minutes:',
          es: 'Tiempo estimado: 20-30 minutos:',
        },
        reducingRisk: {
          en: 'Reducing Risk',
          es: 'Reducción de riesgo',
        },
        backSleeping: {
          en: 'Back Sleeping',
          es: 'Dormir boca arriba',
        },
        environment: {
          en: 'Environment (safe cribs, no loose bedding)',
          es: 'Ambiente (cunas seguras, sin ropa de cama suelta)',
        },
        tummyTime: {
          en: 'Tummy Time (for development, while not sleep-related, often covered with SIDS)',
          es: 'Tiempo boca abajo (para el desarrollo, aunque no esté relacionado con el sueño, a menudo se cubre con SMSL (Síndrome de Muerte Súbita del Lactante)',
        },
        faq: {
          en: 'FAQ',
          es: 'Preguntas frecuentes',
        },
      },
      section4: {
        title: {
          en: 'Section 4: Home Safety & Injury Prevention (Readings)',
          es: 'Sección 4: Seguridad en el hogar y prevención de lesiones (Lecturas)',
        },
        estimatedTime: {
          en: 'Estimated Time: Approximately 45 minutes - 1 hour',
          es: 'Tiempo estimado: Aproximadamente 45 minutos - 1 hora',
        },
        description: {
          en: 'Ensure the care environment is safe and free from common hazards.',
          es: 'Asegúrese de que el ambiente de atención sea seguro y libre de riesgos comunes.',
        },
        topicsTitle: {
          en: 'Topics & Estimated Times:',
          es: 'Temas y tiempos estimados:',
        },
        injuryPrevention: {
          en: 'Injury Prevention Starts at Home',
          es: 'La prevención de lesiones comienza en casa',
        },
        poisoningPrevention: {
          en: 'Poisoning Prevention Home Safety Tip Sheet',
          es: 'Hoja de consejos de seguridad para el hogar para prevenir intoxicaciones',
        },
        homeSafety: {
          en: 'Home Safety',
          es: 'Seguridad en el hogar',
        },
        healthTips: {
          en: 'Health Tips for Families Series',
          es: 'Serie de consejos de salud para familias',
        },
        timeEstimate: {
          en: ': ~10-15 minutes',
          es: ': ~10-15 minutos',
        },
      },
      toastSuccess: {
        en: 'Training status updated',
        es: 'Estado de capacitación actualizado',
      },
      centerNotRequired: {
        en: 'Training resources are not required for licensed childcare centers.',
        es: 'Los recursos de capacitación no son requeridos para los centros de cuidado infantil con licencia.',
      },
    },
    inviteFamilyPage: {
      header: {
        en: 'Invite Family',
        es: 'Invitar Familia',
      },
      emailError: emailError,
      phoneError: phoneError,
      successMessage: successMessage,
      cancelButton: cancelButton,
      submitButton: submitButton,
      confirmationPage: {
        backButton: returnHomeButton,
      },
    },
    attendance: {
      ...attendance,
      description: {
        en: 'Please confirm the hours of care you provided for each child for the week. If you did not provide care, please enter 0.',
        es: 'Confirme las horas de cuidado que proporcionó para cada niño para la semana. Si no proporcionó cuidado, ingrese 0.',
      },
    },
  },
  general: {
    lanuageSwitcher: {
      languages: {
        en: 'Languages',
        es: 'Idiomas',
      },
    },
    loadingPage: {
      loading: {
        en: 'Loading...',
        es: 'Cargando...',
      },
    },
    banner: {
      actionRequired: {
        en: 'ACTION REQUIRED: ',
        es: 'ACCIÓN REQUERIDA: ',
      },
    },
    notFoundPage: {
      fourOhFour: {
        en: '404',
        es: '404',
      },
      notFound: {
        en: 'Page Not Found',
        es: 'Página No Encontrada',
      },
      notFoundDescription: {
        en: 'The page you are looking for does not exist.',
        es: 'La página que estás buscando no existe.',
      },
      goBack: {
        en: 'Go Back',
        es: 'Volver Atrás',
      },
    },
    errorFallback: {
      somethingWentWrong: {
        en: 'Something went wrong',
        es: 'Algo salió mal',
      },
      weHaveNotified: {
        en: 'We have been notified and are working to fix the issue.',
        es: 'Hemos sido notificados y estamos trabajando para solucionar el problema.',
      },
      tryAgain: {
        en: 'Try again',
        es: 'Intenta de nuevo',
      },
      goHome: {
        en: 'Go home',
        es: 'Ir a la página de inicio',
      },
    },
    emptyState: {
      noTransactionsTitle: {
        en: 'No Transactions Yet',
        es: 'Aún no hay transacciones',
      },
      noTransactionsDescription: {
        en: 'Once you have transactions, they will appear here.',
        es: 'Una vez que tengas transacciones, aparecerán aquí.',
      },
      noPaymentsTitle: {
        en: 'No Payments',
        es: 'Sin Pagos',
      },
      noFamilyPaymentsDescription: {
        en: "You haven't made any payments yet.",
        es: 'Aún no has realizado ningún pago.',
      },
      noProviderPaymentsDescription: {
        en: "You haven't received any payments yet.",
        es: 'Aún no has recibido ningún pago.',
      },
      noChildrenTitle: {
        en: 'No Children Yet',
        es: 'Aún no hay niños',
      },
      noChildrenDescription: {
        en: 'Once you add children, they will appear here.',
        es: 'Una vez que agregues niños, aparecerán aquí.',
      },
      noProvidersTitle: {
        en: 'No Providers Yet',
        es: 'Aún no hay proveedores',
      },
      noProvidersDescription: {
        en: 'Once you add providers, they will appear here. Add your providers below.',
        es: 'Una vez que agregues proveedores, aparecerán aquí. Agrega tus proveedores a continuación.',
      },
      noProvidersAddProvider: {
        en: 'To get started, add your childcare center or invite a new caregiver.',
        es: 'Para comenzar, agrega tu centro de cuidado infantil o invita a un nuevo cuidador.',
      },
      addYourProvider: {
        en: '+ Add your provider',
        es: '+ Agregar tu proveedor',
      },
    },
    inviteInputs: {
      emailLabel: {
        en: 'Email',
        es: 'Correo Electrónico',
      },
      phoneLabel: {
        en: 'Phone',
        es: 'Teléfono',
      },
      langLabel: {
        en: 'What language should the invite be sent in?',
        es: '¿Qué idioma debe ser el mensaje de invitación?',
      },
      langPlaceholder: {
        en: 'Select Language',
        es: 'Seleccionar Idioma',
      },
      languageOptions: translatedLanguages,
    },
    inviteConfirmation: {
      header: {
        en: 'Invitation Sent',
        es: 'Invitación Enviada',
      },
      successMessage: {
        en: 'An invitation has been sent to the following email and phone number.',
        es: 'Se ha enviado una invitación al siguiente correo electrónico y número de teléfono.',
      },
      emailLabel: {
        en: 'Email:',
        es: 'Correo Electrónico:',
      },
      phoneLabel: {
        en: 'Phone:',
        es: 'Teléfono:',
      },
      backButton: {
        en: 'Back to Providers',
        es: 'Volver a Proveedores',
      },
    },
    paymentHistory: {
      child: {
        en: 'Child',
        es: 'Niño',
      },
      family: {
        en: 'Family',
        es: 'Familia',
      },
      fromAllocationMonth: {
        en: 'Allocation Month',
        es: 'Mes de Asignación',
      },
      paymentMethod: {
        en: 'Payment Method',
        es: 'Método de Pago',
      },
      status: paymentStatuses,
    },
    offlinePage: {
      title: {
        en: 'You are offline!',
        es: '¡Estás desconectado!',
      },
      message: {
        en: 'It looks like you are offline. Please check your internet connection.',
        es: 'Parece que estás desconectado. Por favor, revisa tu conexión a Internet.',
      },
    },
    attendanceInput: {
      inputPlaceholder: {
        en: 'Total Hours of Care',
        es: 'Horas de Cuidado Totales',
      },
      required: {
        en: 'This field is required',
        es: 'Este campo es obligatorio',
      },
    },
  },
  invite: {
    provider: {
      header: {
        en: ' wants to add you as a provider for ',
        es: ' quiere agregarte como proveedor para ',
      },
      dontHaveAccount: {
        en: 'If you don’t have an account, you need to apply using the button below.',
        es: 'Si no tienes una cuenta, necesitas aplicar usando el botón de abajo.',
      },
      dontHaveAccountButton: {
        en: 'Apply',
        es: 'Aplicar',
      },
      signIn: {
        en: 'If you have an account, you can sign in using the button below.',
        es: 'Si tienes una cuenta, puedes iniciar sesión usando el botón de abajo.',
      },
      signInButton: signInButton,
      alreadySignedIn: {
        en: 'Would you like to add this family?',
        es: '¿Deseas agregar esta familia?',
      },
      alreadySignedInButton: {
        en: 'Add',
        es: 'Agregar',
      },
      accepted: {
        en: 'You have already successfully added this family.',
        es: 'Ya has agregado exitosamente esta familia.',
      },
      toHome: returnHomeButton,
      successMessage: {
        en: 'Successfully added family as a provider.',
        es: 'Agregada exitosamente a la familia como proveedor.',
      },
      alreadyCaringFor: {
        en: 'You are already caring for this child.',
        es: 'Ya estás cuidando a este niño.',
      },
      atMaxChildCount: {
        en: 'You have reached the maximum number of children you can care for.',
        es: 'Has alcanzado el número máximo de niños que puedes cuidar.',
      },
      notProvider: {
        en: 'Oops! This account isn’t set up as a provider yet. You’ll need to become a provider to accept family invites and get paid for childcare.',
        es: '¡Oops! Esta cuenta aún no está configurada como proveedor. Necesitarás convertirte en proveedor para aceptar invitaciones familiares y recibir pagos por el cuidado infantil.',
      },
    },
    family: {
      header: {
        en: ' wants to add you as a family to provide child care for!',
        es: ' quiere agregarlos como familia para el cuidado infantil.',
      },
      joinNow: {
        en: 'Join now by creating your account and applying!',
        es: '¡Únase ahora creando su cuenta y aplicando!',
      },
      applyButton: {
        en: 'Apply',
        es: 'Aplicar',
      },
      alreadyHaveAccount: {
        en: 'Join now by signing into your account!',
        es: '¡Únase ahora iniciando sesión en su cuenta!',
      },
      signInButton: signInButton,
      noChildren: {
        en: "Seems like you don't have any children to select child care for. Apply now as a family to start receiving child care.",
        es: 'Parece que no tiene hijos para seleccionar el cuidado infantil. Aplique ahora como familia para comenzar a recibir cuidado infantil.',
      },
      toHome: returnHomeButton,
      alreadyAccepted: {
        part1: {
          en: "You're all set! You have successfully connected with ",
          es: '¡Listo! Se ha conectado con ',
        },
        part2: {
          en: " for your family's childcare needs.",
          es: ' para el cuidado infantil de su familia.',
        },
      },
      selectChildren: {
        part1: {
          en: 'Almost there! To accept the childcare services from ',
          es: '¡Ya casi! Para aceptar los servicios de cuidado infantil de ',
        },
        part2: {
          en: ', please select the child(ren) who will be receiving care.',
          es: ', seleccione el/los niño(s) que recibirán cuidado infantil.',
        },
      },
      noSlotsRemaining: {
        en: 'Sorry, there are no more childcare slots available for this provider.',
        es: 'Lo sentimos, no hay más espacios de cuidado infantil disponibles para este proveedor.',
      },
      maxSlotsReached: {
        part1: {
          en: 'This provider can only accept ',
          es: 'Este proveedor solo puede aceptar ',
        },
        part2: {
          en: ' more child(ren)',
          es: ' más niño(s)',
        },
      },
      acceptButton: {
        en: 'Accept Invitation',
        es: 'Aceptar Invitación',
      },
      selectChildrenError: {
        en: 'Please select at least one child',
        es: 'Por favor selecciona al menos un niño',
      },
    },
  },
} as const
