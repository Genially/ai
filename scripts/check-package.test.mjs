import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { checkEntries, checkPlugin, checkRepo, walkPlugin } from './check-package.mjs';

const SCHEMA_URL = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';

function buildPng({ width, height }) {
  const header = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'ascii');
  header.writeUInt32BE(width, 16);
  header.writeUInt32BE(height, 20);
  return header;
}

function baseManifest({ name }) {
  return {
    name,
    version: '1.0.0',
    description: 'A demo plugin',
    author: { name: 'Demo', url: 'https://example.com' },
    homepage: 'https://example.com/demo',
    repository: 'https://example.com/demo.git',
    license: 'MIT',
    keywords: ['demo'],
  };
}

function write({ dir, rel, content }) {
  const target = path.join(dir, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function editJson({ dir, rel, edit }) {
  const target = path.join(dir, rel);
  const json = JSON.parse(fs.readFileSync(target, 'utf8'));
  edit(json);
  fs.writeFileSync(target, JSON.stringify(json, null, 2));
}

function makePlugin({ parent, name = 'demo' }) {
  const dir = path.join(parent, name);
  const manifest = baseManifest({ name });
  write({ dir, rel: 'plugin.json', content: JSON.stringify({ $schema: SCHEMA_URL, ...manifest }, null, 2) });
  write({ dir, rel: '.claude-plugin/plugin.json', content: JSON.stringify(manifest, null, 2) });
  write({
    dir,
    rel: '.codex-plugin/plugin.json',
    content: JSON.stringify({ ...manifest, skills: './skills/', interface: { logo: './assets/icon.png' } }, null, 2),
  });
  write({ dir, rel: 'README.md', content: Array.from({ length: 50 }, (_, i) => `word${i}`).join(' ') });
  write({ dir, rel: 'assets/icon.png', content: buildPng({ width: 1024, height: 1024 }) });
  write({
    dir,
    rel: 'skills/demo/SKILL.md',
    content: '---\nname: demo\ndescription: Does a demo thing.\n---\n\n# Demo\n\nSee [the notes](references/a.md).\n',
  });
  write({ dir, rel: 'skills/demo/references/a.md', content: '# Notes\n' });
  return dir;
}

function findingsFor({ findings, rule }) {
  return findings.filter((f) => f.rule === rule);
}

function assertFinding({ findings, rule, includes }) {
  const matches = findingsFor({ findings, rule }).filter((f) => !includes || f.message.includes(includes) || f.file.includes(includes));
  assert.ok(matches.length > 0, `expected a ${rule} finding${includes ? ` with "${includes}"` : ''}, got ${JSON.stringify(findings)}`);
  return matches[0];
}

describe('checkPlugin', () => {
  let parent;
  let dir;

  beforeEach(() => {
    parent = fs.mkdtempSync(path.join(os.tmpdir(), 'check-package-'));
    dir = makePlugin({ parent });
  });

  afterEach(() => {
    fs.rmSync(parent, { recursive: true, force: true });
  });

  const check = (patterns = []) => checkPlugin({ dir, patterns });

  it('passes a valid plugin', () => assert.deepEqual(check(), []));

  describe('structure', () => {
    it('flags a missing codex manifest', () => {
      fs.rmSync(path.join(dir, '.codex-plugin'), { recursive: true });
      assertFinding({ findings: check(), rule: 'structure', includes: '.codex-plugin/plugin.json' });
    });

    it('flags an extra file in the plugin root', () => {
      write({ dir, rel: 'extra.md', content: 'x' });
      assertFinding({ findings: check(), rule: 'structure', includes: 'extra.md' });
    });

    it('flags a README of 39 words', () => {
      write({ dir, rel: 'README.md', content: Array.from({ length: 39 }, (_, i) => `w${i}`).join(' ') });
      assertFinding({ findings: check(), rule: 'structure', includes: 'README.md' });
    });

    it('flags a SKILL.md without description', () => {
      write({ dir, rel: 'skills/demo/SKILL.md', content: '---\nname: demo\n---\n\n# Demo\n' });
      assertFinding({ findings: check(), rule: 'structure', includes: 'description' });
    });

    it('flags a description of 1025 characters and accepts 1024', () => {
      write({ dir, rel: 'skills/demo/SKILL.md', content: `---\nname: demo\ndescription: ${'a'.repeat(1024)}\n---\n` });
      assert.deepEqual(check(), []);
      write({ dir, rel: 'skills/demo/SKILL.md', content: `---\nname: demo\ndescription: ${'a'.repeat(1025)}\n---\n` });
      assertFinding({ findings: check(), rule: 'structure', includes: '1024' });
    });
  });

  describe('manifest', () => {
    it('flags different versions', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.version = '1.0.1'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'version' });
    });

    it('flags a name different from the folder name', () => {
      for (const rel of ['plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
        editJson({ dir, rel, edit: (j) => { j.name = 'other'; } });
      }
      assertFinding({ findings: check(), rule: 'manifest', includes: 'folder' });
    });

    it('flags a field outside the schema in plugin.json', () => {
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.mcpServers = {}; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'mcpServers' });
    });

    it('flags a missing license', () => {
      editJson({ dir, rel: '.claude-plugin/plugin.json', edit: (j) => { delete j.license; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'license' });
    });

    it('flags a skills path that leaves the plugin', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.skills = '../fuera'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'skills' });
    });

    it('flags a path that does not start with ./', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.skills = 'skills/'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'start with ./' });
    });

    it('flags a path with .. inside', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.skills = './skills/../skills/'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: '..' });
    });

    it('flags a wrong $schema value', () => {
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.$schema = 'https://example.com/other.json'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: '$schema' });
    });

    it('flags a logo path that does not exist', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface.logo = './assets/nope.png'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'interface.logo' });
    });
  });

  describe('manifest allowlist', () => {
    const notAllowed = (field) => assertFinding({ findings: check(), rule: 'manifest', includes: `field ${field} is not allowed (skills-only plugin)` });

    it('flags hooks in the Claude manifest', () => {
      editJson({ dir, rel: '.claude-plugin/plugin.json', edit: (j) => { j.hooks = { PreToolUse: [] }; } });
      notAllowed('hooks');
    });

    it('flags mcpServers in the Claude manifest', () => {
      editJson({ dir, rel: '.claude-plugin/plugin.json', edit: (j) => { j.mcpServers = './.mcp.json'; } });
      notAllowed('mcpServers');
    });

    it('flags skills in the Claude manifest', () => {
      editJson({ dir, rel: '.claude-plugin/plugin.json', edit: (j) => { j.skills = './skills/'; } });
      notAllowed('skills');
    });

    it('accepts privacyPolicyUrl in the Claude manifest', () => {
      editJson({ dir, rel: '.claude-plugin/plugin.json', edit: (j) => { j.privacyPolicyUrl = 'https://example.com/privacy'; } });
      assert.deepEqual(check(), []);
    });

    it('flags privacyPolicyUrl in the Codex manifest', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.privacyPolicyUrl = 'https://example.com/privacy'; } });
      notAllowed('privacyPolicyUrl');
    });

    it('flags an unknown interface key', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface.apps = './apps'; } });
      notAllowed('interface.apps');
    });

    it('flags a Codex path with ..', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface.composerIcon = './../icon.png'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'interface.composerIcon' });
    });

    it('checks every screenshot path', () => {
      write({ dir, rel: 'assets/shot.png', content: 'x' });
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface.screenshots = ['./assets/shot.png', './assets/nope.png']; } });
      const findings = check();
      assertFinding({ findings, rule: 'manifest', includes: 'interface.screenshots[1]' });
      assert.equal(findingsFor({ findings, rule: 'manifest' }).length, 1);
    });

    it('flags a logo that is a folder and a skills path that is a file', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface.logo = './skills'; j.skills = './README.md'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'interface.logo "./skills" must be a file' });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'skills "./README.md" must be a folder' });
    });
  });

  describe('bundled connector', () => {
    const REMOTE = { mcpServers: { genially: { type: 'http', url: 'https://mcp.genially.com/mcp' } } };
    const PORTABLE_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';
    const portableOf = (config) => ({
      $schema: PORTABLE_SCHEMA,
      mcpServers: Object.fromEntries(
        Object.entries(config.mcpServers).map(([name, server]) => [name, server?.type === 'http' ? { ...server, type: 'streamable-http' } : server]),
      ),
    });
    const bundle = (config = REMOTE, portable = portableOf(config)) => {
      write({ dir, rel: '.mcp.json', content: JSON.stringify(config) });
      write({ dir, rel: 'mcp.json', content: JSON.stringify(portable) });
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.mcpServers = './.mcp.json'; } });
    };
    const withServer = (server) => ({ mcpServers: { genially: server } });

    it('passes a plugin with a remote https connector', () => {
      bundle();
      assert.deepEqual(check(), []);
    });

    it('flags a connector that exists only as .mcp.json', () => {
      bundle();
      fs.rmSync(path.join(dir, 'mcp.json'));
      const finding = assertFinding({ findings: check(), rule: 'manifest', includes: 'required because .mcp.json exists' });
      assert.equal(finding.file, 'mcp.json');
    });

    it('flags a connector that exists only as mcp.json', () => {
      bundle();
      fs.rmSync(path.join(dir, '.mcp.json'));
      const finding = assertFinding({ findings: check(), rule: 'manifest', includes: 'required because mcp.json exists' });
      assert.equal(finding.file, '.mcp.json');
    });

    const portableFinding = ({ includes }) => {
      const finding = findingsFor({ findings: check(), rule: 'manifest' }).find((f) => f.file === 'mcp.json' && f.message.includes(includes));
      assert.ok(finding, `no mcp.json finding including "${includes}"`);
    };

    it('flags an mcp.json without the Agent Plugins $schema', () => {
      bundle(REMOTE, { mcpServers: portableOf(REMOTE).mcpServers });
      portableFinding({ includes: `$schema must be ${PORTABLE_SCHEMA}` });
      bundle(REMOTE, { ...portableOf(REMOTE), $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json' });
      portableFinding({ includes: `$schema must be ${PORTABLE_SCHEMA}` });
    });

    it('flags an mcp.json with fields other than $schema and mcpServers', () => {
      bundle(REMOTE, { ...portableOf(REMOTE), servers: {} });
      portableFinding({ includes: 'field servers is not allowed' });
    });

    it('flags an mcp.json server with the Claude Code type http', () => {
      bundle(REMOTE, { $schema: PORTABLE_SCHEMA, mcpServers: REMOTE.mcpServers });
      portableFinding({ includes: 'type must be streamable-http or sse' });
    });

    it('flags a .mcp.json server with the Agent Plugins type streamable-http', () => {
      bundle(withServer({ type: 'streamable-http', url: 'https://mcp.genially.com/mcp' }));
      const finding = findingsFor({ findings: check(), rule: 'manifest' }).find((f) => f.file === '.mcp.json' && f.message.includes('type must be http or sse'));
      assert.ok(finding);
    });

    it('flags an mcp.json server with another url or type than .mcp.json', () => {
      bundle(REMOTE, portableOf(withServer({ type: 'http', url: 'https://mcp.genially.com/other' })));
      portableFinding({ includes: 'server genially: must have type streamable-http and the url of .mcp.json' });
      bundle(REMOTE, portableOf(withServer({ type: 'sse', url: 'https://mcp.genially.com/mcp' })));
      portableFinding({ includes: 'server genially: must have type streamable-http and the url of .mcp.json' });
    });

    it('flags servers declared in only one of .mcp.json and mcp.json', () => {
      bundle(REMOTE, portableOf({ mcpServers: { ...REMOTE.mcpServers, other: { type: 'http', url: 'https://mcp.genially.com/mcp' } } }));
      portableFinding({ includes: 'server other: must be declared in both .mcp.json and mcp.json' });
      bundle(REMOTE, portableOf({ mcpServers: { constructor: REMOTE.mcpServers.genially } }));
      portableFinding({ includes: 'server constructor: must be declared in both .mcp.json and mcp.json' });
      portableFinding({ includes: 'server genially: must be declared in both .mcp.json and mcp.json' });
    });

    it('reports an invalid server in mcp.json on mcp.json', () => {
      bundle();
      write({ dir, rel: 'mcp.json', content: JSON.stringify(withServer({ command: 'npx' })) });
      const finding = findingsFor({ findings: check(), rule: 'manifest' }).find((f) => f.file === 'mcp.json' && f.message.includes('only remote https servers'));
      assert.ok(finding);
    });

    it('passes a plugin without a connector', () => assert.deepEqual(check(), []));

    it('flags a server that runs a command', () => {
      bundle(withServer({ command: 'npx', args: ['x'] }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'only remote https servers' });
    });

    it('flags an http:// url', () => {
      bundle(withServer({ type: 'http', url: 'http://mcp.genially.com/mcp' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'starting with https://' });
    });

    it('flags a relative url', () => {
      bundle(withServer({ type: 'http', url: '/mcp' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'starting with https://' });
    });

    it('flags headers', () => {
      bundle(withServer({ type: 'http', url: 'https://mcp.genially.com/mcp', headers: { a: 'b' } }));
      const finding = assertFinding({ findings: check(), rule: 'manifest', includes: 'server genially' });
      assert.match(finding.message, /not headers$/);
    });

    it('flags a url that is not a plain string', () => {
      for (const url of [['https://evil.example/mcp'], 42, ' https://mcp.genially.com/mcp', 'https://mcp.genially.com/mcp ']) {
        bundle(withServer({ type: 'http', url }));
        assertFinding({ findings: check(), rule: 'manifest', includes: 'server genially: url must be a string' });
      }
    });

    it('flags credentials in the url', () => {
      bundle(withServer({ type: 'http', url: 'https://user:pass@mcp.genially.com/mcp' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'credentials' });
      bundle(withServer({ type: 'http', url: 'https://user@mcp.genially.com/mcp' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'credentials' });
    });

    it('flags a query string in the url', () => {
      bundle(withServer({ type: 'http', url: 'https://mcp.genially.com/mcp?token=x' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'query string' });
    });

    it('flags a server that is an array or null', () => {
      for (const server of [[], null]) {
        bundle(withServer(server));
        assertFinding({ findings: check(), rule: 'manifest', includes: 'server genially: must be an object' });
      }
    });

    it('passes an sse server', () => {
      bundle(withServer({ type: 'sse', url: 'https://mcp.genially.com/sse' }));
      assert.deepEqual(check(), []);
    });

    it('flags a Codex mcpServers that points to a folder', () => {
      write({ dir, rel: '.mcp.json', content: JSON.stringify(REMOTE) });
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.mcpServers = './skills'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'mcpServers "./skills" must be a file' });
    });

    it('flags an unknown type', () => {
      bundle(withServer({ type: 'stdio', url: 'https://mcp.genially.com/mcp' }));
      assertFinding({ findings: check(), rule: 'manifest', includes: 'type must be' });
    });

    it('flags a .mcp.json without servers or with invalid content', () => {
      bundle({ mcpServers: {} });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'at least one server' });
      write({ dir, rel: '.mcp.json', content: '{ nope' });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'invalid JSON' });
      write({ dir, rel: '.mcp.json', content: '[]' });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'mcpServers object' });
    });

    it('flags a .mcp.json the Codex manifest does not declare', () => {
      write({ dir, rel: '.mcp.json', content: JSON.stringify(REMOTE) });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'mcpServers must be ./.mcp.json' });
    });

    it('flags a Codex mcpServers that points to a missing file', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.mcpServers = './.mcp.json'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'does not exist' });
    });

    it('flags a Codex mcpServers that points to another file', () => {
      write({ dir, rel: '.mcp.json', content: JSON.stringify(REMOTE) });
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.mcpServers = './README.md'; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'must be ./.mcp.json' });
    });

    it('flags an inline Codex mcpServers object', () => {
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.mcpServers = REMOTE.mcpServers; } });
      assertFinding({ findings: check(), rule: 'manifest', includes: 'mcpServers must be a string path' });
    });
  });

  describe('OpenAI listing', () => {
    const LISTING = {
      displayName: 'Demo',
      shortDescription: 'Does a demo thing',
      category: 'Productivity',
      logo: './assets/icon.png',
      composerIcon: './assets/icon.png',
    };
    const list = ({ root = LISTING, codex = root } = {}) => {
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.extensions = { 'com.openai': { interface: root } }; } });
      editJson({ dir, rel: '.codex-plugin/plugin.json', edit: (j) => { j.interface = codex; } });
    };
    const finding = ({ file, includes }) => {
      const match = findingsFor({ findings: check(), rule: 'manifest' }).find((f) => f.file === file && f.message.includes(includes));
      assert.ok(match, `no ${file} finding including "${includes}"`);
    };

    it('passes the same listing in plugin.json and the Codex manifest, in any key order', () => {
      list();
      assert.deepEqual(check(), []);
      list({ codex: Object.fromEntries(Object.entries(LISTING).reverse()) });
      assert.deepEqual(check(), []);
    });

    it('passes a support page in the listing', () => {
      list({ root: { ...LISTING, supportURL: 'https://example.com/support' } });
      assert.deepEqual(check(), []);
    });

    it('flags a Codex listing that differs from the one in plugin.json', () => {
      list({ codex: { ...LISTING, displayName: 'Other' } });
      finding({ file: '.codex-plugin/plugin.json', includes: 'interface must be the same as extensions.com.openai.interface in plugin.json' });
    });

    it('flags other extensions and other OpenAI settings', () => {
      list();
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.extensions['com.example'] = {}; j.extensions['com.openai'].apps = './.app.json'; } });
      finding({ file: 'plugin.json', includes: 'field extensions.com.example is not allowed' });
      finding({ file: 'plugin.json', includes: 'field extensions.com.openai.apps is not allowed' });
    });

    it('flags extensions that are not objects', () => {
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.extensions = []; } });
      finding({ file: 'plugin.json', includes: 'extensions must be an object' });
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.extensions = { 'com.openai': 'x' }; } });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai must be an object' });
      editJson({ dir, rel: 'plugin.json', edit: (j) => { j.extensions = { 'com.openai': { interface: [] } }; } });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai.interface must be an object' });
    });

    it('flags an unknown key and a missing logo in the plugin.json listing', () => {
      list({ root: { ...LISTING, hooks: {}, logo: './assets/missing.png' }, codex: LISTING });
      finding({ file: 'plugin.json', includes: 'field extensions.com.openai.interface.hooks is not allowed' });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai.interface.logo "./assets/missing.png" does not exist' });
    });

    it('flags a name or subtitle of more than 30 characters', () => {
      list({ root: { ...LISTING, shortDescription: 'x'.repeat(31) } });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai.interface.shortDescription has 31 characters, at most 30 are allowed' });
      finding({ file: '.codex-plugin/plugin.json', includes: 'interface.shortDescription has 31 characters' });
      list({ root: { ...LISTING, displayName: 'x'.repeat(31) } });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai.interface.displayName has 31 characters' });
      list({ root: { ...LISTING, displayName: 'x'.repeat(30), shortDescription: 'y'.repeat(30) } });
      assert.deepEqual(check(), []);
    });

    it('flags a category OpenAI does not list', () => {
      list({ root: { ...LISTING, category: 'productivity' } });
      finding({ file: 'plugin.json', includes: 'extensions.com.openai.interface.category "productivity" is not one of OpenAI\'s categories' });
    });
  });

  describe('required paths', () => {
    it('flags a folder named assets/icon.png', () => {
      fs.rmSync(path.join(dir, 'assets/icon.png'));
      fs.mkdirSync(path.join(dir, 'assets/icon.png'));
      assertFinding({ findings: check(), rule: 'structure', includes: 'must be a file' });
    });
  });

  describe('reference', () => {
    it('flags a link to a missing file', () => {
      write({ dir, rel: 'skills/demo/SKILL.md', content: '---\nname: demo\ndescription: d\n---\n\n[x](references/nope.md)\n' });
      assertFinding({ findings: check(), rule: 'reference', includes: 'references/nope.md' });
    });

    it('flags a cited path that does not exist from the citing folder', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: 'See `references/studio/x.md`.\n' });
      const finding = assertFinding({ findings: check(), rule: 'reference', includes: 'references/studio/x.md' });
      assert.equal(finding.line, 1);
    });

    it('flags a mention of CLAUDE_PLUGIN_ROOT', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: 'Run ${CLAUDE_PLUGIN_ROOT}/run.sh\n' });
      assertFinding({ findings: check(), rule: 'reference', includes: 'CLAUDE_PLUGIN_ROOT' });
    });

    it('does not read link syntax inside a fenced code block', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: 'Text\n\n```js\nhandlers[name](args);\n```\n\n~~~\nother[x](y)\n~~~\n' });
      assert.deepEqual(check(), []);
    });

    it('still flags a link after a fenced code block', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: '```js\nhandlers[name](args);\n```\n\n[x](missing.md)\n' });
      assertFinding({ findings: check(), rule: 'reference', includes: 'missing.md' });
    });

    it('still checks backticked paths inside a fenced code block', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: '```\n`references/studio/x.md`\n```\n' });
      assertFinding({ findings: check(), rule: 'reference', includes: 'references/studio/x.md' });
    });

    it('flags a link that leaves its skill', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: '[x](../../../README.md)\n' });
      assertFinding({ findings: check(), rule: 'reference', includes: '../../../README.md' });
    });
  });

  describe('built-in denylist', () => {
    const denylist = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'denylist.json'), 'utf8')).patterns;
    const flagged = (content) => {
      write({ dir, rel: 'skills/demo/references/b.md', content });
      return findingsFor({ findings: check(denylist), rule: 'internal' }).length > 0;
    };

    it('flags .local hosts, link-local addresses and a bare $PLUGIN_ROOT', () => {
      assert.ok(flagged('curl http://build.local/x\n'));
      assert.ok(flagged('http://169.254.169.254/latest\n'));
      assert.ok(flagged('run $PLUGIN_ROOT/run.sh\n'));
      assert.ok(flagged('run ${PLUGIN_ROOT}/run.sh\n'));
    });

    it('does not flag .locale or localStorage', () => {
      assert.equal(flagged('use Intl.locale and window.localStorage and navigator.locale\n'), false);
    });
  });

  describe('internal', () => {
    it('flags localhost with its line', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: 'one\ntwo http://localhost:3000 three\n' });
      const finding = assertFinding({ findings: check(['\\blocalhost\\b']), rule: 'internal' });
      assert.equal(finding.line, 2);
      assert.equal(finding.file, 'skills/demo/references/b.md');
    });

    it('flags a pattern passed as an extra', () => {
      write({ dir, rel: 'skills/demo/references/b.md', content: 'The Acme-Secret project\n' });
      assert.deepEqual(findingsFor({ findings: check(), rule: 'internal' }), []);
      assertFinding({ findings: check(['acme-secret']), rule: 'internal' });
    });
  });

  describe('files', () => {
    it('flags a .DS_Store', () => {
      write({ dir, rel: 'assets/.DS_Store', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: '.DS_Store' });
    });

    it('flags a hidden file that has an allowed extension', () => {
      write({ dir, rel: 'assets/.secret.md', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: 'hidden' });
    });

    it('flags a folder name ending with a dot', () => {
      write({ dir, rel: 'skills/demo/references/dir./x.md', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: 'ends with a dot' });
    });

    it('flags a file it cannot read', (t) => {
      if (process.getuid?.() === 0) return t.skip('root can read everything');
      const file = path.join(dir, 'skills/demo/references/a.md');
      fs.chmodSync(file, 0o000);
      try {
        assertFinding({ findings: check(), rule: 'files', includes: 'could not be read' });
      } finally {
        fs.chmodSync(file, 0o644);
      }
    });

    it('flags an icon it cannot read instead of crashing', (t) => {
      if (process.getuid?.() === 0) return t.skip('root can read everything');
      const file = path.join(dir, 'assets/icon.png');
      fs.chmodSync(file, 0o000);
      try {
        assertFinding({ findings: check(), rule: 'files', includes: 'assets/icon.png' });
      } finally {
        fs.chmodSync(file, 0o644);
      }
    });

    it('flags a symbolic link', () => {
      fs.symlinkSync(path.join(dir, 'README.md'), path.join(dir, 'assets/link.md'));
      assertFinding({ findings: check(), rule: 'files', includes: 'symbolic link' });
    });

    it('flags a .zip file', () => {
      write({ dir, rel: 'assets/a.zip', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: '.zip' });
    });

    it('flags a markdown file of 256 KiB plus one byte and accepts 256 KiB', () => {
      write({ dir, rel: 'skills/demo/references/big.md', content: 'a'.repeat(256 * 1024) });
      assert.deepEqual(check(), []);
      write({ dir, rel: 'skills/demo/references/big.md', content: 'a'.repeat(256 * 1024 + 1) });
      assertFinding({ findings: check(), rule: 'files', includes: 'big.md' });
    });

    it('does not limit the size of images', () => {
      write({ dir, rel: 'skills/demo/references/shot.png', content: Buffer.alloc(300 * 1024) });
      assert.deepEqual(check(), []);
    });

    it('flags 513 files', () => {
      for (let i = 0; i < 513 - 7; i += 1) write({ dir, rel: `skills/demo/references/many/f${i}.md`, content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: '513' });
    });

    it('flags a name that is invalid on Windows', () => {
      write({ dir, rel: 'skills/demo/references/con:fig.md', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: 'con:fig.md' });
    });

    it('flags a reserved Windows name', () => {
      write({ dir, rel: 'skills/demo/references/NUL.md', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: 'NUL.md' });
    });

    it('flags a trailing dot in a name', () => {
      write({ dir, rel: 'skills/demo/references/end.', content: 'x' });
      assertFinding({ findings: check(), rule: 'files', includes: 'end.' });
    });

    it('flags two names that differ only in case', () => {
      const entries = [...walkPlugin({ dir }), { rel: 'skills/demo/skill.md', type: 'file', size: 1 }];
      const findings = checkEntries({ dir, patterns: [], entries });
      assertFinding({ findings, rule: 'files', includes: 'case' });
    });
  });

  describe('icon', () => {
    it('flags a 1024 x 512 PNG', () => {
      write({ dir, rel: 'assets/icon.png', content: buildPng({ width: 1024, height: 512 }) });
      assertFinding({ findings: check(), rule: 'icon', includes: 'square' });
    });

    it('flags a 256 x 256 PNG', () => {
      write({ dir, rel: 'assets/icon.png', content: buildPng({ width: 256, height: 256 }) });
      assertFinding({ findings: check(), rule: 'icon', includes: '512' });
    });

    it('flags a file that is not a PNG', () => {
      write({ dir, rel: 'assets/icon.png', content: 'not a png at all, really not a png at all' });
      assertFinding({ findings: check(), rule: 'icon', includes: 'PNG' });
    });

    it('flags an icon of 2 MiB or more', () => {
      write({ dir, rel: 'assets/icon.png', content: Buffer.concat([buildPng({ width: 1024, height: 1024 }), Buffer.alloc(2 * 1024 * 1024)]) });
      assertFinding({ findings: check(), rule: 'icon', includes: '2 MiB' });
    });
  });
});

describe('checkRepo', () => {
  let root;

  function writeMarketplaces({ claude = ['demo'], codex = ['demo'] }) {
    write({
      dir: root,
      rel: '.claude-plugin/marketplace.json',
      content: JSON.stringify({ name: 'demo', plugins: claude.map((name) => ({ name, source: `./plugins/${name}` })) }),
    });
    write({
      dir: root,
      rel: '.agents/plugins/marketplace.json',
      content: JSON.stringify({
        name: 'demo',
        plugins: codex.map((name) => ({ name, source: { source: 'local', path: `./plugins/${name}` } })),
      }),
    });
  }

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'check-repo-'));
    makePlugin({ parent: path.join(root, 'plugins') });
    write({ dir: root, rel: 'LICENSE', content: 'MIT' });
    writeMarketplaces({});
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('passes a valid repo', () => assert.deepEqual(checkRepo({ root, patterns: [] }), []));

  it('prefixes plugin findings with the plugin folder', () => {
    write({ dir: path.join(root, 'plugins/demo'), rel: 'extra.md', content: 'x' });
    assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'structure', includes: 'plugins/demo/extra.md' });
  });

  it('flags a plugin missing from one marketplace, and a listed plugin without folder', () => {
    writeMarketplaces({ claude: ['demo'], codex: [] });
    const missing = assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'marketplace', includes: 'not in .agents/plugins/marketplace.json' });
    assert.equal(missing.file, 'plugins/demo');

    writeMarketplaces({ claude: ['demo', 'ghost'], codex: ['demo', 'ghost'] });
    const ghost = assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'marketplace', includes: 'listed but missing' });
    assert.equal(ghost.file, 'plugins/ghost');
  });

  it('flags a marketplace entry whose source does not point to the plugin folder', () => {
    write({
      dir: root,
      rel: '.claude-plugin/marketplace.json',
      content: JSON.stringify({ name: 'demo', plugins: [{ name: 'demo', source: './elsewhere/demo' }] }),
    });
    assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'marketplace', includes: './plugins/demo' });
  });

  it('flags a missing marketplace file', () => {
    fs.rmSync(path.join(root, '.agents'), { recursive: true });
    assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'marketplace', includes: '.agents/plugins/marketplace.json' });
  });

  it('reports malformed marketplaces instead of crashing', () => {
    const claude = '.claude-plugin/marketplace.json';
    const cases = [
      ['null', 'must be a JSON object'],
      ['{}', 'plugins must be an array'],
      ['{"plugins":{}}', 'plugins must be an array'],
      ['{"plugins":[null]}', 'needs a name'],
      ['{"plugins":[{"source":"./plugins/demo"}]}', 'needs a name'],
    ];
    for (const [content, includes] of cases) {
      write({ dir: root, rel: claude, content });
      const finding = assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'marketplace', includes });
      assert.ok([claude].includes(finding.file) || finding.file === 'plugins/demo', content);
    }
  });

  it('flags a stray file in plugins/', () => {
    write({ dir: root, rel: 'plugins/notes.md', content: 'x' });
    const finding = assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'files', includes: 'only plugin folders' });
    assert.equal(finding.file, 'plugins/notes.md');
  });

  it('flags a hidden entry and a symlink in plugins/', () => {
    fs.mkdirSync(path.join(root, 'plugins/.hidden'));
    fs.symlinkSync(path.join(root, 'plugins/demo'), path.join(root, 'plugins/alias'));
    const findings = checkRepo({ root, patterns: [] });
    assertFinding({ findings, rule: 'files', includes: 'hidden entry' });
    assertFinding({ findings, rule: 'files', includes: 'symbolic link' });
  });

  it('flags OS junk anywhere and reports it once', () => {
    write({ dir: root, rel: '.DS_Store', content: 'x' });
    write({ dir: root, rel: 'docs/Thumbs.db', content: 'x' });
    write({ dir: root, rel: 'plugins/.DS_Store', content: 'x' });
    write({ dir: root, rel: 'plugins/demo/.DS_Store', content: 'x' });
    const findings = findingsFor({ findings: checkRepo({ root, patterns: [] }), rule: 'files' });
    for (const file of ['.DS_Store', 'docs/Thumbs.db', 'plugins/.DS_Store', 'plugins/demo/.DS_Store']) {
      assert.equal(findings.filter((f) => f.file === file).length, 1, file);
    }
  });

  it('flags a gitleaks override anywhere', () => {
    write({ dir: root, rel: 'docs/.gitleaks.toml', content: 'x' });
    write({ dir: root, rel: '.gitleaksignore', content: 'x' });
    const findings = checkRepo({ root, patterns: [] });
    assertFinding({ findings, rule: 'files', includes: 'docs/.gitleaks.toml' });
    assertFinding({ findings, rule: 'files', includes: '.gitleaksignore' });
  });

  it('ignores the .git folder', () => {
    write({ dir: root, rel: '.git/.DS_Store', content: 'x' });
    assert.deepEqual(checkRepo({ root, patterns: [] }), []);
  });

  it('flags a repo without plugins', () => {
    fs.rmSync(path.join(root, 'plugins'), { recursive: true });
    writeMarketplaces({ claude: [], codex: [] });
    assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'structure', includes: 'no plugins to check' });
  });

  it('flags a missing LICENSE', () => {
    fs.rmSync(path.join(root, 'LICENSE'));
    assertFinding({ findings: checkRepo({ root, patterns: [] }), rule: 'structure', includes: 'LICENSE' });
  });
});

describe('command line', () => {
  let parent;
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

  const run = ({ args, cwd = parent }) =>
    spawnSync(process.execPath, [path.join(scriptsDir, 'check-package.mjs'), ...args], { cwd, encoding: 'utf8' });

  beforeEach(() => {
    parent = fs.mkdtempSync(path.join(os.tmpdir(), 'check-cli-'));
  });

  afterEach(() => {
    fs.rmSync(parent, { recursive: true, force: true });
  });

  it('prints ok and exits 0 for a valid plugin', () => {
    const dir = makePlugin({ parent });
    const result = run({ args: [dir] });
    assert.equal(result.stdout, 'ok: 1 plugin(s) checked\n');
    assert.equal(result.status, 0);
  });

  it('prints one line per finding and exits 1 for a broken plugin', () => {
    const dir = makePlugin({ parent });
    write({ dir, rel: 'skills/demo/references/a.md', content: 'one\nhttp://localhost:3000\n' });
    write({ dir, rel: 'extra.md', content: 'x' });
    const result = run({ args: [dir] });
    assert.equal(result.status, 1);
    const lines = result.stdout.trim().split('\n');
    assert.ok(lines.includes('extra.md: structure: not allowed in the plugin root'), result.stdout);
    assert.ok(lines.some((l) => /^skills\/demo\/references\/a\.md:2: internal: .+$/.test(l)), result.stdout);
    for (const line of lines) assert.match(line, /^[^:]+(?::\d+)?: [a-z]+: .+$/);
  });

  it('adds the patterns of --patterns, compiled case-insensitively', () => {
    const dir = makePlugin({ parent });
    write({ dir, rel: 'skills/demo/references/a.md', content: 'The Acme-Secret project\n' });
    const patterns = path.join(parent, 'extra.json');
    fs.writeFileSync(patterns, JSON.stringify({ patterns: ['acme-secret'] }));
    assert.equal(run({ args: [dir] }).status, 0);
    const result = run({ args: [dir, '--patterns', patterns] });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /a\.md:1: internal: matches acme-secret/);
  });

  it('still applies the built-in denylist with --patterns', () => {
    const dir = makePlugin({ parent });
    write({ dir, rel: 'skills/demo/references/a.md', content: 'http://localhost:3000\n' });
    const patterns = path.join(parent, 'extra.json');
    fs.writeFileSync(patterns, JSON.stringify({ patterns: ['nothing-here'] }));
    assert.equal(run({ args: [dir, '--patterns', patterns] }).status, 1);
  });

  it('exits 2 with a message on usage and load errors', () => {
    const dir = makePlugin({ parent });
    const usage = run({ args: [] });
    assert.equal(usage.status, 2);
    assert.match(usage.stderr, /usage:/);

    const notFolder = run({ args: [path.join(parent, 'nope')] });
    assert.equal(notFolder.status, 2);
    assert.match(notFolder.stderr, /is not a folder/);

    const bad = path.join(parent, 'bad.json');
    fs.writeFileSync(bad, '{ nope');
    const badPatterns = run({ args: [dir, '--patterns', bad] });
    assert.equal(badPatterns.status, 2);
    assert.match(badPatterns.stderr, /cannot load patterns/);

    const regex = path.join(parent, 'regex.json');
    fs.writeFileSync(regex, JSON.stringify({ patterns: ['('] }));
    assert.equal(run({ args: [dir, '--patterns', regex] }).status, 2);
  });

  it('exits 1 with --all when there is no plugin', () => {
    const repo = path.join(parent, 'empty');
    fs.mkdirSync(path.join(repo, 'scripts'), { recursive: true });
    for (const file of ['check-package.mjs', 'denylist.json', 'agent-plugins-1.0.0.schema.json']) {
      fs.copyFileSync(path.join(scriptsDir, file), path.join(repo, 'scripts', file));
    }
    const result = spawnSync(process.execPath, [path.join(repo, 'scripts/check-package.mjs'), '--all'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^plugins: structure: no plugins to check$/m);
    assert.doesNotMatch(result.stdout, /^ok:/m);
  });

  it('checks the repo around its own scripts folder with --all', () => {
    const repo = path.join(parent, 'repo');
    fs.mkdirSync(path.join(repo, 'scripts'), { recursive: true });
    for (const file of ['check-package.mjs', 'denylist.json', 'agent-plugins-1.0.0.schema.json']) {
      fs.copyFileSync(path.join(scriptsDir, file), path.join(repo, 'scripts', file));
    }
    makePlugin({ parent: path.join(repo, 'plugins') });
    const script = path.join(repo, 'scripts/check-package.mjs');
    const broken = spawnSync(process.execPath, [script, '--all'], { encoding: 'utf8' });
    assert.equal(broken.status, 1);
    assert.match(broken.stdout, /^LICENSE: structure: required file is missing$/m);

    fs.writeFileSync(path.join(repo, 'LICENSE'), 'MIT');
    for (const [rel, content] of [
      ['.claude-plugin/marketplace.json', { plugins: [{ name: 'demo', source: './plugins/demo' }] }],
      ['.agents/plugins/marketplace.json', { plugins: [{ name: 'demo', source: { source: 'local', path: './plugins/demo' } }] }],
    ]) write({ dir: repo, rel, content: JSON.stringify(content) });
    const ok = spawnSync(process.execPath, [script, '--all'], { encoding: 'utf8' });
    assert.equal(ok.stdout, 'ok: 1 plugin(s) checked\n');
    assert.equal(ok.status, 0);
  });
});
