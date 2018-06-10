import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { pushRotate as Menu } from 'react-burger-menu'
import styled from 'styled-components'
import * as globalActions from '../../actions/global-actions'
import * as userActions from '../../actions/user-actions'

const Footer = styled.div`
    position: absolute;
    bottom: 15px;
    margin-bottom: unset !important;
    font-size: 0.8em !important;
    text-align: center;
`

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
        padding: '4.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        height: 'unset',
        textAlign: 'right',
        // display: 'grid',
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
        background: 'rgba(0, 0, 0, 0.5)'
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
    handleLogout = () => {
        this.setState({
            menuOpen: false
        })
        this.props.userActions.userLogout()
        this.props.history.push('/')
    }

    render() {
        const { user } = this.props
        const userNav = (
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
                <a id="feed" className="menu-item" onClick={() => this.handleClick('/feed')}>
                    My Feed
                </a>
                <a id="logout" className="menu-item" onClick={this.handleLogout}>
                    Logout
                </a>
                <Footer id="nav-footer">
                    <a onClick={() => this.handleClick('/profile')}>{user.displayName}</a>
                </Footer>
            </Menu>
        )
        const guestNav = (
            <Menu styles={styles} right isOpen={this.state.menuOpen}>
                <a id="home" className="menu-item" onClick={() => this.handleClick('/')}>
                    Home
                </a>
                <a id="create" className="menu-item" onClick={() => this.handleClick('/login')}>
                    Create
                </a>
                <a id="browse" className="menu-item" onClick={() => this.handleClick('/browse')}>
                    Browse
                </a>
                <a id="login" className="menu-item" onClick={() => this.handleClick('/login')}>
                    Login
                </a>
                <a id="sign-up" className="menu-item" onClick={() => this.handleClick('/sign-up')}>
                    Sign Up
                </a>
            </Menu>
        )
        return <div>{user.authenticated ? userNav : guestNav}</div>
    }
}

function mapStateToProps(state) {
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
