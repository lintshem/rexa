import { atom } from "jotai";
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { ItemMod } from "../components/Constraint";
import { AppClass } from "../models/AppClass";
import { Comp, Module } from "../models/Module";

export const basicCompsAtom = atom([
    'div', 'p', 'button', 'text', 'input', 'img'
])

export const attribAtom = atom(0)

export const focusedCompAtom = atomFamily(param => atom(''))

export const isVoidElem = (elem: string) => {
    return ['img', 'input'].includes(elem)
}

export const newTextAtom = atomWithStorage('newText', 'lorem ipsum')
const mod2 = new Module('Rexa')
const compr1 = new Comp('div', { width: 100, height: 30, color: 'white', background: 'blue' }, ['Click Me'])
compr1.setId('root')
mod2.addComp(compr1)

const mod = new Module('ModTest')
const comp6 = new Comp('button', { width: 60, height: 60, background: '' }, ['butons down'])
comp6.setId('buts')
comp6.actions['onClick'].func = 'getName'
const comp0 = new Comp('div', { width: 110, height: 130, background: '' }, ['Firntes', comp6])
comp0.setId('lsd')
const comp1 = new Comp('div', { width: 120, height: 200, background: 'grey' }, [comp0, 'blues'])
comp1.setId('frr')
const comprexa = new Comp('div', {}, [])
comprexa.setIsModule(true)
comprexa.module = mod2;

const comp4 = new Comp('const', { width: 120, height: 200 }, ['ok'])
comp4.setId('desa')
const comp3 = new Comp('div', { width: 120, height: 200, background: 'pink' }, ['Outer', comprexa, comp4])
comp3.setId('vel')
const comp2 = new Comp('div', { width: 200, height: 400, background: 'lavender' }, [comp3, 'Test div', comp1])
comp2.setId('top')
mod.addComp(comp2)

const app = new AppClass('Starter', [mod, mod2])
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
export const defSize = atomWithStorage('def-size', { width: 300, height: 400 })
export const prevSizeAtom = atomFamily(p => atom({ width: 300, height: 400 }))
export const activeWSAtom = atom(0)
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
