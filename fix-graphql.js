// @flow
/**
 * React-Relay 从 V3 升级至 V4 以上版本需要做转换
 * See：
 * https://github.com/facebook/relay/releases/tag/v4.0.0
 * https://gist.github.com/kassens/3e2ef9af1e5e1128f8fba3362bb92f98
 */
'use strict';
var { Source, parse, print } = require('graphql');

// To be used with jscodeshift: https://github.com/facebook/jscodeshift

// export const parser = 'flow';

export default function transformer(file, api) {
  const j = api.jscodeshift;

  if (!file.source.includes('graphql')) {
    return;
  }

  const step1 = j(file.source)
    .find(j.TaggedTemplateExpression, {
      tag: { type: 'Identifier', name: 'graphql' },
    })
    .filter(path => getAssignedObjectPropertyName(path) == null)
    .filter(path => path.parentPath.node.type !== 'ExpressionStatement')
    .forEach(path => {
      const text = path.node.quasi.quasis[0].value.raw;
      const document = parse(new Source(text));

      if (document.definitions[0].kind !== 'FragmentDefinition') {
        return;
      }

      j(path).replaceWith(
        j.objectExpression(
          document.definitions.map(definition => {
            const originalFragmentName = definition.name.value;
            const fragmentName = originalFragmentName.includes('_')
              ? originalFragmentName
              : `${originalFragmentName}_data`;
            definition.name.value = fragmentName;
            const fixedDefinition = print(definition);
            const propNameMatch = fragmentName.match(/([^_]+)$/);
            const propName = propNameMatch[1];

            return j.objectProperty(
              j.identifier(propName),
              j.taggedTemplateExpression(
                j.identifier('graphql'),
                j.templateLiteral(
                  [
                    j.templateElement(
                      {
                        cooked: fixedDefinition,
                        raw: fixedDefinition,
                      },
                      true,
                    ),
                  ],
                  [],
                ),
              ),
            );
          }),
        ),
      );
    })
    .toSource();

  const step2 = j(step1)
    .find(j.ImportDeclaration)
    .filter(path => {
      let importPath = path.value.source.value;
      if (!importPath.match(/\/__generated__\//)) {
        // not a Relay import
        return false;
      }
      if (importPath.match(/(Query|Mutation|Subscription).graphql$/)) {
        // not a fragment
        return false;
      }
      return true;
    })
    .forEach(path => {
      path.value.specifiers.forEach(specifier => {
        if (!specifier.imported.name.includes('_')) {
          specifier.imported.name += '_data';
        }
      });
      const fixedPath = path.value.source.value.replace(
        /\/([a-zA-Z][a-zA-Z0-9]*)\.graphql$/,
        "/$1_data.graphql",
      );
      path.value.source.value = fixedPath;
    })
    .toSource();

  const step3 = j(step2)
    .find(j.TaggedTemplateExpression, {
      tag: { type: 'Identifier', name: 'graphql' },
    })
    .forEach(path => {
      const text = path.node.quasi.quasis[0].value.raw;
      const fixedText = text.replace(
        /(\.\.\.[a-zA-Z][a-zA-Z0-9]*)(\s)/gm,
        '$1_data$2',
      );
      path.node.quasi.quasis[0].value.raw = fixedText;
    })
    .toSource();

//   const step4 = j(step3)
//     .find(j.ImportDeclaration)
//     .filter(path => {
//       return path.value.source.value === 'react-relay';
//     })
//     .forEach(path => {
//       path.value.source.value = '@kiwicom/relay';
//     })
//     .toSource();

  return step3;
}

function getAssignedObjectPropertyName(path) {
  let property = path;
  while (property) {
    if (property.node.type === 'Property' && property.node.key.name) {
      return property.node.key.name;
    }
    property = property.parentPath;
  }
}
