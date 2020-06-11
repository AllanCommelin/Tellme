/*
Imports
*/
    // Node
    const express = require('express');
    const bcrypt = require('bcrypt');
    const router = express.Router();
    const secretKey = process.env.SECRET_TOKEN;


// Inner
    const UserModel = require('../models/user.schema');
//

/*
Routes definition
*/
    class AuthRouterClass {

        // Inject Passport to secure routes
        constructor({passport}) {
            this.passport = passport
        }
        
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
                        try {
                            if(await bcrypt.compare(req.body.password, user.password)) {
                                // Generate user JWT
                                res.cookie(process.env.COOKIE_NAME, user.generateJwt(user));
                                res.status(201).json({
                                    method: 'POST',
                                    route: '/api/auth/login',
                                    data: user,
                                    error: null,
                                    status: 201
                                });
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

            router.get('/me', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                res.status(201).json({
                    method: 'POST',
                    route: '/api/auth/me',
                    data: req.user,
                    error: null,
                    status: 201
                });
            });

            router.get('/logout', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Delete cookie
                res.clearCookie(process.env.COOKIE_NAME);
                res.cookie(process.env.COOKIE_NAME).set({expires: Date.now()})
                res.status(201).json({
                    method: 'POST',
                    route: '/api/auth/logout',
                    data: null,
                    error: null,
                    status: 201
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