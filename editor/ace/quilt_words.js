function quilt_tokens(){
	return { start: 
		[
			{ token: 'variable.parameter', regex: '\\b[A-Z$]\\w*\\b' },
			{ token: 'paren.lparen', regex : '[\\(]'},
			{ token: 'paren.rparen', regex : '[\\)]'},
			{ token: 'punctuation.separator.parameters', regex: ',' },
			{ token: 'keyword.operator.definition', regex: '='},
			{ token: 'keyword.operator', regex: '[@|]'},
			{ token: [ 'punctuation.definition.comment', 'comment.line.percentage' ], regex: '(%)(.*$)'  },
			{ token: 'constant.language', regex: '\\b(?:horizontal|diagonal|corner|empty)+\\b' },
			{ token: 'keyword', regex: '\\b(?:rot|sew)\\b' },
			{ token: 'constant.other.atom.quilt', regex: '\\b[a-z][a-zA-Z0-9_]*\\b' },
			{ token: 'text', regex: '[^\\s]' } 
		]
	};
}

function get_quilt_words( container ){ return {cid:container, mode:'quilt_words', qName:'Quilt', fileTypes:['qmp', 'quilt'], tokens:quilt_tokens, parser:null, meaner:null }; }
