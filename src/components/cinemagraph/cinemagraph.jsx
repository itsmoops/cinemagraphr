import firebase from 'firebase/app'
import 'firebase/storage'
import styled from 'styled-components'

const Theater = styled.div`
    background: black;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`

const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: ${props => (props.theater ? '' : 'cover')};
`

class Cinemagraph extends React.Component {
    constructor() {
        super()
        this.state = {
            source:
                'https://firebasestorage.googleapis.com/v0/b/cinemagraphr-dev.appspot.com/o/cinemagraphs%2FRBQRk35.mp4?alt=media&token=d6f3dccd-e901-4c55-9d45-3fe9d99fccd5'
        }
    }
    componentDidMount() {
        // const graphsRef = firebase.storage().ref('cinemagraphs')
        // const url = graphsRef.child('RBQRk35.mp4').getDownloadURL()
    }
    render() {
        return (
            <Theater>
                <Video src={this.state.source} autoPlay loop theater={false} />
            </Theater>
        )
    }
}

export default Cinemagraph
