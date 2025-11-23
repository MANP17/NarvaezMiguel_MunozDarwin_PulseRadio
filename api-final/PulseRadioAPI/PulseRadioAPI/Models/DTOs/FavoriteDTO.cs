namespace PulseRadioAPI.Models.DTOs
{
    public class FavoriteDTO
    {
        public int? UserId { get; set; }

        public string? Uuid { get; set; }

        public string? Favicon { get; set; }

        public string? Url { get; set; }

        public string? UrlResolved { get; set; }

        public string? Name { get; set; }

        public string? Location { get; set; }

        public string? Language { get; set; }
    }
}
