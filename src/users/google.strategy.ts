import {Injectable} from '@nestjs/common'
import {Strategy,VerifyCallback} from 'passport-google-oauth20'
import {PassportStrategy} from '@nestjs/passport'
import { User } from './entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(){
        super({
            clientID : '505657812841-9sk9eb3p43q3vsudvb28dtd8qfp20jtk.apps.googleusercontent.com',
            clientSecret : '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',
            callbackURL : 'http://localhost:3000/users/auth/google/callback',
            scope : ['email','profile']
        })
    }

    async validate(accessToken:string,refreshToken:string,profile:any, done:VerifyCallback):Promise<any>{
        const {name,emails} = profile;

        const user = {
        email : emails[0].value,
        fullName : name.givenName + " " + name.familyName,
        type : "normal",
        accessToken
        }

        done(null,user);
    }
}