import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class CustomInput extends Component {
    
    constructor() {
        super();
        this.state = { error: '' };
    }

    render() {
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input {...this.props} />
                <span className="error">{this.state.error}</span>
            </div>
        );

        // <input id={this.props.id} type={this.props.type} name={this.props.id} value={this.props.value} onChange={this.props.onChange} />
    }

    componentDidMount() {
        PubSub.subscribe('cadastro-autor-error', function(topico, errors) {
            var erro = errors.filter(x => x.field === this.props.id)[0];
            if(erro)
                this.setState({ error: erro.defaultMessage });
        }.bind(this));

         PubSub.subscribe('cadastro-autor-limpar-erros', function(topico) {
            this.setState({ error: '' });
        }.bind(this));
    }
}