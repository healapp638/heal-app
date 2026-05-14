const fs = require('fs');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const files = glob.sync('src/**/*.tsx');
let modifiedCount = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  if (!code.includes('onPress')) return;

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    let hasModifications = false;
    let needsImport = false;

    traverse(ast, {
      JSXAttribute(path) {
        if (path.node.name.name === 'onPress') {
          const value = path.node.value;
          if (value && value.type === 'JSXExpressionContainer') {
            const expr = value.expression;
            
            if (t.isArrowFunctionExpression(expr) || t.isFunctionExpression(expr)) {
              const bodyStr = generate(expr.body).code;
              if (bodyStr.includes('triggerHaptic')) return;

              hasModifications = true;
              needsImport = true;

              const hapticCall = t.expressionStatement(
                t.callExpression(t.identifier('triggerHaptic'), [t.stringLiteral('impactMedium')])
              );

              if (t.isBlockStatement(expr.body)) {
                expr.body.body.unshift(hapticCall);
              } else {
                expr.body = t.blockStatement([
                  hapticCall,
                  t.returnStatement(expr.body)
                ]);
              }
            } else if (t.isIdentifier(expr) || t.isMemberExpression(expr)) {
              hasModifications = true;
              needsImport = true;

              const hapticCall = t.expressionStatement(
                t.callExpression(t.identifier('triggerHaptic'), [t.stringLiteral('impactMedium')])
              );
              
              // (...args: any) => { ; return (expr as any)(...args); }
              const restArgs = t.restElement(t.identifier('args'));
              restArgs.typeAnnotation = t.tsTypeAnnotation(t.tsAnyKeyword());

              const exprAsAny = t.tsAsExpression(expr, t.tsAnyKeyword());

              const callOriginal = t.returnStatement(
                t.callExpression(exprAsAny, [t.spreadElement(t.identifier('args'))])
              );

              path.node.value.expression = t.arrowFunctionExpression(
                [restArgs],
                t.blockStatement([hapticCall, callOriginal])
              );
            }
          }
        }
      }
    });

    if (hasModifications) {
      // Inject import
      traverse(ast, {
        Program(path) {
          let importExists = false;
          path.node.body.forEach(node => {
            if (t.isImportDeclaration(node) && node.source.value.includes('useHaptic')) {
              // Check if it already imports triggerHaptic
              const hasTriggerHaptic = node.specifiers.some(s => s.local.name === 'triggerHaptic');
              if (hasTriggerHaptic) importExists = true;
              // If it imports useHaptic but not triggerHaptic, we can add it, but it's simpler to just add a new import
            }
          });

          if (!importExists) {
            const depth = file.split('/').length - 2;
            const prefix = depth === 0 ? './' : '../'.repeat(depth);
            const importPath = prefix + 'hooks/useHaptic';

            const importDecl = t.importDeclaration(
              [t.importSpecifier(t.identifier('triggerHaptic'), t.identifier('triggerHaptic'))],
              t.stringLiteral(importPath)
            );
            
            let lastImportIdx = -1;
            path.node.body.forEach((node, i) => {
               if (t.isImportDeclaration(node)) lastImportIdx = i;
            });
            if (lastImportIdx > -1) {
               path.node.body.splice(lastImportIdx + 1, 0, importDecl);
            } else {
               path.node.body.unshift(importDecl);
            }
          }
        }
      });

      // We don't need to inject hook into ArrowFunctionExpression/FunctionDeclaration anymore!
      
      const output = generate(ast, { retainLines: false }, code);
      fs.writeFileSync(file, output.code);
      modifiedCount++;
      console.log('Modified:', file);
    }
  } catch (e) {
    console.error('Error processing file:', file, e.message);
  }
});

console.log('Total modified files:', modifiedCount);
