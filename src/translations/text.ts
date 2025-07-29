const generalNavBar = {
  menu: {
    support: {
      en: 'Help/Support',
      es: 'Ayuda/Soporte',
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
}

const defaultErrorMessage = {
  en: 'An error occurred while processing your request. Pleast try again.',
  es: 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
}

export const translations = {
  family: {
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
    },
    home: {
      balance: {
        en: 'Childcare Subsidy Balance',
        es: 'Balance de Subsidio de Cuidado de Niños',
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
    },
    providerPage: {
      header: {
        en: 'Pay your existing provider or add a new one. If you use a licensed childcare center or home, search for them below. If a friend, family member or neighbor cares for your child, invite them to be in the pilot. (They will need to apply and be approved to receive funding).',
        es: 'Paga tu proveedor existente o agrega uno nuevo. Si usas un centro de cuidado de niños licenciado o un hogar, busca por ellos a continuación. Si un amigo, familiar o vecino cuida a tu niño, invitalos a participar en la piloto. (Necesitarán aplicar y ser aprobados para recibir fondos).',
      },
      yourProviders: {
        en: 'Your Providers',
        es: 'Tus Proveedores',
      },
      addProvider: {
        en: 'Add a Provider',
        es: 'Agregar un Proveedor',
      },
      searchProviders: {
        en: 'Search for existing childcare centers or licensed home-based providers.',
        es: 'Busca centros de cuidado de niños o proveedores de hogares licenciados.',
      },
      searchProvidersButton: {
        en: 'Search (Coming Soon)',
        es: 'Buscar (Próximamente)',
      },
      inviteFfn: {
        en: 'Invite your Family, Friend, or Neighbor Caregiver',
        es: 'Invita a tu Familia, Amigo o Vecino',
      },
      inviteFfnButton: {
        en: 'Invite (Coming Soon)',
        es: 'Invitar (Próximamente)',
      },
    },
    findProviderPage: {
      header: {
        en: 'Find your Provider',
        es: 'Buscar tu Proveedor',
      },
      inviteButton: {
        en: 'Invite',
        es: 'Invitar',
      },
      searchPlaceholder: {
        en: 'Search for a Provider',
        es: 'Buscar un Proveedor',
      },
      loadMoreButton: {
        en: 'Load More',
        es: 'Cargar Más',
      },
      addProviderForm: {
        header: {
          en: 'Please select the children that go to ',
          es: 'Por favor selecciona los niños que van a ',
        },
        noChildrenSelectedError: {
          en: 'Please select at least one child',
          es: 'Por favor selecciona al menos un niño',
        },
        submitButton: {
          en: 'Submit',
          es: 'Enviar',
        },
        closeButton: {
          en: 'Close',
          es: 'Cerrar',
        },
        successMessage: {
          en: 'Successfully invited ',
          es: 'Invitado exitosamente ',
        },
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
      messageParent: {
        en: 'Message Parent',
        es: 'Mensaje al Padre',
      },
      payments: {
        en: 'Recent Payments',
        es: 'Pagos Recientes',
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
        en: 'We have notified about this error and will look into it.',
        es: 'Hemos notificado sobre este error y lo investigaremos.',
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
  },
} as const
