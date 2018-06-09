import Cinemagraph from '../cinemagraph/cinemagraph'

class HomePage extends React.Component {
    constructor() {
        super()
        document.title = 'cinemagraphr.io'
    }
    render() {
        return <Cinemagraph />
    }
}

export default HomePage
