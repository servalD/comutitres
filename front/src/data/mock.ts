export type CharacterId = 'marie' | 'lea'

export const MOCK_USER = {
  firstName: 'Marie',
  lastName: 'Dupont',
  character: 'marie' as CharacterId,
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
    character: 'marie' as CharacterId,
  },
  {
    id: '2',
    firstName: 'Léa',
    lastName: 'Dupont',
    age: 8,
    role: 'Junior' as const,
    status: 'Dossier en cours',
    isSelf: false,
    character: 'lea' as CharacterId,
  },
]

export const MOCK_DOSSIER = {
  product: 'Imagine R Junior',
  beneficiaryFirstName: 'Léa',
  beneficiaryFullName: 'Léa Dupont',
  beneficiaryCharacter: 'lea' as const,
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
  beneficiaryCharacter: 'lea' as const,
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

export type BeneficiaryChoice = 'self' | 'child' | 'other'

export type SubscriptionProductId =
  | 'navigo-annuel'
  | 'imagine-r-junior'
  | 'imagine-r-scolaire'

export type PaymentMethod = 'card' | 'direct-debit'

export const MOCK_SUBSCRIPTION = {
  totalSteps: 6,
  products: [
    {
      id: 'navigo-annuel' as const,
      label: 'Navigo Annuel',
      price: '894,40 € / an',
      forBeneficiary: ['self'] as BeneficiaryChoice[],
    },
    {
      id: 'imagine-r-junior' as const,
      label: 'Imagine R Junior',
      price: '24,00 € / an',
      forBeneficiary: ['child'] as BeneficiaryChoice[],
    },
    {
      id: 'imagine-r-scolaire' as const,
      label: 'Imagine R Scolaire',
      price: '24,00 € / an',
      forBeneficiary: ['child', 'other'] as BeneficiaryChoice[],
    },
  ],
  beneficiaryOptions: [
    { id: 'self' as const, label: 'Moi-même' },
    { id: 'child' as const, label: 'Mon enfant' },
    { id: 'other' as const, label: 'Une autre personne' },
  ],
  beneficiaryForm: {
    firstName: 'Léa',
    lastName: 'Dupont',
    birthDate: '2017-05-12',
    email: 'marie.dupont@email.fr',
  },
  payment: {
    amount: '24,00 €',
    label: 'Imagine R Junior — année scolaire',
  },
}
