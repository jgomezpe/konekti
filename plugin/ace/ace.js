/** Konekti Plugin for ACE editors */
class AcePlugIn extends KonektiPlugIn{
    /** Creates a Plugin for ACE editors */
    constructor(){
        super('ace')
        this.loaded = false
        this.view = []
    }
    
    /**
     * Connects components as soon as the ACE library is loaded
     */
    done(){
        this.loaded = true
        while( this.view.length > 0 ){
            var thing = this.view[0]
            this.view.shift()
            this.connect( thing )
        }
    }
    
    /**
     * Defines a dynamic language mode taking as basis the OOP mode
     * @param lang Cinfiguration information for the defined language
     */
    define( lang ){
        var id = lang.mode;
        ace.define(
            "ace/mode/"+lang.mode+"_highlight_rules",
            ["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], 
            function(require, exports, module) {
                "use strict";
                var oop = require("../lib/oop");
                var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
                var EditorHighlightRules = function() {
                    this.$rules = lang.tokens;
                    this.normalizeRules();
                };
                EditorHighlightRules.metaData = {
                    fileTypes: lang.fileTypes,
                    foldingStartMarker: '(%\\s*region \\w*)|([a-z]\\w*.*:- ?)',
                    foldingStopMarker: '(%\\s*end(\\s*region)?)|(?=\\.)',
                    keyEquivalent: '^~P',
                    name: lang.qName,
                    scopeName: 'source.'+lang.mode
                };
                oop.inherits(EditorHighlightRules, TextHighlightRules);
                exports.EditorHighlightRules = EditorHighlightRules;
            }
        );
        ace.define(
            "ace/mode/folding/cstyle",
            ["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], 
            function(require, exports, module) {
                "use strict";
                var oop = require("../../lib/oop");
                var Range = require("../../range").Range;
                var BaseFoldMode = require("./fold_mode").FoldMode;
                var FoldMode = exports.FoldMode = function(commentRegex) {
                    if (commentRegex) {
                        this.foldingStartMarker = new RegExp( this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start) );
                        this.foldingStopMarker = new RegExp( this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end) );
                    }
                };
                oop.inherits(FoldMode, BaseFoldMode);
                (function() {
                    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
                    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
                    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
                    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
                    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
                    this._getFoldWidgetBase = this.getFoldWidget;
                    this.getFoldWidget = function(session, foldStyle, row){
                        var line = session.getLine(row);
                        if (this.singleLineBlockCommentRe.test(line)) { if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line)) return ""; }
                        var fw = this._getFoldWidgetBase(session, foldStyle, row);
                        if (!fw && this.startRegionRe.test(line)) return "start"; // lineCommentRegionStart	
                        return fw;
                    };
                    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
                        var line = session.getLine(row);
                        if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);
                        var match = line.match(this.foldingStartMarker);
                        if (match) {
                            var i = match.index;
                            if (match[1]) return this.openingBracketBlock(session, match[1], row, i);
                            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
                            if (range && !range.isMultiLine()){ 
                                if (forceMultiline) { range = this.getSectionRange(session, row); }
                                else if (foldStyle != "all") range = null;
                            }
                            return range;
                        }
                        if (foldStyle === "markbegin") return;
                        var match = line.match(this.foldingStopMarker);
                        if (match) {
                            var i = match.index + match[0].length;
							if (match[1]) return this.closingBracketBlock(session, match[1], row, i);
                            return session.getCommentFoldRange(row, i, -1);
                        }
                    };
                    this.getSectionRange = function(session, row) {
                        var line = session.getLine(row);
                        var startIndent = line.search(/\S/);
                        var startRow = row;
                        var startColumn = line.length;
                        row = row + 1;
                        var endRow = row;
                        var maxRow = session.getLength();
                        while (++row < maxRow) {
                            line = session.getLine(row);
                            var indent = line.search(/\S/);
                            if (indent === -1) continue;
                            if  (startIndent > indent) break;
                            var subRange = this.getFoldWidgetRange(session, "all", row);
                            if (subRange) {
                                if (subRange.start.row <= startRow) { break; }
                                else if (subRange.isMultiLine()) { row = subRange.end.row; } 
                                else if (startIndent == indent) { break; }
                            }
                            endRow = row;
                        }
                        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
                    };
                    this.getCommentRegionBlock = function(session, line, row) {
                        var startColumn = line.search(/\s*$/);
                        var maxRow = session.getLength();
                        var startRow = row;
                        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
                        var depth = 1;
                        while (++row < maxRow) {
                            line = session.getLine(row);
                            var m = re.exec(line);
                            if (!m) continue;
                            if (m[1]) depth--;
                            else depth++;
                            if (!depth) break;
                        }
                        var endRow = row;
                        if (endRow > startRow) { return new Range(startRow, startColumn, endRow, line.length); }
                    };
                }).call(FoldMode.prototype);
            }
        );
        ace.define(
            "ace/mode/"+id,
            ["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/"+id+"_highlight_rules","ace/mode/folding/cstyle"],
            function(require, exports, module) {
                "use strict";
                var oop = require("../lib/oop");
                var TextMode = require("./text").Mode;
                var EditorHighlightRules = require("./"+id+"_highlight_rules").EditorHighlightRules;
                var FoldMode = require("./folding/cstyle").FoldMode;
                var Mode = function() {
                    this.HighlightRules = EditorHighlightRules;
                    this.foldingRules = new FoldMode();
                    this.$behaviour = this.$defaultBehaviour;
                };
                oop.inherits(Mode, TextMode);
                (function() {
                    this.lineCommentStart = "%";
                    this.blockComment = {start: "/*", end: "*/"};
                    this.$id = "ace/mode/"+id;
                }).call(Mode.prototype);
                exports.Mode = Mode;
            }
        );
    }
    
    /**
     * Load an ACE editor 
     * @param id If of the ACE editor
     */
    load( id ){ 
        this.view.push( id )
        if( this.loaded ) this.done()
    }

    /** 
     * Connects (extra steps) the ACE editor with the GUI component
     * @param thing ACE editor configuration
     */
    extra( thing ){
        if( this.loaded ){ new AceEditor(thing) }else this.view.push( thing )
    }
}

/** An Ace Editor */
class AceEditor extends KonektiEditor{
	/**
	 * Creates an Ace Editor
	 * @param thing Ace editor configuration
	 */
    constructor(thing){
        super(thing.id)
        if( typeof thing.client !== 'undefined' && thing.client != null )
            this.listener.push(thing.client)
        var id = this.id
        var x = this
        
        x.gui = x.vc('Ace')
        x.edit = ace.edit(id+'Ace');
        x.sui = x.gui.getElementsByClassName('ace_scroller')[0]
        x.sbui = x.gui.getElementsByClassName('ace_scrollbar-v')[0].getElementsByClassName('ace_scrollbar-inner')[0]
        
        if( thing.code != null ){
            thing.code.cid = id
            Konekti.plugin.ace.define(thing.code)
        } 
		
        x.edit.setFontSize("16px")
        if(typeof thing.initial != 'undefined'){
            x.gui.setAttribute('initial', thing.initial)
            x.edit.setValue(thing.initial,1)
        } 
		
        x.edit.session.setMode("ace/mode/"+thing.mode);
        if( thing.theme!=null) this.edit.setTheme("ace/theme/"+thing.theme);
            x.edit.setShowPrintMargin(false);

        if(typeof thing.annotation == 'boolean' && thing.annotation)
            x.edit.session.on("changeAnnotation", function () {
                var annot = x.edit.session.getAnnotations();
                for( var i=0; i<x.listener.length; i++ )
                    if( x.listener[i] != null && Konekti.client(x.listener[i]) != null ) Konekti.client(x.listener[i]).annotation(id, annot)                
            });	
            
       if(typeof thing.onchange == 'boolean' && thing.onchange)
            x.edit.session.on('change', function(){ 
                for( var i=0; i<x.listener.length; i++ )
                    if( x.listener[i] != null && Konekti.client(x.listener[i]) != null ) Konekti.client(x.listener[i]).onchange(id)
            })
    }
	
    /**
     * Gets current text in the editor
     * @return Current text in the editor
     */
    getText(){ return this.edit.getValue() }

    /**
     * Sets text in the editor
     * @param txt Text to set in the editor
     */
    setText(txt){
        this.edit.focus();
        this.edit.setValue(txt, 1) 
    }

	/**
	 * Sets current position in the editor
	 * @param row Row for the cursor
	 * @param column Column for the cursor
	 */
	locateCursor(row, column){
    	this.edit.moveCursorTo(row, column);
    	this.edit.focus();
	}
	
	/**
	 * Gets current position in the editor
	 * @return [row,column] for the cursor
	 */
	cursorLocation(){ return this.edit.selection.getCursor() }

	/**
	 * Highlights a row in the editor
	 * @param row Row to highlight
	 */
	highlight(row){ this.locateCursor( row,1 ) }

	/**
	 * Gets current position in the editor (character count)
	 * @return Position of the cursor (character count)
	 */
	cursorIndex(){ return this.edit.session.doc.positionToIndex(this.edit.selection.getCursor()) }
	
	/**
	 * Sets current position in the editor (character count)
	 * @param pos Position of the cursor (character count)
	 */
	locateCursorIndex(pos){ this.edit.selection.moveTo(this.edit.session.doc.indexToPosition(pos)) }

	/**
	 * Updates the position of the scroll associated to the editor
	 * @param pos New position for the scroll
	 */
	scrollTop(pos){
	    var x=this
    	var tout
    	function check(){
    	    var h = parseInt(x.sbui.style.height, 10)
    	    var ls = parseInt(x.sui.style.lineHeight,10)
    	    var tlines = h/ls
    	    if(tlines != x.edit.session.getLength() ) tout = setTimeout(check,100)
            else{
            	if(typeof pos=='undefined') pos = h
            	var line = Math.floor(pos/ls)
                x.edit.scrollToLine(line, true, true, function () {});
                x.edit.gotoLine(line, 0, true);
                clearTimeout(tout)
            }
    	}
    	check()
	}
}

/**
 * @function
 * Konekti ace
 * @param container Id of the component that will contain the ace editor
 * @param config Configuration of the ace editor
 */
Konekti.ace = function(container, config ){
    if( config===undefined || config===null ) config = {'client':'client'}
    config.id = container
    return Konekti.plugin.ace.connect(config)
}

new AcePlugIn()
Konekti.core.resource.JS("https://ace.c9.io/build/src/ace", function (){ Konekti.plugin.ace.done() } )




