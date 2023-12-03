import React from 'react';
import AddPCConfiguration from './AddPCConfiguration';
import PcConfigurationList from './PcConfigurationList';


class PcConfiguration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PageStatus: true,
            ActionMode: true,
            confiuredPcConfigDtata: {}
        };

        this._mounted = false;
    };

    handlePages = (val, mode, data) => {
        this.setState({ PageStatus: val, ActionMode: mode, confiuredPcConfigDtata: data });
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
                        this.state.PageStatus ? <PcConfigurationList handlePages={this.handlePages} createFlag={flag.create} editFlag={flag.edit} /> :
                            <AddPCConfiguration handlePages={this.handlePages} actionMode={this.state.ActionMode} confiuredPcConfigDtata={this.state.confiuredPcConfigDtata} />
                        : null
                }
            </div>
        );
    }
}



export default PcConfiguration;