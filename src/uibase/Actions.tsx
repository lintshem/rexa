import { useAtomValue, useSetAtom } from 'jotai'
import React, { useState } from 'react'
import Popover from '../library/Popover'
import { Module } from '../models/Module'
import { prevChangeAtom, focusedCompAtom } from '../store/main'
import { getAction, IActionRow } from '../util/props'
import "./Actions.scoped.css"

interface IAction { mod: Module }
const Actions = ({ mod }: IAction) => {
    const focused = useAtomValue(focusedCompAtom(mod.name))
    const comp = mod.getCompFromId(focused)
    if (!comp) {
        return (
            <div>
                Select a Comp
            </div>
        )
    }
    const actionItems = getAction(comp.elem)
    const methods = mod.getMethods()
    interface IActRow { act: IActionRow }
    const ActRow = ({ act }: IActRow) => {
        const prevChangeUpdate = useSetAtom(prevChangeAtom(mod.name))
        const getValue = () => comp.actions[act.name].func
        const updateValue = (val: string) => {
            comp.actions[act.name].func = val
            setValue(val)
            setTimeout(() => prevChangeUpdate(c => c % 100 + 1), 200)
        }
        const [value, setValue] = useState(getValue())
        const getArgs = () => comp.actions[act.name].args
        const updateArgs = (val: string) => {
            comp.actions[act.name].args = val
            setTimeout(() => prevChangeUpdate(c => c % 100 + 1), 200)
        }
        const [args, setArgs] = useState(getArgs())
        const [openHelp, setOpenHelp] = useState(false)
        const SelectItem = ({ name }: { name: string }) => {
            const setSelection = () => {
                setValue(name)
                updateValue(name)
            }
            return (
                <div className='select-item' onClick={setSelection} >{name}</div>
            )
        }
        return (
            <div className='action-row' onDoubleClick={() => setOpenHelp(true)} >
                <div className='act-name' >{act.name}</div>
                <input className='rexa-input' value={value} onChange={(e) => setValue(e.target.value)}
                    onBlur={() => updateValue(value)} placeholder='action' />
                <Popover width="80%" open={openHelp} clickClose={true} setOpen={setOpenHelp} >
                    <div className='popover' >
                        {methods.map(m => <SelectItem key={m} name={m} />)}
                    </div>
                </Popover>
                <input className='rexa-input' value={args} onChange={(e) => setArgs(e.target.value)}
                    onBlur={() => updateArgs(args)} placeholder='args' />
            </div>
        )
    }
    if (actionItems === undefined) {
        return (
            <div>NO Actions</div>
        )
    }
    return (
        <div>
            {actionItems.map(a => <ActRow key={a.name} act={a} />)}
        </div>
    )
}

export default Actions