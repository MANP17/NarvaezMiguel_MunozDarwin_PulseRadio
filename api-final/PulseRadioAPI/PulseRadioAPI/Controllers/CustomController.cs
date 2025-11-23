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
    [Route("api/[Controller]")]
    [ApiController]
    public class CustomController : Controller
    {
        private readonly DbtestContext _dbTestContext;
        private readonly Utilities _utilities;

        public CustomController(DbtestContext dbTestContext, Utilities utilities)
        {
            _dbTestContext = dbTestContext;
            _utilities = utilities;
        }

        [HttpGet]
        [Route("custom")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> GetCustom()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);

            var custom = await _dbTestContext.Customs
                .Where(f => f.UserId == parsedId)
                .ToListAsync();

            return Ok(new { isSuccess = true, custom });
        }

        [HttpDelete]
        [Route("delete-custom")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> DeleteCustom([FromBody] DeleteCustomDTO dto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);


            var custom = await _dbTestContext.Customs
                .FirstOrDefaultAsync(f => f.Id == dto.Id && f.UserId == parsedId);


            if (custom == null)
                return NotFound(new { isSuccess = false, message = "La personalizada no existe o no pertenece al usuario" });

            _dbTestContext.Customs.Remove(custom);
            await _dbTestContext.SaveChangesAsync();

            return Ok(new { isSuccess = true, message = "Personalizada eliminada correctamente" });
        }

        [HttpPost]
        [Route("new-custom")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> NewCustom([FromBody] CustomDTO newCustom)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);

            var customModel = new PulseRadioAPI.Models.Custom { UserId = parsedId, Name = newCustom.Name, Url = newCustom.Url };
            await _dbTestContext.Customs.AddAsync(customModel);
            await _dbTestContext.SaveChangesAsync();

            if (customModel.Id == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = "Error al agreagar personalizada" });
            }
            return Ok(new { isSuccess = true, message = "Personalizada agregada correctamente" });
        }
    }
}
