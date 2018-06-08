import { Box, Heading, Container } from 'rebass'
import Flex from '../shared/flex'

class NotFound extends React.Component {
    componentWillMount() {
        document.title = 'Page Not Found'
    }
    render() {
        return (
            <Flex>
                <Box w={[1, 2 / 3, 1 / 2]} m="auto">
                    <Container>
                        <Heading mb={20}>404</Heading>
                        <Heading is="h3">Page not found!</Heading>
                    </Container>
                </Box>
            </Flex>
        )
    }
}

export default NotFound
