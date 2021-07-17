using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImageViewer.Web.UI.Models;
using ImageViewer.Web.UI.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ImageViewer.Web.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.Configure<StorageOptions>(Configuration.GetSection("Storage"));
            services.Configure<InstanceOptions>(Configuration.GetSection("Instance"));
            services.Configure<AuthenticationOptions>(Configuration.GetSection("Authentication"));
            services.AddSingleton<AuthenticationService>();
        }

        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseExceptionHandler("/Home/Error");

            app.UseStaticFiles();
            app.UseStatusCodePages();
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
