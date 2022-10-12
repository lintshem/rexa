import { atom } from "jotai";
import { atomFamily, atomWithStorage, selectAtom } from 'jotai/utils'
import { ItemMod } from "../components/Constraint";
import { AppClass } from "../models/AppClass";
import { Child, Comp, Module } from "../models/Module";

export const basicCompsAtom = atom([
    'const', 'div', 'p', 'button', 'text', 'input', 'img'
])

export const attribAtom = atom(0)

export const focusedCompAtom = atomFamily(param => atom(''))

export const isVoidElem = (elem: string) => {
    return ['img', 'input'].includes(elem)
}

export const newTextAtom = atomWithStorage('newText', 'lorem ipsum')
const mod2 = new Module('Rexa')
const comp1 = new Comp('div', { width: 100, height: 50, color: 'white', background: 'blue' }, ['Kate the beaautiful'])
comp1.setId('root')
mod2.addComp(comp1)

const app = new AppClass('Starter', [mod2], [])
export const appAtom = atom(app)

export const modulesAtom = atom(
    (get) => {
        return get(appAtom).getModules()
    },
    (get, set, newVal: Module[]) => {
        const app = get(appAtom)
        const newApp = AppClass.copy(app)
        newApp.modules = newVal
        set(appAtom, newApp)
    }
)
export const oneModAtom = atomFamily((p: string) => {
    const modAtom = atom(
        (get) => {
            const mods = get(modulesAtom)
            console.log('got mod one')
            return mods.find(m => m.name === p)!
        },
        (get, set, mod: Module) => {
            const newMods = get(modulesAtom)
            const index = newMods.findIndex(m => m.name === p)
            newMods[index] = mod
            set(modulesAtom, newMods)
        }
    )
    return selectAtom(modAtom, ma => ma, (m1, m2) => m1.name === m2.name)
})
export const oneModAtom2 = atomFamily((p: string) => atom(
    (get) => {
        const mods = get(modulesAtom)
        console.log('got mod one')
        return mods.find(m => m.name === p)!
    },
    (get, set, mod: Module) => {
        const newMods = get(modulesAtom)
        const index = newMods.findIndex(m => m.name === p)
        newMods[index] = mod
        set(modulesAtom, newMods)
    }
))

//export const oneModAtom = selectAtom(old_oneModAtom, s => s.name)

export const compsAtom = atomFamily((p: string) => atom(
    (get) => {
        const { modName, compId }: { modName: string, compId: string } = JSON.parse(p)
        const mods = [...get(modulesAtom)]
        const mod = mods.find(m => m.name === modName)!
        if (!mod) {
            console.warn('module should exist', modName)
            return new Comp('loading', {}, [])
        }
        const c = mod.flatTree().find(c => c.id === compId)!
        console.log('Updating')
        return c
    },
    (get, set, comp: Comp) => {
        const { modName, compId }: { modName: string, compId: string } = JSON.parse(p)
        const mods = [...get(modulesAtom)]
        const mod = mods.find(m => m.name === modName)!
        let par: Comp | null
        par = Comp.findCompParent(mod.tree[0], comp.id)
        // if (!par) {
        //     if (mod.tree[0].id === comp.id)
        //         par = mod.tree[0]
        // }
        if (!par) {
            if (compId !== mod.tree[0].id) {
                console.warn('Should found parent', modName, mod)
                return
            }
        }
        // if comp is not root
        if (par) {
            const index = par.children.findIndex(c => (c as any).id === compId)
            console.log("updating set", index, par.children[index])
            par.children[index] = comp
        // we are working with the root
        } else {
            if (compId === mod.tree[0].id) {
                mod.tree[0] = comp
            }
        }
        set(modulesAtom, mods)
        console.log("serttin fppf")
    }
))

export const themeAtom = atomWithStorage('theme', 'dark')
export const activeModAtom = atom('')
export const modUpdateAtom = atom(1)
export const codeStyleAtom = atomWithStorage('code-style', { fontSize: '16px', })
export const codeScrollAtom = atomFamily(param => atom(0))
export const prevChangeAtom = atomFamily(p => atom(0))
export const defSize = atomWithStorage('def-size', { width: 150, height: 230 })
export const prevSizeAtom = atomFamily(p => atom({ width: 200, height: 240 }))
export const activeWSAtom = atom('')
export const savedAppAtom = atomWithStorage('saved-app', '')

export const focusedConstAtom = atomFamily(p => atom(''))

export const constraintItemsAtom = atomFamily(p => atom<ItemMod[]>([] as ItemMod[]))
export const constraintUpdateAtom = atom<{ update: Function, name: string }>({ update: () => console.log('update not set'), name: '' })
export const showArrowsAtom = atomWithStorage('arrow', true)
// export const rootSpacesAtom = atom([{ comp: <WorkSpace id={-1}   />, type: 'workspace' }])

// sidebar states
export const sbRightAtom = atomWithStorage('sb-right', true)
export const sbLeftAtom = atomWithStorage('sb-left', true)

// work-areas spaces 
export interface IPace { id: string, parent: string, orient: 'h' | 'v' }
export interface IWsView { comp: any, name: string, type: string }
export interface IWsAllViews { [key: string]: IWsView[] }
export const wsAllViewsAtom = atom({} as IWsAllViews)
export const wsViewsAtom = atomFamily((p: string) => {
    return atom(
        get => {
            const views = get(wsAllViewsAtom)
            if (views[p]) {
                return views[p]
            } else {
                return []
            }
        },
        (get, set, value: IWsView[]) => {
            const views = get(wsAllViewsAtom)
            views[p] = value
            set(wsAllViewsAtom, { ...views })
        }
    )
})
const defWS = [
    {
        "id": "seda",
        "parent": "root",
        "orient": "h",
    },
] as IPace[]
export const waSpacesAtom = atom(defWS)

export const wsRootOrint = atom('h' as 'h' | 'v')

export const lastOpenAtom = atomWithStorage('last-Open', '')
interface IClip { comp: Comp, time: number }
export const clipBoardAtom = atom([] as IClip[])