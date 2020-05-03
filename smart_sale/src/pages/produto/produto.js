import React, { Component } from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Card from '../../components/card/card';
import { parseJwt } from '../../services/auth';

class Produto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      produto: {
        idOferta: "",
        titulo: "",
        foto: "",
        preco: "",
        regiao: "",
        quantDisponivel: "",
      },
      reserva: {
        quantidadeComprada: "",
        valorFinal: "",
        dataLimiteRetirada: "",
        idUsuario: "",
        idOferta: ""
      },
      ofertas: [],
    }
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      if (this.props.location.idOferta != null) {
        localStorage.removeItem("persist")
        localStorage.setItem("persist", this.props.location.idOferta)
      }
      this.getProduto(localStorage.getItem("persist"));
      this.getOfertas();
    }, 100);
  }

  componentDidMount() {
    if (this.props.location.idOferta != null) {
      localStorage.removeItem("persist")
      localStorage.setItem("persist", this.props.location.idOferta)
    }
    this.getProduto(localStorage.getItem("persist"))
    this.getOfertas();
  }

  getProduto = (id) => {
    fetch("http://localhost:5000/api/oferta/" + id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          produto: {
            idOferta: data.idOferta,
            titulo: data.titulo,
            quantDisponivel: data.quantidade,
            foto: data.foto,
            preco: data.preco,
            regiao: data.idUsuarioNavigation.idRegiaoNavigation.bairro
          }
        })
      });
  }

  adicionaDiasHj = (dias) => {
    var result = new Date();
    result.setDate(result.getDate() + dias);
    return result.toISOString().split("T")[0];
  }

  setReserva = () => {
    this.setState({
      reserva: {
        valorFinal: this.state.reserva.quantidadeComprada * this.state.produto.preco,
        dataLimiteRetirada: this.adicionaDiasHj(3),
        idUsuario: "1",
        idOferta: this.state.produto.idOferta
      }
    })
  }

  reservar = (event) => {
    event.preventDefault();

    fetch("http://localhost:5000/api/reserva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.reserva)
    })
      .then(response => response.json())
      .then(response => {
        this.props.history.push({
          pathname: "/finalreserva",
          state: {
            reserva: this.state.reserva
          }
        })
      })
      .catch(error => console.log(error))
  }

  atualizaEstado = (input) => {
    var id__ = parseJwt().Id
    this.setState({
      reserva: {
        quantidadeComprada: input.target.value,
        valorFinal: this.state.reserva.quantidadeComprada * this.state.produto.preco,
        dataLimiteRetirada: this.adicionaDiasHj(3),
        idUsuario: id__,
        idOferta: this.state.produto.idOferta
      }
    })
  }

  getOfertas = () => {
    fetch('http://localhost:5000/api/oferta')
      .then(response => response.json())
      .then(response => {
        var sales = response.slice(0, 4)
        this.setState({ ofertas: sales })
      })
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
        <div className="paginaProduto_pag">
          <div className="container">
            <section className="produto">
              <div className="esquerdo">
                <div>
                  <img src={"http://localhost:5000/" + this.state.produto.foto} alt="Imagem do Produto" className="imagem-produto" />
                </div>
              </div>
              <div className="direito">
                <div className="informacoes_produto">
                  <p className="nomeProduto">{this.state.produto.titulo}</p>
                  <p className="precoProduto">{"R$" + this.state.produto.preco}</p>
                  <b><p id="regiao">{this.state.produto.regiao}</p></b>
                </div>
                <div className="contQuantBotoes">
                  <p className="quantDisponivel">Quantidade Disponível: {this.state.produto.quantDisponivel}</p>
                  <p className="precoTotal">Preço Total: {this.state.produto.preco * this.state.reserva.quantidadeComprada}</p>
                  <form onSubmit={this.reservar}>
                    <div className="quantidade">
                      <label>Quantidade</label>
                      <input type="number" min="1" max={this.state.produto.quantDisponivel} name="quantidadeComprada" value={this.state.reserva.quantidadeComprada} onChange={this.atualizaEstado} />
                    </div>
                    <div className="botoes">
                      <button type="submit" className="botaoReservar">Reservar</button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
            <section className="outrosProdutos">
              <p className="relacionados">Outros Produtos</p>
              <div className="produtos">
                {
                  this.state.ofertas.map(
                    function (oferta) {
                      return (
                        <div>
                          <Card idOferta={oferta.idOferta} foto={oferta.foto} titulo={oferta.titulo} preco={oferta.preco} quantidade={oferta.quantidade}
                            bairro={oferta.idUsuarioNavigation.idRegiaoNavigation.bairro} />
                        </div>
                      );
                    }
                  )
                }
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default Produto;