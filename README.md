# Genially AI

This repository holds plugins that let AI agents work with Genially. Each plugin lives in its own folder under `plugins/`.

## Plugins

| Plugin | Description |
| --- | --- |
| `genially-creator` | Builds complete, interactive geniallys inside the Genially editor from a topic and a style: slides, AI Builder pieces, windows, AI images and videos, voiceovers and music. |

## Before you start

- A Genially account with AI credits.
- The Genially connector (`https://mcp.genially.com/mcp`) comes with the plugin. You sign in to Genially when you install it in Codex, or the first time Claude uses it. If you already have the Genially connector, the plugin uses the same one.
- A browser the agent controls: Claude Code desktop or Claude in Chrome. In Codex, use its app's browser or the Chrome extension, not the CLI.

See [plugins/genially-creator/README.md](plugins/genially-creator/README.md) for how the plugin works.

## Install in Claude Code

```bash
claude plugin marketplace add Genially/ai
claude plugin install genially-creator@genially
```

## Install in Codex

```bash
codex plugin marketplace add Genially/ai
codex plugin add genially-creator@genially
```

You can also open `/plugins` and install `genially-creator` from there.

## Where the content comes from

The content of this repository is published from an internal Genially repository. Open an issue here to report a problem.

## License

Copyright 2026 Genially. Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
