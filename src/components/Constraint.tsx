import React from 'react'
import { useBetterDimensions } from '../util/utils'
import "./Constraint.scoped.css"

type Unit = number | undefined
type Num = number
class Position {
    top: Unit
    left: Unit
    width: Unit
    height: Unit
    xMin = 0
    xMax = 0
    yMin = 0
    yMax = 0
    constructor({ top, left, width, height }: { top: Unit, left: Unit, width: Unit, height: Unit }) {
        this.top = top
        this.left = left
        this.width = width
        this.height = height

    }
    getBounds() {
        this.xMin = this.left || 0
        this.xMax = (this.left || 0) + (this.width || 0)
        this.yMin = this.top || 0
        this.yMax = (this.top || 0) + (this.height || 0)
    }
}

class Item {
    top: number = -1
    bottom: number = -1
    left: number = -1
    right: number = -1
    constructor({ top, bottom, left, right }: { top: Num, bottom: Num, left: Num, right: Num }) {

    }
    getTopPosition(parentPos: Position) {

    }
}

const Constraint = () => {
    const { observe, width, height, entry } = useBetterDimensions(5)
    const { observe: ob, width: w, height: h, entry: ent } = useBetterDimensions(5)
    console.log(entry, ent)
    return (
        <div>
            <div className='stage' ref={observe} >
                Constraint
                <div ref={ob} style={{ marginLeft: 20 }} >One</div>
            </div>
        </div>
    )
}

export default Constraint
