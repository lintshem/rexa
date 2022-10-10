import React from 'react'
import "./ManageMod.scoped.css"
import { Comp, Module } from '../models/Module'
import { useAtom } from 'jotai'
import { clipBoardAtom, focusedCompAtom, modulesAtom } from '../store/main'
import { RenameField } from '../library/RenameField'
import { toast } from 'react-toastify'
import { showDialog } from '../util/SmallComps'

interface IManageMod { mod: Module }
const ManageMod = ({ mod }: IManageMod) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(mod.name))
    const [modules, setModules] = useAtom(modulesAtom)
    const [clipBoard, setClipBoard] = useAtom(clipBoardAtom)

    const rename = (name: string) => {
        const newMods = [...modules]
        newMods.forEach(m => {
            if (m.name === mod.name) {
                m.flatTree().forEach(c => {
                    if (c.id === focused) {
                        c.id = name;
                    }
                })
            }
        })
        setModules(newMods)
        setFocused(name)

    }
    const findCompParent = (item: Comp, id: string, exact = false): null | Comp => {
        const child = item.children.find(d => (d as Comp).id === id)
        if (child) {
            if (exact) {
                return child as Comp
            } else {
                return item
            }
        }
        for (let index = 0; index < item.children.length; index++) {
            const c = item.children[index]
            if (c instanceof Comp) {
                const ret = findCompParent(c, id, exact)
                if (ret) return ret
            }
        }
        return null
    }
    const deleteComp = () => {
        const deleteIt = () => {
            const newMods = [...modules]
            newMods.forEach(m => {
                if (m.name === mod.name) {
                    const par = findCompParent(mod.tree[0], focused)
                    if (par) {
                        par.children = par.children.filter(c => (c as Comp).id !== focused)
                        setFocused(par.id)
                    }
                }
            })
            setModules(newMods)
        }
        showDialog(deleteIt)
    }
    const copyComp = () => {
        const copyIt = () => {
            const newMods = [...modules]
            newMods.forEach(m => {
                if (m.name === mod.name) {
                    const child = findCompParent(mod.tree[0], focused, true)
                    if (child) {
                        const newClip = [...clipBoard]
                        newClip.unshift({ comp: child, time: Date.now() })
                        setClipBoard(newClip)
                    } else {
                        toast('🍥 Could not copy.')
                    }
                }
            })
            setModules(newMods)
        }
        showDialog(copyIt)
    }
    const pasteComp = () => {
        if (clipBoard.length === 0) {
            toast('No data yet')
            return
        }
        const pasteIt = () => {
            const newMods = [...modules]
            newMods.forEach(m => {
                if (m.name === mod.name) {
                    m.flatTree().forEach(c => {
                        if (c.id === focused) {
                            const comp = Comp.copy(clipBoard[0].comp)
                            comp.id = comp.id + '-c'
                            c.addChild(comp)
                        }
                    })
                }
            })
            setModules(newMods)
        }
        showDialog(pasteIt)
    }
    return (
        <div>
            <div>{focused}</div>{ }
            <div>
                <button className='rexa-button' onClick={deleteComp} >delete</button>
                <button className='rexa-button' onClick={copyComp} >copy</button>
                <button className='rexa-button' onClick={pasteComp} >paste</button>
                <RenameField name={focused} setName={rename} key={focused} />
            </div>
        </div>
    )
}

export default ManageMod