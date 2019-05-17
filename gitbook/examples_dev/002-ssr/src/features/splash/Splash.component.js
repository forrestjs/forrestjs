import React from 'react'

const style = {
    position: 'fixed', top: 0, bottom: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#258cf9', color: '#fff',
}

const Splash = ({ isVisible }) => isVisible
    ? <div style={style}>loading...</div>
    : null

export default Splash
