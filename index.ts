const jwt = require( 'jsonwebtoken' );
const express = require( 'express' );
const passport = require( 'passport' );
const bodyParser = require('body-parser');
const moongoConnection = require('./src/config/connection');
const authRoutes = require('./src/routes/user');

const app = express();

app.use(bodyParser.json());

authRoutes(app, jwt);

app.use(
  function( req: any, res: any, next: Function ) {
    const bearerHeader = req.headers['authorization'];
    if ( typeof bearerHeader !== 'undefined' ) {
      const bearerToken: string = bearerHeader.split(' ')[1];
      req.body.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  }
)


app.get( '/', (req: Request, res: any) => {
  console.log(req.body);
  res.send('hi welcome');
})

app.post('/api/posts', ( req: any, res: any ) => {
  jwt.verify( req.body.token, 'tokenSecretKey', ( err: any, data: JSON ) => {
    if ( err ) { 
      res.sendStatus( 403 )
    } else {
      console.log(req.body);
      res.send( { message: '...posts ', ...data } );
    }
  })
})


app.listen('4000', console.log(' escuchando puerto 4000 '));