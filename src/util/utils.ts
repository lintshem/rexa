
import React, { useState } from 'react';
import useCoolDimensions from 'react-cool-dimensions'

export const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    let c = `rgb(${r},${g},${b})`
    return c
}

export const useDimensions = useCoolDimensions

export const sendDrag = (e: React.DragEvent, action: string, data: any) => {
    e.dataTransfer.setData('text', JSON.stringify({ data, action }))
}
export const receiveDrag = (e: React.DragEvent) => {
    let str_data = e.dataTransfer.getData('text')
    try {
        const data = JSON.parse(str_data) as { data: any, action: string }
        if (data.action && data.data) {
            return data
        } else {
            return { data: '', action: '' }
        }

    } catch (e) {
        return { action: 'error', data: '' }
    }
}
export const sendMessage = (channel: string, message: any) => {
    window.postMessage({ channel, message })
}

//TODO possible memory leak
export const receiveMessage = (channel: string, callBack: (data: any) => void) => {
    const msgCallback = (msg: MessageEvent) => {
        if (channel === msg.data.channel) {
            callBack(msg.data.message)
        }
    }
    window.addEventListener('message', msgCallback)
    return () => window.removeEventListener('message', msgCallback)
}
export const useBetterDimensions = (dist = 10) => {
    const [size, setSize] = useState({ w: 0, h: 0 })
    const { observe, width, height, entry } = useDimensions()
    const wd = Math.abs(size.w - width)
    const wh = Math.abs(size.h - height)
    if (wd > dist || wh > dist) {
        setSize({ w: width, h: height })
    }
    return { width: size.w, height: size.h, observe, entry }
}
export const addShortcut = (key: string, callBack: Function, ctrl = false, shift = false) => {
    const handler = (e: KeyboardEvent) => {
        if (e.ctrlKey === ctrl && e.shiftKey === shift && key === e.key) {
            callBack(e)
            e.stopPropagation()
            e.preventDefault()
        }
    }
    window.document.addEventListener('keydown', handler)
    return () => window.document.removeEventListener('keydown', handler)
}

export const cancelDrag = (e: React.DragEvent) => {
    e.preventDefault()
}