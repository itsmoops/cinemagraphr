import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'
import { isSmallDevice } from '../../utilities/utilities'
import NavLarge from './nav-large/nav-large'
import NavSmall from './nav-small/nav-small'

class NavBar extends React.Component {
	componentDidMount() {
		this.props.globalActions.checkDeviceSize()
		this.props.userActions.checkForUser()
		window.addEventListener('resize', this.updateWidth)
	}
	updateWidth = () => {
		this.props.globalActions.checkDeviceSize()
	}
	render() {
		const activeRoute = this.props.location.pathname.replace('/', '') || ''
		return this.props.global.isSmallDevice ? (
			<NavSmall active={activeRoute} />
		) : (
			<NavLarge active={activeRoute} />
		)
	}
}

function mapStateToProps(state, ownProps) {
	return {
		global: state.global,
		user: state.user
	}
}

function mapDispatchToProps(dispatch) {
	return {
		globalActions: bindActionCreators(globalActions, dispatch),
		userActions: bindActionCreators(userActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
