Fooo

```js
import ReactModal from '@forrestjs/react-stack-layout'

// Just some style
import styled from 'styled-components'
const ModalInner = styled.div`margin: 20px`
const ModalWrapper = styled.div`
    display: block
    width: 100vw
    height: 100vh
    background: white
    box-shadow: -5px 0 25px #ddd
`

// Utilities to handle the stack of components
initialState = { stack: [] }
const stackModal = title => {
    const render = ({ requestClose, requestPush }) => (
        <ModalWrapper>
            <ModalInner>
                <h2>{title} {state.stack.length + 1}</h2>
                <Button onClick={() => requestPush('Modal n.')}>Add one more screen</Button>
                <hr />
                <Button onClick={requestClose}>close</Button>
                <small>{'or try to swipe...'}</small>
            </ModalInner>
        </ModalWrapper>
    )

    setState({ stack: [ ...state.stack, { key: Date.now(), render } ]})
}
const unstackModal = (item) => setState({
    stack: [...state.stack.filter($ => $ !== item)],
})

// The component part... easy, right?
;<>
    <Button
        onClick={() => stackModal('Modal n.')}
        children="Open the first modal in the stack"
    />

    <ReactStackLayout
        items={state.stack}
        onRequestClose={unstackModal}
        onRequestPush={stackModal}
    />
</>
```