import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { slide as Menu } from 'react-burger-menu'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'

const styles = {
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        right: '36px',
        top: '36px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px',
        right: '20px',
        top: '10px'
    },
    bmCross: {
        background: 'white',
        height: '35px'
    },
    bmMenu: {
        background: '#111111',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        textAlign: 'center',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.8em',
        color: '#b8b7ad'
    },
    bmItem: {
        fontSize: '2em',
        display: 'block',
        textDecoration: 'none',
        color: 'white',
        textTransform: 'uppercase',
        marginBottom: '50px',
        cursor: 'pointer'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}
class NavBar extends React.Component {
    state = {
        menuOpen: false
    }
    componentDidMount() {
        this.props.userActions.checkForUser()
    }
    handleClick = to => {
        this.props.history.push(to)
        this.setState({
            menuOpen: false
        })
    }
    render() {
        return (
            <Menu styles={styles} right isOpen={this.state.menuOpen}>
                <a id="home" className="menu-item" onClick={() => this.handleClick('/')}>
                    Home
                </a>
                <a id="create" className="menu-item" onClick={() => this.handleClick('/create')}>
                    Create
                </a>
                <a id="browse" className="menu-item" onClick={() => this.handleClick('/browse')}>
                    Browse
                </a>
                <a id="contact" className="menu-item" onClick={() => this.handleClick('/login')}>
                    Login
                </a>
                <a id="contact" className="menu-item" onClick={() => this.handleClick('/sign-up')}>
                    Sign Up
                </a>
            </Menu>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(NavBar))
