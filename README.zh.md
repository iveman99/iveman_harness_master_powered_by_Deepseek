# iVeman Studio

[English](README.md) | 中文

[![CI](https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek/actions/workflows/ci.yml) [![许可证：MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**基于插件的 AI 智能体工作台，内置会话检查功能。**

iVeman Studio 是基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 MIT 许可社区分支，构建于 [Cordis](https://github.com/cordiverse/cordis) 之上。

## HarnessLens

直接在对话中检查已记录的智能体会话。选择任意已配置的模型，包括通过 Google AI Studio 使用 Gemma 4，即可获得带证据引用的诊断、建议修复方法和验证步骤。

- 检查过程不会更改原会话所选的模型和历史记录。
- 使用近期已加载事件作为编号证据；截图为可选项。
- 分析在单独的会话中进行，并引用来源事件 ID。

在 Web 应用中打开一个已完成的会话，选择对话旁的 **Inspect**，选取已配置的模型，然后按 **Analyze**。证据范围和限制见 [Trajectory 包指南](packages/client/ui-trajectory/README.zh.md)。

## 运行 iVeman Studio

<a id="run"></a>

要求：Node.js `^22.19` 或 `>=24`，以及 pnpm `11.7`。

<a id="run-from-source"></a>

```sh
git clone https://github.com/iveman99/iveman_harness_master_powered_by_Deepseek.git
cd iveman_harness_master_powered_by_Deepseek
pnpm install
pnpm run build
pnpm dsh web
```

Web 应用会在 `http://127.0.0.1:3080` 打开。使用 HarnessLens 前，请在 **Settings → Models** 中配置模型提供方。运行项目前请阅读[安全说明](SAFETY.zh.md)。

## 基于 DeepSeek Harness 构建

DeepSeek Harness 是由 [DeepSeek AI](https://deepseek.com) 开发的开源智能体框架。iVeman Studio 保留其插件架构，并新增了对话内检查流程。阅读[项目文档](https://deepseek-harness.github.io/deepseek-harness/)以了解底层框架。

## 参与贡献

请参阅 [CONTRIBUTING.zh.md](CONTRIBUTING.zh.md) 和[架构指南](docs/architecture.zh.md)。开发命令见 [docs/development.zh.md](docs/development.zh.md)。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。第三方依赖许可证列于 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
