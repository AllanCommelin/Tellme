/*
Imports
*/
    // Node
    const express = require('express');
    const router = express.Router();

    // Inner
    const PostModel = require('../models/post.schema');
    const CommentModel = require('../models/comment.schema');
//

/*
Routes definition
*/
    class CrudMongoRouterClass {

        // Inject Passport to secure routes
        constructor() {}
        
        // Set route fonctions
        routes(){

            /* 
            CRUD: Create route 
            */
                router.post('/:endpoint', (req, res) => {
                    PostModel.create(req.body)
                    .then( document => res.status(201).json({
                        method: 'POST',
                        route: `/api/${req.params.endpoint}`,
                        data: document,
                        error: null,
                        status: 201
                    }))
                    .catch( err => res.status(502).json({
                        method: 'POST',
                        route: `/api/${req.params.endpoint}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Read all route 
            */
                router.get('/:endpoint', (req, res) => {
                    PostModel.find()
                    .then( documents => res.status(200).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}`,
                        data: documents,
                        error: null,
                        status: 200
                    }))
                    .catch( err => res.status(502).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Read one route
            */
                router.get('/:endpoint/:id', (req, res) => {
                    PostModel.findById(req.params.id)
                    .then( document => res.status(200).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: document,
                        error: null,
                        status: 200
                    }))
                    .catch( err => res.status(502).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Update route 
            */
                router.put('/:endpoint/:id', (req, res) => {
                    PostModel.findById(req.params.id)
                    .then( document => {
                        // Update document
                        document.title = req.body.title;
                        document.content = req.body.content;
                        
                        // Save document
                        document.save()
                        .then( updatedDocument => res.status(200).json({
                            method: 'PUT',
                            route: `/api/${req.params.endpoint}/${req.params.id}`,
                            data: updatedDocument,
                            error: null,
                            status: 200
                        }))
                        .catch( err => res.status(502).json({
                            method: 'PUT',
                            route: `/api/${req.params.endpoint}/${req.params.id}`,
                            data: null,
                            error: err,
                            status: 502
                        }));
                    })
                    .catch( err => res.status(404).json({
                        method: 'PUT',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    }));
                });
            //

            /* 
            CRUD: Delete route 
            */
                router.delete('/:endpoint/:id', (req, res) => {
                    PostModel.findOneAndDelete({ _id: req.params.id })
                    .then( deletedDocument => res.status(200).json({
                            method: 'PUT',
                            route: `/api/${req.params.endpoint}/${req.params.id}`,
                            data: deletedDocument,
                            error: null,
                            status: 200
                    }))
                    .catch( err => res.status(404).json({
                        method: 'PUT',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    }));
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