import React from 'react'
import './Coder.scoped.css'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { useAtomValue, useSetAtom } from 'jotai'
import { prevChangeAtom, codeStyleAtom, modulesAtom, themeAtom } from '../store/main'
import { useBetterDimensions } from '../util/utils'

const extensions = [javascript({ jsx: true })]


interface ICoder { modName: string }
const Coder = ({ modName }: ICoder) => {
    const theme = useAtomValue(themeAtom)
    const modules = useAtomValue(modulesAtom)
    const setCodeUpdate = useSetAtom(prevChangeAtom(modName))
    const { observe, height } = useBetterDimensions()
    const codeStyle = useAtomValue(codeStyleAtom)
    const mod = modules.find(m => m.name === modName)
    if (!mod) {
        return (
            <div>No module Wth that name</div>
        )
    }
    const codeChange = (code: string, ...rest: any) => {
        mod.code = code
        setCodeUpdate(c => c % 100 + 1)
    }
    const drop = (e: React.DragEvent) => {
        const data = e.dataTransfer.getData('text')
        console.log(e, data)
        const res = JSON.parse(data)
        console.log(res)
        e.stopPropagation()

    }
    return (
        <div className='main' ref={observe} >
            <CodeMirror
                onDrop={drop}
                lang='javascript'
                theme={theme === 'dark' ? okaidia : 'light'}
                value={mod.code}
                onChange={codeChange}
                extensions={extensions}
                height={height + 'px'}
                style={codeStyle}
            />
        </div>
    )
}

export default Coder