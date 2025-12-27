// ============================================================================
// Configuration
// ============================================================================

export interface BundleConfig {
  root: string;
  entry: string[];
  output: {
    dir: string;
    'intermediary-dir': string;
    assets: string;
  };
  source: string[];
  ignore: string[];
}

export interface Config {
  root: string;
  entry: string[];
  outputDir: string;
  assetsDir: string;
  sourceFiles: string[];
}

// ============================================================================
// Import Map
// ============================================================================

export interface ImportMap {
  imports?: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
}

// ============================================================================
// Spans and Locations
// ============================================================================

export interface Span {
  start: number;
  end: number;
}

export interface Location {
  line: number;
  column: number;
}

// ============================================================================
// Annotations
// ============================================================================

export interface AssetNameTemplate {
  prefix: string;
  transforms: AssetNameTransform[];
  joinSeparator: string;
}

export interface AssetNameTransform {
  kind: 'strip';
  leading: string;
  trailing: string;
}

export interface DynamicImportAnnotations {
  pathConstraint?: string;
  assetName?: AssetNameTemplate;
  implicitBundle?: boolean;
}

// ============================================================================
// Parse Results
// ============================================================================

export interface ParseResult {
  files: Map<string, ParsedFile>;
  importMap: ImportMap;
}

export type ParsedFile = HtmlFile | JsFile | CssFile | AssetFile;

interface BaseFile {
  path: string;
  content: string;
  hash: string;
}

export interface HtmlFile extends BaseFile {
  type: 'html';
  data: HtmlData;
}

export interface JsFile extends BaseFile {
  type: 'js';
  data: JsData;
}

export interface CssFile extends BaseFile {
  type: 'css';
  data: CssData;
}

export interface AssetFile extends BaseFile {
  type: 'asset';
  data: null;
}

// ============================================================================
// HTML Parse Data
// ============================================================================

export interface HtmlData {
  /** Output path from <!-- akst::bundle::meta output-path="..." --> */
  outputPath: string | null;
  /** Parsed import map from <script type="importmap"> */
  importMap: ImportMap | null;
  /** External script references */
  scripts: ScriptRef[];
  /** Stylesheet references */
  stylesheets: string[];
  /** Modulepreload links */
  preloads: string[];
  /** Imports from inline module scripts */
  inlineImports: string[];
}

export interface ScriptRef {
  src: string;
  type: 'module' | 'importmap' | 'classic';
}

// ============================================================================
// JS Parse Data
// ============================================================================

export interface JsData {
  /** import.meta.resolve() calls with static string argument */
  metaResolves: MetaResolveSite[];
  /** Strings marked with @akst::bundle::html-path:declare */
  htmlPaths: HtmlPathSite[];
  /** Dynamic import() calls with annotations */
  dynamicImports: DynamicImportSite[];
  /** new Worker() calls */
  workers: WorkerSite[];
  /** Whether file has @akst::bundle::resolve:lookup-entrypoint */
  hasLookupEntrypoint: boolean;
}

export interface MetaResolveSite {
  /** The specifier string passed to import.meta.resolve() */
  specifier: string;
  /** Span of the string literal (for replacement) */
  span: Span;
}

export interface HtmlPathSite {
  /** The string value */
  value: string;
  /** Span of the string literal (for replacement) */
  span: Span;
}

export interface DynamicImportSite {
  /** Span of the entire import() call */
  span: Span;
  /** Annotations from preceding JSDoc comment */
  annotations: DynamicImportAnnotations;
}

export interface WorkerSite {
  /** Static src if provided, null if dynamic */
  src: string | null;
  /** Span of the string literal (for replacement) */
  span: Span | null;
}

// ============================================================================
// CSS Parse Data
// ============================================================================

export interface CssData {
  /** @import paths */
  imports: CssImportSite[];
  /** url() references */
  urls: CssUrlSite[];
}

export interface CssImportSite {
  path: string;
  span: Span;
}

export interface CssUrlSite {
  path: string;
  span: Span;
}

// ============================================================================
// Manifest (Analysis Output)
// ============================================================================

export interface Manifest {
  /** HTML files with explicit output paths */
  htmlEntries: HtmlEntry[];
  /** JS files discovered as bundle entry points */
  jsEntries: JsEntry[];
  /** CSS files referenced by JS or HTML */
  cssAssets: AssetEntry[];
  /** Other static assets */
  staticAssets: AssetEntry[];
  /** Source path -> output path mapping */
  pathMap: Map<string, string>;
}

export interface HtmlEntry {
  sourcePath: string;
  outputPath: string;
  hash: string;
}

export interface JsEntry {
  sourcePath: string;
  outputName: string;
  hash: string;
}

export interface AssetEntry {
  sourcePath: string;
  outputName: string;
  hash: string;
}

// ============================================================================
// Resolver
// ============================================================================

export interface Resolver {
  /** Resolve import specifier to file path */
  resolve(specifier: string, referrer: string): string;
  /** Get output path for a source path */
  outputPath(sourcePath: string): string | undefined;
}
