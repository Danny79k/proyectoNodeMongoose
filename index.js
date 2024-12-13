const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// post request de los datos de empleado
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://usermm:majada@majadabae.tnxacrg.mongodb.net/MongoPractica');
    console.log("conectado");
    const empleado = new mongoose.Schema({
        name: String,
        edad: { type: Number, max: 99, min: 18 },
        cargo: String
    });

    const casa = new mongoose.Schema({
        direccion: String,
        dimensiones: Number,
        precio: Number
    },{timestamps:true});

    const cliente = new mongoose.Schema({
        name: { type: String, unique: true },
        documento: String,
    });

    // MODELO --> TABLA hemos creado los 3 modelos que vamos a usar par ael proyecto

    const mongo_empleado = mongoose.model('empleado', empleado);
    const mongo_casa = mongoose.model('casa', casa);
    const mongo_cliente = mongoose.model('cliente', cliente);

    // introduciendo el empleado

    app.post('/submit/empleado', async (req, res) => {

        try {
            const campo1 = req.body.campo1;
            const campo2 = req.body.campo2;
            const campo3 = req.body.campo3;
            const tabla_empleado = new mongo_empleado({
                name: campo1,
                edad: campo2,
                cargo: campo3
            });
            const resultado = await tabla_empleado.save();
            res.redirect('http://localhost:5501/form_empleados.html')
        } catch (error) {
            // atencion: si se usa otro puerto para el live server el boton de vuelta no funcionara
            res.send(`
                <p>NO SE PUDO INTRODUCIR</p>
                <a href="http://127.0.0.1:5501/form_empleados.html">Volver</a>
            `);
        }
    })

    // introduciendo la casa

    app.post('/submit/casa', async (req, res) => {

        try {
            const campo1 = req.body.campo1;
            const campo2 = req.body.campo2;
            const campo3 = req.body.campo3;
            const tabla_casa = new mongo_casa({
                direccion: campo1,
                dimensiones: campo2,
                precio: campo3,
            });
            const resultado = await tabla_casa.save();
            res.redirect('http://localhost:5501/form_casa.html')
        } catch (error) {
            // atencion: si se usa otro puerto para el live server el boton de vuelta no funcionara
            res.send(`
                <p>NO SE PUDO INTRODUCIR</p>
                <a href="http://127.0.0.1:5501/form_casa.html">Volver</a>
            `);
        }
    })

    // introduciendo el cliente

    app.post('/submit/cliente', async (req, res) => {

        try {
            const campo1 = req.body.campo1;
            const campo2 = req.body.campo2;
            const tabla_cliente = new mongo_cliente({
                name: campo1,
                documento: campo2,
            });
            const resultado = await tabla_cliente.save();
            res.redirect('http://localhost:5501/form_cliente.html')
        } catch (error) {
            // atencion: si se usa otro puerto para el live server el boton de vuelta no funcionara
            res.send(`
                <p>NO SE PUDO INTRODUCIR</p>
                <a href="http://127.0.0.1:5501/form_cliente.html">Volver</a>
            `);
        }
    })


    //mostrando las listas de las 3 tablas

    app.get('/lista/empleados', async (req, res) => {

        try {
            const empleados = await mongo_empleado.find().exec();
            let html = `<h1>Lista de empleados</h1>
            <table border="1">
                <thead>
                <th>id</th>
                <th>Nombre</th>
                <th>edad</th>
                <th>cargo</th>
                <th colspan="2">acciones</th>
                </thead>`

            empleados.forEach(empleado => {
                html += `
                <tr>
                <td>${empleado._id}</td>
                <td>${empleado.name}</td>
                <td>${empleado.edad}</td>
                <td>${empleado.cargo}</td>
                <td><a href="http://localhost:3000/borrado/empleado/${empleado._id}">eliminar</a</td>
                <td><a href="http://localhost:3000/update/empleado/${empleado._id}">editar</a</td>
                `;
            });
            html += `</tr>
                </table>`;
            res.send(`${html}<a href="http://127.0.0.1:5501/form_empleados.html">Volver</a>`);
        } catch (error) {
            res.send(`
                <p>NO SE PUDO ENCONTRAR NADA</p>
                <a href="http://127.0.0.1:5501/form_empleados.html">Volver</a>
            `);
        }
    })
    app.get('/lista/casas', async (req, res) => {

        try {
            const casas = await mongo_casa.find().exec();
            let html = `<h1>Lista de casas</h1>
            <table border="1">
                <thead>
                <th>id</th>
                <th>direccion</th>
                <th>dimensiones</th>
                <th>precio</th>
                <th>fecha creacion</th>
                <th>fecha modificacion</th>
                <th colspan="2">acciones</th>
                </thead>`

            casas.forEach(casa => {
                html += `
                <tr>
                <td>${casa._id}</td>
                <td>${casa.direccion}</td>
                <td>${casa.dimensiones} m/2</td>
                <td>${casa.precio} €</td>
                <td>${casa.createdAt}</td>
                <td>${casa.updatedAt}</td>
                <td><a href="http://localhost:3000/borrado/casa/${casa._id}">eliminar</a</td>
                <td><a href="http://localhost:3000/update/casa/${casa._id}">editar</a</td>
                `;
            });
            html += `</tr>
                </table>`;
            res.send(`${html}<a href="http://127.0.0.1:5501/form_casa.html">Volver</a>`);
        } catch (error) {
            res.send(`
                <p>NO SE PUDO ENCONTRAR NADA</p>
                <a href="http://127.0.0.1:5501/form_casa.html">Volver</a>
            `);
        }
    })
    app.get('/lista/clientes', async (req, res) => {

        try {
            const clientes = await mongo_cliente.find().exec();
            let html = `<h1>Lista de clientes</h1>
            <table border="1">
                <thead style="background-color:red; color:white">
                <th>id</th>
                <th>Nombre</th>
                <th>documento</th>
                <th colspan="2">acciones</th>
                </thead>`

            clientes.forEach(cliente => {
                html += `
                <tr>
                <td>${cliente._id}</td>
                <td>${cliente.name}</td>
                <td>${cliente.documento}</td>
                <td><a href="http://localhost:3000/borrado/cliente/${cliente._id}">eliminar</a</td>
                <td><a href="http://localhost:3000/update/cliente/${cliente._id}">editar</a</td>
                `;
            });
            html += `</tr>
                </table>`;
            res.send(`${html}<a href="http://127.0.0.1:5501/form_cliente.html">Volver</a>`);
        } catch (error) {
            res.send(`
                <p>NO SE PUDO ENCONTRAR NADA</p>
                <a href="http://127.0.0.1:5501/form_cliente.html">Volver</a>
            `);
        }
    })

    // borrado

    app.get('/borrado/empleado/:id', async (req, res) => {
        let id = req.params.id;
        const borrar_empleado = await mongo_empleado.findOneAndDelete(id);
        res.redirect('http://localhost:3000/lista/empleados');
    })
    app.get('/borrado/casa/:id', async (req, res) => {

        let id = req.params.id;
        const borrar_casa = await mongo_casa.findOneAndDelete(id);
        res.redirect('http://localhost:3000/lista/casas');
    })
    app.get('/borrado/cliente/:id', async (req, res) => {

        let id = req.params.id;
        const borrar_cliene = await mongo_cliente.findOneAndDelete(id);
        res.redirect('http://localhost:3000/lista/clientes');
    })

    // update

    // empleados

    app.get('/update/empleado/:id', async (req, res) => {
        try {
            const empleado = await mongo_empleado.findById(req.params.id);

            res.send(`
                <form action="http://localhost:3000/update/empleado/${empleado._id}" method="POST" class="d-flex justify-content-center col-6">
                    <div class="d-flex flex-column text-center">
                        <p><input type="text" name="nombre" class="rounded-2 input-group-text" placeholder="nombre" value="${empleado.name}"></p>
                        <p><input type="number" name="edad" class="rounded-2 input-group-text" placeholder="edad" value="${empleado.edad}"></p>
                        <p><input type="text" name="cargo" class="rounded-2 input-group-text" placeholder="cargo" value="${empleado.cargo}"></p>
                        <p><input type="submit" value="enviar" class="btn btn-secondary"></p>
                    </div>
                </form>
            `);
        } catch (error) {
            res.send('Error al obtener el empleado');
        }
    });

    app.post('/update/empleado/:id', async (req, res) => {
        try {
            const { nombre, edad, cargo } = req.body;

            await mongo_empleado.findByIdAndUpdate(req.params.id, {
                name: nombre,
                edad: edad,
                cargo: cargo
            });

            res.redirect('http://localhost:3000/lista/empleados');
        } catch (error) {
            res.send('Error al actualizar el empleado');
        }
    });

    // casas

    app.get('/update/casa/:id', async (req, res) => {
        try {
            const casa = await mongo_casa.findById(req.params.id);

            res.send(`
                <form action="http://localhost:3000/update/casa/${casa._id}" method="POST" class="d-flex justify-content-center col-6">
                    <div class="d-flex flex-column text-center">
                        <p><input type="text" name="direccion" class="rounded-2 input-group-text" placeholder="nombre" value="${casa.direccion}"></p>
                        <p><input type="number" name="dimensiones" class="rounded-2 input-group-text" placeholder="edad" value="${casa.dimensiones}"></p>
                        <p><input type="number" name="precio" class="rounded-2 input-group-text" placeholder="cargo" value="${casa.precio}"></p>
                        <p><input type="submit" value="enviar" class="btn btn-secondary"></p>
                    </div>
                </form>
            `);
        } catch (error) {
            res.send('Error al obtener la casa');
        }
    });

    app.post('/update/casa/:id', async (req, res) => {
        try {
            const { direccion, dimensiones, precio } = req.body;

            await mongo_casa.findByIdAndUpdate(req.params.id, {
                direccion: direccion,
                dimensiones: dimensiones,
                precio: precio
            });

            res.redirect('http://localhost:3000/lista/casas');
        } catch (error) {
            res.send('Error al actualizar la casa');
        }
    });

    // clientes

    app.get('/update/cliente/:id', async (req, res) => {
        try {
            let cliente = await mongo_cliente.findById(req.params.id);

            res.send(`
                <form action="http://localhost:3000/update/cliente/${cliente._id}" method="POST" class="d-flex justify-content-center col-6">
                    <div class="d-flex flex-column text-center">
                        <p><input type="text" name="nombre" class="rounded-2 input-group-text" placeholder="nombre" value="${cliente.name}"></p>
                        <p><input type="text" name="documento" class="rounded-2 input-group-text" placeholder="edad" value="${cliente.documento}"></p>
                        <p><input type="submit" value="enviar" class="btn btn-secondary"></p>
                    </div>
                </form>
            `);
        } catch (error) {
            res.send('Error al obtener el cliente');
        }
    });

    app.post('/update/cliente/:id', async (req, res) => {
        try {
            const { nombre, documento } = req.body;

            await mongo_cliente.findByIdAndUpdate(req.params.id, {
                name: nombre,
                documento: documento,
            });

            res.redirect('http://localhost:3000/lista/clientes');
        } catch (error) {
            res.send('Error al actualizar el cliente');
        }
    });
}




