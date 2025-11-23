using System;
using System.Collections.Generic;

namespace PulseRadioAPI.Models;

public partial class Favorite
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Uuid { get; set; }

    public string? Favicon { get; set; }

    public string? Url { get; set; }

    public string? UrlResolved { get; set; }

    public string? Name { get; set; }

    public string? Location { get; set; }

    public string? Language { get; set; }

    public virtual User? User { get; set; }
}
