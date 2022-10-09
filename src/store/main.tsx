import { atom } from "jotai";
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { ItemMod } from "../components/Constraint";
import { AppClass } from "../models/AppClass";
import { Comp, Module } from "../models/Module";

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
const compr1 = new Comp('div', { width: 100, height: 50, color: 'white', background: 'blue' }, ['Kate the beaautiful'])
compr1.setId('root')
mod2.addComp(compr1)

const mod = new Module('ModTest')
const comp6 = new Comp('button', { width: 60, height: 60, background: '' }, ['butons down'])
comp6.setId('buts')
comp6.actions['onClick'].func = 'getName'
const comp0 = new Comp('div', { width: 110, height: 130, background: '' }, ['Firntes', comp6])
comp0.setId('lsd')
const comprexa = new Comp('div', {}, [])
comprexa.setIsModule(true)
comprexa.module = mod2;

const comp4 = new Comp('const', { width: 120, height: 200 }, ['ok'])
comp4.setId('desa')
const comp3 = new Comp('div', { width: 120, height: 200, background: 'pink' }, ['Outer', comprexa, comp4])
comp3.setId('vel')
mod.addComp(comp3)

const app = new AppClass('Starter', [mod, mod2],[])
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
        console.info('wrote', get(appAtom))
    }
)
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
const items = [
    //  ItemMod.Create({ w: 70, h: 130, t: 5, r: 10, name: 'oner' }),
    // ItemMod.Create({ h: 120, t: 30, l: 15, r: 5, name: 'twos' }).scn([['r', 0]]),
    // ItemMod.Create({ h: 50, t: 30, b: 15, l: 10, r: 0, name: 'twos-hang' }).scn([['t', 1], ['b', 3], ['r', 3]]),
    // ItemMod.Create({ w: 120, t: 5, b: 10, r: 10, name: 'fress' }).scn([["r", 0], ['t', 2]]),
    // ItemMod.Create({ h: 50, b: 10, l: 15, r: 20, name: 'LeftBot' }).scn([['r', 3]]),
    // ItemMod.Create({ t: 10, b: 13, l: 20, r: 10, name: 'RightBot' }).scn([['l', 1], ['t', 0]]),
    // ItemMod.Create({ h: 50, t: 30, l: 10, r: 7, name: 'hang-left' }).scn([['b', 1], ['l', 2], ['t', 1], ['r', 5]]),
] as ItemMod[]

export const constraintItemsAtom = atomFamily(p => atom<ItemMod[]>([...items]))
export const constraintUpdateAtom = atom<{ update: Function, name: string }>({ update: () => console.log('update not set'), name: '' })
export const showArrowsAtom = atomWithStorage('arrow', true)
// export const rootSpacesAtom = atom([{ comp: <WorkSpace id={-1}   />, type: 'workspace' }])

// sidebar states
export const sbRightAtom = atomWithStorage('sb-right', true)
export const sbLeftAtom = atomWithStorage('sb-left', true)

// work-areas spaces 
export interface IPace{ id: string, parent: string, orient: 'h' | 'v' }
const defWS = [
    {
        "id": "seda",
        "parent": "root",
        "orient": "h"
    },
    {
        "id": "messa",
        "parent": "root",
        "orient": "v"
    },
    {
        "id": "desa",
        "parent": "messa",
        "orient": "h"
    },
    {
        "id": "grey",
        "parent": "messa",
        "orient": "h"
    },
    {
        "id": "14",
        "parent": "desa",
        "orient": "h"
    },
    {
        "id": "15",
        "parent": "desa",
        "orient": "h"
    }
] as IPace[]
export const waSpacesAtom = atom(defWS)

export const wsRootOrint = atom('h' as 'h' | 'v')

export const lastOpenAtom =atomWithStorage('last-Open','')
