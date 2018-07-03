import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/firestore'
import ReactTooltip from 'react-tooltip'
import { Text } from 'rebass'
import styled, { css } from 'styled-components'
import { Icon } from 'react-icons-kit'
import { basic_heart as heart } from 'react-icons-kit/linea/basic_heart'
import { arrows_circle_up as upvote } from 'react-icons-kit/linea/arrows_circle_up'
import { arrows_circle_down as downvote } from 'react-icons-kit/linea/arrows_circle_down'
import { cleanCinemagraphData } from '../../utilities/utilities.js'

const Container = styled.div`
    cursor: pointer;
    display: flex;
    position: absolute;
    bottom: 20;
    right: 20;
    display: none;
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
        if (user.uid) {
            this.state = {
                favorited: cinemagraph.userFavorites.includes(user.uid),
                upvoted: cinemagraph.userUpvotes.includes(user.uid),
                upvotes: cinemagraph.upvotes,
                downvoted: cinemagraph.userDownvotes.includes(user.uid),
                downvotes: cinemagraph.downvotes
            }
        } else {
            this.state = {
                favorited: false,
                upvoted: false,
                upvotes: cinemagraph.upvotes,
                downvoted: false,
                downvotes: cinemagraph.downvotes
            }
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            const { cinemagraph, user } = this.props

            this.setState({
                favorited: cinemagraph.userFavorites.includes(user.uid),
                upvoted: cinemagraph.userUpvotes.includes(user.uid),
                downvoted: cinemagraph.userDownvotes.includes(user.uid)
            })
        }
    }
    handleFavorite = async () => {
        const { cinemagraph, user } = this.props
        const db = firebase.firestore()
        const cinemagraphsDocRef = await db.collection('cinemagraphs').doc(cinemagraph.postId)
        const usersDocRef = await db.collection('users').doc(user.uid)
        const cinemagraphDoc = await cinemagraphsDocRef.get()
        const userDoc = await usersDocRef.get()

        if (cinemagraphDoc.exists && userDoc.exists) {
            const { userFavorites } = cinemagraphDoc.data()
            const { favorites } = userDoc.data()

            if (userFavorites.includes(user.uid)) {
                const idx = userFavorites.indexOf(user.uid)
                userFavorites.splice(idx, 1)
                this.setState({ favorited: false }, () => {
                    cinemagraphsDocRef.update({
                        userFavorites
                    })

                    const filteredFavorites = Object.keys(favorites)
                        .filter(key => key !== cinemagraph.postId)
                        .reduce((acc, key) => {
                            acc[key] = favorites[key]
                            return acc
                        }, {})

                    usersDocRef.update({
                        favorites: filteredFavorites
                    })
                })
            } else {
                this.setState({ favorited: true }, () => {
                    userFavorites.push(user.uid)
                    cinemagraphsDocRef.update({
                        userFavorites
                    })

                    favorites[cinemagraph.postId] = cleanCinemagraphData(cinemagraph)

                    usersDocRef.set({ favorites }, { merge: true })
                })
            }
        }
    }
    handleUpvote = async () => {
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

                    if (userUpvotes.includes(user.uid)) {
                        const idx = userUpvotes.indexOf(user.uid)
                        userUpvotes.splice(idx, 1)
                        this.setState(
                            prevState => ({
                                upvoted: false,
                                upvotes: prevState.upvotes - 1
                            }),
                            () => {
                                const ratio =
                                    this.state.upvotes / (this.state.upvotes + this.state.downvotes)
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
                                    this.state.upvotes / (this.state.upvotes + this.state.downvotes)
                                userUpvotes.push(user.uid)
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
    handleDownvote = async () => {
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

                    if (userDownvotes.includes(user.uid)) {
                        const idx = userDownvotes.indexOf(user.uid)
                        userDownvotes.splice(idx, 1)
                        this.setState(
                            prevState => ({
                                downvoted: false,
                                downvotes: prevState.downvotes - 1
                            }),
                            () => {
                                const ratio =
                                    this.state.upvotes / (this.state.upvotes + this.state.downvotes)
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
                                    this.state.upvotes / (this.state.upvotes + this.state.downvotes)
                                userDownvotes.push(user.uid)
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
    render() {
        const { iconSize } = this.props
        return (
            <Container>
                <StyledIcon
                    data-tip={'Favorite'}
                    data-for="favorite"
                    onClick={this.handleFavorite}
                    size={iconSize}
                    icon={heart}
                    favorited={this.state.favorited.toString()}
                />
                <StyledIcon
                    data-tip={'Upvote'}
                    data-for="upvote"
                    onClick={this.handleUpvote}
                    size={iconSize}
                    icon={upvote}
                    upvoted={this.state.upvoted.toString()}
                />
                <Text>{this.state.upvotes}</Text>
                <StyledIcon
                    data-tip={'Downvote'}
                    data-for="downvote"
                    onClick={this.handleDownvote}
                    size={iconSize}
                    icon={downvote}
                    downvoted={this.state.downvoted.toString()}
                />
                <Text>{this.state.downvotes}</Text>
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

export default connect(mapStateToProps)(VoteControls)
