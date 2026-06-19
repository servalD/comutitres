import type { CharacterId } from '../components/ui/Avatar'
import i18n from '../i18n'
import { labelFor } from '../constants/labels'
import type {
  Contract,
  ContractStatus,
  MobilityIdentityWithRelationships,
  RelationshipType,
} from '../domain/types/mobility'
import { MOCK_DOSSIER, MOCK_HOUSEHOLD, MOCK_SUBSCRIPTION, MOCK_USER } from './mock'
import type { BeneficiaryChoice } from './mock'
import type { Profile } from '../domain/types/mobility'

export type DataSource = 'api' | 'mock'

export interface HouseholdMemberView {
  id: string
  firstName: string
  lastName: string
  age: number
  role: string
  status: string
  isSelf: boolean
  character?: CharacterId
  avatarVariant?: 'default' | 'child'
}

export interface DossierView {
  product: string
  beneficiaryFirstName: string
  currentStep: number
  totalSteps: number
  steps: { id: number; label: string }[]
  stepHint: string
}

const PENDING_CONTRACT_STATUSES: ContractStatus[] = [
  'draft',
  'pending_document',
  'pending_payer_signature',
  'pending_payment',
]

function dossierStepHint(step: number): string {
  return i18n.t(`stepHints.${step}`, { ns: 'dossier', defaultValue: i18n.t('stepHints.2', { ns: 'dossier' }) })
}

function hasActiveRelationship(
  identity: MobilityIdentityWithRelationships,
  type: RelationshipType,
): boolean {
  return identity.relationships.some(
    (rel) => rel.relationshipType === type && rel.status === 'active',
  )
}

function isOwner(identity: MobilityIdentityWithRelationships): boolean {
  return hasActiveRelationship(identity, 'owner')
}

export function mapIdentityRoleTag(
  identity: MobilityIdentityWithRelationships,
): string {
  if (hasActiveRelationship(identity, 'payer')) {
    return labelFor.relationship('payer')
  }
  if (identity.currentProfile === 'junior') {
    return labelFor.profile('junior')
  }
  return labelFor.profile(identity.currentProfile)
}

export function mapContractsToStatusLabel(contracts: Contract[]): string {
  const active = contracts.find((c) => c.status === 'active')
  if (active) {
    return i18n.t('household.activeSubscription', {
      ns: 'foyer',
      product: labelFor.product(active.productType),
    })
  }

  const pending = contracts.find((c) =>
    PENDING_CONTRACT_STATUSES.includes(c.status),
  )
  if (pending) {
    return i18n.t('household.inProgress', { ns: 'foyer' })
  }

  return i18n.t('household.noSubscription', { ns: 'foyer' })
}

function contractStatusToStep(status: ContractStatus): number {
  switch (status) {
    case 'draft':
      return 1
    case 'pending_document':
      return 2
    case 'pending_payer_signature':
      return 3
    case 'pending_payment':
      return 4
    default:
      return 2
  }
}

export function mapIdentityToMember(
  identity: MobilityIdentityWithRelationships,
  contracts: Contract[],
): HouseholdMemberView {
  const self = isOwner(identity)
  return {
    id: identity.id,
    firstName: identity.firstName,
    lastName: identity.lastName,
    age: identity.calculatedAge,
    role: mapIdentityRoleTag(identity),
    status: mapContractsToStatusLabel(contracts),
    isSelf: self,
    avatarVariant: identity.calculatedAge < 18 ? 'child' : 'default',
  }
}

export function sortHouseholdMembers(
  members: HouseholdMemberView[],
): HouseholdMemberView[] {
  return [...members].sort((a, b) => {
    if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1
    return b.age - a.age
  })
}

export function findOwnerFirstName(
  identities: MobilityIdentityWithRelationships[],
): string | null {
  const owner = identities.find(isOwner)
  return owner?.firstName ?? null
}

export function buildDossierFromContracts(
  identities: MobilityIdentityWithRelationships[],
  contractsByIdentity: Map<string, Contract[]>,
): DossierView | null {
  for (const identity of identities) {
    const contracts = contractsByIdentity.get(identity.id) ?? []
    const pending = contracts.find((c) =>
      PENDING_CONTRACT_STATUSES.includes(c.status),
    )
    if (!pending) continue

    const step = contractStatusToStep(pending.status)
    return {
      product: labelFor.product(pending.productType),
      beneficiaryFirstName: identity.firstName,
      currentStep: step,
      totalSteps: MOCK_DOSSIER.totalSteps,
      steps: MOCK_DOSSIER.steps,
      stepHint: dossierStepHint(step),
    }
  }
  return null
}

export function mockHouseholdMembers(): HouseholdMemberView[] {
  return MOCK_HOUSEHOLD.map((m) => ({ ...m }))
}

export function mockDossierView(): DossierView {
  return {
    product: MOCK_DOSSIER.product,
    beneficiaryFirstName: MOCK_DOSSIER.beneficiaryFirstName,
    currentStep: MOCK_DOSSIER.currentStep,
    totalSteps: MOCK_DOSSIER.totalSteps,
    steps: MOCK_DOSSIER.steps,
    stepHint: dossierStepHint(2),
  }
}

export function mockGreetingFirstName(): string {
  return MOCK_USER.firstName
}

export function greetingFromDisplayName(displayName: string | null): string | null {
  if (!displayName?.trim()) return null
  return displayName.trim().split(/\s+/)[0] ?? null
}

export interface SubscriptionBeneficiaryView {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  age: number
  isSelf: boolean
  currentProfile: Profile
  productCategory: BeneficiaryChoice
}

export function productCategoryForIdentity(
  identity: MobilityIdentityWithRelationships,
): BeneficiaryChoice {
  if (isOwner(identity)) return 'self'
  if (identity.calculatedAge < 18) return 'child'
  return 'other'
}

export function mapIdentityToSubscriptionBeneficiary(
  identity: MobilityIdentityWithRelationships,
): SubscriptionBeneficiaryView {
  return {
    id: identity.id,
    firstName: identity.firstName,
    lastName: identity.lastName,
    birthDate: identity.birthDate,
    age: identity.calculatedAge,
    isSelf: isOwner(identity),
    currentProfile: identity.currentProfile,
    productCategory: productCategoryForIdentity(identity),
  }
}

export function mapIdentitiesToSubscriptionBeneficiaries(
  identities: MobilityIdentityWithRelationships[],
): SubscriptionBeneficiaryView[] {
  const mapped = identities.map(mapIdentityToSubscriptionBeneficiary)
  return [...mapped].sort((a, b) => {
    if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1
    return b.age - a.age
  })
}

export function mockSubscriptionBeneficiaries(): SubscriptionBeneficiaryView[] {
  return mockHouseholdMembers().map((member) => {
    const birthDate =
      member.id === '2'
        ? MOCK_SUBSCRIPTION.beneficiaryForm.birthDate
        : '1991-03-15'
    const currentProfile: Profile =
      member.age < 12 ? 'junior' : member.age < 18 ? 'scolaire' : 'adulte'

    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      birthDate,
      age: member.age,
      isSelf: member.isSelf,
      currentProfile,
      productCategory: member.isSelf
        ? 'self'
        : member.age < 18
          ? 'child'
          : 'other',
    }
  })
}
