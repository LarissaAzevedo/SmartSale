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
    public class OngController : ControllerBase {
        // BD_SmartSaleContext _context = new BD_SmartSaleContext ();

        OngRepository _repositorio = new OngRepository ();

        UploadRepository _uploadRepo = new UploadRepository ();

        /// <summary>
        /// Lista as Ongs
        /// </summary>
        /// <returns>Lista contendo as Ongs</returns>
        [HttpGet]
        public async Task<ActionResult<List<Ong>>> Get () {
            var ongs = await _repositorio.Listar ();
            if (ongs == null) {
                return NotFound ("Ongs não encontradas");
            }
            return ongs;
        }

        /// <summary>
        /// Exibe uma Ong Especifica
        /// </summary>
        /// <param name="id">int Id da ong desejada</param>
        /// <returns>Ong Requisitada</returns>
        [HttpGet ("{id}")]
        public async Task<ActionResult<Ong>> Get (int id) {
            var ongs = await _repositorio.BuscarPorID (id);
            if (ongs == null) {
                return NotFound ("Ong não encontrada");
            }
            return ongs;
        }

        /// <summary>
        /// Adiciona uma Ong
        /// </summary>
        /// <param name="ong">string nome da ong</param>
        /// <returns>Ong cadastrada</returns>
        // [Authorize (Roles = "1")]
        [HttpPost]
        public async Task<ActionResult<Ong>> Post ([FromForm]Ong ong) {
            try {
                var arquivo = Request.Form.Files[0];

                ong.RazaoSocial = Request.Form["razaoSocial"].ToString();
                ong.Cnpj = Request.Form ["cnpj"].ToString();
                ong.SiteOng = Request.Form ["siteOng"].ToString();
                ong.SobreOng = Request.Form ["sobreOng"].ToString();
                ong.TelefoneOng = Request.Form ["telefoneOng"].ToString();
                ong.EmailOng = Request.Form ["emailOng"].ToString();
                ong.EnderecoOng = Request.Form ["enderecoOng"].ToString();
                ong.IdRegiao = int.Parse(Request.Form["idRegiao"]);

                ong.FotoOng = _uploadRepo.Upload (arquivo, "imgOng");

                await _repositorio.Salvar(ong);

            } catch (DbUpdateConcurrencyException) {
                throw;
            }

            return ong;
        }

        /// <summary>
        /// Faz a modificação de derterminada ong
        /// </summary>
        /// <param name="id"> int id da ong</param>
        /// <param name="ong">string nome da ong</param>
        /// <returns>Ong Modificada</returns>
        // [Authorize (Roles = "1")]
        [HttpPut ("{id}")]
        public async Task<ActionResult<Ong>> Put (int id,[FromForm] Ong ong) {
            if (id != ong.IdOng) {
                return BadRequest ();
            }
            try {
                var arquivo = Request.Form.Files[0];

                ong.RazaoSocial = Request.Form["razaoSocial"].ToString();
                ong.Cnpj = Request.Form ["cnpj"].ToString();
                ong.SiteOng = Request.Form ["siteOng"].ToString();
                ong.SobreOng = Request.Form ["sobreOng"].ToString();
                ong.TelefoneOng = Request.Form ["telefoneOng"].ToString();
                ong.EmailOng = Request.Form ["emailOng"].ToString();
                ong.EnderecoOng = Request.Form ["enderecoOng"].ToString();
                ong.IdRegiao = int.Parse(Request.Form["idRegiao"]);

                ong.FotoOng = _uploadRepo.Upload(arquivo, "imgOng");

                await _repositorio.Alterar(ong);


            } catch (DbUpdateConcurrencyException) {
               var ong_valida = await _repositorio.BuscarPorID (id);
                if (ong_valida == null) {
                    return NotFound ("Ong não encontrada");
                } else {
                    throw;
                }

            }
            return NoContent();
        }

        /// <summary>
        /// Delete a ong especificada
        /// </summary>
        /// <param name="id">int id da ong</param>
        /// <returns>Ong deletada</returns>
        [Authorize (Roles = "1")]
        [HttpDelete ("{id}")]
        public async Task<ActionResult<Ong>> Delete (int id) {
            var ong = await _repositorio.BuscarPorID (id);
            if (ong == null) {
                return NotFound ("Ong não encontrada");
            }
            try {
                await _repositorio.Excluir (ong);
            } catch (System.Exception ex) {
                return BadRequest (new {
                    mensagem = "Não foi possível excluir. Raw: " + ex
                });
            }
            return ong;
        }
    }
}