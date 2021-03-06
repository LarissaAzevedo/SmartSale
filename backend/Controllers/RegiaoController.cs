using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Domains;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    public class RegiaoController : ControllerBase {
        RegiaoRepository _repositorio = new RegiaoRepository ();

        /// <summary>
        /// Lista as Regiões
        /// </summary>
        /// <returns>Lista contendo as Regiões</returns>
        [HttpGet]
        public async Task<ActionResult<List<Regiao>>> Get () {
            var regioes = await _repositorio.Listar();
            if (regioes == null) {
                return NotFound ("Regiões não encontradas");
            }
            return regioes;
        }

        /// <summary>
        /// Exibe uma Regiao Especifica
        /// </summary>
        /// <param name="id">int Id da regiao desejada</param>
        /// <returns>Regiao Requisitada</returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Regiao>> Get (int id) {
            var regiao = await _repositorio.BuscarPorID(id);
            if (regiao == null) {
                return NotFound ("Região não encontrada");
            }
            return regiao;
        }

        /// <summary>
        /// Adiciona uma Regiao
        /// </summary>
        /// <param name="regiao">string nome da regiao</param>
        /// <returns>Regiao cadastrada</returns>
        [Authorize(Roles="1")]
        [HttpPost]
        public async Task<ActionResult<Regiao>> Post (Regiao regiao) {
            try {
                await _repositorio.Salvar(regiao);
                
            } catch (DbUpdateConcurrencyException) {
                throw;
            }

            return regiao;
        }

        /// <summary>
        /// Faz a modificação de derterminada regiao
        /// </summary>
        /// <param name="id"> int id da regiao</param>
        /// <param name="regiao">string nome da regiao</param>
        /// <returns>Regiao Modificada</returns>
        [Authorize(Roles="1")]
        [HttpPut ("{id}")]
        public async Task<ActionResult<Regiao>> Put (int id, Regiao regiao) {
            if (id != regiao.IdRegiao) {
                return BadRequest ("Região não encontrada");
            }try {
                await _repositorio.Salvar(regiao);
            } catch (DbUpdateConcurrencyException) {
                var regiao_valida = await _repositorio.BuscarPorID (id);
                if (regiao_valida == null) {
                    return NotFound ("Região não encontrada");
                } else {
                    throw;
                }

            }
            return regiao;
        }

        /// <summary>
        /// Deleta a regiao especificada
        /// </summary>
        /// <param name="id">int id da regiao</param>
        /// <returns>Regiao deletada</returns>
        [Authorize(Roles="1")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Regiao>> Delete (int id) {
            var regiao = await _repositorio.BuscarPorID (id);
            if (regiao == null) {
                return NotFound ("Região não encontrada");
            }

            try {
                await _repositorio.Excluir (regiao);
            } catch (System.Exception ex) {
                return BadRequest(new {
                    mensagem="Não foi possível excluir. Raw: " + ex
                });
            }
            return regiao;
        }
    }
} 