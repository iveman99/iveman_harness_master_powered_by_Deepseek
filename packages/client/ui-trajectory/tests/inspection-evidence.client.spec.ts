import { describe, expect, it } from 'vitest'
import type { InspectionEvidence } from '../src/client/inspection-evidence.ts'
import { inspectionPrompt, limitInspectionEvidence, parseInspectionDiagnosis } from '../src/client/inspection-evidence.ts'

const evidence: InspectionEvidence[] = [
  { seq: 12, type: 'tool/call', detail: 'read_file missing.txt', failed: false, callId: 'call-1' },
  { seq: 13, type: 'tool/result', detail: 'File not found', failed: true, callId: 'call-1' },
]

describe('Inspect model input and output', () => {
  it('logs exact event numbers and asks for a diagnosis without claiming a fix passed', () => {
    const prompt = inspectionPrompt(evidence)
    expect(prompt).toContain('[#13] tool/result FAILED: File not found')
    expect(prompt).toContain('Do not claim a fix was applied or verified.')
  })

  it('keeps only citations to evidence sent to the analysis model', () => {
    const result = parseInspectionDiagnosis(JSON.stringify({
      summary: 'A file read failed',
      rootCause: 'The path does not exist',
      evidence: [
        { seq: 13, explanation: 'The tool reported File not found' },
        { seq: 99, explanation: 'Invented event' },
      ],
      fix: 'Use the correct path',
      verification: ['Run the read again'],
      uncertainty: '',
    }), evidence)
    expect(result?.evidence).toEqual([{ seq: 13, explanation: 'The tool reported File not found' }])
  })

  it('keeps complete recent events within the prompt limit', () => {
    const oversized = Array.from({ length: 60 }, (_, index): InspectionEvidence => ({
      seq: index + 1, type: 'tool/result', detail: 'x'.repeat(420), failed: false,
    }))
    const selected = limitInspectionEvidence(oversized)
    const prompt = inspectionPrompt(selected)
    expect(selected.length).toBeLessThan(60)
    expect(selected.at(-1)?.seq).toBe(60)
    expect(prompt.length).toBeLessThanOrEqual(18_000)
    for (const item of selected) expect(prompt).toContain(`[#${item.seq}]`)
  })
})
