/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { TSESTree } from '@typescript-eslint/utils';
import { getObjectPropertyNodeByName } from './typescript';
export function getComponentSelectorNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'selector');
    if (property !== undefined) {
        // todo: support template literals as well
        if (property.type === TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'string') {
            return property;
        }
    }
    return undefined;
}
export function getComponentStandaloneNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'standalone');
    if (property !== undefined) {
        if (property.type === TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'boolean') {
            return property;
        }
    }
    return undefined;
}
export function getComponentImportNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'imports');
    if (property !== undefined) {
        if (property.type === TSESTree.AST_NODE_TYPES.ArrayExpression) {
            return property;
        }
    }
    return undefined;
}
export function getComponentClassName(decoratorNode) {
    if (decoratorNode.parent.type !== TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return undefined;
    }
    if (decoratorNode.parent.id?.type !== TSESTree.AST_NODE_TYPES.Identifier) {
        return undefined;
    }
    return decoratorNode.parent.id.name;
}
export function getComponentSuperClassName(decoratorNode) {
    if (decoratorNode.parent.type !== TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return undefined;
    }
    if (decoratorNode.parent.superClass?.type !== TSESTree.AST_NODE_TYPES.Identifier) {
        return undefined;
    }
    return decoratorNode.parent.superClass.name;
}
export function getComponentInitializer(componentDecoratorNode) {
    return componentDecoratorNode.expression.arguments[0];
}
export function getComponentInitializerNodeByName(componentDecoratorNode, name) {
    const initializer = getComponentInitializer(componentDecoratorNode);
    return getObjectPropertyNodeByName(initializer, name);
}
export function isPartOfViewChild(node) {
    return node.parent?.callee?.name === 'ViewChild';
}
//# sourceMappingURL=angular.js.map