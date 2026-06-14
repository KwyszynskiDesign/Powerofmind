/* global WP_Smush */
/* global ajaxurl */
import tracker from '../utils/tracker';
import GlobalTracking from '../global-tracking';

/**
 * Modals JavaScript code.
 */
( function() {
	'use strict';
	const onBoardingTemplateID = 'smush-onboarding-free';
	if ( ! document.getElementById( onBoardingTemplateID ) ) {
		return;
	}

	/**
	 * Onboarding modal.
	 *
	 * @since 3.1
	 */
	WP_Smush.onboarding = {
		membership: 'free', // Assume free by default.
		onboardingModal: document.getElementById( 'smush-onboarding-dialog' ),
		settings: {
			first: true,
			last: false,
			slide: 'start',
			fields: {},
		},
		fields: {},
		contentContainer: document.getElementById( 'smush-onboarding-content' ),
		onboardingSlides: [],
		touchX: null,
		touchY: null,
		recheckImagesLink: '',
		upsellUTMClicked: false,

		registerEventListeners() {
			document.addEventListener(
				'smush-onboarding:rendered-slide-scan_completed',
				this.progressBarAnimation.bind( this )
			);

			// Skip setup.
			this.skipButton = this.onboardingModal.querySelector(
				'.smush-onboarding-skip-link'
			);
			if ( this.skipButton ) {
				this.skipButton.addEventListener( 'click', this.skipSetup.bind( this ) );
			}
		},
		/**
		 * Init module.
		 */
		init() {
			if ( ! this.onboardingModal ) {
				return;
			}

			this.onboardingSlides = window.onBoardingData?.slideKeys || [];
			this.fields = window.onBoardingData?.slideFields || {};
			this.settings.slide = this.onboardingSlides.length ? this.onboardingSlides[ 0 ] : 'start';

			const dialog = document.getElementById( onBoardingTemplateID );

			this.membership = dialog.dataset.type;
			this.recheckImagesLink = dialog.dataset.ctaUrl;

			if ( 'false' === dialog.dataset.tracking ) {
				this.onboardingSlides.pop();
			}

			this.registerEventListeners();
			this.renderTemplate();

			// Show the modal.
			window.SUI.openModal(
				'smush-onboarding-dialog',
				'wpcontent',
				undefined,
				false
			);
		},

		/**
		 * Get swipe coordinates.
		 *
		 * @param {Object} e
		 */
		handleTouchStart( e ) {
			const firstTouch = e.touches[ 0 ];
			this.touchX = firstTouch.clientX;
			this.touchY = firstTouch.clientY;
		},

		/**
		 * Process swipe left/right.
		 *
		 * @param {Object} e
		 */
		handleTouchMove( e ) {
			if ( ! this.touchX || ! this.touchY ) {
				return;
			}

			const xUp = e.touches[ 0 ].clientX,
				yUp = e.touches[ 0 ].clientY,
				xDiff = this.touchX - xUp,
				yDiff = this.touchY - yUp;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
				if ( xDiff > 0 ) {
					if ( false === WP_Smush.onboarding.settings.last ) {
						WP_Smush.onboarding.next( null, 'next' );
					}
				} else if ( false === WP_Smush.onboarding.settings.first ) {
					WP_Smush.onboarding.next( null, 'prev' );
				}
			}

			this.touchX = null;
			this.touchY = null;
		},

		progressBarAnimation( event ) {
			const progressBar = this.onboardingModal.querySelector( '.sui-progress-bar span' );
			const progressText = this.onboardingModal.querySelector( '.sui-progress-text' );
			let start = 0;
			const duration = 3000; // 3 seconds
			const step = 10; // ms

			if ( ! progressBar || ! progressText ) {
				return;
			}

			const interval = setInterval( () => {
				start += step;
				const percent = Math.min( Math.round( ( start / duration ) * 100 ), 100 );
				progressBar.style.width = percent + '%';
				progressText.textContent = percent + '%';
				if ( percent >= 100 ) {
					clearInterval( interval );
					const loader = this.onboardingModal.querySelector( '.sui-icon-loader' );
					if ( loader ) {
						loader.classList.remove( 'sui-icon-loader', 'sui-loading' );
						loader.style.color = '#1ABC9C';
						loader.classList.add( 'sui-icon-check-tick' );
					}
					const scanStats = this.onboardingModal.querySelector( '.scan-stats' );
					if ( scanStats ) {
						scanStats.classList.remove( 'sui-hidden' );
					}
				}
			}, step );
		},

		/**
		 * Update the template, register new listeners.
		 *
		 * @param {string} directionClass Accepts: fadeInRight, fadeInLeft, none.
		 *
		 *                                Todo: Maybe redirect to finish scan slide when users go to in progressing slide.
		 */
		renderTemplate( directionClass = 'none' ) {
			// Grab the selected value.
			this.updateCheckboxStates();

			const template = WP_Smush.onboarding.template( onBoardingTemplateID );
			const settings = this.settings;
			settings.fields = this.fields;
			const content = template( settings );

			if ( content ) {
				this.contentContainer.innerHTML = content;

				if ( 'none' === directionClass ) {
					this.contentContainer.classList.add( 'loaded' );
				} else {
					this.contentContainer.classList.remove( 'loaded' );
					this.contentContainer.classList.add( directionClass );
					setTimeout( () => {
						this.contentContainer.classList.add( 'loaded' );
						this.contentContainer.classList.remove(
							directionClass
						);
					}, 600 );
				}
			}

			this.onboardingModal.addEventListener(
				'touchstart',
				this.handleTouchStart,
				false
			);
			this.onboardingModal.addEventListener(
				'touchmove',
				this.handleTouchMove,
				false
			);

			this.bindSubmit();
			this.toggleSkipButton();
			this.maybeHandleUpsellUTMClick();

			const slideRendered = new CustomEvent(
				`smush-onboarding:rendered-slide-${ this.settings.slide }`,
				{
					detail: {
						settings: this.settings,
					},
				}
			);
			document.dispatchEvent( slideRendered );
		},

		updateCheckboxStates() {
			const inputs = this.onboardingModal.querySelectorAll(
				'input[type="checkbox"]'
			);
			if ( inputs ) {
				inputs.forEach( ( checkbox ) => {
					this.fields[ checkbox.id ] = checkbox.checked;
				} );
			}
		},

		toggleSkipButton() {
			if ( ! this.skipButton ) {
				return;
			}

			if ( this.settings.last ) {
				this.skipButton.classList.add( 'sui-hidden' );
			} else {
				this.skipButton.classList.remove( 'sui-hidden' );
			}
		},

		/**
		 * Catch "Finish setup wizard" button click.
		 */
		bindSubmit() {
			const submitButton = this.onboardingModal.querySelector(
				'button[type="submit"]'
			);
			const self = this;

			if ( submitButton ) {
				submitButton.addEventListener( 'click', async function( e ) {
					e.preventDefault();

					submitButton.classList.add( 'sui-button-onload-text' );

					// Because we are not rendering the template, we need to update the last element value.
					self.updateCheckboxStates();

					try {
						await self.trackFinishSetupWizard();
					} catch ( err ) {}

					const _nonce = document.getElementById(
						'smush_quick_setup_nonce'
					);

					const xhr = new XMLHttpRequest();
					xhr.open( 'POST', ajaxurl + '?action=smush_free_setup', true );
					xhr.setRequestHeader(
						'Content-type',
						'application/x-www-form-urlencoded'
					);
					xhr.onload = () => {
						if ( 200 === xhr.status ) {
							self.onFinishingSetup();
						} else {
							window.console.log(
								'Request failed.  Returned status of ' +
									xhr.status
							);
						}
					};
					xhr.send(
						'smush_settings=' +
							JSON.stringify( self.fields ) +
							'&_ajax_nonce=' +
							_nonce.value
					);
				} );
			}
		},

		onFinishingSetup() {
			this.onFinish();
			if ( window.onBoardingData?.isSiteConnected ) {
				this.redirectAndStartBulkSmush();
			} else {
				this.redirectToConnectSite();
			}
		},

		redirectAndStartBulkSmush() {
			if ( window.onBoardingData?.startBulkSmushURL ) {
				window.location.href = window.onBoardingData?.startBulkSmushURL;
			}
		},

		onFinish() {
			window.SUI.closeModal();
		},

		redirectToConnectSite() {
			if ( ! window.onBoardingData?.connectSiteUrl ) {
				return;
			}
			window.location.href = window.onBoardingData?.connectSiteUrl;
		},

		/**
		 * Handle navigation.
		 *
		 * @param {Object}      e
		 * @param {null|string} whereTo
		 */
		next( e, whereTo = null ) {
			const index = this.onboardingSlides.indexOf( this.settings.slide );
			let newIndex = 0;

			if ( ! whereTo ) {
				newIndex =
					null !== e && e.classList.contains( 'next' )
						? index + 1
						: index - 1;
			} else {
				newIndex = 'next' === whereTo ? index + 1 : index - 1;
			}

			const directionClass =
				null !== e && e.classList.contains( 'next' )
					? 'fadeInRight'
					: 'fadeInLeft';

			this.settings = {
				first: 0 === newIndex,
				last: newIndex + 1 === this.onboardingSlides.length, // length !== index
				slide: this.onboardingSlides[ newIndex ],
				fields: this.fields,
			};

			this.renderTemplate( directionClass );
		},

		/**
		 * Handle circle navigation.
		 *
		 * @param {string} target
		 */
		goTo( target ) {
			const newIndex = this.onboardingSlides.indexOf( target );

			this.settings = {
				first: 0 === newIndex,
				last: newIndex + 1 === this.onboardingSlides.length, // length !== index
				slide: target,
				fields: this.fields,
			};

			this.renderTemplate();
		},

		/**
		 * Skip onboarding experience.
		 */
		async skipSetup() {
			const _nonce = document.getElementById( 'smush_quick_setup_nonce' );

			this.updateCheckboxStates();

			try {
				await this.trackSkipSetupWizard();
			} catch ( err ) {}

			const xhr = new XMLHttpRequest();
			xhr.open(
				'POST',
				ajaxurl + '?action=skip_smush_setup&_ajax_nonce=' + _nonce.value
			);
			xhr.onload = () => {
				if ( 200 === xhr.status ) {
					this.onSkipSetup();
				} else {
					window.console.log(
						'Request failed.  Returned status of ' + xhr.status
					);
				}
			};
			xhr.send();
		},

		onSkipSetup() {
			this.onFinish();
			this.redirectBulkSmushPage();
		},

		redirectBulkSmushPage() {
			const bulkSmushPage = window.wp_smush_msgs?.bulk_smush_url;
			if ( bulkSmushPage ) {
				window.location.href = bulkSmushPage;
			}
		},

		/**
		 * Hide new features modal.
		 *
		 * @param  e
		 * @param  button
		 * @since 3.7.0
		 * @since 3.12.2 Add a new parameter redirectUrl
		 */
		hideUpgradeModal: ( e, button ) => {
			const isRedirectRequired = '_blank' !== button?.target;
			if ( isRedirectRequired ) {
				e.preventDefault();
			}

			button.classList.add( 'wp-smush-link-in-progress' );
			const redirectUrl = button?.href;
			const xhr = new XMLHttpRequest();
			xhr.open( 'POST', ajaxurl + '?action=hide_new_features&_ajax_nonce=' + window.wp_smush_msgs.nonce );
			xhr.onload = () => {
				window.SUI.closeModal();
				button.classList.remove( 'wp-smush-link-in-progress' );

				const actionName = redirectUrl ? 'cta_clicked' : 'closed';
				tracker.track( 'update_modal_displayed', {
					Action: actionName,
				} );

				if ( 200 === xhr.status ) {
					if ( redirectUrl && isRedirectRequired ) {
						window.location.href = redirectUrl;
					}
				} else {
					window.console.log(
						'Request failed.  Returned status of ' + xhr.status
					);
				}
			};
			xhr.send();
		},
		maybeHandleUpsellUTMClick() {
			const isConfigureSlide = 'configure' === this.settings?.slide;
			if ( ! isConfigureSlide ) {
				return;
			}

			const upsellLink = this.onboardingModal.querySelector( '.smush-btn-pro-upsell' );

			if ( upsellLink ) {
				upsellLink.addEventListener( 'click', () => {
					this.upsellUTMClicked = true;
				}, { once: true } );
			}

			this.trackProUpsellOnClick( upsellLink );
		},
		trackFinishSetupWizard() {
			return this.trackSetupWizard( window.onBoardingData?.isSiteConnected ? 'complete_wizard' : 'connect' );
		},
		trackSkipSetupWizard() {
			return this.trackSetupWizard( 'quit' );
		},
		trackSetupWizard( action ) {
			const isWizardQuit = 'quit' === action;
			const properties = {
				Action: action,
				'Quit Step': this.getQuitStep( isWizardQuit ),
				'Settings Enabled': this.getEnabledSettings( isWizardQuit ),
				'Wizard Upsell': this.upsellUTMClicked ? 'clicked_utm' : 'na',
			};

			const allowToTrack = this.fields?.usage;

			return tracker.setAllowToTrack( allowToTrack ).track( 'Setup Wizard New', properties );
		},
		getQuitStep( isWizardQuit ) {
			return isWizardQuit ? ( this.settings.slide || 'na' ) : 'na';
		},
		getEnabledSettings( isWizardQuit ) {
			if ( isWizardQuit ) {
				return 'na';
			}

			const fieldMapsForTracking = this.getFieldMapsForTracking();
			const enabledSettings = [];

			Object.entries( this.fields ).forEach( ( [ setting, enabled ] ) => {
				if ( enabled ) {
					const featureName = setting in fieldMapsForTracking ? fieldMapsForTracking[ setting ] : setting;
					enabledSettings.push( featureName );
				}
			} );

			return enabledSettings;
		},
		getProInterests() {
			if ( 'pro' === this.membership || ! this.upsellUTMClicked.length ) {
				return 'na';
			}

			return this.upsellUTMClicked;
		},
		getFieldMapsForTracking() {
			return {
				usage: 'tracking',
				auto: 'auto_smush',
				lossy: 'super_smush',
				strip_exif: 'strip_exif',
				compress_backup: 'compress_backup',
				lazy_load: 'lazy_load',
			};
		},
		trackProUpsellOnClick( upsellLink ) {
			if ( ! upsellLink ) {
				return;
			}

			upsellLink.addEventListener( 'click', ( event ) => {
				const allowToTrack = this.fields?.usage;
				tracker.setAllowToTrack( allowToTrack );
				( new GlobalTracking() ).trackSetupWizardProUpsell( event?.target?.href, 'na' );
			} );
		}
	};

	/**
	 * Template function (underscores based).
	 *
	 * @type {Function}
	 */
	WP_Smush.onboarding.template = _.memoize( ( id ) => {
		let compiled;
		const options = {
			evaluate: /<#([\s\S]+?)#>/g,
			interpolate: /{{{([\s\S]+?)}}}/g,
			escape: /{{([^}]+?)}}(?!})/g,
			variable: 'data',
		};

		return ( data ) => {
			_.templateSettings = options;
			compiled =
				compiled ||
				_.template( document.getElementById( id ).innerHTML );
			return compiled( data );
		};
	} );

	window.addEventListener( 'load', () => WP_Smush.onboarding.init() );
}() );
