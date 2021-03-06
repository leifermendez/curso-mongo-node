const mongoose = require('mongoose');

const { Usuarios } = require('./modeloUser')
const { Publicaciones } = require('./modeloPublicaciones')
const { Categories } = require('./modelCategories')

const DB_URI = 'mongodb://localhost:27017/app_youtube_blog'

mongoose.connect(DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log('********* ERROR DE CONEXIÓN *******');
        } else {
            console.log('********* CONEXIÓN CORRECTA *******');
        }
    });


const crearCategoria = () => {
    Categories.create(
        {
            name: 'Salud'
        }
    )
}

const crearUsuario = () => {
    Usuarios.create(
        {
            name: 'Luis (edition)',
            email: 'luis@demo.com',
            numberPhone: '12345678',
            tag: ['edition']
        }
    )
}

const createPublicacion = () => {
    const listPost = [
        {
            title: 'Relaciones publicas',
            description: 'Hola mundo bla bla',
            author: mongoose.Types.ObjectId("6021150a1f183b248c8a8e3f"),
            categories: ['Tech']
        },
        {
            title: 'Noticia IMPORT Covid (Tech)',
            description: 'Hola mundo bla bla',
            author: mongoose.Types.ObjectId("6021150a1f183b248c8a8e3f"),
            categories: ['Tech', 'Salud']
        }
    ]

    Publicaciones.insertMany(listPost)
}

// createPublicacion();

const buscarPorId = async () => {
    const user = await Usuarios.findById('6021150a1f183b248c8a8e3f')
    console.log('EL usuario es ====> ', user);
}

const buscarPorCoincidenciaUno = async () => {
    const post = await Publicaciones.findOne({
        title: 'Mi post!'
    })

    console.log('**** RESULTADO ****', post);
}

const buscarPorCoincidenciaTodos = async () => {
    const post = await Publicaciones.find({
        title: {
            $eq: 'Mi post!'
        }
    })

    console.log('**** RESULTADO ****', post);
}

const buscarOCrear = async () => {
    const post = await Publicaciones.findOneAndUpdate(
        {
            title: '50 cosas sobre mi'
        },
        {
            description: 'Hola aqui me genere automaticamente',
            author: mongoose.Types.ObjectId("6021150a1f183b248c8a8e3f")
        },
        {
            new: true,
            upsert: true
        })

    console.log('****** BUSCAR O CREAR **********', post);
}

const editarPublicacion = async () => {
    const resultado = await Publicaciones.updateMany(
        {
            title: {
                $ne: '50 cosas sobre mi'
            }
        },
        {
            title: 'EDITADO (HOLA cosas)',
            description: ' EDITADO Nueva descripcion'
        },
        (err) => {
            //  console.log('*** ERRROR ***', err);
        }
    )

    console.log('***** RESULTADO EDITADO *****', resultado);
}

const borrarPost = async () => {
    const resultado = await Publicaciones.deleteMany(
        {
            title: 'EDITADO (HOLA cosas)'
        }
    )

    console.log('********* RESULTADO *******', resultado);
}

const publicacionConUsuario = async () => {

    // 1 - Publicaciones ---> 
    const resultado = await Publicaciones.aggregate(
        [
            {
                $lookup:
                {
                    from: "usuarios", // 2
                    localField: "author", // 1 (Publicaciones)
                    foreignField: "_id", // 2
                    as: "usuarioAuthor"
                }
            },
            { $unwind: "$usuarioAuthor" },
            { $match: { title: "Mi post!" } }
        ]
    )

    console.log('*********** RESULTADOS ***********', resultado);

}

const listaCategoriesConPublicaciones = async () => {

    const resultado = await Publicaciones.aggregate( // (1) Padre --- (Categories)
        [
            {
                $lookup:
                {
                    from: "categories", // (2) Hijo --- (publicaciones)
                    let: {
                        aliasNombreCategoria: "$categories"// (1) Nombre de la categoria "Tech" (string)
                    },
                    pipeline: [ // (2) publicaciones
                        {
                            $match: {
                                $expr: {
                                    $in: ["$name", "$$aliasNombreCategoria"] // [Salud]
                                }
                            }
                        }
                    ],
                    as: 'listDeCategorias'
                }
            }
        ]
    )

    console.log('*********** RESULTADOS ***********', JSON.stringify(resultado));
}

// crearCategoria()

// publicacionConUsuario();


// borrarPost();
//  editarPublicacion()
//  buscarOCrear()
//  buscarPorCoincidenciaTodos()
// buscarPorId();
// crearUsuario()
// createPublicacion()
listaCategoriesConPublicaciones();