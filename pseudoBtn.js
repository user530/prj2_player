/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License

	Custom input button:
	1) https://osvaldas.info/smart-custom-file-input
	2) http://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way
*/

'use strict';

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';

			if( fileName ) {

				if ( label.firstChild.nodeType === Node.ELEMENT_NODE ) {
					label.querySelector( 'span' ).innerHTML = fileName;
				} else {
					label.nextElementSibling.innerHTML = fileName;
				}

				console.log(fileName);
			}
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));