const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function parseAttrs(attrs) {
    const result = attrs.map((item)=>{
        const {name, value} = item;

        if (name === 'style') {

            const styleArr = [];

            value.split(';').map((styleItem)=>{
                const [styleKey, styleValue] = styleItem.split(':');
                if (styleKey) {
                    styleArr.push(`"${styleKey.trim()}":"${styleValue.trim()}"`);
                }
            });

            return `style:{${styleArr.join(',')}}`;
        } else {
            return `${name}:"${value}"`;
        }
    });
    return `{${result.join(',')}}`;
}

function parseChildren(children) {
    const arr = children.map((item)=>{
        if (item.type === 1) {
            return parseAstToRender(item);
        } else {
            return parseChars(item.text);
        }
    });

    return arr.join(',');
}

function parseChars(text) {
    const result = [];
    let lastIndex = 0;
    let match;

    while (match = defaultTagRE.exec(text)) {
        const before = text.substring(lastIndex, match.index);
        if (before) result.push(`"${before}"`);
        result.push(`_s(${match[1].trim()})`);

        lastIndex = defaultTagRE.lastIndex;
    }

    const last = text.substring(lastIndex);
    if (last) result.push(`"${last}"`);

    return `_v(${result.join('+')})`;
}

export function parseAstToRender(ast) {
    const children = ast.children;
    return `_c('${ast.tagName}',${parseAttrs(ast.attrs)}${
        children.length > 0 ? `,${parseChildren(children)}` : ''})`;
}