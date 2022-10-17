Konekti.load('dropdown', function(){
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
        var login = {'plugin':'login', 'setup':[id+'login', id, captions, config]}

        var input = config.input
        var oldpwd = {'plugin':'raw', 'setup':[id+'oldpwd', '', 
            {'tag':'input', 'class':input.class, 'style':input.style, 'placeholder':captions.oldpassword || 'Current',
            'name':id+'oldpwd', 'type':'password'}
        ]}

        var newpwd = {'plugin':'raw', 'setup':[id+'newpwd', '', 
            {'tag':'input', 'class':input.class, 'style':input.style, 'placeholder':captions.newpassword || 'New',
            'name':id+'newpwd', 'type':'password'}
        ]}
        var change = {'plugin':'accordion', 'setup':[id+'cpwd', 'fa-key', 'Cambiar clave', {
            'plugin':'raw', 'setup':[id+'ccpwd', [
                oldpwd, newpwd,
                {'plugin':'raw', 'setup':[id+'pwdlog', '', {'class':' w3-red '}]},
                {'plugin':'btn', 'setup':[id+'updatepwd', 'fa-user-secret', 'Actualizar', {'client':id, 'method':'updatepwd'}, {'class':' w3-block  w3-left-align'}]}
            ]]},
            false, '', {}]
        }
        var logout = {'plugin':'btn', 'setup':[id+'logout', 'fa-sign-out', 'Salir', {'client':id, 'method':'logout'}, {'class':' w3-block w3-left-align'}]}
        if(extra==null) extra = []
        else if(!Array.isArray(extra)) extra=[extra]
        extra.push(change)
        extra.push(logout)
        var connected = {'plugin':'raw', 'setup':[id+'connected', extra, {'class':'w3-small', 'style':'display:none;'}]}
        var c = super.setup(parent, id, "fa-user", "", [login,connected])
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
Konekti.loginbtn = function(parent, id, extra, server, captions, config, callback){
    var args = []
    for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
    if(args.length==5) args[5] = {}
    if(args.length==6) args[6] = function(){}
    Konekti.add('loginbtn', ...args)
}
})