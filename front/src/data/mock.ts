export const MOCK_USER = {
  firstName: 'Marie',
  lastName: 'Dupont',
}

export const MOCK_HOUSEHOLD = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    age: 34,
    role: 'Payeur' as const,
    status: 'Navigo Annuel actif',
    isSelf: true,
  },
  {
    id: '2',
    firstName: 'Léa',
    lastName: 'Dupont',
    age: 8,
    role: 'Junior' as const,
    status: 'Dossier en cours',
    isSelf: false,
  },
]

export const MOCK_DOSSIER = {
  product: 'Imagine R Junior',
  beneficiaryFirstName: 'Léa',
  beneficiaryFullName: 'Léa Dupont',
  currentStep: 2,
  totalSteps: 5,
  steps: [
    { id: 1, label: 'Informations' },
    { id: 2, label: 'Justificatifs' },
    { id: 3, label: 'Vérification' },
    { id: 4, label: 'Paiement' },
    { id: 5, label: 'Validation' },
  ],
}

export const MOCK_DOSSIER_DETAIL = {
  product: 'Imagine R Junior',
  beneficiaryFullName: 'Léa Dupont',
  currentStep: 2,
  totalSteps: 5,
  steps: [
    { id: 1, label: 'Identité' },
    { id: 2, label: 'Justificatifs' },
    { id: 3, label: 'Signature' },
    { id: 4, label: 'Paiement' },
    { id: 5, label: 'Validation' },
  ],
  justificatifs: [
    {
      id: 'id-card',
      label: "Pièce d'identité",
      status: 'pending' as const,
      statusLabel: 'À déposer',
    },
    {
      id: 'school',
      label: 'Justificatif scolarité',
      status: 'pending' as const,
      statusLabel: 'À déposer',
    },
    {
      id: 'photo',
      label: "Photo d'identité",
      status: 'neutral' as const,
      statusLabel: 'Requis après validation',
    },
  ],
  processingDelay: 'Délai de traitement : 5 à 10 jours ouvrés',
}
