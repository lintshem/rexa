import { atom } from "jotai";
import { atomFamily, atomWithStorage } from 'jotai/utils'
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

const mod = new Module('Start')
const comp6 = new Comp('button', { width: 60, height: 60, background: '' }, ['butons down'])
comp6.setId('buts')
const comp0 = new Comp('div', { width: 110, height: 130, background: '' }, ['Firntes', comp6])
comp0.setId('lsd')
const comp1 = new Comp('div', { width: 120, height: 200, background: 'grey' }, [comp0, 'blues'])
comp1.setId('frr')
const comp3 = new Comp('div', { width: 120, height: 200, background: 'pink' }, ['Outer'])
comp3.setId('vel')

const comp2 = new Comp('div', { width: 200, height: 400, background: 'lavender' }, [comp3, 'Test div', comp1])
comp2.setId('top')
mod.addComp(comp2)

export const modulesAtom = atom<Module[]>([mod])

export const themeAtom = atom('dark')
export const activeModAtom = atom('')