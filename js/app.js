class MainPage {
  /** Internal state for tracking selected nav DOM elts */
  _nav1
  _nav2

  /** Internal state for tracking DOM elements */
  bodyElt
  navElt
  sectionElt

  constructor() {
    // register body container
    this.bodyElt = document.querySelector('body')

    // register navigation
    this.navElt = document.querySelector('nav')

    // add navigation event listeners
    let navItems = this.navElt.querySelectorAll('li')
    navItems.forEach((item) => {
      item.addEventListener('click', this.handleNavClick.bind(this))
    })

    let closeButton = document.querySelector('button.section-close')
    if (closeButton) {
      closeButton.addEventListener('click', this.closeSection.bind(this) )
    }

    // Initialize accordions
    initAccordions()    
  }

  get nav1() { return this._nav1 }
  set nav1( elt ) {
    // Only operate on nav items at data-level 1
    if (elt.dataset.level !== '1') return

    const nulling = elt === this._nav1

    // Deselect the current nav, children, and current section
    if (this._nav1) this._nav1.classList.remove('sel')
    this.nav2 = null
    this.bodyElt.dataset.section = ''
    if (this.sectionElt) this.sectionElt.classList.remove('sel')

    // Select the new nav item
    this._nav1 = nulling ? null : elt
    if (!nulling) this._nav1.classList.add('sel')
    
    // Update the level in the nav element
    this.navElt.dataset.level = nulling ? '0' : '1'
  }

  get nav2() { return this._nav2 }
  set nav2( elt ) {
    const nulling = elt === null || elt === this._nav2

    // remove any currently selected nav item
    if (this._nav2) this._nav2.classList.remove('sel')
    
    // select the new nav item
    this._nav2 = nulling ? null : elt
    if (!nulling) elt.classList.add('sel')

    this._nav2 = nulling ? null : elt
    
    // Update the level in the nav element
    this.navElt.dataset.level = nulling ? '1' : '2'

    // Update the current section
    this.bodyElt.dataset.section = nulling ? '' : elt.dataset.section
    if (this.sectionElt) this.sectionElt.classList.remove('sel')

    if (nulling) {
      this.sectionElt = null
    } else {
      this.sectionElt = document.querySelector(`section[data-section="${elt.dataset.section}"]`)
      this.sectionElt.classList.add('sel')
    }
  }

  // Closes the currently open section
  closeSection() {
    if (this.nav2) this.nav2 = null
  }

  handleNavClick(e) {
    // Prevent the clicking of a sub-nav from bubbling up to the parent nav
    e.stopPropagation()

    let newNav = e.target

    if (newNav.dataset.level === '1') this.nav1 = newNav
    if (newNav.dataset.level === '2') this.nav2 = newNav
  }

}

const initAccordions = () => {
  const details = document.querySelectorAll('details')

  let accordions = []

  const closeOtherAccordions = (opening) => {
    // no need to close other accordions if we are closing one already open
    if (!opening) return

    accordions.forEach( accordion => {
      if (accordion !== this) {
        console.log('got here')
        accordion.shrink()
      }
    })
  }

  details.forEach( accordion => {
    accordions.push( new Accordion(accordion, closeOtherAccordions) )
  })
}

// Modified from https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
class Accordion {
  duration = 200;

  constructor(el, callback) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('summary + *');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));

    this.callback = callback.bind(this)
  }

  get isOpen() {
    return this.el.open
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      this.callback('open')
    // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
      this.callback();
    }
  }

  shrink() {
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';

    // Set the element as "being closed"
    this.isClosing = true;
    
    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;
    
    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }
    
    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: this.duration,
      easing: 'ease-out'
    });
    
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';

    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
    
    console.log(startHeight, endHeight)

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }
    
    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: this.duration,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}