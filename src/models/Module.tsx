import _, { uniqueId } from "lodash"
import React from "react"
import { EditContainer } from "../library/Editables"
import { propItems } from "../util/props"



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

export interface CompType { type: string, name: string }
export type Child = (Comp | string | number | boolean)
type ID = string
export class Comp {
    id: ID = ''
    elem: string = ''
    props: { [key: string]: any } = {}
    children: Child[] = []
    isText: boolean = true
    nonStyleProps: string[] = []

    constructor(elem: string, props: object, children: Child[]) {
        this.setDefaultProps()
        this.elem = elem
        this.props = { ...this.props, ...props }
        this.children = children
        this.setBasic()
        this.genId()
    }
    genId() {
        this.setId(uniqueId())
    }
    setBasic() {

    }
    setId(id: ID) {
        this.id = id
    }
    draw(): any {
        return React.createElement(this.elem, { key: this.id, ...this.props }, this.children.map(comp => Comp._drawItem(comp)))
    }
    static _drawItem(comp: Child) {
        if (['string', 'number', 'boolean'].includes(typeof comp)) {
            return comp
        } else {
            return (comp as any).draw()
        }
    }
    getEdit(): EditContainer {
        return new EditContainer(this)
    }
    getTypes(): CompType[] {
        let props = _.cloneDeep(propItems[this.elem])
        const propTypes: CompType[] = []
        for (const prop of props) {
            propTypes.push({ type: prop.type, name: prop.name })
        }
        return propTypes
    }
    setDefaultProps() {
        const props = propItems[this.elem]
        if (!props) {
            console.warn("def props not exist", this.toString())
            return
        }
        let defProps = {} as any
        for (const prop of props) {
            defProps[prop.name] = prop.def
            if (prop.notStyle) {
                this.nonStyleProps.push(prop.name)
            }
        }
        this.props = defProps
    }
    findById(id: ID): Comp | undefined {
        if (this.id === id) {
            return this
        }
        for (const child of this.children) {
            if (child instanceof Comp) {
                const res = child.findById(id)
                if (res) {
                    return res
                }
            }
        }
        return undefined
    }
    toString() {
        return `Comp(id:${this.id})`
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
    setProp(compId: ID, prop: string, val: any) {
        console.log(prop, val,)
    }
    getChildWithId(id: ID) {
        for (const comp of this.tree) {
            const resComp = comp.findById(id)
            if (resComp) {
                return resComp
            }
        }
        return undefined
    }
}
