import { Container, Heading, Text } from 'rebass'

const ThankYou = props => (
    <Container>
        <Heading mb={20}>Confirm Your Email</Heading>
        <Text>
            All signed up. We just sent a confirmation email to {props.user.email}. Please follow
            the instructions in the email to verify your account.
        </Text>
    </Container>
)

export default ThankYou
