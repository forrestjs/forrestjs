```js
import ReactModal from '@forrestjs/react-modal'
import styled from 'styled-components'
const ModalInner = styled.div`
    position: fixed;
    top: 10vh;
    left: 10vw;
    width: 70vw;
    height: 50vh;
    background: white;
    padding: 5vh 5vw;
    border-radius: 10px;
    box-shadow: 0 0 10px #222;
`

const { fade, slideLeft, slideUp } = ReactModal.animations

initialState = {
    isVisible: false,
    animation: null,
};
<div>
    <Button
        onClick={() => setState({ isVisible: true, animation: fade })}
        children="Open modal - fade animation"
    />
    <Button
        onClick={() => setState({ isVisible: true, animation: slideLeft })}
        children="Open modal - slideLeft animation"
    />
    <Button
        onClick={() => setState({ isVisible: true, animation: slideUp })}
        children="Open modal - slideUp animation"
    />

    <ReactModal
        isVisible={state.isVisible}
        animation={state.animation}
        onRequestClose={() => setState({ isVisible: false })}
    >
        <ModalInner>
            <h2>I am a Modal</h2>
            <Button
                onClick={() => setState({ isVisible: false })}
                children={'Close modal'}
            />
            {state.animation !== fade ? (
                <small><i>Try also to swipe right or down!</i></small>
            ) : null}
        </ModalInner>
    </ReactModal>
</div>
```