import { expect } from 'chai';
import request from 'supertest';
import { spawn } from 'child_process';

let server;

describe('Flight Path API', () => {
    before((done) => {
        // Start the server using spawn
        server = spawn('node', ['index.js']);

        // Log server output to the console (optional)
        server.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        server.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Wait for the server to be ready
        setTimeout(done, 1000); // Adjust the timeout as necessary
    });

    after((done) => {
        // Kill the server process after tests
        server.kill();
        done();
    });

    const baseURL = 'http://localhost:8080';

    it('should return the correct flight path for a single segment', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["SFO", "EWR"]])
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(["SFO", "EWR"]);
                done();
            });
    });

    it('should return the correct flight path for multiple segments', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["ATL", "EWR"], ["SFO", "ATL"]])
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(["SFO", "ATL", "EWR"]);
                done();
            });
    });

    it('should return the correct flight path for complex segments', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["IND", "EWR"], ["SFO", "ATL"], ["GSO", "IND"], ["ATL", "GSO"]])
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(["SFO", "ATL", "GSO", "IND", "EWR"]);
                done();
            });
    });

    it('should return 400 for invalid input format', (done) => {
        request(baseURL)
            .post('/calculate')
            .send("invalid")
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Invalid input format');
                done();
            });
    });

    it('should return 400 for cycle detected in the flight segments', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["IND", "EWR"], ["SFO", "SFO"], ["GSO", "IND"], ["ATL", "GSO"]])
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Cycle detected in the flight segments.');
                done();
            });
    });

    it('should return 400 for disconnected segments detected in the flight segments', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["IND", "EWR"], ["SFO", "TTT"], ["GSO", "IND"], ["ATL", "GSO"]])
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Disconnected segments detected in the flight segments.');
                done();
            });
    });

    it('should return 400 for impossible to construct a valid flight path', (done) => {
        request(baseURL)
            .post('/calculate')
            .send([["ATL", "EWR"], ["EWR", "SFO"]])
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('error', 'Impossible to construct a valid flight path.');
                done();
            });
    });
});
