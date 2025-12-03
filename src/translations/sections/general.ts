import { paymentStatuses, translatedLanguages } from './utils'

export const generalTranslations = {
  lanuageSwitcher: {
    languages: {
      en: 'Languages',
      es: 'Idiomas',
      ru: 'Языки',
      ar: 'اللغات',
    },
  },
  loadingPage: {
    loading: {
      en: 'Loading...',
      es: 'Cargando...',
      ru: 'Загрузка...',
      ar: 'جارٍ التحميل...',
    },
  },
  banner: {
    actionRequired: {
      en: 'ACTION REQUIRED: ',
      es: 'ACCIÓN REQUERIDA: ',
      ru: 'ТРЕБУЕТСЯ ДЕЙСТВИЕ: ',
      ar: 'إجراء مطلوب: ',
    },
  },
  notFoundPage: {
    fourOhFour: {
      en: '404',
      es: '404',
      ru: '404',
      ar: '404',
    },
    notFound: {
      en: 'Page Not Found',
      es: 'Página No Encontrada',
      ru: 'Страница не найдена',
      ar: 'الصفحة غير موجودة',
    },
    notFoundDescription: {
      en: 'The page you are looking for does not exist.',
      es: 'La página que estás buscando no existe.',
      ru: 'Страница, которую вы ищете, не существует.',
      ar: 'الصفحة التي تبحث عنها غير موجودة.',
    },
    goBack: {
      en: 'Go Back',
      es: 'Volver Atrás',
      ru: 'Вернуться назад',
      ar: 'العودة',
    },
  },
  errorFallback: {
    somethingWentWrong: {
      en: 'Something went wrong',
      es: 'Algo salió mal',
      ru: 'Что-то пошло не так',
      ar: 'حدث خطأ ما',
    },
    weHaveNotified: {
      en: 'We have been notified and are working to fix the issue.',
      es: 'Hemos sido notificados y estamos trabajando para solucionar el problema.',
      ru: 'Мы получили уведомление и работаем над исправлением проблемы.',
      ar: 'تم إخطارنا ونعمل على إصلاح المشكلة.',
    },
    tryAgain: {
      en: 'Try again',
      es: 'Intenta de nuevo',
      ru: 'Попробовать снова',
      ar: 'حاول مرة أخرى',
    },
    goHome: {
      en: 'Go home',
      es: 'Ir a la página de inicio',
      ru: 'На главную',
      ar: 'الذهاب للرئيسية',
    },
  },
  emptyState: {
    noTransactionsTitle: {
      en: 'No Transactions Yet',
      es: 'Aún no hay transacciones',
      ru: 'Пока нет транзакций',
      ar: 'لا توجد معاملات بعد',
    },
    noTransactionsDescription: {
      en: 'Once you have transactions, they will appear here.',
      es: 'Una vez que tengas transacciones, aparecerán aquí.',
      ru: 'Когда появятся транзакции, они будут отображаться здесь.',
      ar: 'بمجرد إجراء معاملات، ستظهر هنا.',
    },
    noPaymentsTitle: {
      en: 'No Payments',
      es: 'Sin Pagos',
      ru: 'Нет платежей',
      ar: 'لا توجد مدفوعات',
    },
    noFamilyPaymentsDescription: {
      en: "You haven't made any payments yet.",
      es: 'Aún no has realizado ningún pago.',
      ru: 'Вы ещё не совершали платежей.',
      ar: 'لم تقم بأي مدفوعات بعد.',
    },
    noProviderPaymentsDescription: {
      en: "You haven't received any payments yet.",
      es: 'Aún no has recibido ningún pago.',
      ru: 'Вы ещё не получали платежей.',
      ar: 'لم تتلق أي مدفوعات بعد.',
    },
    noChildrenTitle: {
      en: 'No Children Yet',
      es: 'Aún no hay niños',
      ru: 'Пока нет детей',
      ar: 'لا يوجد أطفال بعد',
    },
    noChildrenDescription: {
      en: 'Once you add children, they will appear here.',
      es: 'Una vez que agregues niños, aparecerán aquí.',
      ru: 'Когда вы добавите детей, они появятся здесь.',
      ar: 'بمجرد إضافة أطفال، سيظهرون هنا.',
    },
    noProvidersTitle: {
      en: 'No Providers Yet',
      es: 'Aún no hay proveedores',
      ru: 'Пока нет поставщиков',
      ar: 'لا يوجد مزودون بعد',
    },
    noProvidersDescription: {
      en: 'Once you add providers, they will appear here. Add your providers below.',
      es: 'Una vez que agregues proveedores, aparecerán aquí. Agrega tus proveedores a continuación.',
      ru: 'Когда вы добавите поставщиков, они появятся здесь. Добавьте своих поставщиков ниже.',
      ar: 'بمجرد إضافة مزودين، سيظهرون هنا. أضف مزوديك أدناه.',
    },
    noProvidersAddProvider: {
      part1: {
        en: 'To get started, add your childcare center or invite a new caregiver. If you are looking for a new provider, you can find licensed childcare centers or homes on ',
        es: 'Para comenzar, agrega tu centro de cuidado infantil o invita a un nuevo cuidador. Si estás buscando un nuevo proveedor, puedes encontrar centros de cuidado infantil autorizados u hogares en ',
        ru: 'Для начала добавьте детский центр или пригласите нового воспитателя. Если вы ищете нового поставщика, вы можете найти лицензированные детские центры или дома на ',
        ar: 'للبدء، أضف مركز رعاية الأطفال الخاص بك أو قم بدعوة مقدم رعاية جديد. إذا كنت تبحث عن مزود جديد، يمكنك العثور على مراكز رعاية الأطفال المرخصة أو المنازل على ',
      },
      coloradoShinesText: {
        en: 'Colorado Shines',
        es: 'Colorado Shines',
        ru: 'Colorado Shines',
        ar: 'Colorado Shines',
      },
      part2: {
        en: '.',
        es: '.',
        ru: '.',
        ar: '.',
      },
    },
    addYourProvider: {
      en: '+ Add your provider',
      es: '+ Agregar tu proveedor',
      ru: '+ Добавить поставщика',
      ar: '+ إضافة مزودك',
    },
  },
  inviteInputs: {
    emailLabel: {
      en: 'Email',
      es: 'Correo Electrónico',
      ru: 'Электронная почта',
      ar: 'البريد الإلكتروني',
    },
    phoneLabel: {
      en: 'Phone',
      es: 'Teléfono',
      ru: 'Телефон',
      ar: 'الهاتف',
    },
    langLabel: {
      en: 'What language should the invite be sent in?',
      es: '¿Qué idioma debe ser el mensaje de invitación?',
      ru: 'На каком языке должно быть отправлено приглашение?',
      ar: 'بأي لغة يجب إرسال الدعوة؟',
    },
    langPlaceholder: {
      en: 'Select Language',
      es: 'Seleccionar Idioma',
      ru: 'Выберите язык',
      ar: 'اختر اللغة',
    },
    languageOptions: translatedLanguages,
  },
  inviteConfirmation: {
    header: {
      en: 'Invitation Sent',
      es: 'Invitación Enviada',
      ru: 'Приглашение отправлено',
      ar: 'تم إرسال الدعوة',
    },
    successMessage: {
      en: 'An invitation has been sent to the following email and phone number:',
      es: 'Se ha enviado una invitación al siguiente correo electrónico y número de teléfono.',
      ru: 'Приглашение было отправлено на следующий адрес электронной почты и номер телефона:',
      ar: 'تم إرسال دعوة إلى البريد الإلكتروني ورقم الهاتف التاليين:',
    },
    emailLabel: {
      en: 'Email:',
      es: 'Correo Electrónico:',
      ru: 'Электронная почта:',
      ar: 'البريد الإلكتروني:',
    },
    phoneLabel: {
      en: 'Phone:',
      es: 'Teléfono:',
      ru: 'Телефон:',
      ar: 'الهاتف:',
    },
    backButton: {
      en: 'Back to Providers',
      es: 'Volver a Proveedores',
      ru: 'Вернуться к поставщикам',
      ar: 'العودة إلى المزودين',
    },
    inviteeNextStep: {
      en: "Your invitee's next step is to complete a CAP application.",
      es: 'El siguiente paso de su invitado es completar una solicitud de CAP.',
      ru: 'Следующий шаг для приглашённого — заполнить заявку CAP.',
      ar: 'الخطوة التالية لمدعوك هي إكمال طلب CAP.',
    },
  },
  paymentHistory: {
    child: {
      en: 'Child',
      es: 'Niño',
      ru: 'Ребёнок',
      ar: 'الطفل',
    },
    family: {
      en: 'Family',
      es: 'Familia',
      ru: 'Семья',
      ar: 'العائلة',
    },
    fromAllocationMonth: {
      en: 'Allocation Month',
      es: 'Mes de Asignación',
      ru: 'Месяц распределения',
      ar: 'شهر التخصيص',
    },
    paymentMethod: {
      en: 'Payment Method',
      es: 'Método de Pago',
      ru: 'Способ оплаты',
      ar: 'طريقة الدفع',
    },
    status: paymentStatuses,
  },
  offlinePage: {
    title: {
      en: 'You are offline!',
      es: '¡Estás desconectado!',
      ru: 'Вы не в сети!',
      ar: 'أنت غير متصل!',
    },
    message: {
      en: 'It looks like you are offline. Please check your internet connection.',
      es: 'Parece que estás desconectado. Por favor, revisa tu conexión a Internet.',
      ru: 'Похоже, вы не в сети. Проверьте подключение к интернету.',
      ar: 'يبدو أنك غير متصل. يرجى التحقق من اتصالك بالإنترنت.',
    },
  },
  notAuthorizedPage: {
    title: {
      en: 'You are not authorized to access this resource',
      es: 'No estás autorizado para acceder a este recurso',
      ru: 'У вас нет прав доступа к этому ресурсу',
      ar: 'غير مصرح لك بالوصول إلى هذا المورد',
    },
    message: {
      en: 'It looks like you do not have access to the CAP Colorado Portal. To gain access you must complete the CAP Colorado application process.',
      es: 'Parece que no tienes acceso al Portal de CAP Colorado. Para obtener acceso, debes completar el proceso de solicitud de CAP Colorado.',
      ru: 'Похоже, у вас нет доступа к порталу CAP Colorado. Для получения доступа необходимо завершить процесс подачи заявки CAP Colorado.',
      ar: 'يبدو أنك لا تملك حق الوصول إلى بوابة CAP Colorado. للحصول على حق الوصول، يجب عليك إكمال عملية التقديم لـ CAP Colorado.',
    },
    link: {
      en: 'Visit the CAP Colorado website for more information',
      es: 'Visite el sitio web de CAP Colorado para más información',
      ru: 'Посетите сайт CAP Colorado для получения дополнительной информации',
      ar: 'قم بزيارة موقع CAP Colorado للحصول على مزيد من المعلومات',
    },
  },
  attendanceInput: {
    fullDayInputPlaceholder: {
      en: 'Full Days',
      es: 'Días Completos',
      ru: 'Полные дни',
      ar: 'أيام كاملة',
    },
    halfDayInputPlaceholder: {
      en: 'Half Days',
      es: 'Media Horas',
      ru: 'Полудни',
      ar: 'أنصاف أيام',
    },
    required: {
      en: 'This field is required',
      es: 'Este campo es obligatorio',
      ru: 'Это поле обязательно',
      ar: 'هذا الحقل مطلوب',
    },
  },
} as const
