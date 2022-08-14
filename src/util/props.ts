interface propRow {
    name: string,
    def: any,
    type: string,
}
export interface IProp {
    style: propRow[],
    [key: string]: any,
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
        className:{ name: 'width', def: '', type: 's,n' },
    },
    divs: {
        style: [
            { name: 'width', def: '', type: 's,n' },
            { name: 'height', def: '', type: 's,n' },
            { name: 'color', def: '', type: 's' },
            { name: 'background', def: '', type: 's' },
        ],
    },

} as IProps

export const getProps = (element: string): IProp | undefined => {
    return props[element]

}