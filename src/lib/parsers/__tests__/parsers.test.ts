import { describe, it, expect } from 'vitest';
import { PackageJsonParser } from '../package-json.parser';
import { RequirementsParser } from '../requirements.parser';
import { PubspecParser } from '../pubspec.parser';
import { detectFileType, getAllDependencies } from '../index';

describe('PackageJsonParser', () => {
  const parser = new PackageJsonParser();

  it('should parse package.json with dependencies', () => {
    const content = JSON.stringify({
      name: 'test-package',
      version: '1.0.0',
      dependencies: {
        'react': '^18.0.0',
        'axios': '~1.4.0',
      },
      devDependencies: {
        'vitest': '^0.34.0',
        'typescript': '^5.0.0',
      }
    }, null, 2);

    const result = parser.parse(content);
    
    expect(result.kind).toBe('package.json');
    expect(result.packageManager).toBe('npm');
    expect(result.dependencies).toEqual({
      'react': '^18.0.0',
      'axios': '~1.4.0',
    });
    expect(result.devDependencies).toEqual({
      'vitest': '^0.34.0',
      'typescript': '^5.0.0',
    });
  });

  it('should handle package.json with only dependencies', () => {
    const content = JSON.stringify({
      name: 'test-package',
      dependencies: {
        'lodash': '^4.17.21',
      }
    });

    const result = parser.parse(content);
    
    expect(result.dependencies).toEqual({
      'lodash': '^4.17.21',
    });
    expect(result.devDependencies).toBeUndefined();
  });

  it('should detect package.json correctly', () => {
    const content = '{"name": "test", "version": "1.0.0"}';
    expect(parser.canParse(content, 'package.json')).toBe(true);
    expect(parser.canParse(content)).toBe(true);
  });
});

describe('RequirementsParser', () => {
  const parser = new RequirementsParser();

  it('should parse requirements.txt with various version specifiers', () => {
    const content = `
# Comment line
Django==4.2.0
numpy>=1.21.0
pandas~=1.5.0
requests
scikit-learn<=1.3.0
matplotlib>3.5.0,<4.0.0
package-with-extras[dev]==2.0.0
`;

    const result = parser.parse(content);
    
    expect(result.kind).toBe('requirements.txt');
    expect(result.packageManager).toBe('pip');
    expect(result.dependencies).toEqual({
      'Django': '4.2.0',
      'numpy': '1.21.0',
      'pandas': '1.5.0',
      'requests': 'latest',
      'scikit-learn': '1.3.0',
      'matplotlib': '3.5.0',
      'package-with-extras': '2.0.0',
    });
    expect(result.devDependencies).toBeUndefined();
  });

  it('should detect requirements.txt correctly', () => {
    const content = 'Django==4.2.0\nnumpy>=1.21.0';
    expect(parser.canParse(content, 'requirements.txt')).toBe(true);
    expect(parser.canParse(content)).toBe(true);
  });
});

describe('PubspecParser', () => {
  const parser = new PubspecParser();

  it('should parse pubspec.yaml with dependencies and dev_dependencies', () => {
    const content = `
name: my_flutter_app
description: A Flutter application
version: 1.0.0+1

environment:
  sdk: ">=2.17.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.5
  provider: ^6.0.5
  shared_preferences: ^2.0.15
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0
  build_runner: ^2.3.3
  mockito: ^5.3.2

flutter:
  uses-material-design: true
`;

    const result = parser.parse(content);
    
    expect(result.kind).toBe('pubspec.yaml');
    expect(result.packageManager).toBe('pub');
    expect(result.dependencies).toEqual({
      'http': '^0.13.5',
      'provider': '^6.0.5',
      'shared_preferences': '^2.0.15',
    });
    expect(result.devDependencies).toEqual({
      'flutter_lints': '^2.0.0',
      'build_runner': '^2.3.3',
      'mockito': '^5.3.2',
    });
  });

  it('should exclude Flutter SDK references', () => {
    const content = `
name: test_app
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.5
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito: ^5.3.2
`;

    const result = parser.parse(content);
    
    expect(result.dependencies).not.toHaveProperty('flutter');
    expect(result.dependencies).not.toHaveProperty('sdk');
    expect(result.devDependencies).not.toHaveProperty('flutter_test');
    expect(result.devDependencies).not.toHaveProperty('sdk');
  });

  it('should detect pubspec.yaml correctly', () => {
    const content = 'name: app\nversion: 1.0.0\ndependencies:\n  http: ^0.13.5';
    expect(parser.canParse(content, 'pubspec.yaml')).toBe(true);
    expect(parser.canParse(content)).toBe(true);
  });
});

describe('detectFileType', () => {
  it('should detect package.json', () => {
    const content = '{"name": "test", "dependencies": {"lodash": "^4.0.0"}}';
    const result = detectFileType(content, 'package.json');
    expect(result.kind).toBe('package.json');
  });

  it('should detect requirements.txt', () => {
    const content = 'Django==4.2.0\nnumpy>=1.21.0';
    const result = detectFileType(content, 'requirements.txt');
    expect(result.kind).toBe('requirements.txt');
  });

  it('should detect pubspec.yaml', () => {
    const content = 'name: app\ndependencies:\n  http: ^0.13.5';
    const result = detectFileType(content, 'pubspec.yaml');
    expect(result.kind).toBe('pubspec.yaml');
  });

  it('should auto-detect based on content', () => {
    const jsonContent = '{"dependencies": {}}';
    expect(detectFileType(jsonContent).kind).toBe('package.json');

    const yamlContent = 'name: app\ndependencies:\n  pkg: 1.0.0';
    expect(detectFileType(yamlContent).kind).toBe('pubspec.yaml');

    const reqContent = 'package==1.0.0';
    expect(detectFileType(reqContent).kind).toBe('requirements.txt');
  });

  it('should throw error for unrecognized format', () => {
    expect(() => detectFileType('')).toThrow('File content is empty');
    expect(() => detectFileType('{invalid json')).toThrow();
  });
});

describe('getAllDependencies', () => {
  it('should merge dependencies and devDependencies', () => {
    const parsed = {
      kind: 'package.json' as const,
      packageManager: 'npm' as const,
      dependencies: {
        'react': '^18.0.0',
        'axios': '~1.4.0',
      },
      devDependencies: {
        'vitest': '^0.34.0',
        'typescript': '^5.0.0',
      }
    };

    const all = getAllDependencies(parsed);
    
    expect(all).toEqual({
      'react': '^18.0.0',
      'axios': '~1.4.0',
      'vitest': '^0.34.0',
      'typescript': '^5.0.0',
    });
  });

  it('should return only dependencies when no devDependencies', () => {
    const parsed = {
      kind: 'requirements.txt' as const,
      packageManager: 'pip' as const,
      dependencies: {
        'Django': '4.2.0',
        'numpy': '1.21.0',
      }
    };

    const all = getAllDependencies(parsed);
    
    expect(all).toEqual({
      'Django': '4.2.0',
      'numpy': '1.21.0',
    });
  });
});
