
import React from 'react';
import useCoolDimensions from 'react-cool-dimensions'

export const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    let c = `rgb(${r},${g},${b})`
    return c
}

export const useDimensions = useCoolDimensions

export const sendDrag = (e: React.DragEvent, action: string, data: string) => {
    e.dataTransfer.setData('text', JSON.stringify({ data, action }))
}
export const receiveDrag = (e: React.DragEvent) => {
    let str_data = e.dataTransfer.getData('text')
    try {
        const data = JSON.parse(str_data) as { data: string, action: string }
        if (data.action && data.data) {
            return data
        } else {
            return { data: '', action: '' }
        }

    } catch (e) {
        return { action: 'error', data: '' }
    }
}
