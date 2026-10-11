/** Session-owned analysis runs for the Inspect conversation view. */

import type { Context } from '@deepseek-ai/cordis'
import type { SessionReference } from '@deepseek-ai/dsh-api-session-controller/client'
import type { ModelSelection, PromptContentPart } from '@deepseek-ai/dsh-api-session-controller/types'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { InspectionEvidence } from './inspection-evidence.ts'
import { inspectionPrompt } from './inspection-evidence.ts'

declare module '@deepseek-ai/dsh-api-session-controller/client' {
  interface SessionReferenceSourceMap {
    /** Inspect's recorded model request, retained while its source Session is open. */
    inspection: unknown
  }
}

/** One separate Session carrying the selected model and the logged evidence prompt. */
export interface InspectionRun {
  readonly reference: SessionReference
  readonly evidence: readonly InspectionEvidence[]
  readonly model: ModelSelection
}

/** UI state retained when the user switches between Chat, Trajectory, and Inspect. */
export interface InspectionRunState {
  readonly phase: 'idle' | 'starting' | 'ready' | 'error'
  readonly run?: InspectionRun
  readonly error?: string
}

/** Analysis run owner for one source Session. */
export class InspectionController {
  /** Observable analysis state for the source Session's Inspect view. */
  readonly store: SnapshotStore<InspectionRunState> = createSnapshotStore<InspectionRunState>({ phase: 'idle' })
  private disposed = false

  /**
   * @param ctx - Browser services for Session creation and model selection.
   * @param sessionId - Session whose events are diagnosed.
   */
  constructor(private readonly ctx: Context, private readonly sessionId: SessionId) {}

  /**
   * Record evidence and the chosen model in a separate Session.
   * @param model - Available provider and model chosen for this inspection.
   * @param evidence - Exact event excerpts the user reviewed.
   * @param image - Optional user-selected screenshot.
   */
  async analyze(
    model: ModelSelection,
    evidence: readonly InspectionEvidence[],
    image?: Extract<PromptContentPart, { type: 'image' }>,
  ): Promise<void> {
    if (this.disposed || this.store.getSnapshot().phase === 'starting') return
    const previous = this.store.getSnapshot().run
    this.store.set({ phase: 'starting', ...previous === undefined ? {} : { run: previous } })
    let reference: SessionReference | undefined
    try {
      const cwd = this.ctx.sessions.list.getSnapshot().byId[this.sessionId]?.cwd
      const id = await this.ctx.sessions.create(cwd === undefined ? {} : { cwd })
      reference = this.ctx.sessions.retain(id, { source: 'inspection' })
      await reference.ready
      if (this.isDisposed()) return
      const selected = await this.ctx.remote.session.selectModel({
        sessionId: id, provider: model.provider, model: model.model,
        ...model.reasoningEffort === undefined ? {} : { reasoningEffort: model.reasoningEffort },
        sessionOnly: true,
      })
      if (!selected.ok) throw new Error(selected.error.message)
      const content: PromptContentPart[] = [
        { type: 'text', text: inspectionPrompt(evidence) },
        ...image === undefined ? [] : [image],
      ]
      const admitted = await reference.binding.session.prompt(content, 'queue')
      if (!admitted.ok) throw new Error(admitted.error.message)
      if (this.isDisposed()) return
      previous?.reference.release()
      this.store.set({ phase: 'ready', run: { reference, evidence, model } })
      reference = undefined
    } catch (error) {
      if (this.isDisposed()) return
      this.store.set({
        phase: 'error',
        ...previous === undefined ? {} : { run: previous },
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      reference?.release()
    }
  }

  /** Release the retained analysis Session when its source Session is disposed. */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.store.getSnapshot().run?.reference.release()
  }

  /** Read disposal state after an awaited Session operation. */
  private isDisposed(): boolean {
    return this.disposed
  }
}
