/** HarnessLens view over one recorded run and one optional analysis Session. */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { SessionEventSource } from '@deepseek-ai/dsh-api-session-controller/client'
import type { ModelCatalog, ModelSelection, PromptContentPart } from '@deepseek-ai/dsh-api-session-controller/types'
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { InspectionController } from './inspection-controller.ts'
import { inspectionEvidence, parseInspectionDiagnosis } from './inspection-evidence.ts'
import css from './InspectView.module.css'

const MAX_IMAGE_BYTES = 4_000_000

/** Values borrowed from the selected Session and the Host model directory. */
export interface InspectViewInjected {
  readonly sessionId: SessionId
  readonly source: SessionEventSource
  readonly controller: InspectionController
  readonly loadCatalog: () => Promise<RemoteResult<ModelCatalog>>
}

function modelKey(selection: ModelSelection): string {
  return JSON.stringify([selection.provider, selection.model])
}

function imageMediaType(value: string): value is Extract<PromptContentPart, { type: 'image' }>['mediaType'] {
  return value === 'image/png' || value === 'image/jpeg' || value === 'image/webp'
}

function lastAnalysis(events: ReturnType<SessionEventSource['getSnapshot']>['entries']): {
  text: string
  finished: boolean
  error?: string
} {
  let text = ''
  let finished = false
  let error: string | undefined
  for (const entry of events) {
    if (entry.type !== 'event') continue
    const event = entry.event
    if (event.type === 'assistant/message') {
      text = event.data.message.content
        .flatMap(block => block.type === 'text' ? [block.text] : [])
        .join('\n')
    }
    if (event.type === 'turn/end') {
      finished = true
      if (event.data.reason.kind === 'error') error = event.data.reason.error.message
    }
  }
  return { text, finished, ...error === undefined ? {} : { error } }
}

function useAnalysis(run: ReturnType<InspectionController['store']['getSnapshot']>['run']) {
  const [answer, setAnswer] = useState({ text: '', finished: false } as ReturnType<typeof lastAnalysis>)
  useEffect(() => {
    if (run === undefined) {
      setAnswer({ text: '', finished: false })
      return
    }
    const source = run.reference.binding.eventSource
    const read = (): void => { setAnswer(lastAnalysis(source.getSnapshot().entries)) }
    read()
    return source.subscribe(read)
  }, [run])
  return answer
}

/**
 * Show bounded run evidence and the diagnosis returned by a separately selected model.
 * @param props - Conversation view shares and Session-owned inspection controls.
 * @returns The themed HarnessLens tab.
 */
export function InspectView({
  source, controller, loadCatalog, openView, t,
}: ConvViewProps & InjectFace<InspectViewInjected> & PropsLocale<'trajectory'>) {
  const window = useSyncExternalStore(
    listener => source.subscribe(listener),
    () => source.getSnapshot(),
  )
  const evidence = useMemo(() => inspectionEvidence(window), [window])
  const failures = evidence.filter(item => item.failed)
  const state = useSyncExternalStore(controller.store.subscribe, controller.store.getSnapshot)
  const answer = useAnalysis(state.run)
  const diagnosis = useMemo(
    () => state.run === undefined ? null : parseInspectionDiagnosis(answer.text, state.run.evidence),
    [answer.text, state.run],
  )
  const [catalog, setCatalog] = useState<ModelCatalog | null>(null)
  const [catalogError, setCatalogError] = useState('')
  const [choice, setChoice] = useState('')
  const [image, setImage] = useState<Extract<PromptContentPart, { type: 'image' }> | undefined>()
  const [imageName, setImageName] = useState('')
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    let active = true
    void loadCatalog().then((result) => {
      if (!active) return
      if (result.ok) setCatalog(result.value)
      else setCatalogError(result.error.message)
    }, (error: unknown) => {
      if (active) setCatalogError(error instanceof Error ? error.message : String(error))
    })
    return () => { active = false }
  }, [loadCatalog])

  const models = useMemo(() => catalog?.groups.flatMap(group =>
    group.models.map(model => ({
      key: modelKey({ provider: group.id, model: model.id }),
      provider: group.id,
      providerName: group.name,
      model: model.id,
      modelName: model.name,
    }))) ?? [], [catalog])
  const route = [...evidence].reverse().find(item => item.type === 'request/context')?.detail
  const defaultKey = models.find(item => `${item.provider}/${item.model}` === route)?.key
    ?? models.find(item => item.key === modelKey(catalog?.default ?? { provider: '', model: '' }))?.key
    ?? models[0]?.key
    ?? ''
  const selected = models.find(item => item.key === (choice || defaultKey))
  const busy = state.phase === 'starting' || (state.run !== undefined && !answer.finished)

  async function addImage(file: File | undefined): Promise<void> {
    setImage(undefined)
    setImageName('')
    setImageError('')
    if (file === undefined) return
    if (!imageMediaType(file.type) || file.size > MAX_IMAGE_BYTES) {
      setImageError(t('inspect.imageError'))
      return
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') resolve(reader.result)
          else reject(new Error('Invalid image'))
        }
        reader.onerror = () => { reject(reader.error ?? new Error('Image read failed')) }
        reader.readAsDataURL(file)
      })
      const data = dataUrl.slice(dataUrl.indexOf(',') + 1)
      setImage({ type: 'image', mediaType: file.type, data, name: file.name })
      setImageName(file.name)
    } catch (_error) {
      setImageError(t('inspect.imageError'))
    }
  }

  const analyze = (): void => {
    if (selected === undefined || evidence.length === 0 || busy) return
    void controller.analyze({ provider: selected.provider, model: selected.model }, evidence, image)
  }

  return (
    <div className={css.root}>
      <div className={css.content}>
        <header className={css.heading}>
          <div>
            <div className={css.eyebrow}>{t('inspect.eyebrow')}</div>
            <h1>{t('inspect.title')}</h1>
            <p>{t('inspect.subtitle')}</p>
          </div>
          <div className={css.counts}>
            <span><strong>{evidence.length}</strong> {t('inspect.events')}</span>
            <span><strong>{failures.length}</strong> {t('inspect.failures')}</span>
          </div>
        </header>
        <div className={css.grid}>
          <section className={css.panel} aria-label={t('inspect.evidence')}>
            <div className={css.panelHeading}>
              <div>
                <h2>{t('inspect.evidence')}</h2>
                <p>{t('inspect.evidenceHint')}</p>
              </div>
            </div>
            {evidence.length === 0
              ? <p className={css.empty}>{t('inspect.empty')}</p>
              : <div className={css.eventList}>
                {evidence.map(item => (
                  <div key={item.seq} className={`${css.event} ${item.failed ? css.failed : ''}`}>
                    <span className={css.eventNumber}>#{item.seq}</span>
                    <div className={css.eventBody}>
                      <span className={css.eventType}>{item.type}</span>
                      <p>{item.detail || t('inspect.noDetail')}</p>
                    </div>
                    {item.callId !== undefined && (
                      <button type="button" className={css.eventLink}
                        onClick={() => { if (item.callId !== undefined) openView('trajectory', item.callId) }}>
                        {t('inspect.openEvent')}
                      </button>
                    )}
                  </div>
                ))}
              </div>}
          </section>
          <div className={css.side}>
            <section className={css.panel}>
              <h2>{t('inspect.analyze')}</h2>
              <p className={css.panelIntro}>{t('inspect.modelHint')}</p>
              <label className={css.label} htmlFor="lens-model">{t('inspect.model')}</label>
              <select id="lens-model" className={css.select} value={selected?.key ?? ''}
                disabled={models.length === 0 || busy}
                onChange={(event) => { setChoice(event.target.value) }}>
                {models.length === 0 && <option value="">{t('inspect.noModels')}</option>}
                {catalog?.groups.map(group => (
                  <optgroup key={group.id} label={group.name}>
                    {models.filter(item => item.provider === group.id).map(item => (
                      <option key={item.key} value={item.key}>{item.modelName}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {catalogError && <p className={css.error}>{catalogError}</p>}
              <label className={css.label} htmlFor="lens-image">{t('inspect.image')}</label>
              <input id="lens-image" className={css.file} type="file" accept="image/png,image/jpeg,image/webp"
                onChange={(event) => { void addImage(event.target.files?.[0]) }} />
              {imageName && <p className={css.helper}>{imageName}</p>}
              {imageError && <p className={css.error}>{imageError}</p>}
              <button type="button" className={css.analyze} disabled={selected === undefined || evidence.length === 0 || busy}
                onClick={analyze}>
                {busy ? t('inspect.working') : t('inspect.run')}
              </button>
              <p className={css.helper}>{t('inspect.recorded')}</p>
            </section>
            <section className={`${css.panel} ${state.run === undefined ? '' : css.resultPriority}`} aria-label={t('inspect.result')}>
              <div className={css.panelHeading}>
                <h2>{t('inspect.result')}</h2>
                {state.run !== undefined && <span className={css.modelBadge}>
                  {state.run.model.provider}/{state.run.model.model}
                </span>}
              </div>
              {state.error && <p className={css.error}>{state.error}</p>}
              {diagnosis !== null
                ? <div className={css.diagnosis}>
                  <p className={css.summary}>{diagnosis.summary}</p>
                  <h3>{t('inspect.rootCause')}</h3>
                  <p>{diagnosis.rootCause}</p>
                  <h3>{t('inspect.citations')}</h3>
                  {diagnosis.evidence.length === 0
                    ? <p>{t('inspect.noCitations')}</p>
                    : <ul>{diagnosis.evidence.map(item => (
                      <li key={item.seq}><strong>#{item.seq}</strong> {item.explanation}</li>
                    ))}</ul>}
                  <h3>{t('inspect.fix')}</h3>
                  <p>{diagnosis.fix}</p>
                  <h3>{t('inspect.verify')}</h3>
                  <ol>{diagnosis.verification.map((step, index) => <li key={index}>{step}</li>)}</ol>
                  {diagnosis.uncertainty && <p className={css.uncertainty}>{diagnosis.uncertainty}</p>}
                </div>
                : answer.text
                  ? <pre className={css.rawAnswer}>{answer.text}</pre>
                  : <p className={css.empty}>{busy ? t('inspect.waiting') : t('inspect.resultEmpty')}</p>}
              {answer.error && <p className={css.error}>{answer.error}</p>}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
