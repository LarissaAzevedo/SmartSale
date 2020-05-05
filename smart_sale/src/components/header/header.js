import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/Agrupar 110.png';
import Avatar from '../../assets/img/avatar.png';
import LogoutIcon from '../../assets/img/logout.svg'
import icon_search from '../../assets/img/search_icon.png';
import { usuarioAutenticado } from '../../services/auth';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtro: "",
      lista: [],
      btnmenu: false,
      btnclose: false,
      estilo: "abc",
      isMenuOpen: false,
    }
  }

  toggle = () => {
    this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  logout = () => {
    localStorage.removeItem("user-smartsale");
    this.props.history.push("/");
  };

  filtrar = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/Oferta/FiltrarPorNome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ filtro: this.state.filtro })
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ lista: response });

        this.props.history.push({
          pathname: "/ofertas",
          state: {
            listaFiltrada: this.state.lista
          }
        });
        window.location.reload();
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  atualizaEstado = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {

    return (
      <header>
        <div className="contHeader">
          <div className="container">
            <div className="ca">
              <div className="separador-header">
                <div className="logo">
                  <Link to="/">
                    <img src={Logo} title="Home Smart Sale" alt="logo smart sale" />
                  </Link>
                </div>

                <form onSubmit={this.filtrar}>


                  {/* <input
                    type="search"
                    placeholder="Buscar produtos, marcas e muito mais ..."
                    aria-label="Faça uma busca"
                    name="filtro"
                    onChange={this.atualizaEstado}
                    id="search-bar"
                  /> */}

                  <TextField
                    className="input"
                    fullWidth
                    variant="outlined"
                    type="search"
                    placeholder="Buscar produtos, marcas e muito mais ..."
                    aria-label="Faça uma busca"
                    name="filtro"
                    onChange={this.atualizaEstado}
                    endAdornment={
                      <InputAdornment position="end">
                        <img src={icon_search} id="search-btn" type="submit" alt="Icone logo" />
                      </InputAdornment>
                    }

                    endAdornment={
                      <InputAdornment position="end">
                                                <img src={icon_search} id="search-btn" type="submit" alt="Icone logo" />

                      </InputAdornment>
                    }

                  />


                </form>
                <div className="botao-login">
                  {usuarioAutenticado() ?
                    <Link onClick={this.logout} to="/">
                      <img src={LogoutIcon} alt="Link para fazer logout" title="Sair" id="entrar" />
                      <p>Sair</p>
                    </Link>
                    :
                    <Link to="/login">
                      <img src={Avatar} alt="Link para fazer login" title="Faça login" id="entrar" />
                      <p>Entrar</p>
                    </Link>
                  }
                </div>
              </div>
              <nav id="menu-web">
                <div className="menu-centro">
                  <ul className="menu" id="menu">
                    <li><Link to="/" title="Smart sale home">Home</Link></li>
                    <li><Link to="/quemsomos" title="Smart sale quem somos">Quem somos</Link></li>
                    <li><Link to="/ongs" title="Smart sale ongs">ONGs</Link></li>
                    <li><Link to="/ranking" title="Smart sale ranking">Ranking</Link></li>
                    <li><Link to="/ofertas" title="Smart sale categorias">Ofertas</Link></li>
                    {usuarioAutenticado() ? <Link to="/perfil" title="Smart sale perfil">Perfil</Link> : null}
                    <li><Link to="/faq" title="Smart sale faq">FAQ</Link></li>
                  </ul>
                </div>
              </nav>
              <nav id="menu-mobile" style={{ display: this.state.isMenuOpen ? "block" : "none" }}>
                <div className={`${this.state.isMenuOpen}` ? "menu-centro" : "hidden"}>
                  <ul className={`${this.state.isMenuOpen}` ? "menu" : "hidden"} id={`${this.state.isMenuOpen}` ? "menu" : "hidden"}>
                    <li><Link to="/" title="Smart sale home">Home</Link></li>
                    <li><Link to="/quemsomos" title="Smart sale quem somos">Quem somos</Link></li>
                    <li><Link to="/ongs" title="Smart sale ongs">ONGs</Link></li>
                    <li><Link to="/ranking" title="Smart sale ranking">Ranking</Link></li>
                    <li><Link to="/ofertas" title="Smart sale categorias">Ofertas</Link></li>
                    {usuarioAutenticado() ? <Link to="/perfil" title="Smart sale perfil">Perfil</Link> : null}
                    <li><Link to="/faq" title="Smart sale faq">FAQ</Link></li>
                  </ul>
                </div>
                {this.state.isMenuOpen ? <a id="btnclose" className="btnclose" onClick={this.toggle}><i className="fa fa-times"></i></a> : null}
              </nav>
              <button id="btnmenu" className="btnmenu" onClick={this.toggle} ><i className="fa fa-bars fa-lg"></i></button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export default Header;

