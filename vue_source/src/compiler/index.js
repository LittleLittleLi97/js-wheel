import { parseToAst } from "./parse";
import { parseToRender } from "./render";



export function compileToRender(template) {
    const ast = parseToAst(template);
    const render = parseToRender(ast);
    return new Function(`with(this){return ${render}}`);
}