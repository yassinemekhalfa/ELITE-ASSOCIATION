import {
	LitElement,
	html,
	svg,
	css,
	unsafeCSS
} from "https://unpkg.com/lit-element/lit-element.js?module";

/* 
	Default values -- used for all css custom properties
	Okay, they're not really custom properties they're custom css vars
	but they *look* like custom css properties, right?
*/
const __carouselHeadingWidth = "30%";
const __carouselButtonSize = "3rem";
const __carouselBorderRadius = ".5rem";

/* ***********************************************************
	***********************************************************
	
	CrossCarousel Custom Element
	@tag x-carousel
	
	***********************************************************
   *********************************************************** */
class CrossCarousel extends LitElement {
	/*
		This method exposes the properties for data binding (reactivity),
		creates the getter/setters and handles the attribute value on the
		component itself (if "reflect" is true).
	*/
	static get properties() {
		return {
			index: { type: Number, reflect: true },
			__animating: { type: Boolean, defaultValue: true, reflect: false }
		};
	}

	/*
		CSS-in-JS styles.
		This is the part of lit-element I enjoyed the least -- then again I dislike css-in-js. 
	*/
	static get styles() {
		return [
			/*
				:host is the shadow-root for this element. It's also odd.
			*/
			css`:host, *, *::before, *::after { box-sizing:border-box;}`,

			css`
				:host {
					position: relative;
					display: block;
					width: 48rem;
					height: 24rem;
					overflow: visible;
				}
			`,

			/*
				By default, host is always 'display:inline'. Because we set it explicitly to 'block'
				we also have to explicitly set it's 'hidden' state.
			*/
			css`
				:host([hidden]) {
					display: none;
				}
			`,

			/*
				One of the cooler things in this is using variables as the default
				for any css variables. 'unsafeCSS' is a lit-html wrapper that sanatizes
				the css value for us. 
				
				The 'left' and 'width' are set to the css variable '--carousel-button-size'.
				What's cool about it is that from the dev's perspective, it looks like a
				property (same as --moz-, or --webkit-).
			*/
			css`
				#slides-container {
					position: absolute;
					display: block;
					top: 0;
					left: calc(
						var(--carousel-button-size, ${unsafeCSS(__carouselButtonSize)}) / 2
					);
					z-index: 1;
					width: calc(
						100% - var(--carousel-button-size, ${unsafeCSS(__carouselButtonSize)})
					);
					height: 100%;
					background-color: var(--carousel-background, #ccc);
					color: var(--carousel-color, #000);
					border-radius: var(
						--carousel-border-radius,
						${unsafeCSS(__carouselBorderRadius)}
					);
					overflow: hidden;
				}
			`,
			
			
			
			css`
				button {
					position: absolute;
					display: block;
					top: calc(
						50% - var(--carousel-button-size, ${unsafeCSS(__carouselButtonSize)}) / 2
					);
					z-index: 2;
					height: var(--carousel-button-size, ${unsafeCSS(__carouselButtonSize)});
					width: var(--carousel-button-size, ${unsafeCSS(__carouselButtonSize)});
					border-radius: var(--carousel-button-size, 50%);
					background-color: transparent;
					border: 1px solid rgba(255, 255, 255, 0.1);
				}
			`,
			
			
			css`
				button::after {
					content: "";
					position: absolute;
					display: block;
					top: 0;
					left: 0;
					height: 100%;
					width: 100%;
					border-radius: var(--carousel-button-size, 50%);
					border: 0.4rem solid rgba(0, 0, 0, 0.1);
					transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
					mix-blend-mode: multiply;
				}
			`,
			
			css`
				button::before {
					content: "";
					position: absolute;
					display: block;
					top: 0.4rem;
					left: 0.4rem;
					height: calc(100% - 0.8rem);
					width: calc(100% - 0.8rem);
					border-radius: var(--carousel-button-size, 50%);
					background-color: #fff;
				}
			`,
			
			css`
				button > svg {
					content: "";
					position: relative;
					z-index: 1;
					height: 100%;
					width: 100%;
					fill: rgba(0, 0, 0, 0.9);
				}
			`,
			
			css`
				#next-slide {
					right: 0;
				}
			`,
			
			css`
				#prev-slide {
					left: 0;
				}
			`,

			css`
				#live-region {
					position: absolute;
					clip: rect(0 0 0 0);
					border: 0;
					width: 1px;
					height: 1px;
					padding: 0;
					margin: -1px;
					overflow: hidden;
				}
			`,
			
			css`
				#seam {
					position: absolute;
					left: calc(
						var(--carousel-header-width, ${unsafeCSS(__carouselHeadingWidth)}) - 1px
					);
					top: 0;
					width: 2px;
					z-index: 10;
					height: 100%;
					overflow: hidden;
				}
			`,
			
			css`
				#seam::before {
					content: "";
					position: absolute;
					left: 0;
					top: 0;
					width: 2px;
					height: 2px;
					background-color: #fff;
					opacity: 0;
				}
			`,
			
			css`
				#seam.inactive::before {
					height: 100%;
					opacity: 0;
					color: #000;
					transition: opacity 0.1s, color 0.05s;
				}
			`,
			
			css`
				#seam.active::before {
					height: 100%;
					opacity: 1;
					transition: height 0.1s;
				}
			`
		];
	}

	/*
		Vanilla constructor. It is required by lit-element that we set the value of any properties
		exposed in the properties() method. However, what I've done here isn't best practice. I should
		be checking to see if the developer set any of these properties on the element's tag. 
		I got a little lazy at this point.
		
		See: https://developers.google.com/web/fundamentals/web-components/best-practices#dont-override
	*/
	constructor() {
		super();
		this.index = 0;
		this.__slides = [];
		this.__loaded = false;
		this.__animating = false;
		this.onTransitionEnd = this.onTransitionEnd.bind(this);
	}

	/* 
		This is a lifecycle method that is fired anytime the content of the slot changes. 
		I'm using it to do some initialization because there didn't seem to be a good place to handle init that
		fired early enough to be useful *and* had the slot contents. 
		connectedCallback() or firstUpdated() should have been better places handle this. 
		Unfortunately, slots aren't available at that point.
	*/
	onSlotChange() {
		let current,
			elIndex = 0;
		this.__slides = [];
		
		// renderRoot is the equavalent of 'document' in this shadow DOM. 
		// This little loop creates an array of objects to make cycling easier
		// and should run anytime the slot's content changes. 
		// 
		// Right or wrong, ths component follow the same basic construction that a
		// description list uses (dl > dt, dd). So I set the role of the 'x-carousel-heading'
		// to heading, giving it an ID along the way, which is used to label the content using
		// aria-labelledby -- now it should make sense to screenreaders (mostly).
		this.renderRoot
			.getElementById("slides")
			.assignedElements()
			.forEach(el => {
				let id = "xc-heading-" + elIndex;
				el.seen = this.index > elIndex;
				if (el.nodeName.toLowerCase() == "x-carousel-heading") {
					el.setAttribute("id", id);
					current = el;
				} else if (el.nodeName.toLowerCase() == "x-carousel-content") {
					el.setAttribute("aria-labelledby", id);
					this.__slides.push({
						heading: current,
						content: el
					});
					elIndex++;
				}
			});
		
		// This is pure initialization... and fairly hackish
		if (!this.__loaded) {
			this.__loaded = true;
			this.index = 0;
			this.updateIndex(this.index);
		}
		this.__animating = false;
	}

	/*
		Next Button click event handler
		I stopped playing with this example before adding directionality to the movement, 
		but this is likely where I would have handled that with a class on the slide-container.
	*/
	onNextClick(e) {
		let newIndex = this.index + 1;
		if (newIndex >= this.__slides.length) {
			newIndex = 0;
		}
		this.showSeam();
		this.updateIndex(newIndex);
	}
	
	/*
		Back Button click event handler.
		I stopped playing with this example before adding directionality to the movement, 
		but this is likely where I would have handled that with a class on the slide-container.
	*/
	onPrevClick(e) {
		let newIndex = this.index - 1;
		if (newIndex < 0) {
			newIndex = this.__slides.length - 1;
		}
		this.showSeam();
		this.updateIndex(newIndex);
	}

	
	/*
		Handles updating the index of the current slide and triggering all animations.
		TODO: wire the live region so this is even semi-accessible.
	*/
	updateIndex(newIndex) {
		this.__animating = true;
		let current = this.__slides[this.index];
		// current can be undefined on the first run, unless the developer set the index.
		if (current) {
			current.heading.addEventListener("transitionend", this.onTransitionEnd);
			current.content.addEventListener("transitionend", this.onTransitionEnd);
			current.heading.classList.add("out");
			current.heading.setAttribute("aria-hidden", "true");
			current.content.classList.add("out");
			current.content.setAttribute("aria-hidden", "true");
		}
		this.index = newIndex;
		current = this.__slides[this.index];
		current.heading.setAttribute("aria-hidden", "false");
		current.content.setAttribute("aria-hidden", "false");
	}
	
	
	/*
		Slide header/content transition end event removes the event itself, and 
		resets the position of the slide. 
	*/
	onTransitionEnd(event) {
		event.target.classList.remove("out");
		event.target.removeEventListener("transitionend", this.onTransitionEnd);
		this.__animating = false;
		this.renderRoot.getElementById("seam").classList.remove("active");
		this.renderRoot.getElementById("seam").classList.add("inactive");
	}

	/*
		Shockingly, this method shows the seam animation. 
	*/
	showSeam() {
		let seam = this.renderRoot.getElementById("seam");
		seam.addEventListener("transitionend", this.onSeamTransitionEnd);
		seam.classList.add("active");
	}
	
	/*
		Removes the animations from the seam and resets it. 
		I had bigger plans for the animation here, but decided to let it wait for another experiment. 
	*/
	onSeamTransitionEnd(event) {
		event.target.classList.remove("inactive");
		event.target.removeEventListener("transitionend", this.onSeamTransitionEnd);
	}

	/*
		lit-element's render method. If you're familiar with ReactJS, this is pretty familiar.
		
		However, lit-element uses template literals rather than JSX. Note the '@' before an event, 
		the '?' before a boolean property. Also note that the inline SVG content has it's own 
		tag 'svg'. Other than that it's pretty simple stuff.
		
		The other cool thing to note is the <slot> element, which is similar to {props.children} in 
		React, only you can't iterate over it in the render method. 
	*/
	render() {
		return html`
		  	<div id="slides-container" role="list">
		  		<div id="seam" role="presentation"></div>
		  		<slot id="slides" @slotchange="${this.onSlotChange}"></slot>
		  	</div>
		  	<button id="prev-slide" ?disabled="${
						this.__animating
					}" type="button" @click="${
			this.onPrevClick
		}" aria-label="Next Slide">${svg`<svg viewBox="0 0 24 24"><path d="M15.42 7.4l-4.6 4.6 4.6 4.6-1.4 1.4-6-6 6-6z"/></svg>`}</button>
		  	<button id="next-slide" ?disabled="${
						this.__animating
					}" type="button" @click="${
			this.onNextClick
		}" aria-label="Prev Slide">${svg`<svg viewBox="0 0 24 24"><path d="M9.98 6l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6z"/></svg>`}</button>
		  	<div id="live-region" aria-live="polite" aria-atomic="true"></div>
		`;
	}
}


/* ***********************************************************
	***********************************************************
	
	CrossCarouselHeading Custom Element
	@tag x-carousel-heading
	
	This is basically a very thin host for the heading content. 
	I believe there are simpler patterns now that I've had a chance to play
	with the code a bit. Next revision won't use this.
	
	***********************************************************
   *********************************************************** */
class CrossCarouselHeading extends LitElement {
	
	/*
		Styles scoped to this element
	*/
	static get styles() {
		return [
			css`
				:host,
				*,
				*::before,
				*::after {
					box-sizing: border-box;
				}
			`,
			
			/*
				Again, using --carousel-header-width to set the width.
				If it's set on the carousel, it's set here. Cool, huh?
			*/
			css`
				:host {
					position: absolute;
					contain: content;
					box-sizing: border-box;
					display: block;
					top: 0;
					left: 0;
					width: var(--carousel-header-width, ${unsafeCSS(__carouselHeadingWidth)});
					height: 100%;
					padding: 2rem;
					background-color: #9a9a9a;
					color: #000;
				}
			`,

			/*
				I like using attributes over classes for things like this.
				SR visibility is handled for me. 
			*/
			css`
				:host([aria-hidden="false"]) {
					transition: transform 0.3s 0.1s;
					transform: translate(0, 0);
				}
			`,

			//language=CSS
			css`
				:host([aria-hidden="true"]) {
					transform: translate(0, 100%);
				}
			`,

			//language=CSS
			css`
				:host([aria-hidden="true"].out) {
					transform: translate(0, -100%);
					transition: transform 0.3s 0.101s, opacity 0.001s.3s;
				}
			`
		];
	}

	/*
		Not that I'm exposing aria-level on the heading so that the
		parent component can set it easily and it's bound to the template code.
		
	*/
	static get properties() {
		return {
			role: { type: String, reflect: true },
			"aria-level": { type: Number, reflect: true },
			"aria-hidden": { type: String, reflect: true }
		};
	}

	/*
		Vanilla constructor.
	*/
	constructor() {
		super();
		this.seen = false;
		this.role = "heading";
		this["aria-level"] = 3;
		this["aria-hidden"] = "true";
	}

	/*
		This component is just a set of styles and behavior wrapping a slot. 
		Afer finishing this component, I would probably drop this element alltogether
		and use a semantic tag (like a heading) instead. I initially used the custom element
		because I envisioned more complex content here. Simple was better.
	*/
	render() {
		//language=HTML
		return html`
			<slot></slot>
		`;
	}
}

/* ***********************************************************
	***********************************************************
	
	CrossCarouselContent Custom Element
	@tag x-carousel-content
	
	This is basically a very thin host for the slide content. 
	I believe there are simpler patterns now that I've had a chance to play
	with the code a bit. Next revision won't use this.
	
	***********************************************************
   *********************************************************** */
class CrossCarouselContent extends LitElement {
	/*
		SSDD
	*/
	static get styles() {
		return [
			
			css`
				:host,
				:host *,
				:host *::before,
				*::after {
					box-sizing: border-box;
				}
			`,
			
			/*
				The content is moved left by --carousel-header-width and it's width calculated.
				I ended up having to add 1px to the width to get rid of a seam on the right side.
				In the end, it doesn't hurt anything.
			*/
			css`
				:host {
					position: absolute;
					contain: content;
					box-sizing: border-box;
					display: block;
					top: 0;
					left: var(--carousel-header-width, ${unsafeCSS(__carouselHeadingWidth)});
					width: calc(
						1px + 100% -
							var(--carousel-header-width, ${unsafeCSS(__carouselHeadingWidth)})
					);
					height: 100%;
					background-color: #ccc;
					color: #000;
					padding: 2rem;
				}
			`,
			
			css`
				:host([aria-hidden="false"]) {
					transition: transform 0.3s 0.1s;
					transform: translate(0, 0);
				}
			`,

			css`
				:host([aria-hidden="true"]) {
					transform: translate(0, -100%);
				}
			`,

			css`
				:host([aria-hidden="true"].out) {
					transform: translate(0, 100%);
					transition: transform 0.3s 0.101s, opacity 0.001s.3s;
				}
			`
		];
	}

	static get properties() {
		return {
			seen: { type: Number },
			"aria-hidden": { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.seen = false;
		this["aria-hidden"] = "true";
	}

	/*
		This component is just a set of styles and behavior wrapping a slot. 
		Afer finishing this component, I would probably drop this element alltogether
		and use a semantic tag (like a heading) instead. I initially used the custom element
		because I envisioned more complex content here. Simple was better.
	*/
	render() {
		//language=HTML
		return html`
			<slot></slot>
		`;
	}
}

// Register the new elements with the browser.
customElements.define("x-carousel", CrossCarousel);
customElements.define("x-carousel-heading", CrossCarouselHeading);
customElements.define("x-carousel-content", CrossCarouselContent);
