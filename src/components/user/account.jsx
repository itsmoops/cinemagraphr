import { Box, Heading, Container, Text } from 'rebass'
import Flex from '../shared/flex'
import Link from '../shared/link'

class Account extends React.Component {
    componentWillMount() {
        document.title = 'Account'
    }
    render() {
        return (
            <Flex>
                <Box w={[1, 3 / 4, 2 / 3, 1 / 2]} m="auto">
                    <Heading mb={20}>Account Settings</Heading>
                    <Container>
                        <Text>
							But I must explain to you how all this mistaken idea of denouncing
							pleasure and praising pain was born and I will give you a complete
							account of the system, and expound the actual teachings of the great
							explorer of the truth, the master-builder of human happiness. No one
							rejects, dislikes, or avoids pleasure itself, because it is pleasure,
							but because those who do not know how to pursue pleasure rationally
							encounter consequences that are extremely painful. Nor again is there
							anyone who loves or pursues or desires to obtain pain of itself, because
							it is pain, but because occasionally circumstances occur in which toil
							and pain can procure him some great pleasure. To take a trivial example,
							which of us ever undertakes laborious physical exercise, except to
							obtain some advantage from it? But who has any right to find fault with
							a man who chooses to enjoy a pleasure that has no annoying consequences,
							or one who avoids a pain that produces no resultant pleasure?
                        </Text>
                        <Link to="/update-password" right>
							Update Password
                        </Link>
                    </Container>
                </Box>
            </Flex>
        )
    }
}

export default Account
