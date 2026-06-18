import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  justificatifsApi,
  JUSTIFICATIF_TYPES,
  clientStatusHint,
  type JustificatifResponse,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../api/justificatifs';
import { useAuth } from '../contexts/AuthContext';
import styles from './Justificatifs.module.css';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function Justificatifs() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') ?? '';

  const [items, setItems] = useState<JustificatifResponse[]>([]);
  const [loading, setLoading] = useState(!!contractId);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<JustificatifResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [selectedType, setSelectedType] = useState<string>(JUSTIFICATIF_TYPES[0].value);
  const fileRef = useRef<HTMLInputElement>(null);
  const listSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!token || !contractId) return;
    let cancelled = false;
    justificatifsApi
      .list(token, contractId)
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, contractId]);

  useEffect(() => {
    if (!uploadSuccess) return;
    const timer = setTimeout(() => setUploadSuccess(null), 8000);
    return () => clearTimeout(timer);
  }, [uploadSuccess]);

  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => setHighlightId(null), 4000);
    return () => clearTimeout(timer);
  }, [highlightId]);

  // Rafraîchir tant qu'un document est en cours de vérification YouSign
  const hasPendingVerification = items.some(
    (j) => j.status === 'en_cours_de_verification',
  );

  useEffect(() => {
    if (!token || !contractId || !hasPendingVerification) return;

    const interval = setInterval(() => {
      justificatifsApi
        .list(token, contractId)
        .then(setItems)
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [token, contractId, hasPendingVerification]);

  function handleFileSelect(file: File | null) {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFileSelect(e.target.files?.[0] ?? null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setUploadError('Format non supporté (PDF, JPEG ou PNG requis)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux (10 Mo max)');
      return;
    }
    handleFileSelect(file);
    if (fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
    }
  }

  function clearSelectedFile() {
    handleFileSelect(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = selectedFile ?? fileRef.current?.files?.[0];
    if (!file || !token || !contractId) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const uploaded = await justificatifsApi.upload(token, {
        contractId,
        type: selectedType,
        file,
      });
      const refreshed = await justificatifsApi.list(token, contractId);
      setItems(refreshed);
      setUploadSuccess(uploaded);
      setHighlightId(uploaded.id);
      clearSelectedFile();
      listSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors du dépôt');
    } finally {
      setUploading(false);
    }
  }

  const selectedTypeLabel =
    JUSTIFICATIF_TYPES.find((t) => t.value === selectedType)?.label ?? selectedType;

  if (!contractId) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <p>Aucun contrat sélectionné.</p>
          <Link to="/" className={styles.btnBack}>← Tableau de bord</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>← Tableau de bord</Link>
        <h1 className={styles.title}>Mes justificatifs</h1>
        <p className={styles.sub}>Contrat {contractId.slice(0, 8)}…</p>
      </header>

      {/* Upload form */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Déposer un document</h2>
        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Type de document</label>
            <select
              className={styles.select}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {JUSTIFICATIF_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Fichier (PDF, JPEG ou PNG, 10 Mo max)</label>
            <p className={styles.sandboxHint}>
              La vérification automatique YouSign analyse l&apos;authenticité du document.
              En environnement de test, seuls les fichiers nommés selon la convention YouSign
              (ex. <code>verified_id_document_verification.pdf</code>) simulent un succès.
            </p>
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''} ${selectedFile ? styles.dropzoneHasFile : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className={styles.fileInput}
                onChange={handleInputChange}
                disabled={uploading}
              />

              {uploading ? (
                <div className={styles.dropzoneUploading} aria-live="polite">
                  <span className={styles.spinner} aria-hidden="true" />
                  <span className={styles.dropzoneUploadingText}>Envoi en cours…</span>
                  <span className={styles.dropzoneUploadingSub}>
                    {selectedFile?.name}
                  </span>
                </div>
              ) : selectedFile ? (
                <div className={styles.filePreview}>
                  <span className={styles.filePreviewIcon} aria-hidden="true">📄</span>
                  <div className={styles.filePreviewInfo}>
                    <span className={styles.filePreviewName}>{selectedFile.name}</span>
                    <span className={styles.filePreviewMeta}>
                      {formatFileSize(selectedFile.size)} · {selectedTypeLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.filePreviewRemove}
                    onClick={(e) => { e.stopPropagation(); clearSelectedFile(); }}
                    aria-label="Retirer le fichier"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className={styles.dropzoneHint}>
                  Glissez-déposez ou cliquez pour choisir un fichier
                </span>
              )}
            </div>
          </div>

          {uploadError && (
            <p className={styles.error} role="alert">{uploadError}</p>
          )}

          {uploadSuccess && (
            <div className={styles.success} role="status">
              <span className={styles.successIcon} aria-hidden="true">✓</span>
              <div>
                <strong>Document déposé avec succès</strong>
                <p className={styles.successDetail}>
                  {uploadSuccess.originalFilename} — {STATUS_LABELS[uploadSuccess.status] ?? uploadSuccess.status}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={uploading || !selectedFile}
          >
            {uploading ? 'Envoi en cours…' : selectedFile ? 'Envoyer le document' : 'Choisir un fichier d\'abord'}
          </button>
        </form>
      </section>

      {/* List */}
      <section className={styles.card} ref={listSectionRef}>
        <h2 className={styles.cardTitle}>
          Documents déposés
          {!loading && items.length > 0 && (
            <span className={styles.countBadge}>{items.length}</span>
          )}
        </h2>
        {loading && <p className={styles.hint}>Chargement…</p>}
        {!loading && items.length === 0 && (
          <p className={styles.hint}>Aucun justificatif déposé pour ce contrat.</p>
        )}
        <ul className={styles.list}>
          {items.map((j) => {
            const hint = clientStatusHint(j);
            return (
            <li
              key={j.id}
              className={`${styles.item} ${highlightId === j.id ? styles.itemHighlight : ''}`}
            >
              <div className={styles.itemLeft}>
                <span className={styles.itemType}>
                  {JUSTIFICATIF_TYPES.find((t) => t.value === j.type)?.label ?? j.type}
                </span>
                <span className={styles.itemFile}>{j.originalFilename}</span>
                {hint && (
                  <span className={styles.itemHint}>{hint}</span>
                )}
                {j.agentMotif && j.status !== 'a_revoir' && (
                  <span className={styles.itemMotif}>Motif : {j.agentMotif}</span>
                )}
              </div>
              <span
                className={styles.badge}
                style={{ background: STATUS_COLORS[j.status] ?? '#1972D2' }}
              >
                {STATUS_LABELS[j.status] ?? j.status}
              </span>
            </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
