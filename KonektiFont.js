Konekti.core.stylesheet( 'https://www.w3schools.com/w3css/4/w3.css' )

if(Konekti.core.font === undefined){
	Konekti.core.font = {
		previous: function( font ){
			if( font == 'w3-small' ) return 'w3-tiny'
			if( font == 'w3-medium' ) return 'w3-small'
			if( font == 'w3-large' ) return 'w3-medium'
			if( font == 'w3-xlarge' ) return 'w3-large'
			if( font == 'w3-xxlarge' ) return 'w3-xlarge'
			if( font == 'w3-xxxlarge' ) return 'w3-xxlarge'
			if( font == 'w3-jumbo' ) return 'w3-xxxlarge'
			return font	
		},

		size: function ( font ){
			if( font == 'w3-tiny' ) return 10
			if( font == 'w3-small' ) return 12
			if( font == 'w3-medium' ) return 15
			if( font == 'w3-large' ) return 18
			if( font == 'w3-xlarge' ) return 24
			if( font == 'w3-xxlarge' ) return 36
			if( font == 'w3-xxxlarge' ) return 48
			if( font == 'w3-jumbo' ) return 64
			return 15	
		}
	}
}
