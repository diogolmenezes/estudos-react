import React, { Component } from 'react'
import CustomInput from './customInput'
import axios from 'axios';
import PubSub from 'pubsub-js';

class FormularioDeAutor extends Component {
    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                    <CustomInput id="nome" type="text" name="nome" label="Nome" value={this.state.nome} onChange={this.setNome} />
                    <CustomInput id="email" type="email" name="email" label="Email" value={this.state.email} onChange={this.setEmail} />
                    <CustomInput id="senha" type="password" name="senha" label="Senha" value={this.state.senha} onChange={this.setSenha} />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        );
    }

    enviaForm(e) {
        e.preventDefault();

        var dados = {
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha
        };

        PubSub.publish('cadastro-autor-limpar-erros', '');

        axios.post('http://cdc-react.herokuapp.com/api/autores', JSON.stringify(dados), { headers: { 'Content-Type': 'application/json' } })
            .then(function (result) {
                
                PubSub.publish('nova-lista-autores', result.data);

                // limpando os campos
                this.setState({
                    nome: '',
                    email: '',
                    senha: ''
                });

            }.bind(this))
            .catch(function (error) {
                if(error.response.status === 400)
                    PubSub.publish('cadastro-autor-error', error.response.data.errors)
                else 
                    console.log(error);
            });
    }

    setNome(e) {
        this.setState({ nome: e.target.value });
    }

    setEmail(e) {
        this.setState({ email: e.target.value });
    }

    setSenha(e) {
        this.setState({ senha: e.target.value });
    }
}

class TabelaDeAutores extends Component {
    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.autores.map(autor => {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default class AutorBox extends Component {
    constructor() {
        super();
        this.state = { autores: [] };
    }

    componentDidMount() {
        this._carregarAutores();

        PubSub.subscribe('nova-lista-autores', function (topico, lista) {
            this.setState({ autores: lista });
        }.bind(this));
    }

    _carregarAutores() {
        axios.get('http://cdc-react.herokuapp.com/api/autores')
            .then(function (result) {
                this.setState({
                    autores: result.data.sort((a, b) => {                        
                        if (a.id > b.id) {
                            return -1;
                        }
                        if (a.id < b.id) {
                            return 1;
                        }
                        // a must be equal to b
                        return 0;
                    })
                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <FormularioDeAutor />
                <TabelaDeAutores autores={this.state.autores} />
            </div>
        )
    }
}