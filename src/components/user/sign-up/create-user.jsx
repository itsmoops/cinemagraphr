import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Box, Heading, Container, Text } from 'rebass'
import * as userActions from '../../../actions/user-actions'
import Flex from '../../shared/flex'
import Input from '../../shared/input'
import Link from '../../shared/link'
import Button from '../../shared/button'
import Message from '../../shared/message'

class CreateUser extends React.Component {
    state = {
        email: '',
        password: ''
    }
    handleInputChange = e => {
        const name = e.target.name
        const value = e.target.value
        this.setState({ [name]: value })
    }
    onHandleSubmit = async e => {
        e.preventDefault()
        await this.props.actions.userSignUp(
            this.state.username,
            this.state.email,
            this.state.password
        )
        await this.props.actions.sendEmailVerification()
        if (!this.props.user.errorMessage) {
            this.props.handleStateChange('thankYou')
        }
    }
    render() {
        const { errorMessage } = this.props.user
        return (
            <Container>
                <form onSubmit={this.onHandleSubmit}>
                    <Heading mb={20} f={40}>
                        Sign up
                    </Heading>
                    <Input
                        placeholder="Username"
                        type="text"
                        name="username"
                        autoComplete="off"
                        onChange={this.handleInputChange}
                        required
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        onChange={this.handleInputChange}
                        required
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        autoComplete="password"
                        onChange={this.handleInputChange}
                        required
                        toggleHiddenText
                    />
                    <Button>Sign Up</Button>
                    {errorMessage && <Message>{errorMessage}</Message>}
                    <Text mt={25} center>
                        Already signed up? <Link to="/login">Login</Link>
                    </Text>
                </form>
            </Container>
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
)(CreateUser)
