using Microsoft.AspNetCore.Mvc;
using RugDoctorWebApp.Data;
using RugDoctorWebApp.Models;
using Microsoft.EntityFrameworkCore;



namespace RugDoctorWebApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return Ok(customer);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var customers = await _context.Customers.ToListAsync();
        return Ok(customers);
    }
}
