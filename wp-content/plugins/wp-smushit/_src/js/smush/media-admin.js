/* global smush_vars */
(function ( $ ) {
	$( function() {
		/**
		 * Disable the action links *
		 *
		 * @param c_element
		 */
		const disable_links = function (c_element) {
			const parent = c_element.parent();
			//reduce parent opacity
			parent.css({ opacity: '0.5' });
			//Disable Links
			parent.find('a').prop('disabled', true);
		};

		/**
		 * Enable the Action Links *
		 *
		 * @param c_element
		 */
		const enable_links = function (c_element) {
			const parent = c_element.parent();

			//reduce parent opacity
			parent.css({ opacity: '1' });
			//Disable Links
			parent.find('a').prop('disabled', false);
		};

		/**
		 * Update image size in attachment info panel.
		 *
		 * @param {number} newSize
		 */
		const updateImageStats = ( newSize ) => {
			if ( 0 === newSize ) {
				return;
			}

			const attachmentSize = jQuery( '.attachment-info .file-size' );
			const currentSize = attachmentSize
				.contents()
				.filter( function() {
					return this.nodeType === 3;
				} )
				.text();

			// There is a space before the size.
			if ( currentSize !== ' ' + newSize ) {
				const sizeStrongEl = attachmentSize
					.contents()
					.filter( function() {
						return this.nodeType === 1;
					} )
					.text();
				attachmentSize.html(
					'<strong>' + sizeStrongEl + '</strong> ' + newSize
				);
			}
		}

		/**
		 * Restore image request with a specified action for Media Library / NextGen Gallery
		 *
		 * @param {Object} e
		 * @param {string} currentButton
		 * @param {string} smushAction
		 * @param {string} action
		 */
		const process_smush_action = function (
			e,
			currentButton,
			smushAction,
			action
		) {
			e.preventDefault();

			// If disabled.
			if ( currentButton.attr( 'disabled' ) ) {
				return;
			}

			// Remove Error.
			$('.wp-smush-error').remove();

			// Hide stats.
			$('.smush-stats-wrapper').hide();

			let mode = 'grid';
			if ('smush_restore_image' === smushAction) {
				if ($(document).find('div.media-modal.wp-core-ui').length > 0) {
					mode = 'grid';
				} else {
					mode =
						window.location.search.indexOf('item') > -1
							? 'grid'
							: 'list';
				}
			}

			// Get the image ID and nonce.
			const params = {
				action: smushAction,
				attachment_id: currentButton.data('id'),
				mode,
				_nonce: currentButton.data('nonce') || wp_smush_msgs.nonce,
			};

			// Reduce the opacity of stats and disable the click.
			disable_links(currentButton);

			const oldLabel = currentButton.html();

			currentButton.html(
				'<span class="spinner wp-smush-progress">' +
					wp_smush_msgs[action] +
					'</span>'
			);

			// Restore the image.
			$.post(ajaxurl, params, function (r) {
				// Reset all functionality.
				enable_links(currentButton);

				if (r.success && 'undefined' !== typeof r.data) {
					// Replace in immediate parent for NextGEN.
					if ('restore' === action) {
						// Show the smush button, and remove stats and restore option.
						currentButton.parents().eq(1).html(r.data.stats);
					} else {
						const wrapper = currentButton.parents().eq(1);
						if ( wp_smush_msgs.failed_item_smushed && wrapper.hasClass('smush-failed-processing') ) {
							wrapper.html( '<p class="smush-status smush-success">' + wp_smush_msgs.failed_item_smushed  + '</p>' );
							setTimeout(function(){
								wrapper.html( r.data );
							}, 2000);
						} else {
							wrapper.html(r.data);
						}
					}

					if ('undefined' !== typeof r.data && 'restore' === action) {
						updateImageStats(r.data.new_size);
					}
				} else if (r.data && r.data.error_msg) {
					if ( r.data.html_stats ) {
						currentButton.closest( '.smush-status-links' ).parent().html( r.data.html_stats );
					} else {
						currentButton.closest( '.smush-status-links' ).prev('.smush-status').addClass('smush-warning').html(r.data.error_msg);
					}

					// Reset label and disable button on error.
					currentButton.attr('disabled', true);
					currentButton.html( oldLabel );
				}
			});
		};

		/** Handle smush button click **/
		$('body').on(
			'click',
			'.wp-smush-send:not(.wp-smush-resmush)',
			function (e) {
				process_smush_action( e, $(this), 'optimize_attachment', 'smush' );
			}
		);

		/**
		 * Ignore file from bulk Smush.
		 */
		$( 'body' ).on( 'click', '.smush-ignore-image', function( e ) {
			e.preventDefault();

			const self = $( this );

			self.prop( 'disabled', true );
			self.attr( 'data-tooltip' );
			self.removeClass( 'sui-tooltip' );
			$.post( ajaxurl, {
				action: 'ignore_bulk_image',
				id: self.attr( 'data-id' ),
				_ajax_nonce: wp_smush_msgs.nonce,
			} ).done( ( response ) => {
				if ( self.is( 'a' ) && response.success && 'undefined' !== typeof response.data.html ) {
					if ( e.target.closest( '.smush-status-links' ) ) {
						self.closest( '.smush-status-links' ).parent().html( response.data.html );
					} else if ( e.target.closest( '.smush-bulk-error-row' ) ) {
						self.addClass( 'disabled' );
						e.target.closest( '.smush-bulk-error-row' ).style.opacity = 0.5;
					}
				}
			} );
		} );

		/**
		 * Handle show in bulk smush button click.
		 */
		$( 'body' ).on( 'click', '.wp-smush-remove-skipped', function( e ) {
			e.preventDefault();

			const self = $( this );

			// Send ajax request to remove the image from the skip list.
			$.post( ajaxurl, {
				action: 'remove_from_skip_list',
				id: self.attr( 'data-id' ),
				_ajax_nonce: self.attr( 'data-nonce' ),
			} ).done( ( response ) => {
				if ( response.success && 'undefined' !== typeof response.data.html ) {
					self.parent().parent().html( response.data.html );
				}
			} );
		} );

		/** Restore: Media Library **/
		$('body').on('click', '.wp-smush-action.wp-smush-restore', function (e) {
			const current_button = $(this);
			current_button.removeClass('sui-tooltip');
			process_smush_action(
				e,
				current_button,
				'smush_restore_image',
				'restore'
			);
		});

		/** Resmush: Media Library **/
		$('body').on('click', '.wp-smush-action.wp-smush-resmush', function (e) {
			process_smush_action(e, $(this), 'optimize_attachment', 'resmush');
		});

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
})(window.jQuery);
