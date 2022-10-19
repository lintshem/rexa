import React from 'react'
import "./ManageMod.scoped.css"
import { Comp } from '../models/Module'
import { useAtom } from 'jotai'
import { clipBoardAtom, focusedCompAtom, modulesAtom } from '../store/main'
import { RenameField } from '../library/RenameField'
import { toast } from 'react-toastify'
import { showDialog } from '../util/SmallComps'
import { MdDownload, MdUpload } from 'react-icons/md'
import { Module } from 'module'

interface IManageMod { modName: string }
const ManageMod = ({ modName }: IManageMod) => {
    const [modules, setModules] = useAtom(modulesAtom)
    const mod = modules.find(m => m.name === modName)
    const [focused, setFocused] = useAtom(focusedCompAtom(mod?.name))
    const [clipBoard, setClipBoard] = useAtom(clipBoardAtom)
    if (!mod) {
        return (
            <div>No Module</div>
        )
    }

    const rename = (name: string) => {
        const newMods = [...modules]
        for (const m of newMods) {
            if (m.name === mod.name) {
                const allChilds = m.flatTree()
                const found = allChilds.filter(c => c.id === name)
                if (found.length > 0) {
                    toast("😁 ID taken.")
                    return
                }
                allChilds.forEach(c => {
                    if (c.id === focused) {
                        c.id = name;
                    }
                })
                break;
            }
        }
        setModules(newMods)
        setFocused(name)

    }

    const deleteComp = () => {
        const deleteIt = () => {
            const newMods = [...modules]
            newMods.forEach(m => {
                if (m.name === mod.name) {
                    const par = Comp.findCompParent(mod.tree[0], focused)
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
                    const child = Comp.findCompParent(mod.tree[0], focused, true)
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
    const moveUp = () => {
        const newMods = [...modules]
        for (const m of newMods) {
            if (m.name === modName) {
                const par = Comp.findCompParent(m.tree[0], focused)
                console.log(par)
                if (par) {
                    const index = par.children.findIndex(c => (c as Comp).id === focused)
                    if (index !== 0) {
                        const child = par.children.splice(index, 1)[0]
                        par.children.splice(index - 1, 0, child)
                    }
                }
                break;
            }
        }
        setModules(newMods)
    }
    const moveDown = () => {
        const newMods = [...modules]
        for (const m of newMods) {
            if (m.name === modName) {
                const par = Comp.findCompParent(m.tree[0], focused)
                console.log(par)
                if (par) {
                    const index = par.children.findIndex(c => (c as Comp).id === focused)
                    if (index !== par.children.length - 1) {
                        const child = par.children.splice(index, 1)[0]
                        par.children.splice(index + 1, 0, child)
                    }
                }
                break;
            }
        }
        setModules(newMods)
    }
    return (
        <div>
            <div>{focused}</div>{ }
            <div className='mm-actions'>
                <button className='rexa-button' onClick={deleteComp} >delete</button>
                <button className='rexa-button' onClick={copyComp} >copy</button>
                <button className='rexa-button' onClick={pasteComp} >paste</button>
                <RenameField name={focused} setName={rename} key={focused} />
            </div>
            <div className='mm-moves' >
                <div>Move</div>
                <div className='rexa-button' onClick={moveUp} > <MdUpload /> Up </div>
                <div className='rexa-button' onClick={moveDown} > <MdDownload /> Down</div>
            </div>
        </div>
    )
}

export default ManageMod
