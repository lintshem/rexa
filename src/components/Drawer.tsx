import { useAtom, useAtomValue } from 'jotai'
import React from 'react'
import { EditContainer } from '../library/Editables'
import Splitter from '../library/Resizable'
import TabContainer from '../library/TabContainer'
import Designer from '../models/Designer'
import { Comp } from '../models/Module'
import { focusedCompAtom, modulesAtom } from '../store/main'
import Attributes from '../subcomps/Attrib'
import ManageMod from '../subcomps/ManageMod'
import Actions from '../uibase/Actions'

import "./Drawer.scoped.css"

interface ICompTree { modName: string, focused: string, setFocused: Function }
export const CompTree = ({ modName, setFocused, focused }: ICompTree) => {
    const modules = useAtomValue(modulesAtom)
    const mod = modules.find(m => m.name === modName)
    if (!mod) {
        return (
            <div>No Module</div>
        )
    }
    const editable = mod.tree[0].getEdit()
    const comp = editable.comp
    const getUi = (id: string, pad: number) => {
        return (
            <div key={id} className={`ct-main ${id === focused ? 'ct-focused' : ''}`} style={{ marginLeft: pad }}
                onClick={() => setFocused(id)}  >
                {id}
            </div>
        )
    }
    const getComp = (compElm: Comp, pad = 0) => {
        const tabSize = 10
        const childTrees: any[] = []
        const elements: any[] = []
        compElm.children.reverse().forEach((c, i) => {
            let comp;
            if ((c as any).id) {
                comp = c
                c = c as Comp
                const tree = getComp(c as Comp, pad + tabSize)
                const elem = getUi(c.id, pad)
                elements.push(elem)
                elements.push(...tree)
                childTrees.push({ [c.id]: { childs: tree, pad, ui: elem } })
            } else {
                comp = { id: `$${compElm.id},${i}` }
                const elem = getUi(comp.id, pad)
                elements.push(elem)
            }
        })
        return elements
    }
    const wrapComp = (comp: Comp) => {
        const c = new Comp('div', {}, [comp])
        c.setId('wrapper-ffffffff')
        return c
    }
    const elements = getComp(wrapComp(comp))//{ children: [comp] } as Comp)
    return (
        <div>
            {elements}
        </div>
    )
}

interface IDrawer { modName: string }
const Drawer = ({ modName }: IDrawer) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(modName))
    return (
        <Splitter defRatio={[6, 2]}   >
            <Designer modName={modName} />
            <div className='wrapper' >
                <Splitter align='ver' defRatio={[1, 1]}  >
                    <CompTree modName={modName} focused={focused} setFocused={setFocused} />
                    <TabContainer id={`act-${modName}`} titles={['Att', 'Act', 'Man']}>
                        <Attributes modName={modName} />
                        <Actions modName={modName} />
                        <ManageMod modName={modName} />
                    </TabContainer>
                </Splitter>
            </div>
        </Splitter>
    )
}

export default Drawer