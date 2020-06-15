const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = requiere('express-session');
const PassportLocal = requiere('passport-local').Strategy;
const app = express();

app.use(express.urlencoded({extended:true}));

app.use(cookieParser('palabra secreta'));

app.use(session({
    secret: 'palabra secreta',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){
    if (username === "subgrupo7" && password === "12345")
        return done(null, {id: 1, name: "grupo"});

    done(null, false);
}))

// {id: 1, name: "grupo"}
// 1 => Serialización
passport.serializeUser(function(user,done){
    done(null,user.id);
})
// Deserialización
passport.deserializeUser(function(id,done){
    done(null,{id: 1, name: "grupo"});
})
app.set('view engine', 'ejs');

app.get("/",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    
    // Si no hemos iniciado sesion redireccionamos a /login
    res.redirect("/login");
},(red,res)=>{
    // Si ya iniciamos nuestra bienvenida
    res.render("/parking"); 
});

app.get("src/login",(req,res)=>{
    // Mostrar el formulario de login
    res.render("login"); 
});

app.post("/login",passport.authenticate('local',{
    // Recibir credenciales e iniciar sesión
    successRedirect:"/",
    failureRedirect: "/login"
}));

    app.listen(4000,()=>console.log("server started"));
