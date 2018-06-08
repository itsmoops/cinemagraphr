const common = {
    buffer: '10px',
    bufferTop: '10px',
    bufferBottom: '10px',
    borderRadius: '6px',
    navBarHeight: '60px',
    screen: {
        large: '@media screen and (min-width: 64em)',
        medium: '@media screen and (min-width: 52em)',
        small: '@media screen and (min-width: 40em)'
    },
    disabled: `cursor: initial;
                filter: alpha(opacity=65); opacity: 0.65;
                outline: none;`,
    alignLeft: 'text-align: left;',
    alignCenter: 'text-align: center;',
    alignRight: 'text-align: right;'
}

export default common
