import styled from 'styled-components'
import { arrows_down as arrowsDown } from 'react-icons-kit/linea/arrows_down'

const Div = styled.div`
    position: fixed;
    top: 36;
    left: ${props => props.left || '36'};
    z-index: 1;
    padding: 10px;
    width: ${props => props.width || '65px'};
    height: 20px;
    overflow: hidden;
    background: #373a46;
    border-top: #373a46 1px solid;
    -webkit-box-shadow: inset 0 2px 4px rgba(107, 105, 105, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 0px 8px 3px -9px #000000;
    -webkit-box-shadow: 0px 8px 3px -9px #000000;
    box-shadow: 0px 8px 3px -9px #000000;
`
const Select = styled.select`
    background: transparent;
    width: ${props => props.width || '60px'};
    padding: 2px;
    font-family: Helvetica;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    text-transform: lowercase;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    border: 0;
    border-radius: 0;
    margin-top: -10px;
    height: 40px;
    -webkit-appearance: none;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    & > option {
        background-color: black;
    }
`

const StyledIcon = styled(Icon)`
    float: right;
    margin-top: -28px;
    cursor: pointer;
    overflow: scroll;
    color: ${colors.font1};
    &:hover > svg {
        position: relative;
    }
`

class Sort extends React.PureComponent {
    state = {
        sortOpen: false
    }
    render() {
        return (
            <Div width={this.props.width} left={this.props.left}>
                <Select
                    name={this.props.name}
                    width={this.props.width}
                    defaultValue={this.props.defaultValue}
                    onClick={() =>
                        this.setState(prevState => ({
                            sortOpen: !prevState.sortOpen
                        }))
                    }
                    onChange={e => {
                        this.setState(prevState => ({
                            sortOpen: false
                        }))
                        this.props.onChange(e)
                    }}>
                    {this.props.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </Select>
                <StyledIcon icon={arrowsDown} size={20} />
            </Div>
        )
    }
}

export default Sort
