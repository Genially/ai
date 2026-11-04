# Genially Creator

Genially Creator is a skill that builds complete, interactive geniallys for you. Give it a topic and a style
reference and it plans the genially with you, generates its pictures, videos, sound effects, music and voiceovers,
then builds every slide in the Genially editor, reviews each one and fixes what looks unfinished. It can also add
slides, pieces or sound to a genially you already have.

## What you need

- A Genially account with AI credits.
- The Genially connector, included with the plugin: you sign in to your Genially account when you install it in Codex,
  or the first time Claude uses it. If you already have the Genially connector, the plugin uses the same one.
- A browser the agent can control, with the Genially editor open. In Claude Code, use its built-in browser or
  Claude in Chrome. In Codex, use the browser in the Codex app or its Chrome extension; the Codex CLI alone
  cannot drive a browser.

## What it does in your account

- It works inside the Genially editor with your own session.
- It spends your team's AI credits only after you approve the cost.
- It doesn't publish your genially: you publish it yourself from the editor.

## Data

The plugin works in the Genially editor with your session and sends what it needs to your Genially account through
`mcp.genially.com`. It stores nothing itself.
See the [Genially privacy policy](https://genially.com/privacy/).

## Install

Claude Code:

```bash
claude plugin marketplace add Genially/ai
claude plugin install genially-creator@genially
```

Or, inside a Claude Code session (needs Claude Code 2.1.275 or later):

```text
/plugin install genially-creator --marketplace Genially/ai
```

Codex:

```bash
codex plugin marketplace add Genially/ai
```

Then run `/plugins` in Codex, find Genially Creator and install it.

## License

Apache-2.0
