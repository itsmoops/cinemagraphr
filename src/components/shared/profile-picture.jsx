import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { userCircle } from 'react-icons-kit/fa/userCircle'

const StyledSpan = styled.span`
	background-color: #f2f2f2;
	box-shadow: 0 0 0 2px #dbdbdb;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	vertical-align: middle;
	${(props) => {
        if (props.tiny) {
            return css`
				width: 28px;
				height: 28px;
			`
        } else if (props.small) {
            return css`
				width: 50px;
				height: 50px;
			`
        } else if (props.medium) {
            return css`
				width: 100px;
				height: 100px;
			`
        } else if (props.large) {
            return css`
				width: 150px;
				height: 150px;
			`
        } else if (props.huge) {
            return css`
				width: 200px;
				height: 200px;
			`
        }
    }};
`

const ProfilePicture = (props) => {
    let width = 50
    let height = 50
    if (props.tiny) {
        width = 28
        height = 28
    } else if (props.small) {
        width = 50
        height = 50
    } else if (props.medium) {
        width = 100
        height = 100
    } else if (props.large) {
        width = 150
        height = 150
    } else if (props.huge) {
        width = 200
        height = 200
    }
    let icon
    if (props.user.photoURL) {
        icon = (
            <img
                width={width}
                height={height}
                alt={props.user.displayName || props.user.email}
                src={props.user.photoURL} />
        )
    } else {
        icon = <Icon icon={userCircle} size={width} />
    }
    return (
        <StyledSpan
            tiny={props.tiny}
            small={props.small}
            medium={props.medium}
            large={props.large}
            huge={props.huge}>
            {icon}
        </StyledSpan>
    )
}

ProfilePicture.defaultProps = {
    tiny: false,
    small: false,
    medium: false,
    large: false,
    huge: false
}

ProfilePicture.propTypes = {
    tiny: PropTypes.bool,
    small: PropTypes.bool,
    medium: PropTypes.bool,
    large: PropTypes.bool,
    huge: PropTypes.bool
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ProfilePicture)
