import { useAtom } from 'jotai'
import React, { useState } from 'react'
import useDimensions from 'react-cool-dimensions'
import Button from '../library/Button'
import Popover from '../library/Popover'
import { Module } from '../models/Module'
import { modulesAtom } from '../store/main'
import './Explorer.scoped.css'
interface IModItem { mod: Module }
const ModuleItem = ({ mod }: IModItem) => {
    return (
        <div>
            {mod.name}
        </div>
    )
}
const Explorer = () => {
    const [modules, setModules] = useAtom(modulesAtom)
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const { observe, height } = useDimensions()
    const openAddDialog = () => {
        console.info('add')
        setShowAdd(true)
    }
    const addModule = () => {
        let modName = name.trim()
        if (modName && modName.length >= 3) {
            
        }
    }
    return (
        <div ref={observe} >
            <div>MODULES</div>
            {modules.map(m => <ModuleItem key={m.name} mod={m} />)}
            <div>
                <Button onClick={openAddDialog} >ADD</Button>
                <Popover open={showAdd} top={-height / 2} setOpen={setShowAdd} width={'80px'} >

                </Popover>
                <div>
                    <div>Name : <input value={name} onChange={(e) => setName(e.target.value)} /></div>
                </div>
                <Button onClick={addModule} >DONE</Button>
            </div>
        </div>
    )
}

export default Explorer