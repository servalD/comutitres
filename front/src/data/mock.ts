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
