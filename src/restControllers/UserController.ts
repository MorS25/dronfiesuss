import { NextFunction, Request, Response } from "express";
import { User, Role } from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { hashPassword } from "../services/encrypter";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";
import { UserStatus, Status } from "../entities/UserStatus";
import { UserStatusDao } from "../daos/UserStatusDao";

export class UserController {

    private dao = new UserDao()
    private userStatusDao = new UserStatusDao()

    //solo admin   
    async all(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        if (role == Role.ADMIN) {
            return response.json(await this.dao.all());
        }
        else {
            return response.sendStatus(401)
        }
    }

    //solo admin   
    async one(request: Request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        if ((role == Role.ADMIN) || (username == request.params.id)) {
            try {
                return response.json(await this.dao.one(request.params.id));
            } catch (error) {
                return response.sendStatus(404)
            }
        }
        else {
            return response.sendStatus(401)
        }
    }

    //solo admin   
    async save(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        try {
            if (role == Role.ADMIN) {
                let user: User = request.body
                // trimFields(user)
                let errors = validateUser(user)
                if (errors.length == 0) {
                    user.password = hashPassword(user.password)
                    let insertedDetails = await this.dao.save(user)
                    return response.json(user);
                } else {
                    response.status(400)
                    return response.json(errors)
                }
            }
            else {
                return response.sendStatus(401)
            }
        } catch (error) {
            response.status(400)
            return response.json({ "Error": "Insert fail" })
        }
    }

    async userRegister(request: Request, response: Response, next: NextFunction) {
        try {
            let user: User = request.body

            user.role = Role.PILOT;

            // user.status = new UserStatus()
            // user.status.status = Status.UNCONFIRMED
            // user.status.token = generateToken();

            let status = new UserStatus()
            status.status = Status.UNCONFIRMED
            status.token = generateToken();
            let s = await this.userStatusDao.save(status)   
            // console.log(JSON.stringify(s , null, 2))

            user.status = status

            let errors = validateUser(user)
            if (errors.length == 0) {
                user.password = hashPassword(user.password)
                let insertedDetails = await this.dao.save(user)
                // console.log(JSON.stringify(user, null, 2))
                // console.log(JSON.stringify(insertedDetails, null, 2))
                return response.json(user);
            } else {
                response.status(400)
                return response.json(errors)
            }
            
        } catch (error) {
            response.status(400)
            return response.json({ "Error": "Insert fail" })
        }
    }

    async confirmUser(request: Request, response: Response, next: NextFunction) {
        try {

            console.log(`confirm user: ${JSON.stringify(request.body)}`)

            let token = request.body.token
            let user = await this.dao.one(request.body.username)

            // console.log(`Will change ${user.username}`)
            
            let status = await user.status;
            console.log(`Estado que obtengo de bbdd ${JSON.stringify(status, null, 2)}`)
            if(token == status.token){
                try {
                    status.status = Status.CONFIRMED
                    console.log(`Estado antes de pasar al save ${JSON.stringify(status, null, 2)}`)
                    let info = await this.userStatusDao.save(status)   
                    console.log(`Info del save ${JSON.stringify(info, null, 2)}`)
                    console.log(`Estado antes de pasar al save ${JSON.stringify(status, null, 2)}`)
                    // console.log(info)
                    return response.json( {message:"Confirmed user"} );
                } catch (error) {
                    // response.statusCode = 400
                    // return response.json({error:"Invalid token"})
                    return response.sendStatus(404)

                }
            }else{
                console.log(`${token} == ${status.token}`)
                response.statusCode = 401
                    return response.json({error:"Invalid token"})
            }
        } catch (error) {
            return response.sendStatus(404)
        }

    }






    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // let userToRemove = await this.dao.one(request.params.id);
    //     await this.dao.remove(request.params.username);
    // }

}

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }
    return false
}

// function trimFields(user:User){
//     // user.email = user.email.trim
//     user.firstName = user.firstName.trim()
//     user.lastName = user.lastName.trim()
//     user.username = user.username.trim()

// }

function validateUser(user: User) {
    // console.log("Validando usuarios")
    // console.log(user)
    let errors = []
    if (!validateEmail(user.email)) {
        errors.push("Invalid email")
    }
    if (!genericTextLenghtValidation(user.firstName)) {
        errors.push("Invalid first name")
    }
    if (!genericTextLenghtValidation(user.lastName)) {
        errors.push("Invalid last name")
    }
    if (!genericTextLenghtValidation(user.password)) {
        errors.push("Invalid password")
    }
    if (!genericTextLenghtValidation(user.username)) {
        errors.push("Invalid username")
    }
    return errors
    // return true
}

function generateToken(): String {
    let d = new Date();
    return hashPassword(d.toUTCString())
}