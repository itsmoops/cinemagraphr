import Upload from './upload'

class Create extends React.PureComponent {
    componentDidMount() {
        ReactGA.pageview(window.location.pathname)
    }
    render() {
        return <Upload />
    }
}

export default Create
