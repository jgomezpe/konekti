/**
 * Login plugin
 */
class LoginPlugin extends PlugIn{
	constructor(id='login'){ super(id) }

    /**
     * Creates a login component configuration
     * @param {*} parent Parent component of the login component
     * @param {*} id Login id
     * @param {*} server Server responsable for login operations (login/signin,registration code, etc)
     * @param {*} captions Labels for the gui components (password, email, etc)
     * @param {*} config  Style of the components (input, buttons, etc)
     * @returns A login configuration object
     */
	setup(parent, id, server, captions, config={}){		
		config.input = config.input || {}
		var input = config.input
		input.class = (input.class || '') + ' col-form-label form-control '
		input.style = 'width:100%;font-family: FontAwesome, Arial, Verdana, sans-serif;'+(input.style || '')

		var email = {'plugin':'raw', 'setup':[id+'email', '', 
			{'tag':'input', 'class':input.class, 'style':input.style, 'placeholder':captions.email || 'email',
			'name':id+'email', 'type':'text'}
		]}

		var password = {'plugin':'raw', 'setup':[id+'password', '', 
			{'tag':'input', 'class':input.class, 'style':input.style, 'placeholder':captions.password || 'password',
			'name':id+'password', 'type':'password'}
		]}

		config.btn = config.btn || {}
		var btncfg = config.btn
		btncfg.class = 'w3-border-bottom '+(btncfg.class || '')
		var btn=[
			{'plugin':'btn', 'setup':[id+"login", "fa-sign-in", captions.login, {'client':id, 'method':'login'}, Object.assign({}, btncfg)]},
			{'plugin':'btn', 'setup':[id+"remember", "fa-info-circle", captions.remember, {'client':id, 'method':'remember'}, Object.assign({}, btncfg)]},
			{'plugin':'btn', 'setup':[id+"register", "fa-user-plus", captions.register, {'client':id, 'method':'register'}, Object.assign({}, btncfg)]}
		]		
		var navbar = {'plugin':'navbar', 'setup':[id+'navbar', btn, '']}

		var code = {'plugin':'raw', 'setup':[id+'code', '', 
			{'tag':'input', 'class':input.class, 'style':input.style, 'placeholder':captions.code || 'code',
			'name':id+'code', 'type':'text'}
		]}
		var codebtn = {'plugin':'btn', 'setup':[id+"codebtn", "fa-send", captions.send, {'client':id, 'method':'registercode'}, btncfg]}

		var log = {'plugin':'raw', 'setup':[id+'log', '', {'class':' w3-red '}]}

		config = config.user || {}
		config.class = (config.class || '') + ' w3-card '
		var c = super.setup(parent, id, [email, password, navbar, code, codebtn, log], config)
		c.server = server
		return c
	}
	
    /**
     * Creates a login client
     * @param {*} config Login configuration
     * @returns A login client
     */
	client(config){ return new LoginClient(config) }
}

/** Registers login plugin in Konekti */
new LoginPlugin()

/**
 * A Login client
 */
class LoginClient extends Client{
    /**
     * Creates a login client
     * @param {*} config Login configuration
     * @returns A login client
     */
     constructor(config){ 
		super(config) 
		this.hidecode()
	}

    /**
     * Shows the registration code gui
     */
	showcode(){
		this.vc('code').style.display = 'block'
		this.vc('codebtn').style.display = 'block'
	}

    /**
     * Hides the registration code gui
     */
     hidecode(){
		this.vc('code').style.display = 'none'
		this.vc('codebtn').style.display = 'none'
	}

    /**
     * Calls the login method of the server (takes info fromthe login gui)
     */
	login(){ Konekti.client[this.server].login(this.vc('email').value, this.vc('password').value) }
	
    /**
     * Calls the register method of the server (takes info fromthe login gui)
     */
    register(){ Konekti.client[this.server].register(this.vc('email').value, this.vc('password').value) }

    /**
     * Calls the remember method of the server (takes info fromthe login gui)
     */
    remember(){ Konekti.client[this.server].remember(this.vc('email').value) }

    /**
     * Calls the registration code method of the server (takes info fromthe login gui)
     */
    registercode(){ Konekti.client[this.server].registercode(this.vc('code').value) }

    /**
     * Shows error messages if produced
     * @param {*} message Error mesage
     */
	log(message=''){ this.vc('log').innerHTML = message	}

    /**
     * Cleans the login gui
     */
	clear(){
		this.vc('email').value = ''
		this.vc('password').value = ''
		this.vc('code').value = ''
		this.log()
		this.hidecode()
	}
}

/**
 * Creates a login component 
 * @param {*} parent Parent component of the login component
 * @param {*} id Login id
 * @param {*} server Server responsable for login operations (login/signin,registration code, etc)
 * @param {*} captions Labels for the gui components (password, email, etc)
 * @param {*} config  Style of the components (input, buttons, etc)
 * @param {*} callback Function that is called when login component is ready
 */
Konekti.login = function(parent, id, server, captions, config, callback){
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==4) args[4] = {}
	if(args.length==5) args[5] = function(){}
	Konekti.add('login', ...args)
}