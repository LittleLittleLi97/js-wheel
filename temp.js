function Tree(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
}

function LinkNode(val, next) {
    this.val = val;
    this.next = next;
}

function Queue() {
    this.head = new LinkNode();
    this.tail = new LinkNode();
    this.head.next = this.tail;
}

function enQueue(q, val) {
    q.tail.val = val;
    q.tail.next = new LinkNode();
    q.tail = q.tail.next;
}

function popQueue(q) {
    if (isEmptyQueue(q)) return;
    const result = q.head.next.val;
    q.head = q.head.next;
    return result;
}

function isEmptyQueue(q) {
    return q.head.next === q.tail;
}

function queueTraversal(q) {
    let ptr = q.head.next;
    while (ptr !== q.tail) {
        console.log(ptr.val);
        ptr = ptr.next;
    }
}

function levelTraversal(root) {
    if (!root) return;

    const q = new Queue();
    enQueue(q, root);

    while (!isEmptyQueue(q)) {
        const now = popQueue(q);
        console.log(now.val);
        if (now.left) enQueue(q, now.left);
        if (now.right) enQueue(q, now.right);
    }
}

function main() {

    const str = 'AB*C**D**';
    let index = 0;

    function createTree() {
        if (index > str.length) return null;
        if (str[index] === '*') {
            index++;
            return null;
        }
        const root = new Tree(str[index], null, null);

        index++;
        root.left = createTree();
        root.right = createTree();
        return root;
    }
    const root = createTree(str);
    levelTraversal(root);
}

main();
