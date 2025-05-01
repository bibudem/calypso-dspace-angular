/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TSESTree } from '@typescript-eslint/utils';
import { readFileSync } from 'fs';
import { basename } from 'path';
import ts from 'typescript';
import { getComponentClassName, isPartOfViewChild, } from './angular';
import { isPartOfClassDeclaration, isPartOfTypeExpression, } from './typescript';
function isAngularComponentDecorator(node) {
    if (node.kind === ts.SyntaxKind.Decorator && node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
        const decorator = node;
        if (decorator.expression.kind === ts.SyntaxKind.CallExpression) {
            const method = decorator.expression;
            if (method.expression.kind === ts.SyntaxKind.Identifier) {
                return method.expression.text === 'Component';
            }
        }
    }
    return false;
}
function findImportDeclaration(source, identifierName) {
    return ts.forEachChild(source, (topNode) => {
        if (topNode.kind === ts.SyntaxKind.ImportDeclaration) {
            const importDeclaration = topNode;
            if (importDeclaration.importClause?.namedBindings?.kind === ts.SyntaxKind.NamedImports) {
                const namedImports = importDeclaration.importClause?.namedBindings;
                for (const element of namedImports.elements) {
                    if (element.name.text === identifierName) {
                        return importDeclaration;
                    }
                }
            }
        }
        return undefined;
    });
}
/**
 * Listing of all themeable Components
 */
class ThemeableComponentRegistry {
    constructor() {
        this.entries = new Set();
        this.byBaseClass = new Map();
        this.byWrapperClass = new Map();
        this.byBasePath = new Map();
        this.byWrapperPath = new Map();
    }
    initialize(prefix = '') {
        if (this.entries.size > 0) {
            return;
        }
        function registerWrapper(path) {
            const source = getSource(path);
            function traverse(node) {
                if (node.parent !== undefined && isAngularComponentDecorator(node)) {
                    const classNode = node.parent;
                    if (classNode.name === undefined || classNode.heritageClauses === undefined) {
                        return;
                    }
                    const wrapperClass = classNode.name?.escapedText;
                    for (const heritageClause of classNode.heritageClauses) {
                        for (const type of heritageClause.types) {
                            if (type.expression.escapedText === 'ThemedComponent') {
                                if (type.kind !== ts.SyntaxKind.ExpressionWithTypeArguments || type.typeArguments === undefined) {
                                    continue;
                                }
                                const firstTypeArg = type.typeArguments[0];
                                const baseClass = firstTypeArg.typeName?.escapedText;
                                if (baseClass === undefined) {
                                    continue;
                                }
                                const importDeclaration = findImportDeclaration(source, baseClass);
                                if (importDeclaration === undefined) {
                                    continue;
                                }
                                const basePath = resolveLocalPath(importDeclaration.moduleSpecifier.text, path);
                                themeableComponents.add({
                                    baseClass,
                                    basePath: basePath.replace(new RegExp(`^${prefix}`), ''),
                                    baseFileName: basename(basePath).replace(/\.ts$/, ''),
                                    wrapperClass,
                                    wrapperPath: path.replace(new RegExp(`^${prefix}`), ''),
                                    wrapperFileName: basename(path).replace(/\.ts$/, ''),
                                });
                            }
                        }
                    }
                    return;
                }
                else {
                    ts.forEachChild(node, traverse);
                }
            }
            traverse(source);
        }
        const glob = require('glob');
        // note: this outputs Unix-style paths on Windows
        const wrappers = glob.GlobSync(prefix + 'src/app/**/themed-*.component.ts', { ignore: 'node_modules/**' }).found;
        for (const wrapper of wrappers) {
            registerWrapper(wrapper);
        }
    }
    add(entry) {
        this.entries.add(entry);
        this.byBaseClass.set(entry.baseClass, entry);
        this.byWrapperClass.set(entry.wrapperClass, entry);
        this.byBasePath.set(entry.basePath, entry);
        this.byWrapperPath.set(entry.wrapperPath, entry);
    }
}
export const themeableComponents = new ThemeableComponentRegistry();
/**
 * Construct the AST of a TypeScript source file
 * @param file
 */
function getSource(file) {
    return ts.createSourceFile(file, readFileSync(file).toString(), ts.ScriptTarget.ES2020, // todo: actually use tsconfig.json?
    /*setParentNodes */ true);
}
/**
 * Resolve a possibly relative local path into an absolute path starting from the root directory of the project
 */
function resolveLocalPath(path, relativeTo) {
    if (path.startsWith('src/')) {
        return path;
    }
    else if (path.startsWith('./')) {
        const parts = relativeTo.split('/');
        return [
            ...parts.slice(0, parts.length - 1),
            path.replace(/^.\//, ''),
        ].join('/') + '.ts';
    }
    else {
        throw new Error(`Unsupported local path: ${path}`);
    }
}
export function isThemedComponentWrapper(decoratorNode) {
    if (decoratorNode.parent.type !== TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return false;
    }
    if (decoratorNode.parent.superClass?.type !== TSESTree.AST_NODE_TYPES.Identifier) {
        return false;
    }
    return decoratorNode.parent.superClass?.name === 'ThemedComponent';
}
export function getBaseComponentClassName(decoratorNode) {
    const wrapperClass = getComponentClassName(decoratorNode);
    if (wrapperClass === undefined) {
        return;
    }
    themeableComponents.initialize();
    const entry = themeableComponents.byWrapperClass.get(wrapperClass);
    if (entry === undefined) {
        return undefined;
    }
    return entry.baseClass;
}
export function isThemeableComponent(className) {
    themeableComponents.initialize();
    return themeableComponents.byBaseClass.has(className);
}
export function inThemedComponentOverrideFile(filename) {
    const match = filename.match(/src\/themes\/[^\/]+\/(app\/.*)/);
    if (!match) {
        return false;
    }
    themeableComponents.initialize();
    // todo: this is fragile!
    return themeableComponents.byBasePath.has(`src/${match[1]}`);
}
export function allThemeableComponents() {
    themeableComponents.initialize();
    return [...themeableComponents.entries];
}
export function getThemeableComponentByBaseClass(baseClass) {
    themeableComponents.initialize();
    return themeableComponents.byBaseClass.get(baseClass);
}
export function isAllowedUnthemedUsage(usageNode) {
    return isPartOfClassDeclaration(usageNode) || isPartOfTypeExpression(usageNode) || isPartOfViewChild(usageNode);
}
export const DISALLOWED_THEME_SELECTORS = 'ds-(base|themed)-';
export function fixSelectors(text) {
    return text.replaceAll(/ds-(base|themed)-/g, 'ds-');
}
//# sourceMappingURL=theme-support.js.map