using System.Diagnostics;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Mvc;

var appBuilder = WebApplication.CreateBuilder(args);
var universeApp = appBuilder.Build();

// universeApp.MapGet("/", (HttpContext context) => {
//     return Results.Text("Hello Universe!");
// });

universeApp.Run(async (HttpContext context) => {

    context.Response.Headers.Append("Content-Type", "text/html");

    // await context.Response.WriteAsync($"<h1>Hello Universe!</h1><p>The Request Path is : {reqPath}</p>");
    var reqBodyStream = new StreamReader(context.Request.Body);
    var reqBody = await reqBodyStream.ReadToEndAsync();
    if (reqBody != "")
    {
        await context.Response.WriteAsync($@"
            <h1>Hello Universe!</h1>
            <p>The Request body is {reqBody}</p>
        ");
    } else {
        await context.Response.WriteAsync($@"
            <h1>Hello Universe!</h1>
            <p>The Request body is empty</p>
        ");
    }




});

universeApp.Run();


    //  The  WebApplication  class is a new class in ASP.NET Core 6.0 that is used to create a new web application. The  CreateBuilder  method is used to create a new instance of the  WebApplicationBuilder  class. The  Build  method is used to build the web application.
    //  The  MapGet  method is used to map a GET request to a specific route. In this case, the route is  /  and the response is  Hello World! .
    //  The  Run  method is used to run the web application.
    //  Run the application
    //  To run the application, use the following command:
    //  dotnet run

    //  The application will start and you will see the following output:
    //  info: Microsoft.Hosting.Lifetime[0]
    //     Now listening on: https://localhost:5001

