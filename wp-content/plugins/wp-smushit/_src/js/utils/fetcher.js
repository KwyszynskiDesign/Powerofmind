/* global ajaxurl */

/**
 * Wrapper function for ajax calls to WordPress.
 *
 * @since 3.12.0
 */
function SmushFetcher() {
	/**
	 * Request ajax with a promise.
	 * Use FormData Object as data if you need to upload file
	 *
	 * @param {string}          action
	 * @param {Object|FormData} data
	 * @param {string}          method
	 * @return {Promise<any>} Request results.
	 */
	function request( action, data = {}, method = 'POST' ) {
		const args = {
			url: ajaxurl,
			method,
			cache: false
		};

		if ( data instanceof FormData ) {
			data.append( 'action', action );
			if ( ! data.has( '_ajax_nonce' ) ) {
				data.append( '_ajax_nonce', window.smushUIData?.wpAjax?.nonce );
			}
			args.contentType = false;
			args.processData = false;
		} else {
			data._ajax_nonce = data._ajax_nonce || window.smush_global.nonce || window.smushUIData?.wpAjax?.nonce;
			data.action = action;
		}
		args.data = data;
		return new Promise( ( resolve, reject ) => {
			jQuery.ajax( args ).done( resolve ).fail( reject );
		} ).then( ( response ) => {
			if ( typeof response !== 'object' ) {
				response = JSON.parse( response );
			}
			return response;
		} ).catch( ( error ) => {
			console.error( 'Error:', error );
			return error;
		} );
	}

	const methods = {
		/**
		 * Manage ajax for background.
		 */
		background: {
			/**
			 * Start background process.
			 */
			start: () => {
				return request( 'bulk_smush_start' );
			},

			/**
			 * Cancel background process.
			 */
			cancel: () => {
				return request( 'bulk_smush_cancel' );
			},

			/**
			 * Pause background process.
			 */
			pause: () => {
				return request( 'bulk_smush_pause' );
			},

			/**
			 * Resume background process.
			 */
			resume: () => {
				return request( 'bulk_smush_resume' );
			},

			/**
			 * Initial State - Get stats on the first time.
			 */
			initState: () => {
				return request( 'bulk_smush_get_status' );
			},

			/**
			 * Get stats.
			 */
			getStatus: () => {
				return request( 'bulk_smush_get_status' );
			},

			getStats: () => {
				return request( 'bulk_smush_get_global_stats' );
			},

			backgroundHealthyCheck: () => {
				return request( 'smush_start_background_pre_flight_check' );
			},

			backgroundHealthyStatus: () => {
				return request( 'smush_get_background_pre_flight_status' );
			}
		},
		smush: {
			/**
			 * Sync stats.
			 *
			 * @param  data
			 */
			syncStats: ( data ) => {
				data = data || {};
				return request( 'get_stats', data );
			},

			/**
			 * Ignore All.
			 *
			 * @param  type
			 */
			ignoreAll: ( type ) => {
				return request( 'wp_smush_ignore_all_failed_items', {
					type,
				} );
			},
		},

		/**
		 * Manage ajax for config operations
		 */
		configs: {
			/**
			 * Get the current site settings as a config.
			 */
			save: () => {
				return request( 'smush_save_config', {
					_ajax_nonce: window.smushUIData?.configsData?.nonce || '',
				} );
			},

			/**
			 * Apply a config by ID.
			 *
			 * @param {number} id Config ID.
			 */
			apply: ( id ) => {
				return request( 'smush_apply_config', {
					id,
					_ajax_nonce: window.smushUIData?.configsData?.nonce || '',
				} );
			},

			/**
			 * Upload and validate a config file.
			 *
			 * @param {File} file The JSON config file.
			 */
			upload: ( file ) => {
				const formData = new FormData();
				formData.append( '_ajax_nonce', window.smushUIData?.configsData?.nonce || '' );
				formData.append( 'file', file );
				return request( 'smush_upload_config', formData );
			},
		},

		/**
		 * Manage ajax for other requests
		 */
		common: {
			hideUpgradeModal: () => {
				return request( 'hide_new_features' );
			},
			/**
			 * Dismiss Notice.
			 *
			 * @param {string} dismissId Notification id.
			 */
			dismissNotice: ( dismissId ) => {
				return request( 'smush_dismiss_notice', {
					key: dismissId
				} );
			},

			remindReviewPrompt: () => {
				return request( 'wp_smush_review_prompts_remind_later' );
			},

			/**
			 * Hide the new features modal.
			 *
			 * @param {string} modalID Notification id.
			 */
			hideModal: ( modalID ) => request( 'hide_modal', {
				modal_id: modalID,
			} ),

			track: ( event, properties ) => request( 'smush_analytics_track_event', {
				event,
				properties
			} ),

			/**
			 * Custom request.
			 *
			 * @param {Object} data
			 */
			request: ( data ) => data.action && request( data.action, data ),

			poll: () => request( 'smush_frontend_poll', {} ),
		},

		scanMediaLibrary: {
			start: ( optimize_on_scan_completed = false ) => {
				optimize_on_scan_completed = optimize_on_scan_completed ? 1 : 0;
				const _ajax_nonce = window.smushUIData.scanStatus.nonce;
				return request( 'wp_smush_start_background_scan', {
					optimize_on_scan_completed,
					_ajax_nonce,
				} );
			},

			cancel: () => {
				const _ajax_nonce = window.smushUIData.scanStatus.nonce;
				return request( 'wp_smush_cancel_background_scan', {
					_ajax_nonce,
				} );
			},

			getScanStatus: () => {
				const _ajax_nonce = window.smushUIData.scanStatus.nonce;
				return request( 'wp_smush_get_background_scan_status', {
					_ajax_nonce,
				} );
			},
		},

		webp: {
			switchMethod: ( method ) => {
				return request( 'webp_switch_method', { method } );
			},
			recheckStatus: () => {
				return request( 'smush_webp_get_status' );
			},
			// toggleWizard: () => {
			// 	return request( 'smush_toggle_webp_wizard' );
			// },
			showWizard: () => {
				return request( 'smush_show_webp_wizard' );
			},
			hideWizard: () => {
				return request( 'smush_hide_webp_wizard' );
			},
			applyHtaccessRules: () => {
				return request( 'smush_webp_apply_htaccess_rules' );
			},
		},
		cdn: {
			/**
			 * Toggle CDN on/off. Calls the server to set up or tear down CDN infrastructure.
			 *
			 * @param {boolean} enable
			 */
			toggle: ( enable ) => {
				return request( 'smush_toggle_cdn', { param: enable } );
			},

			/**
			 * Poll the CDN provisioning status. Used while CDN is still being set up.
			 */
			getStats: () => {
				return request( 'get_cdn_stats' );
			},
		},

		settings: {
			disconnectSite: () => {
				return request( 'wp_smush_disconnect_site' );
			},

			/**
			 * Force-recheck the Smush API connection status.
			 *
			 * @return {Promise} Resolves with { isPro, status } on success.
			 */
			checkApiStatus: () => {
				return request( 'recheck_api_status' );
			},
		},

		rating: {
			/**
			 * User rated the plugin.
			 */
			completed: () => {
				return request( 'smush_rating_completed' );
			},

			/**
			 * User wants to be reminded later.
			 */
			remindLater: () => {
				return request( 'smush_rating_remind_later' );
			},

			/**
			 * User dismissed permanently.
			 */
			dismissed: () => {
				return request( 'smush_rating_dismissed' );
			},

			/**
			 * Mark first completion.
			 */
			firstCompletion: () => {
				return request( 'smush_rating_first_completion' );
			}
		},

		onboarding: {
			resumeWizard: () => request( 'resume_smush_setup' ),
		},

		request: ( action, data = {}, method = 'POST' ) => {
			return request( action, data, method );
		}
	};

	Object.assign( this, methods );
}

const SmushAjax = new SmushFetcher();
export default SmushAjax;
