using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseRadioAPI.Custom;
using PulseRadioAPI.Models;
using PulseRadioAPI.Models.DTOs;
using System.Security.Claims;

namespace PulseRadioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DbtestContext _dbTestContext;
        private readonly Utilities _utilities;

        public UsersController(DbtestContext dbTestContext, Utilities utilities)
        {
            _dbTestContext = dbTestContext;
            _utilities = utilities;
        }

        // -------------------------
        // REGISTER
        // -------------------------
        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IActionResult> register(UserDTO newUser)
        {
           
            var usernameExists = await _dbTestContext.Users
                .AnyAsync(u => u.Username == newUser.Username);

            if (usernameExists)
            {
                return BadRequest(new { isSuccess = false, message = "El nombre de usuario ya existe." });
            }

            var emailExists = await _dbTestContext.Users
                .AnyAsync(u => u.Email == newUser.Email);

            if (emailExists)
            {
                return BadRequest(new { isSuccess = false, message = "El correo electrónico ya está registrado." });
            }

            var userModel = new User
            {
                Name = newUser.Name,
                Username = newUser.Username,
                Email = newUser.Email,
                Password = _utilities.encryptSHA256(newUser.Password),
                Active = true
            };

            await _dbTestContext.Users.AddAsync(userModel);
            await _dbTestContext.SaveChangesAsync();

            if (userModel.Id == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = "Error al registrar el usuario" });
            }

            var token = _utilities.generateJWT(userModel);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(6)
            };

            Response.Cookies.Append("auth_token", token, cookieOptions);

            return Ok(new { isSuccess = true, message = "Registrado y autenticado exitosamente", user = new {username = userModel.Username, id = userModel.Id } });
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> login(LoginDTO loginData)
        {
            var userFound = await _dbTestContext.Users
                .FirstOrDefaultAsync(u => u.Username == loginData.Username);

            if (userFound == null)
            {
                return Unauthorized(new { isSuccess = false, message = "El usuario no existe." });
            }

            var encryptedPassword = _utilities.encryptSHA256(loginData.Password);

            if (userFound.Password != encryptedPassword)
            {
                return Unauthorized(new { isSuccess = false, message = "Contraseña incorrecta." });
            }

            var token = _utilities.generateJWT(userFound);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(6)
            };

            Response.Cookies.Append("auth_token", token, cookieOptions);

            return Ok(new { isSuccess = true, message = "Inicio de sesión exitoso", user = new { username = userFound.Username, id = userFound.Id} });
        }
        [HttpPost]
        [Route("logout")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public IActionResult logout()
        {
            Response.Cookies.Append("auth_token", "",
                new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddDays(-1),
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

            return Ok(new { isSuccess = true, message = "Sesión cerrada" });
        }
        [HttpGet]
        [Route("profile")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> profile()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            var user = await _dbTestContext.Users
                .Where(u => u.Id == int.Parse(userId))
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { isSuccess = false, message = "Usuario no encontrado" });

            return Ok(new
            {
                isSuccess = true,
                data = new
                {
                    id = user.Id,
                    name = user.Name,
                    username = user.Username,
                    email = user.Email
                }
            });
        }

        [HttpGet]
        [Route("check")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public IActionResult check()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var username = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

                return Ok(new
                {
                    isAuthenticated = true,
                    user = new
                    {
                        id = userId,
                        username = username
                    }
                });
            }

            return Unauthorized(new { isAuthenticated = false });
        }
    }
}
