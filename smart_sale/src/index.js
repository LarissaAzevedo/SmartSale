import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';


// import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'bootstrap-css-only/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';

// Chamado CSS
import './assets/css/final.css'

import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

//#region 
import Cad_categoria from "./pages/cad_categoria/cad_categoria";
import Cad_oferta from "./pages/cad_oferta/cad_oferta"
import Cad_produto from "./pages/cad_produto/cad_produto"
import Cad_usuario from "./pages/cad_usuario/cad_usuario"
import Faq from "./pages/faq/faq"
// import Final_reserva from "./pages/final_reserva/final_reserva"
import Home from "./pages/home/home"
import Login from "./pages/login/login"
// import NotFound from "./pages/not_found/not_found"
import Ofertas from "./pages/ofertas/ofertas"
import Ongs from "./pages/ongs/ongs"
import Perfil from "./pages/perfil/perfil"
// import Produto from "./pages/produto/produto"
// import QuemSomos from "./pages/quem_somos/quem_somos"
import Ranking from "./pages/ranking/ranking"
//#endregion

const Rotas = (
    <Router>
        <div>
            <Switch>
                <Route exact path = "/" component={Home}/>                
                <Route path = "/login" component={Login}/>
                <Route path = "/cadastrocategoria" component={Cad_categoria}/>
                <Route path = "/cadastrooferta" component={Cad_oferta}/>
                <Route path = "/cadastroproduto" component={Cad_produto}/>
                <Route path = "/cadastrousuario" component={Cad_usuario}/>
                <Route path = "/faq" component={Faq}/>
                {/* <Route path = "/finalreserva" component={Final_reserva}/> */}
                <Route path = "/ofertas" component={Ofertas}/>
                <Route path = "/ongs" component={Ongs}/>
                <Route path = "/perfil" component={Perfil}/>
                {/* <Route path = "/produto" component={Produto}/> */}
                {/* <Route path = "/quemsomos" component={QuemSomos}/> */}
                <Route path = "/ranking" component={Ranking}/>
                {/* <Route component={NotFound}/> */}
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(Rotas, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
