/**
 * ember/no-single-use-spec-const
 *
 * The mechanical half of the AGENTS.md rule `labels-earn-their-keep`: a name must
 * encapsulate a concept, not just relocate an expression one line up.
 *
 * This rule polices exactly one shape, the one that regenerates constantly in this
 * codebase and is never justified:
 *
 *   const fooSpec: ContainerSpec = { ... };        // <- the label says nothing the
 *   export const Foo = Container.build(fooSpec);   //    component name did not
 *
 * It fires only when ALL of the following hold, so that it cannot cry wolf on a label
 * that is genuinely doing work:
 *
 *   - the binding is a module-scope `const` (locals inside a function are out of scope)
 *   - it is NOT exported (an exported const is module API; other files may use it)
 *   - its initializer is an object or array literal, after unwrapping
 *     `satisfies T` / `as T` / `<T>` — a spec literal, not a computed value
 *   - it is read exactly ONCE (a shared base spec is a real concept and stays legal)
 *   - that single read is a direct argument to a call
 *   - the callee is one of `calleeNames` (default: the build-system entry points)
 *
 * The fix is to inline the literal into the call, keeping any `satisfies` annotation
 * INSIDE the call — `Container.build<Spec extends ContainerSpec>(spec: Spec)` infers
 * `Spec` from the literal, and dropping `satisfies` silently disables excess-property
 * checking. A type annotation is not a label; it is not what this rule is about.
 *
 * Everything this rule cannot see — whether a helper function, a hook, or a local
 * variable is a notable enough concept to deserve a name — stays a judgment call and
 * lives in prose in AGENTS.md.
 */

const UNWRAPPABLE = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSTypeAssertion']);

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Inline a single-use literal spec const into the build call it is passed to.',
    },
    schema: [{
      type: 'object',
      properties: {
        calleeNames: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      singleUse: "`{{name}}` is a label that adds nothing: it is a literal used once, as the argument to `{{callee}}(...)`. Inline it — `{{callee}}({ ... } satisfies SpecType)` — keeping the `satisfies` annotation inside the call so excess-property checking still binds. Name a value only when it is a notable concept or is used in more than one place. See AGENTS.md rule `labels-earn-their-keep`.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const calleeNames = context.options[0]?.calleeNames ?? ['Container.build', 'Controls.build'];

    const unwrap = (node) => {
      let current = node;
      while (current && UNWRAPPABLE.has(current.type)) current = current.expression;
      return current;
    };

    return {
      'Program > VariableDeclaration'(node) {
        if (node.kind !== 'const') return;
        if (node.parent?.type === 'ExportNamedDeclaration') return;

        for (const declarator of node.declarations) {
          if (declarator.id.type !== 'Identifier') continue;

          const init = unwrap(declarator.init);
          if (!init) continue;
          if (init.type !== 'ObjectExpression' && init.type !== 'ArrayExpression') continue;

          const [variable] = sourceCode.getDeclaredVariables(declarator);
          if (!variable) continue;

          const reads = variable.references.filter((reference) => reference.isRead());
          if (reads.length !== 1) continue;

          const reference = reads[0].identifier;
          const call = reference.parent;
          if (call?.type !== 'CallExpression') continue;
          if (!call.arguments.includes(reference)) continue;

          const callee = sourceCode.getText(call.callee);
          if (!calleeNames.includes(callee)) continue;

          context.report({
            node: declarator.id,
            messageId: 'singleUse',
            data: { name: declarator.id.name, callee },
          });
        }
      },
    };
  },
};
