using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace PulseRadioAPI.Models;

public partial class DbtestContext : DbContext
{
    public DbtestContext()
    {
    }

    public DbtestContext(DbContextOptions<DbtestContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Custom> Customs { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Custom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__custom__3213E83F7890EC3E");

            entity.ToTable("custom");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Url)
                .HasMaxLength(1024)
                .IsUnicode(false)
                .HasColumnName("url");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Customs)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_custom");
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__favorite__3213E83FCEA490BF");

            entity.ToTable("favorites");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Language)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("language");
            entity.Property(e => e.Favicon)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("favicon");
            entity.Property(e => e.Location)
                .HasMaxLength(256)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.Name)
                .HasMaxLength(1024)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Url)
                .HasMaxLength(1024)
                .IsUnicode(false)
                .HasColumnName("url");
            entity.Property(e => e.UrlResolved)
                .HasMaxLength(1024)
                .IsUnicode(false)
                .HasColumnName("url_resolved");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Uuid)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("uuid");

            entity.HasOne(d => d.User).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_favorites");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__users__3213E83F66CA8D5E");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "UQ__users__AB6E616438279DAF").IsUnique();

            entity.HasIndex(e => e.Username, "UQ__users__F3DBC57248A42D5D").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
