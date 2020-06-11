/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const server = express();
    const app = require('http').Server(server);
    const io = require('socket.io')(app);
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const ejs = require('ejs'); //=> https://www.npmjs.com/package/ejs
    const path = require('path'); //=> https://www.npmjs.com/package/path
    /*
    Mongo Schemas
     */
    const MONGOclass = require('./services/mongo.class');
    const MessageModel = require('./models/message.schema');
    const UserModel = require('./models/user.schema');
    const RoomModel = require('./models/room.schema');

    const port = process.env.PORT;
    const rooms = { };

/*
Server class
*/
    class ServerClass{
        constructor(){
            // Instanciate MongoDB
            this.MONGO = new MONGOclass;
        }

        init(){
            //server.engine( 'html', ejs.renderFile );
            server.set('view engine', 'ejs');
            
            // Static path configuration
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );
            server.use(express.urlencoded({ extended: true }))

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));

            //=> Use CookieParser to setup serverside cookies
            server.use(cookieParser(process.env.COOKIE_SECRET));

            // Start server configuration
            this.config();
        };

        config() {
            // Connect the DB
            this.MONGO.connectDb()
                .then(connection => {
                    // Set Auth router
                    const AuthRouterClass = require('./routers/auth.router');
                    const AuthRouter = new AuthRouterClass();
                    server.use('/api/auth', AuthRouter.init());

                    // Set Mongo router
                    const CrudMongoRouterClass = require('./routers/crud.mongo.router');
                    const crudMongoRouter = new CrudMongoRouterClass();
                    server.use('/api', crudMongoRouter.init());
                    // Set front router
                    //server.get('/*', (req, res) => res.render('index.ejs'));

                    // Users
                    this.user();

                    //Chat
                    this.chat();

                    // Launch server
                    this.launch();
                })
                .catch(connectionError => {
                    console.log(`Mongo connection error: ${connectionError}`)
                })
        };

        user() {
            server.get('/register', (req, res) => res.render('auth/register'));
            server.get('/login', (req, res) => res.render('auth/login'));
        }

        chat() {
            server.get('/', (req, res) => {
                res.render('index', { rooms: rooms })
            });

            server.post('/room', (req, res) => {
                if (rooms[req.body.room] != null) {
                    return res.redirect('/')
                }
                rooms[req.body.room] = { users: {} };
                res.redirect(req.body.room);
                // Send message that new room was created
                io.emit('room-created', req.body.room)
            });

            server.get('/:room', (req, res) => {
                if (rooms[req.params.room] == null) {
                    return res.redirect('/')
                }
                res.render('room', { roomName: req.params.room, rooms: rooms })
            });

            app.listen(3000);

            io.on('connection', socket => {
                socket.on('new-user', (room, name) => {
                    socket.join(room);
                    rooms[room].users[socket.id] = name;
                    socket.to(room).broadcast.emit('user-connected', name)
                });
                socket.on('send-chat-message', (room, message) => {
                    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] });
                    MessageModel.create({ message: message, name: rooms[room].users[socket.id] })
                        .then( document => {
                            console.log('Message created', document)
                        })
                        .catch( err => {
                            console.log('Message don\'t created')
                        });
                });
                socket.on('disconnect', () => {
                    getUserRooms(socket).forEach(room => {
                        socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
                        delete rooms[room].users[socket.id]
                    })
                })
            });

            function getUserRooms(socket) {
                return Object.entries(rooms).reduce((names, [name, room]) => {
                    if (room.users[socket.id] != null) names.push(name)
                    return names
                }, [])
            }
        }

        launch(){
            // Start MongoDB connection
            this.MONGO.connectDb()
            .then( db => {
                // Start server
                server.listen(port, () => {
                    console.log({
                        node: `http://localhost:${port}`,
                        mongo: db.url,
                        mysql: `mysql://${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`
                    });
                });
            })
            .catch( dbErr => console.log('MongoDB Error', dbErr));
        };
    }
//

/* 
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//