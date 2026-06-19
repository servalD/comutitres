import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '../../components/layout/AppLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Stepper } from '../../components/ui/Stepper'
import { ValidationTimeline } from '../../components/dossier/ValidationTimeline'
import styles from './DossierValidationPage.module.css'

function SandglassIllustration() {
  return (
    <svg viewBox="0 0 120 140" fill="none" aria-hidden="true" className={styles.illustration}>
      <ellipse cx="60" cy="70" rx="48" ry="48" fill="#EDF5FF" />
      <path d="M42 30h36v20L60 70 42 50z" fill="#1972D2" opacity="0.7" />
      <path d="M42 110h36V90L60 70 42 90z" fill="#1972D2" opacity="0.4" />
      <line x1="38" y1="30" x2="82" y2="30" stroke="#1972D2" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="110" x2="82" y2="110" stroke="#1972D2" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="72" r="3" fill="#64B5F6" />
      <circle cx="60" cy="82" r="2" fill="#64B5F6" opacity="0.6" />
      <circle cx="55" cy="90" r="1.5" fill="#64B5F6" opacity="0.4" />
      <circle cx="65" cy="88" r="1.5" fill="#64B5F6" opacity="0.4" />
    </svg>
  )
}

export function DossierValidationPage() {
  const { t } = useTranslation('dossier')
  const steps = [
    { id: 1, label: t('validation.steps.informations') },
    { id: 2, label: t('validation.steps.justificatifs') },
    { id: 3, label: t('validation.steps.photo') },
    { id: 4, label: t('validation.steps.recapitulatif') },
    { id: 5, label: t('validation.steps.validation') },
  ]
  return (
    <AppLayout activeTab="accueil">
      <div className={styles.page}>
        <PageHeader title={t('detail.title')} backTo="/dossier" />

        <div className={styles.stepperWrap}>
          <Stepper steps={steps} currentStep={4} />
        </div>

        <div className={styles.layout}>
          <div className={styles.hero}>
            <SandglassIllustration />
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>{t('validation.heroTitle')}</h1>
              <p className={styles.heroSubtitle}>{t('validation.heroSubtitle')}</p>
            </div>
          </div>

          <div className={styles.timeline}>
            <ValidationTimeline />
          </div>
        </div>

        <div className={styles.footer}>
          <Link to="/dossier">
            <Button>
              {t('validation.track')}
            </Button>
          </Link>
          <Link to="/aide" className={styles.helpLink}>
            {t('validation.helpLink')}
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
