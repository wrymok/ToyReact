export class HiComponent {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    setAttribute(attr, value) {
        this.props[attr] = value;
    }
    mountTo(parent) {
        this.parent = parent;
        this.update();
    }
    update() {

        let placeholder = document.createComment('placeholder');
        let range = document.createRange();
        range.setStart(this.parent.endContainer, this.parent.endOffset);
        range.setEnd(this.parent.endContainer, this.parent.endOffset);
        range.insertNode(placeholder);
        this.parent.deleteContents();

        let vdom = this.render();
        if (this.oldVdom) {
            let isSameNode = (node1, node2) => {
                if (node1.type !== node2.type) return false;
                if (Object.keys(node1.props).length != Object.keys(node2.props).length) return false;
                for (let attr in node1.props) {
                    if (typeof node1.props[attr] == 'object' 
                    && typeof node2.props[attr] == 'object' 
                    && JSON.stringify(node2.props[attr]) == JSON.stringify(node1.props[attr])
                    ) continue
                    if (node1.props[attr] != node2.props[attr]) return false;
                }
                return true;
            }
            let isSameTree = (tree1, tree2) => {
                if (!isSameNode(tree1, tree2)) return false;
                for (let i = 0; i < tree1.children.length;i++) {
                    return isSameNode(tree1.children[i], tree2.children[i]);
                }
                return true;
            }
            let replaceDom = (newDom, oldDom) => {
                if (isSameTree(newDom, oldDom)) {
                    return;
                } else if (!isSameNode(newDom, oldDom)){
                    newDom.mountTo(oldDom.parent);
                } else {
                    for (let i = 0; i < oldDom.children.length; i++) {
                        replaceDom(newDom.children[i], oldDom.children[i]);
                    }
                }
            }
            replaceDom(vdom, this.oldVdom);
        } else {
            vdom.mountTo(this.parent);
        }
        this.oldVdom = vdom;
    }
    setState(state) {
        this.state.value = state.value;
        this.update();
    }
    appendChild(child) {
        this.children.push(child);
    }

}
class ElementWrapper {
    constructor(type) {
        this.type = type;
        this.children = []
        this.props = Object.create(null);
    }
    setAttribute(attr, value) {
        this.props[attr] = value;
    }
    mountTo(parent) {
        parent.deleteContents();
        this.parent = parent;
        let element = document.createElement(this.type);

        for (let attr in this.props) {
            let value = this.props[attr];
            if (attr == 'hiClass') {
                for (let parentAttr in value) {
                    this.setAttribute(parentAttr, value[parentAttr])
                }
                element.removeAttribute(attr);
            } else if (attr.match(/^on([\s\S]*)/)) {
                let match = attr.match(/^on([\s\S])([\s\S]*)/);
                let eventName = match[1].toLowerCase() + match[2];
                element.addEventListener(eventName, value);
            } else {
                let exist = element.getAttribute(attr);
                if (exist) {
                    element.setAttribute(attr, `${value} ${exist}`);
                } else {
                    element.setAttribute(attr, value);
                }
            }
        }

        for (let child of this.children) {
            let range = document.createRange();
            if (element.children.length) {
                range.setStartAfter(element.lastChild);
                range.setEndAfter(element.lastChild);
            } else {
                range.setStart(element, 0);
                range.setEnd(element, 0);
            }
            child.mountTo(range);
        }
        
        parent.insertNode(element);
    }
    appendChild(child) {
        this.children.push(child);
    }

}

class TextWrapper {
    constructor(text) {
        this.root = document.createTextNode(text);
        this.children = [];
        this.type = "#textType";
        this.props = Object.create(null);
    }
    get vdom() {
        return {
            type: this.type,
            props: this.props,
            children: []
        }
    }
    mountTo(parent) {
        this.parent = parent;
        parent.deleteContents();
        parent.insertNode(this.root);
    }
}

export let HiReact = {
    createElement(type, attributes, ...children) {

        let root;
        if (typeof type == 'function') {
            root = new type;
        } else {
            root = new ElementWrapper(type);
        }

        for (let attr in attributes) {
            let value = attributes[attr];
            root.props[attr] = value;
        }

        function insertChild(children) {
            for (let child of children) {
                if (Object.prototype.toString.call(child) == '[object Array]') {
                    insertChild(child);
                } else if (
                    child instanceof ElementWrapper == false &&
                    child instanceof HiComponent == false &&
                    child instanceof TextWrapper == false) {
                    child = new TextWrapper(child.toString());
                    root.appendChild(child);
                } else {
                    root.appendChild(child);
                }
            }
        }
        insertChild(children);
        return root;
    },
    render(vdom, element) {
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0)
        }
        vdom.mountTo(range);
        return element;
    }
}