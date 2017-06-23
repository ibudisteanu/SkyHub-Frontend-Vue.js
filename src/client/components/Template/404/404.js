export function show404(app, path, res ){


  app.engine('.html', require('ejs').__express);
  app.set('views', __dirname +'/../src/client/components/Template/404');
  app.set('view engine', 'html');


  //console.log("404",path);

  res.render('404.html',{
    filePath: path,
  });

}
