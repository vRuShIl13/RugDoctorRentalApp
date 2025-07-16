using Microsoft.EntityFrameworkCore;
using RugDoctorWebApp.Models;

namespace RugDoctorWebApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Customer> Customers => Set<Customer>();
    // Later: public DbSet<RentalForm> RentalForms => Set<RentalForm>();
}
