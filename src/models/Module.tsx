import React from "react"
import { EditContainer } from "../library/Editables"



export class DiedView {
    comp: Comp
    props: Object
    constructor(comp: Comp) {
        this.comp = comp
        this.props = comp.props
    }
    drawDied() {


    }
}

type Child = (Comp | string | number | boolean)
type ID = string
export class Comp {
    id: ID = ''
    elem: string = ''
    props: object = {}
    children: Child[] = []

    constructor(elem: string, props: object, children: Child[]) {
        this.elem = elem
        this.props = props
        this.children = children
    }
    setId(id: ID) {
        this.id = id
    }
    draw(): any {
        return React.createElement(this.elem, { key: this.id, ...this.props }, this.children.map(comp => this._drawItem(comp)))
    }
    _drawItem(comp: Child) {
        if (['string', 'number', 'boolean'].includes(typeof comp)) {
            return comp
        } else {
            return (comp as any).draw()
        }
    }
    getEdit(): EditContainer {
        return new EditContainer(this)
    }
}
export class Module {
    name: string = ''
    root: Comp | undefined
    tree: Comp[] = []
    constructor(name: string = '') {
        this.name = name;
    }
    setRoot(root: Comp | string | number) {
        if (typeof root === 'string') {
            let index = this.tree.findIndex(t => {
                return t.id === root
            })
            if (index !== -1) {
                this.root = this.tree[index]
            }
        } else if (typeof root === 'number') {
            if (root < this.tree.length) {
                this.root = this.tree[root]
            }
        } else {
            this.root = root
        }
    }
    drawUi(id?: ID) {
        if (id) {
            let index = this.tree.findIndex(t => t.id === id)
            if (index !== -1) {
                return this.tree[index].draw()
            } else {
                console.warn("Id not found", id)
                return false
            }
        } else if (this.root) {
            return this.root.draw()
        } else if (this.tree.length) {
            return this.tree[0].draw()
        }
    }
    drawDied(id?: ID) {
        if (id) {
            let index = this.tree.findIndex(t => t.id === id)
            if (index !== -1) {
                return this.tree[index].draw()
            } else {
                console.warn("Id not found", id)
                return false
            }
        } else if (this.root) {
            return this.root.getEdit()
        } else if (this.tree.length) {
            return this.tree[0].getEdit()
        }
    }
    addComp(comp: Comp) {
        this.tree.push(comp)
    }
}
