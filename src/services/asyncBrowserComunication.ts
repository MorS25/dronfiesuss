import { app } from "../index";
import { Position } from "../entities/Position";
import { User } from "../entities/User";


function send(topic, object){
    if(process.env.NODE_ENV != "test"){
        app.io.emit(topic, object)
    } else {
        return [topic, object]
    }

}

export function sendPositionToMonitor(position ){
    // app.io.emit('new-position', position)
    return send('new-position', position)
}

export function sendOperationFlyStatus(inOperation ){
    // app.io.emit('position-status', inOperation)
    return send('position-status', inOperation)
}


export function sendAlgo(position : Position){
    // app.io.emit('new-position', position)
    return send('new-position', position)
}


export function sendUserLogged(user : User){
    // app.io.emit('user-logged')
    return send('user-logged', {})
}