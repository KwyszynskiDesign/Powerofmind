// Review Prompts
import Tracker from '../utils/tracker';
import Fetcher from '../utils/fetcher';

class ReviewPrompts {
	#dismissNoticeKey = 'review-prompts';
	constructor() {
		document.addEventListener( 'DOMContentLoaded', this.init.bind( this ) );
	}

	init() {
		this.reviewPromptsElement = document.getElementById( 'smush-review-prompts-notice' );
		if ( ! this.reviewPromptsElement ) {
			return;
		}

		this.remindLater = this.reviewPromptsElement.querySelector( '#smush-review-prompts-remind-later' );
		this.alreadyDid = this.reviewPromptsElement.querySelector( '#smush-review-prompts-already-did' );
		this.rateLink = this.reviewPromptsElement.querySelector( '.button-primary' );

		this.bindEvents();
	}

	bindEvents() {
		if ( this.alreadyDid ) {
			this.alreadyDid.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				this.handleDismissNotice();
				this.trackRateNoticeEvent( 'dismiss' );
			} );
		}

		if ( this.remindLater ) {
			this.remindLater.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				this.handleRemindLater();
				this.trackRateNoticeEvent( 'remind_later' );
			} );
		}

		if ( this.rateLink ) {
			this.rateLink.addEventListener( 'click', () => {
				this.handleDismissNotice();
				this.trackRateNoticeEvent( 'rate' );
			} );
		}
	}

	handleDismissNotice() {
		this.alreadyDid.classList.add( 'wp-smush-link-in-progress' );
		return Fetcher.common.dismissNotice( this.#dismissNoticeKey ).then( ( res ) => {
			if ( res.success ) {
				this.reviewPromptsElement.style.display = 'none';
			} else {
				window.WP_Smush?.helpers.showNotice( res );
			}
		} ).catch( ( error ) => {
			window.WP_Smush?.helpers.showNotice( error );
		} ).finally( () => {
			this.alreadyDid.classList.remove( 'wp-smush-link-in-progress' );
		} );
	}

	handleRemindLater() {
		this.alreadyDid.classList.add( 'wp-smush-link-in-progress' );

		return Fetcher.common.remindReviewPrompt().then( ( res ) => {
			if ( res.success ) {
				this.reviewPromptsElement.style.display = 'none';
			} else {
				window.WP_Smush?.helpers.showNotice( res );
			}
		} ).catch( ( error ) => {
			window.WP_Smush?.helpers.showNotice( error );
		} ).finally( () => {
			this.alreadyDid.classList.remove( 'wp-smush-link-in-progress' );
		} );
	}

	trackRateNoticeEvent( userAction ) {
		if ( userAction ) {
			const url = new URL( window.location.href );
			const page = url.searchParams.get( 'page' );
			const locationMaps = {
				smush: 'Dashboard',
				'smush-bulk': 'Bulk Smush',
				'smush-lazy-preload': 'Lazy Load',
				'smush-cdn': 'CDN',
				'smush-next-gen': 'Next-Gen Formats',
				'smush-integrations': 'Integrations',
				'smush-settings': 'Settings',
				'smush-cross-sell': 'More free Plugins',
			};
			const location = locationMaps[ page ] || 'WordPress admin';

			Tracker.track( 'Rating Notice', {
				Action: userAction,
				'Notice type': this.reviewPromptsElement.dataset.noticeType,
				Location: location
			} );
		}
	}
}

new ReviewPrompts();
