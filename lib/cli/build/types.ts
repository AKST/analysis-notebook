/** Build configuration loaded from config/akst-bundle.json */
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

/** Normalized config with resolved paths */
export interface NormalizedConfig {
  root: string;
  entry: string[];
  outputDir: string;
  intermediaryDir: string;
  assetsDir: string;
  sourceFiles: string[];
}

// ============================================================================
// Annotations
// ============================================================================

export type AnnotationType = 'dyn-import' | 'worker';

export type BundleAnnotation =
  | PathConstraintAnnotation
  | AssetNameAnnotation
  | ImplicitBundleGenerationAnnotation
  | HtmlPathDeclareAnnotation
  | LookupEntrypointAnnotation;

export interface PathConstraintAnnotation {
  kind: 'path-constraint';
  type: AnnotationType;
  pattern: string; // raw regex string from annotation
}

export interface AssetNameAnnotation {
  kind: 'asset-name';
  type: AnnotationType;
  template: AssetNameTemplate;
}

export interface ImplicitBundleGenerationAnnotation {
  kind: 'implicit-bundle-generation';
  type: AnnotationType;
}

export interface HtmlPathDeclareAnnotation {
  kind: 'html-path-declare';
}

export interface LookupEntrypointAnnotation {
  kind: 'lookup-entrypoint';
}

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

// ============================================================================
// Scan Results
// ============================================================================

export interface ScanResult {
  files: Map<string, ScannedFile>;
}

export type ScannedFile =
  | HtmlScannedFile
  | JsScannedFile
  | CssScannedFile
  | AssetScannedFile;

interface BaseScannedFile {
  path: string;
  content: string;
  hash: string;
}

export interface HtmlScannedFile extends BaseScannedFile {
  type: 'html';
  data: HtmlScanData;
}

export interface JsScannedFile extends BaseScannedFile {
  type: 'js';
  data: JsScanData;
}

export interface CssScannedFile extends BaseScannedFile {
  type: 'css';
  data: CssScanData;
}

export interface AssetScannedFile extends BaseScannedFile {
  type: 'asset';
  data: null;
}

export interface HtmlScanData {
  outputPath: string | null;
  importmap: ImportMap | null;
  scripts: HtmlScriptRef[];
  stylesheets: string[];
  links: string[];
  inlineImports: string[];
}

export interface HtmlScriptRef {
  src: string;
  type: 'module' | 'importmap' | 'other';
}

export interface JsScanData {
  metaResolves: MetaResolveSite[];
  dynamicImports: DynamicImportSite[];
  workers: WorkerCreationSite[];
  htmlPathDeclares: HtmlPathDeclareSite[];
  lookupEntrypoints: LookupEntrypointSite[];
}

export interface MetaResolveSite {
  path: string;
  location: SourceLocation;
}

export interface DynamicImportSite {
  location: SourceLocation;
  annotations: BundleAnnotation[];
}

export interface WorkerCreationSite {
  src: string | null; // null if dynamic
  location: SourceLocation;
  annotations: BundleAnnotation[];
}

export interface HtmlPathDeclareSite {
  value: string;
  location: SourceLocation;
}

export interface LookupEntrypointSite {
  location: SourceLocation;
}

export interface CssScanData {
  imports: string[];
}

export interface SourceLocation {
  line: number;
  column: number;
}

// ============================================================================
// Import Map
// ============================================================================

export interface ImportMap {
  imports?: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
}

// ============================================================================
// Entry Manifest
// ============================================================================

export interface EntryManifest {
  htmlEntries: HtmlEntry[];
  jsEntries: JsEntry[];
  cssAssets: AssetEntry[];
  staticAssets: AssetEntry[];
  /** Maps source path to output path */
  pathMappings: Map<string, string>;
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
  outputPath: string;
  hash: string;
}

// ============================================================================
// Transformed Files
// ============================================================================

export interface TransformedFiles {
  files: Map<string, string>; // path -> transformed content
}
