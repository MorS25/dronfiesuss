
let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { OperationDao } from "../../src/daos/OperationDaos";
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { RestrictedFlightVolume } from "../../src/entities/RestrictedFlightVolume";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { OperationState, Operation } from "../../src/entities/Operation";
import { TEST_TIMEOUT } from "../conf"; 

describe('>>> Restricted Flight VOlume volume reservation entity <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            .then(done)
            .catch(done)
    })

    it("GET /restrictedflightvolume should get all uvr records", function (done) {
        chai.request(app.app)
            .get('/restrictedflightvolume')
            .set('bypass', 'a')
            .then(function (res) {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.equal(2)
                done();
            })
            .catch(done);
    });

    it("GET /restrictedflightvolume/056ccb91-c58c-439b-93a0-592e19cba0b8 should get a single RFV", function (done) {
        chai.request(app.app)
            .get('/restrictedflightvolume/056ccb91-c58c-439b-93a0-592e19cba0b8')
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.should.have.property('max_altitude').equal("50")
                res.body.should.have.property('min_altitude').equal("0")
                res.body.should.have.property('geography').be.a('object')
                res.body.should.have.property('comments').equal("Airport MVD")
                done();
            })
            .catch(done);
    });


    // it("POST restrictedflightvolume should insert a new uas volume resrevation", function (done) {
    //     let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
    //     // let dao = new PositionDao()
    //     let uvr = {
    //         "uss_name": null,
    //         "type": "DYNAMIC_RESTRICTION",
    //         "permitted_uas": [
    //             "PART_107"
    //         ],
    //         "required_support": [
    //             "ENHANCED_SAFE_LANDING"
    //         ],
    //         "cause": "MUNICIPALITY",
    //         "geography": { "type": "Polygon", "coordinates": [[[-56.159834861755364, -34.91795954238727], [-56.16240978240967, -34.92221734956747], [-56.15567207336426, -34.922569224576016], [-56.15395545959473, -34.920141256305946], [-56.159834861755364, -34.91795954238727]]] },
    //         "effective_time_begin": "2020-03-11T19:59:10.000Z",
    //         "effective_time_end": "2020-03-11T20:59:10.000Z",
    //         "actual_time_end": null,
    //         "min_altitude": "20",
    //         "max_altitude": "50",
    //         "reason": "uasVolumeReservation.REASON"
    //     }
    //     chai.request(app.app)
    //         .post('/restrictedflightvolume')
    //         .set('bypass', 'a')
    //         .send(uvr)
    //         .then(function (res) {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object')
    //             res.body.should.have.property('message_id');

    //             // dao.all().then(function(vehicles){
    //             //     // vehicles.length.should.be.eq(vehicleCountPreInsert+1)
    //             //     done();
    //             // })
    //             // .catch(done)
    //             done();
    //         })
    //         .catch(done);
    // });

    // it("POST restrictedflightvolume should insert a new uas volume resrevation AND", function (done) {
    //     let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
    //     let op1Poly = { "type": "Polygon", "coordinates": [[[-56.155500411987305, -34.91810029987407], [-56.15730285644531, -34.92422301690581], [-56.14897727966308, -34.922885910793696], [-56.14863395690918, -34.917466889282515], [-56.155500411987305, -34.91810029987407]]] }
    //     let opVol: any = {
    //         "effective_time_begin": "2020-03-11T14:00:00.000Z",
    //         "effective_time_end": "2020-03-11T15:00:00.000Z",
    //         "max_altitude": "50",
    //         "min_altitude": "20",
    //         operation_geography: op1Poly
    //     }
    //     let op2Poly = { "type": "Polygon", "coordinates": [[[-56.1624526977539, -34.917326130709455], [-56.15816116333008, -34.92105615133446], [-56.15781784057617, -34.91620005343492], [-56.16090774536133, -34.915144341959426], [-56.1624526977539, -34.917326130709455]]] }

    //     let op = Object.assign({}, deepCopy(Operations[0]))
    //     op.gufi = undefined
    //     op.uas_registrations = []
    //     op.flight_comments = "For automate Testing UVR "
    //     op.state = OperationState.ACTIVATED
    //     op.operation_volumes[0] = Object.assign(op.operation_volumes[0], deepCopy(opVol)) //.operation_geography = op1Poly // = "For automate Testing operation "
        

    //     let op2 = Object.assign({}, deepCopy(Operations[0]))
    //     // let op2 = deepCopy(Operations[1])
    //     op2.gufi = undefined
    //     op2.uas_registrations = []
    //     op2.flight_comments = "For automate Testing UVR 2 "
    //     op2.state = OperationState.ACCEPTED
    //     // op2.operation_volumes[0].operation_geography = op2Poly // = "For automate Testing operation "
    //     opVol.operation_geography = op2Poly
    //     op2.operation_volumes[0] = Object.assign({}, op2.operation_volumes[0], deepCopy(opVol)) //.operation_geography = op1Poly // = "For automate Testing operation "

    //     const opDao = new OperationDao();
    //     // console.log(`op1:::${JSON.stringify(op, null , 2)}`);

    //     let opProm1 = opDao.save(op)
    //     // console.log(`op2:::${JSON.stringify(op2, null , 2)}`);

    //     let opProm2 = opDao.save(op2)

    //     Promise.all([opProm1, opProm2])
    //         .then((values: any) => {
    //             // console.log(JSON.stringify(values, null , 2));
    //             let gufi1 = values[0].gufi
    //             let gufi2 = values[1].gufi
    //             values.forEach(op => {
    //                 op.should.have.property('gufi');
    //             });
    //             let uvrPoly = {"type": "Polygon","coordinates": [[[-56.159834861755364,-34.91795954238727],[-56.16240978240967,-34.92221734956747],[-56.15567207336426,-34.922569224576016],[-56.15395545959473,-34.920141256305946],[-56.159834861755364,-34.91795954238727]]]}

    //             let uvr = {
    //                 "uss_name": null,
    //                 "type": "DYNAMIC_RESTRICTION",
    //                 "permitted_uas": [
    //                     "PART_107"
    //                 ],
    //                 "required_support": [
    //                     "ENHANCED_SAFE_LANDING"
    //                 ],
    //                 "cause": "MUNICIPALITY",
    //                 "geography": uvrPoly, //{"type": "Polygon","coordinates": [  [    [      -56.159834861755364,      -34.91795954238727    ],    [      -56.16240978240967,      -34.92221734956747    ],    [      -56.15567207336426,      -34.922569224576016    ],    [      -56.15395545959473,      -34.920141256305946    ],    [      -56.159834861755364,      -34.91795954238727    ]  ]]},
    //                 "effective_time_begin": "2020-03-11T14:00:00.000Z",
    //                 "effective_time_end": "2020-03-11T15:00:00.000Z",
    //                 "actual_time_end": null,
    //                 "min_altitude": "20",
    //                 "max_altitude": "50",
    //                 "reason": "uasVolumeReservation.REASON"
    //             }
    //             chai.request(app.app)
    //                 .post('/restrictedflightvolume')
    //                 .set('bypass', 'a')
    //                 .send(uvr)
    //                 .then(function (res) {
    //                     res.should.have.status(200);
    //                     res.body.should.be.a('object')
    //                     res.body.should.have.property('message_id');

    //                     opDao.one(gufi1).then(function (op) {
    //                         op.should.have.property('state').equal(OperationState.ROGUE);
    //                         opDao.one(gufi2).then(function (op) {
    //                             op.should.have.property('state').equal(OperationState.CLOSED);
    //                             done();
    //                         }).catch(done)
    //                     }).catch(done)

    //                     // dao.all().then(function(vehicles){
    //                     //     // vehicles.length.should.be.eq(vehicleCountPreInsert+1)
    //                     //     done();
    //                     // })
    //                     // .catch(done)
    //                     // done();
    //                 })
    //                 .catch(done);
    //         })
    //         .catch(done);
    // });

   


});

