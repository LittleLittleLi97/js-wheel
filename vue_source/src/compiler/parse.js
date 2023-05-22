// id="app" id='app' id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 标签名 <my-header></my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// <my:header></my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// <div
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// > 或 />
const startTagClose = /^\s*(\/?)>/;
// </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseToAst(html) {

    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = [];
    let currentParent;
    let root;

    function start(tagMatch) {
        const node = generateNode(tagMatch.tagName, tagMatch.attrs);
        if (!root) {
            root = node;
        }
        if (currentParent) {
            currentParent.children.push(node);
            node.parent = currentParent;
        }
        currentParent = node;
        stack.push(node);
    }
    function end() {
        stack.pop();
        currentParent = stack[stack.length - 1];
    }
    function chars(text) {
        text = text.trim();
        if (text) {
            currentParent.children.push({
                type: TEXT_TYPE,
                text,
                parent: currentParent
            });
        }
    }
    function generateNode(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            attrs,
            children: [],
            parent: null
        }
    }
    function advance(n) {
        html = html.substring(n);
    }
    function parseStartTag() {
        const tag = html.match(startTagOpen);
        if (tag) {
            const match = {
                tagName: tag[1],
                attrs: []
            };
            advance(tag[0].length);
            let attr;
            let end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                });
                advance(attr[0].length);
            }
            if (end) advance(end[0].length);

            return match;
        }
        return false;
    }
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            const startTagMatch = parseStartTag();

            if (startTagMatch) {
                start(startTagMatch);
                continue;
            }

            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                end(endTagMatch);
                advance(endTagMatch[0].length);
            }
        }
        if (textEnd > 0) {
            const text = html.substring(0, textEnd);
            chars(text);
            advance(textEnd);
        }
    }
    return root;
}