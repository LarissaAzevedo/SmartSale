import React, { Component } from 'react';
import Footer from '../../components/footer/footer';
import { parseJwt } from '../../services/auth'
import Header from '../../components/header/header';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      senha: "",
      isLoading: false
    }
    this.props = {}
  }

  atualizaEstado = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  realizarLogin = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    fetch("http://localhost:5000/api/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        senha: this.state.senha
      })
    })
      .then(response => response.json())
      .then(response => {
        localStorage.setItem("user-smartsale", response.token);
        this.setState({ isLoading: false })
        this.props.history.push("/perfil")
      })
      .catch(erro => {
        console.log("Erro: ", erro);
        this.setState({ isLoading: false })
      })
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <main>
          <div className="login_pag">
            <div className="cards_cadlog">
              <div className="imgLoginCad"></div>
              <div className="contCard_1_cadlog">
                <div className="card_1_cadlog">
                  <h2>FAÇA LOGIN</h2>
                  <div className="fomrLogin">
                    <form method="POST" onSubmit={this.realizarLogin}>
                      <div className="login_cadlog">
                        <input type="text" placeholder="E-mail" aria-label="Digite seu e-mail" name="email" onChange={this.atualizaEstado} required />
                      </div>
                      <div className="login_cadlog">
                        <input type="password" placeholder="Senha" aria-label="Digite sua senha" name="senha" onChange={this.atualizaEstado} required />
                      </div>
                      <div className="btn_cadlog">
                        <button type="submit"><b>ACESSAR</b></button>
                      </div>
                      <div className="btn_cadastrarse">
                        <Link to="/cadastrousuario">Cadastre-se</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
export default Login;