/*
Imports
*/
    // Node
    const express = require('express');
    const bcrypt = require('bcrypt');
    const router = express.Router();

    // Inner
    const UserModel = require('../models/user.schema');
//

/*
Routes definition
*/
    class AuthRouterClass {

        // Inject Passport to secure routes
        constructor() {}
        
        // Set route fonctions
        routes(){
            /**
             * Register route
             */
            router.post('/register', async (req, res) => {
                const hashed_pass = await bcrypt.hash(req.body.password, 12);
                UserModel.create({
                    'pseudo': req.body.pseudo,
                    'email': req.body.email,
                    'password': hashed_pass,
                })
                    .then( document => res.status(201).json({
                        method: 'POST',
                        route: '/api/auth/register',
                        data: document,
                        error: null,
                        status: 201
                    }))
                    .catch( err => res.status(502).json({
                        method: 'POST',
                        route: '/api/auth/register',
                        data: null,
                        error: err,
                        status: 502
                    }));
            });

            /**
             * Login route
             */
            router.post('/login', async (req, res) => {
                UserModel.findOne({ email: req.body.email})
                    .then( async (user) => {
                        console.log('User email:', user.email);
                        console.log('User pass:', user.password);
                        try {
                            if(await bcrypt.compare(req.body.password, user.password)) {
                                res.status(201).json({
                                    method: 'POST',
                                    route: '/api/auth/login',
                                    data: user,
                                    error: null,
                                    status: 201
                                })
                            } else {
                                res.status(405).json({
                                    method: 'POST',
                                    route: '/api/auth/login',
                                    data: null,
                                    error: 'Not Allowed',
                                    status: 405
                                })
                            }
                        } catch {
                            res.status(500).json({
                                method: 'POST',
                                route: '/api/auth/login',
                                data: null,
                                error: null,
                                status: 500
                            })
                        }
                    })
                    .catch( err => {
                        return res.status(400).json({
                            method: 'POST',
                            route: '/api/auth/login',
                            data: null,
                            error: err,
                            status: 404
                        });
                    });
            });
        };

        // Start router
        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return router;
        };
    }
//

/*
Export
*/
    module.exports = AuthRouterClass;
//