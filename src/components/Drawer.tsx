import { useAtom } from 'jotai'
import React from 'react'
import { EditContainer } from '../library/Editables'
import Resizable from '../library/Resizable'
import Designer from '../models/Designer'
import { Comp, Module } from '../models/Module'
import { focusedCompAtom } from '../store/main'
import Attributes from '../subcomps/Attrib'
import "./Drawer.scoped.css"

interface ICompTree { editable: EditContainer, focused: string, setFocused: Function }
export const CompTree = ({ editable, setFocused, focused }: ICompTree) => {
    const comp = editable.comp
    const getUi = (id: string, pad: number) => {
        return (
            <div key={id} className={`ct-main ${id === focused ? 'ct-focused' : ''}`} style={{ marginLeft: pad }}
                onClick={() => setFocused(id)}  >
                {id}
            </div>
        )
    }
    const elements: any[] = []
    const getComp = (comp: Comp, pad = 0) => {
        const tabSize = 10
        const childTrees: any[] = []
        const childElements: any[] = []
        comp.children.forEach(c => {
            if ((c as any).id) {
                c = c as Comp
                const tree = getComp(c as Comp, pad + tabSize)
                const elem = getUi(c.id, pad)
                childElements.push(elem)
                //  elements.push(elem)
                childTrees.push({ [c.id]: { childs: tree, pad, ui: elem } })
            }
        })
        elements.push(...childElements)
        return childTrees
    }
    const wrapComp = (comp: Comp) => {
        const c = new Comp('div', {}, [comp])
        c.setId('wrapper-ffffffff')
        return c
    }
    getComp(wrapComp(comp))//{ children: [comp] } as Comp)
    return (
        <div>
            {elements.reverse()}
        </div>
    )
}

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
const editable = mod.tree[0].getEdit()


// eslint-disable-next-line 
// global.ed = editable

const Drawer = () => {
    const [focused, setFocused] = useAtom(focusedCompAtom(mod.name))
    return (
        <>
            <Resizable className='main' defRatio={[6, 2]} style={{ height: 500 }}  >
                <Designer module={mod} />
                <Resizable align='ver' defRatio={[1, 1]} style={{ height: '100%' }} >
                    <CompTree editable={editable} focused={focused} setFocused={setFocused} />
                    <Attributes mod={mod} />
                </Resizable>
            </Resizable>
        </>
    )
}

export default Drawer
