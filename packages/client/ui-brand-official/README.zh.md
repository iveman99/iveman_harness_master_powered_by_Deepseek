---
description: "Web 客户端侧栏与会话首屏的 iVeman 品牌填充。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-brand-official

[English](README.md) | 中文

## 概述

本包在 Web 客户端的侧栏和会话首屏显示 iVeman 标志，并在侧栏名称中标注 DeepSeek Harness。它在所有客户端构建 profile 中注册，不保留运行时状态，也不影响模型请求。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

将本插件挂载到浏览器插件名单，即可在侧栏和会话首屏显示 iVeman 品牌。

### 选择 profile

本插件无论 `DSH_CLIENT_BUILD_PROFILE` 的值为何都会注册品牌填充。`DSH_CLIENT_TITLE` 在构建时单独设置浏览器标题。

### 替换品牌

使用其他品牌的部署不组合本包，而是组合占据侧栏与首屏品牌 slot 的其他包。这里没有品牌配置表单。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

侧栏标志与名称在两个 slot 都声明后一起注册；首屏标志在自己的 slot 中注册。名称和来源说明使用本包的多语言词典。声明 slot 卸载时，其注册随之撤回。浏览器半部是 [`src/client/index.ts`](src/client/index.ts)；node 半部是一个空 Loader 座位。浏览器标题由构建环境中的 `DSH_CLIENT_TITLE` 控制，不属于 slot 系统。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

当品牌面不够用时阅读以下页面。它们从本包占据的 slot 进入渲染这些 slot 的外壳。

- [ui-sidebar](../ui-sidebar/README.zh.md)——声明 `sidebar.brand.mark` 与 `sidebar.brand.name` 并渲染其回退。
- [ui-conversation](../ui-conversation/README.zh.md)——在首屏声明 `conversation.hero.brand.mark`。
- [Web 客户端架构](../../../.agents/notes/implemented/architecture/2026-07-19-gui-web-client-architecture.zh.md)——浏览器插件行如何加载并注册 slot。

-----

<a id="model-experience"></a>
## 模型体验

无，因为本包只贡献浏览器呈现；这里没有任何内容进入模型请求。

#### KV Cache 影响

无；本包既不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>


这些限制界定了品牌呈现的供给方式。它们是当前包约束，不是品牌设计对比或任务积压。

- **只有一组填充**——替代呈现属于占据侧栏和首屏 slot 的另一个 Cordis 包。
- **浏览器标题独立**——`DSH_CLIENT_TITLE` 在构建时选择标题文本，而非通过 UI slot。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

无。

</details>

**运行时不变式：** 不发布伴生入口。本包不保留可变状态；侧栏填充组和首屏填充通过各自 slot 拥有的 effect 安装和释放。
