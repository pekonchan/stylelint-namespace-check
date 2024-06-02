const stylelint = require("stylelint");

const ruleName = "namespace-check/selector-prefix";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: (selector, prefix) => `Expected class or ID selector "${selector}" to start with "${prefix}"`
});

module.exports = stylelint.createPlugin(ruleName, (primaryOption) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [function (value) {
        return typeof value === "string";
      }]
    });

    if (!validOptions) {
      return;
    }

    root.walkRules(rule => {
      rule.selectors.forEach(selector => {
        const classOrIdMatches = selector.match(/([.#][a-zA-Z0-9_-]+)/g);
        if (classOrIdMatches) {
          classOrIdMatches.forEach(classOrId => {
            const name = classOrId.slice(1); // Remove '.' or '#'
            if (!name.startsWith(primaryOption)) {
              stylelint.utils.report({
                message: messages.expected(classOrId, primaryOption),
                node: rule,
                result,
                ruleName
              });
            }
          });
        }
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
