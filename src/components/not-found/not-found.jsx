import { Box, Heading, Container } from 'rebass'
import Flex from '../shared/flex'

class NotFound extends React.Component {
    constructor() {
        super()
        document.title = '404'
    }
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
    }
    render() {
        return (
            <Flex>
                <Box w={[1, 1 / 2, 1 / 3, 1 / 4]} m="auto">
                    <Container>
                        <Heading mb={20} f={40}>
                            404
                        </Heading>
                        <Heading is="h3">Page not found</Heading>
                    </Container>
                </Box>
            </Flex>
        )
    }
}

export default NotFound
