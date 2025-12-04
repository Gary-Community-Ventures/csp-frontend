import { signInButton, returnHomeButton } from './utils'

export const inviteTranslations = {
  provider: {
    header: {
      en: ' wants to add you as a provider for ',
      es: ' quiere agregarte como proveedor para ',
      ru: ' хочет добавить вас как поставщика для ',
      ar: ' يريد إضافتك كمزود لـ ',
    },
    dontHaveAccount: {
      en: "If you don't have an account, you need to apply using the button below.",
      es: 'Si no tienes una cuenta, necesitas aplicar usando el botón de abajo.',
      ru: 'Если у вас нет аккаунта, вам нужно подать заявку, используя кнопку ниже.',
      ar: 'إذا لم يكن لديك حساب، تحتاج إلى التقديم باستخدام الزر أدناه.',
    },
    dontHaveAccountButton: {
      en: 'Apply',
      es: 'Aplicar',
      ru: 'Подать заявку',
      ar: 'تقديم',
    },
    signIn: {
      en: 'If you have an account, you can sign in using the button below.',
      es: 'Si tienes una cuenta, puedes iniciar sesión usando el botón de abajo.',
      ru: 'Если у вас есть аккаунт, вы можете войти, используя кнопку ниже.',
      ar: 'إذا كان لديك حساب، يمكنك تسجيل الدخول باستخدام الزر أدناه.',
    },
    signInButton: signInButton,
    alreadySignedIn: {
      en: 'Would you like to add this family?',
      es: '¿Deseas agregar esta familia?',
      ru: 'Хотите добавить эту семью?',
      ar: 'هل تريد إضافة هذه العائلة؟',
    },
    alreadySignedInButton: {
      en: 'Add',
      es: 'Agregar',
      ru: 'Добавить',
      ar: 'إضافة',
    },
    accepted: {
      en: 'You have already successfully added this family.',
      es: 'Ya has agregado exitosamente esta familia.',
      ru: 'Вы уже успешно добавили эту семью.',
      ar: 'لقد أضفت هذه العائلة بنجاح بالفعل.',
    },
    toHome: returnHomeButton,
    successMessage: {
      en: 'Successfully added family as a provider.',
      es: 'Agregada exitosamente a la familia como proveedor.',
      ru: 'Семья успешно добавлена как поставщик.',
      ar: 'تمت إضافة العائلة كمزود بنجاح.',
    },
    alreadyCaringFor: {
      en: 'You are already caring for this child.',
      es: 'Ya estás cuidando a este niño.',
      ru: 'Вы уже ухаживаете за этим ребёнком.',
      ar: 'أنت تعتني بهذا الطفل بالفعل.',
    },
    atMaxChildCount: {
      en: 'You have reached the maximum number of children you can care for.',
      es: 'Has alcanzado el número máximo de niños que puedes cuidar.',
      ru: 'Вы достигли максимального количества детей, за которыми можете ухаживать.',
      ar: 'لقد وصلت إلى الحد الأقصى لعدد الأطفال الذين يمكنك رعايتهم.',
    },
    notProvider: {
      en: "Oops! This account isn't set up as a provider yet. You'll need to become a provider to accept family invites and get paid for childcare.",
      es: '¡Oops! Esta cuenta aún no está configurada como proveedor. Necesitarás convertirte en proveedor para aceptar invitaciones familiares y recibir pagos por el cuidado infantil.',
      ru: 'Упс! Этот аккаунт ещё не настроен как поставщик. Вам нужно стать поставщиком, чтобы принимать приглашения от семей и получать оплату за уход за детьми.',
      ar: 'عفوًا! هذا الحساب غير مُعد كمزود بعد. ستحتاج إلى أن تصبح مزودًا لقبول دعوات العائلات والحصول على أجر مقابل رعاية الأطفال.',
    },
  },
  family: {
    header: {
      en: ' wants to add you as a family to provide child care for!',
      es: ' quiere agregarlos como familia para el cuidado infantil.',
      ru: ' хочет добавить вас как семью для предоставления ухода за детьми!',
      ar: ' يريد إضافتك كعائلة لتقديم رعاية الأطفال!',
    },
    joinNow: {
      en: 'Join now by creating your account and applying!',
      es: '¡Únase ahora creando su cuenta y aplicando!',
      ru: 'Присоединяйтесь сейчас, создав аккаунт и подав заявку!',
      ar: 'انضم الآن عن طريق إنشاء حسابك والتقديم!',
    },
    applyButton: {
      en: 'Apply',
      es: 'Aplicar',
      ru: 'Подать заявку',
      ar: 'تقديم',
    },
    alreadyHaveAccount: {
      en: 'Join now by signing into your account!',
      es: '¡Únase ahora iniciando sesión en su cuenta!',
      ru: 'Присоединяйтесь, войдя в свой аккаунт!',
      ar: 'انضم الآن عن طريق تسجيل الدخول إلى حسابك!',
    },
    signInButton: signInButton,
    noChildren: {
      en: "Seems like you don't have any children to select child care for. Apply now as a family to start receiving child care.",
      es: 'Parece que no tiene hijos para seleccionar el cuidado infantil. Aplique ahora como familia para comenzar a recibir cuidado infantil.',
      ru: 'Похоже, у вас нет детей для выбора ухода. Подайте заявку как семья, чтобы начать получать уход за детьми.',
      ar: 'يبدو أنه ليس لديك أطفال لاختيار رعاية الأطفال لهم. قدم الآن كعائلة لبدء تلقي رعاية الأطفال.',
    },
    toHome: returnHomeButton,
    alreadyAccepted: {
      part1: {
        en: "You're all set! You have successfully connected with ",
        es: '¡Listo! Se ha conectado con ',
        ru: 'Всё готово! Вы успешно связались с ',
        ar: 'أنت جاهز! لقد تواصلت بنجاح مع ',
      },
      part2: {
        en: " for your family's childcare needs.",
        es: ' para el cuidado infantil de su familia.',
        ru: ' для потребностей вашей семьи в уходе за детьми.',
        ar: ' لاحتياجات رعاية أطفال عائلتك.',
      },
    },
    selectChildren: {
      part1: {
        en: 'Almost there! To accept the childcare services from ',
        es: '¡Ya casi! Para aceptar los servicios de cuidado infantil de ',
        ru: 'Почти готово! Чтобы принять услуги по уходу за детьми от ',
        ar: 'أوشكت على الانتهاء! لقبول خدمات رعاية الأطفال من ',
      },
      part2: {
        en: ', please select the child(ren) who will be receiving care.',
        es: ', seleccione el/los niño(s) que recibirán cuidado infantil.',
        ru: ', выберите ребёнка (детей), которые будут получать уход.',
        ar: '، يرجى اختيار الطفل (الأطفال) الذين سيتلقون الرعاية.',
      },
    },
    noSlotsRemaining: {
      en: 'Sorry, there are no more childcare slots available for this provider.',
      es: 'Lo sentimos, no hay más espacios de cuidado infantil disponibles para este proveedor.',
      ru: 'К сожалению, у этого поставщика больше нет свободных мест для ухода за детьми.',
      ar: 'عذرًا، لا توجد أماكن متاحة لرعاية الأطفال لدى هذا المزود.',
    },
    maxSlotsReached: {
      part1: {
        en: 'This provider can only accept ',
        es: 'Este proveedor solo puede aceptar ',
        ru: 'Этот поставщик может принять только ',
        ar: 'يمكن لهذا المزود قبول ',
      },
      part2: {
        en: ' more child(ren)',
        es: ' más niño(s)',
        ru: ' ещё ребёнка (детей)',
        ar: ' طفل (أطفال) إضافي',
      },
    },
    acceptButton: {
      en: 'Accept Invitation',
      es: 'Aceptar Invitación',
      ru: 'Принять приглашение',
      ar: 'قبول الدعوة',
    },
    selectChildrenError: {
      en: 'Please select at least one child',
      es: 'Por favor selecciona al menos un niño',
      ru: 'Пожалуйста, выберите хотя бы одного ребёнка',
      ar: 'يرجى اختيار طفل واحد على الأقل',
    },
  },
} as const
