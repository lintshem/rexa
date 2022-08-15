import { useAtom } from 'jotai'
import { useState } from 'react'
import { EditContainer } from '../library/Editables'
import Resizable from '../library/Resizable'
import { Comp, Module } from '../models/Module'
import { attribAtom, basicCompsAtom } from '../store/main'
import Attributes from '../subcomps/Attrib'
import "./Drawer.scoped.css"

export const Widgets = () => {
    const [items] = useAtom(basicCompsAtom)
    const WidgetItem = ({ item }: { item: string }) => {
        return (
            <div className='wi-main' >
                {item}
            </div>
        )
    }
    return (
        <div>
            {items.map(item => <WidgetItem key={item} item={item} />)}
        </div>
    )
}
interface IDrawArea { editable: EditContainer, focused: string }
const DrawArea = ({ editable, focused }: IDrawArea) => {
    const [,] = useAtom(attribAtom)
    return (
        <div className='da-main' >
            {editable.draw(focused)}
        </div>
    )
}
interface ICompTree { editable: EditContainer, setFocused: Function }
export const CompTree = ({ editable, setFocused }: ICompTree) => {
    const comp = editable.comp
    const getUi = (id: string, pad: number) => {
        return (
            <div key={id} className='ct-main' style={{ marginLeft: pad }}
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
        elements.push(...childElements.reverse())
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


const Drawer = () => {
    const [focused, setFocused] = useState('')
    const mod = new Module('Start')
    const comp0 = new Comp('div', { style: { width: 120, height: 200, background: 'grey' } }, ['Outer'])
    comp0.setId('lsd')
    const comp1 = new Comp('div', { style: { width: 120, height: 200, background: 'grey' } }, [comp0, 'Outer'])
    comp1.setId('frr')
    const comp3 = new Comp('div', { style: { width: 120, height: 200, background: 'grey' } }, ['Outer'])
    comp3.setId('fddd')

    const comp2 = new Comp('div', { style: { width: 200, height: 200, background: 'lavender' } }, [comp3, 'Test div', comp1])
    comp2.setId('fdd')
    mod.addComp(comp2)
    const editable = mod.tree[0].getEdit()

    return (
        <>
            <Resizable className='main' defRatio={[1, 3, 2]} style={{ height: 400 }}  >
                <Widgets />
                <DrawArea editable={editable} focused={focused} />
                <Resizable align='ver' defRatio={[1, 1]} style={{ height: '100%' }} >
                    <CompTree editable={editable} setFocused={setFocused} />
                    <Attributes editable={editable} />
                </Resizable>
            </Resizable>
        </>
    )
}

export default Drawer