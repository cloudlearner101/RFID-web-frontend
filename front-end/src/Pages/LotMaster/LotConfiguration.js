import React from 'react';
import AddLotConfiguration from './AddLotConfiguration';
import LotConfigurationList from './LotConfigurationList';


class LotConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PageStatus: true,
            ActionMode: true,
            confiuredLotConfigData: {}
        };

        this._mounted = false;
    };

    handlePages = (val, mode, data) => {
        this.setState({ PageStatus: val, ActionMode: mode, confiuredLotConfigData: data });
    };


    componentDidMount() {
        this._mounted = true;
    };
    componentWillUnmount() {
        this._mounted = false;
    };

    render() {

        let flag = { view: true, create: true, edit: true }

        return (
            <div>
                {
                    flag.view ?
                        this.state.PageStatus ? <LotConfigurationList handlePages={this.handlePages} createFlag={flag.create} editFlag={flag.edit} /> :
                            <AddLotConfiguration handlePages={this.handlePages} actionMode={this.state.ActionMode} confiuredLotConfigData={this.state.confiuredLotConfigData} />
                        : null
                }
            </div>
        );
    }
}



export default LotConfiguration;