var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// app.MapGet("/", () => "Hello World!");
app.Run(async (HttpContext context) => {
  context.Response.StatusCode = 500;
  await context.Response.WriteAsync("service responses with 500");

});

app.Run();
