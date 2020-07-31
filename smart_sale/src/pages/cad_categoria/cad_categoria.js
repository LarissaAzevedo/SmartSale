import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBInput, MDBBtn } from 'mdbreact';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';

class Cad_categoria extends Component {
  constructor() {
    super();

    this.state = {
      // adicionar loading nas tabelas
      modal: false,
      categoryList: [],
      erroMsg: "",
      newCategory: {
        categoryName: ""
      },
      changeCategory: {
        categoryId: "",
        categoryName: ""
      }
    }
  }

  componentDidMount() {
    this.getCategory();
  }

  getCategory = () => {
    fetch("http://localhost:5000/api/categoria")
      .then(response => response.json())
      .then(data => {
        this.setState({ categoryList: data })
      });
  }

  atualizaEstadoCadastro = (input) => {
    let propertyName = input.target.name;

    this.setState({
      newCategory: {
        ...this.state.newCategory,
        [input.target.name]: input.target.value
      }
    }, () => console.log(this.state.newCategory[propertyName]))
  }

  atualizaEstadoAlterar = (input) => {
    let propertyName = input.target.name;

    this.setState({
      changeCategory: {
        ...this.state.changeCategory,
        [input.target.name]: input.target.value
      }
    }, () => console.log(this.state.changeCategory[propertyName]))
  }

  cadastrarCategoria = (event) => {
    event.preventDefault();
    this.setState({ erroMsg: "" });
    fetch("http://localhost:5000/api/Categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ categoryName: this.state.newCategory.categoryName })
    })
      .then(response => response.json())
      .then(response => {
        this.getCategory();
        this.setState({
          erroMsg: "Cadastro efetuado com sucesso!"
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          erroMsg: "Não é possível cadastrar. Verifique se não há campos vazios ou com dados incorretos."
        })
      })
  }

  deletarCategoria = (id) => {
    fetch("http://localhost:5000/api/categoria/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        this.getCategory();
        this.setState(() => ({ categoryList: this.state.categoryList }))
        // visually return success message here
      })
      .catch(error => {
        console.log(error);
      })
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  alterarCategoria = (categoria) => {
    this.setState({ changeCategory: categoria })
    this.toggle();
  }

  salvarAlteracoes = (event) => {
    event.preventDefault();
    let categoria_id = this.state.changeCategory.categoryId;
    let categoria_put = this.state.changeCategory;

    fetch("http://localhost:5000/api/categoria/" + categoria_id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoria_put)
    })
      .then(response => response.json())
      .catch(error => console.log(error))

    setTimeout(() => {
      this.getCategory();
    }, 500)

    this.toggle();
  }

  render() {
    return (
      <>
        <div>
          <Header {...this.props} />
          <div className="fundoCadastro">
            <div className="cardCadastro">
              <h2>Categorias Cadastradas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Identificador</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.categoryList.map(categoria =>
                      (
                        <tr key={categoria.idCategoria}>
                          <td>{categoria.idCategoria}</td>
                          <td>{categoria.nomeCategoria}</td>
                          <td>
                            <button onClick={() => this.alterarCategoria(categoria)}>Alterar</button>
                            <button onClick={() => this.deletarCategoria(categoria.idCategoria)}>Excluir</button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>

              <h2>Cadastro de Categoria</h2>
              <div className="descricao">
                <p>Preencha os campos abaixo para efetuar o cadastro da categoria.</p>
              </div>
              <form onSubmit={this.cadastrarCategoria}>
                <div className="campo">
                  <input onChange={this.atualizaEstadoCadastro} type="text" placeholder="Nome da categoria" aria-label="Digite o nome da categoria" name="categoryName" required />
                </div>
                <div className="btnCadastro">
                  <button type="submit">Cadastrar</button>
                  {this.state.erroMsg && <div className="text-danger">{this.state.erroMsg}</div>}
                </div>
              </form>
            </div>
          </div>
          <MDBContainer>
            <form onSubmit={this.salvarAlteracoes}>
              <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                <MDBModalHeader toggle={this.toggle}>Editar {this.state.changeCategory.categoryName}</MDBModalHeader>
                <MDBModalBody>
                  <MDBInput label="Categoria" name="categoryName" value={this.state.changeCategory.categoryName} size="lg" onChange={this.atualizaEstadoAlterar} />
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                  <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                </MDBModalFooter>
              </MDBModal>
            </form>
          </MDBContainer>
          <Footer />
        </div>
      </>
    );
  }
}
export default Cad_categoria;