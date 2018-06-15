import { connect } from 'react-redux'
import { Box, Text } from 'rebass'
import Flex from '../shared/flex'

class Feed extends React.Component {
    constructor() {
        super()
        document.title = 'Feed'
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user && !nextProps.user.authenticated) {
            this.props.history.push('/')
        }
    }
    render() {
        return (
            <Flex>
                <Box w={[1, 3 / 4, 2 / 3, 1 / 2]} m="auto">
                    <Text align="center">Feed</Text>
                </Box>
            </Flex>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

export default connect(mapStateToProps)(Feed)
