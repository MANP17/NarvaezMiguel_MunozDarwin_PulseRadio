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
    public class FavoritesController : Controller
    {
        private readonly DbtestContext _dbTestContext;
        private readonly Utilities _utilities;

        public FavoritesController(DbtestContext dbTestContext, Utilities utilities)
        {
            _dbTestContext = dbTestContext;
            _utilities = utilities;
        }

        [HttpGet]
        [Route("favorites")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);

            var favorites = await _dbTestContext.Favorites
                .Where(f => f.UserId == parsedId)
                .ToListAsync();

            return Ok(new { isSuccess = true, favorites });
        }

        [HttpDelete]
        [Route("delete-favorite/{uuid}")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> DeleteFavorite([FromRoute] string uuid)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);


            var favorite = await _dbTestContext.Favorites
                .FirstOrDefaultAsync(f => f.Uuid == uuid && f.UserId == parsedId);


            if (favorite == null)
                return NotFound(new { isSuccess = false, message = "El favorito no existe o no pertenece al usuario" });

            _dbTestContext.Favorites.Remove(favorite);
            await _dbTestContext.SaveChangesAsync();

            return Ok(new { isSuccess = true, message = "Favorito eliminado correctamente" });
        }

        [HttpPost]
        [Route("new-favorite")]
        [Authorize(AuthenticationSchemes = "JwtAuth")]
        public async Task<IActionResult> NewFavorite([FromBody] FavoriteDTO newFavorite)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { isSuccess = false, message = "Token inválido" });

            int parsedId = int.Parse(userId);

            var favoriteModel = new Favorite { UserId = parsedId, Uuid = newFavorite.Uuid, Url =newFavorite.Url, UrlResolved = newFavorite.UrlResolved, Name=newFavorite.Name, Location = newFavorite.Location, Language = newFavorite.Language, Favicon = newFavorite.Favicon};
            await _dbTestContext.Favorites.AddAsync(favoriteModel);
            await _dbTestContext.SaveChangesAsync();

            if (favoriteModel.Id == 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = "Error al agreagar a favoritos" });
            }
            return Ok(new { isSuccess = true, message = "Favorito agregado correctamente" });
        }
    }
}
