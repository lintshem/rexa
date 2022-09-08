import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { IFile } from '../models/Module'
import { modulesAtom } from '../store/main'
import "./Files.scoped.css"


interface IFiles { modName: string }
const Files = ({ modName }: IFiles) => {
    const modules = useAtomValue(modulesAtom)
    const mod = modules.find(m => m.name === modName)
    const [dragging, setDragging] = useState(false)
    const [files, setFiles] = useState([...(mod?.files || [])])
    if (!mod) {
        return <div>NO FILES</div>
    }
    const drop = async (e: React.DragEvent) => {
        setDragging(false)
        e.preventDefault()
        if (e.dataTransfer.files) {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
                await addFile(e.dataTransfer.files[i])
            }
            setFiles([...mod.files])
        }
    }
    const addFile = async (file: File) => {
        await mod.addFile(file)
    }
    const registerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e, e.target.files![0])
        if (e.target.files) {
            const gotFiles = e.target.files
            for (let i = 0; i < gotFiles.length; i++) {
                const file = gotFiles[i]
                await addFile(file)
            }
            setFiles([...mod.files])
        }
    }
    const deleteAt = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }
    interface IFileRow { file: IFile, index: number }
    const FileRow = ({ file, index }: IFileRow) => {
        return <div className='file-row'>
            {file.name}
            <MdDelete onClick={() => deleteAt(index)} />
        </div>
    }

    const classes = `main ${dragging ? 'main-active' : ''}`
    return (
        <div className={classes} onDragOver={e => e.preventDefault()} onDrop={drop}
            onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} >
            Files
            <input className='file' type='file' multiple onChange={registerFile} />
            <div className='file-area'>
                {files.map((f, i) => <FileRow key={f.name} index={i} file={f} />)}
            </div>
        </div>
    )
}

export default Files