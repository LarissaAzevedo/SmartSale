import React, { Component , useState} from "react";
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/Agrupar 110.png';
import Avatar from '../../assets/img/avatar.png';
import LogoutIcon from '../../assets/img/logout.svg'
import { usuarioAutenticado } from '../../services/auth';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { withStyles } from '@material-ui/core/styles';
import './header.css';
import Button from '@material-ui/core/Button';

const useStyles = theme => ({
  searchBar: {
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  menuButton: {
    color: 'white',
    textDecoration: 'none !important',
    listStyle: 'none !important',
    '&:hover': {
      backgroundColor: 'white',
      color: '#A200CB',
    },
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtro: "",
      lista: [],
      btnmenu: false,
      btnclose: false,
      isMenuOpen: false,
      device: "desktop",
    }
  }

  // const [filter, setFilter] = useState();
  // const [list, setList] = useState([]);
  // const [btnMenu, setBtnMenu] = useState(false);
  // const [btnClose, setBtnClose] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [device, setdevice] = useState("desktop");

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
  };

  atualizaEstado = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="container-header">
        <div className="content">
          <Link to="/">
            <img src={Logo} className="logo" title="Home Smart Sale" alt="logo smart sale" />
          </Link>
          <div className="search-bar-and-menu">
            <div className="search-bar">
              <form onSubmit={this.filtrar}>
                <OutlinedInput
                  className={classes.searchBar}
                  type="search"
                  fullWidth
                  placeholder="Buscar produtos, marcas e muito mais ..."
                  aria-label="Faça uma busca"
                  name="filtro"
                  onChange={this.atualizaEstado}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </form>
            </div>

            <div id="menu" className={this.state.isMenuOpen ? "menu-mobile isOpen" : "menu menu-desktop"} >
              {/* <div> */}
                <Link to="/" title="Smart sale home">
                  <Button className={classes.menuButton} variant="button">Home</Button>
                </Link>
                <Link to="/quemsomos" title="Smart sale quem somos">
                  <Button className={classes.menuButton} variant="button">Quem somos</Button>
                </Link>
                <Link to="/ongs" title="Smart sale ongs">
                  <Button className={classes.menuButton} variant="button">ONGs</Button>
                </Link>
                <Link to="/ranking" title="Smart sale ranking">
                  <Button className={classes.menuButton} variant="button">Ranking</Button>
                </Link>
                <Link to="/ofertas" title="Smart sale categorias">
                  <Button className={classes.menuButton} variant="button">Ofertas</Button>
                </Link>
                {usuarioAutenticado() ?
                  <Link to="/perfil" title="Smart sale perfil">
                    <Button className={classes.menuButton} variant="button">Perfil</Button>
                  </Link>
                  : null}
                <Link to="/faq" title="Smart sale faq">
                  <Button className={classes.menuButton} variant="button">FAQ</Button>
                </Link>
              {/* </div> */}

            </div>
          </div>
          {usuarioAutenticado() ?
            <Link onClick={this.logout} className="botao-login" to="/">
              <img src={LogoutIcon} alt="Link para fazer logout" title="Sair" id="entrar" />
              <p>Sair</p>
            </Link>
            :
            <Link to="/login" className="botao-login">
              <img src={Avatar} alt="Link para fazer login" title="Faça login" id="entrar" />
              <p>Entrar</p>
            </Link>
          }
        </div>
        {this.state.device === "celular" ? <Button className="btnmenu" onClick={this.toggle}><i className="fa fa-bars fa-lg" /></Button> : null}
        {this.state.isMenuOpen ? <Button className="btnclose" onClick={this.toggle}><i className="fa fa-times fa-lg"></i></Button> : null}
      </div>
    );
  }
}
export default withStyles(useStyles)(Header);

