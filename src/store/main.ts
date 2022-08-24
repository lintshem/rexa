import { atom } from "jotai";
import { atomFamily, atomWithStorage } from 'jotai/utils'

export const basicCompsAtom = atom([
    'div', 'p', 'button', 'text', 'input', 'img'
])

export const attribAtom = atom(0)

export const focusedCompAtom = atomFamily(param => atom(''))

export const isVoidElem = (elem: string) => {
    return ['img', 'input'].includes(elem)
}

export const newTextAtom = atomWithStorage('newText','lorem ipsum')

