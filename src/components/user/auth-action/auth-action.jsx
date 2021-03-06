import { withRouter } from 'react-router'
import { Box, Heading, Container, Text } from 'rebass'
import Flex from '../../shared/flex'
import ResetPassword from './reset-password'
import VerifyEmail from './verify-email'

class AuthAction extends React.PureComponent {
    state = {
        result: {}
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)

        const query = this.props.location.search.substring(1)
        if (query === '') {
            this.props.history.push('/')
        } else {
            const result = {}
            query.split('&').forEach(part => {
                const item = part.split('=')
                result[item[0]] = decodeURIComponent(item[1])
            })
            this.setState({
                result
            })
        }
    }
    render() {
        let Action
        switch (this.state.result.mode) {
            case 'resetPassword':
                Action = ResetPassword
                break
            case 'verifyEmail':
                Action = VerifyEmail
                break
            default:
                Action = ResetPassword
                break
        }
        return (
            <Flex>
                <Box w={[1, 1 / 2, 1 / 3, 1 / 4]} m="auto">
                    <Action params={this.state.result} />
                </Box>
            </Flex>
        )
    }
}

export default withRouter(AuthAction)
