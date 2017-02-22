import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.state = {
      autores: [],
      nome: '',
      email: '',
      senha: ''
    };

    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  componentDidMount() {
    this._carregarAutores();
  }

  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">Company</a>
            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)} method="post">
                <div className="pure-control-group">
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
                </div>
                <div className="pure-control-group">
                  <label htmlFor="senha">Senha</label>
                  <input id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
                </div>
                <div className="pure-control-group">
                  <label></label>
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                </div>
              </form>
            </div>
            <div>
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.autores.map(autor => {
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
            </div>
          </div>
        </div>
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

    console.log('dados: ', dados);

    axios.post('http://cdc-react.herokuapp.com/api/autores', JSON.stringify(dados), { headers: { 'Content-Type': 'application/json' } })
      .then(function (result) {
        this.setState({
          autores: result.data.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
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

  setNome(e) {
    this.setState({ nome: e.target.value });
  }

  setEmail(e) {
    this.setState({ email: e.target.value });
  }

  setSenha(e) {
    this.setState({ senha: e.target.value });
  }

  _carregarAutores() {
    axios.get('http://cdc-react.herokuapp.com/api/autores')
      .then(function (result) {
        this.setState({ autores: result.data.sort((a, b) => {
            if (a.id > b.id) {
              return -1;
            }
            if (a.id < b.id) {
              return 1;
            }
            // a must be equal to b
            return 0;
          }) });
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

}

export default App;
