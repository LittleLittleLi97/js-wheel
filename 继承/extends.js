function clone(parent, child) {
    child.prototype = Object.create(parent.prototype);
    // child.prototype = parent.prototype;
    child.prototype.constructor = child;
}

function Parent(name) {
    this.name = name;
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}

function Child(name, other) {
    Parent.call(this, name);
    this.other = other;
}

clone(Parent, Child);

Child.prototype.sayOther = function() {
    console.log(this.other);
}

const c = new Child('hisname', 'other');
console.log(c);
c.sayName();
c.sayOther();
