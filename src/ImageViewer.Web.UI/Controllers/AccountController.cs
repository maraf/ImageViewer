using ImageViewer.Web.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Neptuo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageViewer.Web.UI.Controllers
{
    [Route("accounts")]
    public class AccountController : Controller
    {
        private readonly AuthenticationService service;

        public AccountController(AuthenticationService service)
        {
            Ensure.NotNull(service, "service");
            this.service = service;
        }

        [HttpPost("login")]
        public IActionResult Login(string password)
        {
            string token = service.Authenticate(password);
            if (String.IsNullOrEmpty(token))
                return Unauthorized();

            return Ok(new { token });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            service.Discard(HttpContext);
            return Ok();
        }
    }
}
