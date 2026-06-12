/** 
 * JS for perspective rotation
 * @author: Hamzeen. H.
 */

$(document).ready(function() {
	/*if ( $.browser.msie ) {
  		alert( $.browser.version );
	}*/
	$('.work .hover').animate ( { top: 211, easing: 'easeInOutExpo' } , 800 );
	$('#cube').addClass('show-front');
});


/* SLIDE CUBE */
	var poscubo = 0;
	setInterval( function( ) { agregar_clase() }, 5000);
	agregar_clase ( );
	
	//hasta aca
function agregar_clase ( ){
	
	//console.log( 'pasaron 12 segundos' )
	if ( poscubo == 0 )
	{
		$('#boxhome').removeClass();
		$('#boxhome').addClass('show-front');
		poscubo = 1; 
	}
	else if (poscubo == 1)
	{
		$('#boxhome').removeClass();
		$('#boxhome').addClass('show-top');
		poscubo = 2; 
	}
	else if (poscubo == 2)
	{
		$('#boxhome').removeClass();
		$('#boxhome').addClass('show-back');
		poscubo = 3; 
	}
	else if (poscubo == 3)
	{
		$('#boxhome').removeClass();
		$('#boxhome').addClass('show-bottom');
		poscubo = 0; 
	}
}
/*-------------------------*/
