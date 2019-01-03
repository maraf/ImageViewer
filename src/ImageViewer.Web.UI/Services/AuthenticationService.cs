using ImageViewer.Web.UI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Neptuo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageViewer.Web.UI.Services
{
    public class AuthenticationService
    {
        private readonly IOptions<AuthenticationOptions> options;
        private readonly List<string> tokens = new List<string>();

        public AuthenticationService(IOptions<AuthenticationOptions> options)
        {
            Ensure.NotNull(options, "options");
            this.options = options;
        }

        public bool IsValid(HttpContext httpContext)
        {
            if (options.Value == null)
                return true;

            string token = httpContext.Request.Headers["X-Authentication-Token"];
            if (String.IsNullOrEmpty(token))
                return false;

            return tokens.Contains(token);
        }

        public string Authenticate(string login, string password)
        {
            if (options.Value == null)
                return null;

            if (options.Value.DefaultAccount.Login == login && options.Value.DefaultAccount.Password == password)
            {
                string token = Guid.NewGuid().ToString();
                tokens.Add(token);
                return token;
            }

            return null;
        }

        public void Discard(string token)
        {
            Ensure.NotNullOrEmpty(token, "token");
            tokens.Remove(token);
        }
    }
}
