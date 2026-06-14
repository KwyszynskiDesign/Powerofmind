jQuery(function ($) {
	'use strict';

    /**
	 * Handle the Smush Stats link click
	 */
    $( 'body' ).on( 'click', 'a.smush-stats-details', function ( e ) {
	    // If disabled
	    if ( $( this ).prop( 'disabled' ) ) {
		    return false;
	    }
		
	    e.preventDefault();
	
	    const $link = $( this );
	    const $wrapper = $link.parents().eq( 1 ).find( '.smush-stats-wrapper' );
	
	    // Toggle expanded state
	    $link.toggleClass( 'smush-stats-expanded' );
	    $wrapper.slideToggle();
    } );
});
