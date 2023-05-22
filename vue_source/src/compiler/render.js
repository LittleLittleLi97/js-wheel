function getAttrs(attrs) {

    const result = attrs.map((item)=>{

        let key = item.name;
        let value = item.value;

        if (key === 'style') {
            value = value.split(';');
            const obj = {};
            value.forEach((item)=>{
                const [styleKey, styleValue] = item.split(':');
                if (styleKey) {
                    // arr.push({
                    //     styleKey: styleValue
                    // });
                    obj[styleKey.trim()] = styleValue.trim();
                }
            });

            return `${key}:${JSON.stringify(obj)}`;

        } else {
            return `${key}:${JSON.stringify(value)}`;
        }
    });

    return `{${result.join(',')}}`;
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function parseChildren(children) {

    const res = children.map((item)=>{

        if (item.type === 1) {
            return parseToRender(item);
        } else if (item.type === 3) {
            let text = item.text
            const arr = [];

            if (defaultTagRE.test(text)) {
                defaultTagRE.lastIndex = 0;
                let lastIndex = 0;
                let match;
                while (match = defaultTagRE.exec(text)) {
                    const beforeText = text.substring(lastIndex, match.index);
                    if (beforeText) arr.push(`"${beforeText}"`);
                    arr.push(`_s(${match[1].trim()})`);
                    lastIndex = defaultTagRE.lastIndex;
                }

                const last = text.substring(lastIndex);
                if (last) arr.push(`"${last}"`);
            }
            return `_v(${arr.join('+')})`;
        }
    });

    return res.join(',');
}

export function parseToRender(ast) {
    const children = ast.children;
    return `_c('${ast.tag}',${
            ast.attrs ? getAttrs(ast.attrs) : null
        }${children.length > 0 ? `,${
            parseChildren(children)}` : null
        })`;
}