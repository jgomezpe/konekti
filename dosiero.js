/**
*
* dosiero.js
* <P>Konekti component for managing files. Also to add JS/HTML/CSS resources as plug-ins. 
* It is a wrap of all the konekti components (util, script, plugin and server)</P>
*
* Copyright (c) 2020 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/
Konekti.script.loadJS('https://konekti.numtseng.com/source/finpunkto.js')

class LocalStorageFileManager extends KonektiClient{
    constructor(id, owner, root){
        super(id)
        this.owner = owner
        this.tree = {"id":root, "caption":root, "plugin":"accordion", "children":[]}
        for( var i=0; i<window.localStorage.length; i++ ){
            var key = window.localStorage.key(i)
            if( key.startsWith(root+'/') ){
                var k = key
                var c = this.tree
                var idx
                k = k.substring(root.length+1)
                while((idx=k.indexOf('/'))>=0){
                    var folder = k.substring(0,idx)
                    var nc = this.child(c, c.id+'/'+folder)
                    if( nc==null ){ 
                        nc = {"id":c.id+'/'+folder, "caption":folder, "children":[]}
                        c.children.push(nc)
                    }
                    c = nc
                    k = k.substring(idx+1)
                }
                if(k.length>0){ c.children.push({"id":c.id+'/'+k, "caption":k}) }
            }
        }
    }

	child( comp, child ){
	    var i=0
	    while( i<comp.children.length && comp.children[i].id!=child ) i++
	    if(i<comp.children.length) return comp.children[i]
	    else return null
	}

    getTree( callback ){ callback(this.tree) }
    
	addFile(file, isFolder ){
	    if( isFolder ){ window.localStorage.setItem(file+'/', '/') }
		else{ window.localStorage.setItem(file, Konekti.client[this.owner].getFile(this.id)) }
	}
	
	removeFile(file){
	    if( file.endsWith('/') ){
            for( var i=window.localStorage.length-1; i>=0; i-- ){
                var key = window.localStorage.key(i)
                if( key.startsWith(file) ){
                    window.localStorage.removeItem(key)
                }
            }    
	    }else{
            window.localStorage.removeItem(file)
	    }
	}

	readFile(file){
		Konekti.client[this.owner].setFile(window.localStorage.getItem(file))
	}
}

class CloudFileManager extends KonektiClient{
	constructor(id, owner, url){
		super(id)
		this.owner = owner
		this.url = url
	}

	folder(tree){
	    this.treecall( tree )
	}
	
	getTree( callback ){ 
	    this.treecall = callback
		var endpoint = new AplikigoEndPoint(this.url)
		endpoint.request(this.id, 'folder', [])
	}
    
    store( ok ){
        if( ok ) Konekti.client[this.owner].storeFile(this.file)
        else console.log('error storing file ' + this.file )
    }
    
	addFile(file, isFolder ){
		if( isFolder ) file = file+'/' 
		this.file = file
		var endpoint = new AplikigoEndPoint(this.url)
		endpoint.request(this.id, 'store', [file, Konekti.client[this.owner].getFile(file)])
	}
	
	delete( ok ){
	    if( ok ) Konekti.client[this.owner].delFile(this.file)
	    else console.log('error deleting file ' + this.file )
	}
	
	removeFile(file){ 
		this.file = file
		var endpoint = new AplikigoEndPoint(this.url)
		endpoint.request(this.id, 'delete', [file])
	}
	
	read(input){
	    if( input != null ) Konekti.client[this.owner].readFile(input) 
	    else console.log('error reading file ' + this.file )
	}

	readFile(file){
		if( file.endsWith('/') ) return 
		this.file = file
		var endpoint = new AplikigoEndPoint(this.url)
		endpoint.request(this.id, 'read', [file])
	}   
}