import { ESLintUtils } from '@typescript-eslint/utils';
import { fixture } from '../../../test/fixture';
import { DISALLOWED_THEME_SELECTORS, fixSelectors, } from '../../util/theme-support';
import { getFilename, getSourceCode, } from '../../util/typescript';
export var Message;
(function (Message) {
    Message["WRONG_SELECTOR"] = "mustUseThemedWrapperSelector";
})(Message || (Message = {}));
export const info = {
    name: 'themed-component-usages',
    meta: {
        docs: {
            description: `Themeable components should be used via the selector of their \`ThemedComponent\` wrapper class

This ensures that custom themes can correctly override _all_ instances of this component.
The only exception to this rule are unit tests, where we may want to use the base component in order to keep the test setup simple.
      `,
        },
        type: 'problem',
        fixable: 'code',
        schema: [],
        messages: {
            [Message.WRONG_SELECTOR]: 'Themeable components should be used via their ThemedComponent wrapper\'s selector',
        },
    },
    defaultOptions: [],
};
export const rule = ESLintUtils.RuleCreator.withoutDocs({
    ...info,
    create(context) {
        if (getFilename(context).includes('.spec.ts')) {
            // skip inline templates in unit tests
            return {};
        }
        const parserServices = getSourceCode(context).parserServices;
        return {
            [`Element$1[name = /^${DISALLOWED_THEME_SELECTORS}/]`](node) {
                const { startSourceSpan, endSourceSpan } = node;
                const openStart = startSourceSpan.start.offset;
                context.report({
                    messageId: Message.WRONG_SELECTOR,
                    loc: parserServices.convertNodeSourceSpanToLoc(startSourceSpan),
                    fix(fixer) {
                        const oldSelector = node.name;
                        const newSelector = fixSelectors(oldSelector);
                        const ops = [
                            fixer.replaceTextRange([openStart + 1, openStart + 1 + oldSelector.length], newSelector),
                        ];
                        // make sure we don't mangle self-closing tags
                        if (endSourceSpan !== null && startSourceSpan.end.offset !== endSourceSpan.end.offset) {
                            const closeStart = endSourceSpan.start.offset;
                            const closeEnd = endSourceSpan.end.offset;
                            ops.push(fixer.replaceTextRange([closeStart + 2, closeEnd - 1], newSelector));
                        }
                        return ops;
                    },
                });
            },
        };
    },
});
export const tests = {
    plugin: info.name,
    valid: [
        {
            name: 'use no-prefix selectors in HTML templates',
            code: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
        },
        {
            name: 'use no-prefix selectors in TypeScript templates',
            code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
        },
        {
            name: 'use no-prefix selectors in TypeScript test templates',
            filename: fixture('src/test.spec.ts'),
            code: `
@Component({
  template: '<ds-test-themeable></ds-test-themeable>'
})
class Test {
}
        `,
        },
        {
            name: 'base selectors are also allowed in TypeScript test templates',
            filename: fixture('src/test.spec.ts'),
            code: `
@Component({
  template: '<ds-base-test-themeable></ds-base-test-themeable>'
})
class Test {
}
        `,
        },
    ],
    invalid: [
        {
            name: 'themed override selectors are not allowed in HTML templates',
            code: `
<ds-themed-test-themeable/>
<ds-themed-test-themeable></ds-themed-test-themeable>
<ds-themed-test-themeable [test]="something"></ds-themed-test-themeable>
        `,
            errors: [
                {
                    messageId: Message.WRONG_SELECTOR,
                },
                {
                    messageId: Message.WRONG_SELECTOR,
                },
                {
                    messageId: Message.WRONG_SELECTOR,
                },
            ],
            output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
        },
        {
            name: 'base selectors are not allowed in HTML templates',
            code: `
<ds-base-test-themeable/>
<ds-base-test-themeable></ds-base-test-themeable>
<ds-base-test-themeable [test]="something"></ds-base-test-themeable>
        `,
            errors: [
                {
                    messageId: Message.WRONG_SELECTOR,
                },
                {
                    messageId: Message.WRONG_SELECTOR,
                },
                {
                    messageId: Message.WRONG_SELECTOR,
                },
            ],
            output: `
<ds-test-themeable/>
<ds-test-themeable></ds-test-themeable>
<ds-test-themeable [test]="something"></ds-test-themeable>
        `,
        },
    ],
};
export default rule;
//# sourceMappingURL=themed-component-usages.js.map