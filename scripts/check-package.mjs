import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = JSON.parse(fs.readFileSync(path.join(SCRIPTS_DIR, 'agent-plugins-1.0.0.schema.json'), 'utf8'));

const MANIFEST_FILES = ['plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json'];
const MCP_FILE = '.mcp.json';
const MCP_PORTABLE_FILE = 'mcp.json';
const MCP_REFERENCE = './.mcp.json';
const MCP_PORTABLE_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';
const MCP_SERVER_TYPES = { [MCP_FILE]: ['http', 'sse'], [MCP_PORTABLE_FILE]: ['streamable-http', 'sse'] };
const MCP_PORTABLE_TYPE = new Map([['http', 'streamable-http'], ['sse', 'sse']]);
const ROOT_ENTRIES = ['plugin.json', '.claude-plugin', '.codex-plugin', MCP_FILE, MCP_PORTABLE_FILE, 'README.md', 'assets', 'skills'];
const COMMON_MANIFEST_KEYS = ['name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords'];
const ALLOWED_MANIFEST_KEYS = {
  '.claude-plugin/plugin.json': COMMON_MANIFEST_KEYS,
  '.codex-plugin/plugin.json': [...COMMON_MANIFEST_KEYS, 'skills', 'interface', 'mcpServers'],
};
const ALLOWED_INTERFACE_KEYS = [
  'displayName', 'shortDescription', 'longDescription', 'developerName', 'category', 'capabilities', 'websiteURL',
  'supportURL', 'privacyPolicyURL', 'termsOfServiceURL', 'defaultPrompt', 'brandColor', 'composerIcon', 'logo',
  'screenshots',
];
const OPENAI_EXTENSION = 'com.openai';
const OPENAI_INTERFACE_LABEL = `extensions.${OPENAI_EXTENSION}.interface`;
const OPENAI_CATEGORIES = [
  'Business & Operations', 'Communication', 'Creativity', 'Data & Analytics', 'Developer Tools', 'Education & Research',
  'Entertainment', 'Finance', 'Healthcare', 'Other', 'Productivity', 'Scientific Research', 'Security', 'Travel',
];
const MAX_LISTING_TEXT = 30;
const REPO_JUNK_NAMES = ['.DS_Store', 'Thumbs.db', 'desktop.ini', '__MACOSX'];
const GITLEAKS_OVERRIDES = ['.gitleaks.toml', '.gitleaksignore'];
const HIDDEN_ALLOWED = ['.claude-plugin', '.codex-plugin', MCP_FILE];
const TEXT_EXTENSIONS = ['.md', '.txt', '.json', '.js', '.mjs', '.ts', '.yml', '.yaml', '.svg'];
const BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.otf'];
const ALLOWED_EXTENSIONS = [...TEXT_EXTENSIONS, ...BINARY_EXTENSIONS];
const SIZE_EXEMPT_EXTENSIONS = BINARY_EXTENSIONS;
const MAX_TEXT_BYTES = 256 * 1024;
const MAX_FILES = 512;
const MAX_DESCRIPTION = 1024;
const MIN_README_WORDS = 40;
const ICON_MIN = 512;
const ICON_MAX = 2048;
const ICON_MAX_BYTES = 2 * 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const CITED_PATH = /`([\w.-]+(?:\/[\w.-]+)+\.(?:md|js|mjs|ts|json|txt))`/g;
const RELATIVE_LINK = /\]\(((?!https?:|#|mailto:)[^)\s#]+)(?:#[^)]*)?\)/g;
const PLUGIN_ROOT_MENTION = /CLAUDE_PLUGIN_ROOT|\$\{PLUGIN_ROOT\}/g;
const INVALID_NAME_CHARS = /[<>:"\\|?*]/;
const RESERVED_NAMES = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

const posix = (...parts) => parts.join('/');
const extensionOf = (file) => path.extname(file).toLowerCase();

export function walkPlugin({ dir }) {
  const entries = [];
  const visit = (relDir) => {
    const names = fs.readdirSync(path.join(dir, relDir)).sort();
    for (const name of names) {
      const rel = relDir ? posix(relDir, name) : name;
      const stat = fs.lstatSync(path.join(dir, rel));
      if (stat.isSymbolicLink()) entries.push({ rel, type: 'symlink', size: 0 });
      else if (stat.isDirectory()) {
        entries.push({ rel, type: 'dir', size: 0 });
        visit(rel);
      } else entries.push({ rel, type: 'file', size: stat.size });
    }
  };
  visit('');
  return entries;
}

function createReader({ dir }) {
  const cache = new Map();
  const unreadable = [];
  const readBytes = (rel) => {
    if (!cache.has(rel)) {
      try {
        cache.set(rel, fs.readFileSync(path.join(dir, rel)));
      } catch (error) {
        cache.set(rel, null);
        unreadable.push({ file: rel, rule: 'files', message: `could not be read: ${error.code ?? error.message}` });
      }
    }
    return cache.get(rel);
  };
  const readText = (rel) => readBytes(rel)?.toString('utf8') ?? null;
  return { readBytes, readText, unreadable };
}

function parseFrontmatter({ text }) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return null;
  const fields = {};
  let key = null;
  for (const line of match[1].split(/\r?\n/)) {
    const top = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (top) {
      key = top[1];
      fields[key] = top[2].trim();
    } else if (key && /^\s+\S/.test(line)) {
      fields[key] = `${fields[key]} ${line.trim()}`.trim();
    }
  }
  for (const [k, v] of Object.entries(fields)) {
    const folded = v.replace(/^[>|][+-]?\s*/, '');
    fields[k] = folded.replace(/^(["'])([\s\S]*)\1$/, '$2');
  }
  return fields;
}

function nameFindings({ rel }) {
  const findings = [];
  const segments = rel.split('/');
  segments.forEach((segment, index) => {
    const isRootLevel = index === 0;
    if (segment.startsWith('.') && !(isRootLevel && HIDDEN_ALLOWED.includes(segment))) {
      findings.push(`hidden file or folder "${segment}" is not allowed`);
      return;
    }
    if (INVALID_NAME_CHARS.test(segment)) findings.push(`"${segment}" has a character that is invalid on Windows`);
    if (/[. ]$/.test(segment)) findings.push(`"${segment}" ends with a dot or a space`);
    if (RESERVED_NAMES.test(segment.split('.')[0])) findings.push(`"${segment}" is a reserved Windows name`);
  });
  return findings;
}

function checkFiles({ entries }) {
  const findings = [];
  const add = (file, message) => findings.push({ file, rule: 'files', message });
  const files = entries.filter((e) => e.type !== 'dir');

  if (files.length > MAX_FILES) add('.', `${files.length} files, at most ${MAX_FILES} are allowed`);

  const seen = new Map();
  for (const entry of entries) {
    const lower = entry.rel.toLowerCase();
    if (seen.has(lower) && seen.get(lower) !== entry.rel) {
      add(entry.rel, `differs only in case from ${seen.get(lower)}`);
    } else seen.set(lower, entry.rel);
  }

  for (const entry of entries) {
    const names = nameFindings({ rel: entry.rel });
    for (const message of names) add(entry.rel, message);
    if (entry.type === 'symlink') {
      add(entry.rel, 'symbolic link');
      continue;
    }
    if (entry.type !== 'file' || names.length > 0) continue;
    const ext = extensionOf(entry.rel);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      add(entry.rel, `extension "${ext}" is not allowed`);
      continue;
    }
    if (!SIZE_EXEMPT_EXTENSIONS.includes(ext) && entry.size > MAX_TEXT_BYTES) {
      add(entry.rel, `${entry.size} bytes, text files must be at most ${MAX_TEXT_BYTES / 1024} KiB`);
    }
  }
  return findings;
}

function checkStructure({ read, entries }) {
  const findings = [];
  const add = (file, message) => findings.push({ file, rule: 'structure', message });
  const rels = new Set(entries.map((e) => e.rel));
  const fileRels = new Set(entries.filter((e) => e.type === 'file').map((e) => e.rel));

  for (const entry of entries.filter((e) => !e.rel.includes('/'))) {
    if (!ROOT_ENTRIES.includes(entry.rel)) add(entry.rel, 'not allowed in the plugin root');
  }
  for (const required of [...MANIFEST_FILES, 'README.md', 'assets/icon.png']) {
    if (!rels.has(required)) add(required, 'required file is missing');
    else if (!fileRels.has(required)) add(required, 'must be a file');
  }

  const readme = fileRels.has('README.md') ? read('README.md') : null;
  if (readme !== null) {
    const words = readme.split(/\s+/).filter(Boolean).length;
    if (words < MIN_README_WORDS) add('README.md', `${words} words, at least ${MIN_README_WORDS} are needed`);
  }

  const skillFolders = entries.filter((e) => e.type === 'dir' && /^skills\/[^/]+$/.test(e.rel));
  const skillFiles = skillFolders.map((e) => posix(e.rel, 'SKILL.md')).filter((rel) => rels.has(rel));
  if (skillFiles.length === 0) add('skills', 'at least one skills/<name>/SKILL.md is required');
  for (const folder of skillFolders) {
    const rel = posix(folder.rel, 'SKILL.md');
    if (!rels.has(rel)) {
      add(folder.rel, 'SKILL.md is missing');
      continue;
    }
    const fields = parseFrontmatter({ text: read(rel) ?? '' });
    if (!fields) {
      add(rel, 'frontmatter is missing');
      continue;
    }
    if (!fields.name) add(rel, 'frontmatter has no name');
    if (!fields.description) add(rel, 'frontmatter has no description');
    else if (fields.description.length > MAX_DESCRIPTION) {
      add(rel, `description has ${fields.description.length} characters, at most ${MAX_DESCRIPTION} are allowed`);
    }
  }
  return findings;
}

function checkManifestPath({ dir, file, label, value, kind }) {
  if (typeof value !== 'string') return [{ file, rule: 'manifest', message: `${label} must be a string path` }];
  const problems = [];
  if (!value.startsWith('./')) problems.push(`${label} "${value}" must start with ./`);
  if (value.split('/').includes('..')) problems.push(`${label} "${value}" must not contain ..`);
  if (problems.length === 0) {
    let stat = null;
    try {
      stat = fs.statSync(path.join(dir, value));
    } catch {
      problems.push(`${label} "${value}" does not exist`);
    }
    if (stat && kind === 'dir' && !stat.isDirectory()) problems.push(`${label} "${value}" must be a folder`);
    if (stat && kind === 'file' && !stat.isFile()) problems.push(`${label} "${value}" must be a file`);
  }
  return problems.map((message) => ({ file, rule: 'manifest', message }));
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (isObject(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
};

function manifestInterface({ file, manifest }) {
  if (file === '.codex-plugin/plugin.json') return { label: 'interface', ui: manifest.interface };
  if (file === 'plugin.json' && isObject(manifest.extensions) && isObject(manifest.extensions[OPENAI_EXTENSION])) {
    return { label: OPENAI_INTERFACE_LABEL, ui: manifest.extensions[OPENAI_EXTENSION].interface };
  }
  return { label: 'interface', ui: undefined };
}

function extensionProblems({ manifest }) {
  const { extensions } = manifest;
  if (extensions === undefined) return [];
  if (!isObject(extensions)) return ['extensions must be an object'];
  const problems = Object.keys(extensions)
    .filter((namespace) => namespace !== OPENAI_EXTENSION)
    .map((namespace) => `field extensions.${namespace} is not allowed (skills-only plugin)`);
  const openai = extensions[OPENAI_EXTENSION];
  if (openai === undefined) return problems;
  if (!isObject(openai)) return [...problems, `extensions.${OPENAI_EXTENSION} must be an object`];
  problems.push(...Object.keys(openai)
    .filter((key) => key !== 'interface')
    .map((key) => `field extensions.${OPENAI_EXTENSION}.${key} is not allowed (skills-only plugin)`));
  if (openai.interface !== undefined && !isObject(openai.interface)) problems.push(`${OPENAI_INTERFACE_LABEL} must be an object`);
  return problems;
}

function listingProblems({ label, ui }) {
  const problems = [];
  for (const key of ['displayName', 'shortDescription']) {
    const length = typeof ui[key] === 'string' ? [...ui[key]].length : 0;
    if (length > MAX_LISTING_TEXT) problems.push(`${label}.${key} has ${length} characters, at most ${MAX_LISTING_TEXT} are allowed`);
  }
  if (ui.category !== undefined && !OPENAI_CATEGORIES.includes(ui.category)) {
    problems.push(`${label}.category "${ui.category}" is not one of OpenAI's categories`);
  }
  return problems;
}

function manifestPathFields({ file, manifest }) {
  const fields = [['skills', manifest.skills, 'dir']];
  if (file === '.codex-plugin/plugin.json') fields.push(['mcpServers', manifest.mcpServers, 'file']);
  const { label, ui } = manifestInterface({ file, manifest });
  if (isObject(ui)) {
    fields.push([`${label}.logo`, ui.logo, 'file'], [`${label}.composerIcon`, ui.composerIcon, 'file']);
    if (Array.isArray(ui.screenshots)) {
      ui.screenshots.forEach((value, index) => fields.push([`${label}.screenshots[${index}]`, value, 'file']));
    } else fields.push([`${label}.screenshots`, ui.screenshots, 'file']);
  }
  return fields;
}

function disallowedFields({ file, manifest }) {
  const allowed = ALLOWED_MANIFEST_KEYS[file];
  const names = allowed ? Object.keys(manifest).filter((key) => !allowed.includes(key)) : [];
  const { label, ui } = manifestInterface({ file, manifest });
  if (isObject(ui)) {
    names.push(...Object.keys(ui).filter((key) => !ALLOWED_INTERFACE_KEYS.includes(key)).map((key) => `${label}.${key}`));
  }
  return names;
}

function mcpServerProblems({ name, server, types }) {
  if (server === null || typeof server !== 'object' || Array.isArray(server)) {
    return [`server ${name}: must be an object with type and url`];
  }
  const problems = [];
  const extra = Object.keys(server).filter((key) => key !== 'type' && key !== 'url');
  if (extra.length > 0) problems.push(`server ${name}: only remote https servers (type and url) are allowed, not ${extra.join(', ')}`);
  if (!types.includes(server.type)) problems.push(`server ${name}: type must be ${types.join(' or ')}`);
  if (typeof server.url !== 'string' || !server.url.startsWith('https://') || server.url !== server.url.trim()) {
    problems.push(`server ${name}: url must be a string starting with https://`);
    return problems;
  }
  let url = null;
  try {
    url = new URL(server.url);
  } catch {
    problems.push(`server ${name}: url must be an absolute https URL`);
  }
  if (url && (url.username || url.password)) problems.push(`server ${name}: url must not contain credentials`);
  if (url && url.search) problems.push(`server ${name}: url must not contain a query string`);
  return problems;
}

function checkMcpFile({ read, file }) {
  const add = (message) => [{ file, rule: 'manifest', message }];
  let json;
  try {
    json = JSON.parse(read(file) ?? '');
  } catch (error) {
    return add(`invalid JSON: ${error.message}`);
  }
  const servers = json?.mcpServers;
  if (servers === null || typeof servers !== 'object' || Array.isArray(servers)) return add('must be an object with an mcpServers object');
  const findings = [];
  if (file === MCP_PORTABLE_FILE) {
    if (json.$schema !== MCP_PORTABLE_SCHEMA) findings.push(...add(`$schema must be ${MCP_PORTABLE_SCHEMA}`));
    for (const key of Object.keys(json)) {
      if (key !== '$schema' && key !== 'mcpServers') findings.push(...add(`field ${key} is not allowed`));
    }
  }
  const names = Object.keys(servers);
  if (names.length === 0) return [...findings, ...add('mcpServers must declare at least one server')];
  const types = MCP_SERVER_TYPES[file];
  return [...findings, ...names.flatMap((name) => mcpServerProblems({ name, server: servers[name], types })).flatMap(add)];
}

function readServers({ read, file }) {
  try {
    const servers = JSON.parse(read(file) ?? '')?.mcpServers;
    return servers !== null && typeof servers === 'object' && !Array.isArray(servers) ? servers : null;
  } catch {
    return null;
  }
}

function checkMcpPair({ read, rels }) {
  const hasDotted = rels.has(MCP_FILE);
  const hasPortable = rels.has(MCP_PORTABLE_FILE);
  if (!hasDotted && !hasPortable) return [];
  const add = (file, message) => [{ file, rule: 'manifest', message }];
  if (!hasDotted) return add(MCP_FILE, `required because ${MCP_PORTABLE_FILE} exists`);
  if (!hasPortable) return add(MCP_PORTABLE_FILE, `required because ${MCP_FILE} exists`);
  const dotted = readServers({ read, file: MCP_FILE });
  const portable = readServers({ read, file: MCP_PORTABLE_FILE });
  if (!dotted || !portable) return [];
  const names = [...new Set([...Object.keys(dotted), ...Object.keys(portable)])];
  return names.flatMap((name) => {
    if (!Object.hasOwn(dotted, name) || !Object.hasOwn(portable, name)) {
      return add(MCP_PORTABLE_FILE, `server ${name}: must be declared in both ${MCP_FILE} and ${MCP_PORTABLE_FILE}`);
    }
    const source = dotted[name];
    const target = portable[name];
    const type = MCP_PORTABLE_TYPE.get(source?.type);
    if (!type || (target?.type === type && target?.url === source.url)) return [];
    return add(MCP_PORTABLE_FILE, `server ${name}: must have type ${type} and the url of ${MCP_FILE}`);
  });
}

function checkSchema({ manifest }) {
  const problems = [];
  for (const key of SCHEMA.required) if (!(key in manifest)) problems.push(`required field ${key} is missing`);
  for (const key of Object.keys(manifest)) {
    if (!(key in SCHEMA.properties)) problems.push(`field ${key} is not in the Agent Plugins schema`);
  }
  const schemaConst = SCHEMA.properties.$schema.const;
  if ('$schema' in manifest && manifest.$schema !== schemaConst) problems.push(`$schema must be ${schemaConst}`);
  const namePattern = new RegExp(SCHEMA.properties.name.pattern);
  if ('name' in manifest && !(typeof manifest.name === 'string' && namePattern.test(manifest.name))) {
    problems.push(`name "${manifest.name}" does not match ${SCHEMA.properties.name.pattern}`);
  }
  return problems;
}

function checkManifests({ dir, read, entries }) {
  const findings = [];
  const add = (file, message) => findings.push({ file, rule: 'manifest', message });
  const rels = new Set(entries.map((e) => e.rel));
  const folderName = path.basename(path.resolve(dir));
  const versions = new Map();
  const listings = new Map();

  for (const file of MANIFEST_FILES) {
    if (!rels.has(file)) continue;
    let manifest;
    try {
      manifest = JSON.parse(read(file) ?? '');
    } catch (error) {
      add(file, `invalid JSON: ${error.message}`);
      continue;
    }
    if (manifest === null || typeof manifest !== 'object' || Array.isArray(manifest)) {
      add(file, 'must be a JSON object');
      continue;
    }
    if (file === 'plugin.json') for (const message of checkSchema({ manifest })) add(file, message);
    if (manifest.name !== folderName) add(file, `name "${manifest.name}" is not the plugin folder name "${folderName}"`);
    if (typeof manifest.version !== 'string' || !SEMVER.test(manifest.version)) {
      add(file, `version "${manifest.version}" is not semver`);
    } else versions.set(file, manifest.version);
    if (file === '.claude-plugin/plugin.json' && !manifest.license) add(file, 'license is missing');

    for (const name of disallowedFields({ file, manifest })) add(file, `field ${name} is not allowed (skills-only plugin)`);
    if (file === 'plugin.json') for (const message of extensionProblems({ manifest })) add(file, message);
    const listing = manifestInterface({ file, manifest });
    if (isObject(listing.ui)) {
      for (const message of listingProblems(listing)) add(file, message);
      listings.set(file, JSON.stringify(canonical(listing.ui)));
    }
    if (file === '.codex-plugin/plugin.json') {
      const declared = manifest.mcpServers;
      if (declared !== undefined && declared !== MCP_REFERENCE && typeof declared === 'string') {
        add(file, `mcpServers "${declared}" must be ${MCP_REFERENCE}`);
      }
      if (declared === undefined && rels.has(MCP_FILE)) add(file, `mcpServers must be ${MCP_REFERENCE} because the plugin bundles ${MCP_FILE}`);
    }
    for (const [label, value, kind] of manifestPathFields({ file, manifest })) {
      if (value !== undefined) findings.push(...checkManifestPath({ dir, file, label, value, kind }));
    }
  }
  const rootListing = listings.get('plugin.json');
  const codexListing = listings.get('.codex-plugin/plugin.json');
  if (rootListing && codexListing && rootListing !== codexListing) {
    add('.codex-plugin/plugin.json', `interface must be the same as ${OPENAI_INTERFACE_LABEL} in plugin.json`);
  }
  for (const file of [MCP_FILE, MCP_PORTABLE_FILE]) if (rels.has(file)) findings.push(...checkMcpFile({ read, file }));
  findings.push(...checkMcpPair({ read, rels }));
  if (new Set(versions.values()).size > 1) {
    const detail = [...versions].map(([file, version]) => `${file} ${version}`).join(', ');
    add('plugin.json', `version differs between manifests: ${detail}`);
  }
  return findings;
}

function checkReferences({ dir, read, entries }) {
  const findings = [];
  const markdown = entries.filter((e) => e.type === 'file' && /^skills\/[^/]+\/.+\.md$/i.test(e.rel));
  for (const { rel } of markdown) {
    const text = read(rel);
    if (text === null) continue;
    let fence = null;
    const skillRoot = rel.split('/').slice(0, 2).join('/');
    const folder = path.posix.dirname(rel);
    text.split(/\r?\n/).forEach((line, index) => {
      const add = (message) => findings.push({ file: rel, line: index + 1, rule: 'reference', message });
      const marker = /^\s*(```|~~~)/.exec(line)?.[1];
      if (fence === null && marker) fence = marker;
      else if (fence !== null && marker === fence) fence = null;
      const inFence = fence !== null || Boolean(marker);
      for (const match of line.matchAll(PLUGIN_ROOT_MENTION)) add(`mentions ${match[0]}, which only one agent defines`);
      for (const regex of inFence ? [CITED_PATH] : [CITED_PATH, RELATIVE_LINK]) {
        for (const match of line.matchAll(regex)) {
          const cited = match[1];
          const resolved = path.posix.normalize(path.posix.join(folder, cited));
          const inside = resolved === skillRoot || resolved.startsWith(`${skillRoot}/`);
          if (!inside) add(`${cited} points outside its skill`);
          else if (!fs.existsSync(path.join(dir, resolved))) add(`${cited} does not exist (looked for ${resolved})`);
        }
      }
    });
  }
  return findings;
}

function checkInternal({ read, entries, patterns }) {
  const findings = [];
  const regexes = patterns.map((pattern) => new RegExp(pattern, 'iu'));
  const texts = entries.filter((e) => e.type === 'file' && TEXT_EXTENSIONS.includes(extensionOf(e.rel)));
  for (const { rel } of texts) {
    const text = read(rel);
    if (text === null) continue;
    text.split(/\r?\n/).forEach((line, index) => {
      for (const regex of regexes) {
        if (regex.test(line)) {
          findings.push({ file: rel, line: index + 1, rule: 'internal', message: `matches ${regex.source}` });
        }
      }
    });
  }
  return findings;
}

function checkIcon({ read, entries }) {
  const rel = 'assets/icon.png';
  const entry = entries.find((e) => e.rel === rel);
  if (!entry || entry.type !== 'file') return [];
  const add = (message) => [{ file: rel, rule: 'icon', message }];
  const bytes = read(rel);
  if (bytes === null) return [];
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) return add('is not a PNG');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== height) return add(`must be square, it is ${width} x ${height}`);
  if (width < ICON_MIN || width > ICON_MAX) return add(`${width} px, it must be between ${ICON_MIN} and ${ICON_MAX} px`);
  if (bytes.length >= ICON_MAX_BYTES) return add('must be smaller than 2 MiB');
  return [];
}

export function checkEntries({ dir, patterns, entries }) {
  const { readBytes, readText, unreadable } = createReader({ dir });
  const findings = [
    ...checkStructure({ read: readText, entries }),
    ...checkManifests({ dir, read: readText, entries }),
    ...checkReferences({ dir, read: readText, entries }),
    ...checkInternal({ read: readText, entries, patterns }),
    ...checkFiles({ entries }),
    ...checkIcon({ read: readBytes, entries }),
  ];
  return [...findings, ...unreadable];
}

export function checkPlugin({ dir, patterns }) {
  return checkEntries({ dir, patterns, entries: walkPlugin({ dir }) });
}

function readMarketplace({ root, rel }) {
  try {
    return { json: JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')) };
  } catch (error) {
    return { error: error.code === 'ENOENT' ? 'is missing' : `is not valid JSON: ${error.message}` };
  }
}

const MARKETPLACES = [
  { rel: '.claude-plugin/marketplace.json', sourceOf: (plugin) => plugin.source },
  { rel: '.agents/plugins/marketplace.json', sourceOf: (plugin) => plugin.source?.path },
];

export function listPlugins({ root }) {
  const pluginsDir = path.join(root, 'plugins');
  const folders = [];
  const strays = [];
  if (!fs.existsSync(pluginsDir)) return { folders, strays };
  for (const entry of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) strays.push({ name: entry.name, message: 'hidden entry is not allowed in plugins/' });
    else if (entry.isSymbolicLink()) strays.push({ name: entry.name, message: 'symbolic link is not allowed in plugins/' });
    else if (!entry.isDirectory()) strays.push({ name: entry.name, message: 'only plugin folders are allowed in plugins/' });
    else folders.push(entry.name);
  }
  return { folders: folders.sort(), strays };
}

function findRepoJunk({ root }) {
  const found = [];
  const visit = (relDir) => {
    for (const entry of fs.readdirSync(path.join(root, relDir), { withFileTypes: true })) {
      const rel = relDir ? posix(relDir, entry.name) : entry.name;
      if (REPO_JUNK_NAMES.includes(entry.name)) found.push({ file: rel, message: `${entry.name} must not be committed` });
      else if (GITLEAKS_OVERRIDES.includes(entry.name)) {
        found.push({ file: rel, message: `${entry.name} could weaken the secret scan and is not allowed` });
      }
      if (entry.isDirectory() && !(relDir === '' && entry.name === '.git')) visit(rel);
    }
  };
  visit('');
  return found;
}

export function checkRepo({ root, patterns }) {
  const findings = [];
  const pluginsDir = path.join(root, 'plugins');
  const { folders, strays } = listPlugins({ root });

  for (const { name, message } of strays) findings.push({ file: posix('plugins', name), rule: 'files', message });
  if (folders.length === 0) findings.push({ file: 'plugins', rule: 'structure', message: 'no plugins to check' });

  if (!fs.existsSync(path.join(root, 'LICENSE'))) {
    findings.push({ file: 'LICENSE', rule: 'structure', message: 'required file is missing' });
  }

  for (const name of folders) {
    for (const finding of checkPlugin({ dir: path.join(pluginsDir, name), patterns })) {
      findings.push({ ...finding, file: posix('plugins', name, finding.file) });
    }
  }

  const reported = new Set(findings.filter((f) => f.rule === 'files').map((f) => f.file));
  for (const { file, message } of findRepoJunk({ root })) {
    if (!reported.has(file)) findings.push({ file, rule: 'files', message });
  }

  for (const { rel, sourceOf } of MARKETPLACES) {
    const { json, error } = readMarketplace({ root, rel });
    if (error) {
      findings.push({ file: rel, rule: 'marketplace', message: error });
      continue;
    }
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      findings.push({ file: rel, rule: 'marketplace', message: 'must be a JSON object' });
      continue;
    }
    if (!Array.isArray(json.plugins)) {
      findings.push({ file: rel, rule: 'marketplace', message: 'plugins must be an array' });
      continue;
    }
    const listedNames = new Set();
    for (const plugin of json.plugins) {
      if (plugin === null || typeof plugin !== 'object' || typeof plugin.name !== 'string' || !plugin.name) {
        findings.push({ file: rel, rule: 'marketplace', message: 'every plugin entry needs a name' });
        continue;
      }
      listedNames.add(plugin.name);
      const file = posix('plugins', plugin.name);
      if (!folders.includes(plugin.name)) {
        findings.push({ file, rule: 'marketplace', message: `listed but missing: ${rel} lists it and there is no such folder` });
      }
      const expected = `./plugins/${plugin.name}`;
      if (sourceOf(plugin) !== expected) {
        findings.push({ file: rel, rule: 'marketplace', message: `${plugin.name} must have source ${expected}` });
      }
    }
    for (const name of folders) {
      if (!listedNames.has(name)) {
        findings.push({ file: posix('plugins', name), rule: 'marketplace', message: `not in ${rel}` });
      }
    }
  }
  return findings;
}

function loadPatterns({ file }) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(json.patterns)) throw new Error(`${file} has no "patterns" array`);
  return json.patterns;
}

function formatFinding({ file, line, rule, message }) {
  return `${file}${line ? `:${line}` : ''}: ${rule}: ${message}`;
}

function main({ argv }) {
  const usage = 'usage: node scripts/check-package.mjs <plugin-folder> | --all [--patterns <file>]';
  let all = false;
  let patternsFile = null;
  let target = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--all') all = true;
    else if (argv[i] === '--patterns') patternsFile = argv[++i];
    else if (!target && !argv[i].startsWith('--')) target = argv[i];
    else {
      console.error(usage);
      return 2;
    }
  }
  if (all === Boolean(target) || (argv.includes('--patterns') && !patternsFile)) {
    console.error(usage);
    return 2;
  }

  let patterns;
  try {
    patterns = loadPatterns({ file: path.join(SCRIPTS_DIR, 'denylist.json') });
    if (patternsFile) patterns = [...patterns, ...loadPatterns({ file: patternsFile })];
    patterns.forEach((pattern) => new RegExp(pattern, 'iu'));
  } catch (error) {
    console.error(`cannot load patterns: ${error.message}`);
    return 2;
  }

  let findings;
  let checked;
  if (all) {
    const root = path.dirname(SCRIPTS_DIR);
    findings = checkRepo({ root, patterns });
    checked = listPlugins({ root }).folders.length;
  } else {
    if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
      console.error(`${target} is not a folder`);
      return 2;
    }
    findings = checkPlugin({ dir: path.resolve(target), patterns });
    checked = 1;
  }

  if (findings.length === 0) {
    console.log(`ok: ${checked} plugin(s) checked`);
    return 0;
  }
  for (const finding of findings) console.log(formatFinding(finding));
  return 1;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main({ argv: process.argv.slice(2) });
}
