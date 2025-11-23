using System;
using System.Collections.Generic;

namespace PulseRadioAPI.Models;

public partial class Custom
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Name { get; set; }

    public string? Url { get; set; }

    public virtual User? User { get; set; }
}
