import { parseToAst } from "./ast";
import { parseAstToRender } from "./render";

export function parseTemplateToRender(template) {
    const ast = parseToAst(template);
    const render = parseAstToRender(ast);
    return new Function(`with(this){return ${render}}`);
}