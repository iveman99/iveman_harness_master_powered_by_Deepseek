# iVeman Studio

English | [中文](README.zh.md)

[![CI](https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A plugin-based AI agent workspace with built-in session inspection.**

iVeman Studio is an MIT-licensed, community fork of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), built on [Cordis](https://github.com/cordiverse/cordis).

## HarnessLens

Inspect a recorded agent Session from the conversation itself. Choose any configured model, including Gemma 4 through Google AI Studio, and get an evidence-linked diagnosis with a suggested fix and a verification step.

- Keeps the inspected Session's model and history unchanged.
- Uses recent loaded events as numbered evidence; screenshots are optional.
- Runs analysis in a separate Session and cites the source event IDs.

Open a completed Session in the Web app, choose **Inspect** beside the conversation, select a configured model, and press **Analyze**. See the [Trajectory package guide](packages/client/ui-trajectory/README.md) for evidence and limits.

## Run iVeman Studio

<a id="run"></a>

Requirements: Node.js `^22.19` or `>=24`, and pnpm `11.7`.

<a id="run-from-source"></a>

```sh
git clone https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek.git
cd iveman_harness_master_powered_by_Deepseek
pnpm install
pnpm run build
pnpm dsh web
```

The Web app opens at `http://127.0.0.1:3080`. Configure a model provider in **Settings → Models** before using HarnessLens. Review the [safety notice](SAFETY.md) before running the project.

## Built on DeepSeek Harness

DeepSeek Harness is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com). iVeman Studio retains its plugin-based architecture and adds an in-conversation inspection workflow. Read the [project documentation](https://deepseek-harness.github.io/deepseek-harness/) to learn about the underlying harness.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [architecture guide](docs/architecture.md). For development commands, see [docs/development.md](docs/development.md).

## License

This project is licensed under the [MIT License](LICENSE). Third-party dependency licenses are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
