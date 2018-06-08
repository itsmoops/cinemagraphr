import Cinemagraph from '../cinemagraph/cinemagraph'

class HomePage extends React.Component {
    constructor() {
        super()
        document.title = 'Home'
    }
    render() {
        return <Cinemagraph />
    }
}

export default HomePage
