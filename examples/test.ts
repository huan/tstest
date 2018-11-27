import {readFileSync} from "fs";
import * as ts from "typescript";
import { EventEmitter } from "events";
import * as assert from 'assert'

const breadcrumb = <string[]>[]

export function delint(sourceFile: ts.SourceFile) {
    delintNode(sourceFile);

    function delintNode(node: ts.Node) {
      if (breadcrumb.length > 5) {
        return
      }

      breadcrumb.push(ts.SyntaxKind[node.kind])

      console.log(breadcrumb.join(' > '))
      // console.log('# breadcrumb:', breadcrumb.join(' > '))
      // console.log('# SyntaxKind:', ts.SyntaxKind[node.kind])
      // console.log('# NodeFlags:', ts.NodeFlags[node.flags])
      // console.log('# decorators:', node.decorators)
      // console.log('# childCount:', node.getChildCount())
      // console.log('# Text:', node.getText())
      // console.log()

        switch (node.kind) {
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.DoStatement:
                if ((<ts.IterationStatement>node).statement.kind !== ts.SyntaxKind.Block) {
                    report(node, "A looping statement's contents should be wrapped in a block body.");
                }
                break;

            case ts.SyntaxKind.IfStatement:
                let ifStatement = (<ts.IfStatement>node);
                if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
                    report(ifStatement.thenStatement, "An if statement's contents should be wrapped in a block body.");
                }
                if (ifStatement.elseStatement &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
                    ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
                    report(ifStatement.elseStatement, "An else statement's contents should be wrapped in a block body.");
                }
                break;

            case ts.SyntaxKind.BinaryExpression:
                let op = (<ts.BinaryExpression>node).operatorToken.kind;
                if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
                    report(node, "Use '===' and '!=='.")
                }
                break;
        }

        ts.forEachChild(node, delintNode);

        breadcrumb.pop()
    }

    function report(node: ts.Node, message: string) {
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}

const fileNames = process.argv.slice(2);
// fileNames.forEach(fileName => {
//     // Parse a file
//     let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);

//     // delint it
//     delint(sourceFile);

//     // console.log(sourceFile.statements)
//   // printAllChildren(sourceFile)
// });

function printAllChildren(node: ts.Node, depth = 0) {
  console.log(
    new Array(depth+1).join('----'),
    ts.SyntaxKind[node.kind],
    node.kind === ts.SyntaxKind.Identifier ? node.getText() : '',
    node.kind === ts.SyntaxKind.TypeReference ? node.getText() : '',
    node.pos,
    node.end,
  );
  depth++;
  node.getChildren().forEach(c=> printAllChildren(c, depth));
}
/**
 * SourceFile > ClassDeclaration > Identifier
 * SourceFile > ClassDeclaration > MethodDeclaration > Identifier
 * SourceFile > ClassDeclaration > MethodDeclaration > Parameter > Identifier
 * SourceFile > ClassDeclaration > MethodDeclaration > Parameter > TypeReference
 * SourceFile > ClassDeclaration > MethodDeclaration > Parameter > AnyKeyword
 * SourceFile > ClassDeclaration > MethodDeclaration > VoidKeyword
 *
 */

class AstNodeEmitter extends EventEmitter {
  constructor(
    public fileName: string
  ) {
    super()
  }

  public start() {
    let sourceFile = ts.createSourceFile(
      this.fileName,
      readFileSync(this.fileName).toString(),
      ts.ScriptTarget.ES2015,
      /*setParentNodes */ true
    )


    this.doEmit(sourceFile)
  }

  private doEmit(node: ts.Node, depth = 0) {
    if (depth > 4) {
      return
    }

    breadcrumb.push(ts.SyntaxKind[node.kind])
    this.emit('node', node)

    depth++
    ts.forEachChild(node, n => this.doEmit(n, depth))

    breadcrumb.pop()
  }
}

function tstestParse(fileName: string) {
  // const ane = new AstNodeEmitter(file)

  const result = {
    tstest: false,
    fixtures: {},
    tests: {},
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
  )

  let currentClassIdentifier = ''
  let currentClassMethodIdentifier = ''
  let currentClassMethodParameterIdentifier = ''

  const classData = {} as {
    [klass: string]: {  // class identifier
      [method: string]  // method identifier
        : string[]        // parameter identifier list, value is the type identifier
    }
  }

  extractData(sourceFile)

  function extractData(node: ts.Node, depth = 0) {
    // console.log(depth, ts.SyntaxKind[node.kind])
    if (depth === 1) {
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        currentClassIdentifier = ''
      } else {
        return
      }
    } else if (depth === 2) {
      if (node.kind === ts.SyntaxKind.Identifier) {
        currentClassIdentifier = node.getText()
        classData[currentClassIdentifier] = {}
      } else if (node.kind === ts.SyntaxKind.MethodDeclaration) {
        currentClassMethodIdentifier = ''
      } else {
        return
      }
    } else if (depth === 3) {
      if (node.kind === ts.SyntaxKind.Identifier) {
        currentClassMethodIdentifier = node.getText()
        classData[currentClassIdentifier][currentClassMethodIdentifier] = []
      }
      if (node.kind === ts.SyntaxKind.Parameter) {
        currentClassMethodParameterIdentifier = ''
      } else {
        return
      }
    } else if (depth === 4) {
      if (node.kind === ts.SyntaxKind.Identifier) {
        currentClassMethodParameterIdentifier = node.getText()
        classData[currentClassIdentifier][currentClassMethodIdentifier].push(currentClassMethodParameterIdentifier)
      } else {
        return
      }
    } else if (depth > 4) {
      return
    }

    depth++
    ts.forEachChild(node, c=> extractData(c, depth))
  }

  console.log(classData)
  return result
}

const result = tstestParse('tests/fixtures/sample.test.ts')
console.log(result)
// assert(result.tstest === true)

// assert(result.fixtures)
// assert(result.fixtures.localFileFixture)
// assert(result.fixtures.testFixture)

// assert(result.tests.testFileCreateLocal)

