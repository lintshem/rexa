import _, { uniqueId } from "lodash"
import React from "react"
import { EditContainer } from "../library/Editables"
import { getAction, propItems } from "../util/props"



// export class DiedView {
//     comp: Comp
//     props: Object
//     constructor(comp: Comp) {
//         this.comp = comp
//         this.props = comp.props
//     }
//     drawDied() {


//     }
// }
export interface IAction { [key: string]: { func: string, args: string } }
export interface CompType { type: string, name: string, vals: string[] }
export type Child = (Comp | string | number | boolean)
type ID = string
export class Comp {
    id: ID = ''
    elem: string = ''
    props: { [key: string]: any } = {}
    children: Child[] = []
    isText: boolean = true
    nonStyleProps: string[] = []
    actions: IAction = {}
    instance: any = ''
    constructor(elem: string, props: object, children: Child[]) {
        this.elem = elem
        this.setDefaultProps()
        this.props = { ...this.props, ...props }
        this.children = children
        this.genId()
        this.setNonStyleProps()
        this.setDefaultActions()
    }
    genId() {
        this.setId(uniqueId())
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
    setDefaultActions() {
        const action = getAction(this.elem)
        if (action) {
            action.forEach(a => {
                this.actions[a.name] = { func: '', args: '' }
            })
        }
    }
    getEdit(): EditContainer {
        return new EditContainer(this)
    }
    getTypes(): CompType[] {
        let props = _.cloneDeep(propItems[this.elem])
        const propTypes: CompType[] = []
        for (const prop of props) {
            const vals = prop.vals || []
            propTypes.push({ type: prop.type, name: prop.name, vals })
        }
        return propTypes
    }
    setNonStyleProps() {
        const props = propItems[this.elem]
        for (const prop of props) {
            if (prop.notStyle) {
                this.nonStyleProps.push(prop.name)
            }
        }
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
    addChild(child: Child) {
        this.children.push(child)
    }
    toString() {
        return `Comp(id:${this.id})`
    }
    propSplit() {
        const styles: any = {}
        const other: any = {}
        for (const [key, val] of Object.entries(this.props)) {
            if (this.nonStyleProps.includes(key)) {
                other[key] = val
            } else {
                styles[key] = val
            }
        }
        return [styles, other]
    }
    getLive(mod: Module) {
        const Elm = this.elem
        const [styles, others] = this.propSplit()
        const acts = mod.getActions(this.actions)
        return (
            <Elm
                {...others}
                style={styles}
                {...acts}
            >
                {this.children.map(c => {
                    if (c instanceof Comp) {
                        return c.getLive(mod)
                    } else {
                        return c
                    }

                })}
            </Elm>
        )
    }
}

const GETCODE = (name: string) => {
    const c =
`
class code{
    a = 12
    constructor(state){
        //Assigns the helper method to class
        Object.assign(this, state)
    }
    getName(){
        console.log("HaHa")
        return ''
    }
    draw(){

    }
}
                return code
//# sourceURL=${name.split(' ').join('')}.js
`
return c
}
export class Module {
    name: string = ''
    root: Comp | undefined
    tree: Comp[] = []
    code: string = ''
    codeClass: any = ''
    constructor(name: string = '') {
        this.name = name;
        this.code = GETCODE(name)
    }
    getMethods(): string[] {
        try {
            //eslint-disable-next-line
            const getCode = Function(this.code)
            const Code = getCode()
            const propertyNames = Object.getOwnPropertyNames(Code.prototype);
            return propertyNames
        } catch (e) {
            return []
        }
    }
    getCodeClass() {
        try {
            //eslint-disable-next-line
            const getCode = Function(this.code)
            const Code = getCode()
            const code = new Code({})
            if (typeof code !== 'object') {
                throw new SyntaxError("Does not return a class ")
            }
            this.codeClass = code
            return code;
        } catch (e) {
            console.warn(this.name, 'Code error, no class', e)
            return false;
        }
    }
    getActions(actions: IAction) {
        const actionProps: { [key: string]: Function } = {}
        for (const [key, val] of Object.entries(actions)) {
            const action = this.codeClass[val.func]
            if (action) {
                actionProps[key] = ()=>this.codeClass[val.func]()
            }
        }
        return actionProps
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
        // console.log(prop, val,)
        const compElm = this.getChildWithId(compId)
        if (!compElm) {
            console.warn("setProp ", compId, 'Not exist')
            return
        }
        compElm.props[prop] = val;
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
    flatTree(tree: Child[] = this.tree) {
        const items: Child[] = []
        items.push(...tree)
        tree.forEach(element => {
            if (element instanceof Comp) {
                const innerItems = this.flatTree(element.children)
                items.push(...innerItems)
            }
        });
        return items as Comp[]
    }
    getCompFromId(id: ID): Comp | undefined {
        const comp = this.flatTree().find(c => c.id === id)
        return comp
    }
}
