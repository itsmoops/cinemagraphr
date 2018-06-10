import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../actions/user-actions'
import Flex from '../shared/flex'
import Input from '../shared/input'
import Button from '../shared/button'
import Message from '../shared/message'
import Link from '../shared/link'

class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }
    constructor() {
        super()
        document.title = 'Login'
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
        const { message } = this.props.user
        return (
            <Flex>
                <Box w={[1, 3 / 4, 2 / 3, 1 / 3]} m="auto">
                    <Heading mb={20}>Login</Heading>
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
                            <Text mt={10} right>
                                No account yet? <Link to="/sign-up">Sign up</Link>
                            </Text>
                            <Link to="/forgot-password" right="true">
                                I forgot my password
                            </Link>
                            {message && <Message>{message}</Message>}
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
