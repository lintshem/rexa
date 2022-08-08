
import useCoolDimensions from 'react-cool-dimensions'

export const makeRandColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    let c = `rgb(${r},${g},${b})`
    return c
}

export const useDimensions = useCoolDimensions

