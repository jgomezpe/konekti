Konekti.load(['dropdown'], function(){

/**
 * A login button plugin (dropdown with login/logout, registration, and extra information component)
 */
class LoginBtnPlugin extends DropDownPlugin{
    /**
     * Creates a login button plugin
     */
    constructor(id='loginbtn'){ super(id) }

    /**
     * Creates a login button configuration object
     * @param {*} parent Parent component of the login button component
     * @param {*} id Login id
     * @param {*} extra Additional component that is shown when the user is connected (may be null if not required)
     * @param {*} server Server responsable for login operations (login/logout, registration code, etc)
     * @param {*} captions Labels for the gui components (password, email, etc)
     * @param {*} config  Style of the components (input, buttons, etc)
     */
    setup(parent, id, extra, server, captions, config){
        config = Konekti.config(config)
        config.user = Konekti.config(config.user)
        var login = {'plugin':'login', 'setup':[id+'login', id, captions, config]}

		var input = config.input
		input.tag = 'input'
		input.width = '100%'
		input.class = input.class || ' w3-input ' 
		
        var old_cfg = Konekti.config(input)
		old_cfg.placeholder = captions.oldpassword || 'current'
		old_cfg.type = 'password'
		old_cfg.name = id+'oldpwd'
		old_cfg.style['font-family'] ='FontAwesome, Arial, Verdana, sans-serif;'
		var oldpwd = {'plugin':'raw', 'setup':[id+'oldpwd', '', old_cfg]}

        var new_cfg = Konekti.config(input)
		new_cfg.placeholder = captions.newpassword || 'new'
		new_cfg.type = 'password'
		new_cfg.name = id+'newpwd'
		new_cfg.style['font-family'] ='FontAwesome, Arial, Verdana, sans-serif;'
		var newpwd = {'plugin':'raw', 'setup':[id+'newpwd', '', new_cfg]}

        var change = {'plugin':'accordion', 'setup':[id+'cpwd', {'icon':'fa-key', 'caption':'Cambiar clave'}, {
            'plugin':'raw', 'setup':[id+'ccpwd', [
                oldpwd, newpwd,
                {'plugin':'raw', 'setup':[id+'pwdlog', '', {'class':' w3-red ', 'width':'100%'}]},
                {'plugin':'btn', 'setup':[id+'updatepwd', 'fa-user-secret', 'Actualizar', {'client':id, 'method':'updatepwd'}, {'class':' w3-block  w3-left-align'}]}
            ]]},
            false, '', config.user]
        }
        var logout = {'plugin':'btn', 'setup':[id+'logout', 'fa-sign-out', 'Salir', {'client':id, 'method':'logout'}, {'class':' w3-block w3-left-align'}]}
        if(extra==null) extra = []
        else if(!Array.isArray(extra)) extra=[extra]
        extra.push(change)
        extra.push(logout)
        var cfg = Konekti.config(config.user)
        cfg.style.display = 'none'
        var connected = {'plugin':'raw', 'setup':[id+'connected', extra, cfg]}
        var c = super.setup(parent, id, "fa-user", "", {'plugin':'raw', 'setup':[id+'content', [login,connected], config.btn]})
        c.server = server
        c.captions = captions
        return c
    }

    /**
     * Creates a login button
     * @param {*} config Login button configuration
     */
     client(config){ return new LoginBtn(config) }
}

/** Registers the login button plugin in Konekti */
new LoginBtnPlugin()

/**
 * Login button client
 */
class LoginBtn extends DropDown{
    /**
     * Creates a login button
     * @param {*} config Login button configuration
     */
    constructor(config){ super(config) }

    /**
     * Calls the server's login method and updates gui accordingly
     * @param {*} user User information (email)
     * @param {*} password password information
     */
    login(user,password){
        var x = this
        x.server.login(user, password, function(){
            Konekti.client[x.id+'login'].log()
            x.vc('login').style.display = 'none'
            x.vc('connected').style.display = 'block'
            Konekti.resize()
        }, function(){ Konekti.client[x.id+'login'].log(x.captions.invaliduser) })
    }

    /**
     * Calls the server's register method and updates gui accordingly
     * @param {*} user User information (email)
     * @param {*} password password information
     */
    register(user,password){
        var x = this
        x.server.register(user, password, function(){ Konekti.client[x.id+'login'].showcode() }, 
            function(){ Konekti.client[x.id+'login'].log(x.captions.alreadyuser) })	
    }

    /**
     * Calls the server's registercode method and updates gui accordingly
     * @param {*} code code information
     */
    registercode(code){
        var x = this
        x.server.registercode(code, function(){
            Konekti.client[x.id+'login'].clear()
            Konekti.client[x.id+'login'].hidecode()
            x.vc('login').style.display = 'none'
            x.vc('connected').style.display = 'block'	
            Konekti.resize()
        }, function(){ Konekti.client[x.id+'login'].log(x.captions.invalidcode) })	
    }

    /**
     * Calls the server's remember method and updates gui accordingly
     * @param {*} user user information (email)
     */
    remember(user){
        if(user != ''){
            var x = this
            x.server.remember(user, function(){ Konekti.client[x.id+'login'].log(x.captions.send+user) },
            function(){ Konekti.client[x.id+'login'].log(x.captions.invaliduser) })
        }
    }

    /**
     * Calls the server's logout method and updates gui accordingly
     */
    logout(){
        var x = this
        x.server.logout()
        Konekti.client[x.id+'login'].clear()
        Konekti.client[x.id+'cpwd'].show()
        x.vc('login').style.display = 'block'
        x.vc('connected').style.display = 'none'	
        x.vc('oldpwd').value = ''
        x.vc('newpwd').value = ''
        x.vc('pwdlog').innerHTML = ''
        Konekti.resize()
    }

    /**
     * Calls the server's logout method with information from the gui and updates it accordingly
     */
    updatepwd(){
        var x = this
        var newpassword = x.vc('newpwd').value
        var oldpassword = x.vc('oldpwd').value

        x.server.updatepwd( newpassword, oldpassword, function(){
            x.vc('oldpwd').value = ''
            x.vc('newpwd').value = ''
            x.vc('pwdlog').innerHTML = ''
            Konekti.client[x.id+'cpwd'].show()
        }, function(){ x.vc('pwdlog').innerHTML = x.captions.invalidpassword })
    }
}

/**
 * Creates a login button component 
 * @param {*} parent Parent component of the login button component
 * @param {*} id Login id
 * @param {*} extra Additional component that is shown when the user is connected (may be null if not required)
 * @param {*} server Server responsable for login operations (login/logout, registration code, etc)
 * @param {*} captions Labels for the gui components (password, email, etc)
 * @param {*} config  Style of the components (input, buttons, etc)
 * @param {*} callback Function that is called when login component is ready
 */
Konekti.loginbtn = function(id, extra, server, captions, config={}, callback=function(){}){
    Konekti.add({'plugin':'loginbtn', 'setup':['body', id, extra, server, captions, config]}, callback)
}
})
