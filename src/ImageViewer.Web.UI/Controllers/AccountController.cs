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
    public class AccountController : Controller
    {
        private readonly AuthenticationService service;

        public AccountController(AuthenticationService service)
        {
            Ensure.NotNull(service, "service");
            this.service = service;
        }

        [HttpPost]
        public IActionResult Login(string login, string password)
        {
            string token = service.Authenticate(login, password);
            if (String.IsNullOrEmpty(token))
                return Unauthorized();

            return Ok(new { token });
        }

        [HttpPost]
        public IActionResult Logout()
        {
            service.Discard(HttpContext);
            return Ok();
        }
    }
}
