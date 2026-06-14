import { describe, expect, test, it } from '@jest/globals';
import { LCPDetector, SmushLCPDetector } from '../frontend/detector';

describe( 'background data from property value', () => {
	const dataSet = [
		[
			// background-image: url
			"url('http://localhost/wp-content/uploads/2024/08/image1.jpeg')",
			'background-image',
			[
				'http://localhost/wp-content/uploads/2024/08/image1.jpeg'
			]
		],
		[
			// background-image: relative url
			"url('/wp-content/uploads/2024/08/image1.jpeg')",
			'background-image',
			[
				'/wp-content/uploads/2024/08/image1.jpeg'
			]
		],
		[
			// background-image: image-set
			'image-set(' +
			"'http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg' 1x, " +
			"'http://localhost/wp-content/uploads/2024/08/image1.jpeg' 2x" +
			');',
			'background-image-set',
			[
				'http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg',
				'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			]
		],
		[
			// background-image: image-set with relative URL.
			'image-set(' +
			"'/wp-content/uploads/2024/08/image1-768x437.jpeg' 1x, " +
			"'/wp-content/uploads/2024/08/image1.jpeg' 2x" +
			');',
			'background-image-set',
			[
				'/wp-content/uploads/2024/08/image1-768x437.jpeg',
				'/wp-content/uploads/2024/08/image1.jpeg',
			]
		],
		[
			// background-image: image-set with url
			'image-set(' +
			"url('http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg') 1x, " +
			"url('http://localhost/wp-content/uploads/2024/08/image1.jpeg') 2x" +
			');',
			'background-image-set',
			[
				'http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg',
				'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			]
		],
		[
			// background-image: image-set with url and relative URL
			'image-set(' +
			"url('/wp-content/uploads/2024/08/image1-768x437.jpeg') 1x, " +
			"url('/wp-content/uploads/2024/08/image1.jpeg') 2x" +
			');',
			'background-image-set',
			[
				'/wp-content/uploads/2024/08/image1-768x437.jpeg',
				'/wp-content/uploads/2024/08/image1.jpeg',
			]
		],
		[
			// background-image: image-set query params
			'image-set(' +
			'http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg?hello=world 1x, ' +
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg?yellow=world 2x' +
			');',
			'background-image-set',
			[
				'http://localhost/wp-content/uploads/2024/08/image1-768x437.jpeg?hello=world',
				'http://localhost/wp-content/uploads/2024/08/image1.jpeg?yellow=world',
			]
		],
		[
			// background-image: image-set query params with relative URL
			'image-set(' +
			'/wp-content/uploads/2024/08/image1-768x437.jpeg?hello=world 1x, ' +
			'/wp-content/uploads/2024/08/image1.jpeg?yellow=world 2x' +
			');',
			'background-image-set',
			[
				'/wp-content/uploads/2024/08/image1-768x437.jpeg?hello=world',
				'/wp-content/uploads/2024/08/image1.jpeg?yellow=world',
			]
		],
	];

	it.each( dataSet )( 'returns correct data for given property value', ( propertyValue, type, urls ) => {
		const lcpDetector = new SmushLCPDetector();
		lcpDetector.shouldUseRelativeImageURL = ! propertyValue.includes( 'http://localhost' );
		const backgroundDataForElement = lcpDetector.getBackgroundDataForPropertyValue( propertyValue );

		expect( backgroundDataForElement ).toStrictEqual( {
			type,
			urls,
		} );
	} );
} );

describe( 'shouldUseRelativeImageURL', () => {
	const dataSet = [
		[
			// Case: Element contains absolute URL in src attribute
			'<img src="http://localhost/wp-content/uploads/2024/08/image1.jpeg">',
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			false,
		],
		[
			// Case: Element contains relative URL in src attribute
			'<img src="/wp-content/uploads/2024/08/image1.jpeg">',
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			true,
		],
		[
			// Case: Element does not contain the URL
			'<img src="/wp-content/uploads/2024/08/other-image.jpeg">',
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			false,
		],
		[
			// Case: Element contains absolute URL in background style
			'<div style="background-image: url(http://localhost/wp-content/uploads/2024/08/image1.jpeg);"></div>',
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			false,
		],
		[
			// Case: Element contains relative URL in background style
			'<div style="background-image: url(/wp-content/uploads/2024/08/image1.jpeg);"></div>',
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			true,
		],
		[
			// Case: Element is null
			null,
			'http://localhost/wp-content/uploads/2024/08/image1.jpeg',
			false,
		],
	];

	it.each( dataSet )(
		'returns %s when element is %s and absoluteImageUrl is %s',
		( elementHTML, absoluteImageUrl, expected ) => {
			const lcpDetector = new SmushLCPDetector();
			const element = elementHTML
				? document.createElement( 'div' )
				: null;

			if ( element ) {
				element.innerHTML = elementHTML;
			}

			const result = lcpDetector.shouldUseRelativeImageURL(
				element?.firstChild || element,
				absoluteImageUrl
			);

			expect( result ).toBe( expected );
		}
	);
} );