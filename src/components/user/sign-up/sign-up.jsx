import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import Flex from '../../shared/flex'
import CreateUser from './create-user'
import ThankYou from './thank-you'

class SignUp extends React.Component {
    state = {
        activeState: 'createUser'
    }
    constructor() {
        super()
        document.title = 'sign up'
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
    }
    componentWillUnmount() {
        this.props.actions.sanitizeUserState()
        this.props.actions.sanitizeUserErrorState()
    }
    componentWillReceiveProps(nextProps) {
        // if (nextProps.user.authenticated) {
        // 	this.props.history.push('/')
        // }
    }
    handleStateChange = state => {
        this.setState({
            activeState: state
        })
    }
    render() {
        let ActiveState
        switch (this.state.activeState) {
            case 'createUser':
                ActiveState = CreateUser
                break
            case 'thankYou':
                ActiveState = ThankYou
                break
            default:
                ActiveState = CreateUser
                break
        }
        return (
            <Flex>
                <Box w={[1, 1 / 2, 1 / 3, 1 / 4]} m="auto">
                    <ActiveState
                        handleStateChange={this.handleStateChange}
                        user={this.props.user}
                    />
                </Box>
            </Flex>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp)
