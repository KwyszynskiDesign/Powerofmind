// Disconnect Site.
/* global WP_Smush */

import Fetcher from '../utils/fetcher';
import tracker from '../utils/tracker';

class DisconnectSite {
	constructor() {
		document.addEventListener( 'DOMContentLoaded', () => {
			this.modalAction = 'cancel';
			this.modalId = 'smush-disconnect-site-modal';
			this.modal = document.getElementById( this.modalId );

			this._onAfterClose = this.trackDisconnectSite.bind( this );
			if ( this.modal ) {
				this.modal.addEventListener( 'afterClose', this._onAfterClose, { once: true } );
				document.addEventListener( 'onSavedSmushSettings', ( e ) => {
					const usage = document.getElementById( 'usage' );
					if ( usage ) {
						tracker.setAllowToTrack( usage.checked );
					}
				} );
			}
		} );
	}

	trackDisconnectSite() {
		const textarea = document.getElementById( 'smush-disconnect-site-message' );
		const message = textarea.value.trim();
		const skipMessage = message.length === 0;

		if ( skipMessage && this.isSubmitAction() ) {
			this.setModalAction( 'skip' );
		}

		if ( ! this.shouldTrack() ) {
			return Promise.resolve();
		}

		const event = 'Disconnect Site';
		const properties = {
			'User Message': message,
			'Modal Action': this.modalAction,
			'Tracking Status': tracker.allowToTrack() ? 'opted_in' : 'opted_out',
		};

		return tracker.setAllowToTrack( true ).track( event, properties );
	}

	shouldTrack() {
		return tracker.allowToTrack() || this.isSubmitAction();
	}

	isSubmitAction() {
		return 'submit' === this.modalAction;
	}

	setModalAction( action ) {
		this.modalAction = action;

		return this;
	}

	closeModal() {
		if ( ! this.modal ) {
			return Promise.resolve();
		}

		return new Promise( ( resolve ) => {
			// Ensure only one event listener is active.
			this.modal.removeEventListener( 'afterClose', this._onAfterClose );
			this.modal.addEventListener( 'afterClose', async () => {
				await this.trackDisconnectSite();
				resolve();
			}, { once: true } );

			window.SUI?.closeModal( true );
		} );
	}

	disconnect( btn ) {
		if ( btn ) {
			btn.classList.add( 'sui-button-onload-text' );
		}

		return Fetcher.settings.disconnectSite().then( async ( res ) => {
			if ( res.success ) {
				await this.setModalAction( 'submit' ).closeModal();
				window.location.search = window.location.search + `&smush-notice=site-disconnected`;
			} else {
				WP_Smush.helpers.showNotice( res );
			}
		} ).catch( ( error ) => {
			WP_Smush.helpers.showNotice( error );
		} ).finally( () => {
			if ( btn ) {
				btn.classList.remove( 'sui-button-onload-text' );
			}
		} );
	}
}

const disconnectSite = new DisconnectSite();

export default disconnectSite;
