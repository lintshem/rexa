import _, { uniqueId } from "lodash"
import React from "react"
import Constraint, { ItemMod } from "../components/Constraint"
import { EditContainer } from "../library/Editables"
import { getAction, propItems } from "../util/props"

export interface IAction { [key: string]: { func: string, args: string } }
export interface CompType { type: string, name: string, vals: string[] }
export type Child = (Comp | Module | string | number | boolean)
type ID = string
export class Comp {
    id: ID = ''
    elem: string = ''
    props: { [key: string]: any } = {}
    children: Child[] = []
    nonStyleProps: string[] = []
    actions: IAction = {}
    instance: any = ''
    isModule = false
    module: Module | undefined
    constraintInfo: ItemMod = {} as any
    constructor(elem: string, props: object, children: Child[]) {
        this.elem = elem
        this.setDefaultProps()
        this.props = { ...this.props, ...props }
        this.children = children
        this.genId()
        this.setNonStyleProps()
        this.setDefaultActions()
    }
    setIsModule(val: boolean = true) {
        this.isModule = val
    }
    genId() {
        this.setId(uniqueId())
    }
    setId(id: ID) {
        this.id = id
    }
    draw(): any {
        return React.createElement(this.elem, { key: this.id, ...this.props }, this.children.map(comp => {
            if (!this.isModule) {
                return Comp._drawItem(comp)
            } else {
                console.log(this.isModule, this)
                return this.module?.tree[0].getLive(this.module)
            }
        }))
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
        if (!this.elem) return
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
    getLiveChildren(mod: Module) {
        const children = this.children.map(c => {
            if (c instanceof Comp) {
                return c.getLive(mod)
            } else {
                return c
            }

        })
        return children
    }
    getDeadChildren(mod: Module) {
        const children = this.children.map(c => {
            if (c instanceof Comp) {
                return c.getLive(mod)
            } else {
                return c
            }

        })
        return children
    }
    getLive(mod: Module): any {
        if (!this.isModule) {
            if (this.elem !== 'const') {
                const Elm = this.elem
                const [styles, others] = this.propSplit()
                const acts = mod.getActions(this.actions)
                return (
                    <Elm
                        key={this.id}
                        {...others}
                        style={styles}
                        {...acts}
                    >
                        {this.getLiveChildren(mod)}
                    </Elm>
                )
            } else {
                const [styles, others] = this.propSplit()
                const acts = mod.getActions(this.actions)
                return (
                    <Constraint
                        key={this.id}
                        {...others}
                        comp={this}
                        childs={this.getLiveChildren(mod)}
                        style={styles}
                        {...acts}
                        isLive={true}
                    />
                )
            }
        } else {
            return this.module?.tree[0].getLive(this.module)
        }

    }
    getDead(mod: Module): any {
        if (!this.isModule) {
            if (this.elem !== 'const') {
                const Elm = this.elem
                const [styles, others] = this.propSplit()
                return (
                    <Elm
                        key={this.id}
                        {...others}
                        style={styles}
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
            } else {
                const [styles, others] = this.propSplit()
                return (
                    <Constraint
                        key={this.id}
                        {...others}
                        comp={this}
                        childs={this.getLiveChildren(mod)}
                        style={styles}
                        isLive={true}
                    />
                )
            }
        } else {
            return this.module?.tree[0].getDead(this.module)
        }

    }

    static copy(comp: Comp) {
        const c = new Comp(comp.elem, comp.props, [])
        const children = comp.children.map(c => {
            if (typeof c === 'object') {
                return Comp.copy(c as Comp)
            } else {
                return c
            }
        })
        c.id = comp.id
        c.children = children
        c.actions = comp.actions
        c.isModule = comp.isModule
        if (comp.module) c.module = Module.copy(comp.module)
        return c
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
        this.setProp('vel','background','green')
        console.log("HaHa",this.state)
     }
    draw(){

    }
}
return code
//# sourceURL=${name.split(' ').join('')}.js
`
    return c
}
export interface IFile { name: string, size: number, data: string }
export class Module {
    name: string = ''
    tree: Comp[] = []
    code: string = ''
    codeClass: any = ''
    updater: Function | undefined
    files: IFile[] = []
    constructor(name: string = '') {
        this.name = name;
        this.code = GETCODE(name)
    }
    getFiles() {
        return this.files
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
    getStateArg() {
        const treeComps = this.flatTree()
        const state: { [key: string]: any } = {}
        for (const comp of treeComps) {
            state[comp.id] = { ...comp.props }
        }
        const setProp = (id: string, prop: string, val: string) => {
            const comp = treeComps.find(c => c.id === id)
            if (!comp) {
                console.warn("Comp not found", this.name, 'id', id, 'prop', prop)
                return
            }
            if (!Object.keys(comp.props).find(k => k === prop)) {
                console.warn("Prop not found", this.name, 'id', id, 'prop', prop)
            }
            comp.props[prop] = val;
            if (this.updater) this.updater((p: number) => p % 100 + 1)
        }
        const getData = (name: string) => {
            return this.files.find(f => f.name === name)
        }
        function getFile(fileName: string) {
            const dataFile = getData(fileName)
            if (!dataFile) {
                console.warn('Not a valid filename', fileName)
                return null
            }
            const dataURI = dataFile.data
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = window.atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }
        return { state, setProp, getData, getFile, }
    }
    getCodeClass() {
        try {
            //eslint-disable-next-line
            const getCode = Function(this.code)
            const Code = getCode()
            const code = new Code(this.getStateArg())
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
    getActions(actions: IAction, update?: Function) {
        const actionProps: { [key: string]: Function } = {}
        for (const [key, val] of Object.entries(actions)) {
            const action = this.codeClass[val.func]
            if (action) {
                actionProps[key] = (...baseArgs: any[]) => {
                    try {
                        if (val.args) {
                            baseArgs.unshift(...val.args.split(','))
                        }
                        return this.codeClass[val.func](...baseArgs)
                    } catch (e) {
                        console.log('Action error for ', this.name, key, e)
                    }
                }
            }
        }
        return actionProps
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
    async readDataURL(file: File) {
        return new Promise<string>((res, rej) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onerror = rej
            reader.onload = (e) => res(reader.result as string)
        })
    }
    async addFile(file: File) {
        const data = await this.readDataURL(file)
        const size = file.size, name = file.name;
        this.files.unshift({ name, size, data })
    }
    static copy(mod: Module) {
        const m = new Module(mod.name)
        const tree = mod.tree.map(c => Comp.copy(c))
        m.tree = tree
        m.code = mod.code
        m.files = mod.files
        return m
    }

}
