import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import ReactTooltip from 'react-tooltip'
import { Text } from 'rebass'
import styled, { css } from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_heart as heart } from 'react-icons-kit/linea/basic_heart'
import { arrows_circle_up as upvote } from 'react-icons-kit/linea/arrows_circle_up'
import { arrows_circle_down as downvote } from 'react-icons-kit/linea/arrows_circle_down'
import { music_note_multiple as musicNote } from 'react-icons-kit/linea/music_note_multiple'

const Container = styled.div`
    cursor: pointer;
    position: absolute;
    bottom: 20;
    right: 20;
    display: ${props => (props.hide === 'true' ? 'none' : 'flex')};
    z-index: 2;
`

const StyledIcon = styled(Icon)`
    cursor: pointer;
    margin: 0 5 0 5;
    &:hover > svg {
        position: relative;
    }

    ${props => {
        if (props.upvoted === 'true') {
            return css`
                color: ${colors.upvoted};
            `
        } else if (props.downvoted === 'true') {
            return css`
                color: ${colors.downvoted};
            `
        } else if (props.favorited === 'true') {
            return css`
                color: ${colors.favorited};
            `
        } else {
            return css`
                color: ${colors.font1};
            `
        }
    }};
`

class VoteControls extends React.PureComponent {
    constructor(props) {
        super(props)

        const { cinemagraph, user } = this.props
        const { userFavorites, userUpvotes, userDownvotes, upvotes, downvotes } = cinemagraph
        if (Object.keys(cinemagraph).length && user.uid) {
            this.state = {
                favorited: Object.keys(userFavorites).includes(user.uid),
                upvoted: Object.keys(userUpvotes).includes(user.uid),
                downvoted: Object.keys(userDownvotes).includes(user.uid),
                upvotes,
                downvotes,
                owner: user.uid === cinemagraph.user.uid
            }
        } else {
            this.state = {
                favorited: false,
                upvoted: false,
                downvoted: false,
                upvotes,
                downvotes,
                owner: false
            }
        }
    }
    componentDidUpdate(prevProps) {
        const { cinemagraph, user } = this.props
        const { userFavorites, userUpvotes, userDownvotes, upvotes, downvotes } = cinemagraph
        if (
            Object.keys(cinemagraph).length &&
            (cinemagraph !== prevProps.cinemagraph || this.props.user !== prevProps.user)
        ) {
            this.setState({
                favorited: Object.keys(userFavorites).includes(user.uid),
                upvoted: Object.keys(userUpvotes).includes(user.uid),
                downvoted: Object.keys(userDownvotes).includes(user.uid),
                upvotes,
                downvotes,
                owner: user.uid === cinemagraph.user.uid
            })
        }
    }
    isAuthenticated = () => {
        const { user } = this.props
        if (user.authenticated) {
            return true
        }
        this.props.history.push('/login')
        return false
    }
    handleFavorite = async () => {
        if (this.isAuthenticated()) {
            const { cinemagraph, user } = this.props
            const db = firebase.firestore()
            const cinemagraphsDocRef = await db.collection('cinemagraphs').doc(cinemagraph.postId)
            const cinemagraphDoc = await cinemagraphsDocRef.get()

            if (cinemagraphDoc.exists) {
                const { userFavorites } = cinemagraphDoc.data()

                if (Object.keys(userFavorites).includes(user.uid)) {
                    delete userFavorites[user.uid]

                    this.setState({ favorited: false }, () => {
                        cinemagraphsDocRef.update({
                            userFavorites
                        })
                    })
                } else {
                    this.setState({ favorited: true }, () => {
                        userFavorites[user.uid] = true

                        cinemagraphsDocRef.update({
                            userFavorites
                        })
                    })
                }
            }
        }
    }
    handleUpvote = async () => {
        if (this.isAuthenticated()) {
            const { cinemagraph, user } = this.props
            const db = firebase.firestore()
            const cinemagraphsDocRef = await db.collection('cinemagraphs').doc(cinemagraph.postId)
            const cinemagraphDoc = await cinemagraphsDocRef.get()

            if (this.state.downvoted) {
                await this.handleDownvote()
            }

            return new Promise((resolve, reject) => {
                try {
                    if (cinemagraphDoc.exists) {
                        const { userUpvotes } = cinemagraphDoc.data()

                        if (Object.keys(userUpvotes).includes(user.uid)) {
                            delete userUpvotes[user.uid]

                            this.setState(
                                prevState => ({
                                    upvoted: false,
                                    upvotes: prevState.upvotes - 1
                                }),
                                () => {
                                    const ratio =
                                        this.state.upvotes /
                                        (this.state.upvotes + this.state.downvotes)
                                    resolve(
                                        cinemagraphsDocRef.update({
                                            upvotes: this.state.upvotes,
                                            ratio,
                                            userUpvotes
                                        })
                                    )
                                }
                            )
                        } else {
                            this.setState(
                                prevState => ({
                                    upvoted: true,
                                    upvotes: prevState.upvotes + 1
                                }),
                                () => {
                                    const ratio =
                                        this.state.upvotes /
                                        (this.state.upvotes + this.state.downvotes)

                                    userUpvotes[user.uid] = true

                                    resolve(
                                        cinemagraphsDocRef.update({
                                            upvotes: this.state.upvotes,
                                            ratio,
                                            userUpvotes
                                        })
                                    )
                                }
                            )
                        }
                    }
                } catch (err) {
                    reject(err)
                }
            })
        }
    }
    handleDownvote = async () => {
        if (this.isAuthenticated()) {
            const { cinemagraph, user } = this.props
            const db = firebase.firestore()
            const cinemagraphsDocRef = await db.collection('cinemagraphs').doc(cinemagraph.postId)
            const cinemagraphDoc = await cinemagraphsDocRef.get()

            if (this.state.upvoted) {
                await this.handleUpvote()
            }

            return new Promise((resolve, reject) => {
                try {
                    if (cinemagraphDoc.exists) {
                        const { userDownvotes } = cinemagraphDoc.data()

                        if (Object.keys(userDownvotes).includes(user.uid)) {
                            delete userDownvotes[user.uid]

                            this.setState(
                                prevState => ({
                                    downvoted: false,
                                    downvotes: prevState.downvotes - 1
                                }),
                                () => {
                                    const ratio =
                                        this.state.upvotes /
                                        (this.state.upvotes + this.state.downvotes)
                                    resolve(
                                        cinemagraphsDocRef.update({
                                            downvotes: this.state.downvotes,
                                            ratio,
                                            userDownvotes
                                        })
                                    )
                                }
                            )
                        } else {
                            this.setState(
                                prevState => ({
                                    downvoted: true,
                                    downvotes: prevState.downvotes + 1
                                }),
                                () => {
                                    const ratio =
                                        this.state.upvotes /
                                        (this.state.upvotes + this.state.downvotes)

                                    userDownvotes[user.uid] = true

                                    resolve(
                                        cinemagraphsDocRef.update({
                                            downvotes: this.state.downvotes,
                                            ratio,
                                            userDownvotes
                                        })
                                    )
                                }
                            )
                        }
                    }
                } catch (err) {
                    reject(err)
                }
            })
        }
    }
    render() {
        const { iconSize, hide, displayVotes, hasAudio } = this.props
        const { owner } = this.state
        return (
            <Container hide={hide && hide.toString()}>
                {displayVotes &&
                    hasAudio && (
                        <div>
                            <StyledIcon
                                data-tip={'has audio'}
                                data-for="audio"
                                size={iconSize}
                                icon={musicNote}
                            />
                        </div>
                    )}
                {!owner && (
                    <div onClick={this.handleFavorite}>
                        <StyledIcon
                            data-tip={'favorite'}
                            data-for="favorite"
                            size={iconSize}
                            icon={heart}
                            favorited={this.state.favorited.toString()}
                        />
                    </div>
                )}
                <div onClick={this.handleUpvote}>
                    <StyledIcon
                        data-tip={'upvote'}
                        data-for="upvote"
                        size={iconSize}
                        icon={upvote}
                        upvoted={this.state.upvoted.toString()}
                    />
                    {displayVotes && <Text>{this.state.upvotes}</Text>}
                </div>
                <div onClick={this.handleDownvote}>
                    <StyledIcon
                        data-tip={'downvote'}
                        data-for="downvote"
                        size={iconSize}
                        icon={downvote}
                        downvoted={this.state.downvoted.toString()}
                    />
                    {displayVotes && <Text>{this.state.downvotes}</Text>}
                </div>
                <ReactTooltip id="audio" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="favorite" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="upvote" place="top" effect="solid" delayShow={1000} />
                <ReactTooltip id="downvote" place="top" effect="solid" delayShow={1000} />
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(withRouter(VoteControls))
