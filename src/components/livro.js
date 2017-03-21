import React, { Component } from 'react'
import CustomInput from './customInput'
import axios from 'axios';
import PubSub from 'pubsub-js';

class FormularioDeLivro extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: {} };
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                    <CustomInput id="titulo" type="text" name="titulo" label="Titulo" value={this.state.titulo} onChange={this.setTitulo} />
                    <CustomInput id="preco" type="number" name="preco" label="Preco" value={this.state.preco} onChange={this.setPreco} />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} id="autorId" name="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {
                                this.props.autores.map(autor => {
                                    return (
                                        <option key={autor.id} value={autor.id}>{autor.nome}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
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
            titulo: this.state.titulo,
            preco: this.state.preco,
            autorId: this.state.autorId
        };

        PubSub.publish('cadastro-livro-limpar-erros', '');

        axios.post('http://cdc-react.herokuapp.com/api/livros', JSON.stringify(dados), { headers: { 'Content-Type': 'application/json' } })
            .then(function (result) {

                PubSub.publish('nova-lista-livros', result.data);

                // limpando os campos
                this.setState({
                    titulo: '',
                    preco: '',
                    autorId: ''
                });

            }.bind(this))
            .catch(function (error) {
                if (error.response.status === 400)
                    PubSub.publish('cadastro-livro-error', error.response.data.errors)
                else
                    console.log(error);
            });
    }

    setTitulo(e) {
        this.setState({ titulo: e.target.value });
    }

    setPreco(e) {
        this.setState({ preco: e.target.value });
    }

    setAutorId(e) {
        this.setState({ autorId: e.target.value });
    }
}

class TabelaDeLivros extends Component {
    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preco</th>
                        <th>Autor</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.livros.map(livro => {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = { livros: [], autores: [] };
    }

    componentDidMount() {
        this._carregarLivros();
        this._carregarAutores();

        PubSub.subscribe('nova-lista-livros', function (topico, lista) {
            this.setState({ livros: lista });
        }.bind(this));
    }

    _carregarLivros() {
        axios.get('http://cdc-react.herokuapp.com/api/livros')
            .then(function (result) {
                this.setState({ livros: result.data });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

     _carregarAutores() {
        axios.get('http://cdc-react.herokuapp.com/api/autores')
            .then(function (result) {
                this.setState({ autores: result.data });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioDeLivro autores={this.state.autores} />
                    <TabelaDeLivros livros={this.state.livros} />
                </div>
            </div>
        )
    }
}