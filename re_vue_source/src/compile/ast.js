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

    const stack = [];
    let root;
    let currentParent = null;

    function start(tagName, attrs) {
        const node = {
            tagName,
            attrs,
            type: 1,
            parent: null,
            children: []
        };
        if (!root) {
            root = node;
        }
        if (currentParent) {
            currentParent.children.push(node);
        }
        node.parent = currentParent;
        currentParent = node;

        stack.push(node);
    }
    function end() {
        stack.pop();
        currentParent = stack[stack.length - 1];
    }
    function chars(text) {
        text = text.trim();
        if (!text) return;
        const node = {
            type: 3,
            text,
            parent: currentParent
        };
        currentParent.children.push(node);
    }
    function startTag() {
        const startTagMatch = html.match(startTagOpen);

        if (startTagMatch) {
            const match = {
                tagName: startTagMatch[1],
                attrs: [],
                children: []
            };
            advance(startTagMatch[0].length);

            let end;
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                const key = attr[1];
                const value = attr[3] || attr[4] || attr[5];
                match.attrs.push({
                    name: key,
                    value
                });
                advance(attr[0].length);
            }
            if (end) {
                advance(end[0].length);
            }

            return match;
        }

        return false;
    }
    function advance(n) {
        html = html.substring(n);
    }

    while (html) {
        const endText = html.indexOf('<');
        if (endText === 0) {
            const startTagMatch = startTag();

            if (!startTagMatch) {
                const endTagMatch = html.match(endTag);

                if (endTagMatch) {
                    end(endTagMatch);
                    advance(endTagMatch[0].length);
                }
            } else {
                start(startTagMatch.tagName, startTagMatch.attrs);
            }

            continue;
        }
        if (endText > 0) {
            const text = html.substring(0, endText);
            chars(text);
            advance(endText);
        }
    }

    return root;
}