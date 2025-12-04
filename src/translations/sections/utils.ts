export const generalNavBar = {
  menu: {
    support: {
      en: 'Help/Support',
      es: 'Ayuda/Apoyo',
      ru: 'Помощь/Поддержка',
      ar: 'مساعدة/دعم',
    },
    supportLinks: {
      en: 'https://www.capcolorado.org/en/contact',
      es: 'https://www.capcolorado.org/es/contact',
      ru: 'https://www.capcolorado.org/en/contact',
      ar: 'https://www.capcolorado.org/en/contact',
    },
    yourProfile: {
      en: 'Your Profile',
      es: 'Tu Perfil',
      ru: 'Ваш профиль',
      ar: 'ملفك الشخصي',
    },
    signOut: {
      en: 'Sign Out',
      es: 'Cerrar Sesión',
      ru: 'Выйти',
      ar: 'تسجيل الخروج',
    },
  },
  links: {
    home: {
      en: 'Home',
      es: 'Inicio',
      ru: 'Главная',
      ar: 'الرئيسية',
    },
    messages: {
      en: 'Messages',
      es: 'Mensajes',
      ru: 'Сообщения',
      ar: 'الرسائل',
    },
    activity: {
      en: 'Activity',
      es: 'Actividad',
      ru: 'Активность',
      ar: 'النشاط',
    },
  },
} as const

export const statuses = {
  approved: {
    en: 'Approved',
    es: 'Aprobado',
    ru: 'Одобрено',
    ar: 'موافق عليه',
  },
  pending: {
    en: 'Pending',
    es: 'Pendiente',
    ru: 'В ожидании',
    ar: 'قيد الانتظار',
  },
  denied: {
    en: 'Denied',
    es: 'Denegado',
    ru: 'Отклонено',
    ar: 'مرفوض',
  },
} as const

export const paymentStatuses = {
  success: {
    en: 'Success',
    es: 'Exitoso',
    ru: 'Успешно',
    ar: 'ناجح',
  },
  failed: {
    en: 'Failed',
    es: 'Fallido',
    ru: 'Неудачно',
    ar: 'فشل',
  },
  pending: {
    en: 'Pending',
    es: 'Pendiente',
    ru: 'В ожидании',
    ar: 'قيد الانتظار',
  },
} as const

export const submitButton = {
  en: 'Submit',
  es: 'Enviar',
  ru: 'Отправить',
  ar: 'إرسال',
} as const

export const submittingButton = {
  en: 'Submitting...',
  es: 'Enviando...',
  ru: 'Отправка...',
  ar: 'جارٍ الإرسال...',
} as const

export const cancelButton = {
  en: 'Cancel',
  es: 'Cancelar',
  ru: 'Отмена',
  ar: 'إلغاء',
} as const

export const successMessage = {
  en: 'Invite sent successfully',
  es: 'Invitación enviada exitosamente',
  ru: 'Приглашение успешно отправлено',
  ar: 'تم إرسال الدعوة بنجاح',
} as const

export const emailError = {
  en: 'Please enter a valid email address',
  es: 'Por favor ingresa un correo electrónico válido',
  ru: 'Пожалуйста, введите действительный адрес электронной почты',
  ar: 'يرجى إدخال عنوان بريد إلكتروني صالح',
} as const

export const phoneError = {
  en: 'Please enter a valid phone number',
  es: 'Por favor ingresa un número de teléfono válido',
  ru: 'Пожалуйста, введите действительный номер телефона',
  ar: 'يرجى إدخال رقم هاتف صالح',
} as const

export const signInButton = {
  en: 'Sign in',
  es: 'Iniciar sesión',
  ru: 'Войти',
  ar: 'تسجيل الدخول',
} as const

export const returnHomeButton = {
  en: 'Return home',
  es: 'Volver a inicio',
  ru: 'Вернуться на главную',
  ar: 'العودة للرئيسية',
} as const

export const translatedLanguages = {
  en: {
    en: 'English',
    es: 'Inglés',
    ru: 'Английский',
    ar: 'الإنجليزية',
  },
  es: {
    en: 'Spanish',
    es: 'Español',
    ru: 'Испанский',
    ar: 'الإسبانية',
  },
  ru: {
    en: 'Russian',
    es: 'Ruso',
    ru: 'Русский',
    ar: 'الروسية',
  },
  ar: {
    en: 'Arabic',
    es: 'Árabe',
    ru: 'Арабский',
    ar: 'العربية',
  },
} as const

export const notificationBanner = {
  applicationPending: {
    en: 'Application awaiting approval',
    es: 'Solicitud pendiente de aprobación',
    ru: 'Заявка ожидает одобрения',
    ar: 'الطلب في انتظار الموافقة',
  },
  attendance: {
    en: 'Submit your care days for last week',
    es: 'Envía tus horas de cuidado para la última semana',
    ru: 'Отправьте данные о днях ухода за прошлую неделю',
    ar: 'أرسل أيام الرعاية الخاصة بك للأسبوع الماضي',
  },
} as const

export const attendance = {
  header: {
    en: 'Log Your Care',
    es: 'Registre Tu Asistencia',
    ru: 'Зарегистрируйте уход',
    ar: 'سجّل رعايتك',
  },
  success: {
    en: 'Attendance submitted successfully',
    es: 'Asistencia enviada exitosamente',
    ru: 'Посещаемость успешно отправлена',
    ar: 'تم إرسال الحضور بنجاح',
  },
  allSet: {
    en: 'All of your attendance has been submitted.',
    es: 'Toda tu asistencia ha sido enviada.',
    ru: 'Все данные о посещаемости отправлены.',
    ar: 'تم إرسال جميع بيانات حضورك.',
  },
  returnHome: returnHomeButton,
  submit: submitButton,
} as const
