using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Domains;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers {
    [Route ("api/[Controller]")]
    [ApiController]
    public class ProdutoController : ControllerBase {
        ProdutoRepository _repositorio = new ProdutoRepository ();

        /// <summary>
        /// Lista os produtos
        /// </summary>
        /// <returns>Lista contendo os produtos</returns>
        [HttpGet]
        public async Task<ActionResult<List<Produto>>> Get () {
            var produtos = await _repositorio.Listar ();
            if (produtos == null) {
                return NotFound ("Produtos não encontrados");
            }
            return produtos;
        }

        /// <summary>
        /// Exibe um produto especifico
        /// </summary>
        /// <param name="id">int Id do produto desejado</param>
        /// <returns>Produto requisitado</returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Produto>> Get (int id) {
            var produtos = await _repositorio.BuscarPorID (id);
            if (produtos == null) {
                return NotFound ("Produto não encontrado");
            }
            return produtos;

        }
        /// <summary>
        /// Adiciona um produto 
        /// </summary>
        /// <param name="produto">string Nome do produto</param>
        /// <returns>Produto cadastrado</returns>
        // [Authorize(Roles="1")]
        [HttpPost]
        public async Task<ActionResult<Produto>> Post (Produto produto) {
            try {
                await _repositorio.Salvar (produto);
            } catch (DbUpdateConcurrencyException) {

                throw;
            }

            return produto;

        }
        /// <summary>
        /// Faz a modificação do produto especificado
        /// </summary>
        /// <param name="id">int Id do produto</param>
        /// <param name="produto">string Nome do produto</param>
        /// <returns>Produto modificado</returns>
        // [Authorize(Roles="1")]
        [HttpPut ("{id}")]
        public async Task<ActionResult<Produto>> Put (int id, Produto produto) {
            if (id != produto.IdProduto) {
                return BadRequest ();
            }

            try {
                await _repositorio.Alterar (produto);
            } catch (DbUpdateConcurrencyException) {
                var categoria_valida = await _repositorio.BuscarPorID (id);
                if (produto == null) {
                    return NotFound ("Produto não encontrado");
                } else {
                    throw;
                }

            }

            return produto;

        }
        /// <summary>
        /// Deleta o produto especificado
        /// </summary>
        /// <param name="id">int Id do produto</param>
        /// <returns>Produto deletado</returns>
        // [Authorize(Roles="1")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Produto>> Delete (int id) {
            var produto = await _repositorio.BuscarPorID (id);
            if (produto == null) {
                return NotFound ("Produto não encontrado");
            }
            try {
                await _repositorio.Excluir (produto);
            } catch (System.Exception ex) {
                return BadRequest (new {
                    mensagem = "Não foi possível excluir. Raw: " + ex
                });
            }
            return produto;
        }

    }
}