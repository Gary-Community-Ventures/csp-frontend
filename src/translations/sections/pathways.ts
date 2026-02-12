const sharedResources = {
  title: {
    en: 'Child Development Tracking with Pathways',
    es: 'Seguimiento del Desarrollo Infantil con Pathways',
    ru: 'Отслеживание Развития Ребёнка с Pathways',
    ar: 'تتبع تطور الطفل مع Pathways',
  },
  whatIsIt: {
    title: {
      en: 'What is it?',
      es: '¿Qué es?',
      ru: 'Что это?',
      ar: 'ما هو؟',
    },
    pathwaysLink: {
      en: 'Pathways.org',
      es: 'Pathways.org',
      ru: 'Pathways.org',
      ar: 'Pathways.org',
    },
  },
  whyTry: {
    title: {
      en: "Why we're asking you to try it:",
      es: 'Por qué le pedimos que lo pruebe:',
      ru: 'Почему мы просим вас попробовать:',
      ar: 'لماذا نطلب منك تجربته:',
    },
  },
  tryPathways: {
    title: {
      en: 'To try Pathways:',
      es: 'Para probar Pathways:',
      ru: 'Чтобы попробовать Pathways:',
      ar: 'لتجربة Pathways:',
    },
    downloadTitle: {
      en: 'Download the Pathways.org app:',
      es: 'Descargue la aplicación Pathways.org:',
      ru: 'Скачайте приложение Pathways.org:',
      ar: 'قم بتنزيل تطبيق Pathways.org:',
    },
    appStore: {
      en: 'iPhone: Download on the App Store',
      es: 'iPhone: Descargar en App Store',
      ru: 'iPhone: Скачать в App Store',
      ar: 'iPhone: التنزيل من App Store',
    },
    googlePlay: {
      en: 'Android: Get it on Google Play',
      es: 'Android: Disponible en Google Play',
      ru: 'Android: Скачать в Google Play',
      ar: 'Android: احصل عليه من Google Play',
    },
    websiteLink: {
      en: 'Or visit their website',
      es: 'O visite su sitio web',
      ru: 'Или посетите их сайт',
      ar: 'أو قم بزيارة موقعهم الإلكتروني',
    },
    step2: {
      en: 'Explore the recommended activities and content',
      es: 'Explore las actividades y el contenido recomendados',
      ru: 'Изучите рекомендуемые занятия и материалы',
      ar: 'استكشف الأنشطة والمحتوى الموصى به',
    },
  },
  followUp: {
    en: "After you try it, we'll send a quick follow-up survey about whether you found it useful—your feedback will help us decide if tools like this should be part of CAP going forward.",
    es: 'Después de probarlo, le enviaremos una breve encuesta sobre si lo encontró útil—sus comentarios nos ayudarán a decidir si herramientas como esta deben ser parte de CAP en el futuro.',
    ru: 'После того как вы попробуете, мы отправим вам короткий опрос о том, было ли это полезно — ваши отзывы помогут нам решить, стоит ли включать подобные инструменты в CAP в будущем.',
    ar: 'بعد تجربته، سنرسل لك استبيانًا قصيرًا حول ما إذا كان مفيدًا — ستساعدنا ملاحظاتك في تحديد ما إذا كان يجب أن تكون أدوات مثل هذه جزءًا من CAP في المستقبل.',
  },
  support: {
    title: {
      en: 'Need help getting started?',
      es: '¿Necesita ayuda para comenzar?',
      ru: 'Нужна помощь, чтобы начать?',
      ar: 'هل تحتاج مساعدة للبدء؟',
    },
    scheduleCall: {
      en: 'Schedule a quick call with us here',
      es: 'Programe una llamada rápida con nosotros aquí',
      ru: 'Запланируйте быстрый звонок с нами здесь',
      ar: 'حدد موعدًا لمكالمة سريعة معنا هنا',
    },
  },
} as const

export const pathwaysTranslations = {
  familyBanner: {
    message: {
      en: "Track your child's development with a free app!",
      es: '¡Sigue el desarrollo de tu hijo con una aplicación gratuita!',
      ru: 'Отслеживайте развитие вашего ребёнка с помощью бесплатного приложения!',
      ar: 'تتبع تطور طفلك باستخدام تطبيق مجاني!',
    },
  },
  providerBanner: {
    message: {
      en: 'Track child development milestones with a free app!',
      es: '¡Siga los hitos del desarrollo infantil con una aplicación gratuita!',
      ru: 'Отслеживайте этапы развития детей с помощью бесплатного приложения!',
      ar: 'تتبع مراحل تطور الأطفال باستخدام تطبيق مجاني!',
    },
  },
  familyResources: {
    ...sharedResources,
    intro: {
      headline: {
        en: "We're excited to offer CAP families something special: a free tool that shows you exactly where your child is thriving and where you might focus some extra attention together.",
        es: 'Estamos emocionados de ofrecer a las familias de CAP algo especial: una herramienta gratuita que le muestra exactamente qué áreas su hijo/a está desarrollando y dónde pueden enfocarse juntos.',
        ru: 'Мы рады предложить семьям CAP кое-что особенное: бесплатный инструмент, который покажет вам, в каких областях ваш ребёнок преуспевает, а на что стоит обратить дополнительное внимание.',
        ar: 'يسعدنا أن نقدم لعائلات CAP شيئًا مميزًا: أداة مجانية تُظهر لك بالضبط أين يتفوق طفلك وأين يمكنك التركيز على بعض الاهتمام الإضافي معًا.',
      },
    },
    whatIsIt: {
      ...sharedResources.whatIsIt,
      descriptionAfterLink: {
        en: "is an easy-to-use app that walks you through a screening of your child's development milestones. It's quick to set up, and you'll get:",
        es: 'es una aplicación fácil de usar que lo guía a través de una evaluación de los logros de desarrollo de su hijo/a. Es rápida de configurar y obtendrá:',
        ru: '— это простое в использовании приложение, которое поможет вам оценить этапы развития вашего ребёнка. Его легко настроить, и вы получите:',
        ar: 'هو تطبيق سهل الاستخدام يرشدك خلال فحص مراحل تطور طفلك. إعداده سريع، وستحصل على:',
      },
      benefit1: {
        en: 'A clear picture of how your child is progressing across the key developmental areas for their age',
        es: 'Una imagen clara de cómo su hijo/a está progresando en las áreas clave de desarrollo para su edad',
        ru: 'Чёткое представление о том, как ваш ребёнок развивается в ключевых областях для его возраста',
        ar: 'صورة واضحة عن تقدم طفلك في مجالات التطور الرئيسية لعمره',
      },
      benefit2: {
        en: "The ability to track your child's growth over time—see how far they've come and celebrate new skills as they develop",
        es: 'La capacidad de seguir el crecimiento de su hijo/a con el tiempo—vea cuánto ha avanzado y celebre nuevas habilidades a medida que se desarrollan',
        ru: 'Возможность отслеживать рост вашего ребёнка со временем — наблюдайте за его прогрессом и радуйтесь новым навыкам по мере их развития',
        ar: 'القدرة على تتبع نمو طفلك بمرور الوقت — شاهد مدى تقدمه واحتفل بالمهارات الجديدة أثناء تطورها',
      },
      benefit3: {
        en: 'Personalized activities tailored to help your child reach their next milestones',
        es: 'Actividades personalizadas diseñadas para ayudar a su hijo/a a alcanzar sus próximos logros',
        ru: 'Персонализированные занятия, разработанные для помощи вашему ребёнку в достижении следующих этапов развития',
        ar: 'أنشطة مخصصة مصممة لمساعدة طفلك على الوصول إلى مراحله التالية',
      },
      benefit4: {
        en: "Age-appropriate content and tips designed specifically for your child's stage",
        es: 'Contenido y consejos apropiados para la edad de su hijo/a',
        ru: 'Контент и советы, соответствующие возрасту и специально разработанные для этапа развития вашего ребёнка',
        ar: 'محتوى ونصائح مناسبة لعمر طفلك ومصممة خصيصًا لمرحلته',
      },
    },
    whyTry: {
      ...sharedResources.whyTry,
      description: {
        en: "This gives you concrete, doable activities you can start using right away—and share with your provider too. Many parents find it reassuring to see what's going well and empowering to have specific activities they can weave into play and daily routines. When you and your provider are both working on the same developmental goals, your child benefits even more.",
        es: 'Esto le proporciona actividades concretas y fáciles de seguir que puede comenzar a usar de inmediato—y compartir con su proveedor también. Muchos padres se sienten tranquilos al ver lo que va bien y motivados al tener actividades específicas que pueden incorporar en el juego y las rutinas diarias. Cuando usted y su proveedor están trabajando en los mismos objetivos de desarrollo, su hijo/a se beneficia aún más.',
        ru: 'Это даёт вам конкретные, выполнимые занятия, которые вы можете начать использовать прямо сейчас — и поделиться ими с вашим воспитателем тоже. Многие родители находят успокоение в том, чтобы видеть, что идёт хорошо, и чувствуют себя увереннее, имея конкретные занятия, которые можно включить в игры и повседневные дела. Когда вы и ваш воспитатель работаете над одними и теми же целями развития, ваш ребёнок выигрывает ещё больше.',
        ar: 'يمنحك هذا أنشطة ملموسة وقابلة للتنفيذ يمكنك البدء في استخدامها على الفور — ومشاركتها مع مقدم الرعاية أيضًا. يجد العديد من الآباء الطمأنينة في رؤية ما يسير بشكل جيد والتمكين من خلال وجود أنشطة محددة يمكنهم دمجها في اللعب والروتين اليومي. عندما تعمل أنت ومقدم الرعاية على نفس أهداف التطور، يستفيد طفلك أكثر.',
      },
    },
    tryPathways: {
      ...sharedResources.tryPathways,
      step1: {
        en: 'Complete the screening for your child',
        es: 'Complete la evaluación de su hijo/a',
        ru: 'Пройдите оценку для вашего ребёнка',
        ar: 'أكمل الفحص لطفلك',
      },
      step3: {
        en: 'Share relevant activities with your provider',
        es: 'Comparta actividades relevantes con su proveedor',
        ru: 'Поделитесь подходящими занятиями с вашим воспитателем',
        ar: 'شارك الأنشطة ذات الصلة مع مقدم الرعاية',
      },
    },
  },
  providerResources: {
    ...sharedResources,
    intro: {
      headline: {
        en: "We're excited to offer CAP providers a free tool to help track developmental milestones for the children in your care—and to align on goals with their families.",
        es: 'Estamos emocionados de ofrecer a los proveedores de CAP una herramienta gratuita para ayudar a seguir los hitos del desarrollo de los niños a su cargo—y alinearse en objetivos con sus familias.',
        ru: 'Мы рады предложить поставщикам CAP бесплатный инструмент для отслеживания этапов развития детей, находящихся на вашем попечении, и для согласования целей с их семьями.',
        ar: 'يسعدنا أن نقدم لمقدمي خدمات CAP أداة مجانية لمساعدتك في تتبع مراحل تطور الأطفال في رعايتك — والتنسيق مع عائلاتهم حول الأهداف.',
      },
    },
    whatIsIt: {
      ...sharedResources.whatIsIt,
      descriptionAfterLink: {
        en: "is an easy-to-use app that walks you through a screening of a child's development milestones. It's quick to set up, and you'll get:",
        es: 'es una aplicación fácil de usar que lo guía a través de una evaluación de los logros de desarrollo de un niño/a. Es rápida de configurar y obtendrá:',
        ru: '— это простое в использовании приложение, которое поможет вам оценить этапы развития ребёнка. Его легко настроить, и вы получите:',
        ar: 'هو تطبيق سهل الاستخدام يرشدك خلال فحص مراحل تطور الطفل. إعداده سريع، وستحصل على:',
      },
      benefit1: {
        en: 'A clear picture of how a child is progressing across the key developmental areas for their age',
        es: 'Una imagen clara de cómo un niño/a está progresando en las áreas clave de desarrollo para su edad',
        ru: 'Чёткое представление о том, как ребёнок развивается в ключевых областях для его возраста',
        ar: 'صورة واضحة عن تقدم الطفل في مجالات التطور الرئيسية لعمره',
      },
      benefit2: {
        en: "The ability to track a child's growth over time—see how far they've come and celebrate new skills as they develop",
        es: 'La capacidad de seguir el crecimiento de un niño/a con el tiempo—vea cuánto ha avanzado y celebre nuevas habilidades a medida que se desarrollan',
        ru: 'Возможность отслеживать рост ребёнка со временем — наблюдайте за его прогрессом и радуйтесь новым навыкам по мере их развития',
        ar: 'القدرة على تتبع نمو الطفل بمرور الوقت — شاهد مدى تقدمه واحتفل بالمهارات الجديدة أثناء تطورها',
      },
      benefit3: {
        en: 'Personalized activities tailored to help children in your care reach their next milestones',
        es: 'Actividades personalizadas diseñadas para ayudar a los niños a su cargo a alcanzar sus próximos logros',
        ru: 'Персонализированные занятия, разработанные для помощи детям на вашем попечении в достижении следующих этапов развития',
        ar: 'أنشطة مخصصة مصممة لمساعدة الأطفال في رعايتك على الوصول إلى مراحلهم التالية',
      },
      benefit4: {
        en: "Age-appropriate content and tips designed specifically for each child's stage",
        es: 'Contenido y consejos apropiados para la edad de cada niño/a',
        ru: 'Контент и советы, соответствующие возрасту и специально разработанные для этапа развития каждого ребёнка',
        ar: 'محتوى ونصائح مناسبة لعمر كل طفل ومصممة خصيصًا لمرحلته',
      },
    },
    whyTry: {
      ...sharedResources.whyTry,
      description: {
        en: 'This gives you concrete, doable activities you can start using right away—and share with families too. Many providers find it helpful to see where children are developmentally and to have specific activities they can weave into play and daily routines. When you and the families you work with are both focused on the same developmental goals, the children benefit even more.',
        es: 'Esto le proporciona actividades concretas y fáciles de seguir que puede comenzar a usar de inmediato—y compartir con las familias también. Muchos proveedores encuentran útil ver dónde están los niños en su desarrollo y tener actividades específicas que pueden incorporar en el juego y las rutinas diarias. Cuando usted y las familias con las que trabaja están enfocados en los mismos objetivos de desarrollo, los niños se benefician aún más.',
        ru: 'Это даёт вам конкретные, выполнимые занятия, которые вы можете начать использовать прямо сейчас — и поделиться ими с семьями тоже. Многие воспитатели считают полезным видеть, на каком этапе развития находятся дети, и иметь конкретные занятия, которые можно включить в игры и повседневные дела. Когда вы и семьи, с которыми вы работаете, сосредоточены на одних и тех же целях развития, дети выигрывают ещё больше.',
        ar: 'يمنحك هذا أنشطة ملموسة وقابلة للتنفيذ يمكنك البدء في استخدامها على الفور — ومشاركتها مع العائلات أيضًا. يجد العديد من مقدمي الرعاية أنه من المفيد معرفة أين يقف الأطفال من الناحية التنموية وامتلاك أنشطة محددة يمكنهم دمجها في اللعب والروتين اليومي. عندما تركز أنت والعائلات التي تعمل معها على نفس أهداف التطور، يستفيد الأطفال أكثر.',
      },
    },
    tryPathways: {
      ...sharedResources.tryPathways,
      step1: {
        en: 'Complete the screening for a child in your care',
        es: 'Complete la evaluación de un niño/a a su cargo',
        ru: 'Пройдите оценку для ребёнка на вашем попечении',
        ar: 'أكمل الفحص لطفل في رعايتك',
      },
      step3: {
        en: "Share relevant activities with the child's family",
        es: 'Comparta actividades relevantes con la familia del niño/a',
        ru: 'Поделитесь подходящими занятиями с семьёй ребёнка',
        ar: 'شارك الأنشطة ذات الصلة مع عائلة الطفل',
      },
    },
  },
} as const
