using ImageViewer.Web.UI.Models;
using ImageViewer.Web.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Neptuo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageViewer.Web.UI.Controllers
{
    [Route("image")]
    public class ImageController : Controller
    {
        private readonly AuthenticationService authentication;
        private readonly StorageOptions options;

        public ImageController(AuthenticationService authentication, IOptions<StorageOptions> options)
        {
            Ensure.NotNull(authentication, "authentication");
            Ensure.NotNull(options, "options");
            this.authentication = authentication;
            this.options = options.Value;
        }

        [HttpGet("latest")]
        public IActionResult Latest()
        {
            if (!authentication.IsValid(HttpContext))
                return Unauthorized();

            string rootPath = options.RootPath;
            if (rootPath != null)
            {
                string targetFolderPath = Directory.EnumerateDirectories(rootPath).OrderBy(p => p).LastOrDefault();
                if (targetFolderPath != null)
                {
                    string targetFilePath = Directory.EnumerateFiles(targetFolderPath).OrderBy(p => p).LastOrDefault();
                    string etag = $"{Path.GetFileName(targetFolderPath)}_{Path.GetFileNameWithoutExtension(targetFilePath)}";
                    string currentEtag = Request.Headers["If-None-Match"];
                    if (etag == currentEtag)
                        return StatusCode(304);

                    if (targetFilePath != null)
                    {
                        return PhysicalFile(
                            targetFilePath,
                            options.ImageContentType,
                            new FileInfo(targetFilePath).CreationTime,
                            new EntityTagHeaderValue($"\"{etag}\"")
                        );
                    }
                }
            }

            return NotFound();
        }
    }
}
