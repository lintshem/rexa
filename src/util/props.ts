interface IPropRow {
    name: string,
    def: any,
    type: string,
    notStyle?:true,
}
export interface IProp {
    style: IPropRow[],
    className?: IPropRow,
    id?: IPropRow,
    draggable?: IPropRow,
}

export interface IProps {
    [elem: string]: IProp
}
export const props = {
    div: {
        style: [
            { name: 'width', def: '', type: 's,n' },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: 'red', type: 's' },
            { name: 'background', def: '', type: 's' },
            { name: 'flex', def: 1, type: 'n' },

        ],
        id: { name: 'id', def: '', type: 's,n' },
        className: { name: 'className', def: '', type: 's,n' },

    },
    divs: {
        style: [
            { name: 'width', def: '', type: 's,n' },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: '', type: 's' },
            { name: 'background', def: '', type: 's' },
        ],
    },
    button: {
        style: [
            { name: 'borderRadius', def: '', type: 's', },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: '', type: 's' },
            { name: 'background', def: '', type: 's' },
            { name: 'width', def: '', type: 's,n' },
        ],
    },


} as IProps

export interface IPropItems { [key: string]: IPropRow[] }
export const propItems = {
    div: [
        { name: 'width', def: '', type: 's,n' },
        { name: 'height', def: '', type: 's,n' },
        { name: 'color', def: 'red', type: 's' },
        { name: 'background', def: '', type: 's' },
        { name: 'flex', def: 1, type: 'n' },
        { name: 'overflow', def: '', type: 's' },
        { name: 'boxShadow', def: '', type: 's' },
        { name: 'border', def: '', type: 's' },
        { name: 'borderRadius', def: '', type: 's' },
        
    ],
    divs: [
        { name: 'width', def: '', type: 's,n' },
        { name: 'height', def: '', type: 's,n' },
        { name: 'color', def: '', type: 's' },
        { name: 'background', def: '', type: 's' },
    ],
    button: [
        { name: 'borderRadius', def: '', type: 's', },
        { name: 'height', def: '', type: 's,n' },
        { name: 'color', def: '', type: 's' },
        { name: 'background', def: '', type: 's' },
        { name: 'width', def: '', type: 's,n' },
        { name: 'width', def: '', type: 's,n', noneStyle: true },

    ],
} as IPropItems

export const getProps = (element: string): IProp | undefined => {
    return props[element]
}
export interface IPropType {
    name: string,
    type: string,
    def: any
    style: boolean,
}
export const getPropFlat = (element: string, tree = undefined): IPropType[] => {
    const ptypes: IPropType[] = []
    const propsElem = tree ? tree : props[element]
    for (let [key, val] of Object.entries(propsElem)) {
        if (key === 'style') {
            const types = getPropFlat(key, val)
            ptypes.push(...types)
        } else {
            val = (val as IPropRow)
            ptypes.push({ name: val.name, type: val.type, def: val.def, style: !!tree })
        }
    }
    return ptypes
}

