import { useAtomValue } from 'jotai'
import React from 'react'
import { Module } from '../models/Module'
import { focusedCompAtom } from '../store/main'
import "./Actions.scoped.css"

interface IAction { mod: Module }
const Actions = ({ mod }: IAction) => {
    const focused = useAtomValue(focusedCompAtom(mod?.name || ''))
    const comp = mod.getCompFromId(focused)
    console.log(comp, focused)
    if (!comp) {
        return (
            <div>
                Select a Comp
            </div>
        )
    }
    return (
        <div>
            Actions

        </div>
    )
}

export default Actions