using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Domains;
using backend.Repositories;
using backend.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase {
        //chamamos nosso contexto do banco
        LoginRepository _repositorio = new LoginRepository();
        //Definimos uma variavel para percorrer nossos metodos com a configuraçoes obtidas no appsettings.json
        private IConfiguration _config;

        
        // definimos um metodos construtor para poder passar essas configs
        public LoginController (IConfiguration config) {
            _config = config;
        }
        
        //Criamos nosso meotodo para gerar nosso token
        private string GenerateJSONWebToken (Usuario userInfo) {
            var securityKey = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (_config["Jwt:Key"]));
            var credentials = new SigningCredentials (securityKey, SecurityAlgorithms.HmacSha256);

            //Definimos nossas claims (dados da seção) para poderem ser capturadas a qualquer momento enquanto o token for ativo
            var claims = new [] {
                new Claim (JwtRegisteredClaimNames.NameId, userInfo.NomeUsuario),
                new Claim (JwtRegisteredClaimNames.Email, userInfo.Email),
                new Claim (ClaimTypes.Role, userInfo.IdTipoUsuario.ToString ()),
                new Claim (JwtRegisteredClaimNames.Jti, Guid.NewGuid ().ToString ()),
                new Claim ("Id", userInfo.IdUsuario.ToString()),
                new Claim ("Role", userInfo.IdTipoUsuario.ToString())
            };
            //configuramos nosso token e o nosso tempo de vida
            var token = new JwtSecurityToken (_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires : DateTime.Now.AddMinutes (120),
                signingCredentials : credentials);
            return new JwtSecurityTokenHandler ().WriteToken (token);
        }

        //usamos essa anotação para a ignorar a autenticação neste metodo já que ele é quem fara isso
        /// <summary>
        /// Faz login de um usuario existente na base de dados
        /// </summary>
        /// <param name="login">Credenciais de Login, email e senha</param>
        /// <returns>JWT contendo as claims do usuario</returns>
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login ([FromBody] LoginViewModel login) {
            IActionResult response = Unauthorized ();
            var user = _repositorio.AuthenticateUser(login);
            if (user != null) {
                var TokenString = GenerateJSONWebToken (user);
                response = Ok (new { token = TokenString });
            }
            return response;
        }

    }

}