const bcrypt = require('bcrypt');

interface IUser {
  name: string,
  password: string,
  email: string,
}

const User = require('../models/User');

function validatePassword(password: string) {
  const regExp:RegExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  let result: string = '';
  if (regExp.test(password)) {
    result = password;
  }
  return result;
}

module.exports = ( app: any, jwt: any ) => {

  app.post( '/api/login', async ( req: any, res: any) => {
    const email = req.body.email;
    const $password = req.body.password;
    const existingUser = await User.findOne( { email } );
    const { password, name } = existingUser;
    const result = await bcrypt.compare($password, password);
    if ( existingUser && result ) {
      jwt.sign({ existingUser }, 'tokenSecretKey', ( err: object, token: string ) => {
        req.body = { data: { token, name, message: 'success' } };
        res.send( req.body );
      });
    } else {
      req.body = { message: ' Auth error '}
      res.status( 403 ).send( req.body );
    }
  })

  app.post( '/api/register', async ( req: any, res: any ) => {
    const existingUser = await User.findOne( { email: req.body.email } );
    if ( !existingUser ) {
      const validPassword = validatePassword(req.body.password);
      if ( validPassword.length ) {
        try {
          bcrypt.hash(validPassword, 10, async ( err: any, hash: any) => {
            if ( !err ) {
              const user: IUser = await new User({ 
                name: req.body.name,
                email: req.body.email,
                password: hash }).save();
      
              jwt.sign({ user }, 'tokenSecretKey', ( err: object, token: string ) => {
                req.body = { token, message: 'success' };
                res.send( req.body );
              });
            } else {
              return err;
            }
          });
        } catch (error) {
          req.body = { message: error };
          res.send(req.body);
        }
      } else {
        res.sendStatus(409);
      }
    } else {
      req.body = { message: ' usario registrado '};
      res.status(409).send(req.body);
    }
  })
};