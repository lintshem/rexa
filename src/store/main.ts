import { atom, Getter } from "jotai";
import { atomFamily } from 'jotai/utils'
export const basicCompsAtom = atom([
    'div', 'p', 'button',
])

export const attribAtom = atom(0)

export const focusedComp = atomFamily(param => atom(''))

