import { PackageJsonParser } from './package-json.parser';
import { RequirementsParser } from './requirements.parser';
import { PubspecParser } from './pubspec.parser';
import { DependencyParser, ParsedDependencies, FileKind } from './types';

/**
 * Registry of available parsers
 */
const parsers: DependencyParser[] = [
  new PackageJsonParser(),
  new RequirementsParser(),
  new PubspecParser()
];

/**
 * Detects the file type and parses dependencies from content
 * @param content - File content to parse
 * @param fileName - Optional filename for better detection
 * @returns Parsed dependencies
 * @throws Error if file type cannot be detected
 */
export function detectFileType(
  content: string, 
  fileName?: string
): ParsedDependencies {
  // Try each parser in order
  for (const parser of parsers) {
    if (parser.canParse(content, fileName)) {
      return parser.parse(content);
    }
  }
  
  // If no parser matches, try to provide helpful error
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    throw new Error('File content is empty');
  }
  
  if (trimmed.startsWith('{')) {
    throw new Error('Invalid JSON format - file may be corrupted');
  }
  
  // As a last resort, if it looks like a simple package list, treat as requirements.txt
  // This handles single-line cases like "package==1.0.0"
  if (/^[\w-]+(==|>=|<=|~=|!=|>|<)[\d.]+/.test(trimmed)) {
    return new RequirementsParser().parse(content);
  }
  
  throw new Error(
    'Unable to detect file type. Supported formats: package.json, requirements.txt, pubspec.yaml'
  );
}

/**
 * Gets the file extension for a given file kind
 * @param kind - The file kind
 * @returns File extension including the dot
 */
export function getExtensionFromKind(kind: FileKind): string {
  switch (kind) {
    case "package.json":
      return ".json";
    case "requirements.txt":
      return ".txt";
    case "pubspec.yaml":
      return ".yaml";
    default:
      return ".txt";
  }
}

/**
 * Gets the MIME type for a given file kind
 * @param kind - The file kind
 * @returns MIME type string
 */
export function getMimeFromKind(kind: FileKind): string {
  switch (kind) {
    case "package.json":
      return "application/json";
    case "pubspec.yaml":
      return "application/x-yaml";
    case "requirements.txt":
    default:
      return "text/plain";
  }
}

/**
 * Export individual parsers for direct use if needed
 */
export const Parsers = {
  PackageJson: PackageJsonParser,
  Requirements: RequirementsParser,
  Pubspec: PubspecParser
} as const;
