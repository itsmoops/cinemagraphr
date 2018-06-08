import Cinemagraph from '../cinemagraph/cinemagraph'

class HomePage extends React.Component {
    componentWillMount() {
        document.title = 'Home'
    }
    render() {
        return <Cinemagraph />
    }
}

export default HomePage
