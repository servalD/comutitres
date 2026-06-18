import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubscriptionWizardShell } from '../components/layout/SubscriptionWizardShell'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { InfoBanner } from '../components/ui/InfoBanner'
import { SelectionCard } from '../components/ui/SelectionCard'
import { WizardStepper } from '../components/ui/WizardStepper'
import { useAuth } from '../contexts/AuthContext'
import type { SubscriptionBeneficiaryView } from '../data/household-from-api'
import {
  MOCK_SUBSCRIPTION,
  type BeneficiaryChoice,
  type PaymentMethod,
  type SubscriptionProductId,
} from '../data/mock'
import { useSubscriptionBeneficiaries } from '../hooks/useSubscriptionBeneficiaries'
import styles from './NouvelleSouscriptionPage.module.css'

const ADD_PERSON_PATH = '/mobility/new'
const RETURN_PATH = '/souscription/nouvelle'

function SelfIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChildIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AddPersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10h18M5 10V18M9 10V18M15 10V18M19 10V18M2 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3L2 10h20L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function beneficiaryIcon(person: SubscriptionBeneficiaryView) {
  if (person.isSelf || person.age >= 18) return <SelfIcon />
  return <ChildIcon />
}

function beneficiaryLabel(person: SubscriptionBeneficiaryView) {
  const fullName = `${person.firstName} ${person.lastName}`
  return person.isSelf ? `${fullName} (Vous)` : fullName
}

function getDefaultProductForCategory(
  category: BeneficiaryChoice,
  products: typeof MOCK_SUBSCRIPTION.products,
): SubscriptionProductId {
  const suggested = products.find((p) => p.forBeneficiary.includes(category))
  return suggested?.id ?? products[0].id
}

export function NouvelleSouscriptionPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { totalSteps, products } = MOCK_SUBSCRIPTION
  const { beneficiaries, loading, error } = useSubscriptionBeneficiaries()

  const defaultBeneficiary = beneficiaries.find((b) => b.isSelf) ?? beneficiaries[0]

  const [step, setStep] = useState(1)
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(
    null,
  )
  const [productId, setProductId] = useState<SubscriptionProductId>(() =>
    getDefaultProductForCategory(
      defaultBeneficiary?.productCategory ?? 'self',
      products,
    ),
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  const effectiveBeneficiaryId =
    selectedBeneficiaryId &&
    beneficiaries.some((person) => person.id === selectedBeneficiaryId)
      ? selectedBeneficiaryId
      : defaultBeneficiary?.id ?? null

  const selectedBeneficiary =
    beneficiaries.find((person) => person.id === effectiveBeneficiaryId) ??
    defaultBeneficiary

  const contactEmail =
    user?.email ?? MOCK_SUBSCRIPTION.beneficiaryForm.email

  const selectedProduct =
    products.find((p) => p.id === productId) ?? products[0]

  const productCategory = selectedBeneficiary?.productCategory ?? 'self'

  const suggestedProducts = useMemo(
    () => products.filter((p) => p.forBeneficiary.includes(productCategory)),
    [products, productCategory],
  )

  const otherProducts = useMemo(
    () => products.filter((p) => !p.forBeneficiary.includes(productCategory)),
    [products, productCategory],
  )

  const handleBeneficiaryChange = (person: SubscriptionBeneficiaryView) => {
    setSelectedBeneficiaryId(person.id)
    setProductId(getDefaultProductForCategory(person.productCategory, products))
  }

  const goNext = () => setStep((s) => Math.min(totalSteps, s + 1))
  const goBack = () => setStep((s) => Math.max(1, s - 1))

  const renderProductList = (items: typeof products, showSuggestedLabel: boolean) => (
    <div className={styles.productList}>
      {items.map((product) => {
        const isSuggested = product.forBeneficiary.includes(productCategory)

        return (
          <button
            key={product.id}
            type="button"
            className={[
              styles.productCard,
              productId === product.id ? styles.productSelected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setProductId(product.id)}
          >
            <span className={styles.productIcon} aria-hidden="true">
              <TicketIcon />
            </span>
            <span className={styles.productInfo}>
              <span className={styles.productNameRow}>
                <span className={styles.productName}>{product.label}</span>
                {showSuggestedLabel && isSuggested && (
                  <span className={styles.recommendedBadge}>Recommandé</span>
                )}
              </span>
              <span className={styles.productPrice}>{product.price}</span>
            </span>
          </button>
        )
      })}
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className={styles.question}>Pour qui souhaitez-vous souscrire ?</h2>
            {error && (
              <p className={styles.loadError} role="status">
                {error} Affichage de démonstration.
              </p>
            )}
            {loading ? (
              <p className={styles.loadingHint}>Chargement de votre foyer…</p>
            ) : (
              <div className={styles.selectionGrid}>
                {beneficiaries.map((person) => (
                  <SelectionCard
                    key={person.id}
                    label={beneficiaryLabel(person)}
                    icon={beneficiaryIcon(person)}
                    selected={effectiveBeneficiaryId === person.id}
                    onClick={() => handleBeneficiaryChange(person)}
                  />
                ))}
                <SelectionCard
                  label="Ajouter une personne"
                  icon={<AddPersonIcon />}
                  selected={false}
                  onClick={() =>
                    navigate(ADD_PERSON_PATH, { state: { from: RETURN_PATH } })
                  }
                />
              </div>
            )}
            <InfoBanner>
              Si la personne est mineure, vous devrez renseigner le payeur.
            </InfoBanner>
          </>
        )

      case 2:
        return (
          <>
            <h2 className={styles.question}>Informations du bénéficiaire</h2>
            <Card key={selectedBeneficiary?.id} className={styles.formCard}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Prénom</span>
                  <input
                    type="text"
                    defaultValue={selectedBeneficiary?.firstName ?? ''}
                    readOnly
                  />
                </label>
                <label className={styles.field}>
                  <span>Nom</span>
                  <input
                    type="text"
                    defaultValue={selectedBeneficiary?.lastName ?? ''}
                    readOnly
                  />
                </label>
                <label className={styles.field}>
                  <span>Date de naissance</span>
                  <input
                    type="date"
                    defaultValue={selectedBeneficiary?.birthDate ?? ''}
                    readOnly
                  />
                </label>
                <label className={styles.field}>
                  <span>Email de contact</span>
                  <input type="email" defaultValue={contactEmail} readOnly />
                </label>
              </div>
            </Card>
          </>
        )

      case 3:
        return (
          <>
            <h2 className={styles.question}>Récapitulatif de votre demande</h2>
            <Card className={styles.recapCard}>
              <dl className={styles.recapList}>
                <div className={styles.recapRow}>
                  <dt>Bénéficiaire</dt>
                  <dd>
                    {selectedBeneficiary
                      ? beneficiaryLabel(selectedBeneficiary)
                      : '—'}
                  </dd>
                </div>
                <div className={styles.recapRow}>
                  <dt>Identité</dt>
                  <dd>
                    {selectedBeneficiary?.firstName} {selectedBeneficiary?.lastName}
                  </dd>
                </div>
                <div className={styles.recapRow}>
                  <dt>Date de naissance</dt>
                  <dd>
                    {selectedBeneficiary?.birthDate
                      ? new Date(selectedBeneficiary.birthDate).toLocaleDateString(
                          'fr-FR',
                        )
                      : '—'}
                  </dd>
                </div>
                <div className={styles.recapRow}>
                  <dt>Email</dt>
                  <dd>{contactEmail}</dd>
                </div>
              </dl>
            </Card>
          </>
        )

      case 4:
        return (
          <>
            <h2 className={styles.question}>Offres suggérées pour vous</h2>
            <p className={styles.suggestionIntro}>
              Sélectionnez un titre adapté à la situation de{' '}
              <strong>
                {selectedBeneficiary?.firstName} {selectedBeneficiary?.lastName}
              </strong>
              .
            </p>
            {renderProductList(suggestedProducts, true)}
            {otherProducts.length > 0 && (
              <>
                <p className={styles.otherOffersLabel}>Autres offres disponibles</p>
                {renderProductList(otherProducts, false)}
              </>
            )}
            <InfoBanner>
              Ces suggestions sont basées sur le profil et l&apos;âge du bénéficiaire
              renseignés aux étapes précédentes.
            </InfoBanner>
          </>
        )

      case 5:
        return (
          <>
            <h2 className={styles.question}>Paiement</h2>
            <p className={styles.paymentAmount}>
              {selectedProduct.label} — <strong>{selectedProduct.price}</strong>
            </p>
            <div className={styles.selectionGrid}>
              <SelectionCard
                label="Carte bancaire"
                icon={<CardIcon />}
                selected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              />
              <SelectionCard
                label="Prélèvement"
                icon={<BankIcon />}
                selected={paymentMethod === 'direct-debit'}
                onClick={() => setPaymentMethod('direct-debit')}
              />
            </div>
          </>
        )

      case 6:
        return (
          <div className={styles.success}>
            <span className={styles.successIcon} aria-hidden="true">
              <SuccessIcon />
            </span>
            <h2 className={styles.successTitle}>Demande enregistrée</h2>
            <p className={styles.successText}>
              Votre demande de souscription pour <strong>{selectedProduct.label}</strong>{' '}
              a bien été enregistrée. Vous recevrez un email de confirmation sous peu.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <SubscriptionWizardShell
      step={step}
      totalSteps={totalSteps}
      stepper={<WizardStepper currentStep={step} totalSteps={totalSteps} />}
    >
      <div className={styles.page}>
        <div className={styles.content}>{renderStep()}</div>

        <footer className={styles.footer}>
          {step < totalSteps ? (
            <>
              <Button fullWidth onClick={goNext} disabled={loading || !selectedBeneficiary}>
                Continuer
              </Button>
              {step > 1 && (
                <button type="button" className={styles.backLink} onClick={goBack}>
                  Retour
                </button>
              )}
            </>
          ) : (
            <Link to="/espace" className={styles.homeLink}>
              <Button fullWidth>Retour à mon espace</Button>
            </Link>
          )}
        </footer>
      </div>
    </SubscriptionWizardShell>
  )
}
