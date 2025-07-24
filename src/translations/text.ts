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
        en: 'Search',
        es: 'Buscar',
      },
      inviteFfn: {
        en: 'Invite your Family, Friend, or Neighbor Caregiver',
        es: 'Invita a tu Familia, Amigo o Vecino',
      },
      inviteFfnButton: {
        en: 'Invite',
        es: 'Invitar',
      },
    },
  },
  lanuageSwitcher: {
    languages: {
      en: 'Languages',
      es: 'Idiomas',
    },
  },
} as const
