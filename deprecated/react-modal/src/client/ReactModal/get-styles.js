
const getStylesSlideLeft = ({ translate, opacity }) => ({
    opacity,
    transform: translate.interpolate(v => `translate3d(${v}vw, 0, 0)`),
})

const getStylesSlideUp = ({ translate, opacity }) => ({
    opacity,
    transform: translate.interpolate(v => `translate3d(0, ${v}vh, 0)`),
})

export const getStyles = ({ props, animation }) => {
    switch (animation) {
        case 'slideLeft': return getStylesSlideLeft(props)
        case 'slideUp': return getStylesSlideUp(props)
        default: return ({ opacity: props.opacity })
    }
}
