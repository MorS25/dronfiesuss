let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { OperationDao } from "../../src/daos/OperationDaos";

import { app, init, initAsync } from "../../src/index";
import { getNow, fakeTime } from "../../src/services/dateTimeService";
import { TEST_TIMEOUT } from "../conf";
import { processOperations } from "../../src/services/operationCronJobs";
import { OperationState, Operation } from "../../src/entities/Operation";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";

describe('>>> Cron test <<<', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);

        initAsync()
            .then(done)
            .catch(done)
    })

    it("Should pass a operation from proposed to closed because there are an other operation", function (done) {
        this.timeout(20000);
        let dao = new OperationDao();
        // dao.all().then(function (ops) {
        //     ops.forEach(op => {
        //         console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)

        //     });
        console.log(` ------- Date is:: ${getNow()}`)
        fakeTime("2019-12-11T20:20:10.000Z")
        processOperations().then(function () {
            setTimeout(async function () {
                console.log(` ------- Date is:: ${getNow()}`)
                dao.all().then(function (processOps) {
                    processOps.forEach(op => {
                        // console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
                        if (op.gufi == "a20ef8d5-506d-4f54-a981-874f6c8bd4de") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                        if (op.gufi == "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63") {
                            op.state.should.equal(OperationState.NOT_ACCEPTED)
                        }
                        if (op.gufi == "ff4b6505-c282-42b1-b013-66f02137f5d5") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                        if (op.gufi == "f7891e78-9bb4-431d-94d3-1a506910c254") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                    });
                    done()
                })
                    .catch(done)
            }, 1000)

        })
            .catch(done)
        // })
        //     .catch(done)




    })

    it("Should pass 3 operations to Closed", function (done) {
        this.timeout(20000);
        let dao = new OperationDao();
        console.log(` ------- Date is:: ${getNow()}`)
        fakeTime("2019-12-11T21:20:10.000Z")
        processOperations().then(function () {
            setTimeout(async function () {
                console.log(` ------- Date is:: ${getNow()}`)
                dao.all().then(function (processOps) {
                    processOps.forEach(op => {
                        // console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
                        if (op.gufi == "a20ef8d5-506d-4f54-a981-874f6c8bd4de") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                        if (op.gufi == "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63") {
                            op.state.should.equal(OperationState.NOT_ACCEPTED)
                        }
                        if (op.gufi == "ff4b6505-c282-42b1-b013-66f02137f5d5") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                        if (op.gufi == "f7891e78-9bb4-431d-94d3-1a506910c254") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                    });
                    done()
                })
                    .catch(done)
            }, 1000)

        })
            .catch(done)
    })

    it("Should pass the new op from rouge to closed", function (done) {
        this.timeout(20000);

        let op: Operation = deepCopy(Operations[0])
        op.operation_volumes[0].min_altitude = -500
        op.flight_comments = "For automate Testing operation "
        op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }
        op.state = OperationState.ROGUE
        let dao = new OperationDao();

        dao.save(op).then(function (op:Operation) {
            console.log(` ------- Date is:: ${getNow()}`)
            fakeTime("2019-12-11T21:20:10.000Z")
            processOperations().then(function () {
                setTimeout(async function () {
                    console.log(` ------- Date is:: ${getNow()}`)
                    // console.log(op)
                    let newOp = await dao.one(op.gufi)
                    newOp.state.should.equal(OperationState.CLOSED)
                    done()
                }, 1000)

            })
                .catch(done)
        }).catch(done)

    })



    //     it("Should pass a operation from proposed to closed because there are an other operation", async function(){
    //         let dao = new OperationDao();
    //         let ops = await dao.all()
    //         ops.forEach(op => {
    //             console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)

    //         });
    //         fakeTime("2019-12-11T20:20:10.000Z")
    //         await processOperations();
    //         setTimeout(async function(){
    //             let processOps = await dao.all()
    //             processOps.forEach(op => {
    //                 console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
    //             });
    //         }, 2000)

    // })
    // it("Should pass a operation from proposed to closed because there are an uvr", function(done){

    // })
    // it("...")


});