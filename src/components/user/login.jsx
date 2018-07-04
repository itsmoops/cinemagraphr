import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import styled from 'styled-components'
import * as userActions from '../../actions/user-actions'
import Flex from '../shared/flex'
import Input from '../shared/input'
import Button from '../shared/button'
import Message from '../shared/message'
import Link from '../shared/link'

const StyledContainer = styled(Container)`
    text-align: center;
`
class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }
    constructor() {
        super()
        document.title = 'login'
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
    }
    componentWillUnmount() {
        this.props.actions.sanitizeUserState()
        this.props.actions.sanitizeUserErrorState()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.user.authenticated) {
            this.props.history.push('/')
        }
    }
    handleInputChange = e => {
        const name = e.target.name
        const value = e.target.value
        this.setState({ [name]: value })
    }
    onHandleSubmit = async e => {
        e.preventDefault()
        await this.props.actions.userLogin(this.state.email, this.state.password)
        if (this.props.user.authenticated) {
            this.props.history.push('/')
        }
    }
    render() {
        const { errorMessage } = this.props.user
        return (
            <Flex>
                <Box w={[1, 3 / 4, 2 / 3, 1 / 3]} m="auto">
                    <Heading mb={20} f={40}>
                        Login
                    </Heading>
                    <Container>
                        <form onSubmit={this.onHandleSubmit}>
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                onChange={this.handleInputChange}
                                required
                                autoComplete="email"
                            />
                            <Input
                                placeholder="Password"
                                type="password"
                                name="password"
                                autoComplete="password"
                                onChange={this.handleInputChange}
                                required
                            />
                            <Button>Login</Button>
                            {errorMessage && <Message>{errorMessage}</Message>}
                            <StyledContainer mt={25}>
                                <Text mt={10} mb={20}>
                                    No account yet? <Link to="/sign-up">Sign up</Link>
                                </Text>
                                <Link to="/forgot-password">I forgot my password</Link>
                            </StyledContainer>
                        </form>
                    </Container>
                </Box>
            </Flex>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
