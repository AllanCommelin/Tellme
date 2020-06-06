/*
Imports
*/
    // Node
    const express = require('express');
    const router = express.Router();
//

/*
Routes definition
*/
    class CrudMongoRouterClass {

        // Inject Passport to secure routes
        constructor(connection) {
            // Instanciate MYsql connection
            this.connection = connection;
        }
        
        // Set route fonctions
        routes(){
            /* 
            CRUD: Create route 
            */
                router.post('/:endpoint', (req, res) => {
                    this.connection.query(`INSERT INTO ${req.params.endpoint} SET ?`, req.body, (err, document) => {
                        if (err) {
                            return res.status(502).json({
                                method: 'POST',
                                route: `/api/${req.params.endpoint}`,
                                data: null,
                                error: err,
                                status: 502
                            });
                        }
                        else{
                            return res.status(201).json({
                                method: 'POST',
                                route: `/api/${req.params.endpoint}`,
                                data: document,
                                error: null,
                                status: 201
                            });
                        };
                    });
                });
            //

            /* 
            CRUD: Read all route 
            */
                router.get('/:endpoint', (req, res) => {
                    this.connection.query(`SELECT * FROM ${req.params.endpoint}`, (err, items) => {
                        if (err) {
                            return res.status(502).json({
                                method: 'GET',
                                route: `/api/${req.params.endpoint}`,
                                data: null,
                                error: err,
                                status: 502
                            });
                        }
                        else{
                            return res.status(200).json({
                                method: 'GET',
                                route: `/api/${req.params.endpoint}`,
                                data: items,
                                error: null,
                                status: 200
                            });
                        };
                    });
                });
            //

            /* 
            CRUD: Read one route
            */
                router.get('/:endpoint/:id', (req, res) => {
                    this.connection.query(`SELECT * FROM ${req.params.endpoint} WHERE id=${req.params.id}`, (err, item) => {
                        if (err) {
                            return res.status(502).json({
                                method: 'GET',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: null,
                                error: err,
                                status: 502
                            });
                        }
                        else{
                            return res.status(200).json({
                                method: 'GET',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: item,
                                error: null,
                                status: 200
                            });
                        };
                    });
                });
            //

            /* 
            CRUD: Update route 
            */
                router.put('/:endpoint/:id', (req, res) => {
                    this.connection.query(`
                        UPDATE ${req.params.endpoint} 
                        SET title = "${req.body.title}", content = "${req.body.content}" 
                        WHERE id = ${req.params.id}
                    `, req.body, (err, document) => {
                        if (err) {
                            return res.status(502).json({
                                method: 'PUT',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: null,
                                error: err,
                                status: 502
                            });
                        }
                        else{
                            return res.status(200).json({
                                method: 'PUT',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: document,
                                error: null,
                                status: 200
                            });
                        };
                    });
                });
            //

            /* 
            CRUD: Delete route 
            */
                router.delete('/:endpoint/:id', (req, res) => {
                    this.connection.query(`
                        DELETE FROM ${req.params.endpoint} 
                        WHERE id = ${req.params.id}
                    `, req.body, (err, deletedDocument) => {
                        if (err) {
                            return res.status(502).json({
                                method: 'PUT',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: null,
                                error: err,
                                status: 502
                            });
                        }
                        else{
                            return res.status(200).json({
                                method: 'PUT',
                                route: `/api/${req.params.endpoint}/${req.params.id}`,
                                data: deletedDocument,
                                error: null,
                                status: 200
                            });
                        };
                    });
                });
            //            
        };

        // Start router
        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return router;
        };
    };
//

/*
Export
*/
    module.exports = CrudMongoRouterClass;
//