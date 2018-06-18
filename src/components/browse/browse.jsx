import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import firebase from 'firebase/app'
import 'firebase/database'
import Card from './card'

const FlexContainer = styled(Flex)`
    overflow: hidden;
    flex-wrap: wrap;
`
class Browse extends React.Component {
    constructor() {
        super()
        document.title = 'Browse'

        this.state = {
            cinemagraphs: []
        }
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        const cinemagraphsRef = firebase
            .database()
            .ref('cinemagraphs')
            .orderByChild('timeCreated')
            .limitToFirst(50)
        cinemagraphsRef.once('value', (snapshot) => {
            const data = snapshot.val()
            if (data !== null) {
                this.setState({
                    cinemagraphs: Object.values(data).map(cinemagraph => cinemagraph)
                })
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !nextProps.user.authenticated) {
            this.props.history.push('/')
        }
    }
    render() {
        const { cinemagraphs } = this.state
        return (
            <FlexContainer>
                {cinemagraphs.map(cinemagraph => (
                    <Card key={cinemagraph.name} cinemagraph={cinemagraph} />
                ))}
            </FlexContainer>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

export default connect(mapStateToProps)(Browse)
