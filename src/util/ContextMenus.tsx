import React from 'react'
import { ContextMenu , MenuItem } from '../library/ContextMenu'

export const DesignMenu = () => {
    return (
        <div>
            <ContextMenu id="design-context" >
                ok
                <MenuItem>
                    One
                </MenuItem>
                <MenuItem >
                    two
                </MenuItem>
            </ContextMenu>
        </div>
    )
}


