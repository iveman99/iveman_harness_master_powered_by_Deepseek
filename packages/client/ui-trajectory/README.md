---
description: "Trajectory event ledger and HarnessLens diagnosis tabs for the dsh web client."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-trajectory

English | [中文](README.zh.md)

## Summary

The Trajectory tab shows a turn-aware event ledger and timing overview with recorded inputs, outputs, images, and failures. HarnessLens adds an Inspect tab that selects recent Session evidence and asks a configured model to diagnose it, optionally with a screenshot. It displays the suggested cause, cited event numbers, fix, and verification steps. Analysis runs in a separate recorded Session; its model choice leaves the original Session and the default for new Sessions unchanged.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Open the Trajectory tab in the conversation's view ring to inspect agent activity as an event ledger and timeline. The ledger covers records with an explicit loading row until the initial tail is positioned; while an older prefix remains unloaded, a first-row control loads one earlier page on click and shows the shared ongoing loader while that page is pending.

### Diagnosing a run

Open HarnessLens beside Chat and Trajectory in a Session with recorded activity. It shows up to 60 recent relevant events from the loaded Session window, including tool calls, results, model routes, user-authored and assistant messages, and turn endings. Tool events can open their record in Trajectory. Choose any available analysis model, optionally attach a PNG, JPEG, or WebP screenshot under 4 MB, and select **Analyze evidence**. The model request and image are recorded in a separate Session. The answer appears in HarnessLens; only citations to submitted event numbers are accepted. The view redacts common credential assignments from event excerpts, but inspect sensitive runs before sending them to a provider. A diagnosis suggests a fix and checks; it does not edit files or assert that a rerun passed.

### Inspecting records

Calls are identified by their recorded tool name. For `run_code`, the row shows the program description and the inspector opens numbered, highlighted source. The Code tab provides wrapping, a `{}` toggle for the original JSON arguments, and exact source copying, including trailing newlines. Copying the original arguments retains their recorded JSON whitespace. Each newly opened code view takes the last wrapping choice; changing it leaves other open views as they are. Output preserves the recorded text, using a tree for complete JSON objects or arrays. Highlighting uses only an unambiguous TypeScript or Python hint in the recorded tool schema; missing or conflicting hints leave plain source. See the [PTC inspection decision](../../../.agents/notes/implemented/feature/2026-09-09-ptc-trajectory-code-inspection.md) for replay constraints.

Selection, timeline navigation, folding, and search cover the React-visible window. Request numbers and cumulative usage cover the complete resident snapshot. Selecting a record opens a local inspector for token usage, duration, Input, Output, Timing, and durable images. Image URLs use the Conversation-owned per-session cache, so Chat and Trajectory share one authorized read per attachment. A user record shows both nonzero image and ordinary-file counts beside its text, including attachment-only records. A standalone compaction request appears chronologically in its own `Between turns` section, while a numbered compaction remains inside its owning turn.

Summary and Preview share one ordered attachment list after the message text, preserving repeated references. Each row shows a contained image thumbnail or file-type icon, the recorded filename (a localized numbered label for unnamed images), and recorded size, type, and image dimensions where available. Zero-byte files retain their size, and truncated filenames expose the full name in a tooltip. Images open the existing lightbox. Raw keeps content-block order and unrendered text, with images and files in initially collapsed disclosures containing their complete recorded fields.

Thinking in the inspector uses compact Markdown at the inspector's fixed 13px size and 20px line height, independent of the content-size setting. Headings add bold weight without increasing size or line height. Assistant output keeps its regular Markdown typography.

### The timing overview

Historical replies retain TTFT, generation duration, and throughput when their recorded streams contain token timestamps. TTFT measures from the Step start to its first token, including output from an earlier retry attempt; an unloaded Step start or a stream without tokens leaves the corresponding metric unavailable.

A fixed Overview above the ledger projects real record start/duration timing from left to right; Assistant spans divide recorded TTFT from decoding, and a 500 ms hover reveals exact clock and duration details. Dragging an interval focuses the ledger on every record active at any point in that inclusive range; wheel gestures zoom the time domain; a right-button click clears the selected interval, and a right-button drag pans an already zoomed viewport. The initial view and streaming updates stay at the tail; scrolling upward suspends following so new records do not interrupt inspection of earlier rows.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The view is a pure projection: Trajectory-owned Definitions assemble business records from the shared Session window — including durable cancellation-finalized prefixes, chunk-only interruption fallbacks, and interrupted Tool records — so Trajectory neither reads nor changes the Chat conversation snapshot. Its steering classifier retains only next-step Inbox IDs through persistent splice state and shares each current claimed batch across later Contexts.

Native and nested PTC Tool results retain their raw structured error details. Failed records show the error code in the ledger and the error name and code in the inspector.

Tool records begin at durable tool/call events and use complete arguments. Chat's transient preparing stage does not create Trajectory tool rows or alter historical tool timing.

A complete appended prompt without a loaded request header appears as a standalone system row; only its known text is available, with no inferred request options or tool catalog. Prepending its request history replaces that standalone presentation without duplicating the prompt. In-history system prompt changes compare against the most recent request state, including earlier prompt updates without a new request header. Each request retains the prompt and change that applied at its own position. Surface replacements, including compaction, restore the last nonempty surviving system prompt even without a new system event; an unloaded prompt remains unavailable until its page arrives.

### Virtual rows

Long ledgers initially derive React data from 50 target Nodes ending at the mount-time tail. Later Nodes extend that anchored window without evicting its prefix, and the existing load control reveals earlier resident Nodes before requesting another Session page. Virtualization mounts only the visible row window plus a small overscan; request-only separators share the next measurable virtual item, while semantic row keys and ARIA indexes survive prepends. The virtualizer owns bottom following for structural appends; non-virtual ledgers use a direct tail-position write. Content-only stream frames preserve virtual row keys and heights, reuse measurements, and do not issue repeated tail-scroll writes. Completed replies retain assembled blocks, timing, and usage in Trajectory target State, while the shared Session window keeps the raw Events.

### Layout

Trajectory asks the conversation shell to float the composer over the full-height ledger, while its responsive vertical scrollers reserve the composer's live height so final rows remain reachable. Scrollable Summary regions keep their scrollbar thumbs transparent until hovered or focused, without changing the reserved scroll geometry. The package provides no service and declares no Context merge.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

These pages cover the conversation host and the session data this view projects.

- [ui-conversation](../ui-conversation/README.md) — the chat surface hosting the `conversation.view` ring.
- [session-projection](../../session/session-projection/README.md) — the projection registry serving client-facing read models of session state.
- [session](../../core/session/README.md) — the session seam whose window holds the raw events.
- [compaction](../../compaction/compaction/README.md) — the compaction seam whose requests appear in the ledger.

-----

<a id="model-experience"></a>
## Model Experience

### HarnessLens analysis request

#### What the model sees

HarnessLens submits a separate Session prompt with up to 60 numbered excerpts from the loaded source Session window and an optional screenshot. The excerpts include `user/message`, `assistant/message`, `request/context`, tool calls and results, and turn endings. The prompt instructs the model to treat them as untrusted evidence, cite only supplied event numbers, avoid tools and edits, and state uncertainty. The source Session's model-visible history is unchanged.

#### Token effect

The analysis request adds one bounded prompt of at most 18,000 characters, plus any selected image, to its separate Session. The selected provider determines the image and output token costs.

#### KV Cache effect

The analysis request uses a new Session, so it does not reuse the source Session's provider cache. Cache behavior within that analysis Session depends on the selected provider.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Tool-change presentation** — Tool-only developer messages name a single added or removed tool inline without expansion. Multiple changes show added/removed counts and expand to comma-separated tool lists, one line per change kind. Mixed content uses the generic context presentation.
- **Inspect window** — HarnessLens uses the currently loaded event window and up to 60 recent relevant events, dropping older excerpts when needed to keep the prompt within 18,000 characters. It does not page older history for analysis, and its common-pattern redaction is not a comprehensive secret scanner.


These limits define what the view can show while work is in flight; they are current package constraints.

- **In-flight Time stays blank** — `partial` and `runningCalls` rows show their running state without a fabricated duration, so the Overview renders a start marker rather than inventing a live span. Record and timeline selection are local to Trajectory, with no anchor deep links.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>

**Runtime invariant:** No companion is published. It is a pure-consumer plugin: it emits no Cordis events and owns no mutable cross-plugin state; its view-slot registration is a plain effect whose disposal the slot ledger's own specs and this package's behavior specs observe directly.
