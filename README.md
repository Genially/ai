# Genially AI

This repository holds plugins that let AI agents work with Genially. Each plugin lives in its own folder under `plugins/`.

## Plugins

| Plugin | Description |
| --- | --- |
| `genially-creator` | Builds complete, interactive geniallys inside the Genially editor from a topic and a style: slides, AI Builder pieces, windows, AI images and videos, voiceovers and sound effects. |

## Before you start

- A Genially account with AI credits.
- The Genially connector (`https://mcp.genially.com/mcp`) comes with the plugin. You sign in to Genially when you install the plugin or the first time the agent uses it, depending on the app. If you already have the Genially connector, the plugin uses the same one.
- A browser the agent controls, where the app has one: in Claude, the built-in browser of the desktop app or Claude in Chrome; in Codex, the browser of the Codex app or its Chrome extension. Where there is none (a chat on the web or on a phone, a terminal alone), Genially's cloud browser builds a new genially through the connector, where your account has it. Changing a genially you already have still needs a browser.

See [plugins/genially-creator/README.md](plugins/genially-creator/README.md) for how the plugin works.

## Install

The plugin is listed as **Genially Studio**. Its id is `genially-creator`, and it lives in the `genially` marketplace, which is this repository: `Genially/ai`. You add the marketplace once and then install the plugin from it.

| Where you use it | How to install |
| --- | --- |
| Claude: chat, Cowork and Claude Code on the web (claude.ai, desktop app) | [From Customize](#claude-chat-cowork-and-claude-code-on-the-web) |
| Claude desktop app, Code tab | [Two commands in a terminal](#claude-code-terminal-desktop-app-and-jetbrains) |
| Claude Code in a terminal or in JetBrains | [Two commands](#claude-code-terminal-desktop-app-and-jetbrains) |
| Claude Code in VS Code | [From Manage plugins](#claude-code-in-vs-code) |
| Codex CLI and the Codex app (Codex in the ChatGPT desktop app) | [Two commands](#codex-cli-and-codex-app) |
| ChatGPT in a workspace | [An admin imports the marketplace](#chatgpt-workspaces) |
| Codex IDE extension | Not available: the extension doesn't support plugins. Use the Codex CLI or the Codex app. |
| Any other app that supports MCP | [The connector alone](#the-connector-alone) |

### Claude: chat, Cowork and Claude Code on the web

This installs the plugin in your Claude account, so it works in the chat, in Cowork and in Claude Code on the web, in the browser and in the desktop app.

1. Open **Customize** and then **Plugins** (<https://claude.ai/customize/plugins>).
2. Select **Add**, then **Add marketplace**, and enter `Genially/ai`.
3. Install **Genially Studio** from that marketplace.
4. Open the plugin's **Connectors** tab and connect Genially with your account.
5. Start a new chat or session.

In a Team or Enterprise organization an Owner may have to allow the marketplace first.

### Claude Code: terminal, desktop app and JetBrains

In a terminal:

```bash
claude plugin marketplace add Genially/ai
```

```bash
claude plugin install genially-creator@genially
```

Or type the same inside a Claude Code session in the terminal, as `/plugin marketplace add Genially/ai` and `/plugin install genially-creator@genially`.

The terminal, the local sessions of the desktop app's Code tab and the VS Code extension read the same settings on one computer, so this also installs the plugin for the Code tab: start a new session there. To see it, select **+** next to the prompt box and open the plugin browser (**Add plugins**, or **Plugins** and then **Browse plugins**).

### Claude Code in VS Code

1. Type `/plugins` in the prompt box to open **Manage plugins**.
2. In the **Marketplaces** tab, enter `Genially/ai`.
3. In the **Plugins** tab, select **Install** on Genially Studio.

### Codex CLI and Codex app

```bash
codex plugin marketplace add Genially/ai
```

```bash
codex plugin add genially-creator@genially
```

You sign in to Genially during the install. Start a new session before you use the plugin. You can also run `/plugins` in Codex and install Genially Studio from there.

In the Codex app (Codex in the ChatGPT desktop app), a marketplace you have added shows as a source in the **Plugins** tab: run the first command, restart the app, open **Plugins**, choose the Genially source and install Genially Studio with the plus button.

### ChatGPT workspaces

A workspace admin imports the marketplace for everyone: **Admin** > **Plugins** > **Add** > **Import marketplace**, with `https://github.com/Genially/ai` in **Source**. Members then install Genially Studio from the **Plugins** tab, under the workspace's name. ChatGPT may mark it **Desktop only**, because it comes with a connector: it is then installed and used from the ChatGPT desktop app.

### The connector alone

Where plugins can't be installed, you can still add the Genially connector as a custom MCP server or connector with the URL `https://mcp.genially.com/mcp`. It gives the agent Genially's tools, without the instructions the plugin adds for building a whole genially.

## Where the content comes from

The content of this repository is published from an internal Genially repository. Open an issue here to report a problem.

## License

Copyright 2026 Genially. Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
